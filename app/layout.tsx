import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";

/* The product uses a licensed neo-grotesque; Inter is the closest free match.
   See docs/UI-SPEC.md 1.3. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESCRIPTION =
  "Fathom summarizes your meetings so you can focus on the conversation. Recordings, transcripts, AI summaries, action items and highlights from every call.";

export const metadata: Metadata = {
  /* Resolves the relative OG and icon URLs Next generates. Without it those
     come out relative and most scrapers ignore them. */
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fathom — AI notetaking that is out of this world",
    /* Pages set a short title; this frames it. */
    template: "%s · Fathom",
  },
  description: DESCRIPTION,
  applicationName: "Fathom",
  openGraph: {
    type: "website",
    siteName: "Fathom",
    url: SITE_URL,
    title: "Fathom — AI notetaking that is out of this world",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Fathom — AI notetaking that is out of this world",
    description: DESCRIPTION,
  },
  /* A prototype rebuild should not be competing with the real product in
     search results. */
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      {/*
        Browser extensions inject attributes onto <body> before React hydrates
        -- ColorZilla's `cz-shortcut-listen`, Grammarly's `data-gr-*` and others
        -- which React reports as a hydration mismatch we cannot fix from here.

        suppressHydrationWarning applies to this element's own attributes only,
        not to its descendants, so genuine mismatches inside the app are still
        reported.
      */}
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
