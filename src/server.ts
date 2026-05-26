import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { WorldRoom } from "./worker/durableObjects";

export { WorldRoom };

interface Env {
  WORLD_ROOM: DurableObjectNamespace;
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: Env, ctx: unknown) {
    const url = new URL(request.url);

    // Route WebSocket room requests to Durable Object
    // Pattern: /api/room/:worldId/:roomId/ws
    if (url.pathname.startsWith("/api/room/")) {
      const parts = url.pathname.split("/").filter(Boolean);
      // parts: ["api", "room", worldId, roomId, "ws"]
      if (parts.length === 5 && parts[4] === "ws") {
        const worldId = parts[2];
        const roomId = parts[3];
        const doName = roomId === "public" ? worldId : roomId;
        const id = env.WORLD_ROOM.idFromName(doName);
        const stub = env.WORLD_ROOM.get(id);

        // Forward to DO with worldId as query param
        const doUrl = new URL(request.url);
        doUrl.pathname = "/ws";
        doUrl.searchParams.set("worldId", worldId);
        return stub.fetch(new Request(doUrl.toString(), request));
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      const msg = error instanceof Error
        ? `${error.name}: ${error.message}\n${error.stack ?? ""}`
        : String(error);
      console.error("[worker-crash]", msg);
      return brandedErrorResponse();
    }
  },
};
