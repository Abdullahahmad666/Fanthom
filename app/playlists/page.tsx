import { ListLayout } from "@/components/layout/ListLayout";
import { PlaylistsView } from "@/components/calls/PlaylistsView";

export const metadata = {
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
