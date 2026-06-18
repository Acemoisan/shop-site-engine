import type { ShopContent } from "@studio0rbit/shared";

// Eye Candy Optical — independent designer-eyewear boutique, two Calgary studios.
// NO Storyblok on this build (client request): this file is the single source of
// content. The brand owner edits copy here; the operator redeploys. Everything is
// drawn from the client's real site + the audit — no invented prices or policies.

export const shop: ShopContent = {
  name: "Eye Candy Optical",
  tagline: "Independent designer eyewear in Calgary",
  vertical: "retail",
  phone: "403-245-1525",
  address: "1301 17 Avenue SW, Calgary, AB T2T 0C4",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Eye%20Candy%20Optical%201301%2017%20Avenue%20SW%20Calgary",
  serviceArea: "Calgary, Alberta",
  bookingUrl: "#book",
  hours: [],
  services: [],
  url: "https://www.eyecandyeyewear.com",
};

export const email = "info@eyecandyeyewear.com";

// Web3Forms access key — host-agnostic form backend (works on any static deploy;
// Netlify Forms does NOT register on file-digest/drag-drop deploys). This default
// key delivers to the Studio0rbit operator inbox so the form is live at launch.
// ⚠️ SWAP at handoff: the client generates their own key at web3forms.com using
// info@eyecandyeyewear.com, and pastes it here so enquiries reach them directly.
export const web3formsKey = "a7f4a800-8a6e-442b-9b6f-ac15b3744ca7";

export const pipaNote =
  "We use your details only to reply to your enquiry. Handled per Alberta's PIPA. This form is processed by Web3Forms and the site is hosted on Netlify (both US-based), so your information may be stored or accessed outside Canada.";

export interface Location {
  key: string;
  label: string;
  neighbourhood: string;
  street: string;
  city: string;
  phone: string;
  email: string;
  mapUrl: string;
  hours: { day: string; time: string; closed?: boolean }[];
}

export const locations: Location[] = [
  {
    key: "beltline",
    label: "17th Avenue",
    neighbourhood: "Beltline",
    street: "1301 17 Avenue SW",
    city: "Calgary, AB T2T 0C4",
    phone: "403-245-1525",
    email: "info@eyecandyeyewear.com",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Eye%20Candy%20Optical%201301%2017%20Avenue%20SW%20Calgary",
    hours: [
      { day: "Tue – Fri", time: "10am – 6pm" },
      { day: "Saturday", time: "11am – 5pm" },
      { day: "Sun – Mon", time: "Closed", closed: true },
    ],
  },
  {
    key: "oakridge",
    label: "Oakridge",
    neighbourhood: "Oakbay Plaza",
    street: "2515 90 Avenue SW, Suite 139",
    city: "Calgary, AB T2V 0L8",
    phone: "403-281-6099",
    email: "info@oakridgeoptical.ca",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Eye%20Candy%20Optical%202515%2090%20Avenue%20SW%20Calgary",
    hours: [
      { day: "Tue – Fri", time: "10am – 6pm" },
      { day: "Saturday", time: "10am – 2pm" },
      { day: "Sun – Mon", time: "Closed", closed: true },
    ],
  },
];

export interface Frame {
  img: string;
  name: string;
  kind: string;
  body: string;
}

// The "frame wall" — the client's own product photography, re-encoded to WebP.
// Categories describe the real range; no fabricated model names or prices.
export const frames: Frame[] = [
  {
    img: "/img/frame-optical.webp",
    name: "Optical & everyday",
    kind: "Prescription",
    body: "Acetate and titanium frames, fit to your prescription on-site.",
  },
  {
    img: "/img/frame-sport-red.webp",
    name: "Sport & performance",
    kind: "Oakley Prizm",
    body: "Shields built for the road, the trail and the slopes.",
  },
  {
    img: "/img/frame-sport-blue.webp",
    name: "Designer sun",
    kind: "Polarized",
    body: "Statement sunglasses with polarized and mirrored lenses.",
  },
  {
    img: "/img/frame-sport-gold.webp",
    name: "Premium lenses",
    kind: "Cut to order",
    body: "Anti-reflective, blue-light and progressive lenses.",
  },
  {
    img: "/img/frame-sun-round.webp",
    name: "Boutique & vintage",
    kind: "Limited",
    body: "Round, cat-eye and archive shapes the chains don't carry.",
  },
];
