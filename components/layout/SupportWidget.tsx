"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, CreditCard, FileText, Folder,
  Maximize2, Megaphone, MessageSquare, Minimize2, MonitorSmartphone, Phone, Puzzle,
  Search, Send, Settings as SettingsIcon, SquarePen, Star,
} from "lucide-react";
import { CueMark } from "@/components/brand/CueMark";

/**
 * The Cue Support widget, opened from Help & Feedback.
 *
 * Light on a dark app, which is how the product ships it -- it is a support
 * surface bolted onto the page rather than part of it, and the contrast is
 * what says so.
 *
 * Two tabs. Conversation runs a real thread: pick an intent, the bot answers,
 * and the composer opens. Help centre browses real categories into real
 * article lists and the search filters both. None of it reaches a support
 * queue, and the bot says so when you send -- better than a form that
 * silently drops what you typed.
 */

type Msg = { from: "bot" | "me"; text: string };

const GREETING: Msg = { from: "bot", text: "Hey there 👋 How can we help you today?" };

const INTENTS = [
  {
    label: "🤖 Ask AI - INSTANT",
    reply:
      "Ask me anything about Cue — recording modes, sharing, integrations or billing. I answer from the help centre.",
  },
  {
    label: "✉️ Open a Ticket - <1 biz day",
    reply:
      "Happy to help. Describe what went wrong and I'll open a ticket — we reply within one business day.",
  },
  {
    label: "💡 Share Feedback",
    reply: "Love to hear it. What would you change about Cue?",
  },
];

const SENT_REPLY =
  "Thanks — this is a prototype, so nothing reaches a real support queue. In the product this would land with the team.";

type Category = {
  name: string;
  Icon: typeof Star;
  articles: string[];
};

const CATEGORIES: Category[] = [
  {
    name: "Product Updates",
    Icon: Megaphone,
    articles: ["What's new in Cue", "Bot-free capture is here", "Ask Cue across meetings"],
  },
  {
    name: "Getting Started",
    Icon: Star,
    articles: [
      "Connecting your calendar",
      "Your first recorded call",
      "Understanding the meeting recap",
      "Inviting your team",
      "Keyboard shortcuts",
    ],
  },
  {
    name: "Settings",
    Icon: SettingsIcon,
    articles: [
      "Auto-record and auto-share rules",
      "Choosing a default summary template",
      "Renaming your notetaker",
      "Recording consent and banners",
    ],
  },
  {
    name: "Using Cue on a Call",
    Icon: Phone,
    articles: ["Highlighting a moment live", "Switching capture mode mid-call"],
  },
  {
    name: "Using Cue After a Call",
    Icon: MonitorSmartphone,
    articles: [
      "Editing a summary",
      "Sharing a clip instead of the whole call",
      "Downloading a recording",
      "Building a playlist",
    ],
  },
  {
    name: "Integrations",
    Icon: Puzzle,
    articles: ["Syncing to HubSpot", "Syncing to Salesforce", "Sending highlights to Slack"],
  },
  {
    name: "Teams Pricing Plans",
    Icon: Folder,
    articles: ["What Team Edition includes", "Seats and billing", "Starting a 14-day trial"],
  },
  {
    name: "Billing & Account",
    Icon: CreditCard,
    articles: ["Updating your card", "Cancelling a plan", "Deleting your account"],
  },
];

/** The product shows a count, not the list, on the category row. */
const COUNTS: Record<string, number> = {
  "Product Updates": 3,
  "Getting Started": 23,
  Settings: 18,
  "Using Cue on a Call": 2,
  "Using Cue After a Call": 16,
  Integrations: 12,
  "Teams Pricing Plans": 32,
  "Billing & Account": 9,
};

