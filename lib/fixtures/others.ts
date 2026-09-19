import type { Meeting } from "../types";
import { dialogue } from "./helpers";

const ABDULLAH = {
  id: "abdullah",
  name: "Abdullah Ahmad",
  role: "Founder",
  company: "One More Email",
  color: "#c2185b",
  isOwner: true,
  email: "abdullahahmad5618@gmail.com",
};

/** A sales discovery call -- exercises the Sales Call summary template. */
export const brightcodeDiscovery: Meeting = {
  id: "brightcode-discovery",
  title: "BrightCode // Discovery Call",
  date: "2026-09-18",
  startTime: "2:15 PM",
  meetingCode: "qmn-8rtd-woz",
  platform: "Zoom",
  durationSec: 1687,
  poster: ["#c2410c", "#3b1206"],
  participants: [
    ABDULLAH,
    { id: "elena", name: "Elena Vasquez", role: "Head of Finance", company: "BrightCode", color: "#7c3aed", email: "elena@brightcode.dev" },
    { id: "marcus", name: "Marcus Bell", role: "Financial Controller", company: "BrightCode", color: "#0891b2", email: "marcus@brightcode.dev" },
  ],
  summaries: {
    sales: [
      {
        heading: "Deal Snapshot",
        blocks: [
          {
            kind: "bullets",
            items: [
              { label: "Pain", text: "Roughly 40 hours a month spent chasing invoices manually across two people." },
              { label: "Trigger", text: "Their controller is leaving in November and they do not intend to backfill the chasing work." },
              { label: "Budget", text: "Elena indicated a ceiling around $400/month without needing approval." },
              { label: "Next step", text: "Trial on their October invoice run, decision in the first week of November." },
            ],
          },
        ],
      },
      {
        heading: "Objections Raised",
        blocks: [
          {
            kind: "bullets",
            items: [
              { text: "Concern that automated reminders would read as impersonal to long-standing clients." },
              { text: "Needs to confirm it will not conflict with their existing Xero reminders." },
            ],
          },
        ],
      },
    ],
    general: [
      {
        heading: "Summary",
        blocks: [
          {
            kind: "para",
            text: "BrightCode spend around 40 hours a month chasing unpaid invoices. Their controller leaves in November, which is the real forcing function. Main hesitation is tone — they do not want automated chasing to damage relationships with clients they have had for years.",
          },
        ],
      },
    ],
  },
  transcript: dialogue([
    [6, "abdullah", "Thanks for making the time. Before I show you anything, I'd rather understand how you chase invoices today."],
    [24, "elena", "Honestly? Badly.", "Marcus has a spreadsheet and a calendar reminder and that's the whole system."],
    [48, "marcus", "It's not quite that bad, but it's close.", "I block out Friday afternoons for it and it usually spills into Monday."],
    [74, "abdullah", "How many invoices are we talking about in a month?"],
    [86, "marcus", "Between ninety and a hundred and twenty. Maybe fifteen of those need chasing more than once."],
    [108, "elena", "The time isn't really the problem though. It's that it's the first thing to get dropped when we're busy."],
    [130, "elena", "And the month we drop it is the month cash flow gets tight."],
    [146, "abdullah", "That's the pattern I see most often. It's not that people can't chase, it's that chasing is never the most urgent thing that day."],
    [170, "marcus", "There's a tone issue as well. Some of these clients we've had for six, seven years."],
    [190, "marcus", "I don't want them getting a robotic email on day one."],
    [206, "abdullah", "The sequence is editable per client, and you can exclude anyone entirely.", "For the ones you've had seven years, you'd probably want the first nudge to still come from you."],
    [238, "elena", "That would address most of my concern."],
    [250, "elena", "The other thing is we're on Xero and it already sends reminders. I don't want people getting two."],
    [272, "abdullah", "You'd turn the Xero ones off. Running both is the one setup I'd actively tell you not to do."],
    [294, "elena", "Fine. What does it cost?"],
    [302, "abdullah", "For your volume it's in the low hundreds a month. I'll send exact numbers today."],
    [320, "elena", "Anything under four hundred I can sign off without going to the board."],
    [336, "abdullah", "Then let's do this — trial it on your October run, and you decide in early November."],
    [356, "marcus", "That works. October's a heavy month, so it's a fair test."],
    [374, "elena", "One condition. If it makes a client complain, we stop."],
    [388, "abdullah", "That's reasonable. I'd want to know about that too."],
  ]),
  actionItems: [
    { id: "bc-1", text: "Send exact pricing for 90–120 invoices/month to Elena today", ownerId: "abdullah", tSec: 302, done: true },
    { id: "bc-2", text: "Document how to disable Xero's built-in reminders before trial starts", ownerId: "abdullah", tSec: 272, done: false },
    { id: "bc-3", text: "Set up trial against BrightCode's October invoice run", ownerId: "abdullah", tSec: 336, done: false },
    { id: "bc-4", text: "Prepare per-client exclusion list for long-standing accounts", ownerId: "marcus", tSec: 206, done: false },
  ],
  highlights: [
    { id: "bc-h1", kind: "highlight", tSec: 108, endSec: 146, note: "The real pain: chasing is the first thing dropped when busy", createdBy: "abdullah" },
    { id: "bc-h2", kind: "feedback", tSec: 170, endSec: 206, note: "Tone objection — seven-year clients shouldn't get a robotic first email", createdBy: "abdullah" },
    { id: "bc-h3", kind: "bookmark", tSec: 320, note: "Budget ceiling: $400/month without board approval", createdBy: "abdullah" },
  ],
};

