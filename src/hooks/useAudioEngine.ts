import { useEffect, useRef } from "react";
import type { WorldId, WorldAudioEngine } from "@/worlds/registry";
import { WORLDS } from "@/worlds/registry";

export function useAudioEngine(worldId: WorldId, unlocked: boolean, ambientVolume = 0.8) {
  const engineRef = useRef<WorldAudioEngine | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const currentWorldRef = useRef<WorldId | null>(null);

  useEffect(() => {
    if (!unlocked) return;

    // Tear down previous world's audio if world changed
    if (currentWorldRef.current !== worldId && engineRef.current) {
      engineRef.current.stop();
      engineRef.current = null;
      ctxRef.current?.close();
      ctxRef.current = null;
    }

    if (!engineRef.current) {
      ctxRef.current = new AudioContext();
      currentWorldRef.current = worldId;
      const world = WORLDS[worldId];
      engineRef.current = world.getAudio();
      engineRef.current.start(ctxRef.current);
      engineRef.current.setParam("ambientVolume", ambientVolume);
    }
  }, [worldId, unlocked]);

  // Keep ambient volume in sync without re-creating engine
  useEffect(() => {
    if (engineRef.current && ctxRef.current) {
      engineRef.current.setParam("ambientVolume", ambientVolume);
    }
  }, [ambientVolume]);

  // Full teardown on unmount
  useEffect(() => {
    return () => {
      engineRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  return {
    setParam: (key: string, value: number | boolean) => {
      engineRef.current?.setParam(key, value);
    },
  };
}
