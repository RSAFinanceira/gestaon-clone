import { useState } from "react";

const conversasIniciais = [
  { nome: "Teste Usuario", ultima: "oi", hora: "03:14", avatar: "T", naoLidas: 0 },
];

const mensagensIniciais: Record<string, { de: "eu" | "outro"; texto: string; hora: string }[]> = {
  "Teste Usuario": [
    { de: "outro", texto: "oi", hora: "03:14" },
  ],
};

export default function ChatWA() {
  const [conversaSel, setConversaSel] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [msgs, setMsgs] = useState(mensagensIniciais);
  const [busca, setBusca] = useState("");

  function enviar() {
    if (!mensagem.trim() || !conversaSel) return;
    const agora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setMsgs(prev => ({
      ...prev,
      [conversaSel]: [...(prev[conversaSel] || []), { de: "eu", texto: mensagem, hora: agora }],
    }));
    setMensagem("");
  }

  const conversasFiltradas = conversasIniciais.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <h1 style={titulo}>Chat WhatsApp</h1>

      <div style={{ display: "flex", height: "calc(100vh - 120px)", border: "1px solid #1e1e1e", borderRadius: 12, overflow: "hidden" }}>
        {/* Lista de conversas */}
        <div style={{ width: 280, borderRight: "1px solid #1e1e1e", background: "#111", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Conversas</span>
            <button style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16 }}>⚙</button>
          </div>
          <div style={{ padding: "8px 12px" }}>
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar..."
              style={{ width: "100%", padding: "7px 10px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 12, outline: "none" }}
            />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversasFiltradas.map(c => (
              <div
                key={c.nome}
                onClick={() => setConversaSel(c.nome)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", cursor: "pointer",
                  background: conversaSel === c.nome ? "rgba(34,197,94,0.1)" : "transparent",
                  borderLeft: conversaSel === c.nome ? "3px solid #22c55e" : "3px solid transparent",
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "#22c55e22", color: "#22c55e",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>{c.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.nome}</span>
                    <span style={{ fontSize: 11, color: "#555" }}>{c.hora}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.ultima}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de chat */}
        {conversaSel ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0d0d0d" }}>
            {/* Header da conversa */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", gap: 10, background: "#111" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#22c55e22", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {conversaSel[0]}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{conversaSel}</span>
            </div>

            {/* Mensagens */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
              {(msgs[conversaSel] || []).map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.de === "eu" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "60%", padding: "8px 14px", borderRadius: m.de === "eu" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.de === "eu" ? "#22c55e" : "#1e1e1e",
                    color: m.de === "eu" ? "#000" : "#fff", fontSize: 13,
                  }}>
                    {m.texto}
                    <div style={{ fontSize: 10, color: m.de === "eu" ? "#00000066" : "#555", marginTop: 4, textAlign: "right" }}>{m.hora}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input mensagem */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e1e", display: "flex", gap: 8, background: "#111" }}>
              <input
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                onKeyDown={e => e.key === "Enter" && enviar()}
                placeholder="Digite uma mensagem..."
                style={{ flex: 1, padding: "9px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 24, color: "#fff", fontSize: 13, outline: "none" }}
              />
              <button onClick={enviar} style={{ width: 40, height: 40, background: "#22c55e", border: "none", borderRadius: "50%", color: "#000", fontSize: 16, cursor: "pointer" }}>↑</button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0d0d0d", gap: 12 }}>
            <div style={{ fontSize: 40 }}>💬</div>
            <p style={{ fontSize: 14, color: "#555" }}>Selecione uma conversa</p>
            <a href="#" style={{ color: "#22c55e", fontSize: 13 }}>Configure um número →</a>
          </div>
        )}
      </div>
    </div>
  );
}

const titulo: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" };
