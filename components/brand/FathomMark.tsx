/**
 * The Fathom glyph: two skewed blades, the lower one shorter, reading as a
 * fast-forward chevron. Approximated from the wordmark in the screenshots --
 * the real mark is proprietary, so this is a close-enough stand-in.
 */
export function FathomMark({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 32 26"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d="M2 2h18.5L13 12.2H2V2Z" fill="currentColor" />
      <path d="M8.5 15.2h15.2L17 24H8.5v-8.8Z" fill="currentColor" opacity="0.85" />
      <path d="M22.5 2H30l-7.2 10.2h-7.4L22.5 2Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/** `size` is the wordmark's cap height in px; the glyph scales with it. */
export function FathomWordmark({
  className = "",
  size = 17,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span className={`flex items-center gap-2 ${className}`} style={{ gap: size * 0.12 }}>
      <span
        style={{ fontSize: size }}
        className="font-bold tracking-[0.02em] text-fg"
      >
        FATHOM
      </span>
      <FathomMark
        style={{ height: size, width: size * 1.24 }}
        className="text-brand"
      />
    </span>
  );
}
