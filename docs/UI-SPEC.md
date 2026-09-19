# Fathom — UI Specification

Derived from screenshots of the live product. All measurements are **CSS pixels**: the
captures are 3213×1943 at 2× DPR, i.e. a **1606 × 971 CSS viewport**, so every pixel
measurement below is the raw value halved.

> **Revision 2.** A second batch of screenshots showed a real recorded meeting and its
> tabs, menus and modals. That corrected several things Revision 1 had wrong — they are
> listed in §10 so the earlier reasoning stays auditable.

---

## 0. Source inventory and confidence

| Source | What it shows | Confidence |
|---|---|---|
| `fathom.video-home534.png` | **Populated** My Calls: real card, overflow menu, Ask Fathom rail | **High** |
| `...-calls-829810573.png` | Meeting detail, **Summary** tab | **High** |
| `...-82981057323.png` | Meeting detail, **Transcript** tab | **High** |
| `...-8298105732343242.png` | Meeting detail, **Ask Fathom** tab | **High** |
| `...-829810573234324242342.png` | **Share Recording modal** | **High** |
| `...-82981057323432424234243543543.png` | Transcript row **context menu** | **High** |
| `...-829810573234324242342435435434323.png` | Transcript **multi-select** state | **High** |
| `fathom.video-home.png` | Empty My Calls, top bar, tab nav | **High** |
| `...-deals.png` | Deals table, pagination, paywall modal | High (screen is cut) |
| `...-onboarding-s.png`, `-playlists.png` | Upsell pages + embedded previews | Medium |
| Home "Self-Guided Tutorial" thumbnail | An **older** meeting detail UI | Low — superseded |
| `www.fathom.ai.png` | Marketing; a **speculative redesign** of detail | Low — do not build |

### Still not observed

- **Hover, focus and loading states.** Nothing in any capture. Still inferred (§7).
- **A multi-speaker transcript.** The only recording has one speaker, so speaker
  alternation and left/right bubble alignment are inferred.
- **A meeting with attendees or highlights.** See the caveat in §5.4.
- **Any viewport other than 1606px.** All responsive behavior is inferred.
- **Any light theme.** The product is dark-only.

---

## 1. Design tokens

### 1.1 Color — measured

| Token | Hex | Use |
|---|---|---|
| `--bg-canvas` | `#1A1A1A` | Page background |
| `--bg-content` | `#000000` | **Detail page content panel** — darker than the canvas |
| `--bg-panel` | `#1B1B20` | Raised section panel ("Learn how to use Fathom") |
| `--bg-surface` | `#212124` | Top bar, tab strip, composer, empty-state cards |
| `--bg-raised` | `#26262A` | Card footer, modal body, modal input |
| `--bg-input` | `#2D2C31` | Global search field |
| `--bg-muted` | `#4A4B4B` | Transcript bubble, circular icon buttons |
| `--bg-popover` | `#111314` | Context menus and overflow menus |
| `--bg-modal-footer` | `#141417` | Modal footer bar (two-tone modals) |
| `--bg-accent-soft` | `#1F2A31` | `Share` button fill — a desaturated teal tint |
| `--brand-cyan` | `#02BEFF` | Active tab, links, primary actions |
| `--amber` | `#FDC72F` | Streak counter, notice text |
| `--amber-bg` | `#322809` | Amber notice banner |
| `--avatar-pink` | `#C2185B` | Avatar fill |
| `--text-primary` | `#FFFFFF` | Body, headings |
| `--text-muted` | `#969696` | Placeholders, meta, empty-state copy |

Note the inversion worth remembering: **the detail page's content column is pure black
while the page around it is `#1A1A1A`.** Most dark UIs get lighter as they nest; this one
gets darker. Getting that backwards is the fastest way to look off.

### 1.2 Color — approximate

| Token | Hex | Use |
|---|---|---|
| `--text-dim` | `~#6B6B70` | Uppercase section labels |
| `--border-subtle` | `~#2A2A2E` | Hairlines |
| `--success` | `~#3FBF7F` | Deal status "Won" |

### 1.3 Typography

A neo-grotesque. **Use Inter** — closest free match, avoids licensing. Sizes are derived
from cap-heights in the 2× captures, ±1px.

