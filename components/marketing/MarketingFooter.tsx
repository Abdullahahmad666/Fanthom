import Link from "next/link";
import { FathomWordmark } from "@/components/brand/FathomMark";
import { ClosingCta } from "./ClosingCta";

const COLUMNS: { heading: string; links: string[] }[][] = [
  [
    { heading: "Product", links: ["Overview", "Pricing", "What's New"] },
    { heading: "Company", links: ["About Us", "Careers"] },
  ],
  [
    {
      heading: "Solutions",
      links: ["For Sales", "For Marketing", "For Customer Success", "For Teams"],
    },
  ],
  [
    {
      heading: "Integrations",
      links: [
        "Asana", "ChatGPT", "Claude", "HubSpot", "Salesforce", "Zapier",
        "Public API & MCP", "All Integrations",
      ],
    },
  ],
  [
    {
      heading: "Competitors",
      links: [
        "Competitor Overview", "Fathom vs. Fireflies", "Fathom vs. Granola",
        "Fathom vs. Gong", "Fathom vs. Otter", "Fathom vs. Read AI",
        "Fathom vs. ZoomMate", "Fathom vs. Google Meet's Gemini",
        "Fathom vs. Built-In Solutions",
      ],
    },
  ],
  [
    { heading: "Resources", links: ["Resource Hub", "Help Center", "Partner Program"] },
  ],
];

const LEGAL = ["Terms of Service", "Privacy Policy", "Security & Compliance", "Status"];

export function MarketingFooter() {
  return (
    <>
      <ClosingCta />
      <footer className="bg-[#191919] px-10 pt-14 pb-10">
        <div className="mx-auto max-w-[1560px]">
          <FathomWordmark />

          <div className="mt-14 flex flex-wrap gap-x-12 gap-y-12">
            {COLUMNS.map((stack, i) => (
              <div key={i} className="min-w-[150px] space-y-12">
                {stack.map(({ heading, links }) => (
                  <div key={heading}>
                    <p className="mb-6 text-[17px] text-[#8c8c8c]">{heading}</p>
                    <ul className="space-y-4">
                      {links.map((l) => (
                        <li key={l}>
                          <span className="cursor-pointer text-[17px] text-fg transition-colors hover:text-[#73bfff]">
                            {l}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}

            <div className="ml-auto">
              <Link
                href="/signup"
                className="inline-flex rounded-full bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] px-9 py-4 text-[16px] font-bold tracking-wide text-black uppercase transition-opacity hover:opacity-90"
              >
                Try Fathom today
              </Link>
            </div>
          </div>

          <div className="mt-24 flex flex-wrap items-center gap-x-8 gap-y-3">
            {LEGAL.map((l) => (
              <span
                key={l}
                className="cursor-pointer text-[16px] text-fg transition-colors hover:text-[#73bfff]"
              >
                {l}
              </span>
            ))}
            <p className="ml-auto text-[16px] text-fg">
              Fathom © All Rights Reserved 2026
            </p>
          </div>

          <p className="mt-6 text-[14px] text-fg-dim">
            Frontend prototype built for an assignment. Not affiliated with Fathom.{" "}
            <Link href="/calls" className="text-[#73bfff] hover:underline">
              Skip to the app →
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
