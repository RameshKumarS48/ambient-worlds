import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { WORLDS, WORLD_IDS, type WorldId } from "@/worlds/registry";

const PREVIEW_STATE = {
  "rainy-bedroom": { lampDim: false, rainIntensity: 0.8, windowOpen: false },
  "night-train": { lightsFlicker: false, trainSpeed: 0.7, frostedGlass: false },
  "cozy-cafe": { teaReady: true, fanOn: true, radioStatic: 0.3 },
};

export function LandingPortal() {
  const navigate = useNavigate();

  const enterRandom = () => {
    const id = WORLD_IDS[Math.floor(Math.random() * WORLD_IDS.length)];
    void navigate({ to: "/world/$worldId", params: { worldId: id } });
  };

  const enterWorld = (id: WorldId) => {
    void navigate({ to: "/world/$worldId", params: { worldId: id } });
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0a0a0c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: "2rem 1rem",
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: "#e8e4dc",
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}>
          Ambient Worlds
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: "rgba(232,228,220,0.35)",
          textTransform: "uppercase",
          marginTop: "0.75rem",
        }}>
          drop into a living scene
        </p>
      </motion.div>

      {/* World cards */}
      <div style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "900px",
        width: "100%",
      }}>
        {WORLD_IDS.map((id, i) => {
          const world = WORLDS[id];
          const previewState = PREVIEW_STATE[id];

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => enterWorld(id)}
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.07)",
                background: world.bg,
                width: "240px",
                flex: "0 0 240px",
                position: "relative",
              }}
            >
              {/* Scene preview - scaled down */}
              <div style={{
                width: "240px",
                height: "160px",
                overflow: "hidden",
                position: "relative",
              }}>
                <div style={{
                  width: `${240 / 0.25}px`,
                  height: `${160 / 0.25}px`,
                  transform: "scale(0.25)",
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}>
                  <world.Scene state={previewState} onInteract={() => {}} />
                </div>
              </div>

              {/* Card info */}
              <div style={{
                padding: "12px 14px",
                background: `linear-gradient(180deg, ${world.bg}aa 0%, ${world.bg} 100%)`,
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: world.accent,
                  fontWeight: 400,
                }}>
                  {world.title}
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                  color: "rgba(232,228,220,0.35)",
                  textTransform: "uppercase",
                  marginTop: "3px",
                }}>
                  {world.subtitle}
                </div>
              </div>

              {/* Hover overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(255,255,255,0.04)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Random enter button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        onClick={enterRandom}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          marginTop: "2.5rem",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(232,228,220,0.7)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          padding: "10px 24px",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
          e.currentTarget.style.color = "rgba(232,228,220,0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.color = "rgba(232,228,220,0.7)";
        }}
      >
        enter a random world →
      </motion.button>

      {/* Grain overlay */}
      <div className="grain-overlay" />
    </div>
  );
}
