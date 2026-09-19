import type { Meeting } from "../types";
import { dialogue } from "./helpers";

/**
 * Eight people, one hour. The brief calls this "the case that actually
 * matters", so it is the fixture everything else is stress-tested against:
 * a long transcript, speaker alternation, a dense action-item list, highlights
 * scattered across the hour, and four summary templates that genuinely differ.
 */
export const launchReadiness: Meeting = {
  id: "q3-launch-readiness",
  title: "Q3 Launch Readiness Review",
  date: "2026-09-19",
  startTime: "10:00 AM",
  meetingCode: "xkp-4mzq-rtv",
  platform: "Zoom",
  durationSec: 3612,
  poster: ["#1d4ed8", "#0b1c3f"],
  participants: [
    { id: "abdullah", name: "Abdullah Ahmad", role: "Founder", company: "One More Email", color: "#c2185b", isOwner: true, email: "abdullahahmad5618@gmail.com" },
    { id: "maya", name: "Maya Chen", role: "VP Product", company: "Northwind", color: "#7c3aed", email: "maya.chen@northwind.io" },
    { id: "tom", name: "Tom Okafor", role: "Engineering Lead", company: "Northwind", color: "#0891b2", email: "tom.okafor@northwind.io" },
    { id: "priya", name: "Priya Raman", role: "Design Lead", company: "Northwind", color: "#db2777", email: "priya.raman@northwind.io" },
    { id: "daniel", name: "Daniel Weiss", role: "Head of Sales", company: "Northwind", color: "#ea580c", email: "daniel.weiss@northwind.io" },
    { id: "sofia", name: "Sofia Marino", role: "Customer Success", company: "Northwind", color: "#16a34a", email: "sofia.marino@northwind.io" },
    { id: "jonas", name: "Jonas Lind", role: "Analytics", company: "Northwind", color: "#ca8a04", email: "jonas.lind@northwind.io" },
    { id: "rachel", name: "Rachel Kim", role: "Marketing", company: "Northwind", color: "#0ea5e9", email: "rachel.kim@northwind.io" },
  ],
  summaries: {
    enhanced: [
      {
        heading: "Meeting Purpose",
        blocks: [
          {
            kind: "para",
            text: "Confirm whether the Q3 release is ready to ship on the 30th, and decide what gets cut if it is not.",
          },
        ],
      },
      {
        heading: "Key Takeaways",
        blocks: [
          {
            kind: "bullets",
            items: [
              { label: "Decision", text: "Ship on September 30th, but with bulk import behind a feature flag for the first two weeks." },
              { label: "Blocker", text: "The migration rehearsal has not run against production-sized data; Tom owns a dry run by Wednesday." },
              { label: "Risk", text: "Support headcount is flat while signups are forecast to triple, which Sofia flagged as the likeliest source of a bad launch week." },
              { label: "Open question", text: "Pricing for the Teams tier is still unresolved and now blocks the launch email." },
            ],
          },
        ],
      },
      {
        heading: "Current Challenges",
        blocks: [
          {
            kind: "bullets",
            items: [
              { text: "Bulk import fails on files above roughly 50,000 rows, and the failure is silent rather than surfaced to the user." },
              { text: "Onboarding drop-off sits at 38% on the third step, which Jonas traced to the workspace-invite screen." },
              { text: "Two enterprise prospects have made SSO a condition of signing, and it is not in the Q3 scope." },
            ],
          },
        ],
      },
      {
        heading: "Next Steps",
        blocks: [
          {
            kind: "bullets",
            items: [
              { text: "Migration dry run against a production-sized dataset before Wednesday standup." },
              { text: "Pricing decision for the Teams tier by Monday, so marketing can finalise the launch email." },
              { text: "Rewrite the invite step of onboarding, then re-measure drop-off after a week." },
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
            text: "The team reviewed readiness for the September 30th release. The date holds, with bulk import shipping behind a flag because it still fails on large files. Migration rehearsal, Teams-tier pricing and onboarding drop-off were the three threads that took most of the hour.",
          },
          {
            kind: "bullets",
            items: [
              { text: "Ship date confirmed for September 30th." },
              { text: "Bulk import flagged off at launch, enabled for everyone two weeks later if error rates hold." },
              { text: "Support staffing raised as the biggest unmitigated risk." },
            ],
          },
        ],
      },
    ],
    standup: [
      {
        heading: "Blockers",
        blocks: [
          {
            kind: "bullets",
            items: [
              { label: "Tom", text: "Migration rehearsal not yet run at production scale." },
              { label: "Maya", text: "Teams-tier pricing undecided, blocking the launch email." },
              { label: "Sofia", text: "No additional support cover approved for launch week." },
            ],
          },
        ],
      },
      {
        heading: "In Progress",
        blocks: [
          {
            kind: "bullets",
            items: [
              { label: "Priya", text: "Rewriting the workspace-invite step of onboarding." },
              { label: "Jonas", text: "Instrumenting the funnel to separate drop-off from bounce." },
              { label: "Rachel", text: "Launch email drafted, waiting on pricing." },
            ],
          },
        ],
      },
    ],
    sales: [
      {
        heading: "Deal Impact",
        blocks: [
          {
            kind: "bullets",
            items: [
              { label: "At risk", text: "Two enterprise prospects have made SSO a condition of signing; it is not in Q3 scope." },
              { label: "Upside", text: "Daniel expects the Teams tier to unlock roughly a third of the current pipeline once priced." },
              { label: "Objection", text: "Bulk import reliability came up in three of the last five demos." },
            ],
          },
        ],
      },
      {
        heading: "Commitments Made",
        blocks: [
          {
            kind: "bullets",
            items: [
              { text: "Daniel to send the SSO timeline question to product in writing by Friday." },
              { text: "Pricing answer promised to sales by Monday." },
            ],
          },
        ],
      },
    ],
  },
  transcript: dialogue([
    [8, "maya", "Alright, we're all here, so let's get into it.", "The only question I actually care about today is whether the thirtieth still holds."],
    [31, "maya", "If it doesn't, I'd rather know now than on the twenty-eighth."],
    [46, "tom", "Short answer, it holds.", "Longer answer, it holds if we're willing to be honest about bulk import."],
    [70, "maya", "Go on."],
    [76, "tom", "Bulk import works fine up to about fifty thousand rows.", "Past that it falls over, and the part I don't like is that it fails quietly."],
    [104, "tom", "The job reports success and the user finds out two days later that half their contacts aren't there."],
    [126, "priya", "That's the bit that worries me more than the failure itself.", "A loud failure is a support ticket, a quiet one is a trust problem."],
    [152, "maya", "Agreed. Can we make it loud by the thirtieth?"],
    [163, "tom", "Making it loud, yes. Making it work at scale, not by the thirtieth."],
    [180, "daniel", "Can I flag something from the sales side while we're here?", "Bulk import has come up in three of the last five demos."],
    [206, "daniel", "It's not a nice-to-have for the mid-market accounts, it's the first thing they try."],
    [228, "maya", "So we can't just turn it off."],
    [236, "tom", "We could ship it behind a flag.", "On for accounts under the row limit, off above it, with a proper message explaining why."],
    [264, "priya", "I can design that message today. It's one screen."],
    [277, "maya", "Let's do that. Flag it off above the limit, revisit in two weeks once we see real error rates."],
    [298, "maya", "Tom, does that clear your blocker?"],
    [307, "tom", "Mostly. The one that's still open is the migration rehearsal."],
    [322, "tom", "We've run it against staging, which is about a tenth of production. That's not a rehearsal, that's a warm-up."],
    [346, "maya", "What do you need to do a real one?"],
    [356, "tom", "A production-sized snapshot and about four hours. I can have it done before Wednesday standup."],
    [377, "maya", "Do that. If it fails we still have a week to react."],
    [392, "jonas", "While we're on risk, I want to put the onboarding numbers in front of everyone."],
    [408, "jonas", "Drop-off on step three is thirty-eight percent. That's not noise, that's a third of everyone who signs up."],
    [432, "rachel", "Thirty-eight? Last time I looked it was closer to twenty."],
    [444, "jonas", "It was. It moved when we added the workspace invite screen."],
    [460, "priya", "That screen asks people to invite colleagues before they've seen anything work."],
    [478, "priya", "We're asking for a favour before we've delivered any value. Of course they leave."],
    [498, "maya", "Can we just move it?"],
    [506, "priya", "We can make it skippable in an afternoon. Moving it properly is a week."],
    [524, "maya", "Make it skippable now, move it properly after launch."],
    [538, "jonas", "I'd also like to separate drop-off from bounce in the instrumentation.", "Right now someone who closes the tab and someone who comes back tomorrow look identical."],
    [568, "maya", "Fine. Jonas, that's yours."],
    [580, "sofia", "I need to raise something and I don't think anyone's going to like it."],
    [594, "sofia", "Signups are forecast to roughly triple in launch week. Support headcount is exactly the same as it was in July."],
    [620, "sofia", "Two of us are on call. That's it."],
    [634, "maya", "What does that look like in practice?"],
    [644, "sofia", "First response time goes from four hours to something like a day and a half.", "And launch week is exactly when people are least patient."],
    [672, "daniel", "That'll show up in churn before it shows up in tickets."],
    [688, "sofia", "It'll show up in reviews first, actually. That's the bit you can't undo."],
    [706, "maya", "This is the thing I'm least comfortable with in the whole review."],
    [720, "maya", "Can we get contractor cover for two weeks?"],
    [732, "sofia", "If I get an answer by Friday, yes. After that there's no time to train anyone."],
    [750, "maya", "I'll take that to finance today."],
    [762, "rachel", "Can I get a decision on Teams pricing?", "The launch email has a hole in it where the price should be."],
    [784, "maya", "Where did we land?"],
    [792, "daniel", "We didn't. It's been open for three weeks."],
    [804, "daniel", "I'll say this plainly, it's about a third of my pipeline waiting on a number."],
    [822, "rachel", "And I can't send the email without it. Everything else is written."],
    [838, "maya", "Then it's a Monday decision. I'll get the three of us in a room."],
    [854, "daniel", "One more from me. SSO."],
    [864, "daniel", "Two enterprise prospects have made it a condition of signing. It's not in Q3 scope."],
    [884, "maya", "It isn't, and it won't be."],
    [894, "daniel", "I'm not asking for it in Q3. I'm asking for a date I can give them."],
    [910, "maya", "That's fair. Put it in writing and send it to me and Tom by Friday, we'll come back with a quarter."],
    [932, "tom", "Rough guess, it's a Q1 thing. It touches the whole auth layer."],
    [950, "priya", "Coming back to launch for a second, what's the plan if the migration rehearsal fails on Wednesday?"],
    [970, "maya", "Then we talk on Wednesday, not on the twenty-ninth."],
    [982, "tom", "I'd rather commit to that than pretend it can't happen."],
    [996, "maya", "Right. Let me read back what I have."],
    [1008, "maya", "Ship the thirtieth. Bulk import behind a flag above the row limit, with Priya's message.", "Migration dry run before Wednesday."],
    [1040, "maya", "Invite step skippable this week, moved properly after launch. Jonas fixes the funnel instrumentation."],
    [1066, "maya", "I take support cover to finance today and answer Sofia by Friday. Pricing decided Monday. Daniel writes up SSO by Friday."],
    [1098, "sofia", "That's what I have too."],
    [1108, "rachel", "Same."],
    [1116, "maya", "Good. Anything anyone is sitting on that hasn't come up?"],
    [1132, "abdullah", "One small thing from my side, mostly an observation."],
    [1144, "abdullah", "Every risk on this list was already known to at least one person in the room two weeks ago."],
    [1162, "abdullah", "The issue isn't that we're surprised, it's that the surfacing is happening here instead of earlier."],
    [1182, "maya", "That's a fair hit and I don't have a good answer for it."],
    [1196, "tom", "Part of it is that nobody wants to be the one raising a risk that turns out to be nothing."],
    [1216, "sofia", "I sat on the support numbers for a week for exactly that reason."],
    [1230, "maya", "Then let's make that cheaper to do. I'd rather hear five non-issues than miss one of these."],
    [1250, "priya", "Could we just have a standing thread for it? Low ceremony."],
    [1264, "maya", "Yes. Rachel, can you set that up?"],
    [1274, "rachel", "Sure."],
    [1282, "maya", "Alright. We're at time. Thanks everyone, Wednesday is the next real checkpoint."],
  ]),
  actionItems: [
    { id: "ai-1", text: "Run the migration rehearsal against a production-sized snapshot before Wednesday standup", ownerId: "tom", tSec: 356, done: false },
    { id: "ai-2", text: "Design the bulk-import row-limit message so the failure is explicit rather than silent", ownerId: "priya", tSec: 264, done: true },
    { id: "ai-3", text: "Take launch-week support cover to finance and give Sofia an answer by Friday", ownerId: "maya", tSec: 750, done: false },
    { id: "ai-4", text: "Decide Teams tier pricing on Monday so the launch email can go out", ownerId: "maya", tSec: 838, done: false },
    { id: "ai-5", text: "Make the workspace invite step skippable this week", ownerId: "priya", tSec: 506, done: false },
    { id: "ai-6", text: "Separate drop-off from bounce in the onboarding funnel instrumentation", ownerId: "jonas", tSec: 538, done: false },
    { id: "ai-7", text: "Write up the SSO timeline question for product by Friday", ownerId: "daniel", tSec: 910, done: false },
    { id: "ai-8", text: "Set up a standing low-ceremony thread for raising risks early", ownerId: "rachel", tSec: 1264, done: false },
  ],
  highlights: [
    { id: "hl-1", kind: "highlight", tSec: 104, endSec: 152, note: "Bulk import fails silently — the trust problem, not the bug", createdBy: "abdullah" },
    { id: "hl-2", kind: "feedback", tSec: 460, endSec: 498, note: "Priya on why the invite screen kills onboarding: asking a favour before delivering value", createdBy: "abdullah" },
    { id: "hl-3", kind: "bookmark", tSec: 594, note: "Support headcount flat while signups triple", createdBy: "sofia" },
    { id: "hl-4", kind: "highlight", tSec: 688, endSec: 720, note: '"It\'ll show up in reviews first — that\'s the bit you can\'t undo"', createdBy: "abdullah" },
    { id: "hl-5", kind: "action", tSec: 1008, note: "Maya's read-back of every decision", createdBy: "abdullah" },
    { id: "hl-6", kind: "feedback", tSec: 1144, endSec: 1196, note: "Every risk was known two weeks ago — surfacing problem, not a knowledge problem", createdBy: "abdullah" },
  ],
};
