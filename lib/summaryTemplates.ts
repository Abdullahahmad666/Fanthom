import type { Meeting, SummarySection, TemplateId } from "./types";
import { participantById } from "./types";

/**
 * The summary template catalogue.
 *
 * The product offers sixteen. Some are a reframing of what any call already
 * contains and can be built here from the transcript and the action items;
 * the rest -- the sales methodologies, the interview scorecard -- need
 * classification this prototype has no model for, and inventing their output
 * would be the one thing worse than not offering them.
 *
 * So all sixteen are listed, and the ones that cannot be built say so rather
 * than producing something that looks authored and is not. `build` returning
 * null means the same thing at the level of a single call: the template is
 * real but this recording has nothing for it.
 */

export type TemplateIcon =
  | "insights"
  | "sales"
  | "cs"
  | "candidate"
  | "demo"
  | "oneonone"
  | "kickoff"
  | "update"
  | "qa"
  | "retro"
  | "standup";

export type TemplateDef = {
  id: string;
  name: string;
  description: string;
  icon: TemplateIcon;
  /** Derives the template from the call. Omitted when it needs a model. */
  build?: (m: Meeting) => SummarySection[] | null;
};

/* ------------------------------------------------------------- builders */

const bullets = (
  items: { label?: string; text: string; cues?: number[] }[],
): SummarySection["blocks"] => [{ kind: "bullets", items }];

/** Every sentence in speaker order, with its turn, for the scanners below. */
function sentences(m: Meeting) {
  return m.transcript.flatMap((turn) =>
    turn.sentences.map((s) => ({ ...s, speakerId: turn.speakerId })),
  );
}

const nameOf = (m: Meeting, id: string) => participantById(m, id)?.name ?? id;

/**
 * Q&A -- every question asked, answered by what was said next.
 *
 * The most literal of the derived templates: a question mark is a question,
 * and the next speaker's first sentence is the answer.
 */
function buildQA(m: Meeting): SummarySection[] | null {
  const all = sentences(m);
  const pairs: { label?: string; text: string; cues?: number[] }[] = [];

  all.forEach((s, i) => {
    if (!s.text.trim().endsWith("?")) return;
    const reply = all.slice(i + 1).find((r) => r.speakerId !== s.speakerId);
    if (!reply) return;
    pairs.push({
      label: nameOf(m, s.speakerId),
      text: `${s.text} — ${nameOf(m, reply.speakerId)}: ${reply.text}`,
      /* The question and the answer both, so the chip row plays either. */
      cues: [s.tSec, reply.tSec],
    });
  });

  if (pairs.length === 0) return null;
  return [{ heading: "Questions & answers", blocks: bullets(pairs.slice(0, 12)) }];
}

/** The longest things a person said, which is a decent proxy for their point. */
function perSpeaker(m: Meeting, take: number) {
  return m.participants
    .map((p) => {
      const mine = sentences(m)
        .filter((s) => s.speakerId === p.id)
        .sort((a, b) => b.text.length - a.text.length)
        .slice(0, take)
        .sort((a, b) => a.tSec - b.tSec);
      return { person: p, said: mine };
    })
    .filter((r) => r.said.length > 0);
}

function buildStandUp(m: Meeting): SummarySection[] | null {
  const rows = perSpeaker(m, 2);
  if (rows.length === 0) return null;

  return rows.map(({ person, said }) => ({
    heading: person.name,
    blocks: bullets(said.map((s) => ({ text: s.text, cues: [s.tSec] }))),
  }));
}

function buildOneOnOne(m: Meeting): SummarySection[] | null {
  const rows = perSpeaker(m, 3);
  if (rows.length < 1) return null;

  return [
    {
      heading: "Updates & priorities",
      blocks: bullets(
        rows.flatMap(({ person, said }) =>
          said.slice(0, 2).map((s) => ({ label: person.name, text: s.text, cues: [s.tSec] })),
        ),
      ),
    },
    {
      heading: "Discussion",
      blocks: bullets(
        rows
          .map(({ said }) => said[2])
          .filter(Boolean)
          .map((s) => ({ text: s.text, cues: [s.tSec] })),
      ),
    },
  ];
}

/** Built from the real action items, which already carry owner and timestamp. */
function buildProjectUpdate(m: Meeting): SummarySection[] | null {
  if (m.actionItems.length === 0) return null;

  const row = (i: (typeof m.actionItems)[number]) => ({
    label: nameOf(m, i.ownerId),
    text: i.text,
    cues: [i.tSec],
  });

  const open = m.actionItems.filter((i) => !i.done).map(row);
  const done = m.actionItems.filter((i) => i.done).map(row);

  const out: SummarySection[] = [];
  if (open.length) out.push({ heading: "In flight", blocks: bullets(open) });
  if (done.length) out.push({ heading: "Closed out", blocks: bullets(done) });
  out.push({
    heading: "Next steps",
    blocks: [
      {
        kind: "para",
        text: `${open.length} open item${open.length === 1 ? "" : "s"} across ${
          new Set(m.actionItems.map((i) => i.ownerId)).size
        } owner${new Set(m.actionItems.map((i) => i.ownerId)).size === 1 ? "" : "s"}.`,
      },
    ],
  });
  return out;
}

