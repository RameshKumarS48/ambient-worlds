import { useState } from "react";
import type { SceneProps } from "../registry";

const STARS = Array.from({ length: 80 }, (_, i) => ({
  left: `${(i * 1.26) % 100}%`,
  top: `${(i * 1.57) % 100}%`,
  delay: `${(i * 0.25) % 8}s`,
  duration: `${2 + (i % 6) * 0.8}s`,
  size: `${0.6 + (i % 4) * 0.4}px`,
  op: 0.2 + (i % 5) * 0.12,
}));

export function SpaceshipScene({ state, onInteract }: SceneProps) {
  const { lampDim = false, holoActive = true, windowOpen = false } = state;
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
      style={{ backgroundImage: "url('/worlds/spaceship.png')" }}
      onClick={addRipple}
    >
      {/* Dark space overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: lampDim ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.22)",
        transition: "background 1.4s ease",
      }} />

      {/* Stars through viewport */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: "absolute", left: s.left, top: s.top,
            width: s.size, height: s.size, borderRadius: "50%",
            background: `rgba(200,220,255,${s.op})`,
            animationName: "star-twinkle", animationDuration: s.duration,
            animationDelay: s.delay, animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }} />
        ))}
      </div>

      {/* Holographic display */}
      {holoActive && (
        <>
          <div style={{
            position: "absolute", top: "12%", left: "8%", width: "38%", height: "50%",
            border: "1px solid rgba(0,200,180,0.18)",
            background: "rgba(0,200,180,0.03)",
            borderRadius: "4px", pointerEvents: "none", zIndex: 3,
            animationName: "holo-flicker", animationDuration: "7s", animationTimingFunction: "ease", animationIterationCount: "infinite",
          }} />
          {/* Scan line */}
          <div style={{
            position: "absolute", top: "12%", left: "8%", width: "38%", height: "2px",
            background: "rgba(0,220,200,0.18)", pointerEvents: "none", zIndex: 4,
            animationName: "scan-line", animationDuration: "4s", animationTimingFunction: "linear", animationIterationCount: "infinite",
          }} />
          {/* HUD grid lines */}
          {[25, 50, 75].map((p) => (
            <div key={p} style={{
              position: "absolute", top: `${12 + (p / 100) * 50}%`, left: "8%", width: "38%", height: "1px",
              background: "rgba(0,200,180,0.06)", pointerEvents: "none", zIndex: 3,
            }} />
          ))}
        </>
      )}

      {/* Engine glow — bottom */}
      {!lampDim && (
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "60%", height: "120px", pointerEvents: "none", zIndex: 2,
          background: "radial-gradient(ellipse at 50% 100%, rgba(50,100,255,0.12) 0%, transparent 70%)",
          animationName: "pulse-glow", animationDuration: "3.5s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite",
        }} />
      )}

      {/* Warp effect when window "open" — stars blur */}
      {windowOpen && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
          background: "radial-gradient(ellipse at 50% 40%, rgba(100,150,255,0.06) 0%, transparent 60%)",
        }} />
      )}

      {/* Vignette */}
      <div className="world-vignette" style={{ zIndex: 5 }} />

      {/* Click ripples */}
      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute", left: r.x, top: r.y, zIndex: 6,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%", border: "1px solid rgba(0,200,180,0.4)",
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
          <span>{lampDim ? "◐" : "◉"}</span>
          {lampDim ? "lights off" : "lights on"}
        </button>
        <button
          className={`scene-ctrl${holoActive ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_WINDOW" }); }}
          style={{ borderColor: holoActive ? "rgba(0,200,180,0.3)" : undefined }}
        >
          <span style={{ color: holoActive ? "#00c8b4" : undefined }}>⬡</span>
          {holoActive ? "holo on" : "holo off"}
        </button>
        <button
          className={`scene-ctrl${windowOpen ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_FAN" }); }}
        >
          <span>{windowOpen ? "⬤" : "○"}</span>
          {windowOpen ? "warp on" : "warp off"}
        </button>
      </div>
    </div>
  );
}
