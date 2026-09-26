"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type DragEvent } from "react";
import {
  AlertCircle, ArrowRight, Clock, FileText, ListChecks, Loader2, Quote, Upload, Users, X,
} from "lucide-react";
import { parseTranscript, TranscriptParseError } from "@/lib/transcript/parse";
import { extractNotes } from "@/lib/transcript/extract";
import { formatClock, formatDuration } from "@/lib/types";
import { Cue } from "@/components/ui/Cue";
import { Reveal } from "@/components/ui/Reveal";
import { pushToast } from "@/lib/toast";

/**
 * Transcript import.
 *
 * The preview is the point. An importer that swallows a file and redirects
 * asks you to trust it with something you have not seen; this parses in the
 * browser first and shows exactly what it found -- who spoke, how long, and
 * which lines it is going to keep -- before anything is written. The same
 * parser then runs again on the server as the authority, so the preview
 * cannot promise something the stored version does not deliver.
 */

type Preview = {
  filename: string;
  raw: string;
  format: string;
  speakers: string[];
  turns: number;
  durationSec: number;
  unattributed: number;
  keep: { heading: string; items: { label?: string; text: string; cues?: number[] }[] }[];
  actionItems: number;
};

const ACCEPT = ".vtt,.srt,.txt,.text,text/vtt,text/plain,application/x-subrip";

