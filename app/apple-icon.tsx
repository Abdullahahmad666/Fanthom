import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon. The Cue mark, on Cue's own near-black. */
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
          background: "#121013",
        }}
      >
        <svg width="108" height="108" viewBox="0 0 32 32">
          <circle cx="11" cy="16" r="5" fill="#e8b44c" />
          <path d="M20 9.5a9 9 0 0 1 0 13" stroke="#e8b44c" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M25.5 5.5a15 15 0 0 1 0 21" stroke="#e8b44c" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45" />
        </svg>
      </div>
    ),
    size,
  );
}