export function SupportWidget({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"conversation" | "help">("conversation");
  const [expanded, setExpanded] = useState(false);
  const [thread, setThread] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [topic, setTopic] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  /* Only the greeting means no intent has been picked, so the options are
     still the only thing to do. */
  const fresh = thread.length === 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Follow the conversation as it grows. */
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [thread]);

  const say = (mine: string, reply: string) => {
    setThread((t) => [...t, { from: "me", text: mine }]);
    setTimeout(() => setThread((t) => [...t, { from: "bot", text: reply }]), 650);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    say(text, SENT_REPLY);
  };

  const restart = () => {
    setThread([GREETING]);
    setDraft("");
    setTab("conversation");
  };

  const q = query.trim().toLowerCase();
  const results = q
    ? CATEGORIES.map((c) => ({
        ...c,
        articles: c.articles.filter((a) => a.toLowerCase().includes(q)),
      })).filter((c) => c.name.toLowerCase().includes(q) || c.articles.length > 0)
    : CATEGORIES;

  if (typeof document === "undefined") return null;

  return createPortal(
    <aside
      aria-label="Cue Support"
      style={{ top: "calc(var(--topbar-h) + 12px)" }}
      className={`fixed right-5 bottom-5 z-[250] flex flex-col overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] ${
        expanded ? "w-[520px]" : "w-[380px]"
      } max-h-[760px]`}
    >
      <header className="flex items-start gap-3 px-5 pt-5 pb-4">
        <CueMark className="mt-0.5 h-5 w-6 text-[#4ba3f0]" />
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-bold">Cue Support</p>
          <p className="text-[14px] text-neutral-500">We&apos;re here to help!</p>
        </div>

        {tab === "conversation" && !fresh && (
          <IconButton label="New conversation" onClick={restart}>
            <SquarePen className="h-5 w-5" />
          </IconButton>
        )}
        <IconButton
          label={expanded ? "Shrink" : "Expand"}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </IconButton>
        <IconButton label="Close support" onClick={onClose}>
          <ChevronDown className="h-5 w-5" />
        </IconButton>
      </header>

      {tab === "help" && <div className="h-px bg-neutral-200" />}

      <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        {tab === "conversation" ? (
          <Conversation thread={thread} fresh={fresh} onPick={say} />
        ) : topic ? (
          <ArticleList topic={topic} onBack={() => setTopic(null)} />
        ) : (
          <HelpCenter
            query={query}
            onQuery={setQuery}
            categories={results}
            onOpen={setTopic}
          />
        )}
      </div>

      {tab === "conversation" && !fresh && (
        <div className="flex items-center gap-2 border-t border-neutral-200 px-4 py-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Write a message…"
            aria-label="Message support"
            className="min-w-0 flex-1 rounded-lg bg-neutral-100 px-3 py-2.5 text-[14px] focus:outline-none"
          />
          <button
            type="button"
            onClick={send}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4ba3f0] text-white transition-opacity hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="flex gap-2 border-t border-neutral-200 px-4 py-3">
        <FooterTab
          active={tab === "conversation"}
          onClick={() => setTab("conversation")}
          icon={<MessageSquare className="h-4 w-4" />}
        >
          Conversation
        </FooterTab>
        <FooterTab
          active={tab === "help"}
          onClick={() => {
            setTab("help");
            setTopic(null);
          }}
          icon={<BookOpen className="h-4 w-4" />}
        >
          Help center
        </FooterTab>
      </nav>
    </aside>,
    document.body,
  );
}

/* --------------------------------------------------------------- panels */

function Conversation({
  thread,
  fresh,
  onPick,
}: {
  thread: Msg[];
  fresh: boolean;
  onPick: (mine: string, reply: string) => void;
}) {
  return (
    <div className="pt-2">
      <p className="text-[14px] font-semibold text-neutral-500">Cue Support Bot</p>

      <div className="mt-2 space-y-3">
        {thread.map((m, i) =>
          m.from === "bot" ? (
            <p key={i} className="text-[16px] leading-snug">
              {m.text}
            </p>
          ) : (
            <p
              key={i}
              className="ml-auto w-fit max-w-[85%] rounded-xl bg-[#4ba3f0] px-3 py-2 text-[14px] text-white"
            >
              {m.text}
            </p>
          ),
        )}
      </div>

      {fresh && (
        <div className="mt-5 flex flex-col items-end gap-3">
          {INTENTS.map(({ label, reply }) => (
            <button
              key={label}
              type="button"
              onClick={() => onPick(label, reply)}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-[15px] transition-colors hover:bg-neutral-50"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function HelpCenter({
  query,
  onQuery,
  categories,
  onOpen,
}: {
  query: string;
  onQuery: (v: string) => void;
  categories: Category[];
  onOpen: (c: Category) => void;
}) {
  return (
    <div className="pt-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search"
          aria-label="Search the help centre"
          className="w-full rounded-lg bg-neutral-100 py-2.5 pr-3 pl-9 text-[15px] focus:outline-none"
        />
      </div>

      <p className="mt-5 text-[18px]">Help Center</p>

      <div className="mt-3 space-y-1">
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onOpen(c)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-neutral-100"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
              <c.Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-bold">{c.name}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[14px] text-neutral-500">
                <FileText className="h-3.5 w-3.5" />
                {COUNTS[c.name] ?? c.articles.length} articles
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
          </button>
        ))}

        {categories.length === 0 && (
          <p className="py-8 text-center text-[15px] text-neutral-500">
            Nothing matched that search.
          </p>
        )}
      </div>
    </div>
  );
}

function ArticleList({ topic, onBack }: { topic: Category; onBack: () => void }) {
  return (
    <div className="pt-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[14px] font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Help Center
      </button>

      <p className="mt-4 flex items-center gap-2 text-[18px] font-bold">
        <topic.Icon className="h-5 w-5" /> {topic.name}
      </p>

      <div className="mt-3 space-y-1">
        {topic.articles.map((a) => (
          <button
            key={a}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left text-[15px] transition-colors hover:bg-neutral-100"
          >
            <FileText className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="min-w-0 flex-1">{a}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
          </button>
        ))}
      </div>

      <p className="mt-6 text-[13px] leading-snug text-neutral-400">
        Article bodies are not part of this prototype — the help centre is here to show the
        shape of the support surface.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- parts */

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="shrink-0 rounded p-1 text-neutral-500 transition-colors hover:text-neutral-900"
    >
      {children}
    </button>
  );
}

function FooterTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active}
      className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[15px] font-semibold transition-colors ${
        active ? "bg-neutral-100" : "hover:bg-neutral-50"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
