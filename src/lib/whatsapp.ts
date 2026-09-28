// Camada de integração com WhatsApp.
// - "qrcode": WhatsApp Business (app) conectado via QR Code através de um gateway
//   compatível com a Evolution API (https://doc.evolution-api.com).
// - "oficial": WhatsApp Cloud API oficial da Meta (graph.facebook.com).

export type TipoConexao = "qrcode" | "oficial";

export interface ConexaoQR {
  id: string;
  tipo: "qrcode";
  nome: string;
  servidor: string; // ex: https://evolution.seudominio.com
  apiKey: string;
  instancia: string;
  status: "desconectado" | "aguardando_qr" | "conectado";
}

export interface ConexaoOficial {
  id: string;
  tipo: "oficial";
  nome: string;
  phoneNumberId: string;
  wabaId: string;
  token: string;
  verifyToken: string;
  versao: string; // ex: v21.0
  status: "desconectado" | "conectado";
}

export type Conexao = ConexaoQR | ConexaoOficial;

const STORAGE_KEY = "gestaon.whatsapp.conexoes";

export function carregarConexoes(): Conexao[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function salvarConexoes(conexoes: Conexao[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conexoes));
  } catch {
    /* armazenamento indisponível */
  }
}

function url(base: string, path: string) {
  return base.replace(/\/+$/, "") + path;
}

// ---------- QR Code (Evolution API) ----------

async function evo(c: ConexaoQR, path: string, init?: RequestInit) {
  const res = await fetch(url(c.servidor, path), {
    ...init,
    headers: { "Content-Type": "application/json", apikey: c.apiKey, ...(init?.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.response?.message?.[0] || body?.message || `Erro ${res.status}`);
  return body;
}

/** Cria a instância (se ainda não existir) e retorna o QR Code em base64. */
export async function gerarQRCode(c: ConexaoQR): Promise<string | null> {
  try {
    await evo(c, "/instance/create", {
      method: "POST",
      body: JSON.stringify({ instanceName: c.instancia, qrcode: true, integration: "WHATSAPP-BAILEYS" }),
    });
  } catch {
    /* instância provavelmente já existe */
  }
  const r = await evo(c, `/instance/connect/${encodeURIComponent(c.instancia)}`);
  return r?.base64 || r?.qrcode?.base64 || null;
}

export async function estadoQR(c: ConexaoQR): Promise<"conectado" | "desconectado"> {
  const r = await evo(c, `/instance/connectionState/${encodeURIComponent(c.instancia)}`);
  return r?.instance?.state === "open" ? "conectado" : "desconectado";
}

export async function desconectarQR(c: ConexaoQR) {
  await evo(c, `/instance/logout/${encodeURIComponent(c.instancia)}`, { method: "DELETE" });
}

// ---------- API Oficial (Cloud API) ----------

async function graph(c: ConexaoOficial, path: string, init?: RequestInit) {
  const res = await fetch(`https://graph.facebook.com/${c.versao || "v21.0"}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${c.token}`, ...(init?.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message || `Erro ${res.status}`);
  return body;
}

/** Valida as credenciais consultando o número de telefone. */
export async function testarOficial(c: ConexaoOficial) {
  return graph(c, `/${c.phoneNumberId}?fields=display_phone_number,verified_name,quality_rating`);
}

// ---------- Envio unificado ----------

export async function enviarTexto(c: Conexao, para: string, texto: string) {
  const numero = para.replace(/\D/g, "");
  if (c.tipo === "qrcode") {
    return evo(c, `/message/sendText/${encodeURIComponent(c.instancia)}`, {
      method: "POST",
      body: JSON.stringify({ number: numero, text: texto }),
    });
  }
  return graph(c, `/${c.phoneNumberId}/messages`, {
    method: "POST",
    body: JSON.stringify({ messaging_product: "whatsapp", to: numero, type: "text", text: { body: texto } }),
  });
}
