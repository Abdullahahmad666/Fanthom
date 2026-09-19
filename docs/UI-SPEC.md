# Fathom — UI Specification

Derived from screenshots of the live product. All measurements are **CSS pixels**: the
captures are 3213×1943 at 2× DPR, i.e. a **1606 × 971 CSS viewport**, so every pixel
measurement below is the raw value halved.

---

## 0. Source inventory and confidence

This matters more than usual, because the captured account is **empty**. Several
surfaces in this spec were never photographed at full size, and the spec says so rather
than filling the gap with invention.

| Source | What it shows | Confidence |
|---|---|---|
| `fathom.video-home.png` | App shell, top bar, tab nav, **empty** My Calls, Ask Fathom rail | **High** — measured directly |
| `fathom.video-playlists.png` | Playlists empty state + embedded preview of populated playlists | Medium |
| `...-deals.png` | Deals table (behind paywall modal), pagination, filters, modal pattern | **High** for table/modal |
| `...-onboarding-s.png` | Team Calls upsell + embedded preview of the **populated call grid** | Medium |
| Home "Self-Guided Tutorial" thumbnail | **The real meeting detail page**, 605px wide in-source | Medium — layout certain, type sizes inferred |
| `www.fathom.ai.png` carousel | A **newer redesign** of meeting detail (different tab set) | Medium |
| `fathom.video-customize.png`, signup/onboarding shots | Auth and settings forms | Not central to this build |

### Genuinely absent from every screenshot

Do not treat anything below as observed. Each is marked where it appears in the spec.

- **A populated My Calls list at full resolution.** Only the ~700px-wide preview inside
  the Team Calls upsell.
- **The Transcript tab's contents.** The tab label is visible; its panel never is.
- **The share modal, search results, hover states, focus rings, loading states.**
- **Any light theme.** The product is dark-only in every app capture.

### One conflict worth deciding up front

The screenshots contain **two generations** of the meeting detail page:

| | Production app (tutorial thumbnail) | Marketing redesign (carousel) |
|---|---|---|
| Tabs | `SUMMARY` · `TRANSCRIPT` | `Summary` · `Action items 3` · `Comments 2` · `Transcript` · `Related` |
| Layout | Player + tabs **left**, meta rail **right** | Tabs **left**, player + Ask Fathom **right** |
| Attendees | Dedicated `ATTENDEES` rail section | Avatar stack in header only |
| Highlights | Dedicated `ANNOTATIONS` rail section | Not present |

**Build the production layout.** It is the one that actually appears in the app, and it
is the only one that contains every element in the brief — participants, highlights,
sharing and action items all have a home in it. Borrow just one thing from the redesign:
the **count badges on tabs** (`Action items 3`), which are cheap and read as polished.

---

## 1. Design tokens

### 1.1 Color — measured

Sampled as the dominant color over a region, so these are exact, not eyeballed.

| Token | Hex | Use |
|---|---|---|
| `--bg-canvas` | `#1A1A1A` | Page background, Ask Fathom rail |
| `--bg-panel` | `#1B1B20` | Raised section panel (the "Learn how to use Fathom" block) |
| `--bg-surface` | `#212124` | Top bar, tab strip, composer, inputs |
| `--bg-input` | `#2D2C31` | Search field |
| `--bg-btn-secondary` | `#35353D` | Secondary / card buttons |
| `--brand-cyan` | `#02BEFF` | Active tab, links, @mentions, timestamps |
| `--amber` | `#FDC72F` | Streak counter, banner text, marketing bullets |
| `--amber-bg` | `#312B1C` | Amber notice banner background |
| `--avatar-pink` | `#C2185B` | Default avatar fill |
| `--text-primary` | `#FFFFFF` | Body and headings |
| `--text-muted` | `#969696` | Placeholder, secondary meta |

### 1.2 Color — approximate

Read off glyphs, so antialiasing makes them ±1 step. Fine for a prototype.

