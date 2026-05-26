import { motion } from "framer-motion";
import type { WorldMeta } from "@/worlds/registry";

interface AudioGateProps {
  world: WorldMeta;
  onUnlock: () => void;
}

export function AudioGate({ world, onUnlock }: AudioGateProps) {
  return (
    <motion.div
      className="audio-gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ background: world.bg }}
      onClick={onUnlock}
    >
      {/* World name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(2.5rem, 8vw, 6rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: world.accent,
          textAlign: "center",
          lineHeight: 1.1,
          margin: 0,
          padding: "0 1rem",
        }}
      >
        {world.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#e8e4dc",
          marginTop: "1.5rem",
          textAlign: "center",
        }}
      >
        {world.subtitle}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#e8e4dc",
          marginTop: "3rem",
          textAlign: "center",
        }}
      >
        tap anywhere to enter
      </motion.p>
    </motion.div>
  );
}
