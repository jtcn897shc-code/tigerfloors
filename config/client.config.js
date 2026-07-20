// Destura Template — Real Estate (agent / small brokerage): per-client config.
// Fill in a real agent's details, then `node scripts/apply-config.js`.
//
// IDX/MLS note: live listing feeds are a separate vendor subscription the
// client brings (IDX Broker, Realtyna, dsIDXpress — plus their MLS board
// fee). This template is "IDX-ready": the featured-listings section is
// config-driven cards the agent curates, and a vendor feed can later be
// styled to match. Destura styles the feed; it never resells MLS access.
//
// Placeholder content: Elena Marsh, a fictional Fraser Valley realtor.

export default {
  agent: {
    name: "Elena Marsh",
    title: "Fraser Valley Realtor",
    brokerage: "Marsh & Co. Real Estate",
    heroHeadline: "Your next chapter starts with the right guide.",
    tagline: "Buying or selling in the Fraser Valley — local knowledge, honest numbers, and a realtor who answers her phone.",
    phone: "(604) 555-0119",
    phoneHref: "+16045550119",
    email: "elena@marshandco.ca",
    areasServed: ["Abbotsford", "Chilliwack", "Langley", "Mission"],
    bio: "Fifteen years selling homes where I grew up. I price honestly, negotiate hard, and tell you the things other agents won't — including when not to buy.",
  },

  brand: {
    accent: "#8a6d4b",
    accentDark: "#63492c",
    accentTint: "#efe6da",
  },

  stats: [
    { value: "240", suffix: "+", label: "Homes sold" },
    { value: "15", suffix: "", label: "Years in the Valley" },
    { value: "98", suffix: "%", label: "List-to-sale price" },
    { value: "11", suffix: "", label: "Days avg. on market" },
  ],

  listings: [
    { address: "34521 Woodbine Crescent", city: "Abbotsford", price: "$1,149,000", beds: "4", baths: "3", sqft: "2,860", status: "For Sale" },
    { address: "8-45766 Chestnut Lane", city: "Chilliwack", price: "$689,000", beds: "3", baths: "2", sqft: "1,540", status: "For Sale" },
    { address: "2203 Riverbend Terrace", city: "Langley", price: "$1,395,000", beds: "5", baths: "4", sqft: "3,410", status: "Just Listed" },
    { address: "12 Cedarholme Gate", city: "Mission", price: "$874,500", beds: "4", baths: "3", sqft: "2,120", status: "Sold" },
  ],

  neighborhoods: [
    { name: "East Abbotsford", blurb: "Family streets, top school catchments, and the Valley's best sunset views off Sumas Mountain." },
    { name: "Sardis & Vedder", blurb: "Chilliwack's fastest-growing pocket — river trails, new builds, and small-town Saturday markets." },
    { name: "Willoughby", blurb: "Langley's commuter sweet spot: new townhomes, growing amenities, highway access in minutes." },
  ],

  testimonials: [
    { quote: "Elena told us our dream house was overpriced and talked us out of it. Six months later she found us a better one for less. That's the whole review.", name: "Jordan & Priya S., Abbotsford" },
    { quote: "Sold in nine days, over asking, after another agent had it sitting for three months. The difference was the prep and the pricing.", name: "Marcus W., Chilliwack" },
    { quote: "First-time buyers with a thousand questions — she answered every single one, usually within the hour.", name: "Dana K., Langley" },
  ],

  valuation: {
    blurb: "Thinking of selling? Most homeowners are two years out of date on what their place is actually worth. Get a real number — based on live comparables, not an online estimate.",
  },

  faq: [
    { q: "What areas do you cover?", a: "Abbotsford, Chilliwack, Langley, and Mission — the communities I've lived and sold in for fifteen years." },
    { q: "What does it cost to work with you as a buyer?", a: "For buyers, my commission is paid by the seller in almost all cases — my guidance costs you nothing out of pocket." },
    { q: "How do you decide a listing price?", a: "Live comparables, current buyer demand, and an honest walk-through of your home — not a formula, and never a flattering number just to win the listing." },
    { q: "How fast do you respond?", a: "Same day, usually within the hour. Text is fastest. Most deals are won and lost in response time, and I treat it that way." },
    { q: "Can I see homes on evenings or weekends?", a: "Yes — most showings happen outside business hours, and I plan around your schedule, not mine." },
  ],
};
