"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
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
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="mx-auto flex max-w-[1560px] items-center gap-3 px-4 py-4 sm:gap-6 sm:px-6 xl:px-10 xl:py-5">
        <Link href="/" aria-label="Fathom" className="shrink-0">
          <span className="hidden sm:block">
            <FathomWordmark size={26} />
          </span>
          <span className="sm:hidden">
            <FathomWordmark size={19} />
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-9 rounded-full px-9 py-3.5 ring-1 ring-white/25 xl:flex">
          {NAV.map(({ label, menu }) =>
            menu ? (
              <NavMenu key={label} label={label} items={menu} />
            ) : label === "Pricing" ? (
              <Link
                key={label}
                href="/pricing"
                className={`text-[16px] whitespace-nowrap transition-colors hover:text-[#73bfff] ${
                  pathname === "/pricing" ? "text-[#73bfff]" : "text-fg"
                }`}
              >
                {label}
              </Link>
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

        <div className="ml-auto flex items-center gap-4 sm:gap-7 xl:ml-0">
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="hidden py-2 text-[16px] whitespace-nowrap text-fg transition-colors hover:text-[#73bfff] lg:block"
          >
            Book a Demo
          </button>
          <Link
            href="/login"
            className="hidden py-2 text-[14px] whitespace-nowrap text-fg transition-colors hover:text-[#73bfff] sm:block sm:text-[16px]"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className={`rounded-full px-4 py-2.5 text-[12px] font-bold tracking-wide whitespace-nowrap uppercase transition-colors sm:px-7 sm:py-3 sm:text-[15px] ${
              scrolled
                ? "bg-gradient-to-r from-[#a9d5ff] to-[#73bfff] text-black hover:opacity-90"
                : "border border-[#73bfff] text-fg hover:bg-[#73bfff]/10"
            }`}
          >
            Sign up free
          </Link>

          {/* Below xl the nav pill is gone, so this is the only way to reach
              it. Without it the marketing site has no navigation on a phone. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            /* No negative margin: at 360px the row is already full and it
               pushed the button past the container padding. */
            className="p-2 text-fg xl:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-5 pt-2 pb-6 xl:hidden">
          {NAV.map(({ label, menu }) => (
            <div key={label} className="border-b border-white/8 py-3">
              <p className="text-[17px] font-semibold text-fg">
                {label === "Pricing" ? (
                  <Link href="/pricing" onClick={() => setMenuOpen(false)}>
                    Pricing
                  </Link>
                ) : (
                  label
                )}
              </p>
              {menu && (
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                  {menu.map((item) => (
                    <span key={item} className="text-[15px] text-fg-muted">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setDemoOpen(true);
              }}
              className="py-1 text-[17px] font-semibold text-[#73bfff]"
            >
              Book a Demo
            </button>
            {/* Only route to sign-in below sm, where the inline link is gone. */}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="py-1 text-[17px] font-semibold text-fg sm:hidden"
            >
              Log In
            </Link>
          </div>
        </div>
      )}

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
