// Cliente do backend do chat (Supabase Edge Function "wa-api").
// Os tokens do WhatsApp ficam só no Supabase; o navegador guarda apenas a chave do painel.

export type TipoConexao = "qrcode" | "oficial";
export type StatusConexao = "desconectado" | "aguardando_qr" | "conectado";

export interface Conexao {
  id: string;
  tipo: TipoConexao;
  nome: string;
  status: StatusConexao;
  servidor?: string;
  instancia?: string;
  phone_number_id?: string;
  waba_id?: string;
  verify_token?: string;
  versao?: string;
}

export interface Conversa {
  id: string;
  conexao_id: string | null;
  numero: string;
  nome: string | null;
  status: "aberto" | "pendente" | "resolvido";
  nao_lidas: number;
  ultima_mensagem: string | null;
  ultima_em: string;
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  direcao: "entrada" | "saida";
  texto: string | null;
  status: string | null;
  erro: string | null;
  criado_em: string;
}

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, "") || "";
export const WEBHOOK_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/wa-webhook` : "";

const CHAVE_STORAGE = "gestaon.painelKey";

export function lerChave(): string {
  try { return localStorage.getItem(CHAVE_STORAGE) || ""; } catch { return ""; }
}

export function salvarChave(k: string) {
  try { localStorage.setItem(CHAVE_STORAGE, k); } catch { /* armazenamento indisponível */ }
}

export async function api<T = any>(acao: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!SUPABASE_URL) throw new Error("VITE_SUPABASE_URL não configurado no .env");
  const res = await fetch(`${SUPABASE_URL}/functions/v1/wa-api`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-painel-key": lerChave() },
    body: JSON.stringify({ acao, ...params }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.erro || `Erro ${res.status}`);
  return body as T;
}

export const qrSrc = (qr: string) => (qr.startsWith("data:") ? qr : `data:image/png;base64,${qr}`);
