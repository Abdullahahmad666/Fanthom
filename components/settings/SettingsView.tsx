"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, LogOut, Trash2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Reveal } from "@/components/ui/Reveal";
import { SOURCES, type SourceId } from "@/lib/sources";

/**
 * Settings, rebuilt around what Cue does.
 *
 * What was here belonged to the product this was cloned from: auto-record
 * scope, auto-capture toggles per conferencing app, a notetaker bot's display
 * name, CRM sync, API keys. Cue records nothing, joins nothing and has no API
 * to key, so every one of those controls was a switch wired to a `useState`
 * that reset on reload -- a settings page where nothing was a setting.
 *
 * What is left is short because it is only the things that exist, and every
 * one of them writes to the database and survives a reload.
 */

type Profile = {
  email: string;
  full_name: string | null;
  transcript_source: SourceId | null;
} | null;

type Saved = "idle" | "saving" | "saved" | "error";

export function SettingsView({ profile }: { profile: Profile }) {
  return (
    <main className="mx-auto w-full max-w-[760px] flex-1 px-6 py-12">
      <Reveal>
        <h1 className="font-display text-[34px] leading-tight tracking-[-0.02em] text-text">
          Settings
        </h1>
        <p className="measure mt-3 text-[15px] leading-relaxed text-muted">
          {profile
            ? "Everything here is saved to your account."
            : "You are signed out, so nothing here can be saved. Sign in to change these."}
        </p>
      </Reveal>

      <div className="mt-10 space-y-5">
        <ProfileSection profile={profile} />
        <SourceSection profile={profile} />
        <AppearanceSection />
        <DataSection signedIn={Boolean(profile)} />
      </div>
    </main>
  );
}

function Section({
  title,
  description,
  children,
  delay = 0,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal as="section" delay={delay} className="rounded-xl border border-line bg-surface p-6">
      <h2 className="text-[16px] font-semibold text-text">{title}</h2>
      <p className="measure mt-1.5 text-[13.5px] leading-relaxed text-muted">{description}</p>
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}

/** Saves the patch and reports the outcome, rather than assuming one. */
async function patchProfile(body: Record<string, string>) {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ ok: false }));
  return Boolean(data.ok);
}

function ProfileSection({ profile }: { profile: Profile }) {
  const [name, setName] = useState(profile?.full_name ?? "");
  const [state, setState] = useState<Saved>("idle");

  const dirty = (profile?.full_name ?? "") !== name.trim();

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dirty) return;
    setState("saving");
    setState((await patchProfile({ full_name: name.trim() })) ? "saved" : "error");
  };

  return (
    <Section
      title="Profile"
      description="The name shown on the meetings you import and in the account menu."
    >
      <form onSubmit={save} className="max-w-[420px]">
        <label htmlFor="full_name" className="text-[13px] font-medium text-text">
          Name
        </label>
        <input
          id="full_name"
          value={name}
          disabled={!profile}
          onChange={(e) => {
            setName(e.target.value);
            setState("idle");
          }}
          placeholder="Your name"
          className="mt-1.5 h-[44px] w-full rounded-lg border border-line bg-field px-3.5 text-[14px] text-text transition-colors placeholder:text-faint hover:border-line-strong focus:border-accent focus:outline-none disabled:opacity-50"
        />

        <label htmlFor="email" className="mt-4 block text-[13px] font-medium text-text">
          Email
        </label>
        {/* Read-only: changing the address is an auth operation with its own
            confirmation round trip, not a text field that quietly succeeds. */}
        <input
          id="email"
          readOnly
          value={profile?.email ?? "Not signed in"}
          className="mt-1.5 h-[44px] w-full cursor-not-allowed rounded-lg border border-line bg-sunken px-3.5 text-[14px] text-muted"
        />
        <p className="mt-1.5 text-[12px] text-faint">
          Changing your email is not part of this build.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={!profile || !dirty || state === "saving"}
            className="press flex h-[40px] items-center gap-2 rounded-lg bg-accent px-5 text-[14px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {state === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
          <SaveNote state={state} />
        </div>
      </form>
    </Section>
  );
}

