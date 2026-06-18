// Studio0rbit landing content. Single source of truth for the page copy.
// Kept as a typed object so it can later be driven by Storyblok using the same
// fetch-with-fallback pattern as the demo sites.

export interface Step { n: string; title: string; body: string }
export interface Benefit { title: string; body: string; icon: string }
export interface Faq { q: string; a: string }

export const site = {
  brand: "Studio0rbit",
  city: "Calgary",
  // Working inbox for go-live. Swap to a branded hello@studio0rbit.ca address
  // (with forwarding to this inbox) once the domain is set up.
  email: "aidan.c.moisan@gmail.com",
  formEmail: "aidan.c.moisan@gmail.com", // inbox the contact form delivers to
  // Web3Forms public access key (safe to expose; it's client-side). Get yours in
  // ~30s at https://web3forms.com → enter aidan.c.moisan@gmail.com → copy the key.
  web3formsKey: "a7f4a800-8a6e-442b-9b6f-ac15b3744ca7",
  // Local trust signals (NAP). Add a real click-to-call number to show it on the
  // page — leave "" to hide the phone affordance until you have one.
  phone: "",
  location: "Calgary, AB",
  serviceArea: "Serving Calgary & area",
  nav: [
    { label: "What you get", href: "#benefits" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
    { label: "Templates", href: "/templates" },
    { label: "FAQ", href: "#faq" },
  ],

  hero: {
    eyebrow: "Websites for Calgary shops",
    headline: "Beautifully built. Owned by you.",
    sub: "A beautifully designed, fast website you own outright — built once for one fair price, no monthly fees ever. Mobile-first and made to get your Calgary shop found on Google and turn visitors into calls, bookings, and customers.",
    ctaPrimary: { label: "Get a free website audit", href: "#contact" },
    ctaSecondary: { label: "Browse templates", href: "/templates" },
    trust: [
      "You own everything — domain, hosting & site",
      "Approve the design before you pay",
      "Calgary-based · live in days",
    ],
  },

  problem: {
    heading: "Your customers are looking. Can they find you?",
    body: "Most people search for local shops on their phone. If you have no website — or one that's slow, dated, or clumsy on mobile — they tap the next result instead. You lose the call, the booking, the sale, and you never even know it happened.",
    // Stat sources (for our records — not credited on-page):
    //  98%  → BrightLocal Local Consumer Review Survey 2023
    //  53%  → Google/SOASTA "The Need for Mobile Speed" 2017 (mobile abandonment >3s)
    stats: [
      { value: "98%", label: "of consumers use the internet to find local businesses" },
      { value: "53%", label: "of mobile visitors leave a site that takes over 3 seconds to load" },
      { value: "$0/mo", label: "ongoing fees you ever pay us" },
    ],
  },

  benefits: [
    { icon: "search", title: "Found on Google", body: "Local SEO and a complete business profile so '[your service] near me' finds you — not your competitor." },
    { icon: "bolt", title: "Fast on every phone", body: "Loads in under two seconds. No clunky, dated layouts that bounce customers." },
    { icon: "target", title: "Designed to convert", body: "A polished, custom design — not a tired template — with click-to-call, hours, map, reviews, and booking exactly where they count." },
    { icon: "pencil", title: "Yours to edit", body: "Change text, photos, hours, and menus yourself in a simple visual editor. No code, no waiting on us." },
    { icon: "key", title: "Truly yours", body: "You own the domain, the hosting, and the site. No subscription to us. Ever." },
    { icon: "shield", title: "Low-maintenance by design", body: "No plugins to update, no security treadmill. Built to just keep working." },
  ] as Benefit[],

  how: [
    { n: "01", title: "Free audit", body: "We review your current online presence and show you exactly what's costing you customers — no obligation." },
    { n: "02", title: "We build", body: "Your site, on our fast engine, with your brand, copy, and photos. One fixed price, agreed up front." },
    { n: "03", title: "You own it", body: "We hand over every account, show you how to edit it, and walk away. It's yours — completely." },
  ] as Step[],

  pricing: {
    heading: "One website. One fair price.",
    // Single flat fee — every local-business site ships the same core components.
    // No tiers (they bloat the build & the decision); bigger needs are add-ons.
    offer: {
      name: "The whole website",
      price: "$1,500",
      cadence: "one-time · you own everything",
      blurb: "Everything a local shop needs to get found and win customers — custom-designed, built on our fast engine, and handed over completely. No tiers, no monthly fees.",
      includes: [
        "Custom design — built for your brand, not a tired template",
        "Mobile-first & fast — loads in under two seconds",
        "Found on Google — local SEO + LocalBusiness markup",
        "Everything customers need: services, hours, map, click-to-call, reviews",
        "Online booking or ordering button, wired to your tools",
        "Self-edit visual CMS — change text, photos & hours yourself",
        "Full handover — domain, hosting & site, all in your name",
      ],
      cta: "Get my free audit",
    },
    addons: {
      heading: "Bigger needs? Add them on.",
      note: "Each quoted up front as a one-time add-on — no surprises. Something unusual? We'll give you a custom quote.",
      items: [
        "Online store / e-commerce",
        "Extra pages or sections",
        "Full professional copywriting",
        "Multi-location setup",
        "Photo sourcing & editing",
      ],
    },
    note: "Your only ongoing cost is your domain (~$15/year) and any business tools you already use. Need a change later? We do it as a one-off — pay per change, never a subscription.",
    guarantee: "See your design first — you approve it before you pay the balance. No deposit lost, no risk.",
    compare: {
      heading: "Pay once. Own it forever.",
      body: "A typical “$99/month” website costs you about $3,600 over three years — and you never own it. Stop paying and it vanishes. Ours is one fixed price, then it’s yours: the site, the domain, the accounts. Forever.",
      them: { label: "Subscription site", value: "~$3,600", sub: "over 3 years · you own nothing" },
      us: { label: "Studio0rbit", value: "$1,500", sub: "one time · you own everything" },
    },
  },

  why: {
    heading: "Why shop owners pick us",
    points: [
      { icon: "key", title: "You own everything", body: "No being held hostage by a subscription or an agency that won't hand over your site." },
      { icon: "shield", title: "No monthly fees to us", body: "One-time build, then it's yours. Margin comes from how efficiently we build — not from billing you forever." },
      { icon: "pencil", title: "You can actually edit it", body: "Update hours, photos, and menus yourself in minutes with a visual editor." },
      { icon: "bolt", title: "Fast & local", body: "Most sites go live in days. Built for Calgary shops by someone who gets it." },
    ],
  },

  templates: {
    heading: "See what we build",
    sub: "60 example designs across 20 industries — three distinct directions each. Every one is fast, mobile-first, and yours to own. Click any to explore the full live page; yours is custom-built to your brand.",
    featured: [
      "tmpl-coffee-nordic",
      "tmpl-barber-vintage",
      "tmpl-dining-luxe",
    ],
  },

  faqs: [
    { q: "Do I really own it?", a: "Yes — your domain, hosting, editor, and the site itself are all in your name. We hand over every login at the end." },
    { q: "Are there monthly fees?", a: "None to us. You pay only your domain renewal (~$15/year) and any tools you already use, like Square or Stripe." },
    { q: "Can I edit it myself?", a: "Yes — text, photos, hours, menus, and links, all through a simple visual editor. We train you at handover." },
    { q: "What if I need a design change later?", a: "Layout and design changes are a small one-time job. That's how we keep your price low and your monthly cost at zero." },
    { q: "How long does it take?", a: "Usually days. We move fast because our build system is built for it." },
    { q: "Why not just build it myself on Wix or Squarespace?", a: "You can — but you'll pay monthly forever, spend your weekends fighting it, and most DIY sites end up slow and hard to find on Google. We do it once, properly, then hand you the keys to edit it yourself." },
    { q: "What if something breaks after you hand it over?", a: "It's built static — no plugins to update, no security treadmill, almost nothing to break. If you ever want a change down the road, we quote it as a one-off. No contract, no retainer." },
    { q: "What about bookings and payments?", a: "Those run on your own Square, Stripe, or Shopify account — your money, your fees. We set up the connection." },
    { q: "Do you do maintenance?", a: "No ongoing contracts. Your site is low-maintenance by design. Need a change down the road? We quote it as a one-off." },
  ] as Faq[],

  // Kept for JSON-LD structured data (a real person behind the business). Not
  // rendered as a page section right now — the testimonials section took its slot.
  founder: {
    name: "Aidan Moisan",
    role: "Founder & developer · Studio0rbit",
  },

  testimonials: {
    heading: "What Calgary shop owners say",
    sub: "Real results from real local businesses.",
    // ⚠️ PLACEHOLDER reviews — these are SAMPLE quotes for layout only.
    // Replace every entry with a REAL client quote (with their permission) before
    // publishing. Do NOT deploy these as-is — they are not real reviews yet.
    placeholder: true,
    items: [
      { quote: "The new site paid for itself in the first month — we're getting booking requests from people who'd never have found us before. And I can update the menu myself in two minutes.", name: "Sample Name", business: "Sample Café", area: "Kensington", rating: 5 },
      { quote: "Fast, painless, and exactly what we asked for. No monthly bill, no being locked in. We own everything and it just works.", name: "Sample Name", business: "Sample Barbershop", area: "Beltline", rating: 5 },
      { quote: "Our phone actually rings now. Customers tell us the site looks more professional than shops twice our size.", name: "Sample Name", business: "Sample Studio", area: "Inglewood", rating: 5 },
    ],
  },

  finalCta: {
    heading: "Let's get your shop found.",
    body: "Free audit, no obligation. We'll show you exactly what we'd do — then you decide.",
    cta: { label: "Get my free audit", href: "#contact" },
  },

  contact: {
    heading: "Get your free audit",
    body: "Tell us about your shop and we'll send back a short, specific plan — what's working, what isn't, and what we'd build. You'll hear back within one business day.",
    reassure: "No spam, no sales calls — one helpful reply from a real person.",
    pipaNote: "We use your details only to prepare your audit and reply. Handled per Alberta's PIPA. This form is processed by Web3Forms and the site is hosted on Netlify (both US-based), so your information may be stored or accessed outside Canada.",
  },
} as const;
