import { useState } from "react";
import type { SceneProps } from "../registry";

const RAIN_DROPS = Array.from({ length: 65 }, (_, i) => ({
  left: `${(i * 1.55) % 100}%`,
  delay: `${(i * 0.09) % 4}s`,
  duration: `${0.55 + (i % 6) * 0.1}s`,
  opacity: 0.25 + (i % 4) * 0.12,
  height: `${10 + (i % 6) * 3}px`,
}));

export function NightTrainScene({ state, onInteract }: SceneProps) {
  const { lightsFlicker = false, frostedGlass = false } = state;
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
      style={{ backgroundImage: "url('/worlds/night-train.png')" }}
      onClick={addRipple}
    >
      {/* Dim interior when lights flickering */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: lightsFlicker ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.18)",
        transition: "background 0.3s ease",
        animationName: lightsFlicker ? "flicker-light" : "none",
        animationDuration: "4s",
        animationTimingFunction: "steps(1)",
        animationIterationCount: "infinite",
      }} />

      {/* Frosted glass — soft blur over scene */}
      {frostedGlass && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          backdropFilter: "blur(5px)",
          background: "rgba(160,190,230,0.04)",
        }} />
      )}

      {/* Rain drops — angled slightly for motion effect */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        pointerEvents: "none", zIndex: 3,
      }}>
        {RAIN_DROPS.map((drop, i) => (
          <div key={i} style={{
            position: "absolute", top: "-20px", left: drop.left,
            width: "1px", height: drop.height,
            background: `rgba(160,200,255,${drop.opacity})`,
            transform: "rotate(8deg)",
            animationName: "rain-fall",
            animationDuration: drop.duration,
            animationDelay: drop.delay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }} />
        ))}
      </div>

      {/* Vignette */}
      <div className="world-vignette" style={{ zIndex: 4 }} />

      {/* Click ripples */}
      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute", left: r.x, top: r.y, zIndex: 5,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%", border: "1px solid rgba(160,200,255,0.35)",
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
          className={`scene-ctrl${lightsFlicker ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_LIGHTS_FLICKER" }); }}
        >
          <span>{lightsFlicker ? "◐" : "◉"}</span>
          {lightsFlicker ? "lights flickering" : "lights steady"}
        </button>
        <button
          className={`scene-ctrl${frostedGlass ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_FROSTED_GLASS" }); }}
        >
          <span>{frostedGlass ? "❄" : "○"}</span>
          {frostedGlass ? "window frosted" : "window clear"}
        </button>
      </div>
    </div>
  );
}
