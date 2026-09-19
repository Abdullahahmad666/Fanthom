"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FathomWordmark } from "@/components/brand/FathomMark";

const NAV = [
  { label: "Overview", caret: false },
  { label: "Solutions", caret: true },
  { label: "Integrations", caret: true },
  { label: "Resources", caret: true },
  { label: "Pricing", caret: false },
];

/**
 * Marketing header. Sticky, and it changes state on scroll -- which is why the
 * two captures disagree: over the hero the Sign up CTA is an outlined pill,
 * and once the page has scrolled the bar goes solid black and the CTA becomes
 * the filled pale-blue pill.
 */
export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);

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
          <FathomWordmark />
        </Link>

        <nav className="mx-auto hidden items-center gap-9 rounded-full px-9 py-3.5 ring-1 ring-white/25 xl:flex">
          {NAV.map(({ label, caret }) => (
            <span
              key={label}
              className="flex cursor-pointer items-center gap-1.5 text-[16px] whitespace-nowrap text-fg transition-colors hover:text-fg-muted"
            >
              {label}
              {caret && <ChevronDown className="h-4 w-4" strokeWidth={2.2} />}
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-7 xl:ml-0">
          <span className="hidden cursor-pointer text-[16px] whitespace-nowrap text-fg sm:block">
            Book a Demo
          </span>
          <Link
            href="/calls"
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
    </header>
  );
}
