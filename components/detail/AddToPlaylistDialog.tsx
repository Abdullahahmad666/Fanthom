"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ListPlus, Plus, X } from "lucide-react";
import {
  addToPlaylist,
  createPlaylist,
  usePlaylists,
  type PlaylistItem,
} from "@/lib/playlists";

/**
 * Picker for "Add to Playlist". Portalled for the same reason as the share
 * dialog -- the detail page's animated wrapper would otherwise capture a
 * fixed-position child.
 */
export function AddToPlaylistDialog({
  item,
  onClose,
}: {
  item: Omit<PlaylistItem, "id" | "addedAt">;
  onClose: () => void;
}) {
  const playlists = usePlaylists();
  const [name, setName] = useState("");
  const [addedTo, setAddedTo] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const add = (playlistId: string) => {
    addToPlaylist(playlistId, item);
    setAddedTo(playlistId);
    setTimeout(onClose, 700);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    add(createPlaylist(name).id);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add to playlist"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-[460px] flex-col overflow-hidden rounded-xl bg-raised"
      >
        <div className="flex shrink-0 items-center justify-between px-6 pt-5 pb-3">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold text-fg">
            <ListPlus className="h-5 w-5 text-brand" /> Add to playlist
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-fg-muted transition-colors hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="shrink-0 truncate px-6 pb-4 text-[13px] text-fg-muted">{item.note}</p>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          <ul className="space-y-2">
            {playlists.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => add(p.id)}
                  className="flex w-full items-center gap-3 rounded-lg bg-surface px-4 py-3 text-left transition-colors hover:bg-[#2d2c31]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-fg">
                      {p.name}
                    </span>
                    <span className="block text-[12px] text-fg-muted">
                      {p.items.length} {p.items.length === 1 ? "highlight" : "highlights"}
                    </span>
                  </span>
                  {addedTo === p.id && <Check className="h-4 w-4 shrink-0 text-success" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="shrink-0 bg-modalfoot px-6 py-4">
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New playlist name"
              aria-label="New playlist name"
              className="h-10 flex-1 rounded-lg bg-[#2d2c31] px-3 text-[14px] text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-1.5 rounded-lg border border-brand px-4 text-[13px] font-semibold text-brand transition-colors hover:bg-brand/10 disabled:border-line disabled:text-fg-dim"
            >
              <Plus className="h-4 w-4" /> Create
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
