"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FathomWordmark } from "@/components/brand/FathomMark";
import { BookDemoModal } from "./BookDemoModal";

const NAV: { label: string; menu?: string[] }[] = [
  { label: "Overview" },
  {
    label: "Solutions",
    menu: ["For customer success", "For marketing", "For sales", "For teams"],
  },
  {
    label: "Integrations",
    menu: [
      "Asana",
      "ChatGPT",
      "Claude",
      "Hubspot",
      "Salesforce",
      "Zapier",
      "Public API & MCP",
      "See All Integrations →",
    ],
  },
  {
    label: "Resources",
    menu: [
      "What's New",
      "Resource Hub",
      "Partner with Fathom",
      "Developer Hub",
      "Help Center",
    ],
  },
  { label: "Pricing" },
];

/**
 * Marketing header. Sticky, and it changes state on scroll -- which is why the
 * two captures disagree: over the hero the Sign up CTA is an outlined pill,
 * and once the page has scrolled the bar goes solid black and the CTA becomes
 * the filled pale-blue pill.
 */
export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1560px] items-center gap-6 px-10 py-5">
        <Link href="/" aria-label="Fathom" className="shrink-0">
          <FathomWordmark size={26} />
        </Link>

        <nav className="mx-auto hidden items-center gap-9 rounded-full px-9 py-3.5 ring-1 ring-white/25 xl:flex">
          {NAV.map(({ label, menu }) =>
            menu ? (
              <NavMenu key={label} label={label} items={menu} />
            ) : (
              <span
                key={label}
                className="cursor-pointer text-[16px] whitespace-nowrap text-fg transition-colors hover:text-[#73bfff]"
              >
                {label}
              </span>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-7 xl:ml-0">
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="hidden text-[16px] whitespace-nowrap text-fg transition-colors hover:text-[#73bfff] sm:block"
          >
            Book a Demo
          </button>
          <Link
            href="/login"
            className="text-[16px] whitespace-nowrap text-fg transition-colors hover:text-[#73bfff]"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className={`rounded-full px-7 py-3 text-[15px] font-bold tracking-wide whitespace-nowrap uppercase transition-colors ${
              scrolled
                ? "bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] text-black hover:opacity-90"
                : "border border-[#73bfff] text-fg hover:bg-[#73bfff]/10"
            }`}
          >
            Sign up free
          </Link>
        </div>
      </div>

      {demoOpen && <BookDemoModal onClose={() => setDemoOpen(false)} />}
    </header>
  );
}

/**
 * One nav item with a dropdown.
 *
 * Opened by hover and by keyboard focus, with no JS state: group-hover and
 * focus-within do both, and the panel stays mounted so the caret can rotate
 * into it. The panel's wrapper carries the gap as padding rather than a
 * margin, so the pointer never crosses dead space on its way down -- a real
 * gap here makes the menu close before you reach it.
 */
function NavMenu({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1.5 text-[16px] whitespace-nowrap text-fg transition-colors group-hover:text-[#73bfff]"
      >
        {label}
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
          strokeWidth={2.2}
        />
      </button>

      <div className="invisible absolute top-full left-0 pt-5 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="min-w-[250px] rounded-2xl bg-[#1c1c1c] py-4 ring-1 ring-white/12 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.9)]">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              className="block w-full px-6 py-2.5 text-left text-[17px] whitespace-nowrap text-fg transition-colors hover:text-[#73bfff]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