function SourceSection({ profile }: { profile: Profile }) {
  const [picked, setPicked] = useState<SourceId | null>(profile?.transcript_source ?? null);
  const [state, setState] = useState<Saved>("idle");

  const choose = async (id: SourceId) => {
    if (!profile) return;
    setPicked(id);
    setState("saving");
    setState((await patchProfile({ transcript_source: id })) ? "saved" : "error");
  };

  return (
    <Section
      delay={60}
      title="Where your meetings happen"
      description="Decides which export instructions the import screen shows you. Nothing is connected — Cue only ever reads a file you give it."
    >
      <div className="grid gap-2.5 sm:grid-cols-2">
        {SOURCES.map((s) => {
          const on = picked === s.id;
          return (
            <button
              key={s.id}
              type="button"
              disabled={!profile}
              onClick={() => void choose(s.id)}
              aria-pressed={on}
              className={`press rounded-lg border p-4 text-left transition-colors disabled:opacity-50 ${
                on ? "border-accent bg-accentsoft" : "border-line hover:border-line-strong"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-6 rounded-full"
                  style={{ background: s.tint }}
                />
                <span className="text-[14px] font-medium text-text">{s.name}</span>
                {on && <Check className="ml-auto h-4 w-4 text-accent" strokeWidth={3} />}
              </span>
              <span className="mt-2 block text-[12.5px] leading-relaxed text-muted">
                {s.path}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        <SaveNote state={state} />
      </div>
    </Section>
  );
}

function AppearanceSection() {
  return (
    <Section
      delay={120}
      title="Appearance"
      description="Cue is built for both. Meeting notes get read at 2pm next to a document as often as at midnight."
    >
      {/* Stored per browser rather than on the account: a theme is a property
          of the screen you are looking at, not of who you are. */}
      <ThemeToggle />
      <p className="mt-3 text-[12px] text-faint">
        Remembered in this browser. “System” follows your operating system.
      </p>
    </Section>
  );
}

function DataSection({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const remove = async () => {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        /* The session cookie was cleared in the response to that request, so
           refresh() makes the server re-read it and the gate takes effect. */
        router.replace("/");
        router.refresh();
        return;
      }
      setNote("That did not work. Nothing was deleted.");
    } catch {
      setNote("That did not work. Nothing was deleted.");
    }
    setBusy(false);
  };

  return (
    <Section
      delay={180}
      title="Your data"
      description="Your meetings, transcripts and playlists live in one Postgres row set, scoped to your account."
    >
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="press flex h-[40px] items-center gap-2 rounded-lg border border-line px-5 text-[14px] font-medium text-text transition-colors hover:border-line-strong"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>

      <div className="mt-6 border-t border-line pt-6">
        {!confirming ? (
          <button
            type="button"
            disabled={!signedIn}
            onClick={() => setConfirming(true)}
            className="press flex h-[40px] items-center gap-2 rounded-lg border border-critical/40 px-5 text-[14px] font-medium text-critical transition-colors hover:bg-critical/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete my data
          </button>
        ) : (
          <div>
            {/* The consequence is stated before the button that causes it,
                and the destructive option is not the default. */}
            <p className="measure text-[14px] leading-relaxed text-text">
              This permanently deletes every meeting, transcript and playlist on
              this account. It cannot be undone.
            </p>
            <p className="measure mt-2 text-[13px] leading-relaxed text-muted">
              Your login itself stays, because removing it needs a server key
              this build does not hold. You will be signed out.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="press h-[40px] rounded-lg border border-line px-5 text-[14px] font-medium text-text"
              >
                Keep my data
              </button>
              <button
                type="button"
                onClick={() => void remove()}
                disabled={busy}
                className="press flex h-[40px] items-center gap-2 rounded-lg bg-critical px-5 text-[14px] font-semibold text-white disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete everything
              </button>
            </div>
          </div>
        )}

        {note && (
          <p role="alert" className="mt-3 flex items-center gap-2 text-[13px] text-critical">
            <AlertCircle className="h-4 w-4" />
            {note}
          </p>
        )}
      </div>
    </Section>
  );
}

function SaveNote({ state }: { state: Saved }) {
  if (state === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-[13px] text-positive">
        <Check className="h-4 w-4" strokeWidth={2.5} />
        Saved
      </span>
    );
  }
  if (state === "error") {
    return (
      <span role="alert" className="flex items-center gap-1.5 text-[13px] text-critical">
        <AlertCircle className="h-4 w-4" />
        Could not save
      </span>
    );
  }
  return null;
}
