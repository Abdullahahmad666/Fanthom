"use client";

import { useState } from "react";
import { Check, ChevronDown, Settings2, Sparkles } from "lucide-react";
import { useMeeting } from "./MeetingProvider";
import { Popover } from "@/components/ui/Popover";
import { TEMPLATE_LABELS, type TemplateId } from "@/lib/types";

export function SummaryPanel() {
  const { meeting, template, setTemplate } = useMeeting();
  const available = Object.keys(meeting.summaries) as TemplateId[];
  const sections = meeting.summaries[template] ?? [];
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="px-6 pb-8">
      <div className="flex flex-wrap items-center gap-3 py-4">
        {/* Segmented template picker: dropdown plus an attached gear, sharing
            one pill outline, exactly as the product renders it. */}
        <div className="flex items-stretch overflow-hidden rounded-full ring-1 ring-line">
          <Popover
            align="left"
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="flex items-center gap-2 bg-surface px-4 py-2 text-[15px] text-fg transition-colors hover:bg-raised"
              >
                <Sparkles className="h-4 w-4 text-fg-muted" />
                {TEMPLATE_LABELS[template]}
                <ChevronDown className="h-4 w-4 text-fg-muted" />
              </button>
            )}
          >
            {(close) => (
              <div className="py-1">
                {available.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTemplate(id);
                      close();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] text-fg transition-colors hover:bg-surface"
                  >
                    <Check
                      className={`h-4 w-4 ${id === template ? "text-brand" : "text-transparent"}`}
                    />
                    {TEMPLATE_LABELS[id]}
                  </button>
                ))}
              </div>
            )}
          </Popover>

          <button
            type="button"
            aria-label="Customise summary"
            className="border-l border-line bg-surface px-3 text-fg-muted transition-colors hover:bg-raised hover:text-fg"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        <span className="rounded-full bg-surface px-4 py-2 text-[15px] text-fg-muted ring-1 ring-line">
          Auto
        </span>
      </div>

      {!dismissed && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mb-6 block w-full rounded-lg bg-amberbg px-4 py-3 text-left text-[15px] text-amber"
        >
          <Sparkles className="mr-2 inline h-4 w-4" />
          <strong className="font-bold">NEW:</strong> Switch templates above — each one
          re-reads the same call differently.
        </button>
      )}

      <div className="space-y-7">
        {sections.map((section) => (
          <section key={section.heading}>
            <h3 className="mb-3 text-[20px] font-semibold text-fg">{section.heading}</h3>
            {section.blocks.map((block, i) =>
              block.kind === "para" ? (
                <p key={i} className="text-[15px] leading-relaxed text-fg/90">
                  {block.text}
                </p>
              ) : (
                <ul key={i} className="mt-2 space-y-2">
                  {block.items.map((item, j) => (
                    <li
                      key={j}
                      className="relative pl-5 text-[15px] leading-relaxed text-fg/90 before:absolute before:top-[9px] before:left-1 before:h-1 before:w-1 before:rounded-full before:bg-fg-muted"
                    >
                      {item.label && (
                        <strong className="font-semibold text-fg">{item.label}: </strong>
                      )}
                      {item.text}
                    </li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
