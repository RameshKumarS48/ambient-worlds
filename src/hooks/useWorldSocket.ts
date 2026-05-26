import { useEffect, useRef, useCallback } from "react";
import { useWorldStore } from "@/store/worldStore";
import { usePresenceStore } from "@/store/presenceStore";
import type { WorldAction, WorldId } from "@/worlds/registry";
import { WORLDS } from "@/worlds/registry";

export function useWorldSocket(worldId: WorldId, roomId: string) {
  const applyLocalAction = useWorldStore((s) => s.applyLocalAction);
  const receiveServerState = useWorldStore((s) => s.receiveServerState);
  const setPeers = usePresenceStore((s) => s.setPeers);
  const setStatus = usePresenceStore((s) => s.setStatus);
  const wsRef = useRef<WebSocket | null>(null);
  const world = WORLDS[worldId];

  const dispatch = useCallback(
    (action: WorldAction) => {
      applyLocalAction(action, world.applyAction);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ACTION", action }));
      }
    },
    [applyLocalAction, world.applyAction],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${window.location.host}/api/room/${worldId}/${roomId}/ws`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => setStatus("connected");
    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("error");

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data as string);
        if (msg.type === "INIT" || msg.type === "STATE_UPDATE") {
          receiveServerState(msg.state ?? {});
        }
        if (msg.type === "INIT" || msg.type === "PRESENCE_UPDATE") {
          setPeers(msg.presence ?? []);
        }
      } catch {
        // malformed message
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
      setStatus("disconnected");
    };
  }, [worldId, roomId, receiveServerState, setPeers, setStatus]);

  return { dispatch };
}
