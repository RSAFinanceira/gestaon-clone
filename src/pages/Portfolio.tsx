import { useState } from "react";

export default function Portfolio() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [empresas] = useState<any[]>([]);

  return (
    <div>
      <h1 style={titulo}>Portfólio BM</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
        {[["Total", 0, "#fff"], ["Verificadas", 0, "#22c55e"], ["Em Análise", 0, "#f59e0b"], ["Não Verificadas", 0, "#fff"], ["Recusadas", 0, "#ef4444"]].map(([label, val, cor]) => (
          <div key={label as string} style={card}>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: cor as string }}>{val as number}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por empresa, CNPJ, BM..."
            style={input}
          />
          <select value={filtro} onChange={e => setFiltro(e.target.value)} style={{ ...input, width: 140, flex: "none" }}>
            {["Todos", "Verificadas", "Em Análise", "Não Verificadas", "Recusadas"].map(o => <option key={o}>{o}</option>)}
          </select>
          <button onClick={() => setMostrarForm(true)} style={btnGreen}>+ Nova Empresa</button>
        </div>

        <p style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>{empresas.length} registro(s)</p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
              {["Empresa", "Nome Empresa", "CNPJ", "Domínio", "BM", "Enviado em", "Status", "Ações"].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empresas.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#555", fontSize: 13 }}>
                  Nenhum registro. Clique em "+ Nova Empresa".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nova Empresa */}
      {mostrarForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 16, padding: 32, width: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Nova Empresa</h2>
              <button onClick={() => setMostrarForm(false)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            {[["EMPRESA (CNPJ)", ""], ["NOME EMPRESA", ""], ["BM ID", ""], ["DOMÍNIO", ""]].map(([lbl]) => (
              <div key={lbl} style={{ marginBottom: 14 }}>
                <label style={lblSt}>{lbl}</label>
                <input style={inputSt} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setMostrarForm(false)} style={btnOutline}>Cancelar</button>
              <button onClick={() => setMostrarForm(false)} style={btnGreen}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const titulo: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" };
const card: React.CSSProperties = { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 20 };
const input: React.CSSProperties = { flex: 1, padding: "8px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };
const inputSt: React.CSSProperties = { width: "100%", padding: "9px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };
const lblSt: React.CSSProperties = { display: "block", fontSize: 10, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase" };
const btnGreen: React.CSSProperties = { padding: "8px 18px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" };
const btnOutline: React.CSSProperties = { padding: "8px 18px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 13, cursor: "pointer" };
