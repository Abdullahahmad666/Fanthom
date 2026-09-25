"use client";

import { useState } from "react";
import {
  CalendarDays, Check, ChevronDown, LayoutList, MessageSquareText, Rocket,
  RotateCcw, Settings2, Smile, Sparkles, TrendingUp, UserRoundPlus, Users,
  Hand,
} from "lucide-react";
import type { TemplateIcon } from "@/lib/summaryTemplates";
import { LANGUAGES } from "@/lib/translations";
import { useMeeting } from "./MeetingProvider";
import { CustomizeTemplateModal } from "./CustomizeTemplateModal";
import { Popover } from "@/components/ui/Popover";
import { CueSources } from "./CueSources";
import { Reveal } from "@/components/ui/Reveal";

/** One glyph per catalogue family, matching how the product groups them. */
const TEMPLATE_ICONS: Record<TemplateIcon, typeof Check> = {
  insights: MessageSquareText,
  sales: TrendingUp,
  cs: Smile,
  candidate: UserRoundPlus,
  demo: LayoutList,
  oneonone: Users,
  kickoff: Rocket,
  update: CalendarDays,
  qa: MessageSquareText,
  retro: RotateCcw,
  standup: Hand,
};

export function SummaryPanel() {
  const {
    templates, template, setTemplate, sections, generating, regenerate,
    language, setLanguage, untranslated,
  } = useMeeting();
  const [dismissed, setDismissed] = useState(false);
  const [customising, setCustomising] = useState(false);

  const current = templates.find((t) => t.id === template);
  const busy = generating !== null;

  return (
    <div className="px-6 pb-8">
      <div className="flex flex-wrap items-center gap-3 py-4">
        {/* Segmented template picker: dropdown plus an attached gear, sharing
            one pill outline, exactly as the product renders it. */}
        <div className="flex items-stretch overflow-hidden rounded-full ring-1 ring-line">
          <Popover
            align="left"
            className="max-h-[70vh] w-[520px] max-w-[92vw] overflow-y-auto"
            panelStyle={{ background: "#232327", paddingTop: 8, paddingBottom: 8 }}
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="flex items-center gap-2 bg-surface px-4 py-2 text-[13px] text-fg transition-colors hover:bg-raised"
              >
                <Sparkles className="h-4 w-4 text-fg-muted" />
                {current?.name ?? "Summary"}
                <ChevronDown className="h-4 w-4 text-fg-muted" />
              </button>
            )}
          >
            {(close) => (
              <div>
                {templates.map((t) => {
                  const selected = t.id === template;
                  const usable = t.sections !== null;
                  const Icon = TEMPLATE_ICONS[t.icon];

                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={!usable}
                      title={
                        usable
                          ? undefined
                          : "This template needs classification the prototype has no model for, so it is listed but not generated."
                      }
                      onClick={() => {
                        setTemplate(t.id);
                        close();
                      }}
                      className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                        selected ? "bg-[#2e3640]" : usable ? "hover:bg-white/5" : ""
                      } ${usable ? "" : "opacity-40"}`}
                    >
                      <Icon
                        className={`mt-1 h-4 w-4 shrink-0 ${
                          selected ? "text-brand" : "text-fg-muted"
                        }`}
                        strokeWidth={1.8}
                      />

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[15px] font-bold ${selected ? "text-brand" : "text-fg"}`}
                          >
                            {t.name}
                          </span>
                          {t.customized && (
                            <span className="flex items-center gap-1 rounded-md bg-bubble px-2 py-0.5 text-[12px] text-fg">
                              <Settings2 className="h-3 w-3" /> Customized
                            </span>
                          )}
                          {!usable && (
                            <span className="text-[11px] tracking-wide text-fg-dim uppercase">
                              Not for this call
                            </span>
                          )}
                        </span>
                        <span
                          className={`mt-0.5 block text-[13px] ${
                            selected ? "text-brand" : "text-fg-muted"
                          }`}
                        >
                          {t.description}
                        </span>
                      </span>

                      {selected && <Check className="mt-1 h-4 w-4 shrink-0 text-success" />}
                    </button>
                  );
                })}
              </div>
            )}
          </Popover>

          <button
            type="button"
            onClick={() => setCustomising(true)}
            disabled={busy}
            aria-label={`Customize ${current?.name ?? ""} template`}
            className="border-l border-line bg-surface px-3 text-fg-muted transition-colors hover:bg-raised hover:text-fg disabled:opacity-40"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        {/* Summary language. "Auto" means the transcript's own language, which
            is what the product shows before you pick one. */}
        <Popover
          align="left"
          className="w-[320px]"
          panelStyle={{ background: "#232327", paddingTop: 8, paddingBottom: 8 }}
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-[13px] text-fg ring-1 ring-line transition-colors hover:bg-raised"
            >
              <Sparkles className="h-3.5 w-3.5 text-fg-muted" />
              {language === "auto" ? "Auto" : LANGUAGES.find((l) => l.code === language)?.name}
              <ChevronDown className="h-4 w-4 text-fg-muted" />
            </button>
          )}
        >
          {(close) => (
            <div>
              {LANGUAGES.map((l) => (
                <LangRow
                  key={l.code}
                  tag={l.tag}
                  name={l.name}
                  selected={language === l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    close();
                  }}
                />
              ))}

              <div className="my-2 h-px bg-white/10" />

              <LangRow
                icon
                name="Auto"
                hint="(transcript language)"
                selected={language === "auto"}
                onClick={() => {
                  setLanguage("auto");
                  close();
                }}
              />
            </div>
          )}
        </Popover>
      </div>

      {language !== "auto" && language !== "en" && untranslated > 0 && (
        <p className="mb-5 rounded-lg bg-amberbg px-4 py-3 text-[13px] leading-snug text-amber">
          Translated as far as the built-in dictionary reaches. {untranslated} line
          {untranslated === 1 ? "" : "s"} stayed in English — machine translation is out of
          scope for this prototype, so nothing here is machine-guessed.
        </p>
      )}

      {busy ? (
        <Generating pct={generating} />
      ) : (
        <>
          {!dismissed && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="mb-6 block w-full rounded-lg bg-amberbg px-4 py-3 text-left text-[13px] text-amber"
            >
              <Sparkles className="mr-2 inline h-4 w-4" />
              <strong className="font-bold">NEW:</strong> Customize this summary — the gear
              above rewrites it to your instruction.
            </button>
          )}

          <div className="space-y-7">
            {(sections ?? []).map((section, si) => (
              <Reveal as="section" key={section.heading} delay={Math.min(si, 6) * 55}>
                <h3 className="mb-3 text-[17px] font-semibold text-fg">{section.heading}</h3>
                {section.blocks.map((block, i) =>
                  block.kind === "para" ? (
                    <p key={i} className="text-[13px] leading-relaxed text-fg/90">
                      {block.text}
                    </p>
                  ) : (
                    <ul key={i} className="mt-2 space-y-2">
                      {block.items.map((item, j) => (
                        <li
                          key={j}
                          className="relative pl-5 text-[13px] leading-relaxed text-fg/90 before:absolute before:top-[9px] before:left-1 before:h-1 before:w-1 before:rounded-full before:bg-fg-muted"
                        >
                          {item.label && (
                            <strong className="font-semibold text-fg">{item.label}: </strong>
                          )}
                          {item.text}
                          {/* The receipts. An extracted line carries the
                              moments it came from, so the claim can be
                              checked rather than believed. */}
                          {item.cues && item.cues.length > 0 && (
                            <CueSources cues={item.cues} />
                          )}
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </Reveal>
            ))}
          </div>
        </>
      )}

      {customising && (
        <CustomizeTemplateModal
          templateLabel={current?.name ?? "Summary"}
          onRegenerate={regenerate}
          onClose={() => setCustomising(false)}
        />
      )}
    </div>
  );
}

/** One language row: the country tag, the name, and a tick when selected. */
function LangRow({
  tag,
  name,
  hint,
  icon = false,
  selected,
  onClick,
}: {
  tag?: string;
  name: string;
  hint?: string;
  icon?: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-white/5"
    >
      <span className="w-6 shrink-0 text-[11px] font-semibold tracking-wide text-fg-muted uppercase">
        {icon ? <Sparkles className="h-4 w-4" /> : tag}
      </span>
      <span className="flex-1 text-[16px] text-fg">
        {name}
        {hint && <span className="ml-1.5 text-[14px] text-fg-muted">{hint}</span>}
      </span>
      {selected && <Check className="h-4 w-4 shrink-0 text-success" />}
    </button>
  );
}

/** The percentage and striped bar the product shows while it rewrites. */
function Generating({ pct }: { pct: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <p className="text-[24px] font-semibold text-fg tabular-nums">{pct}%</p>

      <div
        className="mt-4 h-2 w-[320px] max-w-full overflow-hidden rounded-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.14) 0 6px, transparent 6px 12px)",
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{ width: `${pct}%` }}
          className="h-full rounded-full bg-brand transition-[width] duration-150 ease-linear"
        />
      </div>

      <p className="mt-4 text-[15px] text-fg-muted">Please wait, summary is generating...</p>
    </div>
  );
}
