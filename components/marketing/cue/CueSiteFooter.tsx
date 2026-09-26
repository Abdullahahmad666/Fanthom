import Link from "next/link";
import { CueWordmark } from "@/components/brand/CueMark";

/**
 * The footer.
 *
 * Only links that earn their place. Sign in and Create an account are not here
 * -- both sit in the header on every page, and a footer that repeats the
 * header is padding pretending to be a sitemap.
 *
 * What is left is what a footer is actually for: the parts of the page someone
 * scrolled past and wants to get back to, the product they are heading into,
 * and the legal pages that have nowhere else to live.
 */
const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#sources", label: "Sources" },
      { href: "/#faq", label: "FAQ" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  /* These need a session. The heading says so, rather than leaving someone to
     discover it by being bounced to the login screen. */
  {
    heading: "In the app",
    links: [
      { href: "/calls", label: "My calls" },
      { href: "/import", label: "Import a transcript" },
      { href: "/playlists", label: "Playlists" },
      { href: "/settings", label: "Settings" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function CueSiteFooter() {
  return (
    <footer className="border-t border-line px-6 py-14 sm:px-10">
      <div className="mx-auto grid max-w-[1240px] gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <CueWordmark size={19} />
          <p className="measure mt-4 text-[14px] leading-relaxed text-muted">
            Cue does not write your summary. It finds it, and shows you where it
            came from.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="section-label">{col.heading}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="tap-row text-[14px] text-muted transition-colors hover:text-text"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6 text-[13px] text-faint">
        <span>© {new Date().getFullYear()} Cue</span>
        <span aria-hidden>·</span>
        <span>A demonstration of transcript-first meeting notes.</span>
      </div>
    </footer>
  );
}
