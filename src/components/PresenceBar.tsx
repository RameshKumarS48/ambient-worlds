import { usePresenceStore } from "@/store/presenceStore";

export function PresenceBar() {
  const { peers, status } = usePresenceStore();
  const count = peers.length;

  if (status === "disconnected" || status === "error") return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 10px",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(8px)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Dots */}
      <div style={{ display: "flex", gap: "4px" }}>
        {peers.slice(0, 6).map((peer) => (
          <div
            key={peer.id}
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: peer.color,
              opacity: 0.85,
            }}
          />
        ))}
        {peers.length === 0 && (
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
            }}
          />
        )}
      </div>

      {/* Count text */}
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.06em",
          color: "rgba(232,228,220,0.45)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {status === "connecting"
          ? "connecting..."
          : count === 0
          ? "just you"
          : count === 1
          ? "1 person here"
          : `${count} here`}
      </span>
    </div>
  );
}
