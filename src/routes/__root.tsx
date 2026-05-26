import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div style={{
      display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center",
      background: "#0a0a0c", color: "#e8e4dc",
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "5rem", fontWeight: 300, fontStyle: "italic", margin: 0 }}>404</h1>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(232,228,220,0.4)", marginTop: "0.5rem" }}>
          no world here
        </p>
        <Link to="/" style={{ display: "inline-block", marginTop: "2rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(232,228,220,0.5)", textTransform: "uppercase", textDecoration: "none" }}>
          ← back to worlds
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div style={{
      display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center",
      background: "#0a0a0c", color: "#e8e4dc",
    }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic" }}>
          Something broke
        </h1>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: "rgba(232,228,220,0.4)", letterSpacing: "0.05em" }}>
          {error.message}
        </p>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={() => { router.invalidate(); reset(); }}
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#e8e4dc", padding: "8px 16px", cursor: "pointer", borderRadius: "3px" }}
          >
            Try again
          </button>
          <a href="/" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(232,228,220,0.5)", padding: "8px 16px", borderRadius: "3px", textDecoration: "none" }}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ambient Worlds" },
      { name: "description", content: "Drop into tiny living scenes. Interactive ambient worlds you can share." },
      { name: "theme-color", content: "#0a0a0c" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Ambient Worlds" },
      { property: "og:site_name", content: "Ambient Worlds" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
