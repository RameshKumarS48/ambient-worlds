import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { nanoid } from "nanoid";

interface ShareButtonProps {
  worldId: string;
  roomId: string;
}

export function ShareButton({ worldId, roomId }: ShareButtonProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const isPublic = roomId === "public";

  const shareUrl = typeof window !== "undefined"
    ? isPublic
      ? `${window.location.origin}/world/${worldId}`
      : `${window.location.origin}/world/${worldId}/${roomId}`
    : "";

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  const createPrivateRoom = () => {
    const id = nanoid(8);
    void navigate({
      to: "/world/$worldId/$roomId",
      params: { worldId, roomId: id },
    });
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.3)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: active ? "rgba(232,228,220,0.8)" : "rgba(232,228,220,0.4)",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "9px",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "3px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      <button onClick={copyUrl} style={btnStyle(copied)}>
        {copied ? "✓ copied" : "share"}
      </button>
      {isPublic && (
        <button onClick={createPrivateRoom} style={btnStyle(false)}>
          private room
        </button>
      )}
    </div>
  );
}
