import { useState } from "react";
import { useNavigate } from "react-router-dom";

const sitesData = [
  { slug: "58660951daniellecoutocalil", dominio: "58660951daniellecoutocalil.ngestao.com.br", empresa: "58.660.951 DANIELLE COUTO CALIL", status: "Ativo" },
  { slug: "murilorochaqueiroz32321", dominio: "murilorochaqueiroz32321.ngestao.com.br", empresa: "58.837.967 MURILO ROCHA QUEIROZ", status: "Ativo" },
  { slug: "58844932roseaneneribispo", dominio: "58844932roseaneneribispo.ngestao.com.br", empresa: "58.844.932 ROSEANE NERI BISPO", status: "Ativo" },
  { slug: "roseaneneribispo", dominio: "roseaneneribispo.ngestao.com.br", empresa: "58.844.932 ROSEANE NERI BISPO", status: "Ativo" },
  { slug: "larissacintrafreire", dominio: "larissacintrafreire.ngestao.com.br", empresa: "58.971.084 LARISSA CINTRA FREIRE", status: "Ativo" },
  { slug: "nivaldodasilvacampos", dominio: "nivaldodasilvacampos.gestaodon.com.br", empresa: "58.662.572 NIVALDO DA SILVA CAMPOS", status: "Ativo" },
];

export default function MeusSites() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [sites, setSites] = useState(sitesData);

  const filtrados = sites.filter(s => {
    const matchBusca = s.slug.includes(busca.toLowerCase()) || s.empresa.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === "Todos" || s.status === filtro;
    return matchBusca && matchFiltro;
  });

  function ocultar(slug: string) {
    setSites(prev => prev.map(s => s.slug === slug ? { ...s, status: s.status === "Ativo" ? "Oculto" : "Ativo" } : s));
  }
  function excluir(slug: string) {
    if (confirm("Deseja realmente excluir este site?")) {
      setSites(prev => prev.filter(s => s.slug !== slug));
    }
  }

  return (
    <div>
      <h1 style={titulo}>Meus Sites</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[["Total", sites.length], ["Ativos", sites.filter(s => s.status === "Ativo").length, "#22c55e"], ["Ocultos", sites.filter(s => s.status === "Oculto").length, "#ef4444"]].map(([label, val, cor]) => (
          <div key={label as string} style={card}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: (cor as string) || "#fff" }}>{val as number}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Pesquisar por slug ou nome..."
            style={input}
          />
          <select value={filtro} onChange={e => setFiltro(e.target.value)} style={{ ...input, width: 140, flex: "none" }}>
            {["Todos", "Ativo", "Oculto"].map(o => <option key={o}>{o}</option>)}
          </select>
          <button onClick={() => navigate("/sites/new")} style={btnGreen}>+ Criar Site</button>
        </div>

        <p style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>{filtrados.length} site(s) encontrado(s)</p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
              {["Slug", "Domínio", "Empresa", "Status", "Ações"].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(s => (
              <tr key={s.slug} style={{ borderBottom: "1px solid #0f0f0f" }}>
                <td style={td}>{s.slug}</td>
                <td style={{ ...td, color: "#22c55e" }}>{s.dominio}</td>
                <td style={td}>{s.empresa}</td>
                <td style={td}><Badge cor={s.status === "Ativo" ? "green" : "gray"}>{s.status}</Badge></td>
                <td style={{ ...td, display: "flex", gap: 6 }}>
                  <Btn onClick={() => navigate(`/sites/${s.slug}/edit`)}>Editar</Btn>
                  <Btn onClick={() => ocultar(s.slug)} cor="gray">{s.status === "Ativo" ? "Ocultar" : "Ativar"}</Btn>
                  <Btn onClick={() => excluir(s.slug)} cor="red">Excluir</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Badge({ children, cor }: { children: React.ReactNode; cor: string }) {
  const cores: Record<string, string> = { green: "#22c55e", gray: "#888", red: "#ef4444" };
  return (
    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: cores[cor] + "22", color: cores[cor] }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, cor = "green" }: { children: React.ReactNode; onClick?: () => void; cor?: string }) {
  const bg: Record<string, string> = { green: "rgba(34,197,94,0.1)", gray: "rgba(100,100,100,0.1)", red: "rgba(239,68,68,0.1)" };
  const cl: Record<string, string> = { green: "#22c55e", gray: "#aaa", red: "#ef4444" };
  return (
    <button onClick={onClick} style={{ padding: "4px 12px", background: bg[cor], border: `1px solid ${cl[cor]}33`, color: cl[cor], borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
      {children}
    </button>
  );
}

const titulo: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" };
const card: React.CSSProperties = { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 20 };
const input: React.CSSProperties = { flex: 1, padding: "8px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };
const btnGreen: React.CSSProperties = { padding: "8px 18px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" };
const th: React.CSSProperties = { textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, color: "#ccc" };