/** A short internal 1:1 -- the everyday case between the extremes. */
export const designSync: Meeting = {
  id: "design-sync",
  title: "Weekly 1:1 // Priya",
  date: "2026-09-18",
  startTime: "9:30 AM",
  meetingCode: "lvc-2xkb-nmp",
  platform: "Microsoft Teams",
  durationSec: 928,
  poster: ["#6d28d9", "#1e1035"],
  participants: [
    ABDULLAH,
    { id: "priya", name: "Priya Raman", role: "Design Lead", company: "Northwind", color: "#db2777", email: "priya.raman@northwind.io" },
  ],
  summaries: {
    general: [
      {
        heading: "Summary",
        blocks: [
          {
            kind: "para",
            text: "Priya is blocked on the onboarding rewrite until the copy is signed off, and raised that design reviews are consistently being scheduled without enough notice to prepare.",
          },
        ],
      },
      {
        heading: "Discussed",
        blocks: [
          {
            kind: "bullets",
            items: [
              { text: "Onboarding invite step: a skippable version can ship this week." },
              { text: "Design review cadence is not working; moving to a fixed Tuesday slot." },
              { text: "Priya wants to spend Q4 on the settings area, which nobody owns." },
            ],
          },
        ],
      },
    ],
    standup: [
      {
        heading: "Blockers",
        blocks: [{ kind: "bullets", items: [{ label: "Priya", text: "Onboarding copy sign-off." }] }],
      },
      {
        heading: "In Progress",
        blocks: [{ kind: "bullets", items: [{ label: "Priya", text: "Skippable invite step, shipping this week." }] }],
      },
    ],
  },
  transcript: dialogue([
    [10, "abdullah", "How's the week looking?"],
    [18, "priya", "Fine, apart from one thing that's been bugging me.", "Design reviews keep getting scheduled with about two hours' notice."],
    [46, "priya", "I end up presenting work I haven't had time to think about properly."],
    [64, "abdullah", "That's on me, I've been booking them reactively. What would work better?"],
    [84, "priya", "A fixed slot. Tuesday afternoon, same time every week.", "If there's nothing to review we cancel it."],
    [110, "abdullah", "Let's do that from next week."],
    [122, "priya", "The other thing is the onboarding rewrite. I'm blocked on copy sign-off."],
    [142, "abdullah", "Who's sitting on it?"],
    [150, "priya", "Rachel, but she's blocked on pricing, so it's really the pricing decision."],
    [170, "abdullah", "The skippable version doesn't need new copy though, does it?"],
    [186, "priya", "No, that one I can ship this week regardless."],
    [200, "abdullah", "Then ship that and treat the full rewrite as unblocked-when-pricing-lands."],
    [220, "priya", "Last thing, and it's more of a Q4 question.", "Nobody owns settings. It's the most complained-about area and it has no design owner."],
    [252, "priya", "I'd like to take it."],
    [262, "abdullah", "I'd like you to take it. Let's scope it properly at the end of the quarter."],
  ]),
  actionItems: [
    { id: "ds-1", text: "Move design reviews to a fixed Tuesday afternoon slot from next week", ownerId: "abdullah", tSec: 110, done: false },
    { id: "ds-2", text: "Ship the skippable invite step this week, independent of copy sign-off", ownerId: "priya", tSec: 200, done: false },
    { id: "ds-3", text: "Scope settings-area ownership for Q4", ownerId: "abdullah", tSec: 262, done: false },
  ],
  highlights: [
    { id: "ds-h1", kind: "feedback", tSec: 18, endSec: 64, note: "Two hours' notice on design reviews — process problem worth fixing", createdBy: "abdullah" },
    { id: "ds-h2", kind: "bookmark", tSec: 220, note: "Settings has no design owner and is the most complained-about area", createdBy: "abdullah" },
  ],
};

