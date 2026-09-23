import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { spawn } from "node:child_process";

const DIST = "dist";
const PORT = 4183;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const routesFromSitemap = async () => {
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf-8");
  return [...xml.matchAll(/<loc>https:\/\/agregatory\.pro([^<]*)<\/loc>/g)]
    .map((m) => m[1] || "/")
    .filter((r) => !r.includes("."));
};

const startServer = async () => {
  const index = await readFile(join(DIST, "index.html"), "utf-8");
  const server = createServer(async (req, res) => {
    const url = decodeURIComponent((req.url || "/").split("?")[0]);
    const file = join(DIST, url);
    if (extname(url) && existsSync(file)) {
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": MIME[extname(url)] || "application/octet-stream" });
      return res.end(body);
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(index);
  });
  await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
  return server;
};

const findChrome = () => {
  for (const p of ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"]) {
    if (existsSync(p)) return p;
  }
  return null;
};

const dumpRoute = (chrome, route) =>
  new Promise((resolve) => {
    const args = [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--virtual-time-budget=7000",
      "--timeout=20000",
      "--dump-dom",
      `http://127.0.0.1:${PORT}${route}`,
    ];
    const child = spawn(chrome, args, { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (c) => (out += c));
    const kill = setTimeout(() => child.kill("SIGKILL"), 30000);
    child.on("close", () => {
      clearTimeout(kill);
      resolve(out);
    });
  });

const main = async () => {
  const chrome = findChrome();
  if (!chrome) {
    console.log("prerender: chromium не найден, пропускаем");
    return;
  }

  const routes = await routesFromSitemap();
  const server = await startServer();
  console.log(`prerender: ${routes.length} страниц`);

  let ok = 0;
  for (const route of routes) {
    const html = await dumpRoute(chrome, route);
    if (!html || !html.includes("<div id=\"root\">")) {
      console.log(`  ✗ ${route}`);
      continue;
    }
    const target = route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html, "utf-8");
    ok++;
  }

  server.close();
  console.log(`prerender: готово ${ok}/${routes.length}`);
};

main().catch((e) => {
  console.error("prerender:", e.message);
  process.exit(0);
});