| Token | Hex | Use |
|---|---|---|
| `--text-dim` | `~#6B6B70` | Uppercase section labels (`ATTENDEES`, `ACTION ITEMS`) |
| `--border-subtle` | `~#2A2A2E` | Card and divider hairlines |
| `--success` | `~#3FBF7F` | Deal status "Won", positive talk-time |
| `--purple` | `~#A855F7` | "Product Feedback" annotation |
| `--player-progress` | `~#F0B429` | Amber played-portion of the scrubber |

The palette is deliberately narrow: **four greys, one cyan, one amber.** Resist adding
more. Almost all apparent "elevation" is a 6–10 point lightness step between those greys,
not a shadow.

### 1.3 Typography

The app UI is a neo-grotesque; marketing uses a geometric sans (Greycliff-like).
**Use Inter for the rebuild** — it is the closest free match to the in-app text and
avoids a licensed font. Sizes below are derived from cap-heights in the 2× captures, so
treat them as ±1px.

| Role | Size / weight | Notes |
|---|---|---|
| Wordmark | 22px / 700, tracked +0.02em | "FATHOM" is uppercase, always with the logo glyph |
| Primary nav tab | 17px / 500 | Cyan + underline when active |
| Page title (detail) | 20px / 600 | e.g. "Fathom <> ThinkBionics Demo" |
| Section label | 11px / 600, uppercase, tracking +0.08em | `ATTENDEES`, `ACTION ITEMS`, `ANNOTATIONS` |
| Card / row title | 14px / 600 | |
| Body | 14px / 400, line-height 1.55 | Summary prose, transcript |
| Meta / secondary | 12px / 400 | Dates, roles, durations |
| Timestamp link | 12px / 500, cyan | `@24:36` |
| Button label | 13–14px / 500 | |

### 1.4 Spacing, radius, borders, shadow

- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32. Section gaps are 24–32; intra-card 8–12.
- **Radius:** 6px inputs and small buttons · 8px cards and panels · 12px video player ·
  `9999px` pills (filter dropdowns, `Customize`, `Change Template`) · `50%` avatars.
- **Borders:** 1px hairlines only, `--border-subtle`. The Ask Fathom rail is separated by
  a **~2px `#212124` vertical rule** at x≈1047 — a divider, not a shadow.
- **Shadows:** effectively **none** in the app chrome. The only shadow-like treatments are
  the modal backdrop scrim and the amber onboarding tooltip. Do not add drop shadows to
  cards; use the grey step instead. This is the single easiest way to make a Fathom clone
  look wrong.

---

## 2. Global chrome

Measured from `fathom.video-home.png`.

```
┌──────────────────────────────────────────────────────────────┐
│ FATHOM ▸   [ Search Call Recordings        ]    Refer ⚙ ? ★20 (A) │  63px  #212124
├──────────────────────────────────────────────────────────────┤  1px  #1A1A1A
│  My Calls   Team Calls   Playlists   Alerts   Deals          │  62px  #212124
├──────────────────────────────────────────────┬───────────────┤
│                                              │               │
│  main content            #1A1A1A             │ ASK FATHOM    │  #1A1A1A
│                                              │  ~557px       │
└──────────────────────────────────────────────┴───────────────┘
                                          x≈1047 ── 2px #212124 rule
```

### 2.1 Top bar — 63px

- Background `#212124`, full-bleed, fixed.
- **Left:** wordmark + logo glyph, left inset ~24px.
- **Center-left:** search input — **measured 400 × 38px**, background `#2D2C31`, radius
  ~8px, magnifier icon 16px at 12px inset, placeholder "Search Call Recordings" in
  `#969696`. Starts at x≈243, vertically centered (12.5px above and below).
- **Right cluster,** ~24px apart: `Refer` (gift), `Settings` (gear), `Help & Feedback`
  (lifebuoy) — each a 20px icon + 15px label; then the **streak pill** (amber star +
  count `20` in `#FDC72F`); then a 34px circular avatar, `#C2185B` with a white initial.
- Note the detail page's top bar differs: `Customize · Invite · Help · 445 · avatar`.
  Treat the home variant as canonical and keep one top bar.

### 2.2 Primary tab nav — 62px

- Same `#212124`, separated from the bar above by a 1px `#1A1A1A` line.
- Tabs: **My Calls · Team Calls · Playlists · Alerts · Deals**, 17px/500, ~40px apart,
  first tab at x≈38.
