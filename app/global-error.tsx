"use client";

/**
 * The last resort.
 *
 * This replaces the root layout when the layout itself fails, so it cannot use
 * anything from it -- no fonts, no theme tokens, no shared components, because
 * the module that provides them is the one that just threw. It therefore ships
 * its own <html> and <body> and styles itself inline.
 *
 * The colours are hard-coded for the same reason, and chosen to be readable in
 * either theme rather than to match one.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          background: "#121013",
          color: "#f4f1f4",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>Cue could not start</h1>
        <p style={{ margin: 0, maxWidth: "46ch", lineHeight: 1.6, color: "#a49fa7" }}>
          Something failed before the page could be built. Reloading usually
          clears it.
        </p>
        {error.digest && (
          <p style={{ margin: 0, fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#6f6a74" }}>
            Reference: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 8,
            padding: "12px 24px",
            borderRadius: 10,
            border: "none",
            background: "#7c86ff",
            color: "#0d0b16",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
