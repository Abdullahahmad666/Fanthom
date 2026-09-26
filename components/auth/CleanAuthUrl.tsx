"use client";

import { useEffect } from "react";
import { pushToast } from "@/lib/toast";

/**
 * Takes the authentication debris out of the address bar.
 *
 * After a provider round trip the URL can be carrying a one-time code, an
 * access and refresh token in the fragment, or a provider error with its full
 * description. Supabase reads what it needs the moment the page loads, and
 * after that none of it should still be on screen: a URL is copied into chat
 * messages, kept in history, read over a shoulder and written into server logs
 * by anything the link passes through.
 *
 * It runs on every page rather than only on the callback, because the debris
 * does not always arrive there. If the provider is pointed at an origin whose
 * callback is not listening -- an older deployment, or a redirect allowlist
 * that has not been updated -- the browser lands on some other page of the
 * site still carrying all of it.
 *
 * `replaceState` rather than a navigation: this must not add a history entry,
 * or Back would take the visitor to the URL that was just cleaned.
 */

/** Query parameters that belong to an auth handshake, not to a page. */
const NOISY = [
  "code",
  "error",
  "error_code",
  "error_description",
  "access_token",
  "refresh_token",
  "provider_token",
  "provider_refresh_token",
  "token_type",
  "expires_in",
  "expires_at",
  "guest",
];

/** Human wording for the provider errors worth explaining. */
function explain(code: string | null, description: string | null): string | null {
  const text = `${code ?? ""} ${description ?? ""}`.toLowerCase();
  if (!text.trim()) return null;
  if (text.includes("access_denied") || text.includes("cancel")) {
    return "Sign-in was cancelled.";
  }
  if (text.includes("expired")) {
    return "That sign-in link has expired. Ask for a new one.";
  }
  if (text.includes("invalid_request") || text.includes("redirect")) {
    return "Sign-in could not complete because this address is not an approved redirect for the project.";
  }
  return "Sign-in could not be completed.";
}

export function CleanAuthUrl() {
  useEffect(() => {
    const url = new URL(window.location.href);

    const hash = new URLSearchParams(
      url.hash.startsWith("#") ? url.hash.slice(1) : url.hash,
    );

    const hasQuery = NOISY.some((k) => url.searchParams.has(k));
    const hasHash = NOISY.some((k) => hash.has(k));
    if (!hasQuery && !hasHash) return;

    /* Say what happened before the evidence is removed, otherwise a failed
       sign-in becomes a page that silently did nothing. */
    const message = explain(
      url.searchParams.get("error_code") ?? url.searchParams.get("error"),
      url.searchParams.get("error_description") ?? hash.get("error_description"),
    );
    if (message) {
      pushToast({ title: "Sign-in", description: message, status: "error", duration: 6000 });
    }

    NOISY.forEach((k) => url.searchParams.delete(k));
    const cleanedHash = hasHash ? "" : url.hash;

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams}` : ""}${cleanedHash}`,
    );
  }, []);

  return null;
}