- **Active:** text `#02BEFF` + a **2px cyan underline** flush to the strip's bottom edge,
  spanning the label width only.
- **Inactive:** `#FFFFFF`. Hover (inferred): `#02BEFF` at ~70% or a `#2D2C31` backplate.

### 2.3 Ask Fathom rail

- Observed **~557px wide at a 1606px viewport** (≈35%). That is wide; for the rebuild use
  a **fixed 400px**, collapsible, hidden below 1280px.
- Header: sparkle icon + `ASK FATHOM` (11px, uppercase, tracked) and a collapse chevron
  button at the far right.
- Optional amber notice banner: `#312B1C` background, `#FDC72F` text, 8px radius,
  bold lead-in + inline underlined "Learn More".
- Conversation area: user messages **right-aligned** in a `#2D2C31` rounded bubble; AI
  replies **left-aligned** with a small Fathom glyph and **cyan inline citations carrying
  `@mm:ss` timestamps** that seek the player.
- Suggested-prompt chips: pill buttons, `#2D2C31`, 13px, wrapping right-to-left.
- Composer: `#212124`, radius 8px, placeholder "Ask anything…", a scope dropdown
  (`My Calls ⌄` / `All meetings ⌄`) bottom-left and a **circular send button** bottom-right.

---

## 3. My Calls — list

The populated layout comes from the preview embedded in the Team Calls upsell, so
**medium confidence**.

- **Filter row** above the content: a left-aligned `All Calls ⌄` pill; right-aligned
  `Role ⌄`, `Deal Stage ⌄`, `Deal Outcome ⌄`. All pills: `#2D2C31`, radius `9999px`,
  13px, 12px horizontal padding, chevron.
- **Date grouping** with sticky uppercase headers: `TODAY`, `YESTERDAY`, `LAST WEEK`.
- **Call card**, 3 per row, ~16px gap:
  - 16:9 thumbnail, 8px radius, showing the speaker's video still.
  - **Talk-time badge bottom-left** (`11%` + a small donut) and **duration bottom-right**
    (`18:03`), both on a translucent dark scrim.
  - Below the thumbnail: a 20px company logo, then the title (14px/600) and the company
    name (12px, muted) on a second line.
- Hover (inferred): thumbnail scales ~1.02 or gains a 1px cyan ring; title goes cyan.

### 3.1 Empty state — observed exactly

Centered in the content column, well above the fold: a 24px circle-slash icon and
**"No call recordings"** at ~28px/400 in a muted grey. Nothing else — no illustration,
no call-to-action button. Below it, two sections separated by ~32px:

- `LEARN HOW TO USE FATHOM` — a `#1B1B20` panel starting **12px from the left edge** with
  **~32px internal padding**, top edge at y≈362. Inside: three cards in a row, each a
  16:9 thumbnail above a full-width secondary button (`#35353D`, radius 6px, icon + label):
  *Self-Guided Tutorial* · *Start Test Call* · *Attend Tips & Tricks Webinar*.
- `MEETING PREFERENCES` — plain prose lines about auto-recording, with an `Edit Settings`
  link in cyan.

A circular video bubble sits bottom-left with a dark tooltip, "Start your onboarding here!".
**Skip this in the rebuild** — it is onboarding chrome, not product surface.

---

## 4. Meeting detail — the centerpiece

Two columns under the global chrome. Left ≈62%, right ≈38%, ~24px gutter.

