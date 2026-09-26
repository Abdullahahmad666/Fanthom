import { ListLayout } from "@/components/layout/ListLayout";
import { PlaylistsView } from "@/components/calls/PlaylistsView";

export const metadata = {
  /* Behind the sign-in gate: per-account, and a crawler only ever sees
     the login redirect. */
  robots: { index: false, follow: false },
  title: "Playlists",
  description: "Highlights collected from across your calls.",
};

export default function PlaylistsPage() {
  return (
    <ListLayout>
      <PlaylistsView />
    </ListLayout>
  );
}
