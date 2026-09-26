"use client";

import { useSyncExternalStore } from "react";
import { createClient } from "@/backend/src/supabase/client";

/**
 * Who is signed in, for client components.
 *
 * A module-level store rather than per-component state: several parts of the
 * chrome want the same answer, and every one of them subscribing to Supabase
 * separately would mean several listeners and several first-render flickers
 * for one fact.
 *
 * Read through useSyncExternalStore because that is what this is -- state
 * owned outside React, changing on its own when a session is refreshed or
 * revoked in another tab. It also keeps the server render honest: the server
 * snapshot is "nobody", which is true there, so nothing claims an identity
 * before the session has actually been read.
 */

export type Account = { email: string; name: string | null } | null;

let current: Account = null;
let started = false;
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
const getServerSnapshot = (): Account => null;

export function useAccount(): Account {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
