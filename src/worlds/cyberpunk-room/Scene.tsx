import { useState } from "react";
import type { SceneProps } from "../registry";

const RAIN_DROPS = Array.from({ length: 55 }, (_, i) => ({
  left: `${(i * 1.83) % 100}%`,
  delay: `${(i * 0.11) % 3.5}s`,
  duration: `${0.5 + (i % 6) * 0.1}s`,
  opacity: 0.2 + (i % 4) * 0.1,
  height: `${8 + (i % 5) * 3}px`,
}));

export function CyberpunkRoomScene({ state, onInteract }: SceneProps) {
  const { neonOn = true, rainIntensity = 0.6, holoActive = true } = state;
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  let rippleId = 0;

  const addRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++rippleId;
    setRipples(r => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
  };

  return (
    <div
      className="world-scene animate-world-in"
      style={{ backgroundImage: "url('/worlds/cyberpunk-room.png')" }}
      onClick={addRipple}
    >
      {/* Night-time base darkening */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "rgba(0,0,0,0.35)",
      }} />

      {/* Neon glow overlay */}
      {neonOn && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: "radial-gradient(ellipse at 70% 30%, rgba(255,0,100,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(0,200,255,0.07) 0%, transparent 55%)",
          animationName: "pulse-glow", animationDuration: "3s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite",
        }} />
      )}

      {/* Holographic display shimmer */}
      {holoActive && (
        <div style={{
          position: "absolute", top: "10%", left: "55%", width: "32%", height: "45%",
          background: "linear-gradient(180deg, rgba(0,200,255,0.06) 0%, rgba(100,0,255,0.04) 100%)",
          border: "1px solid rgba(0,200,255,0.12)",
          borderRadius: "4px", pointerEvents: "none", zIndex: 3,
          animationName: "holo-flicker", animationDuration: "6s", animationTimingFunction: "ease", animationIterationCount: "infinite",
        }} />
      )}

      {/* Scan line effect */}
      {holoActive && (
        <div style={{
          position: "absolute", top: "10%", left: "55%", width: "32%", height: "2px",
          background: "rgba(0,200,255,0.2)", pointerEvents: "none", zIndex: 4,
          animationName: "scan-line", animationDuration: "3s", animationTimingFunction: "linear", animationIterationCount: "infinite",
          overflow: "hidden",
        }} />
      )}

      {/* Rain drops on window */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 4,
        opacity: rainIntensity, transition: "opacity 0.8s ease",
      }}>
        {RAIN_DROPS.map((drop, i) => (
          <div key={i} style={{
            position: "absolute", top: "-20px", left: drop.left,
            width: "1px", height: drop.height,
            background: `rgba(0,200,255,${drop.opacity})`,
            animationName: "rain-fall",
            animationDuration: drop.duration,
            animationDelay: drop.delay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }} />
        ))}
      </div>

      {/* Vignette */}
      <div className="world-vignette" style={{ zIndex: 5 }} />

      {/* Click ripples */}
      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute", left: r.x, top: r.y, zIndex: 6,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%", border: "1px solid rgba(0,200,255,0.4)",
          animationName: "ripple-out", animationDuration: "0.6s",
          animationTimingFunction: "ease-out", animationFillMode: "both",
          pointerEvents: "none",
        }} />
      ))}

      {/* Controls */}
      <div style={{
        position: "absolute", bottom: "2.5rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "8px", alignItems: "center", zIndex: 10,
      }}>
        <button
          className={`scene-ctrl${neonOn ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_LAMP" }); }}
        >
          <span style={{ color: neonOn ? "#ff0064" : undefined }}>◈</span>
          {neonOn ? "neon on" : "neon off"}
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "rgba(0,0,0,0.42)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,200,255,0.12)", borderRadius: "20px",
          padding: "5px 10px",
        }}>
          <span style={{ fontSize: "8px", color: "rgba(0,200,255,0.5)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>rain</span>
          <input
            type="range" min="0" max="1" step="0.05"
            value={rainIntensity}
            onClick={e => e.stopPropagation()}
            onChange={(e) => onInteract({ type: "SET_RAIN", intensity: parseFloat(e.target.value) })}
            style={{ width: "72px", accentColor: "#00c8ff", cursor: "pointer" }}
          />
        </div>

        <button
          className={`scene-ctrl${holoActive ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_WINDOW" }); }}
        >
          <span style={{ color: holoActive ? "#00c8ff" : undefined }}>⬡</span>
          {holoActive ? "holo on" : "holo off"}
        </button>
      </div>
    </div>
  );
}
