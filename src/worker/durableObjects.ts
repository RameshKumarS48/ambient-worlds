import { rainyBedroomInteractions } from "@/worlds/rainy-bedroom/interactions";
import { nightTrainInteractions } from "@/worlds/night-train/interactions";
import { cozyCafeInteractions } from "@/worlds/cozy-cafe/interactions";
import type { WorldState, WorldAction, WorldId } from "@/worlds/registry";

const REDUCERS: Record<string, (s: WorldState, a: WorldAction) => WorldState> = {
  "rainy-bedroom": rainyBedroomInteractions.applyAction,
  "night-train": nightTrainInteractions.applyAction,
  "cozy-cafe": cozyCafeInteractions.applyAction,
};

const INITIAL_STATES: Record<string, WorldState> = {
  "rainy-bedroom": rainyBedroomInteractions.initialState,
  "night-train": nightTrainInteractions.initialState,
  "cozy-cafe": cozyCafeInteractions.initialState,
};

const AVATAR_COLORS = ["#E8B89A", "#A8C5B5", "#C4A8D4", "#F0D080", "#9BB8D4", "#D4A8B8"];

export class WorldRoom {
  private sessions = new Map<string, WebSocket>();
  private presence = new Map<string, { color: string }>();
  private state: WorldState = {};
  private worldId: WorldId | null = null;

  constructor(private readonly _state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      const worldId = url.searchParams.get("worldId") as WorldId | null;
      if (worldId && !this.worldId) {
        this.worldId = worldId;
        this.state = INITIAL_STATES[worldId] ?? {};
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair) as [WebSocket, WebSocket];
      const sessionId = crypto.randomUUID();
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

      server.accept();
      this.sessions.set(sessionId, server);
      this.presence.set(sessionId, { color });

      server.send(JSON.stringify({
        type: "INIT",
        state: this.state,
        presence: this.getPresencePayload(),
      }));

      this.broadcast({ type: "PRESENCE_UPDATE", presence: this.getPresencePayload() }, sessionId);

      server.addEventListener("message", (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data as string);
          if (msg.type === "ACTION" && this.worldId) {
            const reducer = REDUCERS[this.worldId];
            if (reducer) {
              this.state = reducer(this.state, msg.action as WorldAction);
              this.broadcast({ type: "STATE_UPDATE", state: this.state });
            }
          }
        } catch {
          // ignore malformed
        }
      });

      server.addEventListener("close", () => {
        this.sessions.delete(sessionId);
        this.presence.delete(sessionId);
        this.broadcast({ type: "PRESENCE_UPDATE", presence: this.getPresencePayload() });
      });

      server.addEventListener("error", () => {
        this.sessions.delete(sessionId);
        this.presence.delete(sessionId);
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response("Not Found", { status: 404 });
  }

  private broadcast(msg: object, excludeId?: string) {
    const json = JSON.stringify(msg);
    for (const [id, ws] of this.sessions) {
      if (id === excludeId) continue;
      try {
        ws.send(json);
      } catch {
        this.sessions.delete(id);
      }
    }
  }

  private getPresencePayload() {
    return Array.from(this.presence.entries()).map(([id, p]) => ({
      id,
      color: p.color,
    }));
  }
}
