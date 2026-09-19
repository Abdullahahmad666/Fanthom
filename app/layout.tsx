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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
