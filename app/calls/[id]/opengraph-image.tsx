import { ImageResponse } from "next/og";
import { getMeetingBySlug } from "@/backend/src/repositories/meetings";
import { formatDuration } from "@/lib/types";

export const alt = "Meeting recap on Fathom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Per-meeting social card, so a shared recording link previews with its own
 * title, participants and length rather than the generic site card.
 *
 * Satori only supports flexbox, so every container sets display: flex.
 */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meeting = await getMeetingBySlug(id);

  const title = meeting?.title ?? "Meeting recap";
  const people = meeting?.participants ?? [];
  const meta = meeting
    ? `${meeting.date} · ${formatDuration(meeting.durationSec)} · ${people.length} ${
        people.length === 1 ? "person" : "people"
      }`
    : "Fathom";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: meeting
            ? `linear-gradient(140deg, ${meeting.poster[0]} 0%, #08070b 62%)`
            : "#08070b",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: 2 }}>
            FATHOM
          </div>
          <svg width="34" height="28" viewBox="0 0 32 26">
            <path d="M2 2h18.5L13 12.2H2V2Z" fill="#02BEFF" />
            <path d="M8.5 15.2h15.2L17 24H8.5v-8.8Z" fill="#02BEFF" opacity="0.85" />
            <path d="M22.5 2H30l-7.2 10.2h-7.4L22.5 2Z" fill="#02BEFF" opacity="0.6" />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#02BEFF" }}>Meeting recap</div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.12,
              color: "#fff",
              marginTop: 16,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#c9c9c9", marginTop: 22 }}>
            {meta}
          </div>
        </div>

        {/* Participant chips, capped so a long list cannot overflow the card. */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {people.slice(0, 5).map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 58,
                height: 58,
                borderRadius: 999,
                background: p.color,
                color: "#fff",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {p.name.slice(0, 1).toUpperCase()}
            </div>
          ))}
          {people.length > 5 && (
            <div style={{ display: "flex", fontSize: 24, color: "#c9c9c9" }}>
              +{people.length - 5} more
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
