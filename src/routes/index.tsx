import { createFileRoute } from "@tanstack/react-router";
import { LandingPortal } from "@/components/LandingPortal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ambient Worlds" },
      { name: "description", content: "Drop into tiny living scenes. Interactive ambient worlds you can share." },
      { property: "og:title", content: "Ambient Worlds" },
      { property: "og:description", content: "Drop into a rainy bedroom, a night train, or a cozy café. Interactive ambient scenes with sound." },
      { property: "og:type", content: "website" },
    ],
  }),
  ssr: false,
  component: LandingPortal,
});
