import { useState } from "react";

const proxiesIniciais = [
  { ip: "185.72.242.230:5913:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "26/05, 12:44", status: "Ativa" },
  { ip: "45.38.89.134:6069:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "26/05, 12:44", status: "Ativa" },
  { ip: "92.112.170.61:6030:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "26/05, 12:45", status: "Ativa" },
  { ip: "92.112.175.30:6303:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "26/05, 12:50", status: "Ativa" },
  { ip: "92.112.200.159:6742:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "26/05, 12:50", status: "Ativa" },
  { ip: "92.112.172.22:6294:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "—", status: "Ativa" },
  { ip: "92.112.171.145:6113:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "—", status: "Ativa" },
  { ip: "45.38.101.119:6052:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "—", status: "Ativa" },
  { ip: "23.129.252.149:6417:***:***", ultimoTeste: "25/05, 11:06", ultimoUso: "25/05, 11:07", status: "Ativa" },
];

export default function Proxies() {
  const [proxies, setProxies] = useState(proxiesIniciais);
  const [novas, setNovas] = useState("");

  function adicionar() {
    const linhas = novas.split("\n").filter(l => l.trim());
    if (!linhas.length) return;
    setProxies(prev => [...prev, ...linhas.map(l => ({ ip: l.trim(), ultimoTeste: "—", ultimoUso: "—", status: "Ativa" as const }))]);
    setNovas("");
  }

  function remover(idx: number) {
    setProxies(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <h1 style={titulo}>Pool de Proxies</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[["TOTAL", proxies.length, "#fff"], ["ATIVAS", proxies.filter(p => p.status === "Ativa").length, "#22c55e"], ["INATIVAS", proxies.filter(p => p.status !== "Ativa").length, "#ef4444"], ["NÃO TESTADAS", 0, "#fff"]].map(([label, val, cor]) => (
          <div key={label as string} style={card}>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 4, letterSpacing: "0.06em" }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: cor as string }}>{val as number}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>ADICIONAR PROXIES</div>
        <textarea
          value={novas}
          onChange={e => setNovas(e.target.value)}
          placeholder={"ip:porta:usuario:senha\nip:porta:usuario:senha\n..."}
          rows={4}
          style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: 10, color: "#aaa", fontSize: 12, fontFamily: "monospace", resize: "none", outline: "none" }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={adicionar} style={btnGreen}>+ Adicionar</button>
          <button style={btnOutline}>↺ Testar todas</button>
        </div>
      </div>

      <div style={card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
              {["STATUS", "PROXY", "ÚLTIMO TESTE", "ÚLTIMO USO", "AÇÕES"].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proxies.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0f0f0f" }}>
                <td style={td}><span style={{ color: "#22c55e" }}>● {p.status}</span></td>
                <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>{p.ip}</td>
                <td style={td}>{p.ultimoTeste}</td>
                <td style={td}>{p.ultimoUso}</td>
                <td style={{ ...td, display: "flex", gap: 6 }}>
                  <button style={btnSmall}>Testar</button>
                  <button onClick={() => remover(i)} style={{ ...btnSmall, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid #ef444433" }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const titulo: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" };
const card: React.CSSProperties = { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 20 };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 12px", fontSize: 10, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, color: "#ccc", verticalAlign: "middle" };
const btnGreen: React.CSSProperties = { padding: "8px 18px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" };
const btnOutline: React.CSSProperties = { padding: "8px 18px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 13, cursor: "pointer" };
const btnSmall: React.CSSProperties = { padding: "4px 12px", background: "transparent", border: "1px solid #333", borderRadius: 6, color: "#aaa", fontSize: 11, cursor: "pointer" };
