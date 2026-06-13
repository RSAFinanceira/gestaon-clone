import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: "⊞" },
  { to: "/sites", label: "Meus Sites", icon: "🌐" },
  { to: "/sites/new", label: "Criar Site", icon: "+" },
  { to: "/portfolio", label: "Portfólio BM", icon: "🗂" },
  { to: "/waba", label: "WABAs", icon: "◎" },
  { to: "/proxies", label: "Proxies", icon: "⇄" },
  { to: "/listas", label: "Listas", icon: "☰" },
  { to: "/encurtador", label: "Encurtador", icon: "↗" },
  { to: "/chat", label: "Chat WA", icon: "💬" },
];

const temas = ["Clássico", "Claro", "Escuro"];

export default function Layout({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [tema, setTema] = useState("Clássico");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Sidebar */}
      <aside style={{
        width: 196,
        minHeight: "100vh",
        background: "#111111",
        borderRight: "1px solid #1e1e1e",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: "16px 16px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{
              width: 28, height: 28, background: "#22c55e", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#000"
            }}>N</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", lineHeight: 1 }}>Gestão N</div>
              <div style={{ fontSize: 9, color: "#22c55e", letterSpacing: "0.1em", textTransform: "uppercase" }}>Painel de Controle</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 8, padding: "4px 0" }}>rafaeladdad@gmail.com</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 8px 0", overflowY: "auto" }}>
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to !== "/sites/new"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 6,
                marginBottom: 2,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#22c55e" : "#aaa",
                background: isActive ? "rgba(34,197,94,0.1)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              })}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
              {item.label}
              {item.to === "/dashboard" && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e1e" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: "#aaa" }}>Tema {tema}</span>
            <button
              onClick={() => {
                const idx = temas.indexOf(tema);
                setTema(temas[(idx + 1) % temas.length]);
              }}
              style={{
                marginLeft: "auto", fontSize: 10, padding: "2px 8px",
                background: "transparent", border: "1px solid #22c55e",
                color: "#22c55e", borderRadius: 4, cursor: "pointer",
              }}
            >TROCAR</button>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "#aaa", background: "none",
              border: "none", cursor: "pointer", padding: 0,
            }}
          >
            <span>→</span> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 196, flex: 1, padding: "28px 32px", minHeight: "100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}
