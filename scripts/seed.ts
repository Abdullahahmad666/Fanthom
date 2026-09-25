/**
 * Ports the authored fixtures into Postgres, once.
 *
 * This is the moment the fixtures stop being the app's data and become its
 * seed input. Nothing in `app/` or `components/` imports them after this;
 * they exist so a fresh database has something real in it, the same way any
 * product ships a demo workspace.
 *
 * Run:  npx tsx scripts/seed.ts <user-email>
 *
 * Needs SUPABASE_SERVICE_ROLE_KEY, because it writes rows on behalf of a user
 * and row level security would otherwise -- correctly -- refuse.
 */

import { createClient } from "@supabase/supabase-js";
import { MEETINGS } from "../lib/fixtures";
import type { Meeting } from "../lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is not set.");
if (!serviceKey) {
  fail(
    "SUPABASE_SERVICE_ROLE_KEY is not set.\n" +
      "  Supabase dashboard -> Project Settings -> API -> service_role.\n" +
      "  It bypasses row level security, so keep it out of the browser.",
  );
}

const email = process.argv[2];
if (!email) fail("Usage: npx tsx scripts/seed.ts <user-email>");

const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The fixture's speaker ids are keys; the database stores display names. */
function nameFor(meeting: Meeting, speakerId: string) {
  return meeting.participants.find((p) => p.id === speakerId)?.name ?? speakerId;
}

async function findUser(): Promise<string> {
  const { data, error } = await db.auth.admin.listUsers({ perPage: 200 });
  if (error) fail(`Could not list users: ${error.message}`);

  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    fail(
      `No user with email ${email}.\n` +
        `  Sign in to the app once first so the account exists, then re-run.`,
    );
  }
  return user.id;
}

async function seedMeeting(userId: string, m: Meeting) {
  const slug = slugify(m.id || m.title);

  /* Replace rather than merge: re-running the seed should produce the same
     database, not a second copy of everything. Children cascade. */
  await db.from("meetings").delete().eq("user_id", userId).eq("slug", slug);

  const { data: inserted, error } = await db
    .from("meetings")
    .insert({
      user_id: userId,
      slug,
      title: m.title,
      meeting_date: m.date,
      start_time: m.startTime,
      meeting_code: m.meetingCode,
      platform: m.platform,
      duration_sec: m.durationSec,
      poster_from: m.poster[0],
      poster_to: m.poster[1],
      source: "seed",
    })
    .select("id")
    .single();

  if (error || !inserted) fail(`Insert failed for "${m.title}": ${error?.message}`);
  const meetingId = inserted.id;

  await db.from("participants").insert(
    m.participants.map((p) => ({
      meeting_id: meetingId,
      name: p.name,
      email: p.email ?? null,
      role_title: p.role,
      company: p.company,
      color: p.color,
      is_owner: p.isOwner ?? false,
    })),
  );

  await db.from("transcript_turns").insert(
    m.transcript.map((t) => ({
      meeting_id: meetingId,
      speaker_name: nameFor(m, t.speakerId),
      t_sec: t.tSec,
      sentences: t.sentences,
      /* Mirrored as plain text so Postgres can index it for search. */
      text_content: t.sentences.map((s) => s.text).join(" "),
    })),
  );

  const summaryRows = Object.entries(m.summaries).map(([template, sections]) => ({
    meeting_id: meetingId,
    template,
    sections,
  }));
  if (summaryRows.length) await db.from("summaries").insert(summaryRows);

  if (m.actionItems.length) {
    await db.from("action_items").insert(
      m.actionItems.map((a) => ({
        meeting_id: meetingId,
        text: a.text,
        owner_name: nameFor(m, a.ownerId),
        t_sec: a.tSec,
        done: a.done,
        manual: a.manual ?? false,
      })),
    );
  }

  if (m.highlights.length) {
    await db.from("highlights").insert(
      m.highlights.map((h) => ({
        meeting_id: meetingId,
        kind: h.kind,
        t_sec: h.tSec,
        end_sec: h.endSec ?? null,
        note: h.note,
        created_by: nameFor(m, h.createdBy),
      })),
    );
  }

  return {
    slug,
    turns: m.transcript.length,
    templates: summaryRows.length,
    actions: m.actionItems.length,
    highlights: m.highlights.length,
  };
}

async function main() {
  const userId = await findUser();
  console.log(`\n  Seeding ${MEETINGS.length} meetings for ${email}\n`);

  for (const m of MEETINGS) {
    const r = await seedMeeting(userId, m);
    console.log(
      `   ${r.slug.padEnd(28)} ${String(r.turns).padStart(3)} turns · ` +
        `${r.templates} templates · ${r.actions} actions · ${r.highlights} highlights`,
    );
  }

  const { count } = await db
    .from("meetings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  console.log(`\n  Done. ${count} meetings in the database.\n`);
}

main().catch((e) => fail(e instanceof Error ? e.message : String(e)));
