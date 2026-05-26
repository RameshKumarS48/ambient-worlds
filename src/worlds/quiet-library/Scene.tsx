import { useState } from "react";
import type { SceneProps } from "../registry";

const DUST_MOTES = Array.from({ length: 18 }, (_, i) => ({
  left: `${15 + (i * 5.1) % 70}%`,
  top: `${10 + (i * 7.3) % 60}%`,
  delay: `${(i * 0.8) % 8}s`,
  duration: `${5 + (i % 4) * 1.5}s`,
  size: `${1 + (i % 3)}px`,
  opacity: 0.15 + (i % 4) * 0.07,
}));

export function QuietLibraryScene({ state, onInteract }: SceneProps) {
  const { lampDim = false, windowOpen = false } = state;
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
      style={{ backgroundImage: "url('/worlds/quiet-library.png')" }}
      onClick={addRipple}
    >
      {/* Warm lamp overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: lampDim
          ? "rgba(0,0,0,0.6)"
          : "rgba(20,10,0,0.28)",
        transition: "background 1.5s ease",
        zIndex: 1,
      }} />

      {/* Lamp glow pools */}
      {!lampDim && (
        <>
          <div style={{
            position: "absolute", bottom: "20%", left: "18%",
            width: "280px", height: "220px",
            background: "radial-gradient(ellipse at 40% 90%, rgba(255,180,60,0.16) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 2,
          }} />
          <div style={{
            position: "absolute", bottom: "20%", right: "14%",
            width: "200px", height: "180px",
            background: "radial-gradient(ellipse at 60% 90%, rgba(255,160,40,0.12) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 2,
          }} />
        </>
      )}

      {/* Window light shaft — when open */}
      {windowOpen && (
        <div style={{
          position: "absolute", top: 0, left: "60%",
          width: "140px", height: "70%",
          background: "linear-gradient(180deg, rgba(200,220,255,0.08) 0%, transparent 100%)",
          pointerEvents: "none", zIndex: 2,
          clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
        }} />
      )}

      {/* Floating dust motes */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>
        {DUST_MOTES.map((m, i) => (
          <div key={i} style={{
            position: "absolute", left: m.left, top: m.top,
            width: m.size, height: m.size, borderRadius: "50%",
            background: "rgba(255,240,180,0.6)",
            opacity: m.opacity,
            animationName: "float-up",
            animationDuration: m.duration,
            animationDelay: m.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
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
          borderRadius: "50%", border: "1px solid rgba(255,220,120,0.3)",
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
          className={`scene-ctrl${lampDim ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_LAMP" }); }}
        >
          <span>{lampDim ? "◐" : "☀"}</span>
          {lampDim ? "lamp off" : "lamp on"}
        </button>
        <button
          className={`scene-ctrl${windowOpen ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_WINDOW" }); }}
        >
          <span>{windowOpen ? "⊡" : "⊟"}</span>
          {windowOpen ? "blinds open" : "blinds shut"}
        </button>
      </div>
    </div>
  );
}