| Role | Size / weight | Notes |
|---|---|---|
| Wordmark | 22px / 700, tracking +0.02em | Uppercase + logo glyph |
| Primary nav tab | 17px / 500 | Cyan + underline when active |
| Detail page title | 28px / 600 | "Impromptu Google Meet Meeting" |
| Date group header | 20px / 600, **sentence case, white** | "Today" |
| Card title | 16px / 600 | |
| Content tab | 15px / 600, **uppercase**, tracking +0.04em | `SUMMARY` `TRANSCRIPT` `ASK FATHOM` |
| Section label | 12px / 600, uppercase, tracking +0.08em | `ACTION ITEMS`, `PEOPLE WITH ACCESS` |
| Summary h2 | 20px / 600 | "Meeting Purpose", "Key Takeaways" |
| Body | 15px / 400, line-height 1.55 | Summary prose, transcript |
| Meta | 14px / 400, muted | Dates, emails |
| Empty-state copy | 15px / 400 **italic**, muted | "None detected…" |
| Button label | 15px / 600 | |

### 1.4 Spacing, radius, borders, shadow

- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32.
- **Radius:** 6px small buttons · 8px inputs, cards, bubbles, popovers · 12px modal and
  player · `9999px` pills and circular icon buttons · `50%` avatars.
- **Borders:** 1px hairlines only. The Ask Fathom rail on list pages is divided by a
  **~2px `#212124` vertical rule**.
- **Shadows:** **none in app chrome.** Only the modal backdrop scrim and popovers read as
  floating, and popovers do it with a near-black fill (`#111314`), not a shadow. Do not
  add drop shadows to cards.

---

## 2. Two distinct layouts

This is the single most important structural fact, and Revision 1 got it wrong.

| | **List pages** (`/`, Team Calls, Playlists…) | **Detail page** (`/calls/:id`) |
|---|---|---|
| Top bar | Yes | Yes |
| Primary tab nav strip | **Yes** | **No — absent entirely** |
| Ask Fathom | **Right rail**, account-scoped | **A tab**, meeting-scoped |
| Content width | Full-bleed to the rail | **~1120px, centered** |
| Content background | `#1A1A1A` | `#000000` panel on `#1A1A1A` |

The detail page is not the list page with a rail swapped out. It drops the nav strip and
becomes a centered document. Build them as two layouts.

### 2.1 Top bar — 63px, both layouts

- Background `#212124`, fixed, full-bleed.
- **Left:** wordmark + logo glyph, ~24px inset.
- **Center-left:** search input, **measured 400 × 38px**, `#2D2C31`, radius ~8px,
  magnifier at 12px inset, placeholder "Search Call Recordings" in `#969696`. Starts at
  x≈243, vertically centered.
- **Right:** `Refer` · `Settings` · `Help & Feedback` (20px icon + 15px label, ~24px
  apart), then an amber **streak pill** (star + count), then a 34px `#C2185B` avatar.

### 2.2 Primary tab nav — 62px, list pages only

- `#212124`, separated from the bar above by a 1px `#1A1A1A` line.
- **My Calls · Team Calls · Playlists · Alerts · Deals** — 17px/500, ~40px apart, first at x≈38.
- Active: `#02BEFF` + a **2px cyan underline** spanning the label width, flush to the
  strip's bottom edge. Inactive: `#FFFFFF`.

---

## 3. My Calls — observed populated

- **Date group header:** `Today` — **20px/600, white, sentence case**, ~24px above the grid.
- **Call card — measured ~500px wide:**
  - **16:9 thumbnail**, full-bleed at the card's top, 8px top radius. For an audio-only
    call the poster is a **generated crimson radial gradient with a circular initial
    avatar centered** and a faded play triangle — not a black rectangle. Worth copying;
    it is a large part of the product's look.
  - **Duration badge** `3 mins` — dark pill, bottom-**right**, ~12px inset.
  - **Footer band, ~70px, `#26262A`, 16px padding:** title 16px/600 on the left, a **32px
    circular `#4A4B4B` overflow button** (`⋮`) on the right.
  - At 1606px the grid is **2-up** (≈500px card + ~20px gap in the ~1050px content area).
- **Card overflow menu** — popover, `#111314`, 8px radius, opens below-right of the button:
  - `🔗 Copy Share Link` (15px/600) with a muted sub-label "Anyone with the link can view"
  - `🗑 Delete Recording` (15px/600)
  - A **two-line menu item** (label + description) is a pattern worth keeping.