/** An older call, so the list shows a third date group. */
export const onboardingCall: Meeting = {
  id: "meridian-onboarding",
  title: "Meridian // Onboarding & Setup",
  date: "2026-09-15",
  startTime: "11:00 AM",
  meetingCode: "tgh-9wpl-qra",
  platform: "Google Meet",
  durationSec: 2145,
  poster: ["#0f766e", "#062522"],
  participants: [
    ABDULLAH,
    { id: "james", name: "James Whitfield", role: "Operations Manager", company: "Meridian Supply", color: "#0891b2", email: "james@meridiansupply.com" },
    { id: "aisha", name: "Aisha Rahman", role: "Accounts Receivable", company: "Meridian Supply", color: "#ea580c", email: "aisha@meridiansupply.com" },
    { id: "lucas", name: "Lucas Petrov", role: "IT", company: "Meridian Supply", color: "#16a34a", email: "lucas@meridiansupply.com" },
  ],
  summaries: {
    general: [
      {
        heading: "Summary",
        blocks: [
          {
            kind: "para",
            text: "Walked Meridian through initial setup. Their invoice data is in a legacy system that only exports CSV, which shaped most of the session. Aisha will run a small batch first rather than importing everything at once.",
          },
        ],
      },
      {
        heading: "Setup Decisions",
        blocks: [
          {
            kind: "bullets",
            items: [
              { label: "Import", text: "Weekly CSV export rather than a live integration, at least initially." },
              { label: "Sequence", text: "Three reminders at 7, 14 and 21 days, with the final one cc'ing James." },
              { label: "Access", text: "Lucas to add the sending domain to their allow-list before the first run." },
            ],
          },
        ],
      },
    ],
  },
  transcript: dialogue([
    [12, "abdullah", "The main thing I want to get right today is how your invoice data gets in."],
    [28, "james", "That's the awkward part. Our system is about eleven years old and it exports CSV. That's it."],
    [52, "aisha", "There's no API. I've asked."],
    [64, "abdullah", "CSV is completely fine. A lot of people assume it's second-class and it isn't."],
    [84, "abdullah", "You'd export weekly, drop the file in, and we handle the rest."],
    [100, "aisha", "How does it know which ones are already paid?"],
    [114, "abdullah", "The export includes status, so anything marked paid is skipped.", "The risk is stale exports — if you export Monday and someone pays Tuesday, they'd get a reminder."],
    [146, "aisha", "So export the same morning the reminders go out."],
    [160, "abdullah", "Exactly. That's the whole trick."],
    [172, "james", "What does the reminder schedule look like?"],
    [184, "abdullah", "Default is three: seven days, fourteen, twenty-one. The last one can cc someone more senior."],
    [208, "james", "Cc me on the third one. That tends to move things."],
    [222, "lucas", "I'll need the sending domain to add to our allow-list, otherwise it'll all land in spam."],
    [242, "abdullah", "I'll send that straight after this."],
    [254, "aisha", "Can I try it on a few invoices first? I don't want to point it at four hundred on day one."],
    [274, "abdullah", "I'd actively recommend that. Pick ten that are already overdue and see how it reads."],
    [294, "james", "Let's do ten this week and review on Friday."],
  ]),
  actionItems: [
    { id: "mo-1", text: "Send sending-domain details to Lucas for allow-listing", ownerId: "abdullah", tSec: 242, done: true },
    { id: "mo-2", text: "Run a 10-invoice test batch this week", ownerId: "aisha", tSec: 274, done: true },
    { id: "mo-3", text: "Configure 3-step sequence with James cc'd on the final reminder", ownerId: "abdullah", tSec: 208, done: false },
    { id: "mo-4", text: "Review test-batch results on Friday", ownerId: "james", tSec: 294, done: false },
  ],
  highlights: [
    { id: "mo-h1", kind: "highlight", tSec: 114, endSec: 160, note: "Stale export risk and the fix: export the same morning reminders go out", createdBy: "abdullah" },
    { id: "mo-h2", kind: "bookmark", tSec: 222, note: "Allow-list requirement — blocker if missed before first run", createdBy: "abdullah" },
  ],
};
