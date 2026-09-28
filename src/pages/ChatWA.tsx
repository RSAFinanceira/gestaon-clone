import { useCallback, useEffect, useRef, useState } from "react";
import { Conexao, Conversa, Mensagem, SUPABASE_URL, WEBHOOK_URL, api, lerChave, qrSrc, salvarChave } from "../lib/whatsapp";

const hora = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export default function ChatWA() {
  const [aba, setAba] = useState<"chat" | "conexoes">("chat");
  const [chave, setChave] = useState(lerChave);
  const [erroGeral, setErroGeral] = useState("");
  const [conexoes, setConexoes] = useState<Conexao[]>([]);
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Mensagem[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [busca, setBusca] = useState("");
  const [novoNumero, setNovoNumero] = useState("");
  const fimRef = useRef<HTMLDivElement>(null);

  const carregarConexoes = useCallback(() => api<Conexao[]>("conexoes").then(setConexoes), []);

  // Atualiza lista de conversas a cada 5s
  useEffect(() => {
    if (!chave) return;
    let ativo = true;
    const tick = () => Promise.all([api<Conversa[]>("conversas").then(c => ativo && setConversas(c)), carregarConexoes()])
      .then(() => setErroGeral(""))
      .catch(e => setErroGeral(e.message));
    tick();
    const t = setInterval(tick, 5000);
    return () => { ativo = false; clearInterval(t); };
  }, [chave, carregarConexoes]);

  // Atualiza mensagens da conversa aberta a cada 3s
  useEffect(() => {
    if (!sel || !chave) return;
    let ativo = true;
    const tick = () => api<Mensagem[]>("mensagens", { conversa_id: sel }).then(m => ativo && setMsgs(m)).catch(() => {});
    tick();
    const t = setInterval(tick, 3000);
    return () => { ativo = false; clearInterval(t); };
  }, [sel, chave]);

  useEffect(() => { fimRef.current?.scrollIntoView({ block: "end" }); }, [msgs.length, sel]);

  const conectadas = conexoes.filter(c => c.status === "conectado");
  const conversa = conversas.find(c => c.id === sel) || null;
  const nomeConexao = (id: string | null) => conexoes.find(c => c.id === id)?.nome || "—";

  async function enviar() {
    if (!mensagem.trim() || !conversa || enviando) return;
    setEnviando(true);
    try {
      const m = await api<Mensagem>("enviar", { conversa_id: conversa.id, texto: mensagem });
      setMsgs(prev => [...prev, m]);
      setMensagem("");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  async function iniciarConversa() {
    if (!novoNumero.trim()) return;
    const conexaoId = conectadas[0]?.id;
    if (!conexaoId) return alert("Conecte um número primeiro.");
    try {
      const c = await api<Conversa>("iniciar_conversa", { numero: novoNumero, conexao_id: conexaoId });
      setConversas(prev => [c, ...prev.filter(x => x.id !== c.id)]);
      setSel(c.id);
      setNovoNumero("");
    } catch (e) { alert((e as Error).message); }
  }

  async function mudarStatus(status: Conversa["status"]) {
    if (!conversa) return;
    const c = await api<Conversa>("atualizar_conversa", { id: conversa.id, status });
    setConversas(prev => prev.map(x => (x.id === c.id ? c : x)));
  }

  const filtradas = conversas.filter(c => ((c.nome || "") + c.numero).toLowerCase().includes(busca.toLowerCase()));

  if (!SUPABASE_URL || !chave) {
    return <Configurar onSalvar={k => { salvarChave(k); setChave(k); }} />;
  }

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
        {erroGeral && (
          <span style={{ fontSize: 12, color: "#ef4444", marginLeft: "auto" }}>
            ⚠ {erroGeral} <a style={{ color: "#22c55e", cursor: "pointer" }} onClick={() => { salvarChave(""); setChave(""); }}>trocar chave</a>
          </span>
        )}
      </div>

      {aba === "conexoes" ? (
        <Conexoes conexoes={conexoes} recarregar={carregarConexoes} />
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
              {filtradas.length === 0 && <p style={{ ...desc, padding: "0 14px" }}>Nenhuma conversa ainda.</p>}
              {filtradas.map(c => (
                <div key={c.id} onClick={() => setSel(c.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer",
                  background: sel === c.id ? "rgba(34,197,94,0.1)" : "transparent",
                  borderLeft: sel === c.id ? "3px solid #22c55e" : "3px solid transparent",
                }}>
                  <div style={avatar}>{(c.nome || c.numero)[0].toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.nome || "+" + c.numero}</span>
                      <span style={{ fontSize: 11, color: "#555", flexShrink: 0 }}>{hora(c.ultima_em)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ flex: 1, fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.ultima_mensagem}</span>
                      {c.nao_lidas > 0 && sel !== c.id && (
                        <span style={{ background: "#22c55e", color: "#000", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px" }}>{c.nao_lidas}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Área de chat */}
          {conversa ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0d0d0d" }}>
              <div style={{ padding: "10px 20px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 10, background: "#111" }}>
                <div style={avatar}>{(conversa.nome || conversa.numero)[0].toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{conversa.nome || "+" + conversa.numero}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>+{conversa.numero} · via {nomeConexao(conversa.conexao_id)}</div>
                </div>
                <select value={conversa.status} onChange={e => mudarStatus(e.target.value as Conversa["status"])} style={{ ...selectSm, marginLeft: "auto" }}>
                  <option value="aberto">🟢 Aberto</option>
                  <option value="pendente">🟡 Pendente</option>
                  <option value="resolvido">✔ Resolvido</option>
                </select>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {msgs.map(m => {
                  const eu = m.direcao === "saida";
                  return (
                    <div key={m.id} style={{ display: "flex", justifyContent: eu ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "60%", padding: "8px 14px", borderRadius: eu ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: m.erro ? "#7f1d1d" : eu ? "#22c55e" : "#1e1e1e",
                        color: eu && !m.erro ? "#000" : "#fff", fontSize: 13, whiteSpace: "pre-wrap", wordBreak: "break-word",
                      }}>
                        {m.texto}
                        {m.erro && <div style={{ fontSize: 10, color: "#fca5a5", marginTop: 4 }}>⚠ {m.erro}</div>}
                        <div style={{ fontSize: 10, color: eu && !m.erro ? "#00000066" : "#555", marginTop: 4, textAlign: "right" }}>
                          {hora(m.criado_em)}{eu && !m.erro && ` ${m.status === "read" ? "✓✓ lida" : m.status === "delivered" ? "✓✓" : "✓"}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={fimRef} />
              </div>

              <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e1e", display: "flex", gap: 8, background: "#111" }}>
                <input
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && enviar()}
                  placeholder="Digite uma mensagem..."
                  style={{ flex: 1, padding: "9px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 24, color: "#fff", fontSize: 13, outline: "none" }}
                />
                <button onClick={enviar} disabled={enviando} style={{ width: 40, height: 40, background: "#22c55e", border: "none", borderRadius: "50%", color: "#000", fontSize: 16, cursor: "pointer", opacity: enviando ? 0.5 : 1 }}>↑</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0d0d0d", gap: 12 }}>
              <div style={{ fontSize: 40 }}>💬</div>
              <p style={{ fontSize: 14, color: "#555" }}>Selecione uma conversa</p>
              {conectadas.length === 0 && <a onClick={() => setAba("conexoes")} style={{ color: "#22c55e", fontSize: 13, cursor: "pointer" }}>Configure um número →</a>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ================= Configuração inicial =================

function Configurar({ onSalvar }: { onSalvar: (k: string) => void }) {
  const [k, setK] = useState("");
  return (
    <div style={{ ...card, maxWidth: 480 }}>
      <h3 style={h3}>Configurar chat de atendimento</h3>
      {!SUPABASE_URL ? (
        <p style={desc}>Defina <code>VITE_SUPABASE_URL</code> no arquivo <code>.env</code> (veja <code>.env.example</code>) e reinicie o app.</p>
      ) : (
        <>
          <p style={desc}>Informe a chave do painel (secret <code>PAINEL_KEY</code> configurado nas Edge Functions do Supabase).</p>
          <Campo label="Chave do painel" v={k} set={setK} senha />
          <button style={btnGreen} disabled={!k} onClick={() => onSalvar(k)}>Entrar</button>
        </>
      )}
    </div>
  );
}

// ================= Conexões =================

function Conexoes({ conexoes, recarregar }: { conexoes: Conexao[]; recarregar: () => Promise<void> }) {
  const [qr, setQr] = useState({ nome: "", servidor: "", api_key: "", instancia: "" });
  const [of, setOf] = useState({ nome: "", phone_number_id: "", waba_id: "", token: "", verify_token: crypto.randomUUID().slice(0, 12), versao: "v21.0" });
  const [qrImg, setQrImg] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  // Enquanto houver QR na tela, consulta o estado até conectar
  useEffect(() => {
    const ids = Object.keys(qrImg).filter(id => qrImg[id]);
    if (!ids.length) return;
    const t = setInterval(() => {
      ids.forEach(async id => {
        try {
          const r = await api<{ status: string }>("estado", { id });
          if (r.status === "conectado") {
            setQrImg(p => ({ ...p, [id]: "" }));
            setMsg(p => ({ ...p, [id]: "✔ Conectado!" }));
            recarregar();
          }
        } catch { /* tenta de novo */ }
      });
    }, 4000);
    return () => clearInterval(t);
  }, [qrImg, recarregar]);

  function mostrarResultado(id: string, r: { status: string; qr?: string | null; info?: any }) {
    if (r.qr) {
      setQrImg(p => ({ ...p, [id]: r.qr! }));
      setMsg(p => ({ ...p, [id]: "Abra o WhatsApp Business › Aparelhos conectados › Conectar aparelho e escaneie." }));
    } else if (r.info) {
      setMsg(p => ({ ...p, [id]: `✔ ${r.info.verified_name || ""} ${r.info.display_phone_number || ""} · qualidade ${r.info.quality_rating || "-"}` }));
    } else {
      setMsg(p => ({ ...p, [id]: r.status === "conectado" ? "✔ Conectado." : r.status }));
    }
  }

  async function criar(dados: Record<string, string>) {
    setSalvando(true);
    try {
      const r = await api<{ id: string; status: string; qr?: string; info?: any }>("criar_conexao", dados);
      await recarregar();
      mostrarResultado(r.id, r);
      return true;
    } catch (e) {
      alert((e as Error).message);
      await recarregar();
      return false;
    } finally {
      setSalvando(false);
    }
  }

  async function acao(nome: "conectar" | "desconectar" | "remover_conexao", c: Conexao) {
    if (nome === "remover_conexao" && !confirm(`Remover a conexão "${c.nome}"?`)) return;
    setMsg(p => ({ ...p, [c.id]: "..." }));
    try {
      const r = await api(nome, { id: c.id });
      if (nome === "conectar") mostrarResultado(c.id, r);
      else { setQrImg(p => ({ ...p, [c.id]: "" })); setMsg(p => ({ ...p, [c.id]: "" })); }
    } catch (e) {
      setMsg(p => ({ ...p, [c.id]: "Erro: " + (e as Error).message }));
    }
    recarregar();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        <div style={card}>
          <h3 style={h3}>📱 WhatsApp Business via QR Code</h3>
          <p style={desc}>Conecte o app WhatsApp Business lendo um QR Code. Requer um servidor Evolution API.</p>
          <Campo label="Nome da conexão" v={qr.nome} set={v => setQr({ ...qr, nome: v })} ph="Atendimento Loja" />
          <Campo label="URL do servidor Evolution" v={qr.servidor} set={v => setQr({ ...qr, servidor: v.trim() })} ph="https://evolution.seudominio.com" />
          <Campo label="API Key global" v={qr.api_key} set={v => setQr({ ...qr, api_key: v.trim() })} senha />
          <Campo label="Nome da instância" v={qr.instancia} set={v => setQr({ ...qr, instancia: v.replace(/\s/g, "-") })} ph="loja-01" />
          <button
            style={btnGreen}
            disabled={salvando || !qr.nome || !qr.servidor || !qr.api_key || !qr.instancia}
            onClick={async () => { if (await criar({ tipo: "qrcode", ...qr })) setQr({ ...qr, nome: "", instancia: "" }); }}
          >Adicionar e gerar QR Code</button>
        </div>

        <div style={card}>
          <h3 style={h3}>✅ API Oficial (WhatsApp Cloud API)</h3>
          <p style={desc}>Meta for Developers › seu app › WhatsApp › Configuração da API.</p>
          <Campo label="Nome da conexão" v={of.nome} set={v => setOf({ ...of, nome: v })} ph="Suporte Oficial" />
          <Campo label="Phone Number ID (Identificação do número)" v={of.phone_number_id} set={v => setOf({ ...of, phone_number_id: v.trim() })} />
          <Campo label="WABA ID (Identificação da conta do WhatsApp Business)" v={of.waba_id} set={v => setOf({ ...of, waba_id: v.trim() })} />
          <Campo label="Token de acesso permanente (usuário do sistema)" v={of.token} set={v => setOf({ ...of, token: v.trim() })} senha />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}><Campo label="Verify token (webhook)" v={of.verify_token} set={v => setOf({ ...of, verify_token: v })} /></div>
            <div style={{ width: 90 }}><Campo label="Versão" v={of.versao} set={v => setOf({ ...of, versao: v })} /></div>
          </div>
          <Copiar label="URL de callback do webhook" valor={WEBHOOK_URL} />
          <button
            style={btnGreen}
            disabled={salvando || !of.nome || !of.phone_number_id || !of.token}
            onClick={async () => {
              if (await criar({ tipo: "oficial", ...of })) setOf({ ...of, nome: "", phone_number_id: "", waba_id: "", token: "", verify_token: crypto.randomUUID().slice(0, 12) });
            }}
          >Adicionar e validar</button>
        </div>
      </div>

      <div style={card}>
        <h3 style={h3}>Conexões cadastradas</h3>
        {conexoes.length === 0 && <p style={desc}>Nenhuma conexão ainda.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {conexoes.map(c => (
            <div key={c.id} style={{ border: "1px solid #1e1e1e", borderRadius: 10, padding: 12, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: 14 }}>{c.nome}</strong>
                  <span style={tag(c.tipo === "qrcode" ? "#3b82f6" : "#a855f7")}>{c.tipo === "qrcode" ? "QR Code" : "API Oficial"}</span>
                  <span style={tag(c.status === "conectado" ? "#22c55e" : c.status === "aguardando_qr" ? "#f59e0b" : "#ef4444")}>
                    {c.status === "conectado" ? "Conectado" : c.status === "aguardando_qr" ? "Aguardando leitura" : "Desconectado"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  {c.tipo === "qrcode" ? `${c.servidor} · instância ${c.instancia}` : `Phone ID ${c.phone_number_id}${c.waba_id ? ` · WABA ${c.waba_id}` : ""}`}
                </div>
                {c.tipo === "oficial" && <div style={{ fontSize: 12, color: "#555" }}>Verify token: <code style={{ color: "#aaa" }}>{c.verify_token}</code></div>}
                {msg[c.id] && <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>{msg[c.id]}</div>}
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  {c.status !== "conectado"
                    ? <button style={btnSmall} onClick={() => acao("conectar", c)}>{c.tipo === "qrcode" ? "↺ Gerar QR Code" : "↺ Validar"}</button>
                    : <button style={btnSmall} onClick={() => acao("desconectar", c)}>Desconectar</button>}
                  <button style={{ ...btnSmall, color: "#ef4444" }} onClick={() => acao("remover_conexao", c)}>Remover</button>
                </div>
              </div>
              {qrImg[c.id] && (
                <div style={{ background: "#fff", padding: 8, borderRadius: 8 }}>
                  <img src={qrSrc(qrImg[c.id])} alt="QR Code" width={200} height={200} />
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

function Copiar({ label, valor }: { label: string; valor: string }) {
  return (
    <div style={{ fontSize: 11, color: "#555", marginBottom: 10 }}>
      {label}: <code style={{ color: "#aaa", wordBreak: "break-all" }}>{valor}</code>
      <button style={{ ...btnSmall, marginLeft: 6 }} onClick={() => navigator.clipboard?.writeText(valor)}>copiar</button>
    </div>
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
