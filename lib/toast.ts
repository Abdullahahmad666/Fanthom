"use client";

import { useSyncExternalStore } from "react";

/** "info" is for things the prototype deliberately does not do -- neither a
    success nor a failure, so neither icon fits. */
export type ToastStatus = "loading" | "success" | "info" | "error";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  status: ToastStatus;
  /** 0-1 while loading; omit for an indeterminate bar. */
  progress?: number;
  /** ms before auto-dismiss. Loading toasts stay until updated. */
  duration?: number;
};

let toasts: Toast[] = [];
const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  toasts = [...toasts];
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const EMPTY: Toast[] = [];

export function useToasts(): Toast[] {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => EMPTY,
  );
}

function scheduleDismiss(id: string, duration: number) {
  clearTimeout(timers.get(id));
  timers.set(
    id,
    setTimeout(() => dismissToast(id), duration),
  );
}

/**
 * Stops the clock on a toast, and starts it again.
 *
 * A message that disappears while you are still reading it is a message you
 * did not receive, and the most common reason for lingering on one is that you
 * moved the pointer onto it. `remaining` is recomputed rather than reused, so
 * a toast that was hovered at two seconds gets the rest of its life back, not
 * a fresh full one.
 */
const deadlines = new Map<string, { at: number; duration: number }>();

export function holdToast(id: string) {
  const timer = timers.get(id);
  if (timer === undefined) return;
  clearTimeout(timer);
  timers.delete(id);
}

export function releaseToast(id: string) {
  const d = deadlines.get(id);
  if (!d || timers.has(id)) return;
  const left = Math.max(600, d.at - Date.now());
  scheduleDismiss(id, left);
}

export function pushToast(t: Omit<Toast, "id">): string {
  const id = `t-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  toasts.push({ ...t, id });
  emit();
  if (t.status !== "loading") {
    const duration = t.duration ?? 4000;
    deadlines.set(id, { at: Date.now() + duration, duration });
    scheduleDismiss(id, duration);
  }
  return id;
}

export function updateToast(id: string, patch: Partial<Omit<Toast, "id">>) {
  const i = toasts.findIndex((t) => t.id === id);
  if (i === -1) return;
  toasts[i] = { ...toasts[i], ...patch };
  emit();
  if (patch.status && patch.status !== "loading") {
    scheduleDismiss(id, patch.duration ?? toasts[i].duration ?? 4000);
  }
}

export function dismissToast(id: string) {
  clearTimeout(timers.get(id));
  timers.delete(id);
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}
