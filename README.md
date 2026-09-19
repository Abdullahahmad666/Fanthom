# Fathom — frontend prototype

A functional rebuild of Fathom's meeting experience, built from screenshots of the live
product as a one-day assignment.

**Live:** _add deployed URL here_
**Walkthrough:** _add Loom URL here_

---

## What this is

A frontend-only prototype of the surface that matters in Fathom: the meeting list and,
above all, the **meeting detail experience** — playback, transcript, AI summary, action
items, highlights, participants, search and sharing.

It is seeded with five real-shaped meetings rather than placeholders, including an
eight-person, hour-long call, because that is the case that actually exercises the design.

## What is real, and what is stubbed

The capture layer is **deliberately stubbed**. There is no recording bot, no calendar
integration and no speech-to-text. That was a scoping decision, not a shortfall: making a
bot join a Zoom call would have consumed the day and demonstrated nothing about the part
being judged. The time went into the experience on the other side of capture instead.

| Area | Status |
|---|---|
| Meeting list, date grouping, card menus | Real |
| Cross-meeting search over **transcripts** | Real |
| Playback clock, scrubbing, seek, speed | Real, but driven by a simulated clock rather than a media file |
| Transcript follow-along and auto-scroll | Real |
| Annotations (highlight / bookmark / reaction / review / feedback) | Real, and persist across tabs for the session |
| Action items, including ones you create from the transcript | Real |
| Summary template switching | Real — each template is genuinely different content |
| Share modal, clip-scoped links | Real |
| Ask Fathom | **Retrieval only.** No model. It finds transcript lines matching your question and cites them with working timestamps; the connecting sentence is canned |
| Recording bot, calendar, ASR | Not built |
| Deals, Alerts, Team Calls, Playlists | Not built — routed to an honest placeholder rather than left as dead tabs |

Nothing above is hidden in the UI. The detail page states under the player that capture is
stubbed and that playback runs on a simulated clock.

## The thing worth clicking

Open the **Q3 Launch Readiness Review** (8 people, 1 hour) and:

1. Press **space**, or hit play, and watch the transcript follow the playhead.
2. Hover any transcript line, click the cyan **+**, and add a **Highlight**.
   It lands in four places at once: a label on the turn, a tint on that turn's bubbles,
   a coloured range on the **player scrubber**, and a row in the rail's `ANNOTATIONS`.
3. Switch the summary template between **Enhanced / General / Team Sync / Sales Call** —
   the same hour reads differently in each.
4. Add an **Action Item** from the same **+** menu. That is what the product's own empty
   state means by *"Add manually on transcript tab."*
5. **Share → Share a clip** scopes the link to a single annotated moment, for someone who
   was not on the call.
6. Search `pricing` in the top bar. Results come back from what was **said**, with
   timestamps that jump straight to the moment.

## Design fidelity

Colours and geometry were measured from 2× screenshots rather than eyeballed — the
palette, the 63px top bar, the 400×38 search field, the ~1120px detail container. The full
specification, including what the screenshots did **not** show and what therefore had to
be inferred, is in [`docs/UI-SPEC.md`](docs/UI-SPEC.md). It keeps a table of the eleven
things an earlier revision got wrong, rather than quietly overwriting them.

Two deliberate departures from the screenshots:

- **Posters are gradients with participant avatars**, not video stills. With no capture
  layer there are no real frames, and inventing thumbnail imagery would misrepresent what
  the app has. Fathom uses this same treatment for audio-only calls.
- **Attendees and Annotations appear in the rail.** The current screenshots show neither —
  possibly removed, possibly hidden because that meeting had one participant and no
  annotations. They follow the older captured UI because the brief asks for participants
  and highlights.

## Agent capture

Every prompt and response in this build is committed under [`.agent-logs/`](.agent-logs/),
captured automatically by Claude Code hooks rather than by hand. Setup, canary tests and
the dead ends are documented in [`CAPTURE-TEST.md`](CAPTURE-TEST.md).

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npx eslint .    # lint
```

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript · lucide-react.
No backend, no database, no environment variables.

## Layout

```
app/                  routes: / , /calls/[id] , placeholder tabs
components/layout/    the two shells — ListLayout and DetailLayout
components/calls/     list, card, search results
components/detail/    player, tabs, transcript, summary, rail, share
lib/fixtures/         seed meetings
lib/types.ts          domain model
docs/UI-SPEC.md       measured UI specification
.agent-logs/          committed prompt/response transcripts
```

## What I would do next

In rough priority order: a virtualised transcript (the hour-long call renders ~70 turns
eagerly and would not hold at 500), real comment threads, Playlists, and a proper mobile
pass on the detail page — it stacks and is usable, but it was not designed phone-first.
