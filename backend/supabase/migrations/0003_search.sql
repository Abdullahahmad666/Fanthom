-- Search that returns moments, not meetings.
--
-- Searching a meeting tool and getting back a list of meetings is the same
-- answer you already had: you know you discussed it, you want the sentence.
-- So the unit of a result here is a turn -- who said it, when, and the words
-- either side -- and the meeting is context on the result rather than the
-- result itself.
--
-- Done in Postgres rather than in application code because the GIN index
-- added in 0002 already exists and a transcript is the one table in this
-- schema that genuinely grows: an hour of conversation is a few hundred rows,
-- a year of them is six figures. Filtering that in JavaScript means shipping
-- every transcript to the client to find one sentence.

create or replace function public.search_moments(q text, lim integer default 40)
returns table (
  meeting_slug  text,
  meeting_title text,
  meeting_date  date,
  speaker_name  text,
  t_sec         integer,
  snippet       text,
  rank          real
)
language sql
stable
-- SECURITY INVOKER, so row level security still decides what is visible:
-- the function can only ever read the caller's own meetings.
security invoker
set search_path = public
as $$
  with query as (
    select websearch_to_tsquery('english', q) as tsq
  )
  select
    m.slug,
    m.title,
    m.meeting_date,
    t.speaker_name,
    t.t_sec,
    -- Guillemets rather than <mark>: the snippet is data, and returning HTML
    -- from the database invites someone downstream to trust it as markup.
    ts_headline(
      'english',
      t.text_content,
      query.tsq,
      'StartSel=«,StopSel=»,MaxFragments=1,MaxWords=30,MinWords=10,FragmentDelimiter= … '
    ),
    ts_rank(t.search, query.tsq)
  from public.transcript_turns t
  join public.meetings m on m.id = t.meeting_id
  cross join query
  where q is not null
    and length(btrim(q)) > 1
    and t.search @@ query.tsq
  order by ts_rank(t.search, query.tsq) desc, m.meeting_date desc, t.t_sec asc
  limit least(coalesce(lim, 40), 100);
$$;

comment on function public.search_moments is
  'Full-text search across transcript turns, returning the moment rather than the meeting.';
