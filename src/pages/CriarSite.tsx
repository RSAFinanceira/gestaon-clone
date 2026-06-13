import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CriarSite() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cnpj: "", razaoSocial: "", nomeFantasia: "", dominioSlug: "",
    dominio: "rznbusiness.com", telefone: "", whatsapp: "", email: "",
    instagram: "", facebook: "", cnae: "",
    logradouro: "", numero: "", complemento: "",
    bairro: "", municipio: "", uf: "", cep: "",
    dataAbertura: "", naturezaJuridica: "", situacao: "ATIVA",
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    alert("Site criado com sucesso!");
    navigate("/sites");
  }

  return (
    <div>
      <h1 style={titulo}>Criar Site</h1>

      <div style={card}>
        {/* País */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #1e1e1e" }}>
          <span style={{ color: "#22c55e", fontSize: 16 }}>🌐</span>
          <span style={{ fontWeight: 600 }}>País / Country</span>
          <div style={{ marginLeft: 20 }}>
            <label style={label}>SELECIONAR PAÍS</label>
            <select style={{ ...input, width: 200 }}>
              <option>🇧🇷 Brasil +55</option>
              <option>🇺🇸 EUA +1</option>
            </select>
          </div>
          <div>
            <label style={label}>Documento fiscal</label>
            <div style={{ color: "#22c55e", fontWeight: 600 }}>CNPJ</div>
            <div style={{ fontSize: 11, color: "#555" }}>✓ Busca automática</div>
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Dados da Empresa</h2>

        <form onSubmit={salvar}>
          {/* Upload cartão CNPJ */}
          <div style={{
            border: "2px dashed #22c55e33", borderRadius: 10, padding: 20,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            marginBottom: 24, background: "#22c55e08",
          }}>
            <p style={{ fontSize: 13, color: "#aaa" }}>Tem o cartão CNPJ em PDF?</p>
            <button type="button" style={{ padding: "8px 20px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, cursor: "pointer" }}>
              ↑ Fazer upload do PDF
            </button>
          </div>

          {/* CNPJ */}
          <div style={row3}>
            <Field label="CNPJ" value={form.cnpj} onChange={update("cnpj")} placeholder="00.000.000/0000-00">
              <button type="button" style={{ padding: "9px 16px", background: "#22c55e", border: "none", borderRadius: "0 8px 8px 0", color: "#000", fontWeight: 700, cursor: "pointer", marginLeft: -1 }}>
                Buscar
              </button>
            </Field>
            <Field label="RAZÃO SOCIAL" value={form.razaoSocial} onChange={update("razaoSocial")} />
            <Field label="NOME FANTASIA" value={form.nomeFantasia} onChange={update("nomeFantasia")} />
          </div>

          {/* Domínio */}
          <div style={{ ...row3, marginTop: 16 }}>
            <Field label="DOMÍNIO SLUG" value={form.dominioSlug} onChange={update("dominioSlug")} />
            <div>
              <label style={label}>DOMÍNIO</label>
              <select value={form.dominio} onChange={update("dominio")} style={inputStyle}>
                {["rznbusiness.com", "ngestao.com.br", "gestaodon.com.br", "gestaon.com"].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <Field label="CNAE PRINCIPAL" value={form.cnae} onChange={update("cnae")} />
          </div>

          {/* Contato */}
          <div style={{ ...row3, marginTop: 16 }}>
            <Field label="TELEFONE" value={form.telefone} onChange={update("telefone")} />
            <Field label="WHATSAPP" value={form.whatsapp} onChange={update("whatsapp")} />
            <Field label="E-MAIL" value={form.email} onChange={update("email")} type="email" />
          </div>

          {/* Redes */}
          <div style={{ ...row3, marginTop: 16 }}>
            <Field label="INSTAGRAM" value={form.instagram} onChange={update("instagram")} />
            <Field label="FACEBOOK" value={form.facebook} onChange={update("facebook")} />
          </div>

          {/* Endereço */}
          <div style={{ ...row3, marginTop: 16 }}>
            <Field label="LOGRADOURO (RUA/AV)" value={form.logradouro} onChange={update("logradouro")} />
            <Field label="NÚMERO" value={form.numero} onChange={update("numero")} />
            <Field label="COMPLEMENTO" value={form.complemento} onChange={update("complemento")} />
          </div>
          <div style={{ ...row3, marginTop: 16 }}>
            <Field label="BAIRRO" value={form.bairro} onChange={update("bairro")} />
            <Field label="MUNICÍPIO / CITY" value={form.municipio} onChange={update("municipio")} />
            <Field label="UF" value={form.uf} onChange={update("uf")} />
            <Field label="CEP / ZIP" value={form.cep} onChange={update("cep")} />
          </div>

          {/* Dados legais */}
          <div style={{ ...row3, marginTop: 16 }}>
            <Field label="DATA DE ABERTURA" value={form.dataAbertura} onChange={update("dataAbertura")} type="date" />
            <Field label="NATUREZA JURÍDICA" value={form.naturezaJuridica} onChange={update("naturezaJuridica")} />
            <div>
              <label style={label}>SITUAÇÃO</label>
              <input value="ATIVA" disabled style={{ ...inputStyle, color: "#22c55e" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button type="button" onClick={() => navigate("/sites")} style={btnOutline}>Voltar</button>
            <button type="submit" style={btnGreen}>Criar Site</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label: lbl, value, onChange, placeholder, type = "text", children }: any) {
  return (
    <div>
      <label style={label}>{lbl}</label>
      <div style={{ display: "flex" }}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ ...inputStyle, borderRadius: children ? "8px 0 0 8px" : 8 }} />
        {children}
      </div>
    </div>
  );
}

const titulo: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" };
const card: React.CSSProperties = { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 24 };
const label: React.CSSProperties = { display: "block", fontSize: 10, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };
const input = inputStyle;
const row3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 };
const btnGreen: React.CSSProperties = { padding: "10px 24px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer" };
const btnOutline: React.CSSProperties = { padding: "10px 24px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 14, cursor: "pointer" };