export function ImportView() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const read = async (file: File) => {
    setError(null);
    const raw = await file.text();

    try {
      const parsed = parseTranscript(raw, file.name);
      const notes = extractNotes(parsed.turns, parsed.durationSec);
      setPreview({
        filename: file.name,
        raw,
        format: parsed.format,
        speakers: parsed.speakers,
        turns: parsed.turns.length,
        durationSec: parsed.durationSec,
        unattributed: parsed.unattributed,
        keep: notes.sections.map((s) => ({
          heading: s.heading,
          items: s.blocks.flatMap((b) => (b.kind === "bullets" ? b.items : [])),
        })),
        actionItems: notes.actionItems.length,
      });
      setTitle((t) => t || file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_.]+/g, " ").trim());
    } catch (e) {
      setPreview(null);
      setError(
        e instanceof TranscriptParseError
          ? e.message
          : "That file could not be read as a transcript.",
      );
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void read(file);
  };

  const save = async () => {
    if (!preview) return;
    setSaving(true);
    setError(null);

    const body = new FormData();
    body.set("text", preview.raw);
    body.set("title", title.trim() || preview.filename);

    try {
      const res = await fetch("/api/meetings/import", { method: "POST", body });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "The import failed.");
        setSaving(false);
        return;
      }
      pushToast({
        title: "Transcript imported",
        description: `${title.trim() || preview.filename} is ready, with every line carrying its timestamp.`,
        status: "success",
        duration: 5000,
      });
      /* Straight into the meeting: the point of importing is to read it. */
      router.push(`/calls/${data.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The import failed.");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[860px] px-6 py-12">
      <Reveal as="header">
        <h1 className="font-display text-[38px] leading-tight text-text">Import a transcript</h1>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">
          Cue does not sit in your meetings. Export the transcript your conferencing
          tool already made — Zoom, Google Meet and Teams all produce one — and Cue
          finds the notes inside it, with the moment each line came from.
        </p>
      </Reveal>

      {!preview ? (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`mt-9 flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-16 transition-colors ${
              dragging
                ? "border-accent bg-accentsoft"
                : "border-line bg-surface hover:border-line-strong"
            }`}
          >
            <Upload className="h-7 w-7 text-faint" strokeWidth={1.5} />
            <span className="text-[16px] font-medium text-text">
              Drop a transcript, or choose a file
            </span>
            <span className="text-[13px] text-faint">
              .vtt · .srt · .txt — nothing leaves your browser until you confirm
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void read(file);
            }}
          />

          <p className="mt-6 text-[13px] text-faint">
            No transcript handy? Paste one in — a plain{" "}
            <code className="rounded bg-raised px-1 py-0.5 text-[12px]">Name: what they said</code>{" "}
            log works.
          </p>
          <PasteBox onUse={(text) => void read(new File([text], "Pasted transcript.txt"))} />
        </>
      ) : (
        <PreviewPane
          preview={preview}
          title={title}
          onTitle={setTitle}
          onDiscard={() => {
            setPreview(null);
            setError(null);
          }}
          onSave={save}
          saving={saving}
        />
      )}

      {error && (
        <p className="mt-6 flex items-start gap-2 rounded-md bg-mark-soft px-4 py-3 text-[14px] leading-snug text-mark">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function PasteBox({ onUse }: { onUse: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="mt-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder={"Maya Chen: Let's start with the launch date.\nTom Okafor: The rehearsal hasn't run yet."}
        className="w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 font-mono text-[13px] leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none"
      />
      <button
        type="button"
        disabled={text.trim().length < 20}
        onClick={() => onUse(text)}
        className="mt-2 rounded-md bg-raised px-4 py-2 text-[14px] font-medium text-text transition-colors hover:bg-overlay disabled:opacity-40"
      >
        Read this
      </button>
    </div>
  );
}

function PreviewPane({
  preview,
  title,
  onTitle,
  onDiscard,
  onSave,
  saving,
}: {
  preview: Preview;
  title: string;
  onTitle: (v: string) => void;
  onDiscard: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const facts = [
    { Icon: Users, label: `${preview.speakers.length} speakers` },
    { Icon: Quote, label: `${preview.turns} turns` },
    { Icon: Clock, label: formatDuration(preview.durationSec) },
    { Icon: ListChecks, label: `${preview.actionItems} action items` },
  ];

  return (
    <div className="mt-9">
      <div className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] text-text">{preview.filename}</span>
          <span className="text-[12px] text-faint uppercase">{preview.format}</span>
        </span>
        <button
          type="button"
          onClick={onDiscard}
          aria-label="Choose a different file"
          className="rounded p-1 text-faint transition-colors hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <label className="mt-6 block">
        <span className="section-label">Meeting title</span>
        <input
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-2.5 text-[16px] text-text focus:border-accent focus:outline-none"
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-2">
        {facts.map(({ Icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 rounded-md bg-raised px-2.5 py-1.5 text-[13px] text-muted"
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[13px] text-faint">
        {preview.speakers.join(" · ")}
        {preview.unattributed > 0 &&
          ` — ${preview.unattributed} lines had no speaker and were joined to the one before.`}
      </p>

      {/* The honest part: what it will keep, before it keeps it. */}
      <div className="mt-8">
        <p className="section-label">What Cue found</p>
        <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-faint">
          Every line below is a quote, not a paraphrase — Cue extracts what was said
          rather than rewriting it, so each one carries the second it happened.
        </p>

        <div className="mt-5 space-y-6">
          {preview.keep.map((section, si) => (
            <Reveal key={section.heading} as="section" delay={si * 60}>
              <h2 className="text-[15px] font-semibold text-text">{section.heading}</h2>
              <ul className="mt-2 space-y-2.5">
                {section.items.slice(0, 4).map((item, i) => (
                  <li key={i} className="measure text-[14px] leading-relaxed text-muted">
                    {item.label && <span className="font-medium text-text">{item.label}: </span>}
                    {item.text}
                    {item.cues?.[0] !== undefined && (
                      <span className="ml-2 align-middle">
                        <Cue tSec={item.cues[0]} label={formatClock(item.cues[0])} />
                      </span>
                    )}
                  </li>
                ))}
                {section.items.length > 4 && (
                  <li className="text-[13px] text-faint">
                    +{section.items.length - 4} more in this section
                  </li>
                )}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="press flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {saving ? "Importing…" : "Import meeting"}
        </button>
        <button
          type="button"
          onClick={onDiscard}
          disabled={saving}
          className="text-[14px] text-muted transition-colors hover:text-text disabled:opacity-40"
        >
          Choose another file
        </button>
      </div>
    </div>
  );
}
