import { useNavigate } from "@tanstack/react-router";
import { WORLDS, WORLD_IDS, type WorldId } from "@/worlds/registry";

interface WorldNavProps {
  currentWorldId: WorldId;
}

const ICONS: Record<WorldId, React.ReactNode> = {
  "rainy-bedroom": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {/* Rain drops */}
      {[3, 7, 11].map((x, i) => (
        <line key={i} x1={x} y1="2" x2={x + 1} y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      {/* Window */}
      <rect x="1" y="7" width="14" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <line x1="8" y1="7" x2="8" y2="15" stroke="currentColor" strokeWidth="0.8" />
      <line x1="1" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  ),
  "night-train": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {/* Train car */}
      <rect x="1" y="4" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      {/* Windows */}
      <rect x="3" y="6" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <rect x="9" y="6" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
      {/* Wheels */}
      <circle cx="4" cy="13" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="12" cy="13" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  ),
  "cozy-cafe": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {/* Cup */}
      <path d="M3 7 Q3 13 8 13 Q13 13 13 7 L14 4 L2 4 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      {/* Handle */}
      <path d="M13 7 Q16 7 15 10 Q14 12 13 11" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Steam */}
      <path d="M6 2 Q7 1 6 0" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M9 2 Q10 1 9 0" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  ),
};

export function WorldNav({ currentWorldId }: WorldNavProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
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
              padding: "7px 10px",
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
