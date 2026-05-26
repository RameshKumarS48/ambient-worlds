import { useState } from "react";
import { getMusicLabel } from "@/music/engine";
import type { WorldId } from "@/worlds/registry";

interface MusicPlayerProps {
  worldId: WorldId;
  musicVolume: number;
  ambientVolume: number;
  playing: boolean;
  onTogglePlay: () => void;
  onMusicVolume: (v: number) => void;
  onAmbientVolume: (v: number) => void;
}

export function MusicPlayer({
  worldId, musicVolume, ambientVolume, playing,
  onTogglePlay, onMusicVolume, onAmbientVolume,
}: MusicPlayerProps) {
  const [expanded, setExpanded] = useState(false);
  const label = getMusicLabel(worldId);

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(16px)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        minWidth: expanded ? "220px" : "auto",
      }}
    >
      {/* Collapsed bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 12px" }}>
        {/* Play/pause */}
        <button
          onClick={onTogglePlay}
          style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: playing ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#e8e4dc", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", flexShrink: 0, transition: "all 0.2s",
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>

        {/* Track label */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.1em",
            color: playing ? "rgba(232,228,220,0.6)" : "rgba(232,228,220,0.3)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {playing ? `♪ ${label}` : "music off"}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(232,228,220,0.3)", fontSize: "8px",
            padding: "0 2px", lineHeight: 1,
          }}
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Expanded mixer */}
      {expanded && (
        <div style={{ padding: "4px 12px 10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <VolumeRow label="music" value={musicVolume} onChange={onMusicVolume} color="#7ab3d4" />
            <VolumeRow label="sound" value={ambientVolume} onChange={onAmbientVolume} color="#d4943a" />
          </div>
        </div>
      )}
    </div>
  );
}

function VolumeRow({ label, value, onChange, color }: {
  label: string; value: number; onChange: (v: number) => void; color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "7px",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "rgba(232,228,220,0.4)", width: "36px",
      }}>{label}</span>
      <input
        type="range" min="0" max="1" step="0.05" value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "80px", accentColor: color, cursor: "pointer" }}
      />
      <button
        onClick={() => onChange(value > 0 ? 0 : 0.6)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: value > 0 ? "rgba(232,228,220,0.5)" : "rgba(232,228,220,0.2)",
          fontSize: "10px", padding: 0,
        }}
      >
        {value > 0 ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
