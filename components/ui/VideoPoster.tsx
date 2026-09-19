import { Avatar } from "./Avatar";
import type { Participant } from "@/lib/types";

/** Deterministic per-person room tint, so a tile does not look like flat colour. */
function room(color: string, i: number) {
  const warm = i % 2 === 0;
  return warm
    ? `radial-gradient(120% 90% at 30% 15%, ${color}4d 0%, #14121a 62%, #08070b 100%)`
    : `radial-gradient(120% 90% at 70% 20%, ${color}40 0%, #101319 60%, #07080b 100%)`;
}

/** A head-and-shoulders silhouette, the shape a webcam tile always resolves to. */
function Figure({ color }: { color: string }) {
  return (
    <span aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Desk / horizon line */}
      <span className="absolute inset-x-0 bottom-0 h-[26%] bg-black/35" />
      {/* Shoulders */}
      <span
        className="absolute -bottom-[14%] left-1/2 h-[46%] w-[58%] -translate-x-1/2 rounded-t-[999px]"
        style={{ background: `${color}59` }}
      />
      {/* Head */}
      <span
        className="absolute bottom-[30%] left-1/2 h-[26%] w-[26%] -translate-x-1/2 rounded-full"
        style={{ background: `${color}7a` }}
      />
      {/* Key light */}
      <span className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_30%,rgba(255,255,255,0.10),transparent_70%)]" />
      {/* Vignette */}
      <span className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
    </span>
  );
}

/**
 * Stand-in for a recording's video frame.
 *
 * There is no captured media, so this reconstructs what a call grid looks like
 * rather than filling the space with a gradient: one tile per participant,
 * each tinted from their avatar colour, with a silhouette, key light, vignette
 * and a name chip. A solo call keeps the product's audio-only treatment.
 */
export function VideoPoster({
  participants,
  poster,
  className = "",
  children,
}: {
  participants: Participant[];
  poster: [string, string];
  className?: string;
  children?: React.ReactNode;
}) {
  const solo = participants.length === 1;
  const tiles = participants.slice(0, 6);
  const extra = participants.length - tiles.length;

  if (solo) {
    return (
      <div
        className={`relative ${className}`}
        style={{
          background: `radial-gradient(circle at 50% 45%, ${poster[0]}, ${poster[1]})`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Avatar participant={participants[0]} size={56} ring />
        </div>
        <span className="absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white/90">
          {participants[0].name.split(" ")[0]}
        </span>
        {children}
      </div>
    );
  }

  const cols = tiles.length <= 4 ? 2 : 3;

  return (
    <div className={`relative bg-[#07070a] ${className}`}>
      <div
        className="absolute inset-0 grid gap-[2px] p-[2px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        {tiles.map((p, i) => (
          <div
            key={p.id}
            className="relative overflow-hidden rounded-[3px]"
            style={{ background: room(p.color, i) }}
          >
            <Figure color={p.color} />
            <span className="absolute bottom-1 left-1 max-w-[85%] truncate rounded bg-black/55 px-1.5 py-[1px] text-[9px] text-white/90">
              {p.name.split(" ")[0]}
            </span>
            {i === tiles.length - 1 && extra > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[13px] font-semibold text-white">
                +{extra}
              </span>
            )}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
