// Destura Template (home services / flooring) — instantiate a client from
// config/client.config.js. Generates index.html, css/client-tokens.css,
// and api/knowledge.js. Zero dependencies: node scripts/apply-config.js
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import config from "../config/client.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function expandRepeat(html, key, rows) {
  const re = new RegExp(`<!-- REPEAT:${key} -->([\\s\\S]*?)<!-- END:${key} -->`);
  const match = html.match(re);
  if (!match) return html;
  const snippet = match[1];
  const expanded = rows
    .map((row) => {
      let s = snippet;
      for (const [token, value] of Object.entries(row)) {
        s = s.split(`{{${token}}}`).join(value);
      }
      return s;
    })
    .join("");
  return html.replace(re, () => expanded); // function form: content with "$" must not trigger replacement-pattern backreferences
}

function replaceScalar(html, tokens) {
  let out = html;
  for (const [token, value] of Object.entries(tokens)) {
    out = out.split(`{{${token}}}`).join(value);
  }
  return out;
}

// Small inline icon set — flooring materials, not generic tools. Stroke
// style matches the nav phone glyph already in the template (24 viewBox,
// stroke-width 2, currentColor). Raw SVG markup, so callers must NOT
// escapeHtml() the result.
const ICONS = {
  plank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="9" width="20" height="6" rx="1"/><path d="M6 9v6M12 9v6M18 9v6"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>`,
  roll: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M5 12c1.2-1.6 2.4-1.6 3.6 0s2.4 1.6 3.6 0 2.4-1.6 3.6 0 2.4 1.6 3.6 0"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>`,
  hardwood: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="9" width="20" height="6" rx="1"/><path d="M6 9v6M12 9v6M18 9v6"/></svg>`,
  tile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>`,
  vinyl: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M5 12c1.2-1.6 2.4-1.6 3.6 0s2.4 1.6 3.6 0 2.4-1.6 3.6 0 2.4 1.6 3.6 0"/></svg>`,
};

function buildIndexHtml() {
  let html = readFileSync(join(root, "template", "index.html"), "utf8");

  const serviceRows = config.services.map((s) => ({
    SERVICE_ICON: ICONS[s.icon] || "",
    SERVICE_NAME: escapeHtml(s.name),
    SERVICE_BLURB: escapeHtml(s.blurb),
  }));
  html = expandRepeat(html, "materials", serviceRows);
  html = expandRepeat(html, "services", serviceRows);
  html = expandRepeat(
    html,
    "gallery",
    config.gallery.slots.map((g) => ({
      GALLERY_IMAGE: escapeHtml(g.image),
      GALLERY_ALT: escapeHtml(g.alt),
      GALLERY_LABEL: escapeHtml(g.label),
    }))
  );
  html = expandRepeat(html, "faq", config.faq.map((f) => ({ FAQ_Q: escapeHtml(f.q), FAQ_A: escapeHtml(f.a) })));

  html = replaceScalar(html, {
    COMPANY_NAME: escapeHtml(config.company.name),
    SHORT_NAME: escapeHtml(config.company.shortName),
    CATEGORY: escapeHtml(config.company.category),
    TAGLINE: escapeHtml(config.company.tagline),
    HERO_HEADLINE: escapeHtml(config.company.heroHeadline),
    SUBHEAD: escapeHtml(config.company.subhead),
    PHONE: escapeHtml(config.company.phone),
    PHONE_HREF: escapeHtml(config.company.phoneHref),
    EMAIL: escapeHtml(config.company.email),
    CITY: escapeHtml(config.company.city),
    AREAS_SERVED: escapeHtml(config.company.areasServed),
    BIO: escapeHtml(config.company.bio),
    HERO_IMAGE: escapeHtml(config.hero.image),
    HERO_ALT: escapeHtml(config.hero.alt),
    ESTIMATE_BLURB: escapeHtml(config.estimate.blurb),
    GALLERY_KICKER: escapeHtml(config.gallery.kicker),
    GALLERY_TITLE: escapeHtml(config.gallery.title),
    GALLERY_BLURB: escapeHtml(config.gallery.blurb),
    CURRENT_YEAR: String(new Date().getFullYear()),
  });

  writeFileSync(join(root, "index.html"), html);
}

function buildClientTokensCss() {
  const b = config.brand;
  const css = `/* GENERATED by scripts/apply-config.js from config/client.config.js — do not hand-edit. */
:root {
  --cream: ${b.cream};
  --tan: ${b.tan};
  --ink: ${b.ink};
  --navy: ${b.navy};
  --navy-dark: ${b.navyDark};
  --orange: ${b.orange};
  --orange-deep: ${b.orangeDeep};
}
`;
  writeFileSync(join(root, "css", "client-tokens.css"), css);
}

function buildKnowledgeJs() {
  const js = `// GENERATED by scripts/apply-config.js from config/client.config.js — do not hand-edit.
// Edit config/client.config.js and re-run the script instead.
export default {
  company: ${JSON.stringify(config.company, null, 2)},
  services: ${JSON.stringify(config.services, null, 2)},
  faq: ${JSON.stringify(config.faq, null, 2)},
  systemPreamble: \`You are "Ask Tiger," the website assistant for ${config.company.name}, a flooring installer based in ${config.company.city}, serving ${config.company.areasServed}.

Your job: answer visitor questions clearly and briefly, using ONLY the facts provided in this system context (company info, services, FAQ). Never invent pricing, timelines, warranty terms, credentials, or licensing claims not in that data.

ESTIMATES: you cannot price a job yourself and must never guess a number. If someone wants a quote, that's a lead — warmly collect what the team needs to follow up (what room/space, which flooring type, and the best way to reach them), then tell them the team will follow up with a real free estimate. End that message with the literal marker [[BOOK_CTA]].

Tone: friendly, plainspoken, a little proud (the company's own tagline is "Walk in proud") — not salesy, no hype, no exclamation-point overload.

Scope: if asked something unrelated to flooring or ${config.company.name}, politely decline and steer back.

Contact: whenever the visitor is ready to book an estimate, or has been asking pricing/scheduling questions, end your message with the literal marker [[BOOK_CTA]] on its own at the very end. Only when genuinely appropriate — not every message.

Keep replies short — a few sentences at most.\`,
};
`;
  writeFileSync(join(root, "api", "knowledge.js"), js);
}

buildIndexHtml();
buildClientTokensCss();
buildKnowledgeJs();

console.log(`Applied config for "${config.company.name}":`);
console.log("  - index.html");
console.log("  - css/client-tokens.css");
console.log("  - api/knowledge.js");
