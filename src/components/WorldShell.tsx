import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { WORLDS, type WorldId } from "@/worlds/registry";
import { useWorldStore } from "@/store/worldStore";
import { usePresenceStore } from "@/store/presenceStore";
import { useWorldSocket } from "@/hooks/useWorldSocket";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { AudioGate } from "./AudioGate";
import { PresenceBar } from "./PresenceBar";
import { ShareButton } from "./ShareButton";
import { WorldNav } from "./WorldNav";

interface WorldShellProps {
  worldId: WorldId;
  roomId: string;
}

export function WorldShell({ worldId, roomId }: WorldShellProps) {
  const world = WORLDS[worldId];
  const worldState = useWorldStore((s) => s.worldState);
  const resetState = useWorldStore((s) => s.resetState);
  const peers = usePresenceStore((s) => s.peers);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const { dispatch } = useWorldSocket(worldId, roomId);
  const { setParam } = useAudioEngine(worldId, audioUnlocked);

  // Reset world state when world changes
  useEffect(() => {
    resetState(world.initialState);
  }, [worldId, world.initialState, resetState]);

  // Sync audio params when world state changes
  useEffect(() => {
    if (!audioUnlocked) return;
    if (worldId === "rainy-bedroom") {
      setParam("rainIntensity", worldState.rainIntensity ?? 0.6);
      setParam("windowOpen", worldState.windowOpen ?? false);
    } else if (worldId === "night-train") {
      setParam("trainSpeed", worldState.trainSpeed ?? 0.6);
    } else if (worldId === "cozy-cafe") {
      setParam("teaReady", worldState.teaReady ?? false);
      setParam("fanOn", worldState.fanOn ?? true);
      setParam("radioStatic", worldState.radioStatic ?? 0.3);
    }
  }, [worldState, audioUnlocked, worldId, setParam]);

  if (!world) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#e8e4dc" }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem" }}>world not found</span>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      {/* The scene */}
      <world.Scene state={worldState} onInteract={dispatch} />

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Audio gate overlay */}
      <AnimatePresence>
        {!audioUnlocked && (
          <AudioGate
            world={world}
            onUnlock={() => setAudioUnlocked(true)}
          />
        )}
      </AnimatePresence>

      {/* UI chrome - bottom bar */}
      <div
        className="world-ui animate-ui-in"
        style={{
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <WorldNav currentWorldId={worldId} />
        <PresenceBar />
        <ShareButton worldId={worldId} roomId={roomId} />
      </div>

      {/* World title watermark */}
      <div
        className="world-ui"
        style={{
          top: "1.5rem",
          left: "1.5rem",
          pointerEvents: "none",
        }}
      >
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "0.95rem",
          fontStyle: "italic",
          color: world.accent,
          opacity: 0.6,
          letterSpacing: "0.02em",
        }}>
          {world.title}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.15em",
          color: "rgba(232,228,220,0.3)",
          textTransform: "uppercase",
          marginTop: "2px",
        }}>
          {world.subtitle}
        </div>
      </div>

      {/* Peer count badge (top right) */}
      {peers.length > 0 && (
        <div
          className="world-ui"
          style={{ top: "1.5rem", right: "1.5rem" }}
        >
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "rgba(232,228,220,0.3)",
            textTransform: "uppercase",
          }}>
            {peers.length === 1 ? "1 other here" : `${peers.length} others here`}
          </div>
        </div>
      )}
    </div>
  );
}
