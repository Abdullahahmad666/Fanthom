import type { Participant } from "@/lib/types";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "");
}

export function Avatar({
  participant,
  size = 32,
  ring = false,
}: {
  participant: Participant;
  size?: number;
  ring?: boolean;
}) {
  return (
    <span
      title={participant.name}
      style={{
        width: size,
        height: size,
        background: participant.color,
        fontSize: Math.round(size * 0.4),
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white uppercase ${
        ring ? "ring-2 ring-canvas" : ""
      }`}
    >
      {initials(participant.name)}
    </span>
  );
}

/** Overlapping avatar row, with a +N chip once the list runs long. */
export function AvatarStack({
  participants,
  max = 4,
  size = 32,
}: {
  participants: Participant[];
  max?: number;
  size?: number;
}) {
  const shown = participants.slice(0, max);
  const extra = participants.length - shown.length;

  return (
    <span className="flex items-center">
      {shown.map((p, i) => (
        <span key={p.id} style={{ marginLeft: i === 0 ? 0 : -size * 0.3 }}>
          <Avatar participant={p} size={size} ring />
        </span>
      ))}
      {extra > 0 && (
        <span
          style={{ width: size, height: size, marginLeft: -size * 0.3, fontSize: Math.round(size * 0.34) }}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-bubble font-semibold text-fg ring-2 ring-canvas"
        >
          +{extra}
        </span>
      )}
    </span>
  );
}
