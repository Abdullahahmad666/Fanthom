/**
 * End-to-end exercise of the transcript pipeline, on real input.
 *
 * Everything below is pure, so it can be driven without a database or a
 * session -- which is the point: these are the parts that decide whether the
 * product's central claim holds.
 */
import { parseTranscript, detectFormat } from "@/lib/transcript/parse";
import { extractNotes } from "@/lib/transcript/extract";

const VTT = `WEBVTT

1
00:00:12.000 --> 00:00:31.000
Maya Chen: We are not going to make the 14th. The rehearsal has not run once end to end, and I would rather move the date than ship blind.

2
00:00:31.000 --> 00:00:48.000
Tom Okafor: Agreed. If we slip to the 21st we get two full rehearsal windows and the support team stops guessing.

3
00:00:48.000 --> 00:01:09.000
Maya Chen: Then let us call it: the launch moves to the 21st. I will tell the exec channel today so nobody hears it secondhand.

4
00:01:09.000 --> 00:01:30.000
Priya Raman: One risk. The billing migration still has no rollback, so if it goes wrong on launch night we are editing rows by hand.

5
00:01:30.000 --> 00:01:49.000
Tom Okafor: I will write the rollback script before the first rehearsal. It is half a day, and I would rather spend it now.

6
00:01:49.000 --> 00:02:10.000
Priya Raman: I can't promise the support rota by Friday, but I can have a draft.

7
00:02:10.000 --> 00:02:26.000
Maya Chen: Okay, let's get into it. Conversion is at 4.2 percent this week, up from 3.8.
`;

const SRT = `1
00:00:12,000 --> 00:00:31,000
Maya Chen: We are not going to make the 14th.

2
00:00:31,000 --> 00:00:48,000
Tom Okafor: Agreed, slip to the 21st.
`;

const PLAIN = `Maya Chen: We are not going to make the 14th.
Tom Okafor: Agreed, slip to the 21st.
Priya Raman: The billing migration still has no rollback.`;

