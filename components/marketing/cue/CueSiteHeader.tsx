"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { CueWordmark } from "@/components/brand/CueMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAccount, type Account } from "@/lib/account";

/**
 * The marketing header.
 *
 * It carries the page's own sections plus pricing. The version before this had
 * a single link, because everything else pointed into the app and the app is
 * behind sign-in -- so those items only ever produced a login redirect. The
 * answer was not to delete the nav but to point it at the parts of the page
 * that do exist, which is also what a reader of a long landing page wants: a
 * way back to the section they half-remember.
 *
 * It reflects who is signed in, and it knows before the first paint.
 *
 * Reading that in the browser takes a round trip, and for the length of it the
 * bar said "Sign in" to people who were already signed in. Clicking during that
 * window went to /login, which correctly bounced them into the app -- so the
 * bug looked like auth routing and was really this bar being a second behind.
 * The page passes down what the server already knew, so the first render is
 * right and there is no window to click through.
 */

const SECTIONS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#sources", label: "Sources" },
  { href: "/#faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
];

export function CueSiteHeader({ initialAccount }: { initialAccount?: Account }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const account = useAccount(initialAccount);

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
      {/* Reading progress, tied to scroll position rather than to a timer. */}
      <span
        aria-hidden
        className="scroll-progress absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
      />

      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-8 px-6 sm:px-10">
        <Link href="/" aria-label="Cue home" className="shrink-0">
          <CueWordmark size={19} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {SECTIONS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="tap-row text-[14px] text-muted transition-colors hover:text-text"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:block">
            <ThemeToggle compact />
          </span>

          {account ? (
            <Link
              href="/calls"
              className="press inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap text-on-accent transition-colors hover:bg-accent-hover sm:px-4"
            >
              <span className="hidden sm:inline">Go to my meetings</span>
              <span className="sm:hidden">My meetings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="tap-row hidden text-[14px] text-muted transition-colors hover:text-text sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="press rounded-lg bg-accent px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap text-on-accent transition-colors hover:bg-accent-hover sm:px-4"
              >
                Get started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="press -mr-2 rounded-lg p-2 text-muted transition-colors hover:text-text md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="site-menu"
          aria-label="Sections"
          className="border-t border-line bg-bg px-6 pb-4 md:hidden"
        >
          {SECTIONS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[46px] items-center border-b border-line text-[15px] text-muted last:border-0"
            >
              {l.label}
            </Link>
          ))}
          {!account && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex min-h-[46px] items-center border-b border-line text-[15px] text-muted sm:hidden"
            >
              Sign in
            </Link>
          )}
          <div className="flex min-h-[52px] items-center gap-3 sm:hidden">
            <span className="text-[15px] text-muted">Theme</span>
            <ThemeToggle compact />
          </div>
        </nav>
      )}
    </header>
  );
}
