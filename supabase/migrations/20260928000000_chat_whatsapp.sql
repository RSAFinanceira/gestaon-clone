-- Chat de atendimento WhatsApp (QR Code via Evolution API + Cloud API oficial)
-- Todas as tabelas têm RLS ligado e SEM políticas: só as Edge Functions
-- (service role) leem/escrevem. Tokens nunca chegam ao navegador.

create table public.wa_conexoes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('qrcode', 'oficial')),
  nome text not null,
  status text not null default 'desconectado'
    check (status in ('desconectado', 'aguardando_qr', 'conectado')),
  -- QR Code (Evolution API)
  servidor text,
  api_key text,
  instancia text,
  -- API oficial (Cloud API)
  phone_number_id text unique,
  waba_id text,
  token text,
  verify_token text,
  versao text not null default 'v21.0',
  criado_em timestamptz not null default now()
);

create table public.wa_conversas (
  id uuid primary key default gen_random_uuid(),
  conexao_id uuid references public.wa_conexoes(id) on delete set null,
  numero text not null,
  nome text,
  status text not null default 'aberto' check (status in ('aberto', 'pendente', 'resolvido')),
  nao_lidas int not null default 0,
  ultima_mensagem text,
  ultima_em timestamptz not null default now(),
  unique (conexao_id, numero)
);
create index wa_conversas_ultima_em_idx on public.wa_conversas (ultima_em desc);

create table public.wa_mensagens (
  id uuid primary key default gen_random_uuid(),
  conversa_id uuid not null references public.wa_conversas(id) on delete cascade,
  direcao text not null check (direcao in ('entrada', 'saida')),
  texto text,
  tipo text not null default 'text',
  wa_id text,
  status text,
  erro text,
  criado_em timestamptz not null default now()
);
create index wa_mensagens_conversa_idx on public.wa_mensagens (conversa_id, criado_em);
create unique index wa_mensagens_wa_id_idx on public.wa_mensagens (wa_id) where wa_id is not null;

alter table public.wa_conexoes enable row level security;
alter table public.wa_conversas enable row level security;
alter table public.wa_mensagens enable row level security;
