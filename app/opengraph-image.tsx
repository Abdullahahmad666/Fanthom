import { ImageResponse } from "next/og";

export const alt = "Fathom — AI notetaking that is out of this world";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, generated rather than shipped as a file, so the wording stays
 * in sync with the page and there is no binary asset to keep updated.
 *
 * Satori (which backs ImageResponse) only supports flexbox, so every container
 * here sets display: flex explicitly.
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
            "radial-gradient(900px 500px at 18% 0%, #11243a 0%, #000 62%), radial-gradient(700px 420px at 88% 30%, #1a1035 0%, #000 60%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#fff",
              display: "flex",
            }}
          >
            FATHOM
          </div>
          <svg width="46" height="38" viewBox="0 0 32 26">
            <path d="M2 2h18.5L13 12.2H2V2Z" fill="#02BEFF" />
            <path d="M8.5 15.2h15.2L17 24H8.5v-8.8Z" fill="#02BEFF" opacity="0.85" />
            <path d="M22.5 2H30l-7.2 10.2h-7.4L22.5 2Z" fill="#02BEFF" opacity="0.6" />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              color: "#fff",
              display: "flex",
              maxWidth: 900,
            }}
          >
            AI notetaking that is out of this world
          </div>
          <div style={{ fontSize: 30, color: "#969696", marginTop: 28, display: "flex" }}>
            Summaries, transcripts and action items from every call.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {["Recordings", "Transcripts", "Action items", "Highlights"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: 22,
                color: "#02BEFF",
                border: "1px solid #1F2A31",
                background: "#0d1418",
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
