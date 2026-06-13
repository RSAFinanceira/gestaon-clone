import { useNavigate } from "react-router-dom";

const ultimosSites = [
  { slug: "58660951daniellecoutocalil", dominio: "58660951daniellecoutocalil.gestaon.com", status: "Ativo" },
  { slug: "murilorochaqueiroz32321", dominio: "murilorochaqueiroz32321.ngestao.com.br", status: "Ativo" },
  { slug: "58844932roseaneneribispo", dominio: "58844932roseaneneribispo.ngestao.com.br", status: "Ativo" },
  { slug: "roseaneneribispo", dominio: "roseaneneribispo.ngestao.com.br", status: "Ativo" },
  { slug: "larissacintrafreire", dominio: "larissacintrafreire.ngestao.com.br", status: "Ativo" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" }}>
        Dashboard
      </h1>

      {/* Cards topo */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ color: "#22c55e", fontSize: 18 }}>📊</span>
            <span style={{ color: "#aaa", fontSize: 13 }}>Total de Sites</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>5</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>5 ativo(s)</div>
        </Card>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ color: "#22c55e", fontSize: 18 }}>⊕</span>
            <span style={{ color: "#aaa", fontSize: 13 }}>Criar Novo Site</span>
          </div>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>Gere seu site em segundos</p>
          <button
            onClick={() => navigate("/sites/new")}
            style={btnGreen}
          >+ Criar Site</button>
        </Card>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ color: "#22c55e", fontSize: 18 }}>🌐</span>
            <span style={{ color: "#aaa", fontSize: 13 }}>Meus Sites</span>
          </div>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>Gerencie todos os seus sites</p>
          <button onClick={() => navigate("/sites")} style={btnOutline}>Ver todos</button>
        </Card>
      </div>

      {/* Últimos sites */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Últimos sites</span>
          <a href="#" onClick={() => navigate("/sites")} style={{ color: "#22c55e", fontSize: 13, textDecoration: "none" }}>Ver todos →</a>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
              {["Slug", "Domínio", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ultimosSites.map(s => (
              <tr key={s.slug} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "10px 12px", fontSize: 13, color: "#ccc" }}>{s.slug}</td>
                <td style={{ padding: "10px 12px", fontSize: 13, color: "#22c55e" }}>{s.dominio}</td>
                <td style={{ padding: "10px 12px" }}><Badge cor="green">{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={cardStyle}>{children}</div>;
}

function Badge({ children, cor }: { children: React.ReactNode; cor: string }) {
  return (
    <span style={{
      padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: cor === "green" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
      color: cor === "green" ? "#22c55e" : "#ef4444",
    }}>{children}</span>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: "20px",
};
const btnGreen: React.CSSProperties = {
  padding: "8px 18px", background: "#22c55e", border: "none", borderRadius: 8,
  color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer",
};
const btnOutline: React.CSSProperties = {
  padding: "8px 18px", background: "transparent", border: "1px solid #333", borderRadius: 8,
  color: "#fff", fontSize: 13, cursor: "pointer",
};
