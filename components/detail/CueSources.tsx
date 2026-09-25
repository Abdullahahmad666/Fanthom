"use client";

import { useState } from "react";
import { CornerDownRight } from "lucide-react";
import { useMeeting } from "./MeetingProvider";
import { Cue } from "@/components/ui/Cue";
import { excerptAt } from "@/lib/cues";
import { formatClock } from "@/lib/types";

/**
 * The sources under a generated line.
 *
 * This is the feature the product is named for. A summary that asserts
 * something is asking to be believed; one that shows you the second it came
 * from is asking to be checked, and checking has to be cheaper than doubting
 * or nobody does it. So hovering reads the quote in place, and clicking moves
 * the playhead without leaving the page -- you stay in the summary, because
 * the summary is what you were reading.
 *
 * Opening the transcript is the deliberate second step, for when you want the
 * conversation around the line rather than the line itself.
 */
export function CueSources({ cues }: { cues: number[] }) {
  const { meeting, currentTime, jumpTo, setTab } = useMeeting();
  const [open, setOpen] = useState<number | null>(null);

  if (cues.length === 0) return null;

  const inside = (t: number) => currentTime >= t - 1 && currentTime <= t + 25;

  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
      {cues.slice(0, 3).map((t) => {
        const excerpt = excerptAt(meeting, t);

        return (
          <span
            key={t}
            className="relative inline-flex"
            onMouseEnter={() => setOpen(t)}
            onMouseLeave={() => setOpen(null)}
          >
            <Cue
              tSec={t}
              label={formatClock(t)}
              active={inside(t)}
              onPlay={() => jumpTo(t)}
            />

            {open === t && excerpt && (
              /* Above the chip: these sit at the end of a line of text, and a
                 panel below would cover the next line you are reading. */
              <span className="absolute bottom-full left-0 z-30 mb-2 w-[340px] max-w-[70vw] rounded-lg border border-line bg-overlay p-3 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)]">
                <span className="block text-[11px] font-semibold tracking-wide text-faint uppercase">
                  {excerpt.speaker} · {formatClock(excerpt.tSec)}
                </span>

                {excerpt.before && (
                  <span className="mt-1.5 block text-[12px] leading-snug text-faint">
                    …{excerpt.before}
                  </span>
                )}

                <span className="mt-1 block text-[13px] leading-relaxed text-text">
                  {excerpt.text}
                </span>

                {excerpt.after && (
                  <span className="mt-1 block text-[12px] leading-snug text-faint">
                    {excerpt.after}…
                  </span>
                )}

                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    jumpTo(t);
                    setTab("transcript");
                  }}
                  className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-accent hover:underline"
                >
                  <CornerDownRight className="h-3 w-3" />
                  Open in transcript
                </button>
              </span>
            )}
          </span>
        );
      })}

      {cues.length > 3 && (
        <span className="text-[11px] text-faint">+{cues.length - 3} more</span>
      )}
    </span>
  );
}
