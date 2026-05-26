import { useState } from "react";
import type { SceneProps } from "../registry";

const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  left: `${38 + (i * 1.8) % 24}%`,
  delay: `${(i * 0.3) % 4}s`,
  duration: `${1.5 + (i % 5) * 0.4}s`,
  drift: `${-15 + (i % 7) * 7}px`,
  size: `${1.5 + (i % 3) * 0.8}px`,
  color: i % 3 === 0 ? "rgba(255,120,20,0.9)" : i % 3 === 1 ? "rgba(255,200,60,0.8)" : "rgba(255,70,10,0.7)",
}));

const STARS = Array.from({ length: 45 }, (_, i) => ({
  left: `${(i * 2.23) % 100}%`,
  top: `${(i * 1.87) % 45}%`,
  delay: `${(i * 0.4) % 6}s`,
  duration: `${2 + (i % 4)}s`,
  size: `${0.8 + (i % 3) * 0.5}px`,
  op: 0.3 + (i % 4) * 0.15,
}));

export function CampfireScene({ state, onInteract }: SceneProps) {
  const { fireIntensity = 0.8, windowOpen = false, fanOn = false } = state;
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
      style={{ backgroundImage: "url('/worlds/campfire.png')" }}
      onClick={addRipple}
    >
      {/* Night darkness */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "rgba(0,0,0,0.3)",
      }} />

      {/* Fire glow — orange radial spreading from bottom center */}
      <div style={{
        position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)",
        width: "500px", height: "300px", pointerEvents: "none", zIndex: 2,
        background: `radial-gradient(ellipse at 50% 85%, rgba(255,140,20,${fireIntensity * 0.35}) 0%, rgba(255,80,10,${fireIntensity * 0.18}) 35%, transparent 70%)`,
        transition: "all 0.8s ease",
        animationName: "campfire-dance", animationDuration: "2.5s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite",
      }} />

      {/* Flickering light on scene */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: `radial-gradient(ellipse at 50% 75%, rgba(255,120,20,${fireIntensity * 0.12}) 0%, transparent 60%)`,
        animationName: "flicker-light", animationDuration: "4s", animationTimingFunction: "steps(1)", animationIterationCount: "infinite",
      }} />

      {/* Stars (visible sky area) */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: "absolute", left: s.left, top: s.top,
            width: s.size, height: s.size, borderRadius: "50%",
            background: `rgba(255,250,240,${s.op})`,
            animationName: "star-twinkle", animationDuration: s.duration, animationDelay: s.delay,
            animationTimingFunction: "ease-in-out", animationIterationCount: "infinite",
          }} />
        ))}
      </div>

      {/* Wind effect when windowOpen (open area) */}
      {windowOpen && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4,
          background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
        }} />
      )}

      {/* Embers */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5, opacity: fireIntensity }}>
        {EMBERS.map((e, i) => (
          <div key={i} style={{
            position: "absolute", bottom: "26%", left: e.left,
            width: e.size, height: e.size, borderRadius: "50%",
            background: e.color,
            boxShadow: `0 0 3px ${e.color}`,
            animationName: "ember-rise", animationDuration: e.duration,
            animationDelay: e.delay, animationTimingFunction: "ease-out",
            animationIterationCount: "infinite",
            // @ts-expect-error CSS custom property
            "--ember-drift": e.drift,
          }} />
        ))}
      </div>

      {/* Vignette */}
      <div className="world-vignette" style={{ zIndex: 6 }} />

      {/* Click ripples */}
      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute", left: r.x, top: r.y, zIndex: 7,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%", border: "1px solid rgba(255,140,20,0.4)",
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
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "rgba(0,0,0,0.42)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,140,20,0.15)", borderRadius: "20px",
          padding: "5px 10px",
        }}>
          <span style={{ fontSize: "8px", color: "rgba(255,140,20,0.6)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>fire</span>
          <input
            type="range" min="0.1" max="1" step="0.05"
            value={fireIntensity}
            onClick={e => e.stopPropagation()}
            onChange={(e) => onInteract({ type: "SET_RAIN", intensity: parseFloat(e.target.value) })}
            style={{ width: "72px", accentColor: "#ff8c14", cursor: "pointer" }}
          />
        </div>

        <button
          className={`scene-ctrl${windowOpen ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onInteract({ type: "TOGGLE_FAN" }); }}
        >
          <span>{windowOpen ? "~" : "·"}</span>
          {windowOpen ? "wind: on" : "wind: off"}
        </button>
      </div>
    </div>
  );
}