### 3.1 Empty state — observed

Centered: a 24px circle-slash icon and **"No call recordings"** at ~28px/400 muted. No
illustration, no CTA. Below it the `LEARN HOW TO USE FATHOM` panel (`#1B1B20`, 12px from
the left edge, ~32px padding, three thumbnail-plus-button cards) and `MEETING PREFERENCES`.

The bottom-left onboarding video bubble is onboarding chrome — **skip it**.

### 3.2 Ask Fathom rail — list pages

- Observed **~557px at a 1606px viewport**. For the rebuild use a **fixed 400px**,
  collapsible, hidden below 1280px.
- Header: sparkle + `ASK FATHOM` (12px uppercase, tracked) and a collapse chevron at the far right.
- Optional amber banner: `#322809` fill, `#FDC72F` text, 8px radius, bold lead-in +
  underlined "Learn More".
- Suggestion chips: right-aligned pills, `#2D2C31`, wrapping.
- Composer: `#212124`, radius 8px, "Ask anything…", a `My Calls ⌄` scope dropdown
  bottom-left and a **circular send button** bottom-right.

---

## 4. Meeting detail — the centerpiece

**Measured layout at 1606px:** container `#000000` content panel, left column
**CSS 231 → 893 (662px)**, gap ~28px, right rail **CSS 921 → 1350 (429px)**. Container
total ~1120px, roughly centered.

```
┌─ left column 662px ──────────────┐  ┌─ right rail 429px ─────────┐
│ 5:43 AM │ dkx-jgwp-yrx  ⓘ        │  │ Impromptu Google Meet      │
│ ┌──────────────────────────────┐ │  │ Meeting                    │
│ │      ⬤ A   (gradient)        │ │  │ Sep 19, 2026               │
│ │        3 mins                │ │  │                            │
│ │ 🔊 0:00 ━━━━━━━━━━ 1× ⧉  [📹]│ │  │ ┌────────────────┐ ┌───┐  │
│ └──────────────────────────────┘ │  │ │ Share       🔗 │ │ ⋮ │  │
│ SUMMARY  TRANSCRIPT  ASK FATHOM  │  │ └────────────────┘ └───┘  │
│ ────────                         │  │                            │
│ [Enhanced ⌄|⚙] [✨Auto ⌄]        │  │ ACTION ITEMS               │
│                  [Copy Summary]  │  │ ┌────────────────────────┐ │
│ ✨ NEW: Customize this summary…  │  │ │ None detected. Add     │ │
│                                  │  │ │ manually on transcript │ │
│ Meeting Purpose                  │  │ │ tab                    │ │
│ Define the "One More Email"…     │  │ └────────────────────────┘ │
│ Key Takeaways                    │  └────────────────────────────┘
│  • Product: "One More Email,"…   │
└──────────────────────────────────┘
```

### 4.1 Player

- **Header strip** above the video, ~34px: start time `5:43 AM`, a `│` divider, the
  meeting code `dkx-jgwp-yrx`, and an ⓘ icon. All 13px muted. Small detail, very
  characteristic — include it.
- **Poster:** for audio-only, a crimson radial gradient with a centered circular initial
  avatar (~72px). A large translucent play triangle and a `3 mins` duration label sit
  centered while paused; both disappear on play.
- **Notetaker PiP tile** bottom-right inside the video: a small dark tile captioned
  "Abdullah's Fathom Notetaker" with a muted-mic glyph.
- **Control bar,** inset bottom on a scrim, left to right:
  - volume icon with the **speaker's name in ~10px beneath it**
  - **current time** `0:34`, 15px tabular
  - **scrubber** — grey track, lighter played portion, a **blue vertical playhead bar**
    (a bar, not a dot). No annotation ticks in this build.
  - `1×` speed toggle
  - PiP icon
- Correction: the amber scrubber in the old tutorial screenshot is **not** the current
  design. Use grey + blue.

### 4.2 Content tabs

`SUMMARY` · `TRANSCRIPT` · `ASK FATHOM` — 15px/600 uppercase, tracked, ~28px apart.
Active is `#02BEFF` with a **2px cyan underline**; inactive `#969696`. A 1px hairline runs
under the whole row.

