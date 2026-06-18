import type { ShopContent } from "@studio0rbit/shared";

// Astro Systems — Calgary structured-home-wiring / smart-home integrator,
// established 1974. NO Storyblok on this build: this file is the single source
// of content. The operator edits copy here and redeploys. Everything is drawn
// from the client's real site (astrosystems.ca, June 2026) + the audit — no
// invented numbers, prices, reviews, hours, or address.

export const shop: ShopContent = {
  name: "Astro Systems",
  tagline: "Fully integrated home wiring for Calgary homes",
  vertical: "trades",
  phone: "403-243-8800",
  // No public storefront — a by-appointment / builder-channel business, so we
  // present a service area rather than a street address or map pin.
  address: "Calgary, Alberta & area",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Astro%20Systems%20Calgary",
  serviceArea: "Calgary, Alberta & surrounding area",
  bookingUrl: "#quote",
  hours: [],
  services: [],
  url: "https://www.astrosystems.ca",
};

export const email = "info@astrosystems.ca";
export const tollFree = "888-662-5727";
export const established = "1974";

// Sister business cross-link (their current site links to it) — central vacuum.
export const centralVacUrl = "https://www.vacuumwholesalers.com";

// Web3Forms access key — host-agnostic form backend (works on any static deploy).
// This default key delivers to the Studio0rbit operator inbox so the quote form
// is live at launch. ⚠️ SWAP at handoff: the client generates their own key at
// web3forms.com using info@astrosystems.ca and pastes it here so quote requests
// reach them directly.
export const web3formsKey = "a7f4a800-8a6e-442b-9b6f-ac15b3744ca7";

export const pipaNote =
  "We use your details only to respond to your enquiry. Handled per Alberta's PIPA. This form is processed by Web3Forms and the site is hosted on Cloudflare Pages (both US-based), so your information may be stored or accessed outside Canada.";

export interface System {
  icon: string;
  kind: string;
  name: string;
  body: string;
}

// The five systems — mapped directly from their five service pages.
export const systems: System[] = [
  {
    icon: "bolt",
    kind: "The backbone",
    name: "Structured Wiring",
    body: "Cables run from every room to a central media centre, then distributed with modules and panels — audio, video, voice and data on one network. Choose a pre-configured panel or a custom set of modules to match your home.",
  },
  {
    icon: "monitor",
    kind: "Entertainment",
    name: "Audio & Video",
    body: "Watch any source or play your music in any room. Video sources programmed to channels, multi-room audio zones, in-wall and ceiling speakers, and IR keypads or remotes to control it all from anywhere in the house.",
  },
  {
    icon: "wifi",
    kind: "Connectivity",
    name: "Home Networking",
    body: "Data jacks in every room for computers, printers, scanners and high-speed internet, plus voice wiring with up to four phone lines per plate. Built to keep pace as technology changes.",
  },
  {
    icon: "shield",
    kind: "Peace of mind",
    name: "Security & Monitoring",
    body: "Camera and intercom modules, motion detectors, and burglar and smoke detectors integrated into your wiring — with scheduled security lighting and the option of 24-hour monitoring. See your front door from any TV in the house.",
  },
  {
    icon: "cpu",
    kind: "Smart home",
    name: "Home Automation",
    body: "The same network that links your computers and entertainment can control lighting, thermostat and appliances by remote — and access linked systems even when you're away. A sound, adaptable investment that adds value to your home.",
  },
];

export interface Benefit {
  icon: string;
  title: string;
  body: string;
}

// "Why Astro" — from their benefits page.
export const benefits: Benefit[] = [
  {
    icon: "check",
    title: "Scalable & affordable",
    body: "Structured wiring fits any budget — start with the options you want and add more as you go. You choose the level of every system.",
  },
  {
    icon: "home",
    title: "Adds value to your home",
    body: "Quality wiring for today and the future is a sound investment that makes your home more enjoyable to live in — and worth more when you sell.",
  },
  {
    icon: "wrench",
    title: "Future-proof & expandable",
    body: "As electronics evolve, your wiring keeps pace — from high-speed internet to emerging technologies. Pre-wire now, expand whenever you like.",
  },
  {
    icon: "award",
    title: "Trusted since 1974",
    body: "Only the finest components from reputable manufacturers, installed with decades of home-wiring experience and solid workmanship you can trust.",
  },
];

export interface Step {
  n: string;
  title: string;
  body: string;
}

export const processSteps: Step[] = [
  {
    n: "01",
    title: "Plan it with you",
    body: "We talk through how you live — the rooms, the systems, the budget — and design the wiring to suit your home, whether it's a new build or an upgrade.",
  },
  {
    n: "02",
    title: "Wire to a media centre",
    body: "Cables run from each room to a central media centre, distributed through an innovative selection of modules and panels — entertainment, data, voice and security on one tidy network.",
  },
  {
    n: "03",
    title: "Expand anytime",
    body: "Add channels, rooms, speakers or automation as your needs change. Because it's structured, growing the system later is simple — no tearing into walls.",
  },
];

export interface Gear {
  img: string;
  name: string;
  body: string;
}

// Real product photos pulled from the client's own site (astrosystems.ca),
// re-encoded to WebP. Small studio shots of the actual gear they install —
// kept at native size so they stay crisp (never upscaled). Cartoon clip-art
// from the old site (the CRT TV, camcorder, etc.) was deliberately rejected.
export const gear: Gear[] = [
  {
    img: "/img/media-centre.webp",
    name: "Central media centre",
    body: "The structured-wiring panels and modules everything runs back to.",
  },
  {
    img: "/img/wall-plate.webp",
    name: "In-room wall plates",
    body: "Coax, data and phone jacks placed exactly where you need them.",
  },
  {
    img: "/img/ceiling-speaker.webp",
    name: "In-ceiling speakers",
    body: "Flush-mounted audio that blends into any room.",
  },
  {
    img: "/img/security-keypad.webp",
    name: "Security keypads",
    body: "Arm, disarm and monitor your home from the wall.",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "What is structured wiring?",
    a: "It's a single, organized network of cabling run from every room to a central media centre. From there, audio, video, voice, data and security are distributed using modules and panels — so one tidy system handles everything, instead of a tangle of one-off runs.",
  },
  {
    q: "Is this for new homes or existing ones?",
    a: "Both. Structured wiring is easiest and most affordable to install during construction, so we work closely with home builders — but we can also plan upgrades for homes that are already built. Call us to talk through your situation.",
  },
  {
    q: "Do you work with my home builder?",
    a: "Yes. Much of our work is integrated into new homes during the build, and we have wired show homes you can visit. If you're building, get us involved early so the wiring is designed in from the start.",
  },
  {
    q: "Can I start small and add more later?",
    a: "Absolutely. The system is scalable — choose the options you want now, and because everything runs back to a central point, you can add channels, audio zones, security or automation down the road without major renovation.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Calgary and the surrounding area. Call (403) 243-8800 or toll-free (888) 662-5727, or send a quote request and we'll get back to you.",
  },
];
