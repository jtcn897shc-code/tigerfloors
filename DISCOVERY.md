# Discovery — TIGER Floors

Source material: two Facebook screenshots (business page "About" panel + a
promo graphic) and the business's own logo image, provided 2026-09-16. No
direct client interview yet — everything below is either lifted verbatim
from those sources or flagged as an open question.

## Confirmed facts (used verbatim on the site)

| Fact | Value | Source |
|---|---|---|
| Business name | TIGER Floors | logo, FB promo graphic |
| Tagline | "Walk in proud" | FB promo graphic |
| Services | Hardwood, Laminate, Vinyl, Tile | FB promo graphic |
| Phone | (604) 783-0173 | FB "Contact info" panel + promo graphic (matches) |
| Email | tigerfloors.sales@gmail.com | FB "Contact info" panel + promo graphic (matches) |
| City | Coquitlam, BC, Canada | FB "Details" panel |
| Category | Home Improvement | FB "Details" panel |
| Offer | Free Estimate | FB promo graphic ("FREE ESTIMATE" badge) |
| Brand mascot | Cartoon tiger in navy workshirt, tool belt, "TIGER FLOORS" name badge | logo image |
| Real marketing copy | "Before & After. A fresh floor makes all the difference." | FB post caption, Sep 4 |
| Review count | 1 review | FB "Details" panel |

Brand colors were sampled directly from pixel values in the logo artwork
(not eyeballed) — see `DESIGN.md` for the exact hex values and the
contrast-check that decided how they're used.

## Reasonably-inferred, flagged as such

- **Service area**: FB bio reads "Serving the Lower Mai..." (truncated by
  the UI). This is almost certainly "Serving the Lower Mainland" (a
  standard BC regional term), but the screenshot cuts off before
  confirming it verbatim or listing specific cities beyond Coquitlam
  itself. The site currently says "Coquitlam & the Lower Mainland" —
  **confirm the exact service-city list** (Port Coquitlam? Port Moody?
  Burnaby? New Westminster? Maple Ridge?) before launch.

## Real photos (added 2026-09-16)

Four client-supplied phone-screenshot photos were cropped (letterboxing
and an OS-injected Photos-viewer chevron button removed programmatically,
not by eyeballing pixel coordinates) and re-encoded to strip EXIF before
use. Materials were confirmed by the client per-photo except one:

| File | Used | Material |
|---|---|---|
| `images/hero-laminate-living-room.jpg` | Hero | Laminate (confirmed) |
| `images/work-hardwood-construction.jpg` | Recent Work | Hardwood (confirmed) |
| `images/work-vinyl-stairs-after.jpg` | Recent Work | Vinyl (confirmed) |
| `images/work-bay-window.jpg` | Recent Work | **Unconfirmed** — client wasn't sure. Captioned generically ("Recent Installation") rather than guessing the material. |

## Open — TODO before launch (blocking)

- [ ] Owner/contact name (currently the site never names an individual —
  it speaks as "TIGER Floors" / "our crew," which is honest given we don't
  have a name, but a name humanizes the About section if one exists)
- [ ] Confirm the material in `images/work-bay-window.jpg` so its caption
  can name it specifically
- [ ] More real photos over time — services cards still use icons, not
  photos, and a rotating/larger gallery would strengthen the site further
- [ ] Confirm full service-area city list (see above)
- [ ] Business hours (FB shows "Always open," which reads like an
  unconfigured FB default rather than a deliberate claim — omitted from
  the site rather than presented as fact)
- [ ] Years in business / any real stats (jobs completed, etc.) — none
  found in the source material, so the site has no numeric trust band.
  If real numbers exist, add them back as a stats section.

## Explicitly not done, and why

- **No testimonials/reviews section.** Only one review exists on Facebook
  and its content wasn't provided. Per the build playbook, testimonials
  are never fabricated — publishing invented reviews for a real business
  is deceptive advertising. Once there are a few real reviews (with
  permission to quote), add a testimonials section back with real quotes,
  or a widget pulling live from Google/Facebook.
- **No lead form.** There's no confirmed form backend, so "Get a Free
  Estimate" CTAs are real `tel:`/`mailto:` links plus the chat concierge
  (which collects the same info conversationally) — never a form that
  posts into nothing.
- **No fake phone/hours precision.** The one placeholder that *would* need
  a fictional number if used doesn't apply here — the real phone number
  was confirmed from two independent sources on the client's own page, so
  it's used directly rather than a `555-01XX` placeholder.
