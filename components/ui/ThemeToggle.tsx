"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

/**
 * Theme control: dark, light, or follow the system.
 *
 * Three states rather than two. A binary toggle silently overrides the
 * preference the operating system already knows, and there is then no way
 * back to "whatever my machine is doing" without clearing storage.
 *
 * The chosen theme is written to localStorage and applied by the blocking
 * script in the document head, so the first paint is already correct -- a
 * theme applied in an effect shows one frame of the wrong one, which is the
 * flash every dark-mode implementation is judged by.
 */

export type ThemeChoice = "dark" | "light" | "system";

const KEY = "cue-theme";

/** Runs before paint. Kept in sync with `apply` below by hand, deliberately:
 *  it has to be a string literal to be inlined into the head. */
export const THEME_SCRIPT = `
(function () {
  try {
    var c = localStorage.getItem("${KEY}") || "system";
    var dark = c === "dark" || (c === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

function apply(choice: ThemeChoice) {
  const dark =
    choice === "dark" ||
    (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  /* Suppress transitions for one frame: watching every colour cross-fade
     makes the flip feel slow rather than deliberate. */
  const root = document.documentElement;
  root.setAttribute("data-theme-switching", "");
  root.dataset.theme = dark ? "dark" : "light";
  window.setTimeout(() => root.removeAttribute("data-theme-switching"), 0);
}

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

/**
 * The choice lives outside React.
 *
 * It is written to localStorage and read back by a script that runs before
 * hydration, so React is not its owner -- it is subscribing to an external
 * system. useSyncExternalStore says exactly that, and avoids the cascading
 * render that reading it in an effect causes.
 */
let current: ThemeChoice | null = null;
const listeners = new Set<() => void>();

function readChoice(): ThemeChoice {
  if (current) return current;
  try {
    current = (localStorage.getItem(KEY) as ThemeChoice | null) ?? "system";
  } catch {
    current = "system";
  }
  return current;
}

function setChoice(next: ThemeChoice) {
  current = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Private mode: the choice still applies for this session.
  }
  apply(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  /* Another tab changing the theme should change this one too. */
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    current = (e.newValue as ThemeChoice | null) ?? "system";
    apply(current);
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const choice = useSyncExternalStore(subscribe, readChoice, () => "system" as ThemeChoice);

  /* Following the system means following it as it changes, not just at load. */
  useEffect(() => {
    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-md bg-raised p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const on = choice === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={label}
            title={label}
            onClick={() => setChoice(value)}
            className={`flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-[12px] font-medium transition-colors ${
              on ? "bg-overlay text-text shadow-sm" : "text-faint hover:text-text"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {!compact && label}
          </button>
        );
      })}
    </div>
  );
}
