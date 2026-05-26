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
        background: "rgba(0,0,0,0.62)",
        backdropFilter: "blur(16px)",
        borderRadius: "20px",
        border: playing
          ? "1px solid rgba(255,255,255,0.22)"
          : "1px solid rgba(255,255,255,0.18)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
      }}
    >
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px" }}>
        {/* Play/stop button */}
        <button
          onClick={onTogglePlay}
          style={{
            width: "30px", height: "30px", borderRadius: "50%",
            background: playing ? "rgba(232,228,220,0.18)" : "rgba(255,255,255,0.08)",
            border: playing ? "1px solid rgba(232,228,220,0.35)" : "1px solid rgba(255,255,255,0.18)",
            color: playing ? "#e8e4dc" : "rgba(232,228,220,0.75)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", flexShrink: 0,
            transition: "all 0.2s",
          }}
          title={playing ? "Stop music" : "Play music"}
        >
          {playing ? "⏹" : "▶"}
        </button>

        {/* Label / status */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.1em",
            color: playing ? "rgba(232,228,220,0.9)" : "rgba(232,228,220,0.65)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {playing ? `♪ ${label}` : "music off"}
        </div>

        {/* Expand chevron */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(232,228,220,0.5)", fontSize: "9px",
            padding: "0 2px", lineHeight: 1, flexShrink: 0,
          }}
          title="Mix controls"
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Expanded mixer */}
      {expanded && (
        <div style={{
          padding: "4px 12px 10px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <VolumeRow
              label="music"
              value={musicVolume}
              onChange={onMusicVolume}
              color="#7ab3d4"
              disabled={!playing}
            />
            <VolumeRow
              label="sound"
              value={ambientVolume}
              onChange={onAmbientVolume}
              color="#d4943a"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function VolumeRow({ label, value, onChange, color, disabled = false }: {
  label: string; value: number; onChange: (v: number) => void; color: string; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: disabled ? "rgba(232,228,220,0.25)" : "rgba(232,228,220,0.55)",
        width: "36px", flexShrink: 0,
      }}>{label}</span>
      <input
        type="range" min="0" max="1" step="0.05" value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: "80px", accentColor: color, cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.35 : 1,
        }}
      />
      <button
        disabled={disabled}
        onClick={() => onChange(value > 0 ? 0 : 0.6)}
        style={{
          background: "none", border: "none",
          cursor: disabled ? "default" : "pointer",
          color: disabled ? "rgba(232,228,220,0.2)" : value > 0 ? "rgba(232,228,220,0.7)" : "rgba(232,228,220,0.3)",
          fontSize: "11px", padding: 0, lineHeight: 1,
        }}
        title={value > 0 ? "Mute" : "Unmute"}
      >
        {value > 0 ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
