import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const abas = ["Dados", "Endereço", "Textos", "Verificação", "HTML"];

const htmlPreview = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8"/>
    <title>58.660.951 DANIELLE COUTO CALIL</title>
    <meta name="facebook-domain-verification" content="t1v21qjamh5i7ousw303we0bw0dukr" />
  </head>
  <body>
    <header>
      <h1>58.660.951 DANIELLE COUTO CALIL</h1>
      <p>CNPJ: 58.660.951/0001-77</p>
    </header>
    <section><!-- Sobre: Nossa História
    A 58.660.951 DANIELLE COUTO CALIL começou em 2025-01-07 com um o... --></section>
    <section>
      <!-- Endereço: Rua Domacil Aparicio Roque, 340, Parque Ibirapuera, Tupã, SP -->
      <!-- Tel: 1491782357 | Email: contato@58660951daniellecoutocalil.com -->
    </section>
    <footer>58.660.951 DANIELLE COUTO CALIL | CNPJ: 58.660.951/0001-77 | Tupã/SP | CEP: 17602-134 | (14) 9178-2357 | contato@58660951daniellecoutocalil.com</footer>
  </body>
</html>`;

const logAtividade = [
  { tipo: "Acesso", data: "13/06/2026, 10:23:19" },
  { tipo: "Acesso", data: "13/06/2026, 10:23:15" },
  { tipo: "Acesso", data: "13/06/2026, 10:23:06" },
  { tipo: "Acesso", data: "13/06/2026, 10:23:05" },
  { tipo: "Acesso", data: "13/06/2026, 10:22:56" },
];

export default function EditarSite() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [aba, setAba] = useState("Dados");
  const [metaTag] = useState(`<meta name="facebook-domain-verification" content="t1v21qjamh5i7ousw303we0bw0dukr" />`);
  const [publico, setPublico] = useState(true);
  const [form, setForm] = useState({
    razaoSocial: "58.660.951 DANIELLE COUTO CALIL",
    nomeFantasia: "58.660.951 DANIELLE COUTO CALIL",
    dominioSlug: "58660951daniellecoutocalil",
    cnpj: "58.660.951/0001-77",
    dataAbertura: "",
    situacao: "Ativa",
    cnae: "Preparação de Documentos e Serviços Especializados de Apoio Adminis...",
    natureza: "Empresário (individual)",
    pais: "BR",
    telefone: "1491782357",
    whatsapp: "1491782357",
    email: "contato@58660951daniellecoutocalil.com",
    instagram: "https://instagram.com/58660951daniellecoutocalil",
    facebook: "https://facebook.com/58660951daniellecoutocalil",
    logradouro: "Rua Domacil Aparicio Roque",
    numero: "340",
    complemento: "",
    bairro: "Parque Ibirapuera",
    municipio: "Tupã",
    uf: "SP",
    cep: "17602-134",
    missao: "Nossa missão na 58.660.951 DANIELLE COUTO CALIL é proporcionar a melhor experiência em Preparação de Documentos e Serviços Especializados de Apoio Administrativo Não Especificados Anteriormente, priorizando a satisfação dos clientes em Tupã/SP.",
    rodape: "58.660.951 DANIELLE COUTO CALIL | CNPJ: 58.660.951/0001-77 | Tupã/SP | CEP: 17602-134 | (14) 9178-2357 | contato@58660951daniellecoutocalil.com",
    sobreNos: "Nossa História\n\nA 58.660.951 DANIELLE COUTO CALIL começou em 2025-01-07 com um objetivo: ser referência em Preparação de Documentos e Serviços Especializados de Apoio Administrativo Não Especificados Anteriormente em Tupã/SP.\n\nCNPJ: 58.660.951/0001-77",
    privacidade: "Política de Privacidade\n\nA 58.660.951 DANIELLE COUTO CALIL (CNPJ: 58.660.951/0001-77) está comprometida com a proteção dos seus dados pessoais, conforme a LGPD — Lei nº 13.709/2018.",
  });

  const up = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <h1 style={titulo}>Editar Site</h1>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, background: "#141414", border: "1px solid #1e1e1e", borderRadius: 10, padding: "12px 20px" }}>
        <div>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 3 }}>Site público</div>
          <a href="#" style={{ color: "#22c55e", fontSize: 13 }}>https://{slug}.ngestao.com.br</a>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ padding: "3px 12px", background: "rgba(34,197,94,0.15)", color: "#22c55e", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Ativo</span>
          <a href="#" style={{ color: "#22c55e", fontSize: 13, textDecoration: "none" }}>Ver Site ↗</a>
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 24 }}>
        {abas.map(a => (
          <button key={a} onClick={() => setAba(a)} style={{
            padding: "10px", border: "none", borderRadius: 8, cursor: "pointer",
            background: aba === a ? "#22c55e" : "#141414",
            color: aba === a ? "#000" : "#aaa", fontWeight: aba === a ? 700 : 400, fontSize: 13,
          }}>{a}</button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div style={card}>
        {aba === "Dados" && (
          <>
            <h2 style={subtitulo}>Dados da Empresa</h2>
            <div style={row3}>
              <F label="RAZÃO SOCIAL" value={form.razaoSocial} onChange={up("razaoSocial")} />
              <F label="NOME FANTASIA" value={form.nomeFantasia} onChange={up("nomeFantasia")} />
              <F label="DOMÍNIO SLUG" value={form.dominioSlug} onChange={up("dominioSlug")} />
            </div>
            <div style={{ ...row3, marginTop: 16 }}>
              <F label="CNPJ" value={form.cnpj} onChange={up("cnpj")} />
              <F label="DATA DE ABERTURA" value={form.dataAbertura} onChange={up("dataAbertura")} type="date" />
              <F label="SITUAÇÃO CADASTRAL" value={form.situacao} onChange={up("situacao")} />
            </div>
            <div style={{ ...row3, marginTop: 16 }}>
              <F label="CNAE PRINCIPAL" value={form.cnae} onChange={up("cnae")} />
              <F label="NATUREZA JURÍDICA" value={form.natureza} onChange={up("natureza")} />
              <F label="PAÍS" value={form.pais} onChange={up("pais")} />
            </div>
            <div style={{ ...row3, marginTop: 16 }}>
              <F label="TELEFONE" value={form.telefone} onChange={up("telefone")} />
              <F label="WHATSAPP" value={form.whatsapp} onChange={up("whatsapp")} />
              <F label="E-MAIL" value={form.email} onChange={up("email")} type="email" />
            </div>
            <div style={{ ...row3, marginTop: 16 }}>
              <F label="INSTAGRAM" value={form.instagram} onChange={up("instagram")} />
              <F label="FACEBOOK" value={form.facebook} onChange={up("facebook")} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
              <input type="checkbox" checked={publico} onChange={e => setPublico(e.target.checked)} id="pub" style={{ accentColor: "#22c55e", width: 16, height: 16 }} />
              <label htmlFor="pub" style={{ fontSize: 13, color: "#aaa", cursor: "pointer" }}>DEIXAR SITE PÚBLICO</label>
            </div>
          </>
        )}

        {aba === "Endereço" && (
          <>
            <h2 style={subtitulo}>Endereço Completo</h2>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>Este endereço aparece no site e é exigido pelo Meta para verificação.</p>
            <div style={row3}>
              <F label="LOGRADOURO (RUA/AV)" value={form.logradouro} onChange={up("logradouro")} />
              <F label="NÚMERO" value={form.numero} onChange={up("numero")} />
              <F label="COMPLEMENTO" value={form.complemento} onChange={up("complemento")} />
            </div>
            <div style={{ ...row3, marginTop: 16 }}>
              <F label="BAIRRO" value={form.bairro} onChange={up("bairro")} />
              <F label="MUNICÍPIO / CITY" value={form.municipio} onChange={up("municipio")} />
              <F label="UF" value={form.uf} onChange={up("uf")} />
              <F label="CEP / ZIP" value={form.cep} onChange={up("cep")} />
            </div>
            <div style={{ marginTop: 20, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>Preview no site:</div>
              <div style={{ fontSize: 13, color: "#ccc" }}>{form.logradouro}, {form.numero} — {form.bairro}, {form.municipio}/{form.uf} · CEP: {form.cep}</div>
            </div>
          </>
        )}

        {aba === "Textos" && (
          <>
            <h2 style={subtitulo}>Textos do Site</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={lbl}>NOSSA MISSÃO</label>
                <textarea value={form.missao} onChange={up("missao")} rows={5} style={tarea} />
              </div>
              <div>
                <label style={lbl}>RODAPÉ</label>
                <textarea value={form.rodape} onChange={up("rodape")} rows={5} style={tarea} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>SOBRE NÓS</label>
                <textarea value={form.sobreNos} onChange={up("sobreNos")} rows={6} style={tarea} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>POLÍTICA DE PRIVACIDADE</label>
                <textarea value={form.privacidade} onChange={up("privacidade")} rows={6} style={tarea} />
              </div>
            </div>
          </>
        )}

        {aba === "Verificação" && (
          <>
            <h2 style={subtitulo}>Verificar Domínio no Meta Business</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, marginBottom: 24 }}>
              {["Meta Tag", "Arquivo HTML", "DNS TXT"].map((m, i) => (
                <button key={m} style={{
                  padding: "10px", border: "none", borderRadius: 8, cursor: "pointer",
                  background: i === 0 ? "#22c55e" : "#1a1a1a",
                  color: i === 0 ? "#000" : "#aaa", fontWeight: i === 0 ? 700 : 400, fontSize: 13,
                }}>{m}</button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 8 }}>
              No Meta BM: <strong style={{ color: "#fff" }}>Configurações → Brand Safety → Domínios → Verificar → Adicionar metatag</strong>
            </p>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>Cole a meta tag abaixo e clique em Salvar.</p>
            <label style={lbl}>META TAG DO FACEBOOK</label>
            <textarea value={metaTag} readOnly rows={3} style={{ ...tarea, color: "#22c55e" }} />
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e33", borderRadius: 8, padding: "10px 16px", marginTop: 12, marginBottom: 16, fontSize: 12, color: "#22c55e" }}>
              ✓ Meta tag configurada. Código: t1v21qjamh5i7ousw303we0bw0dukr
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button style={{ padding: "8px 18px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Testar Meta Tag</button>
              <button style={{ padding: "8px 18px", background: "transparent", border: "1px solid #3b82f6", borderRadius: 8, color: "#3b82f6", fontSize: 13, cursor: "pointer" }}>↻ Verificar atividade da Meta</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#22c55e" }}>● Atividade da Meta — {logAtividade.length} registro(s)</span>
              <button style={{ padding: "4px 12px", background: "transparent", border: "1px solid #333", borderRadius: 6, color: "#aaa", fontSize: 11, cursor: "pointer" }}>⊞ Atualizar</button>
            </div>
            {logAtividade.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "6px 12px", fontSize: 12, borderBottom: "1px solid #111" }}>
                <span style={{ color: "#22c55e" }}>●</span>
                <span style={{ color: "#22c55e" }}>{l.tipo}</span>
                <span style={{ color: "#555" }}>{l.data}</span>
              </div>
            ))}
          </>
        )}

        {aba === "HTML" && (
          <>
            <h2 style={subtitulo}>Preview HTML</h2>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Visualização do código. Edite pelo painel Dados, Endereço e Textos.</p>
            <pre style={{
              background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 8,
              padding: 20, fontSize: 12, color: "#ccc", overflowX: "auto",
              lineHeight: 1.8, whiteSpace: "pre-wrap",
            }}>{htmlPreview}</pre>
          </>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button onClick={() => navigate("/sites")} style={btnOutline}>Voltar</button>
          <button onClick={() => alert("Salvo!")} style={btnGreen}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
}

function F({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input type={type} value={value} onChange={onChange} style={inputSt} />
    </div>
  );
}

const titulo: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #22c55e", paddingBottom: 10, display: "inline-block" };
const card: React.CSSProperties = { background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 24 };
const subtitulo: React.CSSProperties = { fontSize: 16, fontWeight: 600, marginBottom: 20 };
const lbl: React.CSSProperties = { display: "block", fontSize: 10, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 };
const inputSt: React.CSSProperties = { width: "100%", padding: "9px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };
const tarea: React.CSSProperties = { width: "100%", padding: "10px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "monospace" };
const row3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 };
const btnGreen: React.CSSProperties = { padding: "10px 24px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer" };
const btnOutline: React.CSSProperties = { padding: "10px 24px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#fff", fontSize: 14, cursor: "pointer" };
