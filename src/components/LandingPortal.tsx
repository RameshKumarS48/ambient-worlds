import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { WORLDS, WORLD_IDS, type WorldId } from "@/worlds/registry";

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
        style={{ textAlign: "center", marginBottom: "2.5rem" }}
      >
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(2.2rem, 5vw, 4rem)",
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
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "0.875rem",
        width: "100%",
        maxWidth: "1100px",
        padding: "0 0.5rem",
      }}>
        {WORLD_IDS.map((id, i) => {
          const world = WORLDS[id];

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.18 } }}
              onClick={() => enterWorld(id)}
              style={{
                cursor: "pointer",
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
                background: world.bg,
                position: "relative",
              }}
            >
              {/* Image preview */}
              <div style={{
                width: "100%",
                height: "130px",
                backgroundImage: `url('/worlds/${id}.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
                }} />
              </div>

              {/* Card info */}
              <div style={{
                padding: "10px 12px 12px",
                background: `linear-gradient(180deg, ${world.bg}ee 0%, ${world.bg} 100%)`,
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.05rem",
                  fontStyle: "italic",
                  color: world.accent,
                  fontWeight: 400,
                }}>
                  {world.title}
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.52rem",
                  letterSpacing: "0.1em",
                  color: "rgba(232,228,220,0.3)",
                  textTransform: "uppercase",
                  marginTop: "3px",
                  lineHeight: 1.4,
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
                  background: "rgba(255,255,255,0.03)",
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
          marginTop: "2rem",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(232,228,220,0.65)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          padding: "9px 22px",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
          e.currentTarget.style.color = "rgba(232,228,220,0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "rgba(232,228,220,0.65)";
        }}
      >
        enter a random world →
      </motion.button>

      {/* Grain overlay */}
      <div className="grain-overlay" />
    </div>
  );
}
