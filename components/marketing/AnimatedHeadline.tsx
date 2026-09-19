/**
 * Headline that writes itself in, a word at a time.
 *
 * Each word gets the same animation with a staggered delay. It is pure CSS in
 * a server component -- no hydration, no client bundle, and the global
 * prefers-reduced-motion rule collapses the whole thing for anyone who asked
 * for that.
 *
 * No caret: it kept blinking in the corner of the eye long after the line had
 * settled, which pulled attention off the headline it was meant to serve.
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
      </span>
    </h1>
  );
}
