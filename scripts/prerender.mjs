// Post-build step: puts the server-rendered Home into dist/index.html, so
// crawlers that don't run JavaScript (most AI search bots) see the content,
// and writes sitemap.xml + robots.txt for the address in .env (VITE_SITE_URL,
// which Vite has already substituted into the canonical link).
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const indexPath = path.join(dist, "index.html");
let html = await readFile(indexPath, "utf8");

const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) throw new Error("prerender: #root placeholder not found in dist/index.html");
html = html.replace(placeholder, `<div id="root">${render("/")}</div>`);
await writeFile(indexPath, html);

const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!canonical || canonical.includes("%")) throw new Error("prerender: canonical URL missing — is VITE_SITE_URL set in .env?");
const site = canonical.replace(/\/$/, "");

await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site}/</loc></url>
</urlset>
`,
);

// Only Home is meant for search results; the test steps and the report are not.
await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /consent
Disallow: /start
Disallow: /task/
Disallow: /exercise/
Disallow: /exercises
Disallow: /results

Sitemap: ${site}/sitemap.xml
`,
);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: Home → dist/index.html, sitemap.xml + robots.txt for ${site}`);
