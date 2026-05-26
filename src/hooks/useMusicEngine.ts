import { useEffect, useRef } from "react";
import { createMusicEngine, type MusicEngine } from "@/music/engine";
import type { WorldId } from "@/worlds/registry";

export function useMusicEngine(worldId: WorldId, ctx: AudioContext | null, playing: boolean, volume: number) {
  const engineRef = useRef<MusicEngine | null>(null);
  const prevWorldRef = useRef<WorldId | null>(null);

  useEffect(() => {
    if (!ctx || !playing) {
      engineRef.current?.stop();
      engineRef.current = null;
      return;
    }

    // Stop old engine if world changed
    if (prevWorldRef.current !== worldId && engineRef.current) {
      engineRef.current.stop();
      engineRef.current = null;
    }

    if (!engineRef.current) {
      prevWorldRef.current = worldId;
      engineRef.current = createMusicEngine(worldId);
      engineRef.current.start(ctx, ctx.destination);
      engineRef.current.setVolume(volume);
    }
  }, [worldId, ctx, playing]);

  useEffect(() => {
    engineRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    return () => {
      engineRef.current?.stop();
    };
  }, []);
}
