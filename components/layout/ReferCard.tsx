"use client";

import { useState, useSyncExternalStore } from "react";
import { Gift } from "lucide-react";

/**
 * The referral card that drops out of the top bar's Refer button.
 *
 * Information rather than a menu, which is why it opens on hover: the product
 * surfaces it without asking for a click.
 */

const REF_CODE = "8_xrKQ";
const PATH = `/signup?ref=${REF_CODE}`;
const PITCH = "I use Cue to take notes in all my meetings — worth a look:";

/**
 * The invite points at this deployment, not at an invented domain.
 *
 * A referral card whose link 404s is worse than no referral card, and the
 * whole control is about handing someone a URL that works. Resolved on the
 * client because the origin differs between local, preview and production.
 */
function inviteUrl() {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}${PATH}`;
}

/* The origin is external state that never changes within a session, so there
   is nothing to subscribe to -- but reading it through the external-store hook
   is what lets the server render the relative path and the client swap in the
   absolute one without an effect writing state after mount. */
const noSubscribe = () => () => {};
const serverUrl = () => PATH;

export function ReferCard() {
  const [copied, setCopied] = useState(false);
  const url = useSyncExternalStore(noSubscribe, inviteUrl, serverUrl);

  const copy = () => {
    navigator.clipboard?.writeText(inviteUrl()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = {
    tweet: `https://twitter.com/intent/tweet?text=${encodeURIComponent(PITCH)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  return (
    <div className="w-[360px] px-5 py-5">
      <p className="flex items-center justify-center gap-2 text-[19px] font-bold tracking-[0.04em] text-brand uppercase">
        <Gift className="h-5 w-5" strokeWidth={2} />
        Referral code
      </p>

      <p className="mt-3 text-center text-[15px] leading-snug text-fg-muted">
        Give and get a month of Premium for free when people sign up with your link.
      </p>

      <div className="mt-4 flex items-center overflow-hidden rounded-lg bg-content">
        <span className="min-w-0 flex-1 truncate px-3 py-2.5 text-[13px] text-fg-muted">
          {url}
        </span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 self-stretch bg-[#7fc4f5] px-5 text-[15px] font-semibold text-[#0b1418] transition-opacity hover:opacity-90"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <ShareButton href={share.tweet} label="Tweet">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1d9bf0]" aria-hidden>
            <path d="M23 4.9a9 9 0 0 1-2.6.7 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1A4.5 4.5 0 0 0 11.7 8 12.8 12.8 0 0 1 2.4 3.3a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6 4.5 4.5 0 0 0 3.6 4.5 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.3a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6A9.2 9.2 0 0 0 23 4.9Z" />
          </svg>
        </ShareButton>

        <ShareButton href={share.linkedin} label="LinkedIn">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <rect width="24" height="24" rx="3" fill="#0a66c2" />
            <path
              fill="#fff"
              d="M7 9.5h2.4V18H7zM8.2 5.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM11.3 9.5h2.3v1.2a2.6 2.6 0 0 1 2.3-1.3c2 0 2.6 1.3 2.6 3.3V18h-2.4v-4.6c0-1.1-.4-1.8-1.3-1.8s-1.5.7-1.5 1.8V18h-2z"
            />
          </svg>
        </ShareButton>
      </div>

      <div className="mt-4 flex items-start gap-3 text-[14px] leading-snug text-amber">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-amber text-[13px] font-bold">
          $
        </span>
        <p>
          Agencies &amp; consultants: the{" "}
          <span className="font-semibold">Cue Growth Partner Program</span> is not
          part of this build.
        </p>
      </div>
    </div>
  );
}

function ShareButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 rounded-lg border border-white/15 py-2.5 text-[15px] font-semibold text-brand transition-colors hover:bg-white/5"
    >
      {label}
      {children}
    </a>
  );
}
