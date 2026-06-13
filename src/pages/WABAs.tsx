import { useState } from "react";

const wabasData = [
  { conta: "Carteira de Trabalho Digital", numero: "+55 14 3145-0097", statusBM: "Não verificada", statusNum: "Conectado", qualidade: "Alta", limite: "250/dia", template: "aprovado", ultimaVer: "13/06, 12:17", jaEnviados: 2 },
  { conta: "Carteira de Trabalho Digital", numero: "+1 555-989-5484", statusBM: "Não verificada", statusNum: "Conectado", qualidade: "Desconhecida", limite: "250/dia", template: "aprovado", ultimaVer: "01/06, 14:20", jaEnviados: 0 },
  { conta: "Paulo de Oliveira", numero: "+55 16 97625-5906", statusBM: "Verificada", statusNum: "Conectado", qualidade: "Desconhecida", limite: "250/dia", template: "aprovado", ultimaVer: "22/05, 21:04", jaEnviados: 2 },
  { conta: "Nivaldo da Silva", numero: "+55 14 3145-0089", statusBM: "Em análise", statusNum: "Conectado", qualidade: "Desconhecida", limite: "2.000/dia", template: "aprovado", ultimaVer: "22/05, 19:16", jaEnviados: 0 },
];

const historico = [
  { id: 361, conta: "Janete Yuka", template: "aprovado", status: "Finalizado", total: 10, enviados: 10, erros: 0, duracao: "8s", data: "25/05, 11:06" },
  { id: 265, conta: "Janete Yuka", template: "aprovado", status: "Finalizado", total: 1, enviados: 1, erros: 0, duracao: "1s", data: "22/05, 20:17" },
  { id: 264, conta: "Janete Yuka", template: "aprovado", status: "Finalizado", total: 1, enviados: 1, erros: 0, duracao: "0s", data: "22/05, 20:12" },
];

const banidos = [
  { conta: "Janete Yuka", id: "1024689214071181", numero: "+55 31 7616-1574", qualidade: "Alta", tier: "250/dia", ultimaVer: "13/06, 12:17" },
];

const abas = ["WABAs", "Modelos (1)", "Sincronizar", "Disparador", "Histórico", "Banidos"];

