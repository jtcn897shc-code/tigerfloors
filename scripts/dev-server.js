// Local demo server — serves the static site AND the /api/chat endpoint
// so the full experience (including the working chatbot) runs from a
// laptop with zero Vercel involvement. This is what powers the
// show-it-on-my-Mac sales pitch.
//
//   node scripts/dev-server.js          → http://localhost:5050
//
// Requires .env.local in the project root containing GEMINI_API_KEY=...
// (copy .env.local.example). Zero dependencies: it imports the exact
// production api/chat.js handler — Node's built-in Request/Response/
// fetch/ReadableStream are the same web APIs the Edge runtime uses, so
// the demo runs identical code to a real deployment.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, normalize } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const PORT = Number(process.env.PORT) || 5050;

// ---- load .env.local into process.env (no dotenv dependency) ----
const envPath = join(root, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
    }
  }
}
if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "\n  WARNING: no GEMINI_API_KEY found (create .env.local from .env.local.example).\n" +
    "  The site will load but the chatbot will show its error fallback.\n"
  );
}

const { default: chatHandler } = await import(join(root, "api", "chat.js"));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // ---- API route: adapt Node req → web Request, call the real handler ----
  if (url.pathname === "/api/chat") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const webReq = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
    });
    try {
      const webRes = await chatHandler(webReq);
      res.writeHead(webRes.status, Object.fromEntries(webRes.headers));
      if (webRes.body) {
        for await (const chunk of webRes.body) res.write(chunk);
      }
      res.end();
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Dev server error: " + err.message);
    }
    return;
  }

  // ---- static files ----
  let filePath = normalize(join(root, url.pathname === "/" ? "index.html" : url.pathname));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }
  try {
    const body = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(500);
    res.end("Error reading file");
  }
}).listen(PORT, () => {
  console.log(`\n  Demo running → http://localhost:${PORT}\n`);
});
