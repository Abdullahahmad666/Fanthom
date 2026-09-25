-- Cue: make the meeting record addressable and searchable.
--
-- Two things the first schema left out, both needed before the app can stop
-- reading fixtures:
--
--   1. A slug. Meetings were keyed by uuid, but every link in the product is
--      human-facing -- a shared clip, a search result, a browser tab. A uuid
--      in the URL is a worse product, so meetings carry a readable slug that
--      is unique per owner.
--
--   2. Searchable transcript text. The turns table stores sentences as jsonb,
--      which Postgres cannot index for full-text search. A plain text mirror
--      plus a generated tsvector makes "find the moment someone said X"
--      an index scan rather than a table scan in application code.

-- ----------------------------------------------------------------- slugs --

alter table public.meetings
  add column if not exists slug text;

-- Backfill anything already seeded, then make it required.
update public.meetings
set slug = regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')
where slug is null;

update public.meetings m
set slug = m.slug || '-' || substr(m.id::text, 1, 6)
where exists (
  select 1 from public.meetings o
  where o.user_id = m.user_id and o.slug = m.slug and o.id <> m.id
);

alter table public.meetings
  alter column slug set not null;

create unique index if not exists meetings_user_slug_idx
  on public.meetings (user_id, slug);

-- ------------------------------------------------------- transcript search --

alter table public.transcript_turns
  add column if not exists text_content text not null default '';

-- Backfill from the jsonb the app already wrote.
update public.transcript_turns
set text_content = coalesce(
  (select string_agg(s ->> 'text', ' ') from jsonb_array_elements(sentences) s),
  ''
)
where text_content = '';

alter table public.transcript_turns
  add column if not exists search tsvector
  generated always as (to_tsvector('english', text_content)) stored;

create index if not exists turns_search_idx
  on public.transcript_turns using gin (search);

-- ------------------------------------------------------------ ingestion --
-- Where a meeting's transcript came from, so the UI can be honest about it
-- rather than implying we recorded the call.

alter table public.meetings
  add column if not exists source text not null default 'import'
  check (source in ('import', 'calendar', 'seed', 'recording'));

alter table public.meetings
  add column if not exists source_filename text;
