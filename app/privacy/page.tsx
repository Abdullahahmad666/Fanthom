import { LegalPage } from "@/components/marketing/cue/LegalPage";

export const metadata = {
  title: "Privacy",
  description:
    "What Cue stores, where it goes, and what it never collects. Cue reads a transcript you upload and nothing else.",
  alternates: { canonical: "/privacy" },
};

/**
 * The privacy policy.
 *
 * Written from what the code actually does rather than from a template. Every
 * claim here is checkable against the repository: the tables named exist in
 * backend/supabase/migrations, the RLS policies are in 0001_init.sql, and the
 * "no analytics" line is true because there is no analytics package in
 * package.json.
 *
 * A generated policy listing cookie categories and ad partners this build has
 * never had would be the least honest page on a site whose entire argument is
 * that its claims can be checked.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      updated="2026-09-26"
      lede={
        <>
          Cue is a portfolio build, not a company. There is no analytics, no
          advertising, no tracking pixel and nobody to sell anything to. This
          page describes what the code actually does — you can check every line
          of it against the repository.
        </>
      }
    >
      <h2>What Cue stores</h2>
      <p>Only what you give it, and only while you have an account:</p>
      <ul>
        <li>
          <strong>Your email address</strong>, because that is how you sign in.
        </li>
        <li>
          <strong>Your name</strong>, if you enter one — it is shown on your
          meetings.
        </li>
        <li>
          <strong>Which conferencing tool you use</strong>, so the import screen
          can show the right export instructions.
        </li>
        <li>
          <strong>The transcripts you import</strong>: the text itself, the
          speakers and timings parsed out of it, and the notes Cue extracted.
        </li>
        <li>
          <strong>Playlists and highlights</strong> you create.
        </li>
      </ul>

      <h2>What Cue never collects</h2>
      <ul>
        <li>
          <strong>Audio or video.</strong> Cue has no recorder and never joins a
          call. It only reads a text file you hand it.
        </li>
        <li>
          <strong>Your calendar.</strong> Cue does not connect to one.
        </li>
        <li>
          <strong>Analytics or behavioural tracking.</strong> There is no
          analytics library in this application, so there is nothing measuring
          what you click.
        </li>
        <li>
          <strong>Payment details.</strong> Nothing is billed, so nothing is
          collected.
        </li>
      </ul>

      <h2>Where it goes</h2>
      <p>
        Your data sits in a Postgres database hosted by Supabase. Every table is
        protected by row level security, which means the database itself — not
        just the application in front of it — refuses to return another
        account&apos;s rows. Your session never holds a key that can bypass that.
      </p>
      <p>
        When you import a transcript, the file is parsed <strong>in your
        browser</strong> first and shown to you before anything is sent. If you
        discard the preview, nothing was ever stored.
      </p>

      <h2>Cookies</h2>
      <p>
        One kind: the session cookie Supabase uses to keep you signed in. There
        are no advertising or analytics cookies, so there is no consent banner —
        a banner asking permission for tracking that does not exist would be
        theatre.
      </p>
      <p>
        Your theme choice is kept in your browser&apos;s local storage. It never
        leaves the device and is not readable by us.
      </p>

      <h2>Deleting your data</h2>
      <p>
        <strong>Settings → Your data → Delete my data</strong> permanently
        removes every meeting, transcript, extracted note and playlist on your
        account, and signs you out. It cannot be undone.
      </p>
      <p>
        Your login record itself remains, because removing it requires a
        server-side administrative key that this build deliberately does not
        hold. That is a real limitation and it is stated on the confirmation
        screen rather than buried here.
      </p>

      <h2>Third parties</h2>
      <p>
        Supabase hosts the database and handles authentication. Vercel serves
        the application. Google Fonts serves two typefaces. If you sign in with
        Google, Google handles that exchange. That is the complete list —
        nothing else receives your data.
      </p>

      <h2>Contact</h2>
      <p>
        This is a portfolio project, so there is no privacy team. Questions
        belong with whoever sent you the link to this build.
      </p>
    </LegalPage>
  );
}
