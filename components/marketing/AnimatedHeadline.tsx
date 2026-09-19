/**
 * Headline that writes itself in, a word at a time.
 *
 * Each word gets the same animation with a staggered delay, and a caret blinks
 * at the end of the line until the last word has landed. It is pure CSS in a
 * server component -- no hydration, no client bundle, and the global
 * prefers-reduced-motion rule collapses the whole thing for anyone who asked
 * for that.
 */

/** Gap between words landing. */
const STEP_MS = 110;
const WORD_MS = 520;

export function AnimatedHeadline({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  const settled = (words.length - 1) * STEP_MS + WORD_MS;

  return (
    <h1 className={className}>
      {/* The plain string for anything not running our CSS. */}
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            style={{
              animation: `word-in ${WORD_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
              animationDelay: `${i * STEP_MS}ms`,
            }}
            className="inline-block whitespace-pre"
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}

        <span
          style={{
            animation: `caret-blink 900ms steps(1, end) infinite, caret-retire 1ms linear ${settled + 260}ms forwards`,
          }}
          className="ml-[0.06em] inline-block h-[0.78em] w-[0.045em] translate-y-[0.04em] bg-brand align-baseline"
        />
      </span>
    </h1>
  );
}