```
┌───────────────────────────────────┬──────────────────────────┐
│ ┌───────────────────────────────┐ │ Fathom <> ThinkBionics ✎ │
│ │                               │ │ Jun 19, 2024             │
│ │      VIDEO   ▶   [11 mins]    │ │ [Share 🔗][Sync ▾][⋮]    │
│ │                               │ │                          │
│ │ 🔇 0:16 ▬▬▬▬▬━━━━━━ 1.2× ⧉   │ │ ATTENDEES                │
│ └───────────────────────────────┘ │  ◉ Anya Rose      in ⌁  │
│ SUMMARY   TRANSCRIPT              │    CMO, ThinkBionics     │
│ ─────────                         │  ◉ Dan Smith      in ⌁  │
│ [General ⌄]      [Copy Summary ✉] │    Sales Engineer        │
│                                   │                          │
│ Meeting Purpose:                  │ ACTION ITEMS             │
│ Discuss Fathom's vision…          │ [Copy for 📄][Copy Email]│
│                                   │ ☐ Discuss Dan's previous │
│ Key Takeaways                     │   work… 💬 @24:36 👤Dan  │
│  • Fathom is focused on…          │ ☐ Send research updates… │
│  • Fathom sees value in…          │                          │
│                                   │ ANNOTATIONS              │
│ Topics:                           │ ▸ Highlight · 45s        │
│ Fathom's Vision and Strategy      │   Amanda explains how…   │
│  • Fathom started with…           │ ▸ Product Feedback       │
└───────────────────────────────────┴──────────────────────────┘
```

### 4.1 Player — left column, top

- 16:9, 12px radius, large translucent white play triangle centered, duration chip
  (`11 mins`) centered below it on the poster.
- **Control bar** inset at the bottom on a dark scrim, left to right:
  mute icon · **current time `0:16`** (13px, tabular) · scrubber · **`1.2×` speed** · PiP icon.
- The scrubber is the distinctive part: a **thin track with an amber played portion**
  (`~#F0B429`), a **blue playhead marker**, and **vertical tick marks along the track** —
  these are highlight/annotation markers, not a waveform. Reproduce them; they are what
  makes it read as Fathom.

### 4.2 Content tabs — below the player

- `SUMMARY` · `TRANSCRIPT` — **uppercase, ~12px, tracked +0.06em**, ~24px apart.
  Active: cyan text + 2px cyan underline. Note these are *smaller and uppercase*, unlike
  the sentence-case primary nav. Add `ACTION ITEMS 2` with a count badge from the
  redesign if time allows.
- **Summary toolbar:** a `General ⌄` template pill on the left; a **`Copy Summary`
  primary button** on the right — cyan-tinted fill, 6px radius, with a trailing Gmail glyph.
- **Summary body:** bold run-in headings (`Meeting Purpose:`, `Key Takeaways`, `Topics:`),
  short paragraphs, and disc bullets at 14px/1.55 with ~8px between items. Sub-headings
  (`Fathom's Vision and Strategy`) are 13px/600. The redesign adds cyan `@mentions` inline
  and a row of ghost pills (`Change Template`, `Add Section`, `Update Style`) — optional.

### 4.3 Transcript — **not visible in any screenshot**

Only the tab label exists. Specified to match the system, not copied:

- Rows of `[mm:ss] Speaker — utterance`, timestamp in cyan/500, speaker in 13px/600,
  text 14px/400, ~12px between turns.
- Clicking a timestamp seeks the player; the active turn gets a `#212124` backplate.
- A local search field filters turns and highlights matches with an amber background.

Keep it restrained. Inventing a richer transcript UI than the product has would
contradict the source.

### 4.4 Right rail

- **Title block:** meeting name 20px/600 with a trailing edit pencil; date 12px muted below.
- **Action row:** `Share` (cyan-tinted fill + link glyph) · `Sync to Hubspot`
  (same treatment + brand glyph) · `⋮` overflow. ~8px gap, 6px radius.
- **`ATTENDEES`** — section label, then rows: 32px avatar, name 14px/600, "role, company"
  12px muted, and right-aligned LinkedIn + CRM icon buttons that appear on row hover.
- **`ACTION ITEMS`** — label, then two secondary buttons (`Copy for 📄`,
  `Copy Follow-up Email ✉`), then checkbox rows: a square ~16px checkbox with 4px radius,
  title 13px/600 wrapping to 2–3 lines, and a meta line of **cyan `@24:36` timestamp** plus
  a `👤 Dan` owner chip. Checking an item should strike it through and dim it.
