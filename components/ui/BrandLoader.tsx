import { CueMark } from "@/components/brand/CueMark";

/** Ring mask: keeps only the outer few px of the spinning conic gradient. */
function ringStyle(thickness: number) {
  const cut = `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`;
  return { WebkitMask: cut, mask: cut } as const;
}

/**
 * Branded loading indicator: the Cue glyph sitting inside a spinning
 * brand-cyan arc, with a soft glow behind it.
 *
 * Used while a meeting detail page resolves. Preferred over a skeleton here
 * because the detail page has no single dominant shape to skeleton
 * convincingly -- a player, three tabs and a rail -- so a blocky placeholder
 * reads as broken rather than loading.
 */
export function BrandLoader({
  label = "Loading meeting",
  size = 76,
}: {
  label?: string;
  size?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <span className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow */}
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse rounded-full bg-brand/20 blur-xl"
        />

        {/* Track */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-surface"
          style={ringStyle(3)}
        />

        {/* Spinning arc */}
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-spin rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #02beff 340deg, #02beff 360deg)",
            animationDuration: "900ms",
            ...ringStyle(3),
          }}
        />

        <CueMark className="relative h-[26px] w-[32px] text-brand" />
      </span>

      <p className="text-[13px] tracking-wide text-fg-muted">{label}</p>
    </div>
  );
}

/** Small inline variant, for pending states on a card or button. */
export function BrandSpinner({ size = 34 }: { size?: number }) {
  return (
    <span className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-white/20"
        style={ringStyle(3)}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-spin rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #02beff 340deg, #02beff 360deg)",
          animationDuration: "750ms",
          ...ringStyle(3),
        }}
      />
    </span>
  );
}
