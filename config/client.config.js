// Destura Template — Home Services (flooring installer): per-client config.
// Fill in real details, then `node scripts/apply-config.js`.
//
// Client: TIGER Floors (Coquitlam, BC). Facts below are sourced from the
// client's own Facebook page and logo — see DISCOVERY.md for what's
// confirmed vs. still open. Anything not directly sourced is marked
// TODO in the value itself rather than presented as fact.

export default {
  company: {
    name: "TIGER Floors",
    shortName: "TIGER",
    category: "Flooring Installation",
    tagline: "Walk in proud.", // (confirmed) — client's own tagline, FB promo graphic
    heroHeadline: "Walk in proud of your new floor.",
    subhead: "Hardwood, laminate, vinyl, and tile installation for Coquitlam and the Lower Mainland — every job starts with a free estimate.",
    phone: "(604) 783-0173", // (confirmed) — FB contact info + promo graphic
    phoneHref: "+16047830173",
    email: "tigerfloors.sales@gmail.com", // (confirmed) — FB contact info + promo graphic
    city: "Coquitlam, BC", // (confirmed) — FB details panel
    areasServed: "Coquitlam & the Lower Mainland", // (confirmed base city; "Lower Mainland" inferred from a truncated FB bio — TODO: confirm exact service-city list, see DISCOVERY.md)
    // TODO: add owner/crew name and years in business once confirmed —
    // see DISCOVERY.md. Keep the rendered bio free of raw TODO text.
    bio: "TIGER Floors installs hardwood, laminate, vinyl, and tile floors across Coquitlam and the Lower Mainland. Every quote starts with a free, no-pressure estimate — no work gets booked until you've seen a real number.",
  },

  // Real jobsite photo (confirmed: laminate), client-supplied. Cropped
  // from a phone screenshot and re-encoded to strip EXIF before use —
  // see DISCOVERY.md / DESIGN.md §6 in the build playbook.
  hero: {
    image: "images/hero-laminate-living-room.jpg",
    alt: "Finished laminate flooring in a furnished living room with a fireplace and wall art",
  },

  brand: {
    cream: "#f7f1e6",
    tan: "#ecdfc7",
    ink: "#16262e",
    navy: "#28495a",
    navyDark: "#152530",
    orange: "#e6843b",
    orangeDeep: "#c96a28",
  },

  services: [
    { name: "Hardwood", blurb: "Solid and engineered hardwood installation, built to last and refinish over time.", icon: "plank" },
    { name: "Laminate", blurb: "Durable, budget-friendly flooring that holds up to daily life.", icon: "layers" },
    { name: "Vinyl", blurb: "Waterproof, low-maintenance flooring for kitchens, baths, and busy households.", icon: "roll" },
    { name: "Tile", blurb: "Precision tile installation for kitchens, bathrooms, and entryways.", icon: "grid" },
  ],

  // Real jobsite photos, client-supplied (cropped from phone screenshots,
  // re-encoded to strip EXIF). Materials confirmed by the client except
  // the bay-window shot, which is captioned generically rather than
  // guessing the material — see DISCOVERY.md.
  gallery: {
    kicker: "Recent Work",
    title: "A fresh floor makes all the difference.", // (confirmed) — client's own FB post caption, Sep 4
    blurb: "Real jobs, Coquitlam and the Lower Mainland.",
    slots: [
      {
        image: "images/work-hardwood-construction.jpg",
        label: "Hardwood — Coquitlam",
        alt: "New hardwood flooring installed in an open-concept living space, mid-project",
      },
      {
        image: "images/work-vinyl-stairs-after.jpg",
        label: "Vinyl Stair Treads — Coquitlam",
        alt: "Staircase with new dark vinyl-plank treads, white risers and balusters, finished",
      },
      {
        image: "images/work-bay-window.jpg",
        label: "Recent Installation — Coquitlam",
        alt: "New plank flooring installed in a bright room with a bay window",
      },
    ],
  },

  estimate: {
    blurb: "Every TIGER Floors quote starts with a free, no-obligation estimate. Tell us the room and the material you're considering, and we'll get back to you with a real number.",
  },

  faq: [
    { q: "Do you offer free estimates?", a: "Yes — every job starts with a free, no-obligation estimate before anything gets booked." },
    { q: "What types of flooring do you install?", a: "Hardwood, laminate, vinyl, and tile." },
    { q: "What areas do you serve?", a: "We're based in Coquitlam and serve the surrounding Lower Mainland — ask us to confirm coverage for your address." },
    { q: "How long does an installation take?", a: "It depends on the material and the size of the space. We'll give you a realistic timeline as part of your free estimate." },
    { q: "How do I get started?", a: "Call or text (604) 783-0173, email tigerfloors.sales@gmail.com, or ask Tiger right here on the site." },
  ],
};
