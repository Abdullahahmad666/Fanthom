"use client";

import { useSyncExternalStore } from "react";

export type PlaylistItem = {
  id: string;
  meetingId: string;
  meetingTitle: string;
  /** Source annotation, when the item came from one. */
  highlightId?: string;
  kind: string;
  note: string;
  tSec: number;
  endSec?: number;
  addedAt: number;
};

export type Playlist = {
  id: string;
  name: string;
  items: PlaylistItem[];
  updatedAt: number;
};

const KEY = "fathom.playlists";

/**
 * Playlists, persisted to localStorage.
 *
 * Real state rather than a stub: adding a highlight from a meeting shows up on
 * /playlists and survives a reload. There is no server, so it is per-browser --
 * the shape is deliberately close to what an API would return, so swapping in
 * a backend later is a change of transport, not of model.
 */
const SEED: Playlist[] = [
  {
    id: "pl-onboarding",
    name: "Onboarding moments",
    items: [],
    updatedAt: Date.now(),
  },
];

let cache: Playlist[] | null = null;
const listeners = new Set<() => void>();

function read(): Playlist[] {
  if (cache) return cache;
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Playlist[]) : SEED;
  } catch {
    cache = SEED;
  }
  return cache!;
}

function write(next: Playlist[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode or full quota -- state still lives in memory for the session */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Subscribe to the playlist collection. */
export function usePlaylists(): Playlist[] {
  return useSyncExternalStore(subscribe, read, () => SEED);
}

export function createPlaylist(name: string): Playlist {
  const playlist: Playlist = {
    id: `pl-${Date.now()}`,
    name: name.trim() || "Untitled playlist",
    items: [],
    updatedAt: Date.now(),
  };
  write([...read(), playlist]);
  return playlist;
}

export function addToPlaylist(playlistId: string, item: Omit<PlaylistItem, "id" | "addedAt">) {
  write(
    read().map((p) =>
      p.id !== playlistId
        ? p
        : {
            ...p,
            updatedAt: Date.now(),
            items: p.items.some(
              (existing) =>
                existing.meetingId === item.meetingId && existing.tSec === item.tSec,
            )
              ? p.items
              : [...p.items, { ...item, id: `it-${Date.now()}`, addedAt: Date.now() }],
          },
    ),
  );
}

export function removeFromPlaylist(playlistId: string, itemId: string) {
  write(
    read().map((p) =>
      p.id !== playlistId
        ? p
        : { ...p, updatedAt: Date.now(), items: p.items.filter((i) => i.id !== itemId) },
    ),
  );
}

export function deletePlaylist(playlistId: string) {
  write(read().filter((p) => p.id !== playlistId));
}

/** Total runtime of a playlist, for the "N highlights (M min)" line. */
export function playlistDuration(p: Playlist): number {
  return p.items.reduce((total, i) => total + ((i.endSec ?? i.tSec + 30) - i.tSec), 0);
}
