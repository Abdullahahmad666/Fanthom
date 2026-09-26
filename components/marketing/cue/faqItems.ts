/**
 * The FAQ content.
 *
 * Plain data in its own module because two components need it: the accordion,
 * which is a client component, and the JSON-LD block, which is a Server
 * Component. A value exported from a `"use client"` file is not that value on
 * the server -- it arrives as a client reference proxy and `.map()` throws at
 * render time.
 *
 * Sharing one array is also what keeps the structured data honest: the
 * questions a crawler is told the page answers are literally the questions it
 * renders.
 */

export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Does Cue join my meetings?",
    a: "No. Cue never joins a call, and nobody in your meeting is told a recorder arrived, because there is no recorder. Cue only reads a transcript your conferencing tool already wrote. The trade-off is real: if you did not record the meeting, Cue has nothing to read.",
  },
  {
    q: "Where does the summary come from if there is no AI model?",
    a: "From your meeting. Cue reads the transcript for the shapes that carry weight — a decision being made, a commitment being given, a risk being named — and keeps those sentences exactly as they were said. It is extraction, not generation, which is precisely why every line can point at a timestamp.",
  },
  {
    q: "What does a timestamp on a summary line actually do?",
    a: "Hover it to read the sentence it came from, click it to jump to that second in the recording. That is the whole product: a summary line you can check in one click, rather than a claim you have to trust.",
  },
  {
    q: "Which files can I import?",
    a: "WebVTT (.vtt) from Zoom and Teams, SubRip (.srt), and plain text. A simple “Name: what they said” log parses too. The file is read in your browser first and you see what Cue found before anything is saved.",
  },
  {
    q: "Is my transcript private?",
    a: "It is stored in a Postgres row scoped to your account by row level security, so the database itself refuses to return it to anyone else. There is no analytics in this application and nothing is shared with a third party. You can delete everything from Settings.",
  },
  {
    q: "Can I use Cue with my team?",
    a: "Not yet. Shared libraries, per-meeting permissions and SSO are coming soon — they are marked that way on the pricing page. Cue is a single-person tool today.",
  },
  {
    q: "What does it cost?",
    a: "Nothing — Cue is free while it is in early access. The pricing page shows how it will be priced later, with every feature marked available now or coming soon.",
  },
];
