import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* The product uses a licensed neo-grotesque; Inter is the closest free match.
   See docs/UI-SPEC.md 1.3. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fathom",
  description: "AI notetaker — frontend prototype",
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
      </body>
    </html>
  );
}
