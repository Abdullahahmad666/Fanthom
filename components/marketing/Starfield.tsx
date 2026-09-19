/**
 * The marketing page's starfield.
 *
 * Positions come from a fixed seeded PRNG rather than Math.random(), so the
 * server and client render identical markup and hydration stays quiet. No
 * image asset, so nothing to 404 on deploy.
 */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const STARS = (() => {
  const rand = seeded(20260919);
  return Array.from({ length: 140 }, () => {
    const r = rand();
    return {
      left: `${(rand() * 100).toFixed(3)}%`,
      top: `${(rand() * 100).toFixed(3)}%`,
      size: r < 0.82 ? 1 : r < 0.96 ? 2 : 3,
      opacity: 0.25 + rand() * 0.6,
    };
  });
})();

export function Starfield({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
