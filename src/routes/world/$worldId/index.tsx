import { createFileRoute, notFound } from "@tanstack/react-router";
import { WorldShell } from "@/components/WorldShell";
import { WORLDS, type WorldId } from "@/worlds/registry";

export const Route = createFileRoute("/world/$worldId/")({
  head: ({ params }) => {
    const world = WORLDS[params.worldId as WorldId];
    const title = world ? `${world.title} — Ambient Worlds` : "Ambient Worlds";
    return {
      meta: [
        { title },
        { name: "description", content: world?.subtitle ?? "An interactive ambient scene." },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    if (!WORLDS[params.worldId as WorldId]) {
      throw notFound();
    }
  },
  ssr: false,
  component: PublicWorldPage,
});

function PublicWorldPage() {
  const { worldId } = Route.useParams();
  return <WorldShell worldId={worldId as WorldId} roomId="public" />;
}
