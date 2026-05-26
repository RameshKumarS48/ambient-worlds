import { useState } from "react";
import type { SceneProps } from "../registry";

const RAIN_DROPS = Array.from({ length: 60 }, (_, i) => ({
  left: `${(i * 1.67) % 100}%`,
  delay: `${(i * 0.13) % 4}s`,
  duration: `${0.6 + (i % 5) * 0.12}s`,
  opacity: 0.3 + (i % 3) * 0.15,
  height: `${10 + (i % 6) * 3}px`,
}));

export function RainyTokyoScene({ state, onInteract }: SceneProps) {
  const { lampDim = false, rainIntensity = 0.6, windowOpen = false } = state;
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  let rippleId = 0;

  const addRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleId;
    setRipples(r => [...r, { x, y, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
  };

  return (
    <div
      className="world-scene animate-world-in"
      style={{ backgroundImage: "url('/worlds/rainy-tokyo.png')" }}
      onClick={addRipple}
    >
      {/* Darkening overlay — lamp dim */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: lampDim
          ? "rgba(0,0,0,0.55)"
          : "rgba(0,0,0,0.2)",
        transition: "background 1.2s ease",
        zIndex: 1,
      }} />

      {/* Lamp glow — warm pool of light */}
      {!lampDim && (
        <div style={{
          position: "absolute", bottom: "28%", right: "22%",
          width: "260px", height: "200px",
          background: "radial-gradient(ellipse at 50% 80%, rgba(255,200,100,0.18) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 2,
          transition: "opacity 1s ease",
        }} />
      )}

      {/* Rain drops layer */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        opacity: rainIntensity, zIndex: 3, pointerEvents: "none",
        transition: "opacity 0.8s ease",
      }}>
        {RAIN_DROPS.map((drop, i) => (
          <div key={i} style={{
            position: "absolute", top: "-20px", left: drop.left,
            width: "1px", height: drop.height,
            background: `rgba(180,210,255,${drop.opacity})`,
            animationName: "rain-fall",
            animationDuration: drop.duration,
            animationDelay: drop.delay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }} />
        ))}
      </div>

      {/* Window ripples on rain */}
      {windowOpen && (
        <div style={{
          position: "absolute", top: "15%", left: "10%", right: "10%", height: "55%",
          background: "rgba(120,160,220,0.04)", backdropFilter: "blur(0.5px)",
          zIndex: 4, pointerEvents: "none",
        }} />
      )}

      {/* Vignette */}
      <div className="world-vignette" style={{ zIndex: 5 }} />

      {/* Click ripples */}
      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute", left: r.x, top: r.y, zIndex: 6,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%", border: "1px solid rgba(180,210,255,0.4)",
          animationName: "ripple-out", animationDuration: "0.6s",
          animationTimingFunction: "ease-out", animationFillMode: "both",
          pointerEvents: "none",
        }} />
      ))}

      {/* Controls */}
      <div style={{
        position: "absolute", bottom: "2.5rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "8px", alignItems: "center",
        zIndex: 10,
      }}>
        <button
          className={`scene-ctrl${lampDim ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_LAMP" }); }}
        >
          <span>{lampDim ? "◐" : "☀"}</span>
          {lampDim ? "lights off" : "lights on"}
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "rgba(0,0,0,0.42)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px",
          padding: "5px 10px",
        }}>
          <span style={{ fontSize: "8px", color: "rgba(232,228,220,0.4)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>rain</span>
          <input
            type="range" min="0" max="1" step="0.05"
            value={rainIntensity}
            onClick={e => e.stopPropagation()}
            onChange={(e) => onInteract({ type: "SET_RAIN", intensity: parseFloat(e.target.value) })}
            style={{ width: "72px", accentColor: "#7ab3d4", cursor: "pointer" }}
          />
        </div>

        <button
          className={`scene-ctrl${windowOpen ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_WINDOW" }); }}
        >
          <span>{windowOpen ? "⊡" : "⊟"}</span>
          {windowOpen ? "window open" : "window shut"}
        </button>
      </div>
    </div>
  );
}
