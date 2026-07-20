// Destura Template — Real estate concierge.
// Same shape as destura-portfolio's api/chat.js: Vercel Edge Function,
// zero npm dependencies, native fetch, streaming proxy to Gemini,
// re-emits plain text deltas so the frontend stays provider-agnostic.
import knowledge from "./knowledge.js";

export const config = { runtime: "edge" };

const MAX_MESSAGES = 20;
const MAX_CHARS = 800;
const HISTORY_WINDOW = 8;

function buildSystemPrompt() {
  const { agent, stats, listings, neighborhoods, faq, systemPreamble } = knowledge;

  const statsText = stats.map((s) => `- ${s.value}${s.suffix || ""} ${s.label}`).join("\n");
  const listingsText = listings
    .map((l) => `- ${l.address}, ${l.city} — ${l.price}, ${l.beds} bed / ${l.baths} bath, ${l.sqft} sqft (${l.status})`)
    .join("\n");
  const hoodsText = neighborhoods.map((n) => `- ${n.name}: ${n.blurb}`).join("\n");
  const faqText = faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  return `${systemPreamble}

AGENT INFO
Name: ${agent.name} (${agent.title}, ${agent.brokerage})
Phone (call or text): ${agent.phone}
Email: ${agent.email}
Areas served: ${agent.areasServed.join(", ")}
About: ${agent.bio}

TRACK RECORD
${statsText}

CURRENT FEATURED LISTINGS
${listingsText}

NEIGHBORHOOD KNOWLEDGE
${hoodsText}

FAQ
${faqText}`;
}

function badRequest(message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const messages = body && body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return badRequest("messages must be a non-empty array");
  }
  if (messages.length > MAX_MESSAGES) {
    return badRequest("Too many messages");
  }
  for (const m of messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > MAX_CHARS
    ) {
      return badRequest("Malformed message");
    }
  }

  const trimmed = messages.slice(-HISTORY_WINDOW);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("Server misconfigured: missing API key", { status: 500 });
  }

  const MODEL = "gemini-3.5-flash";
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: trimmed.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.6,
        thinkingConfig: { thinkingLevel: "minimal" },
      },
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return new Response("Upstream error: " + errText, { status: 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;

            let event;
            try {
              event = JSON.parse(data);
            } catch {
              continue;
            }

            const text = event?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