- **`ANNOTATIONS`** (the brief's "highlights") — rows led by a **colored type icon and a
  colored label**: `Highlight` cyan, `Product Feedback` purple, `Bookmark` blue. Label is
  followed by `· 45s` or `@8:15`, with an italic muted description beneath. Clicking seeks.

### 4.5 Sharing

A `Share` button is visible; **the modal it opens is not.** Minimum believable version,
consistent with the Deals modal already observed: centered dialog on a scrim, 8px radius,
`#1B1B20` surface, a read-only link field with a `Copy` button, a visibility dropdown
(Attendees only / Anyone with the link), and a `Done` primary button.

---

## 5. Tables, modals, and other screens

### 5.1 Deals table — observed, high confidence

Worth reading even though **Deals is cut from the build**: it is the only real data table
in the captures, so it defines the table style if one is needed.

- Header: `Deals` 20px/600 + a **count pill `145`** (`#2D2C31`, rounded); right-aligned
  filter pills `All Reps ⌄`, `Open Deals ⌄`, `Any Close Date ⌄`.
- Column headers 11px uppercase muted, with a **sort caret** on `CLOSE DATE`.
- Rows ~52px, 1px `#2A2A2E` bottom hairline, no zebra striping.
- Footer: numeric pagination `← 1 2 3 … 14 15` and a `Show 15 per page ⌄` control.

### 5.2 Modal pattern — observed

From the Deals paywall: centered panel ~836px wide, 8px radius, dark surface, **the page
behind stays visible and is dimmed**, content is centered — title ~28px/600, subtitle
muted, an image, then a primary CTA. The trial CTA uses an unusual **outlined** style:
transparent fill, 1px cyan border, cyan label. Useful for a secondary/ghost variant.

### 5.3 Playlists — empty state observed, populated inferred from preview

Populated: groups titled `ThinkBionics - New Features` (16px/600) with a meta line
`3 Highlights (18 min) · Last updated Nov 25`, above a row of highlight cards. Each card:
logo + company + date overlaid top-left on a 16:9 thumbnail, and a one-line caption
beneath with a small play glyph.

### 5.4 Auth / onboarding

Signup, questionnaire and Zoom-connect screens exist in the captures. **All cut.** They
cost hours and demonstrate nothing about the meeting experience being assessed.

---

## 6. States, motion, responsive

### 6.1 Interaction states — all inferred; none captured

No hover, focus, or loading state appears in any screenshot. Keep them minimal and
consistent:

- **Hover:** surfaces lift one grey step (`#1A1A1A → #212124`, `#212124 → #2D2C31`);
  text targets go cyan. 120ms ease-out.
- **Active/pressed:** no transform, just one step darker.
- **Focus-visible:** 2px `#02BEFF` outline at 2px offset. The product shows none, but
  shipping without keyboard focus is a real accessibility defect — add it.
- **Disabled:** 40% opacity, `cursor: not-allowed`.

### 6.2 Loading

Also unobserved. Use **skeletons, not spinners** — grey `#212124` blocks at the final
geometry, with a subtle shimmer. The list needs a card skeleton; the detail page needs a
player block plus three text lines. A prototype with real skeletons reads as far more
finished than one with a centered spinner.

### 6.3 Motion

Nothing animated can be proven from stills. Infer conservatively:

- 120–160ms ease-out on hover/color; 200ms on tab-underline slide.
- Modal: 150ms fade + 4px rise; backdrop fades to ~60% black.
- Rail collapse: 200ms width transition.
- Respect `prefers-reduced-motion`. No parallax, no spring physics — the product is sober.

### 6.4 Responsive — entirely inferred

Every capture is a single 1606px viewport, so **no breakpoint behavior is observable.**
A defensible ladder:

| Width | Behavior |
|---|---|
| ≥1440 | Full layout; Ask Fathom rail open at 400px |
| 1100–1439 | Rail collapses to an icon button; detail columns 60/40 |
| 768–1099 | Detail becomes one column: player, then tabs, then rail content appended below; call grid 2-up |
| <768 | Single column; primary nav becomes a horizontally scrolling tab strip; call grid 1-up; player sticky at top of the detail page |

---

## 7. Screen relationships

```
                  ┌──────────────┐
                  │   Top bar    │ search ──▶ filtered My Calls
                  │   Tab nav    │
                  └──────┬───────┘
      ┌──────────┬───────┴────┬───────────┬─────────┐
   My Calls   Team Calls   Playlists    Alerts    Deals
      │            │            │       (cut)     (cut)
      │  card click│            │ highlight click
      └────────────┴──────┬─────┘
                          ▼
                 ┌─────────────────┐
                 │ Meeting detail  │◀── Ask Fathom citation @mm:ss
                 │                 │
                 │ tabs: Summary / Transcript / Action items
                 │ Share ──▶ share modal
                 │ timestamp ──▶ seeks player (in-page, no nav)
                 └─────────────────┘
```

The load-bearing relationships, and the ones worth spending time on:

1. **List → detail** is the only true navigation in the product.
2. **Timestamp → player seek** is the interaction that makes it feel real. Action items,
   annotations, transcript rows and Ask Fathom citations all point at the same player.
   Build this once as a shared seek callback and reuse it in four places.
3. **Search** filters the list in place; it is not a separate results page.

---

## 8. Proposed build — smallest convincing set

Scoped to one day. The rule applied: **anything that is not the meeting detail page, or
the path to it, is cut.**

### 8.1 Routes — 3

| Route | Purpose | Priority |
|---|---|---|
| `/` | My Calls. Date-grouped card grid, search filter, empty state. | P0 |
| `/calls/[id]` | Meeting detail. The whole assignment lives here. | **P0 — half the day** |
| `/playlists` | Playlist groups + highlight cards. Reuses the card component. | P2 — cut first |

`Team Calls` and `Alerts` render as the same list with different fixture data.
`Deals` and `Settings` are **cut** — link them to a simple "not in this prototype" state
rather than leaving dead tabs.

### 8.2 Components — 16

**Shell (3)** · `AppShell` · `TopBar` (wordmark, search, right cluster) · `TabNav`
(reused for both primary nav and in-page tabs via a `variant` prop — they differ only in
case, size and tracking).

**Primitives (5)** · `Button` (primary / secondary / ghost / outline) · `Pill`
(filter dropdowns, count badges) · `Avatar` + `AvatarStack` · `EmptyState` · `Skeleton`.

**List (3)** · `CallCard` (thumbnail, talk-time badge, duration, logo, title) ·
`DateGroup` (sticky header + grid) · `SearchInput`.

**Detail (5)** · `VideoPlayer` (poster, play, scrubber with annotation ticks, time,
speed) · `SummaryPanel` · `TranscriptPanel` (timestamp seek + local search) ·
`ActionItemList` (checkboxes, owner, timestamp) · `AnnotationList`.
Plus `AttendeeList` and `ShareModal`, which are small enough to fold into the detail page.

### 8.3 Data

One `fixtures/meetings.ts` — **3 meetings**, one of them richly populated (~40 transcript
turns, 5 action items, 4 annotations, 3 attendees) and two thin ones for the list. Shape:

```ts
type Meeting = {
  id, title, company, date, durationSec, thumbnailUrl, talkTimePct
  attendees: { name, role, company, avatarUrl }[]
  summary:   { heading, kind: 'para'|'bullets', body }[]
  transcript:{ tSec, speaker, text }[]
  actionItems:{ id, text, owner, tSec, done }[]
  annotations:{ kind:'highlight'|'feedback'|'bookmark', label, tSec, note }[]
}
```

Everything is derived from this one type — no backend, no API layer.

### 8.4 The one thing to get right

Use a **real `<video>` element** with a short public-domain clip, not a static poster.
Wire `currentTime` into shared state so every timestamp in the UI seeks it and the
transcript auto-highlights the active turn. That single mechanism is what will make the
prototype feel like the product; a beautiful but inert page will not.

### 8.5 Rough budget

| Block | Hours |
|---|---|
| Tokens, Tailwind config, app shell, tab nav | 1.5 |
| My Calls list + card + empty + search filter | 1.5 |
| Meeting detail scaffold and right rail | 1.5 |
| Player + shared seek state | 1.5 |
| Summary + transcript panels | 1.5 |
| Action items, annotations, share modal | 1.0 |
| Skeletons, hover/focus, responsive pass | 1.0 |
| Buffer | 0.5 |
| **Total** | **10** |

If the day runs short, cut in this order: **Playlists → share modal → Ask Fathom rail →
responsive below 768px.** Never cut the player seek wiring.
