import { useRef, useEffect } from "react";

// ── Rain particles ─────────────────────────────────────────────────────────────
const RAIN = Array.from({ length: 60 }, (_, i) => ({
  left: `${Math.random() * 110 - 5}%`,
  delay: `${(i * 0.13) % 2.2}s`,
  dur: `${0.45 + Math.random() * 0.45}s`,
  h: `${8 + Math.random() * 14}px`,
  op: 0.3 + Math.random() * 0.55,
  x: `${-2 + Math.random() * 6}px`,
}));

export function RainParticles({ intensity = 0.7 }: { intensity?: number }) {
  const count = Math.floor(intensity * 60);
  return (
    <>
      {RAIN.slice(0, count).map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: 0, left: r.left,
            width: "1px", height: r.h,
            background: "linear-gradient(180deg, transparent, rgba(180,210,255,0.55))",
            animationName: "rain-fall", animationDuration: r.dur,
            animationDelay: r.delay, animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            opacity: r.op * intensity, zIndex: 15, pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

// ── Fire particles ─────────────────────────────────────────────────────────────
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  left: `${40 + (Math.random() - 0.5) * 20}%`,
  delay: `${i * 0.28}s`,
  dur: `${1.8 + Math.random() * 2}s`,
  size: `${1.5 + Math.random() * 3}px`,
  color: Math.random() > 0.5 ? "#ff8020" : "#ffcc40",
  drift: `${(Math.random() - 0.5) * 60}px`,
}));

export function FireParticles({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      {EMBERS.map((e, i) => (
        <div
          key={i}
          style={{
            position: "absolute", bottom: "38%", left: e.left,
            width: e.size, height: e.size, borderRadius: "50%",
            background: e.color,
            boxShadow: `0 0 4px ${e.color}`,
            animationName: "ember-rise",
            animationDuration: e.dur, animationDelay: e.delay,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-out",
            "--ember-drift": e.drift,
            opacity: intensity,
            pointerEvents: "none", zIndex: 15,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

// ── Star particles ─────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 55}%`,
  delay: `${Math.random() * 4}s`,
  dur: `${2 + Math.random() * 3}s`,
  size: `${0.8 + Math.random() * 2}px`,
  op: 0.3 + Math.random() * 0.6,
}));

export function StarParticles() {
  return (
    <>
      {STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: s.left, top: s.top,
            width: s.size, height: s.size, borderRadius: "50%",
            background: "rgba(220,230,255,0.9)",
            animationName: "star-twinkle",
            animationDuration: s.dur, animationDelay: s.delay,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
            opacity: s.op, pointerEvents: "none", zIndex: 3,
          }}
        />
      ))}
    </>
  );
}

// ── Click ripple ───────────────────────────────────────────────────────────────
interface Ripple { x: number; y: number; id: number; color: string }

export function useClickRipple(color = "rgba(255,255,255,0.3)") {
  const ref = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const setRef = useRef<React.Dispatch<React.SetStateAction<Ripple[]>> | null>(null);

  return { ref, ripplesRef, setRef, color };
}

export function ClickRipple({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div
      style={{
        position: "absolute", left: x, top: y,
        width: 0, height: 0, borderRadius: "50%",
        background: "transparent",
        border: `2px solid ${color}`,
        transform: "translate(-50%, -50%)",
        animationName: "ripple-out",
        animationDuration: "0.7s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
        pointerEvents: "none", zIndex: 50,
      }}
    />
  );
}

// ── Hotspot (invisible interactive area) ──────────────────────────────────────
interface HotspotProps {
  x: string; y: string; w?: string; h?: string;
  label?: string;
  cursor?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Hotspot({ x, y, w = "80px", h = "80px", label, cursor = "pointer", onClick, onMouseEnter, onMouseLeave, style, children }: HotspotProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={label}
      style={{
        position: "absolute", left: x, top: y,
        width: w, height: h,
        cursor, zIndex: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
