import { ImageResponse } from "next/og";

export const alt = "Cue — meeting notes with receipts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card.
 *
 * Generated rather than shipped as a file, so the wording cannot drift from
 * the page. It used to carry the reference product's headline word for word,
 * its blades glyph and its cyan -- in the one asset nobody looks at while
 * working, and the only one a stranger sees before they have seen anything
 * else.
 *
 * It shows the mechanic rather than describing it: a summary line with the
 * timestamps underneath, in the provenance colour, because that is the whole
 * product and it survives being shrunk to a thumbnail in a chat window.
 *
 * Satori (which backs ImageResponse) supports flexbox only, so every container
 * sets display: flex explicitly.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(900px 520px at 15% -10%, #26224a 0%, #121013 60%), radial-gradient(700px 420px at 92% 108%, #3a2c12 0%, #121013 58%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* The Cue mark, drawn at card scale. */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <circle cx="11" cy="16" r="5" fill="#e8b44c" />
            <path
              d="M20 9.5a9 9 0 0 1 0 13"
              stroke="#e8b44c"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M25.5 5.5a15 15 0 0 1 0 21"
              stroke="#e8b44c"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 42, color: "#f4f1f4", letterSpacing: -1 }}>
            Cue
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1.04,
              color: "#f4f1f4",
              maxWidth: 940,
              letterSpacing: -2,
            }}
          >
            Notes you can check.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 29,
              color: "#a49fa7",
              marginTop: 26,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Cue quotes your meeting instead of paraphrasing it — every line
            carries the second it was said.
          </div>
        </div>

        {/* The mechanic itself: a line, and the moments behind it. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "#1a181c",
            border: "1px solid #2e2a32",
            borderRadius: 14,
            padding: "26px 30px",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: "#f4f1f4" }}>
            Launch moves from the 14th to the 21st.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["3:04", "3:32", "4:18"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#e8b44c",
                  background: "#2f2413",
                  borderRadius: 6,
                  padding: "6px 14px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
