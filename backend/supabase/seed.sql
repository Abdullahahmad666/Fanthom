-- Seeds the signed-in user's account with the demo meetings.
--
-- Run from the Supabase SQL editor while signed in as the user you want
-- seeded, or call  select public.seed_demo_data('<user-uuid>');
--
-- Safe to run twice: it clears the user's existing meetings first.

create or replace function public.seed_demo_data(target uuid default auth.uid())
returns text
language plpgsql
security definer set search_path = public
as $fn$
declare
  m_launch uuid;
  m_solo   uuid;
begin
  if target is null then
    return 'No user. Sign in first, or pass a user id.';
  end if;

  delete from public.meetings where user_id = target;

  -- ------------------------------------------------ eight people, one hour --
  insert into public.meetings
    (user_id, title, meeting_date, start_time, meeting_code, platform,
     duration_sec, poster_from, poster_to)
  values
    (target, 'Q3 Launch Readiness Review', current_date, '10:00 AM', 'xkp-4mzq-rtv',
     'Zoom', 3612, '#1d4ed8', '#0b1c3f')
  returning id into m_launch;

  insert into public.participants (meeting_id, name, email, role_title, company, color, is_owner)
  values
    (m_launch, 'Abdullah Ahmad', 'abdullahahmad5618@gmail.com', 'Founder', 'One More Email', '#c2185b', true),
    (m_launch, 'Maya Chen',    'maya.chen@northwind.io',    'VP Product',       'Northwind', '#7c3aed', false),
    (m_launch, 'Tom Okafor',   'tom.okafor@northwind.io',   'Engineering Lead', 'Northwind', '#0891b2', false),
    (m_launch, 'Priya Raman',  'priya.raman@northwind.io',  'Design Lead',      'Northwind', '#db2777', false),
    (m_launch, 'Daniel Weiss', 'daniel.weiss@northwind.io', 'Head of Sales',    'Northwind', '#ea580c', false),
    (m_launch, 'Sofia Marino', 'sofia.marino@northwind.io', 'Customer Success', 'Northwind', '#16a34a', false),
    (m_launch, 'Jonas Lind',   'jonas.lind@northwind.io',   'Analytics',        'Northwind', '#ca8a04', false),
    (m_launch, 'Rachel Kim',   'rachel.kim@northwind.io',   'Marketing',        'Northwind', '#0ea5e9', false);

  insert into public.transcript_turns (meeting_id, speaker_name, t_sec, sentences) values
    (m_launch, 'Maya Chen', 8, $j$[{"tSec":8,"text":"Alright, we are all here, so let us get into it."},{"tSec":20,"text":"The only question I actually care about today is whether the thirtieth still holds."}]$j$),
    (m_launch, 'Tom Okafor', 46, $j$[{"tSec":46,"text":"Short answer, it holds."},{"tSec":58,"text":"Longer answer, it holds if we are willing to be honest about bulk import."}]$j$),
    (m_launch, 'Tom Okafor', 76, $j$[{"tSec":76,"text":"Bulk import works fine up to about fifty thousand rows."},{"tSec":90,"text":"Past that it falls over, and the part I do not like is that it fails quietly."}]$j$),
    (m_launch, 'Priya Raman', 126, $j$[{"tSec":126,"text":"That is the bit that worries me more than the failure itself."},{"tSec":139,"text":"A loud failure is a support ticket, a quiet one is a trust problem."}]$j$),
    (m_launch, 'Daniel Weiss', 180, $j$[{"tSec":180,"text":"Can I flag something from the sales side while we are here?"},{"tSec":193,"text":"Bulk import has come up in three of the last five demos."}]$j$),
    (m_launch, 'Sofia Marino', 594, $j$[{"tSec":594,"text":"Signups are forecast to roughly triple in launch week. Support headcount is exactly the same as it was in July."}]$j$),
    (m_launch, 'Rachel Kim', 762, $j$[{"tSec":762,"text":"Can I get a decision on Teams pricing?"},{"tSec":773,"text":"The launch email has a hole in it where the price should be."}]$j$),
    (m_launch, 'Maya Chen', 1008, $j$[{"tSec":1008,"text":"Ship the thirtieth. Bulk import behind a flag above the row limit."},{"tSec":1024,"text":"Migration dry run before Wednesday."}]$j$);

  insert into public.summaries (meeting_id, template, sections) values
    (m_launch, 'enhanced', $j$[
      {"heading":"Meeting Purpose","blocks":[{"kind":"para","text":"Confirm whether the Q3 release is ready to ship on the 30th, and decide what gets cut if it is not."}]},
      {"heading":"Key Takeaways","blocks":[{"kind":"bullets","items":[
        {"label":"Decision","text":"Ship on September 30th, but with bulk import behind a feature flag for the first two weeks."},
        {"label":"Blocker","text":"The migration rehearsal has not run against production-sized data."},
        {"label":"Risk","text":"Support headcount is flat while signups are forecast to triple."}]}]}
    ]$j$),
    (m_launch, 'general', $j$[
      {"heading":"Summary","blocks":[{"kind":"para","text":"The team reviewed readiness for the September 30th release. The date holds, with bulk import shipping behind a flag because it still fails on large files."}]}
    ]$j$);

  insert into public.action_items (meeting_id, text, owner_name, t_sec, done) values
    (m_launch, 'Run the migration rehearsal against a production-sized snapshot before Wednesday standup', 'Tom Okafor', 356, false),
    (m_launch, 'Design the bulk-import row-limit message so the failure is explicit', 'Priya Raman', 264, true),
    (m_launch, 'Take launch-week support cover to finance and answer Sofia by Friday', 'Maya Chen', 750, false),
    (m_launch, 'Decide Teams tier pricing on Monday so the launch email can go out', 'Maya Chen', 838, false);

  insert into public.highlights (meeting_id, kind, t_sec, end_sec, note, created_by) values
    (m_launch, 'highlight', 104, 152,  'Bulk import fails silently - the trust problem, not the bug', 'Abdullah Ahmad'),
    (m_launch, 'bookmark',  594, 634,  'Support headcount flat while signups triple', 'Sofia Marino'),
    (m_launch, 'feedback',  1144, 1196,'Every risk was known two weeks ago - a surfacing problem', 'Abdullah Ahmad');

  -- ------------------------------------------ the real three-minute capture --
  insert into public.meetings
    (user_id, title, meeting_date, start_time, meeting_code, platform,
     duration_sec, poster_from, poster_to)
  values
    (target, 'Impromptu Google Meet Meeting', current_date, '5:43 AM', 'dkx-jgwp-yrx',
     'Google Meet', 183, '#8e1141', '#3d0a1e')
  returning id into m_solo;

  insert into public.participants (meeting_id, name, email, role_title, company, color, is_owner)
  values (m_solo, 'Abdullah', 'abdullahahmad5618@gmail.com', 'Founder', 'One More Email', '#c2185b', true);

  insert into public.transcript_turns (meeting_id, speaker_name, t_sec, sentences) values
    (m_solo, 'Abdullah', 4,   $j$[{"tSec":4,"text":"Hi, this is me, Abdullah Ahmad. I am here to talk about some meeting notes."}]$j$),
    (m_solo, 'Abdullah', 38,  $j$[{"tSec":38,"text":"About my product like you do not have to chase the clients whatsoever."}]$j$),
    (m_solo, 'Abdullah', 176, $j$[{"tSec":176,"text":"Thank you."}]$j$);

  insert into public.summaries (meeting_id, template, sections) values
    (m_solo, 'enhanced', $j$[
      {"heading":"Meeting Purpose","blocks":[{"kind":"para","text":"Define the One More Email product and its upcoming release."}]},
      {"heading":"Key Takeaways","blocks":[{"kind":"bullets","items":[
        {"label":"Product","text":"An AI tool that automates invoice follow-ups to eliminate manual client chasing."},
        {"label":"Goal","text":"Ship a prototype or MVP by next Friday."}]}]}
    ]$j$);

  -- Deliberately no action items on the solo call: it produced none, and that
  -- empty state is part of what the prototype demonstrates.

  insert into public.playlists (user_id, name) values (target, 'Onboarding moments');

  return 'Seeded 2 meetings for ' || target;
end;
$fn$;
