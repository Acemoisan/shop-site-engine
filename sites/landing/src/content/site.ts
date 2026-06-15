// Studio0rbit landing content. Single source of truth for the page copy.
// Kept as a typed object so it can later be driven by Storyblok using the same
// fetch-with-fallback pattern as the demo sites.

export interface Tier {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  featured?: boolean;
  cta: string;
}
export interface Step { n: string; title: string; body: string }
export interface Benefit { title: string; body: string; icon: string }
export interface Work { name: string; vertical: string; image: string; href: string }
export interface Faq { q: string; a: string }

export const site = {
  brand: "Studio0rbit",
  city: "Calgary",
  email: "hello@studio0rbit.ca", // TODO: confirm real contact before go-live
  nav: [
    { label: "What you get", href: "#benefits" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
    { label: "Work", href: "#work" },
    { label: "FAQ", href: "#faq" },
  ],

  hero: {
    eyebrow: "Websites for Calgary shops",
    headline: "Built fast. Owned by you.",
    sub: "A professional, mobile-first website that gets your shop found on Google and turns visitors into calls, bookings, and customers. One fair price — no monthly fees, ever.",
    ctaPrimary: { label: "Get a free website audit", href: "#contact" },
    ctaSecondary: { label: "See the work", href: "#work" },
    trust: [
      "You own your domain, hosting & site",
      "Edit it yourself, anytime",
      "Live in days, not months",
    ],
  },

  problem: {
    heading: "Your customers are looking. Can they find you?",
    body: "Most people search for local shops on their phone. If you have no website — or one that's slow, dated, or clumsy on mobile — they tap the next result instead. You lose the call, the booking, the sale, and you never even know it happened.",
    stats: [
      { value: "Up to 1 in 3", label: "local small businesses still have no website" },
      { value: "< 2 sec", label: "load time we target on mobile" },
      { value: "$0/mo", label: "ongoing fees you pay us" },
    ],
  },

  benefits: [
    { icon: "search", title: "Found on Google", body: "Local SEO and a complete business profile so '[your service] near me' finds you — not your competitor." },
    { icon: "bolt", title: "Fast on every phone", body: "Loads in under two seconds. No clunky, dated layouts that bounce customers." },
    { icon: "target", title: "Built to convert", body: "Click-to-call, hours, map, reviews, and online booking or ordering exactly where they count." },
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
    heading: "One fair price. No surprises. No monthly bills.",
    note: "Your only ongoing cost is your domain (~$15/year) and any business tools you already use.",
    tiers: [
      {
        name: "Starter",
        price: "$1,800",
        cadence: "one-time, from",
        blurb: "A clean, credible online presence.",
        features: ["Up to 3 sections", "Mobile-first & fast", "Found on Google (local SEO)", "Edit it yourself", "Full account handover"],
        cta: "Get started",
      },
      {
        name: "Growth",
        price: "$3,500",
        cadence: "one-time, from",
        blurb: "Drives calls, bookings, and visits.",
        features: ["Everything in Starter", "4–6 sections / pages", "Online booking or ordering", "Reviews & full copywriting", "Conversion-focused layout"],
        featured: true,
        cta: "Most popular",
      },
      {
        name: "Pro",
        price: "$6,000",
        cadence: "one-time, from",
        blurb: "Online ordering, e-commerce, or multi-location.",
        features: ["Everything in Growth", "E-commerce or online ordering", "Product / menu structured data", "Multi-location ready", "Extra integrations"],
        cta: "Let's talk",
      },
    ] as Tier[],
  },

  why: {
    heading: "Why shop owners pick us",
    points: [
      { title: "You own everything", body: "No being held hostage by a subscription or an agency that won't hand over your site." },
      { title: "No monthly fees to us", body: "One-time build, then it's yours. Margin comes from how efficiently we build — not from billing you forever." },
      { title: "You can actually edit it", body: "Update hours, photos, and menus yourself in minutes with a visual editor." },
      { title: "Fast & local", body: "Most sites go live in days. Built for Calgary shops by someone who gets it." },
    ],
  },

  work: {
    heading: "Recent work",
    sub: "Real sites built on our engine. Every one is fast, mobile-first, and editable by its owner.",
    items: [
      { name: "Ironside Barber Co.", vertical: "Barber · Beltline", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=70&auto=format&fit=crop", href: "#" },
      { name: "Maple & Steam Café", vertical: "Café · Kensington", image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=70&auto=format&fit=crop", href: "#" },
    ] as Work[],
  },

  faqs: [
    { q: "Do I really own it?", a: "Yes — your domain, hosting, editor, and the site itself are all in your name. We hand over every login at the end." },
    { q: "Are there monthly fees?", a: "None to us. You pay only your domain renewal (~$15/year) and any tools you already use, like Square or Stripe." },
    { q: "Can I edit it myself?", a: "Yes — text, photos, hours, menus, and links, all through a simple visual editor. We train you at handover." },
    { q: "What if I need a design change later?", a: "Layout and design changes are a small one-time job. That's how we keep your price low and your monthly cost at zero." },
    { q: "How long does it take?", a: "Usually days. We move fast because our build system is built for it." },
    { q: "What about bookings and payments?", a: "Those run on your own Square, Stripe, or Shopify account — your money, your fees. We set up the connection." },
    { q: "Do you do maintenance?", a: "No ongoing contracts. Your site is low-maintenance by design. Need a change down the road? We quote it as a one-off." },
  ] as Faq[],

  finalCta: {
    heading: "Let's get your shop found.",
    body: "Free audit, no obligation. We'll show you exactly what we'd do — then you decide.",
    cta: { label: "Get my free audit", href: "#contact" },
  },

  contact: {
    heading: "Get your free audit",
    body: "Tell us about your shop and we'll send back a short, specific plan — what's working, what isn't, and what we'd build.",
    // Note: form posts nowhere yet — wire to an email/Formspree endpoint before go-live.
    pipaNote: "We use your details only to prepare your audit and reply. Handled per Alberta's PIPA.",
  },
} as const;
