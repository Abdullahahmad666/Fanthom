/**
 * The transcript the landing page argues from.
 *
 * One real-shaped meeting rather than lorem: the page's whole claim is that a
 * summary line can be checked against what was said, and that claim is only
 * testable if there is something to check it against. Every bullet below
 * quotes these turns verbatim, so anyone can read the excerpt and confirm the
 * line was not invented -- which is the demo.
 */

export type DemoTurn = {
  tSec: number;
  speaker: string;
  text: string;
};

export const DEMO_TURNS: DemoTurn[] = [
  {
    tSec: 184,
    speaker: "Maya Chen",
    text: "We are not going to make the 14th. The rehearsal has not run once end to end, and I would rather move the date than ship blind.",
  },
  {
    tSec: 212,
    speaker: "Tom Okafor",
    text: "Agreed. If we slip to the 21st we get two full rehearsal windows and the support team stops guessing.",
  },
  {
    tSec: 258,
    speaker: "Maya Chen",
    text: "Then let us call it: the launch moves to the 21st. I will tell the exec channel today so nobody hears it secondhand.",
  },
  {
    tSec: 431,
    speaker: "Priya Raman",
    text: "One risk. The billing migration still has no rollback, so if it goes wrong on launch night we are editing rows by hand.",
  },
  {
    tSec: 470,
    speaker: "Tom Okafor",
    text: "I will write the rollback script before the first rehearsal. It is half a day, and I would rather spend it now.",
  },
  {
    tSec: 612,
    speaker: "Priya Raman",
    text: "Support headcount is the other one. We are at three people for a launch week that we think doubles ticket volume.",
  },
];

/** A bullet, and the moments it was taken from. */
export type DemoLine = {
  heading: string;
  text: string;
  cues: number[];
};

export const DEMO_SUMMARY: DemoLine[] = [
  {
    heading: "Decisions",
    text: "Launch moves from the 14th to the 21st, to get two full rehearsal windows.",
    cues: [184, 212, 258],
  },
  {
    heading: "Risks",
    text: "The billing migration has no rollback path.",
    cues: [431],
  },
  {
    heading: "Risks",
    text: "Support is staffed at three for a week expected to double ticket volume.",
    cues: [612],
  },
];

export const DEMO_ACTIONS: DemoLine[] = [
  {
    heading: "Tom Okafor",
    text: "Write the billing rollback script before the first rehearsal.",
    cues: [470],
  },
  {
    heading: "Maya Chen",
    text: "Tell the exec channel about the new date today.",
    cues: [258],
  },
];

export function turnAt(tSec: number): DemoTurn | undefined {
  return DEMO_TURNS.find((t) => t.tSec === tSec);
}
