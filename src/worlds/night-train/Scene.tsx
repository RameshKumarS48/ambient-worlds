import type { SceneProps } from "../registry";

const SNOW_FLAKES = Array.from({ length: 35 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  delay: `${(i * 0.3) % 8}s`,
  duration: `${6 + Math.random() * 6}s`,
  size: `${1.5 + Math.random() * 2.5}px`,
}));

// Far hills silhouette (mountains in snow)
const FAR_HILLS_PATH = "M0,200 L80,120 L160,160 L220,80 L300,130 L380,90 L460,140 L540,70 L620,120 L700,100 L780,150 L860,80 L940,130 L1000,110 L1000,300 L0,300Z";
const NEAR_HILLS_PATH = "M0,280 L60,200 L130,240 L200,170 L280,220 L350,180 L420,230 L500,160 L580,210 L660,185 L740,240 L820,190 L900,220 L1000,195 L1000,300 L0,300Z";

export function NightTrainScene({ state, onInteract }: SceneProps) {
  const { lightsFlicker = false, trainSpeed = 0.6, frostedGlass = false } = state;
  const scrollDuration = `${22 / trainSpeed}s`;

  return (
    <div
      className="world-scene animate-world-in"
      style={{ backgroundImage: "url('/worlds/night-train.png')" }}
    >
      {/* Carriage ceiling */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "12%",
        background: "linear-gradient(180deg, #191920 0%, #131318 100%)",
        borderBottom: "2px solid #1e1e28",
      }} />

      {/* Overhead lights */}
      {[20, 50, 80].map((pos, i) => (
        <div key={i} style={{ position: "absolute", top: "8%", left: `${pos}%`, transform: "translateX(-50%)" }}>
          <div style={{
            width: "60px", height: "8px",
            background: lightsFlicker ? "transparent" : "rgba(220,210,180,0.8)",
            borderRadius: "2px",
            boxShadow: lightsFlicker ? "none" : "0 0 20px rgba(220,210,150,0.6), 0 0 40px rgba(220,210,150,0.2)",
            animationName: lightsFlicker ? "flicker" : "none",
            animationDuration: "4s",
            animationIterationCount: "infinite",
            animationTimingFunction: "steps(1)",
          }} />
          {/* Light cone */}
          {!lightsFlicker && (
            <div style={{
              position: "absolute", top: "8px", left: "50%",
              transform: "translateX(-50%)",
              width: "120px", height: "60px",
              background: "radial-gradient(ellipse at top, rgba(220,210,150,0.12) 0%, transparent 80%)",
              pointerEvents: "none",
            }} />
          )}
        </div>
      ))}

      {/* Window frame */}
      <div style={{
        position: "absolute", left: "12%", top: "14%", width: "76%", height: "52%",
        border: "12px solid #1a1a24",
        borderRadius: "6px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.6)",
      }}
        onClick={() => onInteract({ type: "TOGGLE_FROSTED_GLASS" })}
        title={frostedGlass ? "Clear glass" : "Frost glass"}
      >
        {/* Sky gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #050814 0%, #0a1020 40%, #141820 100%)",
        }} />

        {/* Far hills layer - slow scroll */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: "200%", height: "60%",
          animationName: "scroll-far",
          animationDuration: `${parseFloat(scrollDuration) * 1.8}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}>
          <svg width="100%" height="100%" viewBox="0 0 2000 300" preserveAspectRatio="none">
            <path d={FAR_HILLS_PATH} fill="#0e1220" />
            <path d={FAR_HILLS_PATH.replace("1000", "2000").replace("M0,200", "M1000,200")} fill="#0e1220" />
          </svg>
        </div>

        {/* Near hills layer - fast scroll */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: "200%", height: "50%",
          animationName: "scroll-near",
          animationDuration: scrollDuration,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}>
          <svg width="100%" height="100%" viewBox="0 0 2000 300" preserveAspectRatio="none">
            <path d={NEAR_HILLS_PATH} fill="#0a0e18" />
            <path d={NEAR_HILLS_PATH.replace("1000", "2000").replace("M0,280", "M1000,280")} fill="#0a0e18" />
          </svg>
        </div>

        {/* Snow particles */}
        {SNOW_FLAKES.map((flake, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: flake.left,
              top: 0,
              width: flake.size,
              height: flake.size,
              borderRadius: "50%",
              background: "rgba(220,230,255,0.7)",
              animationName: "snow-fall",
              animationDuration: flake.duration,
              animationDelay: flake.delay,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          />
        ))}

        {/* Frosted glass overlay */}
        {frostedGlass && (
          <div style={{
            position: "absolute", inset: 0,
            backdropFilter: "blur(8px)",
            background: "rgba(180,200,255,0.04)",
          }} />
        )}

        {/* Window reflection */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Seat backs */}
      <svg style={{ position: "absolute", bottom: "8%", left: 0, right: 0, width: "100%", height: "30%" }} viewBox="0 0 1000 200" fill="none" preserveAspectRatio="none">
        {/* Left seat */}
        <rect x="20" y="30" width="200" height="160" rx="4" fill="#161620" />
        <rect x="20" y="30" width="200" height="40" rx="4" fill="#1e1e2a" />
        {/* Right seat */}
        <rect x="780" y="30" width="200" height="160" rx="4" fill="#161620" />
        <rect x="780" y="30" width="200" height="40" rx="4" fill="#1e1e2a" />
        {/* Armrests */}
        <rect x="20" y="90" width="18" height="100" rx="2" fill="#1a1a22" />
        <rect x="202" y="90" width="18" height="100" rx="2" fill="#1a1a22" />
        <rect x="762" y="90" width="18" height="100" rx="2" fill="#1a1a22" />
        <rect x="960" y="90" width="18" height="100" rx="2" fill="#1a1a22" />
        {/* Floor */}
        <rect x="0" y="190" width="1000" height="10" fill="#0e0e16" />
      </svg>

      {/* Luggage rack */}
      <svg style={{ position: "absolute", top: "12%", left: "5%", width: "90%", height: "8%" }} viewBox="0 0 900 40" fill="none">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <rect key={i} x={i * 100 + 10} y="5" width="4" height="30" fill="#1a1a24" />
        ))}
        <rect x="0" y="5" width="900" height="6" rx="2" fill="#1a1a24" />
        <rect x="0" y="29" width="900" height="6" rx="2" fill="#1a1a24" />
      </svg>

      {/* Controls */}
      <div style={{ position: "absolute", bottom: "6%", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "16px", alignItems: "center" }}>
        {/* Speed slider */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "rgba(232,228,220,0.35)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase" }}>speed</span>
          <input
            type="range" min="0.1" max="1" step="0.05"
            value={trainSpeed}
            onChange={(e) => onInteract({ type: "SET_TRAIN_SPEED", speed: parseFloat(e.target.value) })}
            style={{ width: "80px", accentColor: "#7ab3d4", cursor: "pointer", opacity: 0.7 }}
          />
        </div>
        {/* Flicker toggle */}
        <button
          onClick={() => onInteract({ type: "TOGGLE_LIGHTS_FLICKER" })}
          style={{
            background: lightsFlicker ? "rgba(122,179,212,0.15)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${lightsFlicker ? "rgba(122,179,212,0.4)" : "rgba(255,255,255,0.08)"}`,
            color: lightsFlicker ? "#7ab3d4" : "rgba(232,228,220,0.4)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px", padding: "4px 8px", cursor: "pointer",
            borderRadius: "3px", letterSpacing: "0.05em", textTransform: "uppercase",
          }}
        >
          {lightsFlicker ? "lights: flickering" : "lights: steady"}
        </button>
      </div>

      {/* Frosted glass hint */}
      <div style={{
        position: "absolute", top: "67%", left: "50%", transform: "translateX(-50%)",
        color: "rgba(232,228,220,0.25)", fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        {frostedGlass ? "tap window to clear" : "tap window to frost"}
      </div>
    </div>
  );
}
