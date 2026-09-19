import { Avatar } from "./Avatar";
import type { Participant } from "@/lib/types";

/**
 * Stand-in for a recording's video frame.
 *
 * There is no captured media, so instead of one flat gradient this lays the
 * participants out the way a call grid actually looks -- one tile each, tinted
 * from their avatar colour. A solo call keeps the product's audio-only
 * treatment: a single radial wash with the speaker centred.
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
        {children}
      </div>
    );
  }

  const cols = tiles.length <= 4 ? 2 : 3;

  return (
    <div
      className={`relative ${className}`}
      style={{ background: `linear-gradient(140deg, ${poster[0]}, ${poster[1]})` }}
    >
      <div
        className="absolute inset-0 grid gap-[2px] p-[2px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        {tiles.map((p, i) => (
          <div
            key={p.id}
            className="relative flex items-center justify-center overflow-hidden rounded-[3px]"
            style={{
              background: `linear-gradient(150deg, ${p.color}55, #0b0b0d 85%)`,
            }}
          >
            {/* Suggestion of a head-and-shoulders framing. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-[18%] h-[52%] w-[46%] rounded-t-full"
              style={{ background: `${p.color}3d` }}
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[28%] h-[22%] w-[22%] rounded-full"
              style={{ background: `${p.color}66` }}
            />
            <span className="relative text-[10px] font-semibold text-white/85">
              {p.name.split(" ")[0]}
            </span>
            {i === tiles.length - 1 && extra > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[13px] font-semibold text-white">
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
