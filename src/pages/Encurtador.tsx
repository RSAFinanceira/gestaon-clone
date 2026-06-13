import { useState } from "react";

const linksIniciais = [
  { site: "larissacintrafreire", linkGerado: "https://larissacintrafreire.ngestao.com.br/painel", destino: "https://api.whatsapp.com/send?phone=5", cliques: 8 },
  { site: "nivaldodasilvacampos", linkGerado: "https://nivaldodasilvacampos.gestaodon.com.br/nipainel", destino: "https://api.whatsapp.com/send?phone=5", cliques: 14 },
];

export default function Encurtador() {
  const [links, setLinks] = useState(linksIniciais);
  const [novoSite, setNovoSite] = useState("");
  const [novoCaminho, setNovoCaminho] = useState("");
  const [novoDestino, setNovoDestino] = useState("");
  const [busca, setBusca] = useState("");

  function criarLink() {
    if (!novoSite || !novoCaminho || !novoDestino) { alert("Preencha todos os campos."); return; }
    setLinks(prev => [...prev, {
      site: novoSite,
      linkGerado: `https://${novoSite}.ngestao.com.br/${novoCaminho}`,
      destino: novoDestino,
      cliques: 0,
    }]);
    setNovoSite(""); setNovoCaminho(""); setNovoDestino("");
  }

  function excluir(i: number) {
    if (confirm("Excluir este link?")) setLinks(prev => prev.filter((_, idx) => idx !== i));
  }

  const filtrados = links.filter(l => l.site.includes(busca.toLowerCase()) || l.linkGerado.includes(busca.toLowerCase()));

  const totalCliques = links.reduce((a, l) => a + l.cliques, 0);

  return (
    <div>
      <h1 style={titulo}>Encurtador de Links</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {[["Links Criados", links.length, "#fff"], ["Total de Cliques", totalCliques, "#fff"], ["Sites Disponíveis", 6, "#fff"]].map(([label, val, cor]) => (
          <div key={label as string} style={card}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: cor as string }}>{val as number}</div>
          </div>
        ))}
      </div>

      {/* Links Salvos (colapsável) */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>🔖</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Links Salvos</span>
          <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>0</span>
        </div>
      </div>

      {/* Criar novo link */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ color: "#22c55e" }}>⊕</span>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Criar novo link</span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>SITE</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={novoSite}
              onChange={e => setNovoSite(e.target.value)}
              placeholder="Filtrar por slug ou nome..."
              style={{ ...input, flex: "none", width: 240 }}
            />
            <select value={novoSite} onChange={e => setNovoSite(e.target.value)} style={{ ...input, flex: 1 }}>
              <option value="">— selecione o site —</option>
              {["larissacintrafreire", "nivaldodasilvacampos", "roseaneneribispo", "murilorochaqueiroz32321"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <div>
            <label style={lbl}>CAMINHO</label>
            <input value={novoCaminho} onChange={e => setNovoCaminho(e.target.value)} placeholder="ex: ig, promo" style={input} />
          </div>
          <div>
            <label style={lbl}>URL DE DESTINO</label>
            <input value={novoDestino} onChange={e => setNovoDestino(e.target.value)} placeholder="https://instagram.com/seuperfil" style={input} />
          </div>
          <button onClick={criarLink} style={btnGreen}>↗ Criar Link</button>
        </div>
      </div>

      {/* Tabela de links */}
      <div style={card}>
        <div style={{ marginBottom: 14 }}>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar links..." style={{ ...input, width: 300 }} />
          <span style={{ marginLeft: 12, fontSize: 12, color: "#555" }}>{filtrados.length} link(s)</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
              {["Site", "Link Gerado", "Destino", "Cliques", "Ações"].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((l, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0f0f0f" }}>
                <td style={td}>{l.site}</td>
                <td style={{ ...td, color: "#22c55e", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.linkGerado}</td>
                <td style={{ ...td, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.destino}</td>
                <td style={td}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "#22c55e", fontSize: 11 }}>↗</span> {l.cliques}
                  </span>
                </td>
                <td style={{ ...td, display: "flex", gap: 6 }}>
                  <Btn>Stats</Btn>
                  <Btn>Editar</Btn>
                  <Btn>Copiar</Btn>
                  <Btn cor="red" onClick={() => excluir(i)}>Excluir</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Btn({ children, onClick, cor = "green" }: any) {
  const c: Record<string, string> = { green: "#22c55e", red: "#ef4444" };
  return (
    <button onClick={onClick} style={{ padding: "4px 10px", background: c[cor] + "15", border: `1px solid ${c[cor]}33`, color: c[cor], borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
      {children}
    </button>
  );
}

const titulo: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" };
const card: React.CSSProperties = { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 20 };
const input: React.CSSProperties = { padding: "9px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", width: "100%" };
const lbl: React.CSSProperties = { display: "block", fontSize: 10, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 12px", fontSize: 10, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, color: "#ccc", verticalAlign: "middle" };
const btnGreen: React.CSSProperties = { padding: "9px 20px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" };
