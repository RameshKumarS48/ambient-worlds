import { useState } from "react";
import type { SceneProps } from "../registry";

const DUST_MOTES = Array.from({ length: 12 }, (_, i) => ({
  left: `${20 + Math.random() * 60}%`,
  top: `${20 + Math.random() * 50}%`,
  delay: `${i * 1.4}s`,
  duration: `${8 + Math.random() * 10}s`,
}));

export function CozyCafeScene({ state, onInteract }: SceneProps) {
  const { teaReady = false, fanOn = true, radioStatic = 0.3 } = state;
  const [pouring, setPouring] = useState(false);

  const handleMakeTea = () => {
    if (!teaReady) {
      setPouring(true);
      setTimeout(() => setPouring(false), 1500);
    }
    onInteract({ type: "MAKE_TEA" });
  };

  return (
    <div
      className="world-scene animate-world-in"
      style={{ background: "linear-gradient(180deg, #0e0905 0%, #150e06 60%, #1a1208 100%)" }}
    >
      {/* Warm ambient glow from lights */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "40%",
        background: "radial-gradient(ellipse at 50% 0%, rgba(180,100,20,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Back wall with tile texture */}
      <svg
        style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "65%" }}
        viewBox="0 0 1000 400"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Wall base */}
        <rect width="1000" height="400" fill="#140c04" />
        {/* Tile grid */}
        {Array.from({ length: 10 }, (_, col) =>
          Array.from({ length: 7 }, (_, row) => (
            <rect
              key={`${col}-${row}`}
              x={col * 100 + 2} y={row * 55 + 2}
              width="96" height="51"
              fill="none"
              stroke="rgba(60,40,20,0.5)"
              strokeWidth="1"
            />
          ))
        )}
        {/* Clock */}
        <circle cx="500" cy="80" r="40" fill="#1e1208" stroke="rgba(100,70,30,0.4)" strokeWidth="2" />
        <circle cx="500" cy="80" r="3" fill="#8a6030" />
        {/* Minute hand - animated */}
        <line
          x1="500" y1="80"
          x2="500" y2="50"
          stroke="#8a6030" strokeWidth="2" strokeLinecap="round"
          style={{
            transformOrigin: "500px 80px",
            animationName: "tick-minute",
            animationDuration: "60s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
        {/* Hour hand */}
        <line
          x1="500" y1="80"
          x2="500" y2="58"
          stroke="#6a4820" strokeWidth="3" strokeLinecap="round"
          style={{
            transformOrigin: "500px 80px",
            animationName: "tick-hour",
            animationDuration: "720s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
        {/* String lights */}
        {[...Array(9)].map((_, i) => (
          <g key={i}>
            <circle
              cx={80 + i * 105} cy={30 + (i % 2) * 10}
              r="5"
              fill={i % 3 === 0 ? "#d4600a" : i % 3 === 1 ? "#d4943a" : "#c0602a"}
              opacity="0.9"
            />
            <circle
              cx={80 + i * 105} cy={30 + (i % 2) * 10}
              r="10"
              fill="none"
              stroke={i % 3 === 0 ? "#d4600a" : i % 3 === 1 ? "#d4943a" : "#c0602a"}
              strokeWidth="1"
              opacity="0.2"
            />
          </g>
        ))}
        {/* Light string wire */}
        <path d="M30,22 Q130,38 230,22 Q330,38 430,22 Q530,38 630,22 Q730,38 830,22 Q930,38 970,22" stroke="rgba(60,40,20,0.4)" strokeWidth="1" fill="none" />
        {/* Menu board */}
        <rect x="750" y="60" width="180" height="120" rx="4" fill="#0e0804" stroke="rgba(60,40,20,0.4)" strokeWidth="2" />
        <text x="840" y="92" textAnchor="middle" fill="rgba(200,160,80,0.6)" fontSize="9" fontFamily="serif">Today</text>
        <line x1="760" y1="100" x2="920" y2="100" stroke="rgba(60,40,20,0.3)" strokeWidth="1" />
        {["Masala Chai", "Filter Coffee", "Cutting Chai"].map((item, i) => (
          <text key={i} x="840" y={118 + i * 18} textAnchor="middle" fill="rgba(180,140,60,0.5)" fontSize="8" fontFamily="serif">
            {item}
          </text>
        ))}
      </svg>

      {/* Counter */}
      <div style={{
        position: "absolute", bottom: "18%", left: 0, right: 0, height: "6px",
        background: "linear-gradient(180deg, #2a1a0a 0%, #1a1008 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: 0, right: 0, height: "18%",
        background: "linear-gradient(180deg, #1a1208 0%, #0e0c08 100%)",
      }} />

      {/* Ceiling fan */}
      <div
        style={{
          position: "absolute", top: "3%", left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
        }}
        onClick={() => onInteract({ type: "TOGGLE_FAN" })}
        title={fanOn ? "Turn fan off" : "Turn fan on"}
      >
        <svg
          width="80" height="80"
          viewBox="-40 -40 80 80"
          style={{
            transformOrigin: "center",
            animationName: fanOn ? "fan-spin" : "none",
            animationDuration: "0.7s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {[0, 90, 180, 270].map((angle, i) => (
            <ellipse
              key={i}
              cx="18" cy="0" rx="16" ry="7"
              fill="#1e1408"
              stroke="rgba(80,50,20,0.4)"
              strokeWidth="1"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="5" fill="#2a1a0a" />
          <circle cx="0" cy="0" r="2" fill="#8a6030" />
        </svg>
        {/* Fan rod */}
        <div style={{
          position: "absolute", top: "-20px", left: "50%",
          transform: "translateX(-50%)",
          width: "3px", height: "20px",
          background: "#1e1408",
        }} />
      </div>

      {/* Tea station */}
      <div
        style={{
          position: "absolute", bottom: "20%", left: "30%",
          display: "flex", alignItems: "flex-end", gap: "12px",
          cursor: "pointer",
        }}
        onClick={handleMakeTea}
        title="Make tea"
      >
        <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
          {/* Stove */}
          <rect x="0" y="45" width="60" height="25" rx="3" fill="#1a1208" stroke="rgba(80,50,20,0.3)" strokeWidth="1" />
          {/* Burner */}
          <circle cx="30" cy="55" r="10" fill="none" stroke={teaReady ? "#e05010" : "rgba(80,50,20,0.3)"} strokeWidth="2" />
          {teaReady && <circle cx="30" cy="55" r="6" fill="rgba(220,80,20,0.3)" />}
          {/* Kettle */}
          <ellipse cx="30" cy="35" rx="18" ry="12" fill="#1e1810" stroke="rgba(80,50,20,0.4)" strokeWidth="1" />
          <rect x="12" y="23" width="36" height="12" rx="2" fill="#1a1408" />
          <ellipse cx="30" cy="23" rx="12" ry="3" fill="#2a2010" />
          {/* Spout */}
          <path d="M48 32 Q56 30 54 26" stroke="rgba(80,50,20,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Handle */}
          <path d="M12 28 Q4 32 12 38" stroke="rgba(80,50,20,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Pour stream */}
          {pouring && (
            <path d="M54 26 Q56 22 52 18 Q50 14 54 10" stroke="rgba(180,140,60,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
          {/* Kettle lid wiggle when tea ready */}
          <ellipse
            cx="30" cy="20"
            rx="14" ry="3"
            fill="#2a2010"
            stroke="rgba(80,50,20,0.4)"
            strokeWidth="1"
            style={teaReady ? {
              animationName: "fan-spin",
              animationDuration: "0",
              transformOrigin: "30px 20px",
            } : undefined}
          />
        </svg>

        {/* Tea cups */}
        <svg width="30" height="40" viewBox="0 0 30 40" fill="none">
          <path d="M4 20 Q4 34 15 34 Q26 34 26 20 L28 10 L2 10 Z" fill="#1e1810" stroke="rgba(80,50,20,0.4)" strokeWidth="1" />
          <ellipse cx="15" cy="10" rx="13" ry="4" fill="#2a2010" />
          {teaReady && <ellipse cx="15" cy="10" rx="10" ry="2.5" fill="rgba(160,100,20,0.6)" />}
          <path d="M26 18 Q32 16 28 24" stroke="rgba(80,50,20,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="15" cy="38" rx="16" ry="3" fill="rgba(0,0,0,0.4)" />
        </svg>

        {/* Steam */}
        {teaReady && (
          <div style={{ position: "absolute", bottom: "40px", left: "50%", display: "flex", gap: "6px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "3px", height: "20px",
                  background: "linear-gradient(180deg, transparent, rgba(200,180,140,0.4), transparent)",
                  borderRadius: "4px",
                  animationName: "steam-rise",
                  animationDuration: `${1.8 + i * 0.4}s`,
                  animationDelay: `${i * 0.3}s`,
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Make tea hint */}
      <div style={{
        position: "absolute", bottom: "38%", left: "30%",
        color: "rgba(180,140,60,0.4)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "8px",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}>
        {teaReady ? "chai is ready" : "tap to brew"}
      </div>

      {/* Radio */}
      <div style={{ position: "absolute", bottom: "20%", right: "12%" }}>
        <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
          {/* Body */}
          <rect x="1" y="1" width="78" height="48" rx="5" fill="#1a1008" stroke="rgba(80,50,20,0.4)" strokeWidth="1" />
          {/* Speaker grille */}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={i} x1="8" y1={12 + i * 6} x2="28" y2={12 + i * 6} stroke="rgba(80,50,20,0.4)" strokeWidth="1" />
          ))}
          {/* Display */}
          <rect x="32" y="10" width="38" height="20" rx="2" fill="rgba(20,40,0,0.6)" />
          {/* Tuning needle */}
          <line
            x1={32 + radioStatic * 38} y1="10"
            x2={32 + radioStatic * 38} y2="30"
            stroke="rgba(180,220,80,0.8)"
            strokeWidth="1.5"
          />
          {/* Frequency marks */}
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((x, i) => (
            <line key={i} x1={32 + x * 38} y1="10" x2={32 + x * 38} y2="14" stroke="rgba(100,120,40,0.4)" strokeWidth="1" />
          ))}
          {/* Knobs */}
          <circle cx="52" cy="38" r="5" fill="#251808" stroke="rgba(80,50,20,0.4)" strokeWidth="1" />
          <circle cx="66" cy="38" r="5" fill="#251808" stroke="rgba(80,50,20,0.4)" strokeWidth="1" />
        </svg>
        <input
          type="range" min="0" max="1" step="0.05"
          value={radioStatic}
          onChange={(e) => onInteract({ type: "SET_RADIO_STATIC", level: parseFloat(e.target.value) })}
          style={{ width: "80px", accentColor: "#d4943a", cursor: "pointer", opacity: 0.6, marginTop: "4px" }}
        />
        <div style={{ color: "rgba(180,140,60,0.35)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: "0.05em", textAlign: "center" }}>
          {radioStatic < 0.3 ? "clear signal" : radioStatic > 0.7 ? "static" : "tuning..."}
        </div>
      </div>

      {/* Dust motes */}
      {DUST_MOTES.map((mote, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: mote.left, top: mote.top,
            width: "2px", height: "2px",
            borderRadius: "50%",
            background: "rgba(200,160,80,0.3)",
            animationName: "dust-float",
            animationDuration: mote.duration,
            animationDelay: mote.delay,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Ambient floor glow from counter lights */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "25%",
        background: "linear-gradient(180deg, transparent, rgba(180,80,10,0.06))",
        pointerEvents: "none",
      }} />
    </div>
  );
}
