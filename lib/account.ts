"use client";

import { useSyncExternalStore } from "react";
import { createClient } from "@/backend/src/supabase/client";

/**
 * Who is signed in, for client components.
 *
 * A module-level store rather than per-component state: several parts of the
 * chrome want the same answer, and each of them subscribing separately would
 * mean several listeners for one fact.
 *
 * The important part is `initial`. Reading the session in the browser costs a
 * round trip, during which this store says "nobody" -- so a header that relied
 * on it alone rendered "Sign in" to someone who was already signed in, and
 * clicking it in that window sent them to /login, which correctly bounced them
 * straight into the app. The answer looked like broken auth routing and was
 * really a header telling the truth a second too late.
 *
 * Server components already know the answer at render time, so they pass it
 * down and it seeds the store before the first paint. The subscription then
 * only exists to notice the session changing later -- signed out in another
 * tab, or a token that failed to refresh.
 */

export type Account = { email: string; name: string | null } | null;

let current: Account = null;
let started = false;
/** True once the browser has read the session for itself. */
let confirmed = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function start() {
  if (started) return;
  started = true;

  const supabase = createClient();
  if (!supabase) return;

  void supabase.auth.getUser().then(({ data }) => {
    const user = data.user;
    confirmed = true;
    current = user?.email
      ? {
          email: user.email,
          name: (user.user_metadata?.full_name as string | undefined) ?? null,
        }
      : null;
    emit();
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user;
    confirmed = true;
    current = user?.email
      ? {
          email: user.email,
          name: (user.user_metadata?.full_name as string | undefined) ?? null,
        }
      : null;
    emit();
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => current;

/**
 * Seeds the store from what the server already knew.
 *
 * Called during render rather than in an effect, on purpose: an effect runs
 * after the first paint, which is the exact window this exists to close. It is
 * idempotent and only ever writes before the browser has confirmed the session
 * for itself, so it cannot overwrite a fresher answer.
 */
export function seedAccount(account: Account) {
  if (confirmed) return;
  const same = current?.email === account?.email;
  if (same) return;
  current = account;
  emit();
}

export function useAccount(initial?: Account): Account {
  if (initial !== undefined) seedAccount(initial);
  return useSyncExternalStore(subscribe, getSnapshot, () => initial ?? null);
}