A **contextual action button sits at the right end of the tab row** and changes per tab:
`Copy Summary 📄` on Summary, `Copy Transcript 📋` on Transcript, nothing on Ask Fathom.
Cyan label on `#1F2A31`, 8px radius.

### 4.3 Summary tab

- **Toolbar:** a segmented `Enhanced ⌄` dropdown with an attached **⚙ gear button** sharing
  one pill outline; then a separate `✨ Auto ⌄` pill. Both `#212124`, radius `9999px`.
- **Amber notice:** full-width `#322809` bar, radius 8px, `✨ NEW: Customize this summary
  by clicking the ⚙ icon above` in `#FDC72F`.
- **Body:** `Meeting Purpose` (20px/600) then a paragraph; `Key Takeaways` then disc
  bullets that use a **bold run-in label** — `**Product:** "One More Email," an AI tool…`.
  That run-in label pattern is what makes the summary read as structured; reproduce it.

### 4.4 Transcript tab — now fully observed

- **Search overlay:** a `Search Transcript` input, ~250px, `#1D1E1F`, rounded, **pinned
  top-right and floating over the content** (it visibly overlaps bubbles). Not a static row.
- **Turns:** speaker name (`Abdullah`) 14px muted, **right-aligned** above the group; then
  one **bubble per sentence**, `#4A4B4B`, 8px radius, ~14px padding, ~6px apart. The
  single-speaker recording means alternation is unobserved — assume the other speaker
  mirrors to the left.
- **Left gutter, on hover:** a cyan **`⊕` circular button** at the far left (add
  highlight / action item) and a **`⋯` circular button** just left of the bubble.
- **`⋯` context menu** (`#111314`, 8px radius, caret pointing at the button):
  `✏ Edit transcript` · `👤 Change speaker` · `✂ Trim this section` ·
  `✂ Trim all sections after this section`. Icons 18px, labels 15px/600, ~16px apart.
- **Multi-select:** selected turns get a **filled circular checkmark** in the gutter, the
  group gains a light 1px outline, and the selected sentences **invert to a white fill
  with black text**. Unselected content around it dims.
- **`↓ Resume Auto-Scroll`** — a cyan pill floating at the bottom-center of the panel,
  shown once the user scrolls away from the playhead.

### 4.5 Ask Fathom tab

Empty state, centered: a ~72px dark circle holding the cyan Fathom glyph; **"Hi, what can
I tell you about this meeting?"** at 18px/600; then a **2×2 grid of suggestion cards**
(`#212124`, 8px radius, 15px, left-aligned text, generous padding):
*Detail all timelines discussed* · *Describe the key stakeholders?* ·
*Who else should we speak to?* · *Why was this meeting scheduled?*
Below, a full-width `Ask Fathom AI` input with a **square teal send button** inside its
right edge.

### 4.6 Right rail

- **Title** 28px/600, wrapping; **date** 14px muted beneath.
- **Action row:** a **wide `Share` button** (fills the rail minus the overflow button) —
  `#1F2A31` fill, cyan 15px/600 label left-aligned, **link glyph right-aligned inside**;
  then a separate square `⋮` button.
- **`ACTION ITEMS`** section label, then either the item list or the **empty state**:
  a `#212124` rounded box, 16px padding, with *"None detected. Add manually on transcript
  tab"* in muted italic. This box is the house empty-state pattern — reuse it.

### 4.7 Attendees and highlights — a real gap

The brief asks for participants and highlights. The **older** tutorial screenshot has
dedicated `ATTENDEES` and `ANNOTATIONS` rail sections; **the current captures have
neither.** Two readings: they were removed, or they are hidden because this meeting has
one participant and no annotations. The `ACTION ITEMS` section renders even when empty,
which mildly favors "removed".

**Recommendation:** build both sections in the rail, styled exactly like `ACTION ITEMS`
(section label + rows, or the italic empty box). It satisfies the brief, it is consistent
with the observed system, and it is honest — flag in the README that this part follows the
older UI because the current captures do not exercise it.

### 4.8 Share modal — observed

