import type { SceneProps } from "../registry";

const RAIN_DROPS = Array.from({ length: 45 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  delay: `${(i * 0.12) % 1.8}s`,
  duration: `${0.5 + Math.random() * 0.5}s`,
  height: `${10 + Math.random() * 12}px`,
  opacity: 0.4 + Math.random() * 0.5,
}));

export function RainyBedroomScene({ state, onInteract }: SceneProps) {
  const { lampDim = false, rainIntensity = 0.6, windowOpen = false } = state;

  return (
    <div
      className="world-scene animate-world-in"
      style={{ background: `radial-gradient(ellipse at 30% 40%, #1a2234 0%, #0d1117 70%)` }}
    >
      {/* Window exterior glow */}
      <div
        style={{
          position: "absolute",
          left: "8%", top: "8%",
          width: "28%", height: "50%",
          background: windowOpen
            ? `radial-gradient(ellipse at center, rgba(180,160,100,0.25) 0%, transparent 70%)`
            : `radial-gradient(ellipse at center, rgba(180,160,80,0.12) 0%, transparent 60%)`,
          transition: "background 1s ease",
        }}
      />

      {/* Window frame */}
      <svg
        style={{ position: "absolute", left: "8%", top: "8%", width: "28%", height: "50%" }}
        viewBox="0 0 280 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Window frame */}
        <rect x="2" y="2" width="276" height="496" rx="4" fill="none" stroke="#2a2010" strokeWidth="12" />
        {/* Glass */}
        <rect x="8" y="8" width="264" height="488" rx="2"
          fill={windowOpen ? "rgba(140,120,60,0.04)" : "rgba(160,200,255,0.06)"}
          style={{ transition: "fill 0.8s ease" }}
        />
        {/* Crossbar */}
        <line x1="8" y1="252" x2="272" y2="252" stroke="#2a2010" strokeWidth="8" />
        <line x1="140" y1="8" x2="140" y2="496" stroke="#2a2010" strokeWidth="8" />
        {/* Exterior city glow bleed through */}
        <rect x="8" y="8" width="264" height="244"
          fill="rgba(200,160,60,0.05)"
          style={{ transition: "fill 0.8s ease" }}
        />
        {/* Condensation streaks */}
        {!windowOpen && [0.15, 0.35, 0.65, 0.82].map((x, i) => (
          <line
            key={i}
            x1={x * 264 + 8} y1={20 + i * 30}
            x2={x * 264 + 8 + (i % 2 === 0 ? 3 : -2)} y2={60 + i * 40}
            stroke="rgba(160,200,255,0.18)" strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Window blur overlay (closed = frosted) */}
      {!windowOpen && (
        <div style={{
          position: "absolute", left: "8%", top: "8%", width: "28%", height: "50%",
          backdropFilter: "blur(1px)",
          pointerEvents: "none",
        }} />
      )}

      {/* Rain drops on window */}
      {RAIN_DROPS.slice(0, Math.floor(rainIntensity * 45)).map((drop, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(8% + ${drop.left.replace("%", "")}% * 0.28)`,
            top: 0,
            width: "1px",
            height: drop.height,
            background: "rgba(160,200,255,0.45)",
            animationName: "rain-fall",
            animationDuration: drop.duration,
            animationDelay: drop.delay,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            opacity: drop.opacity * rainIntensity,
            zIndex: 10,
          }}
        />
      ))}

      {/* Room floor */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(180deg, #0a0e18 0%, #12181f 100%)",
      }} />

      {/* Bookshelf */}
      <svg
        style={{ position: "absolute", right: "5%", top: "15%", width: "18%", height: "55%" }}
        viewBox="0 0 180 550"
        fill="none"
      >
        {/* Frame */}
        <rect x="1" y="1" width="178" height="548" rx="2" fill="#0e1420" stroke="#1e2530" strokeWidth="2" />
        {/* Shelves */}
        {[130, 270, 410].map((y, si) => (
          <rect key={si} x="1" y={y} width="178" height="6" fill="#1e2530" />
        ))}
        {/* Books - random colored spines */}
        {[
          { x: 10, y: 20,  w: 18, h: 108, c: "#3d2a1e" },
          { x: 30, y: 40,  w: 14, h: 88,  c: "#1e3040" },
          { x: 46, y: 30,  w: 20, h: 98,  c: "#2a1e30" },
          { x: 68, y: 50,  w: 16, h: 78,  c: "#1e3020" },
          { x: 86, y: 20,  w: 22, h: 108, c: "#402010" },
          { x: 10, y: 160, w: 16, h: 108, c: "#1a2840" },
          { x: 28, y: 145, w: 18, h: 122, c: "#302010" },
          { x: 48, y: 155, w: 14, h: 112, c: "#1e3028" },
          { x: 64, y: 140, w: 20, h: 128, c: "#281e40" },
          { x: 86, y: 160, w: 16, h: 108, c: "#3a2010" },
          { x: 10, y: 300, w: 20, h: 108, c: "#102030" },
          { x: 32, y: 290, w: 14, h: 118, c: "#301020" },
          { x: 48, y: 305, w: 18, h: 103, c: "#1e2810" },
          { x: 68, y: 295, w: 16, h: 113, c: "#201828" },
        ].map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="1" fill={b.c} />
        ))}
      </svg>

      {/* Desk */}
      <div style={{
        position: "absolute", bottom: "28%", left: "38%", width: "24%", height: "4px",
        background: "#1e2530",
        boxShadow: "0 2px 20px rgba(0,0,0,0.5)",
      }} />

      {/* Lamp on desk */}
      <div
        onClick={() => onInteract({ type: "TOGGLE_LAMP" })}
        style={{ position: "absolute", bottom: "28%", left: "55%", cursor: "pointer", userSelect: "none" }}
      >
        <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
          {/* Shade */}
          <ellipse cx="20" cy="24" rx="18" ry="10" fill={lampDim ? "#1a1408" : "#3a2a10"} />
          <path d="M4 24 L8 44 L32 44 L36 24" fill={lampDim ? "#1a1408" : "#3a2a10"} />
          {/* Bulb glow */}
          <circle cx="20" cy="38" r="5" fill={lampDim ? "#80500a" : "#d4943a"} opacity={lampDim ? 0.3 : 0.9} />
          {/* Stem */}
          <line x1="20" y1="44" x2="20" y2="75" stroke="#1e2530" strokeWidth="3" />
          {/* Base */}
          <ellipse cx="20" cy="76" rx="12" ry="3" fill="#1e2530" />
        </svg>
        {/* Glow effect */}
        {!lampDim && (
          <div style={{
            position: "absolute", top: "20%", left: "50%",
            transform: "translateX(-50%)",
            width: "100px", height: "80px",
            background: "radial-gradient(ellipse at center, rgba(212,148,58,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
            animationName: "lamp-breathe",
            animationDuration: "3s",
            animationIterationCount: "infinite",
          }} />
        )}
      </div>

      {/* Lamp floor glow */}
      {!lampDim && (
        <div style={{
          position: "absolute", bottom: "22%", left: "45%",
          width: "180px", height: "60px",
          background: "radial-gradient(ellipse at center, rgba(212,148,58,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          transition: "opacity 0.8s ease",
        }} />
      )}

      {/* Plant */}
      <svg style={{ position: "absolute", bottom: "28%", left: "40%", width: "5%", minWidth: 30 }} viewBox="0 0 30 50" fill="none">
        <rect x="10" y="36" width="10" height="14" rx="1" fill="#1a2010" />
        <path d="M15 36 C15 20 5 15 8 8 C11 2 20 5 15 18" fill="#1a3010" />
        <path d="M15 36 C15 20 25 15 22 8 C19 2 10 5 15 18" fill="#1e3814" />
        <path d="M15 30 C15 18 20 14 22 18" fill="#162808" />
      </svg>

      {/* Window open/close button */}
      <button
        onClick={() => onInteract({ type: "TOGGLE_WINDOW" })}
        style={{
          position: "absolute", left: "8%", top: "59%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(232,228,220,0.5)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          padding: "4px 8px",
          cursor: "pointer",
          borderRadius: "3px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
      >
        {windowOpen ? "close window" : "open window"}
      </button>

      {/* Rain intensity slider */}
      <div style={{
        position: "absolute", left: "8%", top: "63%",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span style={{
          color: "rgba(232,228,220,0.4)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>rain</span>
        <input
          type="range"
          min="0" max="1" step="0.05"
          value={rainIntensity}
          onChange={(e) => onInteract({ type: "SET_RAIN", intensity: parseFloat(e.target.value) })}
          style={{
            width: "80px",
            accentColor: "#7ab3d4",
            cursor: "pointer",
            opacity: 0.7,
          }}
        />
      </div>

      {/* Ambient room light (dim when lamp is off) */}
      <div style={{
        position: "absolute", inset: 0,
        background: lampDim
          ? "rgba(0,10,30,0.5)"
          : "rgba(0,0,0,0)",
        transition: "background 1.2s ease",
        pointerEvents: "none",
        zIndex: 5,
      }} />
    </div>
  );
}
