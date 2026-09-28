// Recebe eventos do WhatsApp.
//  - API oficial (Meta): GET = verificação do webhook, POST = mensagens/status.
//    URL: https://<projeto>.supabase.co/functions/v1/wa-webhook
//  - QR Code (Evolution API): POST com ?conexao=<id>&token=<api_key da conexão>
// Deploy com verify_jwt = false (Meta e Evolution não mandam JWT).
import { cors, db, json, registrarMensagem } from "../_shared/wa.ts";

function textoMeta(m: any): string {
  switch (m.type) {
    case "text": return m.text?.body ?? "";
    case "button": return m.button?.text ?? "";
    case "interactive": return m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title ?? "[interativo]";
    case "image": return m.image?.caption ? `📷 ${m.image.caption}` : "📷 Imagem";
    case "audio": return "🎤 Áudio";
    case "video": return "🎬 Vídeo";
    case "document": return `📄 ${m.document?.filename ?? "Documento"}`;
    case "location": return "📍 Localização";
    case "sticker": return "Figurinha";
    default: return `[${m.type}]`;
  }
}

function textoEvolution(msg: any): string {
  return msg?.conversation ?? msg?.extendedTextMessage?.text ?? msg?.imageMessage?.caption ??
    (msg?.imageMessage ? "📷 Imagem" : msg?.audioMessage ? "🎤 Áudio" : msg?.videoMessage ? "🎬 Vídeo" :
      msg?.documentMessage ? `📄 ${msg.documentMessage.fileName ?? "Documento"}` : "[mensagem]");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);

  // Verificação do webhook da Meta
  if (req.method === "GET") {
    const token = url.searchParams.get("hub.verify_token");
    const { data } = await db.from("wa_conexoes").select("id").eq("tipo", "oficial").eq("verify_token", token ?? "").limit(1);
    if (url.searchParams.get("hub.mode") === "subscribe" && data?.length) {
      return new Response(url.searchParams.get("hub.challenge") ?? "", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return json({ ok: false }, 400);

  try {
    // ---------- Evolution API (QR Code) ----------
    const conexaoParam = url.searchParams.get("conexao");
    if (conexaoParam) {
      const { data: c } = await db.from("wa_conexoes").select("*").eq("id", conexaoParam).maybeSingle();
      if (!c || url.searchParams.get("token") !== c.api_key) return json({ ok: false }, 403);

      const evento = String(body.event || "").toLowerCase().replace(/_/g, ".");
      if (evento === "connection.update") {
        const st = body.data?.state === "open" ? "conectado" : body.data?.state === "connecting" ? "aguardando_qr" : "desconectado";
        await db.from("wa_conexoes").update({ status: st }).eq("id", c.id);
      }
      if (evento === "messages.upsert") {
        const d = body.data;
        const jid: string = d?.key?.remoteJid ?? "";
        if (jid.endsWith("@s.whatsapp.net")) { // ignora grupos e status
          await registrarMensagem({
            conexaoId: c.id, numero: jid.split("@")[0], nome: d.key.fromMe ? null : d.pushName,
            direcao: d.key.fromMe ? "saida" : "entrada", texto: textoEvolution(d.message),
            tipo: d.messageType, waId: d.key.id,
          });
        }
      }
      return json({ ok: true });
    }

    // ---------- Cloud API (Meta) ----------
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const v = change.value ?? {};
        const phoneId = v.metadata?.phone_number_id;
        const { data: c } = await db.from("wa_conexoes").select("id").eq("phone_number_id", phoneId).maybeSingle();
        if (!c) continue;
        const nomes = Object.fromEntries((v.contacts ?? []).map((k: any) => [k.wa_id, k.profile?.name]));
        for (const m of v.messages ?? []) {
          await registrarMensagem({
            conexaoId: c.id, numero: m.from, nome: nomes[m.from], direcao: "entrada",
            texto: textoMeta(m), tipo: m.type, waId: m.id,
          });
        }
        for (const s of v.statuses ?? []) {
          await db.from("wa_mensagens").update({
            status: s.status, erro: s.errors?.[0]?.title ?? s.errors?.[0]?.message ?? null,
          }).eq("wa_id", s.id);
        }
      }
    }
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    // Responde 200 para a Meta não ficar reenviando indefinidamente
    return json({ ok: false, erro: String(e) });
  }
});
