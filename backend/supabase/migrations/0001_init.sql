-- Fathom prototype schema.
--
-- Every table is owner-scoped and protected by row level security, so a user
-- can only ever read or write their own rows. The anon key is therefore safe
-- to ship to the browser: policies, not the client, decide what is visible.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- profiles --
-- Mirrors auth.users and carries what onboarding collects.

create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text        not null,
  full_name     text,
  avatar_url    text,
  department    text,
  role_title    text,
  crm           text,
  use_case      text check (use_case in ('solo', 'team')),
  record_scope  text        not null default 'all_calendar',
  share_scope   text        not null default 'all_attendees',
  consented_at  timestamptz,
  onboarded_at  timestamptz,
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "own profile: read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile: insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile: update" on public.profiles for update using (auth.uid() = id);

-- A row exists the moment someone signs up, so the app never has to branch on
-- "profile not created yet".
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------ integrations --
-- One row per connected provider. Tokens are written by the server only.

create table if not exists public.integrations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  provider      text not null check (provider in ('google_calendar','zoom','teams','google_meet')),
  status        text not null default 'connected' check (status in ('connected','partial','disconnected')),
  account_email text,
  access_token  text,
  refresh_token text,
  expires_at    timestamptz,
  scopes        text[],
  connected_at  timestamptz not null default now(),
  unique (user_id, provider)
);

alter table public.integrations enable row level security;

-- Deliberately no select on token columns from the browser: the app reads
-- integration status through a view, and tokens stay server-side.
create policy "own integrations: all" on public.integrations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace view public.integration_status
with (security_invoker = true) as
  select user_id, provider, status, account_email, connected_at
  from public.integrations;

-- --------------------------------------------------------------- meetings --

create table if not exists public.meetings (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users on delete cascade,
  title          text not null,
  meeting_date   date not null,
  start_time     text,
  meeting_code   text,
  platform       text not null default 'Google Meet',
  duration_sec   integer not null default 0,
  poster_from    text not null default '#8e1141',
  poster_to      text not null default '#3d0a1e',
  recording_url  text,
  external_id    text,
  created_at     timestamptz not null default now()
);

create index if not exists meetings_user_date_idx
  on public.meetings (user_id, meeting_date desc);

alter table public.meetings enable row level security;
create policy "own meetings: all" on public.meetings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------- participants --

create table if not exists public.participants (
  id         uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings on delete cascade,
  name       text not null,
  email      text,
  role_title text,
  company    text,
  color      text not null default '#c2185b',
  is_owner   boolean not null default false
);

create index if not exists participants_meeting_idx on public.participants (meeting_id);
alter table public.participants enable row level security;

-- Child rows inherit access from the meeting they belong to.
create policy "participants via meeting" on public.participants
  for all using (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  );

-- ------------------------------------------------------------- transcript --

create table if not exists public.transcript_turns (
  id           uuid primary key default gen_random_uuid(),
  meeting_id   uuid not null references public.meetings on delete cascade,
  speaker_name text not null,
  t_sec        integer not null,
  sentences    jsonb not null default '[]'::jsonb
);

create index if not exists turns_meeting_t_idx on public.transcript_turns (meeting_id, t_sec);
alter table public.transcript_turns enable row level security;

create policy "turns via meeting" on public.transcript_turns
  for all using (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  );

-- --------------------------------------------------------------- summaries --
-- One row per template, so switching templates is a lookup not a regeneration.

create table if not exists public.summaries (
  id         uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings on delete cascade,
  template   text not null,
  sections   jsonb not null default '[]'::jsonb,
  unique (meeting_id, template)
);

alter table public.summaries enable row level security;
create policy "summaries via meeting" on public.summaries
  for all using (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  );

-- ------------------------------------------------------------ action items --

create table if not exists public.action_items (
  id         uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings on delete cascade,
  text       text not null,
  owner_name text,
  t_sec      integer not null default 0,
  done       boolean not null default false,
  manual     boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists action_items_meeting_idx on public.action_items (meeting_id);
alter table public.action_items enable row level security;

create policy "action items via meeting" on public.action_items
  for all using (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  );

-- -------------------------------------------------------------- highlights --

create table if not exists public.highlights (
  id         uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings on delete cascade,
  kind       text not null default 'highlight',
  t_sec      integer not null,
  end_sec    integer,
  note       text not null default '',
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists highlights_meeting_idx on public.highlights (meeting_id);
alter table public.highlights enable row level security;

create policy "highlights via meeting" on public.highlights
  for all using (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.meetings m where m.id = meeting_id and m.user_id = auth.uid())
  );

-- --------------------------------------------------------------- playlists --

create table if not exists public.playlists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  name       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.playlists enable row level security;
create policy "own playlists: all" on public.playlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.playlist_items (
  id           uuid primary key default gen_random_uuid(),
  playlist_id  uuid not null references public.playlists on delete cascade,
  meeting_id   uuid not null references public.meetings on delete cascade,
  highlight_id uuid references public.highlights on delete set null,
  kind         text not null default 'highlight',
  note         text not null default '',
  t_sec        integer not null default 0,
  end_sec      integer,
  added_at     timestamptz not null default now()
);

create index if not exists playlist_items_playlist_idx on public.playlist_items (playlist_id);
alter table public.playlist_items enable row level security;

create policy "playlist items via playlist" on public.playlist_items
  for all using (
    exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
  );

-- ------------------------------------------------------- calendar events --
-- Cache of the connected calendar, so the app has upcoming meetings to show
-- without hitting Google on every render.

create table if not exists public.calendar_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  external_id   text not null,
  title         text not null,
  starts_at     timestamptz not null,
  ends_at       timestamptz,
  platform      text,
  join_url      text,
  attendees     integer not null default 0,
  auto_record   boolean not null default true,
  synced_at     timestamptz not null default now(),
  unique (user_id, external_id)
);

create index if not exists calendar_events_user_start_idx
  on public.calendar_events (user_id, starts_at);

alter table public.calendar_events enable row level security;
create policy "own events: all" on public.calendar_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
