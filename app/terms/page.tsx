import { LegalPage } from "@/components/marketing/cue/LegalPage";

export const metadata = {
  title: "Terms",
  description:
    "The terms of using Cue: a portfolio build with a real database, offered as-is and with no warranty.",
  alternates: { canonical: "/terms" },
};

/**
 * Terms of service.
 *
 * Short, because the honest version is short. A portfolio build with no
 * company behind it cannot offer an SLA, a DPA or a refund, and writing
 * clauses that pretend otherwise would be the same mistake as the fabricated
 * G2 rating that used to be on the landing page.
 */
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated="2026-09-26"
      lede={
        <>
          Cue is a portfolio build. The database and API behind it are real, but
          there is no company, no support desk and no guarantee it will be here
          next month. Please do not put anything you cannot afford to lose in it.
        </>
      }
    >
      <h2>What this is</h2>
      <p>
        Cue is a demonstration project that turns meeting transcripts into notes
        with timestamps. It is offered free and <strong>as-is</strong>. There is
        no paid plan, nothing is billed, and the prices shown on the pricing page
        describe how it would be priced rather than what anyone is charged.
      </p>

      <h2>Your account and your content</h2>
      <p>
        You keep ownership of every transcript you import and everything Cue
        extracts from it. Uploading a transcript grants no rights over it beyond
        storing it so the application can show it back to you.
      </p>
      <p>
        You are responsible for having the right to upload what you upload.
        Meeting recordings and transcripts frequently involve other people, and
        consent to record is your responsibility, not Cue&apos;s.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not upload content you have no right to share.</li>
        <li>Do not attempt to reach another account&apos;s data.</li>
        <li>Do not use this build to store regulated or highly sensitive material.</li>
      </ul>

      <h2>No warranty</h2>
      <p>
        The service is provided without warranty of any kind. It may be
        unavailable, may lose data, and may be taken down without notice. Cue
        extracts sentences from your transcript rather than generating text, so
        it cannot invent a quote — but a transcript can be wrong, a speaker can
        be misattributed by the tool that produced it, and extraction can miss
        things. Treat the notes as a pointer to the recording, which is exactly
        what the timestamps are for.
      </p>

      <h2>Ending it</h2>
      <p>
        You can delete your data at any time from{" "}
        <strong>Settings → Your data</strong>. The project may be shut down at
        any time, in which case the database goes with it.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may change. The date at the top says when they last did.
      </p>
    </LegalPage>
  );
}