- Centered, ~660px wide, 12px radius, `#26252A`. Backdrop dims the page heavily (~75%).
- **Header:** `Share Recording` 26px/600, `✕` close button right.
- **Body:** a full-width `Add users and emails` search input (`#26252A`, magnifier, 8px
  radius); the `PEOPLE WITH ACCESS` section label; then rows — name 16px/600, email 14px
  muted below, role (`Owner`) muted right-aligned.
- **Footer bar, `#141417`** (a distinctly darker band): left, a globe icon +
  `Anyone with the link can view ⌄`; right, a **`🔗 Copy Link` outlined button** —
  transparent fill, 1px cyan border, cyan label.
- The **two-tone modal** (lighter body, darker footer) is the pattern to copy.

---

## 5. Other screens

### 5.1 Deals table — observed, but **cut from the build**

The only real table in the captures, so it defines table style if needed: header with a
count pill (`145`) and right-aligned filter pills; 11px uppercase muted column headers
with a sort caret; ~52px rows with a 1px bottom hairline, no zebra; footer with numeric
pagination and `Show 15 per page ⌄`.

### 5.2 Playlists — populated layout inferred from a preview

Groups titled `ThinkBionics - New Features` (16px/600) with a meta line
`3 Highlights (18 min) · Last updated Nov 25`, above a row of highlight cards.

### 5.3 Auth / onboarding — **all cut.**

---

## 6. Screen relationships

```
        ┌──────────── Top bar (both layouts) ────────────┐
        │  search ──▶ filters the list in place          │
        └────────────────────┬───────────────────────────┘
                             │
   ┌── LIST LAYOUT (+ tab nav, + Ask Fathom rail) ──┐
   │  My Calls · Team Calls · Playlists · Alerts    │
   │       │ card click            ⋮ ──▶ Copy link / Delete
   └───────┼────────────────────────────────────────┘
           ▼
   ┌── DETAIL LAYOUT (no tab nav, no rail) ─────────┐
   │  SUMMARY │ TRANSCRIPT │ ASK FATHOM             │
   │     transcript ⊕ ──▶ creates an action item ───┼──▶ rail ACTION ITEMS
   │     transcript ⋯ ──▶ edit / speaker / trim     │
   │     Share ──▶ Share Recording modal            │
   │     timestamp ──▶ seeks the player (no nav)    │
   └────────────────────────────────────────────────┘
```

The load-bearing relationships:

1. **List → detail** is the only true navigation.
2. **Transcript `⊕` → rail action item** is the one cross-panel write in the product, and
   it explains the empty state's own copy: *"Add manually on transcript tab."* Wiring this
   makes the prototype feel alive for very little code.
3. **Timestamp → player seek** — one shared callback, reused everywhere.

---

## 7. States, motion, responsive

### 7.1 Observed states

Popover/context menu, modal, transcript multi-select, and the italic empty-state box are
all observed — see their sections.

### 7.2 Inferred states

No hover, focus or loading state appears in any capture.

- **Hover:** surfaces lift one step (`#1A1A1A→#212124`, `#212124→#26262A`); text targets go
  cyan. Transcript rows reveal the `⊕` and `⋯` buttons. 120ms ease-out.
- **Focus-visible:** 2px `#02BEFF` outline at 2px offset. The product shows none; ship it
  anyway — its absence is a genuine accessibility defect, not a style choice.
- **Disabled:** 40% opacity.

### 7.3 Loading

Unobserved. Use **skeletons, not spinners** — `#212124` blocks at final geometry. The
detail page needs a player block plus three text lines; the list needs a card skeleton.

### 7.4 Motion

Nothing animated is provable from stills. Keep it sober: 120–160ms ease-out on hover,
200ms on the tab-underline slide, 150ms fade + 4px rise for modals and popovers, 200ms for
rail collapse. Respect `prefers-reduced-motion`.

### 7.5 Responsive — entirely inferred

| Width | Behavior |
|---|---|
| ≥1440 | Detail container 1120px centered; list rail open at 400px |
| 1100–1439 | Rail collapses to an icon button; detail columns compress, rail floor 360px |
| 768–1099 | Detail stacks: player → tabs → rail content below. Card grid 1-up |
| <768 | Primary nav becomes a scrolling tab strip; player sticky at top of detail |

---

## 8. Proposed build — smallest convincing set

**Rule: anything that is not the meeting detail page, or the path to it, is cut.**

### 8.1 Routes — 2 (+1 optional)

