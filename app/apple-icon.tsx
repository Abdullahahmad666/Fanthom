import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon. Generated so it never drifts from the brand mark. */
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0D",
        }}
      >
        <svg width="104" height="86" viewBox="0 0 32 26">
          <path d="M2 2h18.5L13 12.2H2V2Z" fill="#02BEFF" />
          <path d="M8.5 15.2h15.2L17 24H8.5v-8.8Z" fill="#02BEFF" opacity="0.85" />
          <path d="M22.5 2H30l-7.2 10.2h-7.4L22.5 2Z" fill="#02BEFF" opacity="0.6" />
        </svg>
      </div>
    ),
    size,
  );
}
