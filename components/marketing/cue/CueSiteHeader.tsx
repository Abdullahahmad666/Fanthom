"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CueWordmark } from "@/components/brand/CueMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * The marketing header.
 *
 * The one it replaces carried five dropdown menus -- Solutions, Integrations,
 * Resources and the rest -- almost all of which opened onto pages that do not
 * exist in this build. A nav that mostly lies about what is behind it is worse
 * than a short one, so this lists only real destinations.
 *
 * It gains a border on scroll rather than swapping to a different colour and a
 * different CTA shape: the bar should separate itself from the content moving
 * under it, not restyle itself.
 */
const LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/import", label: "Import" },
  { href: "/calls", label: "Product" },
];

export function CueSiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-8 px-6 sm:px-10">
        <Link href="/" aria-label="Cue home" className="shrink-0">
          <CueWordmark size={19} />
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[14px] text-muted transition-colors hover:text-text"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle compact />
          <Link
            href="/login"
            className="hidden text-[14px] text-muted transition-colors hover:text-text sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="press rounded-lg bg-accent px-4 py-2 text-[14px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
