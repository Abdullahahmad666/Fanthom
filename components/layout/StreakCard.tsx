"use client";

import { useState } from "react";
import { Star, Volume2, VolumeX } from "lucide-react";

/**
 * The points card behind the top bar's star counter.
 *
 * Amber on amber: the whole panel takes the counter's colour, so it reads as
 * the counter opening up rather than a menu appearing near it. A caret on the
 * top-right edge keeps it tied to the star it came from.
 */

export const STREAK_POINTS = 25;

export function StreakCard() {
  /* The product chimes when a point lands. There is no chime here, so this
     only remembers the preference -- but a dead speaker icon reads worse than
     one that responds. */
  const [muted, setMuted] = useState(false);

  return (
    <div className="relative w-[340px] px-6 pt-6 pb-7 text-black">
      {/* Caret, tying the card back to the star */}
      <span className="absolute -top-[9px] right-6 h-0 w-0 border-r-[10px] border-b-[10px] border-l-[10px] border-r-transparent border-b-[#F0C62E] border-l-transparent" />

      <button
        type="button"
        onClick={() => setMuted((v) => !v)}
        aria-label={muted ? "Unmute points sound" : "Mute points sound"}
        aria-pressed={muted}
        className="absolute top-4 right-5 text-black/45 transition-colors hover:text-black/70"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-black">
        <Star className="h-7 w-7 fill-[#F0C62E] text-[#F0C62E]" />
      </span>

      <p className="mt-4 text-center text-[22px] font-bold">You have {STREAK_POINTS} points</p>
      <p className="mt-0.5 text-center text-[15px]">Points are how you earn clout &amp; prizes</p>

      <p className="mt-6 text-center text-[15px] leading-snug text-black/45">
        By earning {STREAK_POINTS} points this month you have that many chances to win this
        month&apos;s $1,000 Amazon Gift Card raffle*.
      </p>

      <p className="mt-6 text-center text-[13px] leading-snug text-black/45">
        No purchase necessary. Void where prohibited. Ends 07/31/2026. Full terms are not part of this build.
        .
      </p>
    </div>
  );
}
