import type { Meeting } from "../types";
import { turns } from "./helpers";

/**
 * The real recording captured during research, reproduced from the screenshots
 * verbatim -- same title, meeting code, start time, transcript and summary,
 * and the same "None detected" action-items state.
 *
 * It earns its place by being the honest case: a short solo call where the AI
 * finds no action items. A seed set of only rich meetings would be a lie.
 */
export const impromptu: Meeting = {
  id: "impromptu-google-meet",
  title: "Impromptu Google Meet Meeting",
  date: "2026-09-19",
  startTime: "5:43 AM",
  meetingCode: "dkx-jgwp-yrx",
  platform: "Google Meet",
  durationSec: 183,
  poster: ["#8e1141", "#3d0a1e"],
  participants: [
    {
      id: "abdullah",
      name: "Abdullah",
      role: "Founder",
      company: "One More Email",
      color: "#c2185b",
      isOwner: true,
      email: "abdullahahmad5618@gmail.com",
    },
  ],
  summaries: {
    enhanced: [
      {
        heading: "Meeting Purpose",
        blocks: [
          {
            kind: "para",
            text: 'Define the "One More Email" product and its upcoming release.',
          },
        ],
      },
      {
        heading: "Key Takeaways",
        blocks: [
          {
            kind: "bullets",
            items: [
              {
                label: "Product",
                text: '"One More Email," an AI tool that automates invoice follow-ups to eliminate manual client chasing.',
              },
              {
                label: "Core Function",
                text: "Users input a client's email and an invoice; the system then sends an escalating sequence of automated reminders.",
              },
              {
                label: "Goal",
                text: "Ship a prototype or MVP by next Friday to mark the first major step toward the product's full launch.",
              },
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
            text: "A short solo walkthrough of the One More Email concept: what it does, how the follow-up sequence works, and the intent to have a prototype ready by next Friday.",
          },
        ],
      },
    ],
  },
  transcript: turns("abdullah", [
    [
      4,
      "Hi, this is me, Abdullah Ahmad. I am here to talk about some meeting notes that we will see how it is going and we have to actually deliver some prototype or MVP for our latest product that is a sophisticated and simple email and whatever it is called like one more email that is more sophisticated.",
    ],
    [
      38,
      "About my product like you don't have to chase the clients whatsoever. You just drop in the invoice and the email of the client for which you want to receive your invoice and then it will automatically.",
    ],
    [
      62,
      "build a ladder that gets forms and more attentionable with each automatically so you will see the latest product also you are waiting for it and you will see that the latest world you don't have to chase the clients you just do your work and leave the rest to the",
    ],
    [
      108,
      "One more email product and it will automatically chase the clients on your behalf so you don't have to, you just see how it basically the client is not forgets about the invoice or you simply don't chase him enough so that he will make you can turn it into a lead or a successful client.",
    ],
    [
      152,
      "So the both features can be implemented through our product as well.",
      "So we will see around this type of product and hope so you will enjoy it.",
    ],
    [176, "Thank you."],
  ]),
  actionItems: [],
  highlights: [],
};
