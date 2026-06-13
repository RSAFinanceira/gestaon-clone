import { useState } from "react";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) { setErro("Preencha todos os campos."); return; }
    if (email !== "rsacred@rsapromotora.com" || senha !== "Rsa10@") {
      setErro("E-mail ou senha incorretos.");
      return;
    }
    onLogin();
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 360, background: "#141414", border: "1px solid #1e1e1e",
        borderRadius: 16, padding: "36px 32px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e",
            borderRadius: 20, padding: "4px 14px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>✦ GESTÃO N</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
            Acesse sua <span style={{ color: "#22c55e" }}>conta</span>
          </h1>
          <p style={{ fontSize: 13, color: "#666" }}>Painel de controle</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, color: "#666", letterSpacing: "0.08em", marginBottom: 6 }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                width: "100%", padding: "10px 14px", background: "#1a1a1a",
                border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff",
                fontSize: 14, outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, color: "#666", letterSpacing: "0.08em", marginBottom: 6 }}>SENHA</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "10px 14px", background: "#1a1a1a",
                border: "1px solid #22c55e", borderRadius: 8, color: "#fff",
                fontSize: 14, outline: "none",
              }}
            />
          </div>
          {erro && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{erro}</p>}
          <button
            type="submit"
            style={{
              width: "100%", padding: "12px", background: "#22c55e",
              border: "none", borderRadius: 8, color: "#000",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}
          >Entrar</button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#555", marginTop: 20 }}>
          Não tem conta?{" "}
          <a href="#" style={{ color: "#22c55e", textDecoration: "none" }}>Criar conta</a>
        </p>
      </div>
    </div>
  );
}
