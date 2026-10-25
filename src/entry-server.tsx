import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "./App";
import { ROUTER_FUTURE } from "./lib/router";

// Build-time prerender (scripts/prerender.mjs): renders a route to static HTML
// so crawlers that don't run JavaScript (most AI search bots) still see the
// content. Only "/" is prerendered; main.tsx hydrates it.
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} future={ROUTER_FUTURE}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}
