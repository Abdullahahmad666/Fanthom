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

export function pushToast(t: Omit<Toast, "id">): string {
  const id = `t-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  toasts.push({ ...t, id });
  emit();
  if (t.status !== "loading") scheduleDismiss(id, t.duration ?? 4000);
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
