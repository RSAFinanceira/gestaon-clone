import { useState } from "react";

const listasIniciais = [
  { nome: "CLT PRATA 80", total: 82, disponiveis: 72, usados: 10, progresso: 12, criadaEm: "25/05/2026" },
];

export default function Listas() {
  const [listas, setListas] = useState(listasIniciais);
  const [nomeLista, setNomeLista] = useState("");
  const [drag, setDrag] = useState(false);

  function apagar(nome: string) {
    if (confirm("Apagar esta lista?")) setListas(prev => prev.filter(l => l.nome !== nome));
  }

  return (
    <div>
      <h1 style={titulo}>Listas Salvas</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[["TOTAL DE LISTAS", listas.length, "#fff"], ["TOTAL DE LEADS", listas.reduce((a, l) => a + l.total, 0), "#fff"], ["DISPONÍVEIS", listas.reduce((a, l) => a + l.disponiveis, 0), "#22c55e"]].map(([label, val, cor]) => (
          <div key={label as string} style={card}>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 4, letterSpacing: "0.06em" }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: cor as string }}>{val as number}</div>
          </div>
        ))}
        <div style={{ ...card, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>HISTÓRICO DE USO</div>
          <div style={{ fontSize: 12, color: "#444" }}>Selecione uma lista para ver o histórico de uso por WABA</div>
        </div>
      </div>

      {/* Upload */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>IMPORTAR NOVA LISTA</div>
        <input
          value={nomeLista}
          onChange={e => setNomeLista(e.target.value)}
          placeholder="Nome da lista (ex: Leads Março 2026)"
          style={{ width: "100%", padding: "10px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", marginBottom: 12 }}
        />
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); }}
          style={{
            border: `2px dashed ${drag ? "#22c55e" : "#2a2a2a"}`,
            borderRadius: 10, padding: "40px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            background: drag ? "rgba(34,197,94,0.05)" : "transparent",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <span style={{ fontSize: 24, color: "#444" }}>↑</span>
          <span style={{ fontSize: 13, color: "#aaa" }}>Clique ou arraste o CSV aqui</span>
          <span style={{ fontSize: 11, color: "#555" }}>Aceita .csv e .txt com separador vírgula ou ponto e vírgula</span>
          <input id="fileInput" type="file" accept=".csv,.txt" style={{ display: "none" }} />
        </div>
        <button style={{ ...btnGreen, marginTop: 14 }}>+ Salvar lista</button>
      </div>

      {/* Tabela */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>LISTAS SALVAS</span>
          <button style={btnSmall}>↺ Atualizar</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
              {["LISTA", "TOTAL", "DISPONÍVEIS", "USADOS", "PROGRESSO", "CRIADA EM", "AÇÕES"].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listas.map(l => (
              <tr key={l.nome} style={{ borderBottom: "1px solid #0f0f0f" }}>
                <td style={{ ...td, fontWeight: 600 }}>{l.nome}</td>
                <td style={td}>{l.total}</td>
                <td style={td}>{l.disponiveis}</td>
                <td style={td}>{l.usados}</td>
                <td style={{ ...td, minWidth: 160 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: "#1e1e1e", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${l.progresso}%`, height: "100%", background: "#22c55e", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#555", minWidth: 32 }}>{l.progresso}%</span>
                  </div>
                </td>
                <td style={td}>{l.criadaEm}</td>
                <td style={{ ...td, display: "flex", gap: 6 }}>
                  <button style={btnSmall}>Uso</button>
                  <button onClick={() => apagar(l.nome)} style={{ ...btnSmall, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid #ef444433" }}>Apagar</button>
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
const btnSmall: React.CSSProperties = { padding: "4px 12px", background: "transparent", border: "1px solid #333", borderRadius: 6, color: "#aaa", fontSize: 11, cursor: "pointer" };