let pass = 0;
let fail = 0;
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${detail ? "  -- " + detail : ""}`); }
};

console.log("\n=== 1. format detection ===");
check("vtt detected", detectFormat(VTT, "a.vtt") === "vtt", detectFormat(VTT, "a.vtt"));
check("srt detected", detectFormat(SRT, "a.srt") === "srt", detectFormat(SRT, "a.srt"));
check("plain detected", detectFormat(PLAIN, "a.txt") === "text", detectFormat(PLAIN, "a.txt"));

console.log("\n=== 2. parsing ===");
const parsed = parseTranscript(VTT, "launch.vtt");
check("speakers found", parsed.speakers.length === 3, parsed.speakers.join(", "));
check("turns grouped", parsed.turns.length >= 6, String(parsed.turns.length));
check("duration read", parsed.durationSec > 140, String(parsed.durationSec));
check("no unattributed lines", parsed.unattributed === 0, String(parsed.unattributed));
check("srt parses", parseTranscript(SRT, "a.srt").turns.length === 2);
check("plain parses", parseTranscript(PLAIN, "a.txt").turns.length === 3);

console.log("\n=== 3. colon that is not a speaker ===");
const tricky = parseTranscript("Maya Chen: Here is the thing: we cannot ship.", "x.txt");
check(
  "'Here is the thing:' does not invent a speaker",
  tricky.speakers.length === 1 && tricky.speakers[0] === "Maya Chen",
  tricky.speakers.join(" | "),
);

console.log("\n=== 4. extraction ===");
const notes = extractNotes(parsed.turns, parsed.durationSec);
const all = notes.sections.flatMap((s) => s.blocks.flatMap((b) => (b.kind === "bullets" ? b.items : [])));
const text = all.map((i) => i.text).join(" | ");
check("produced sections", notes.sections.length > 0, String(notes.sections.length));
check("found the decision", /21st/.test(text), text.slice(0, 90));
check("found the risk", /rollback|billing/i.test(text));
check("found action items", notes.actionItems.length > 0, String(notes.actionItems.length));
check(
  "\"I can't promise\" is NOT an action item",
  !notes.actionItems.some((a) => /can't promise|cannot promise/i.test(a.text)),
  notes.actionItems.map((a) => a.text).join(" | ").slice(0, 100),
);
check(
  "\"let's get into it\" is NOT a decision",
  !/get into it/i.test(text),
);

console.log("\n=== 5. every kept line carries a cue ===");
const withCues = all.filter((i) => Array.isArray(i.cues) && i.cues.length > 0);
check(
  `all ${all.length} bullets carry timestamps`,
  withCues.length === all.length,
  `${withCues.length}/${all.length}`,
);
/* Action items carry a single `tSec` rather than a `cues` array. */
const actionCues = notes.actionItems.filter((a) => typeof a.tSec === "number" && a.tSec >= 0);
check(
  `all ${notes.actionItems.length} action items carry timestamps`,
  actionCues.length === notes.actionItems.length,
  notes.actionItems.map((a) => `${a.ownerName}@${a.tSec}`).join(", "),
);

console.log("\n=== 6. cue accuracy: does each timestamp land on the right sentence? ===");
/*
 * The product's central claim: a timestamp on a line must point at the
 * sentence that line was taken from. Every sentence in the transcript carries
 * its own tSec, so a cue is correct when a sentence with that exact tSec
 * contains the quoted text.
 */
const sentences = parsed.turns.flatMap((t) =>
  t.sentences.map((s) => ({ ...s, speaker: t.speaker })),
);

let exact = 0;
let checked = 0;
const misses: string[] = [];
for (const item of all) {
  const t = item.cues?.[0];
  if (t === undefined) continue;
  checked++;
  const at = sentences.find((s) => Math.abs(s.tSec - t) < 0.01);
  if (at && at.text.trim().startsWith(item.text.trim().slice(0, 24))) exact++;
  else misses.push(`@${t} wanted "${item.text.slice(0, 32)}" got "${at?.text.slice(0, 32) ?? "(no sentence)"}"`);
}
check(`${exact}/${checked} cues land on the exact sentence quoted`, exact === checked, misses.join(" ; "));

/* Action items too -- they are the lines people act on. */
let aExact = 0;
for (const a of notes.actionItems) {
  const at = sentences.find((s) => Math.abs(s.tSec - a.tSec) < 0.01);
  if (at && at.text.includes(a.text.slice(0, 20))) aExact++;
}
check(
  `${aExact}/${notes.actionItems.length} action items land on their sentence`,
  aExact === notes.actionItems.length,
);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exitCode = 1;

/* ------------------------------------------------------------------ *
 * The meeting-page features, exercised against a real fixture meeting.
 * ------------------------------------------------------------------ */
import { MEETINGS } from "@/lib/fixtures";
import { LANGUAGES, translateSections } from "@/lib/translations";
import { resolveTemplates } from "@/lib/summaryTemplates";
import { excerptAt, cuesIn } from "@/lib/cues";

const meeting = MEETINGS[0];
console.log(`\n=== 7. summary templates (the "enhance" menu) — ${meeting.title} ===`);
const templates = resolveTemplates(meeting);
const usable = templates.filter((t) => t.sections && t.sections.length > 0);
check(`catalogue resolves (${templates.length} templates)`, templates.length > 0);
check(`${usable.length} produce sections for this meeting`, usable.length > 0,
  usable.map((t) => t.id).join(", "));
check("unusable templates report null rather than empty copy",
  templates.every((t) => t.sections === null || t.sections.length > 0));

console.log("\n=== 8. translation ===");
const base = usable[0].sections!;
for (const l of LANGUAGES) {
  const out = translateSections(base, l.code);
  const same = JSON.stringify(out.sections) === JSON.stringify(base);
  if (l.code === "en") {
    check("english is a no-op", same && out.untranslated === 0);
  } else {
    check(`${l.name}: headings translated, misses reported (${out.untranslated})`,
      !same || out.untranslated > 0,
      `changed=${!same} untranslated=${out.untranslated}`);
  }
}
check("translation never drops a section",
  LANGUAGES.every((l) => translateSections(base, l.code).sections.length === base.length));
check("translation never drops a bullet",
  LANGUAGES.every((l) => {
    const t = translateSections(base, l.code).sections;
    const n = (ss: typeof base) => ss.flatMap((s) => s.blocks.flatMap((b) => (b.kind === "bullets" ? b.items : [b]))).length;
    return n(t) === n(base);
  }));

console.log("\n=== 9. provenance: excerptAt ===");
/* The template the app opens on: the first that carries its sources. */
const opened = usable.find((t) =>
  t.sections!.some((sec) =>
    sec.blocks.some((b) => b.kind === "bullets" && b.items.some((i) => i.cues?.length)),
  ),
);
check("a meeting opens on a template that has cues", Boolean(opened), opened?.id ?? "none");
const cueList = cuesIn(opened?.sections ?? base);
check(`summary references ${cueList.length} moments`, cueList.length > 0);
let resolved = 0;
for (const t of cueList) {
  const ex = excerptAt(meeting, t);
  if (ex && ex.text.trim().length > 0) resolved++;
}
check(`${resolved}/${cueList.length} cues return a transcript excerpt`,
  resolved === cueList.length, `${resolved}/${cueList.length}`);

check("a cue far from any line refuses rather than guessing",
  excerptAt(meeting, 999999) === null);

console.log("\n=== 10. highlights and clips on this meeting ===");
check(`meeting carries ${meeting.highlights.length} highlights`, meeting.highlights.length >= 0);
check("every highlight has a timestamp and a kind",
  meeting.highlights.every((h) => typeof h.tSec === "number" && Boolean(h.kind)));
check("every highlight resolves to a transcript moment",
  meeting.highlights.every((h) => excerptAt(meeting, h.tSec) !== null),
  meeting.highlights.filter((h) => !excerptAt(meeting, h.tSec)).map((h) => h.tSec).join(","));
