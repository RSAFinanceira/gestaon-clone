import { useEffect, useState } from "react";
import {
  Conexao, ConexaoOficial, ConexaoQR, carregarConexoes, salvarConexoes,
  gerarQRCode, estadoQR, desconectarQR, testarOficial, enviarTexto,
} from "../lib/whatsapp";

type Msg = { de: "eu" | "outro"; texto: string; hora: string; erro?: string };
type Conversa = { nome: string; numero: string; conexaoId: string | null; status: "aberto" | "pendente" | "resolvido" };

const conversasIniciais: Conversa[] = [
  { nome: "Teste Usuario", numero: "5511999999999", conexaoId: null, status: "aberto" },
];

const mensagensIniciais: Record<string, Msg[]> = {
  "5511999999999": [{ de: "outro", texto: "oi", hora: "03:14" }],
};

const agora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const novoId = () => Math.random().toString(36).slice(2, 10);

export default function ChatWA() {
  const [aba, setAba] = useState<"chat" | "conexoes">("chat");
  const [conexoes, setConexoes] = useState<Conexao[]>(carregarConexoes);
  const [conversas, setConversas] = useState(conversasIniciais);
  const [sel, setSel] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [msgs, setMsgs] = useState(mensagensIniciais);
  const [busca, setBusca] = useState("");
  const [novoNumero, setNovoNumero] = useState("");

  useEffect(() => salvarConexoes(conexoes), [conexoes]);

  const conectadas = conexoes.filter(c => c.status === "conectado");
  const conversa = conversas.find(c => c.numero === sel) || null;

  function atualizarConexao(id: string, patch: Partial<Conexao>) {
    setConexoes(prev => prev.map(c => (c.id === id ? ({ ...c, ...patch } as Conexao) : c)));
  }

  async function enviar() {
    if (!mensagem.trim() || !conversa) return;
    const texto = mensagem;
    setMensagem("");
    const nova: Msg = { de: "eu", texto, hora: agora() };
    const conexao = conexoes.find(c => c.id === conversa.conexaoId) || conectadas[0];
    try {
      if (!conexao) throw new Error("Nenhuma conexão ativa");
      await enviarTexto(conexao, conversa.numero, texto);
    } catch (e) {
      nova.erro = (e as Error).message;
    }
    setMsgs(prev => ({ ...prev, [conversa.numero]: [...(prev[conversa.numero] || []), nova] }));
  }

  function iniciarConversa() {
    const numero = novoNumero.replace(/\D/g, "");
    if (!numero) return;
    if (!conversas.some(c => c.numero === numero)) {
      setConversas(prev => [{ nome: "+" + numero, numero, conexaoId: conectadas[0]?.id || null, status: "aberto" }, ...prev]);
    }
    setSel(numero);
    setNovoNumero("");
  }

  const filtradas = conversas.filter(c => (c.nome + c.numero).toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={titulo}>Chat de Atendimento</h1>
        <div style={{ display: "flex", gap: 4, marginLeft: 12 }}>
          {([["chat", "💬 Atendimento"], ["conexoes", `🔌 Conexões (${conectadas.length}/${conexoes.length})`]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setAba(k)} style={{
              padding: "6px 14px", border: "none", borderRadius: 20, cursor: "pointer", fontSize: 12,
              background: aba === k ? "#22c55e" : "#141414", color: aba === k ? "#000" : "#aaa",
              fontWeight: aba === k ? 700 : 400, outline: "1px solid #1e1e1e",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {aba === "conexoes" ? (
        <Conexoes conexoes={conexoes} setConexoes={setConexoes} atualizar={atualizarConexao} />
      ) : (
        <div style={{ display: "flex", height: "calc(100vh - 120px)", border: "1px solid #1e1e1e", borderRadius: 12, overflow: "hidden" }}>
          {/* Lista de conversas */}
          <div style={{ width: 280, borderRight: "1px solid #1e1e1e", background: "#111", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Conversas</span>
              <button onClick={() => setAba("conexoes")} title="Conexões" style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16 }}>⚙</button>
            </div>
            <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar..." style={inputSm} />
              <div style={{ display: "flex", gap: 6 }}>
                <input value={novoNumero} onChange={e => setNovoNumero(e.target.value)} onKeyDown={e => e.key === "Enter" && iniciarConversa()} placeholder="Novo: 55DDD9..." style={inputSm} />
                <button onClick={iniciarConversa} style={{ ...btnGreen, padding: "0 10px" }}>+</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtradas.map(c => {
                const ult = (msgs[c.numero] || []).slice(-1)[0];
                return (
                  <div key={c.numero} onClick={() => setSel(c.numero)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer",
                    background: sel === c.numero ? "rgba(34,197,94,0.1)" : "transparent",
                    borderLeft: sel === c.numero ? "3px solid #22c55e" : "3px solid transparent",
                  }}>
                    <div style={avatar}>{c.nome.replace("+", "")[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.nome}</span>
                        <span style={{ fontSize: 11, color: "#555" }}>{ult?.hora}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ult?.texto}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Área de chat */}
          {conversa ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0d0d0d" }}>
              <div style={{ padding: "10px 20px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 10, background: "#111" }}>
                <div style={avatar}>{conversa.nome.replace("+", "")[0]}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{conversa.nome}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>+{conversa.numero}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  <select
                    value={conversa.conexaoId || ""}
                    onChange={e => setConversas(prev => prev.map(c => c.numero === conversa.numero ? { ...c, conexaoId: e.target.value || null } : c))}
                    style={selectSm}
                  >
                    <option value="">Enviar por: automático</option>
                    {conexoes.map(c => (
                      <option key={c.id} value={c.id}>{c.tipo === "qrcode" ? "📱" : "✅"} {c.nome}{c.status !== "conectado" ? " (offline)" : ""}</option>
                    ))}
                  </select>
                  <select
                    value={conversa.status}
                    onChange={e => setConversas(prev => prev.map(c => c.numero === conversa.numero ? { ...c, status: e.target.value as Conversa["status"] } : c))}
                    style={selectSm}
                  >
                    <option value="aberto">🟢 Aberto</option>
                    <option value="pendente">🟡 Pendente</option>
                    <option value="resolvido">✔ Resolvido</option>
                  </select>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {(msgs[conversa.numero] || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.de === "eu" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "60%", padding: "8px 14px", borderRadius: m.de === "eu" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: m.erro ? "#7f1d1d" : m.de === "eu" ? "#22c55e" : "#1e1e1e",
                      color: m.de === "eu" && !m.erro ? "#000" : "#fff", fontSize: 13,
                    }}>
                      {m.texto}
                      {m.erro && <div style={{ fontSize: 10, color: "#fca5a5", marginTop: 4 }}>⚠ {m.erro}</div>}
                      <div style={{ fontSize: 10, color: m.de === "eu" && !m.erro ? "#00000066" : "#555", marginTop: 4, textAlign: "right" }}>{m.hora}</div>
                    </div>
                  </div>
                ))}
              </div>

              {conectadas.length === 0 && (
                <div style={{ padding: "6px 16px", fontSize: 12, color: "#f59e0b", background: "#f59e0b11" }}>
                  Nenhum número conectado. <a onClick={() => setAba("conexoes")} style={{ color: "#22c55e", cursor: "pointer" }}>Conectar agora →</a>
                </div>
              )}
              <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e1e", display: "flex", gap: 8, background: "#111" }}>
                <input
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && enviar()}
                  placeholder="Digite uma mensagem..."
                  style={{ flex: 1, padding: "9px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 24, color: "#fff", fontSize: 13, outline: "none" }}
                />
                <button onClick={enviar} style={{ width: 40, height: 40, background: "#22c55e", border: "none", borderRadius: "50%", color: "#000", fontSize: 16, cursor: "pointer" }}>↑</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0d0d0d", gap: 12 }}>
              <div style={{ fontSize: 40 }}>💬</div>
              <p style={{ fontSize: 14, color: "#555" }}>Selecione uma conversa</p>
              <a onClick={() => setAba("conexoes")} style={{ color: "#22c55e", fontSize: 13, cursor: "pointer" }}>Configure um número →</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ================= Conexões =================

function Conexoes({ conexoes, setConexoes, atualizar }: {
  conexoes: Conexao[];
  setConexoes: React.Dispatch<React.SetStateAction<Conexao[]>>;
  atualizar: (id: string, patch: Partial<Conexao>) => void;
}) {
  const [qr, setQr] = useState<ConexaoQR>({ id: "", tipo: "qrcode", nome: "", servidor: "", apiKey: "", instancia: "", status: "desconectado" });
  const [of, setOf] = useState<ConexaoOficial>({ id: "", tipo: "oficial", nome: "", phoneNumberId: "", wabaId: "", token: "", verifyToken: novoId(), versao: "v21.0", status: "desconectado" });
  const [qrImg, setQrImg] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<Record<string, string>>({});

  // Consulta periodicamente o status das conexões aguardando leitura do QR
  useEffect(() => {
    const pendentes = conexoes.filter((c): c is ConexaoQR => c.tipo === "qrcode" && c.status === "aguardando_qr");
    if (!pendentes.length) return;
    const t = setInterval(() => {
      pendentes.forEach(async c => {
        try {
          if ((await estadoQR(c)) === "conectado") {
            atualizar(c.id, { status: "conectado" });
            setQrImg(p => ({ ...p, [c.id]: "" }));
          }
        } catch { /* tenta de novo no próximo ciclo */ }
      });
    }, 4000);
    return () => clearInterval(t);
  }, [conexoes, atualizar]);

  async function conectarQR(c: ConexaoQR) {
    setMsg(p => ({ ...p, [c.id]: "Gerando QR Code..." }));
    try {
      const img = await gerarQRCode(c);
      if (!img) {
        const st = await estadoQR(c);
        atualizar(c.id, { status: st });
        setMsg(p => ({ ...p, [c.id]: st === "conectado" ? "Já conectado." : "QR Code não retornado." }));
        return;
      }
      setQrImg(p => ({ ...p, [c.id]: img }));
      atualizar(c.id, { status: "aguardando_qr" });
      setMsg(p => ({ ...p, [c.id]: "Abra o WhatsApp Business › Aparelhos conectados › Conectar aparelho e escaneie." }));
    } catch (e) {
      setMsg(p => ({ ...p, [c.id]: "Erro: " + (e as Error).message }));
    }
  }

  async function conectarOficial(c: ConexaoOficial) {
    setMsg(p => ({ ...p, [c.id]: "Validando credenciais..." }));
    try {
      const r = await testarOficial(c);
      atualizar(c.id, { status: "conectado" });
      setMsg(p => ({ ...p, [c.id]: `✔ ${r.verified_name || ""} ${r.display_phone_number || ""} · qualidade ${r.quality_rating || "-"}` }));
    } catch (e) {
      atualizar(c.id, { status: "desconectado" });
      setMsg(p => ({ ...p, [c.id]: "Erro: " + (e as Error).message }));
    }
  }

  async function desconectar(c: Conexao) {
    if (c.tipo === "qrcode") {
      try { await desconectarQR(c); } catch { /* ignora */ }
      setQrImg(p => ({ ...p, [c.id]: "" }));
    }
    atualizar(c.id, { status: "desconectado" });
  }

  const remover = (id: string) => setConexoes(prev => prev.filter(c => c.id !== id));
  const webhookUrl = `${window.location.origin}/api/whatsapp/webhook`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {/* QR Code */}
        <div style={card}>
          <h3 style={h3}>📱 WhatsApp Business via QR Code</h3>
          <p style={desc}>Conecte o app WhatsApp Business lendo um QR Code. Requer um servidor gateway compatível com a Evolution API.</p>
          <Campo label="Nome da conexão" v={qr.nome} set={v => setQr({ ...qr, nome: v })} ph="Atendimento Loja" />
          <Campo label="URL do servidor" v={qr.servidor} set={v => setQr({ ...qr, servidor: v })} ph="https://evolution.seudominio.com" />
          <Campo label="API Key" v={qr.apiKey} set={v => setQr({ ...qr, apiKey: v })} senha />
          <Campo label="Nome da instância" v={qr.instancia} set={v => setQr({ ...qr, instancia: v.replace(/\s/g, "-") })} ph="loja-01" />
          <button
            style={btnGreen}
            disabled={!qr.nome || !qr.servidor || !qr.apiKey || !qr.instancia}
            onClick={() => {
              const nova = { ...qr, id: novoId() };
              setConexoes(p => [...p, nova]);
              setQr({ ...qr, id: "", nome: "", instancia: "" });
              conectarQR(nova);
            }}
          >Adicionar e gerar QR Code</button>
        </div>

        {/* API Oficial */}
        <div style={card}>
          <h3 style={h3}>✅ API Oficial (WhatsApp Cloud API)</h3>
          <p style={desc}>Credenciais do app na Meta for Developers › WhatsApp › Configuração da API.</p>
          <Campo label="Nome da conexão" v={of.nome} set={v => setOf({ ...of, nome: v })} ph="Suporte Oficial" />
          <Campo label="Phone Number ID" v={of.phoneNumberId} set={v => setOf({ ...of, phoneNumberId: v.trim() })} ph="1234567890" />
          <Campo label="WABA ID" v={of.wabaId} set={v => setOf({ ...of, wabaId: v.trim() })} ph="1024689214071181" />
          <Campo label="Token de acesso (permanente)" v={of.token} set={v => setOf({ ...of, token: v.trim() })} senha />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}><Campo label="Verify token (webhook)" v={of.verifyToken} set={v => setOf({ ...of, verifyToken: v })} /></div>
            <div style={{ width: 90 }}><Campo label="Versão" v={of.versao} set={v => setOf({ ...of, versao: v })} /></div>
          </div>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 10 }}>
            URL de callback do webhook: <code style={{ color: "#aaa" }}>{webhookUrl}</code>
            <button style={{ ...btnSmall, marginLeft: 6 }} onClick={() => navigator.clipboard?.writeText(webhookUrl)}>copiar</button>
          </div>
          <button
            style={btnGreen}
            disabled={!of.nome || !of.phoneNumberId || !of.token}
            onClick={() => {
              const nova = { ...of, id: novoId() };
              setConexoes(p => [...p, nova]);
              setOf({ ...of, id: "", nome: "", phoneNumberId: "", wabaId: "", token: "", verifyToken: novoId() });
              conectarOficial(nova);
            }}
          >Adicionar e validar</button>
        </div>
      </div>

      {/* Lista de conexões */}
      <div style={card}>
        <h3 style={h3}>Conexões cadastradas</h3>
        {conexoes.length === 0 && <p style={desc}>Nenhuma conexão ainda.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {conexoes.map(c => (
            <div key={c.id} style={{ border: "1px solid #1e1e1e", borderRadius: 10, padding: 12, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <strong style={{ fontSize: 14 }}>{c.nome}</strong>
                  <span style={tag(c.tipo === "qrcode" ? "#3b82f6" : "#a855f7")}>{c.tipo === "qrcode" ? "QR Code" : "API Oficial"}</span>
                  <span style={tag(c.status === "conectado" ? "#22c55e" : c.status === "aguardando_qr" ? "#f59e0b" : "#ef4444")}>
                    {c.status === "conectado" ? "Conectado" : c.status === "aguardando_qr" ? "Aguardando leitura" : "Desconectado"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  {c.tipo === "qrcode" ? `${c.servidor} · instância ${c.instancia}` : `Phone ID ${c.phoneNumberId}${c.wabaId ? ` · WABA ${c.wabaId}` : ""}`}
                </div>
                {msg[c.id] && <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>{msg[c.id]}</div>}
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  {c.status !== "conectado" && (
                    <button style={btnSmall} onClick={() => (c.tipo === "qrcode" ? conectarQR(c) : conectarOficial(c))}>
                      {c.tipo === "qrcode" ? "↺ Gerar QR Code" : "↺ Validar"}
                    </button>
                  )}
                  {c.status === "conectado" && <button style={btnSmall} onClick={() => desconectar(c)}>Desconectar</button>}
                  <button style={{ ...btnSmall, color: "#ef4444" }} onClick={() => remover(c.id)}>Remover</button>
                </div>
              </div>
              {c.tipo === "qrcode" && qrImg[c.id] && (
                <div style={{ background: "#fff", padding: 8, borderRadius: 8 }}>
                  <img src={qrImg[c.id].startsWith("data:") ? qrImg[c.id] : `data:image/png;base64,${qrImg[c.id]}`} alt="QR Code" width={200} height={200} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Campo({ label, v, set, ph, senha }: { label: string; v: string; set: (v: string) => void; ph?: string; senha?: boolean }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{label}</div>
      <input type={senha ? "password" : "text"} value={v} onChange={e => set(e.target.value)} placeholder={ph} style={{ ...inputSm, padding: "8px 10px" }} />
    </label>
  );
}

const titulo: React.CSSProperties = { fontSize: 22, fontWeight: 700, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" };
const card: React.CSSProperties = { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 18 };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 700, marginBottom: 6 };
const desc: React.CSSProperties = { fontSize: 12, color: "#555", marginBottom: 14 };
const inputSm: React.CSSProperties = { width: "100%", padding: "7px 10px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 12, outline: "none" };
const selectSm: React.CSSProperties = { padding: "5px 8px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 12 };
const avatar: React.CSSProperties = { width: 36, height: 36, borderRadius: "50%", background: "#22c55e22", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 };
const btnGreen: React.CSSProperties = { padding: "8px 14px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 12, cursor: "pointer" };
const btnSmall: React.CSSProperties = { padding: "4px 10px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, color: "#aaa", fontSize: 11, cursor: "pointer" };
const tag = (cor: string): React.CSSProperties => ({ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: cor + "22", color: cor, fontWeight: 600 });
