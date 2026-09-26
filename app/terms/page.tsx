import { LegalPage } from "@/components/marketing/cue/LegalPage";

export const metadata = {
  title: "Terms",
  description:
    "The terms of using Cue during early access: free, offered as-is, and with no warranty.",
  alternates: { canonical: "/terms" },
};

/**
 * Terms of service.
 *
 * Short, because the honest version is short. A free product in early access
 * cannot offer an SLA, a DPA or a refund, and writing clauses that pretend
 * otherwise would be the same mistake as the fabricated G2 rating that used to
 * be on the landing page.
 */
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated="2026-09-26"
      lede={
        <>
          Cue is in early access. It is offered free and as-is, without a
          service guarantee, so please keep your own copy of anything you cannot
          afford to lose.
        </>
      }
    >
      <h2>What this is</h2>
      <p>
        Cue turns meeting transcripts into notes with timestamps. During early
        access it is free and offered <strong>as-is</strong>. Nothing is billed,
        and the prices on the pricing page describe how it will be priced when
        paid plans arrive.
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
        The service is provided without warranty of any kind. During early
        access it may be unavailable, may lose data, and may change without
        notice. Cue
        extracts sentences from your transcript rather than generating text, so
        it cannot invent a quote — but a transcript can be wrong, a speaker can
        be misattributed by the tool that produced it, and extraction can miss
        things. Treat the notes as a pointer to the recording, which is exactly
        what the timestamps are for.
      </p>

      <h2>Ending it</h2>
      <p>
        You can delete your data at any time from{" "}
        <strong>Settings → Your data</strong>. Export is coming soon, so take a
        copy of anything you want to keep before you delete it.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may change. The date at the top says when they last did.
      </p>
    </LegalPage>
  );
}
