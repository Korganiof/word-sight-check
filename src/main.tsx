import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// index.html carries the prerendered Home markup (scripts/prerender.mjs). On "/"
// React takes it over; on any other route (served the same file by the SPA
// fallback) the markup is for the wrong page, so start from a clean root.
if (root.hasChildNodes() && window.location.pathname === "/") {
  hydrateRoot(root, app);
} else {
  root.textContent = "";
  createRoot(root).render(app);
  document.documentElement.removeAttribute("data-spa");
}
