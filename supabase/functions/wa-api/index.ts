// API do painel de atendimento. Protegida pelo header x-painel-key (secret PAINEL_KEY).
// Deploy com verify_jwt = false (a autenticação é a chave do painel).
import { Conexao, cors, db, evo, graph, json, registrarMensagem } from "../_shared/wa.ts";

const CAMPOS_PUBLICOS = "id, tipo, nome, status, servidor, instancia, phone_number_id, waba_id, verify_token, versao, criado_em";
const WEBHOOK = `${Deno.env.get("SUPABASE_URL")}/functions/v1/wa-webhook`;

async function conexao(id: string): Promise<Conexao> {
  const { data, error } = await db.from("wa_conexoes").select("*").eq("id", id).single();
  if (error) throw new Error("Conexão não encontrada");
  return data;
}

const setStatus = (id: string, status: string) => db.from("wa_conexoes").update({ status }).eq("id", id);

async function conectar(c: Conexao) {
  if (c.tipo === "oficial") {
    const r = await graph(c, `/${c.phone_number_id}?fields=display_phone_number,verified_name,quality_rating`);
    await setStatus(c.id, "conectado");
    return { status: "conectado", info: r };
  }
  const webhook = {
    enabled: true, url: `${WEBHOOK}?conexao=${c.id}&token=${encodeURIComponent(c.api_key)}`,
    byEvents: false, base64: false, events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
  };
  try {
    await evo(c, "/instance/create", {
      method: "POST",
      body: JSON.stringify({ instanceName: c.instancia, qrcode: true, integration: "WHATSAPP-BAILEYS", webhook }),
    });
  } catch { /* instância já existe */ }
  await evo(c, `/webhook/set/${encodeURIComponent(c.instancia)}`, { method: "POST", body: JSON.stringify({ webhook }) })
    .catch(() => {});
  const r = await evo(c, `/instance/connect/${encodeURIComponent(c.instancia)}`);
  const qr = r?.base64 || r?.qrcode?.base64 || null;
  const status = qr ? "aguardando_qr" : "conectado";
  await setStatus(c.id, status);
  return { status, qr };
}

async function enviar(conversaId: string, texto: string) {
  const { data: conv, error } = await db.from("wa_conversas").select("*").eq("id", conversaId).single();
  if (error || !conv?.conexao_id) throw new Error("Conversa sem conexão");
  const c = await conexao(conv.conexao_id);
  let waId: string | null = null, erro: string | null = null;
  try {
    if (c.tipo === "qrcode") {
      const r = await evo(c, `/message/sendText/${encodeURIComponent(c.instancia)}`, {
        method: "POST", body: JSON.stringify({ number: conv.numero, text: texto }),
      });
      waId = r?.key?.id ?? null;
    } else {
      const r = await graph(c, `/${c.phone_number_id}/messages`, {
        method: "POST",
        body: JSON.stringify({ messaging_product: "whatsapp", to: conv.numero, type: "text", text: { body: texto } }),
      });
      waId = r?.messages?.[0]?.id ?? null;
    }
  } catch (e) {
    erro = (e as Error).message;
  }
  const { msg } = await registrarMensagem({ conexaoId: c.id, numero: conv.numero, direcao: "saida", texto, waId, erro });
  return msg;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const chave = Deno.env.get("PAINEL_KEY");
  if (!chave || req.headers.get("x-painel-key") !== chave) return json({ erro: "Chave do painel inválida" }, 401);

  const { acao, ...p } = await req.json().catch(() => ({}));
  try {
    switch (acao) {
      case "conexoes": {
        const { data } = await db.from("wa_conexoes").select(CAMPOS_PUBLICOS).order("criado_em");
        return json(data ?? []);
      }
      case "criar_conexao": {
        const campos = p.tipo === "qrcode"
          ? { tipo: "qrcode", nome: p.nome, servidor: p.servidor, api_key: p.api_key, instancia: p.instancia }
          : { tipo: "oficial", nome: p.nome, phone_number_id: p.phone_number_id, waba_id: p.waba_id,
              token: p.token, verify_token: p.verify_token || crypto.randomUUID(), versao: p.versao || "v21.0" };
        const { data, error } = await db.from("wa_conexoes").insert(campos).select("*").single();
        if (error) throw error;
        return json({ id: data.id, ...(await conectar(data)) });
      }
      case "conectar":
        return json(await conectar(await conexao(p.id)));
      case "estado": {
        const c = await conexao(p.id);
        if (c.tipo === "oficial") return json({ status: c.status });
        const r = await evo(c, `/instance/connectionState/${encodeURIComponent(c.instancia)}`);
        const status = r?.instance?.state === "open" ? "conectado" : c.status === "aguardando_qr" ? "aguardando_qr" : "desconectado";
        await setStatus(c.id, status);
        return json({ status });
      }
      case "desconectar": {
        const c = await conexao(p.id);
        if (c.tipo === "qrcode") {
          await evo(c, `/instance/logout/${encodeURIComponent(c.instancia)}`, { method: "DELETE" }).catch(() => {});
        }
        await setStatus(c.id, "desconectado");
        return json({ status: "desconectado" });
      }
      case "remover_conexao":
        await db.from("wa_conexoes").delete().eq("id", p.id);
        return json({ ok: true });

      case "conversas": {
        const { data } = await db.from("wa_conversas").select("*").order("ultima_em", { ascending: false }).limit(200);
        return json(data ?? []);
      }
      case "mensagens": {
        const { data } = await db.from("wa_mensagens").select("*").eq("conversa_id", p.conversa_id)
          .order("criado_em").limit(500);
        await db.from("wa_conversas").update({ nao_lidas: 0 }).eq("id", p.conversa_id);
        return json(data ?? []);
      }
      case "iniciar_conversa": {
        const numero = String(p.numero || "").replace(/\D/g, "");
        if (!numero || !p.conexao_id) throw new Error("Informe número e conexão");
        const { data, error } = await db.from("wa_conversas")
          .upsert({ conexao_id: p.conexao_id, numero }, { onConflict: "conexao_id,numero" }).select().single();
        if (error) throw error;
        return json(data);
      }
      case "atualizar_conversa": {
        const campos: Record<string, unknown> = {};
        if (p.status) campos.status = p.status;
        if (p.nome !== undefined) campos.nome = p.nome;
        const { data } = await db.from("wa_conversas").update(campos).eq("id", p.id).select().single();
        return json(data);
      }
      case "enviar":
        return json(await enviar(p.conversa_id, String(p.texto || "")));

      default:
        return json({ erro: "Ação desconhecida" }, 400);
    }
  } catch (e) {
    return json({ erro: (e as Error).message }, 400);
  }
});
