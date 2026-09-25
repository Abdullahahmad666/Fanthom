import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { THEME_SCRIPT } from "@/components/ui/ThemeToggle";
import { SITE_URL } from "@/lib/siteUrl";

/*
 * Two faces, with a job each.
 *
 * Inter carries everything functional -- it disappears, which is what you
 * want from a transcript you are reading for ten minutes. Instrument Serif
 * carries titles and the wordmark, because a meeting record is a document,
 * not a dashboard, and a serif says so before a single word is read. The
 * reference uses one grotesque throughout and reads as analytics; this is a
 * deliberate departure.
 */
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const DESCRIPTION =
  "Cue turns a meeting transcript into notes you can check. Every line carries the moment it came from, so you can play the proof instead of trusting the summary.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cue — meeting notes with receipts",
    template: "%s · Cue",
  },
  description: DESCRIPTION,
  applicationName: "Cue",
  openGraph: {
    type: "website",
    siteName: "Cue",
    url: SITE_URL,
    title: "Cue — meeting notes with receipts",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cue — meeting notes with receipts",
    description: DESCRIPTION,
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before the first paint so the document already carries the
          right theme. Applying it in an effect instead shows one frame of the
          wrong theme, which is the flash every dark-mode implementation gets
          judged on.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      {/*
        Browser extensions inject attributes onto <body> before React hydrates
        -- ColorZilla's `cz-shortcut-listen`, Grammarly's `data-gr-*` -- which
        React reports as a mismatch we cannot fix from here.
      */}
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
