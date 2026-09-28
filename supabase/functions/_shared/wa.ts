import { createClient } from "npm:@supabase/supabase-js@2";

export const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-painel-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// deno-lint-ignore no-explicit-any
export type Conexao = Record<string, any>;

const base = (s: string) => s.replace(/\/+$/, "");

export async function evo(c: Conexao, path: string, init?: RequestInit) {
  const res = await fetch(base(c.servidor) + path, {
    ...init,
    headers: { "Content-Type": "application/json", apikey: c.api_key },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.response?.message?.[0] || body?.message || `Evolution ${res.status}`);
  return body;
}

export async function graph(c: Conexao, path: string, init?: RequestInit) {
  const res = await fetch(`https://graph.facebook.com/${c.versao || "v21.0"}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${c.token}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message || `Meta ${res.status}`);
  return body;
}

/** Busca/cria a conversa e grava a mensagem, atualizando o resumo da conversa. */
export async function registrarMensagem(p: {
  conexaoId: string; numero: string; nome?: string | null; direcao: "entrada" | "saida";
  texto: string; tipo?: string; waId?: string | null; erro?: string | null;
}) {
  // A Meta/Evolution podem reenviar o mesmo evento: ignora duplicadas
  if (p.waId) {
    const { data: dup } = await db.from("wa_mensagens").select("id").eq("wa_id", p.waId).maybeSingle();
    if (dup) return { conversaId: null, msg: null };
  }

  const { data: existente } = await db.from("wa_conversas").select("id, nao_lidas")
    .eq("conexao_id", p.conexaoId).eq("numero", p.numero).maybeSingle();

  let conversaId = existente?.id;
  const resumo = {
    ultima_mensagem: p.texto, ultima_em: new Date().toISOString(),
    ...(p.nome ? { nome: p.nome } : {}),
    ...(p.direcao === "entrada" ? { nao_lidas: (existente?.nao_lidas || 0) + 1, status: "aberto" } : {}),
  };
  if (conversaId) {
    await db.from("wa_conversas").update(resumo).eq("id", conversaId);
  } else {
    const { data, error } = await db.from("wa_conversas")
      .insert({ conexao_id: p.conexaoId, numero: p.numero, ...resumo }).select("id").single();
    if (error) throw error;
    conversaId = data.id;
  }

  const { data: msg, error } = await db.from("wa_mensagens").insert({
    conversa_id: conversaId, direcao: p.direcao, texto: p.texto, tipo: p.tipo || "text",
    wa_id: p.waId || null, erro: p.erro || null, status: p.erro ? "erro" : p.direcao === "saida" ? "enviada" : "recebida",
  }).select().single();
  if (error) throw error;
  return { conversaId, msg };
}
