import { useNavigate } from "@tanstack/react-router";
import { WORLDS, WORLD_IDS, type WorldId } from "@/worlds/registry";

interface WorldNavProps {
  currentWorldId: WorldId;
}

const ICONS: Record<WorldId, React.ReactNode> = {
  "rainy-tokyo": (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      {[3, 7, 11].map((x, i) => (
        <line key={i} x1={x} y1="2" x2={x + 1} y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      <rect x="1" y="7" width="14" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <line x1="8" y1="7" x2="8" y2="15" stroke="currentColor" strokeWidth="0.8" />
      <line x1="1" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  ),
  "night-train": (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="4" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <rect x="3" y="6" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <rect x="9" y="6" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <circle cx="4" cy="13" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="12" cy="13" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  ),
  "quiet-library": (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="2.5" height="12" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="6" y="3" width="2.5" height="11" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="10" y="1.5" width="2.5" height="12.5" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="1" y1="14.5" x2="15" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  "cyberpunk-room": (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <line x1="2" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="0.8" />
      {[4, 7, 10].map((x, i) => (
        <circle key={i} cx={x} cy="10.5" r="0.7" fill="currentColor" />
      ))}
      <path d="M6 2 L10 2 L11 4 L5 4 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
    </svg>
  ),
  "campfire": (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2 C8 2 11 5 11 8 C11 11 9.5 13 8 13 C6.5 13 5 11 5 8 C5 5 8 2 8 2Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <path d="M8 6 C8 6 9.5 8 9 10" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <line x1="4" y1="14" x2="12" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "spaceship": (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1 L12 8 L10 9 L8 14 L6 9 L4 8 Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <circle cx="8" cy="7" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  ),
};

export function WorldNav({ currentWorldId }: WorldNavProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        gap: "2px",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
        borderRadius: "24px",
        padding: "4px",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {WORLD_IDS.map((id) => {
        const world = WORLDS[id];
        const isActive = id === currentWorldId;
        return (
          <button
            key={id}
            onClick={() => {
              if (!isActive) {
                void navigate({ to: "/world/$worldId", params: { worldId: id } });
              }
            }}
            title={world.title}
            style={{
              background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
              border: "none",
              borderRadius: "20px",
              padding: "6px 8px",
              cursor: isActive ? "default" : "pointer",
              color: isActive ? world.accent : "rgba(232,228,220,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = "rgba(232,228,220,0.6)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "rgba(232,228,220,0.3)";
            }}
          >
            {ICONS[id]}
          </button>
        );
      })}
    </div>
  );
}