| Route | Purpose | Priority |
|---|---|---|
| `/` | My Calls — date groups, ~500px cards, overflow menu, search filter, empty state | P0 |
| `/calls/[id]` | Meeting detail — three tabs, player, rail, share modal | **P0 — half the day** |
| `/playlists` | Optional; reuses the card | P2 — cut first |

`Team Calls` / `Alerts` reuse the list with different fixtures. `Deals` and `Settings` are
cut — give them an honest "not in this prototype" state rather than dead tabs.

### 8.2 Components — 17

**Layouts (3)** · `ListLayout` (top bar + tab nav + rail slot) · `DetailLayout` (top bar +
centered 1120px container) · `TopBar`.

**Primitives (6)** · `Button` (primary / soft-accent / outline / ghost) · `Pill` ·
`IconButton` (circular) · `Popover` (menus — one component serves the card menu and the
transcript menu) · `EmptyBox` (the italic empty state) · `Skeleton`.

**List (3)** · `CallCard` · `DateGroup` · `SearchInput`.

**Detail (5)** · `VideoPlayer` · `SummaryPanel` · `TranscriptPanel` ·
`ActionItemList` · `ShareModal`.

`AskFathomPanel` does double duty: the meeting-scoped tab and the account-scoped rail are
the same suggestion-grid-plus-composer component with different props.

### 8.3 Data

One `fixtures/meetings.ts` — **3 meetings**, one richly populated:

```ts
type Meeting = {
  id, title, date, startTime, meetingCode, durationSec
  posterGradient: string          // audio-only calls render a gradient, not a still
  speakers: { name, initial, color }[]
  summary:    { heading, body }[] // body: paragraph | bullets with bold run-in labels
  transcript: { tSec, speaker, sentences: string[] }[]
  actionItems:{ id, text, owner, tSec, done }[]
  attendees:  { name, role, company }[]   // see §4.7
  highlights: { kind, label, tSec, note }[]
}
```

### 8.4 The two things to get right

1. **A real `<video>` with shared `currentTime`**, so every timestamp seeks it and the
   transcript auto-highlights the active turn. A beautiful but inert page will not convince.
2. **Transcript `⊕` → creates an action item in the rail.** One cross-panel interaction
   that turns three static panels into a product.

### 8.5 Rough budget

| Block | Hours |
|---|---|
| Tokens, Tailwind config, both layouts, top bar, tab nav | 1.5 |
| My Calls: card, date groups, overflow popover, search, empty state | 1.5 |
| Detail scaffold, right rail, share modal | 1.5 |
| Player + shared seek state | 1.5 |
| Summary tab | 1.0 |
| Transcript tab (bubbles, search, ⊕/⋯, context menu) | 1.5 |
| Ask Fathom tab (shared with rail) | 0.5 |
| Skeletons, hover/focus, responsive pass | 1.0 |
| **Total** | **10** |

Cut order if the day runs short: **Playlists → Ask Fathom → transcript multi-select →
responsive below 768px.** Never cut the player seek wiring.

---

## 10. What Revision 1 got wrong

Kept deliberately, since the errors came from reasoning off low-resolution previews and
the corrections are the useful part.

| # | Revision 1 said | Actually |
|---|---|---|
| 1 | Detail page carries the primary tab nav | It has **no** nav strip |
| 2 | Ask Fathom is a right rail everywhere | A **rail on list pages, a tab on detail** |
| 3 | Tabs are `SUMMARY` / `TRANSCRIPT` | Three: **+ `ASK FATHOM`** |
| 4 | Detail is full-width two-column | **~1120px centered**, 662 / 429 |
| 5 | Content panel is `#1A1A1A` | **`#000000`** — darker than the canvas |
| 6 | Scrubber is amber with annotation ticks | **Grey track, blue playhead bar**, no ticks |
| 7 | Date headers are uppercase muted | **Sentence case, 20px/600, white** |
| 8 | Cards carry a company logo + talk-time badge | Those are **Team Calls**; My Calls cards are title + `⋮` |
| 9 | Transcript design unknown, proposed generically | Observed: **bubbles, floating search, ⊕/⋯, multi-select** |
| 10 | Share modal inferred | Observed, including the **two-tone footer** |
| 11 | Build the 5-tab marketing redesign's badges | That UI is **speculative** — not in the product |
