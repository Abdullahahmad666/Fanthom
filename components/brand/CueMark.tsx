/**
 * The Cue mark.
 *
 * A cue light: a filled dot with an arc opening to the right, drawn as if a
 * moment is being played out of it. It reads as a play affordance and a
 * record light at once, which is the whole product in one glyph -- something
 * was said, and you can hear it again.
 *
 * Drawn rather than shipped as a file so it inherits currentColor and stays
 * sharp at 16px in a tab and 96px on a landing page.
 */
export function CueMark({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} style={style}>
      {/* The moment itself */}
      <circle cx="11" cy="16" r="5" fill="currentColor" />
      {/* Two arcs travelling out of it, the second fainter: it is still going */}
      <path
        d="M20 9.5a9 9 0 0 1 0 13"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M25.5 5.5a15 15 0 0 1 0 21"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

/**
 * Wordmark. `size` is the cap height in px and everything scales from it, so
 * one number controls the lockup wherever it appears.
 */
export function CueWordmark({
  className = "",
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.4 }}>
      <CueMark
        className="text-mark"
        style={{ height: size * 1.05, width: size * 1.05 }}
      />
      <span
        style={{ fontSize: size * 1.25, letterSpacing: "-0.02em" }}
        className="font-display leading-none text-text"
      >
        Cue
      </span>
    </span>
  );
}
