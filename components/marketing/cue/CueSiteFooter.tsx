import Link from "next/link";
import { CueWordmark } from "@/components/brand/CueMark";

/**
 * The footer.
 *
 * Four columns of links to pages that do not exist is a sitemap for a company
 * rather than a footer for a product, so this lists what is actually here and
 * says plainly what the build is. The line about the prototype is not an
 * apology -- it is the same commitment the rest of the page makes, applied to
 * the page itself.
 */
const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/calls", label: "My calls" },
      { href: "/import", label: "Import a transcript" },
      { href: "/playlists", label: "Playlists" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create an account" },
      { href: "/settings", label: "Settings" },
    ],
  },
];

export function CueSiteFooter() {
  return (
    <footer className="border-t border-line px-6 py-14 sm:px-10">
      <div className="mx-auto grid max-w-[1240px] gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
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
                    className="text-[14px] text-muted transition-colors hover:text-text"
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
        <span>
          A portfolio build. The database and API are real; there is no company
          behind it.
        </span>
      </div>
    </footer>
  );
}