const START = /\b(should|we need to|let's|propose|going to|plan to|next time)\b/i;
const STOP = /\b(stop|drop|cut|avoid|too much|no longer|scrap)\b/i;
const CONTINUE = /\b(keep|worked|went well|good|works|helped|right call)\b/i;

/** Retrospective by keyword, which is coarse but reads the real transcript. */
function buildRetro(m: Meeting): SummarySection[] | null {
  const all = sentences(m);
  const pick = (re: RegExp) =>
    all
      .filter((s) => re.test(s.text))
      .slice(0, 5)
      .map((s) => ({ label: nameOf(m, s.speakerId), text: s.text, cues: [s.tSec] }));

  const start = pick(START);
  const stop = pick(STOP);
  const cont = pick(CONTINUE);
  if (start.length + stop.length + cont.length === 0) return null;

  const out: SummarySection[] = [];
  if (start.length) out.push({ heading: "Start", blocks: bullets(start) });
  if (stop.length) out.push({ heading: "Stop", blocks: bullets(stop) });
  if (cont.length) out.push({ heading: "Continue", blocks: bullets(cont) });
  return out;
}

/* ------------------------------------------------------------ catalogue */

export const TEMPLATE_CATALOGUE: TemplateDef[] = [
  {
    id: "enhanced",
    name: "Enhanced",
    description: "Capture any call's insights and key takeaways.",
    icon: "insights",
  },
  {
    id: "general",
    name: "General",
    description: "A plain recap of what was said.",
    icon: "insights",
  },
  {
    id: "sales",
    name: "Sales",
    description: "Unpack a prospect's needs, challenges, and buying journey.",
    icon: "sales",
  },
  {
    id: "sales-sandler",
    name: "Sales - Sandler",
    description: "Notes based on Sandler Selling System",
    icon: "sales",
  },
  {
    id: "sales-spiced",
    name: "Sales - SPICED",
    description: "Notes based on the sales methodology by Winning by Design.",
    icon: "sales",
  },
  {
    id: "sales-meddpicc",
    name: "Sales - MEDDPICC",
    description: "Notes based on the popular sales methodology.",
    icon: "sales",
  },
  {
    id: "sales-bant",
    name: "Sales - BANT",
    description: "Notes based on the popular sales methodology.",
    icon: "sales",
  },
  {
    id: "customer-success",
    name: "Customer Success",
    description: "Experiences, challenges, goals, and Q&A.",
    icon: "cs",
  },
  {
    id: "customer-success-reach",
    name: "Customer Success - REACH™",
    description: "Notes based on an expansion framework by HelloCCO",
    icon: "cs",
  },
  {
    id: "candidate-interview",
    name: "Candidate Interview",
    description: "Delve into a candidate's experience, goals, and responses.",
    icon: "candidate",
  },
  {
    id: "demo",
    name: "Demo",
    description: "Showcased journeys and impact.",
    icon: "demo",
  },
  {
    id: "one-on-one",
    name: "One-on-One",
    description: "Updates, priorities, support signals, and discussion.",
    icon: "oneonone",
    build: buildOneOnOne,
  },
  {
    id: "project-kickoff",
    name: "Project Kick-Off",
    description: "Vision, targets, and resources.",
    icon: "kickoff",
  },
  {
    id: "project-update",
    name: "Project Update",
    description: "Breakdown each task's status, discussion, and next steps.",
    icon: "update",
    build: buildProjectUpdate,
  },
  {
    id: "qa",
    name: "Q&A",
    description: "Recap questions with answers.",
    icon: "qa",
    build: buildQA,
  },
  {
    id: "retrospective",
    name: "Retrospective",
    description: "Capture processes to start, stop, and continue.",
    icon: "retro",
    build: buildRetro,
  },
  {
    id: "standup",
    name: "Stand Up",
    description: "Track daily progress, tasks, and obstacles.",
    icon: "standup",
    build: buildStandUp,
  },
];

export type ResolvedTemplate = TemplateDef & {
  /** Null when this call has nothing for the template. */
  sections: SummarySection[] | null;
  /** True when the meeting ships an authored version rather than a derived one. */
  authored: boolean;
};

/**
 * Resolves the catalogue against one meeting.
 *
 * Every derived template attaches the timestamp each line came from. They all
 * had it already -- several were printing it as a static `12:04` label -- but
 * none passed it through as a cue, so the one feature the product is built
 * around was missing from every template on every seeded meeting. Measured
 * before the fix: 0 cues across 8 usable templates on the first fixture.
 *
 * An authored summary always wins over a derived one -- the fixtures write
 * better copy than any of these scanners.
 */
export function resolveTemplates(meeting: Meeting): ResolvedTemplate[] {
  return TEMPLATE_CATALOGUE.map((def) => {
    const authored = meeting.summaries[def.id as TemplateId];
    if (authored && authored.length > 0) {
      return { ...def, sections: authored, authored: true };
    }
    return { ...def, sections: def.build?.(meeting) ?? null, authored: false };
  });
}
