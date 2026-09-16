# Design system — TIGER Floors

## Palette — sampled from the real logo, not eyeballed

Pixel-sampled from the client's own logo artwork (`images/tiger-mark.png`)
via a k-modal color extraction, then rounded to clean hex.

| Token | Hex | Role |
|---|---|---|
| `--cream` | `#f7f1e6` | Page background, light sections |
| `--tan` | `#ecdfc7` | Alternate light section background |
| `--ink` | `#16262e` | **The workhorse text color.** All body copy, links, small labels, on any light ground. |
| `--navy` | `#28495a` | Brand mid-navy. Buttons, borders, icon fills, badges. |
| `--navy-dark` | `#152530` | Deep navy. Full dark-section backgrounds only (stats strip, CTA band, footer, chat overlay). |
| `--orange` | `#e6843b` | Brand accent. **Fill only** — see rule below. |
| `--orange-deep` | `#c96a28` | Orange hover/pressed state. |

### The contrast rule (the highest-leverage decision in this build)

Measured with the actual WCAG relative-luminance formula, not guessed:

- **Orange text on `--cream`/`--tan`: 2.4:1.** Fails outright, any size.
  Orange never carries text on a light background.
- **Orange text on `--navy` (mid-tone): 3.5:1.** Passes only for *large*
  text (≥24px, or ≥18.66px bold) — WCAG's large-text threshold is 3:1.
  Fine for a big stat numeral or a headline word; never for body copy,
  labels, or a kicker at 12px.
- **Orange text on `--navy-dark` (deep): 5.8:1.** Passes AA for normal
  text. This is *why* the dark sections use the deeper navy, not the
  brand mid-navy, as their background — it's the only ground where
  orange is legible as anything other than large display type.
- **`--ink` on orange fill: 5.7:1.** Passes. Button labels on an orange
  button use `--ink`, never white/cream (`--cream` on orange is 2.4:1,
  fails).
- **`--ink` on `--cream`/`--tan`: 13.8:1 / 11.8:1.** Excellent — `--ink` is
  the default text color everywhere on light grounds.
- **`--cream` on `--navy-dark`: 14:1.** Excellent — text on dark sections
  is cream/white, not orange, except for the large-display exception
  above.

**The rule in one sentence:** orange is a fill (buttons, borders, icon
glyphs, badges, and large display numerals on the deep-navy ground only)
— it is never a text color, never a link color, and never a kicker color,
on any background. Ink carries every other text role, light ground or
dark.

## Typography

One variable font family for both display and body: **Archivo** (Google
Fonts), which ships both a weight axis (100–900) and a width axis
(condensed–expanded). That gives a bold, condensed poster face for
headlines — matching the blocky badge lettering in the actual TIGER
Floors logo — and a normal-width UI face for body copy, from a single
font download instead of two unrelated families.

- Display / headlines: Archivo, weight 800–900, width condensed (~87.5%)
- Body: Archivo, weight 400–600, width normal (100%)

## Spacing / type scale

Reused from the base template (already a sound, generous editorial
scale) — see `:root` in `css/styles.css` for the concrete `--sp-*` and
`--text-*` tokens. Not category-specific, so no reason to redo it.

## Motion

Reused from the base template's reveal-on-scroll + count-up system
(`js/main.js`), which already ships the reduced-motion and no-JS
fallbacks the build playbook requires: `[data-reveal]` elements are
`opacity:1` by default and only animate once JS confirms
`IntersectionObserver` support and the visitor hasn't requested reduced
motion. No new motion was added for this client beyond what the base
template already had gated correctly.

## Category clichés — actively designed away from

Home-improvement/flooring-contractor sites lean hard on a specific set of
visual tics. Naming them here so the build doesn't reach for them by
default:

- **Glossy showroom stock photography** (a fanned-out paint-swatch shot,
  a hand pressing a laminate sample against a wall) — generic and
  immediately reads as a template. Real jobsite photos (pending) beat
  this regardless.
- **Tool-icon soup** — hammer/saw/tape-measure icons standing in for the
  actual product. The product is the *floor*; the icons on this site
  represent flooring materials (a plank, a tile grid), not generic tools.
- **A spinning color-wheel or swatch-picker gimmick** for "choose your
  finish" — a real material sample photo will always beat a CSS color
  swatch once photos exist.
- **Empty "quality craftsmanship" copy** with no specific claim behind
  it. Every claim on this site is either a confirmed fact (see
  `DISCOVERY.md`) or phrased as what the company *does* (installs X, Y,
  Z; gives free estimates) rather than an unverifiable quality claim.
- **The generic contractor navy-and-orange "handyman clip-art" look.**
  This business's navy/orange isn't arbitrary — it's sampled straight
  from a real, distinctive mascot logo. The design leans on the mascot's
  personality (a specific illustrated character with a name and a
  uniform) rather than flattening the palette into generic clip-art
  angled-stripe backgrounds.
