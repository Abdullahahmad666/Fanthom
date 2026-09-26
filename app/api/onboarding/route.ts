import { NextResponse } from "next/server";
import { saveOnboarding, type OnboardingPatch } from "@/backend/src/services/onboarding";

const ALLOWED = ["full_name", "transcript_source", "onboarded_at"] as const;

/**
 * Persists one onboarding answer.
 *
 * The allow-list matters: the body is client-controlled, and `profiles` is the
 * table the session's own RLS policy lets that session update. Without it, a
 * crafted request could write any column on the row -- RLS decides *whose*
 * row, never *which fields* of it.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  const patch: OnboardingPatch = {};
  for (const key of ALLOWED) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) {
      patch[key] = value.trim() as never;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, reason: "nothing-to-save" }, { status: 400 });
  }

  const result = await saveOnboarding(patch);
  return NextResponse.json(result);
}