export default function WABAs() {
  const [aba, setAba] = useState("WABAs");
  const [mostrarModelos, setMostrarModelos] = useState(false);
  const [numerosDisparo, setNumerosDisparo] = useState("");
  const [log] = useState("[12:19:23] Motor pronto. Selecione uma WABA e configure o disparo.");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" }}>WABAs</h1>
        <button style={btnSmall} onClick={() => navigator.clipboard?.writeText("")}>📋 Copiar script</button>
        <button style={btnSmall}>↺ Regenerar</button>
        <button style={{ ...btnSmall, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid #22c55e44" }}>% Registrar número</button>
      </div>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          ["BMS VERIFICADAS", "2", "#fff"],
          ["BMS 250/DIA", "4", "#fff"],
          ["BMS 2.000/DIA", "1", "#fff"],
          ["TOTAL DISPAROS LIBERADOS", "2.750", "#fff"],
          ["PRONTAS PARA ENVIO", "5", "#22c55e"],
          ["DISPAROS PRONTOS", "3.000", "#22c55e"],
          ["TEMPLATES EM ANÁLISE", "0", "#f59e0b"],
          ["DISPAROS PENDENTES", "0", "#fff"],
        ].map(([label, val, cor]) => (
          <div key={label as string} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 10, padding: "14px 12px" }}>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, lineHeight: 1.4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: cor as string }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {abas.map(a => (
          <button key={a} onClick={() => { setAba(a); if (a === "Modelos (1)") setMostrarModelos(true); }} style={{
            padding: "6px 14px", border: "none", borderRadius: 20, cursor: "pointer",
            background: aba === a ? "#22c55e" : "#141414",
            color: aba === a ? "#000" : "#aaa", fontWeight: aba === a ? 700 : 400, fontSize: 12,
            border: "1px solid #1e1e1e" as any,
          }}>{a === "Sincronizar" ? `↺ ${a} 12:19:07` : a === "Disparador" ? `↑ ${a}` : a}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={btnOutline}>↑ Enviar Template</button>
          <button style={btnGreen}>+ Adicionar WABA</button>
        </div>
      </div>

      {/* Conteúdo */}
      {aba === "WABAs" && (
        <div style={card}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
                  {["Conta", "Número", "Status BM", "Status Número", "Qualidade", "Limite/Dia", "Templates", "Última Verificação", "Já Enviados", "Ações"].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wabasData.map((w, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #0f0f0f" }}>
                    <td style={td}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", marginRight: 6 }} />{w.conta}</td>
                    <td style={td}>{w.numero}</td>
                    <td style={td}><StatusBadge status={w.statusBM} /></td>
                    <td style={td}><Badge cor="green">{w.statusNum}</Badge></td>
                    <td style={td}><Badge cor={w.qualidade === "Alta" ? "green" : "gray"}>{w.qualidade}</Badge></td>
                    <td style={td}>{w.limite}</td>
                    <td style={td}><Badge cor="green">{w.template}</Badge></td>
                    <td style={td}>{w.ultimaVer}</td>
                    <td style={td}>{w.jaEnviados}</td>
                    <td style={{ ...td, display: "flex", gap: 4 }}>
                      <Btn cor="green">✎</Btn>
                      <Btn cor="gray">↺</Btn>
                      <Btn cor="red">🗑</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aba === "Disparador" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={card}>
            <div style={{ background: "#22c55e", borderRadius: 8, padding: "10px", textAlign: "center", color: "#000", fontWeight: 700, marginBottom: 16 }}>↑ Disparador</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>WABA PARA DISPARAR</div>
                <div style={{ fontSize: 13, color: "#555" }}>Nenhuma WABA selecionada.</div>
              </div>
              <button style={btnSmall}>Selecionar</button>
            </div>
            <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 12, marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>VARIÁVEIS</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>Selecione um template para ver as variáveis.</div>
              <button style={btnSmall}>Modelos</button>
            </div>
          </div>
          <div style={card}>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              <button style={{ ...btnGreen, flex: 1, fontSize: 12 }}>Manual</button>
              <button style={{ ...btnOutline, flex: 1, fontSize: 12 }}>CSV</button>
            </div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>LISTA DE NÚMEROS (UM POR LINHA)</div>
            <textarea
              value={numerosDisparo}
              onChange={e => setNumerosDisparo(e.target.value)}
              placeholder={"11999999999\n21988888888\n+5511977777777"}
              rows={8}
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: 10, color: "#fff", fontSize: 13, resize: "none", outline: "none" }}
            />
            <button style={{ ...btnOutline, width: "100%", marginTop: 8, fontSize: 12 }}>Analisar lista</button>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={{ ...btnGreen, flex: 1 }}>↑ Iniciar disparo</button>
              <button style={btnSmall}>⏰ Agendar</button>
              <button style={btnSmall}>📦 Lote</button>
            </div>
            <div style={{ marginTop: 12, background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 8, padding: 10, fontSize: 11, color: "#22c55e", fontFamily: "monospace" }}>
              {log}
            </div>
          </div>
        </div>
      )}

      {aba === "Histórico" && (
        <div style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
            <Stat label="CAMPANHAS" value="10" />
            <Stat label="TOTAL ENVIADOS" value="18" cor="#22c55e" />
            <Stat label="TOTAL ERROS" value="1" cor="#ef4444" />
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
                {["#", "Conta", "Template", "Status", "Total", "Enviados", "Erros", "Duração", "Data"].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historico.map(h => (
                <tr key={h.id} style={{ borderBottom: "1px solid #0f0f0f" }}>
                  <td style={td}>#{h.id}</td>
                  <td style={td}>{h.conta}</td>
                  <td style={td}>{h.template}</td>
                  <td style={td}><Badge cor="green">{h.status}</Badge></td>
                  <td style={td}>{h.total}</td>
                  <td style={{ ...td, color: "#22c55e" }}>{h.enviados}</td>
                  <td style={td}>{h.erros}</td>
                  <td style={td}>{h.duracao}</td>
                  <td style={td}>{h.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === "Banidos" && (
        <div style={card}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
                {["Conta", "Número", "Qualidade", "Tier Original", "Última Verificação", "Ações"].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banidos.map((b, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #0f0f0f", background: "rgba(239,68,68,0.03)" }}>
                  <td style={td}><span style={{ display: "block", fontSize: 13 }}>{b.conta}</span><span style={{ fontSize: 11, color: "#555" }}>{b.id}</span></td>
                  <td style={{ ...td, color: "#22c55e" }}>{b.numero}</td>
                  <td style={td}><Badge cor="green">{b.qualidade}</Badge></td>
                  <td style={td}>{b.tier}</td>
                  <td style={td}>{b.ultimaVer}</td>
                  <td style={td}><Btn cor="red">Remover</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Modelos */}
      {mostrarModelos && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 16, padding: 28, width: 500, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Modelos Salvos</h2>
              <button onClick={() => setMostrarModelos(false)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>aprovado</span>
                <button style={{ ...btnSmall, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid #ef444433" }}>Remover</button>
              </div>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>Olá {`{{1}}`} {`{{2}}`} {`{{3}}`} {`{{4}}`} Aguardo a sua confirmação de leitura e acesso ao painel....</div>
              <div style={{ color: "#22c55e", fontSize: 11 }}>ACESSAR PAINEL</div>
            </div>
            <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Novo modelo</h3>
              <div style={{ marginBottom: 10 }}>
                <label style={lblSt}>NOME</label>
                <input defaultValue="aprovacao_padrao" style={inputSt} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={lblSt}>CORPO</label>
                <textarea defaultValue={`Olá {{1}}\n\n{{2}}\n\n{{3}}`} rows={4} style={{ ...inputSt, resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={lblSt}>TEXTO DO BOTÃO</label>
                  <input defaultValue="ACESSAR PAINEL" style={inputSt} />
                </div>
                <div>
                  <label style={lblSt}>LINK DO BOTÃO</label>
                  <input defaultValue="https://..." style={inputSt} />
                </div>
              </div>
              <button style={{ ...btnGreen, width: "100%" }}>Salvar modelo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cor = status === "Verificada" ? "#3b82f6" : status === "Não verificada" ? "#ef4444" : "#f59e0b";
  const icon = status === "Verificada" ? "✓" : status === "Não verificada" ? "⊗" : "⊙";
  return <span style={{ fontSize: 12, color: cor }}>{icon} {status}</span>;
}
function Badge({ children, cor }: { children: React.ReactNode; cor: string }) {
  const c: Record<string, string> = { green: "#22c55e", gray: "#888", red: "#ef4444" };
  return <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c[cor] + "22", color: c[cor] }}>{children}</span>;
}
function Btn({ children, onClick, cor = "green" }: any) {
  const c: Record<string, string> = { green: "#22c55e", gray: "#aaa", red: "#ef4444" };
  return <button onClick={onClick} style={{ padding: "4px 10px", background: c[cor] + "22", border: `1px solid ${c[cor]}33`, color: c[cor], borderRadius: 6, fontSize: 12, cursor: "pointer" }}>{children}</button>;
}
function Stat({ label, value, cor = "#fff" }: any) {
  return <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 14 }}>
    <div style={{ fontSize: 10, color: "#555", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: cor }}>{value}</div>
  </div>;
}

const card: React.CSSProperties = { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 20 };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 10px", fontSize: 10, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 10px", fontSize: 12, color: "#ccc", verticalAlign: "middle" };
const btnGreen: React.CSSProperties = { padding: "8px 18px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" };
const btnOutline: React.CSSProperties = { padding: "8px 18px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 13, cursor: "pointer" };
const btnSmall: React.CSSProperties = { padding: "5px 12px", background: "transparent", border: "1px solid #333", borderRadius: 6, color: "#aaa", fontSize: 11, cursor: "pointer" };
const lblSt: React.CSSProperties = { display: "block", fontSize: 10, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 };
const inputSt: React.CSSProperties = { width: "100%", padding: "8px 12px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };
