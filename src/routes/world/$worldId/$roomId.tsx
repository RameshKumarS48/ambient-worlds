import { createFileRoute, notFound } from "@tanstack/react-router";
import { WorldShell } from "@/components/WorldShell";
import { WORLDS, type WorldId } from "@/worlds/registry";

export const Route = createFileRoute("/world/$worldId/$roomId")({
  head: ({ params }) => {
    const world = WORLDS[params.worldId as WorldId];
    const title = world ? `${world.title} · private — Ambient Worlds` : "Ambient Worlds";
    return {
      meta: [
        { title },
        { name: "description", content: world?.subtitle ?? "A private ambient scene room." },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    if (!WORLDS[params.worldId as WorldId]) {
      throw notFound();
    }
  },
  ssr: false,
  component: PrivateWorldPage,
});

function PrivateWorldPage() {
  const { worldId, roomId } = Route.useParams();
  return <WorldShell worldId={worldId as WorldId} roomId={roomId} />;
}
