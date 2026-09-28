# Chat de Atendimento WhatsApp — Guia de configuração

## Arquitetura

```
Painel (React) ──x-painel-key──▶ Edge Function wa-api ──▶ Evolution API (QR) / Graph API (Meta)
                                        │
Meta / Evolution ──webhook──▶ Edge Function wa-webhook ──▶ Postgres (wa_conexoes, wa_conversas, wa_mensagens)
```

Os tokens ficam só no banco (RLS ligado, sem políticas → só as funções acessam).

## 1. Supabase

1. Crie um projeto em https://supabase.com/dashboard (região São Paulo).
2. Aplique `supabase/migrations/20260928000000_chat_whatsapp.sql` (SQL Editor, ou `supabase db push`).
3. Publique as funções **com verify_jwt desligado** (elas fazem a própria autenticação):
   ```bash
   supabase link --project-ref SEU_REF
   supabase functions deploy wa-api --no-verify-jwt
   supabase functions deploy wa-webhook --no-verify-jwt
   supabase secrets set PAINEL_KEY="uma-senha-longa-e-aleatoria"
   ```
4. No projeto do painel, crie `.env` com `VITE_SUPABASE_URL=https://SEU_REF.supabase.co`.
5. Abra **Chat WA** e informe a `PAINEL_KEY`.

## 2. QR Code (WhatsApp Business app)

Precisa de um servidor [Evolution API](https://doc.evolution-api.com) (v2) rodando (VPS com Docker).
No painel › Conexões › QR Code: informe URL, API Key global e um nome de instância.
O webhook da instância é configurado automaticamente.

## 3. API oficial (Meta) — passo a passo

1. **Conta de desenvolvedor:** acesse https://developers.facebook.com, entre com seu Facebook,
   clique em **Começar** e confirme telefone/e-mail.
2. **Portfólio empresarial:** em https://business.facebook.com crie (ou use) o portfólio da empresa.
   Para passar do limite inicial, faça a **verificação da empresa** (Configurações › Central de segurança), com CNPJ e documentos.
3. **Criar o app:** developers.facebook.com › Meus apps › **Criar app** › caso de uso
   "Conectar-se com clientes pelo WhatsApp" (ou tipo **Empresa**) › vincule ao portfólio.
4. **Adicionar WhatsApp:** no app, adicione o produto **WhatsApp** › **Configuração da API**.
   Ali você vê um número de teste, o **Phone Number ID** e o **WABA ID**.
5. **Número real:** em Configuração da API › **Adicionar número de telefone**. O número
   **não pode estar ativo no app WhatsApp** (apague a conta no app antes ou use um número novo).
   Confirme por SMS/ligação e defina o nome de exibição.
6. **Token permanente:** business.facebook.com › Configurações › **Usuários do sistema** ›
   Adicionar (Admin) › Atribuir ativos (o app e a conta do WhatsApp, controle total) ›
   **Gerar token** com as permissões `whatsapp_business_messaging` e `whatsapp_business_management`, validade "Nunca".
7. **Webhook:** no app › WhatsApp › **Configuração** › Webhook › Editar:
   - URL de callback: `https://SEU_REF.supabase.co/functions/v1/wa-webhook`
   - Verify token: o mesmo cadastrado no painel (cadastre a conexão no painel **antes**)
   - Depois clique em **Gerenciar** e assine o campo **messages**.
8. **Forma de pagamento:** em business.facebook.com › Configurações da conta do WhatsApp ›
   adicione cartão (conversas iniciadas por você são cobradas).
9. **Publicar o app:** mude o app para modo **Ativo/Live** (exige URL de política de privacidade).

Regra importante da Meta: fora da janela de 24h após a última mensagem do cliente,
só é possível enviar **modelos (templates) aprovados**. Texto livre funciona dentro da janela.
