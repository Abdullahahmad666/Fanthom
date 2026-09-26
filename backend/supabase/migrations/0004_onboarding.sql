-- Cue's onboarding, replacing the one inherited from the reference product.
--
-- The old flow collected department, job title, CRM, solo-vs-team, a recording
-- scope and a sharing scope. Cue uses none of them: it has no CRM integration,
-- no team features, no calendar and it never records anything. Three of those
-- five steps told the user something untrue about what the product was about
-- to do on their behalf.
--
-- The replacement asks for two things and uses both:
--
--   full_name           already existed -- now actually collected and shown
--   transcript_source   where their meetings happen, which decides the export
--                       instructions the import screen shows them
--
-- The superseded columns are left in place rather than dropped. They hold no
-- data worth keeping, but dropping columns is irreversible and buys nothing
-- here; they are simply no longer written or read.

alter table public.profiles
  add column if not exists transcript_source text
    check (transcript_source in ('zoom', 'meet', 'teams', 'other'));

comment on column public.profiles.transcript_source is
  'Where this user''s meetings happen. Drives the export instructions on /import.';

comment on column public.profiles.crm is 'Superseded: Cue has no CRM integration.';
comment on column public.profiles.use_case is 'Superseded: Cue has no team features yet.';
comment on column public.profiles.record_scope is 'Superseded: Cue never records.';
comment on column public.profiles.share_scope is 'Superseded: sharing is per-meeting.';
comment on column public.profiles.department is 'Superseded: collected but never used.';
comment on column public.profiles.role_title is 'Superseded: collected but never used.';
