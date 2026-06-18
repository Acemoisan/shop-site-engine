import type { ShopContent } from "@studio0rbit/shared";

// Real data lifted from gallerytstudio.com + their Contact page (2026-06-17).
// NOTE ON PRICING: Gallery T does not publish prices on their current site or
// social — exact rates are quoted on consultation (varies by hair length /
// service). Services below are their REAL named specialties; the "Quoted on
// consultation" note is an honest placeholder, NOT invented prices.
export const shop: ShopContent = {
  name: "Gallery T Hair Studio",
  tagline: "Northwest Calgary's gallery for hair.",
  vertical: "salon",
  heroImage: "/img/hero-interior.webp",
  phone: "+14033749114",
  address: "#14 735 Ranchlands Blvd NW, Calgary, AB T3G 3A9",
  mapUrl: "https://maps.google.com/?q=735+Ranchlands+Blvd+NW+Calgary+AB",
  serviceArea: "Ranchlands & northwest Calgary",
  bookingUrl: "https://phorest.com/book/salons/gallerythairsalon",
  hours: [
    { day: "Tue – Fri", open: "10:00", close: "18:00" },
    { day: "Saturday", open: "10:00", close: "17:00" },
    { day: "Sun – Mon", open: "", close: "", closed: true },
  ],
  services: [
    { name: "Cut & Style", description: "Precision cut and finish for women & men.", price: "Quoted on consultation" },
    { name: "Korean Perm", description: "Soft, lasting waves — a studio specialty.", price: "Quoted on consultation" },
    { name: "Korean Straightening", description: "Smooth, sleek magic-straight treatment.", price: "Quoted on consultation" },
    { name: "Colour — Blonde & Highlights", description: "Full colour, foils and lightening.", price: "Quoted on consultation" },
    { name: "Balayage & Ombré", description: "Hand-painted, grown-out-soft dimension.", price: "Quoted on consultation" },
    { name: "Bridal & Event Updo", description: "Wedding hair and special-occasion styling.", price: "Quoted on consultation" },
  ],
  reviewsBlurb: "4.8 out of 5 from 385 Google reviews — Ranchlands' most-loved studio.",
  rating: 4.8,
  geo: { lat: 51.1209, lng: -114.1816 },
  url: "https://www.gallerytstudio.com/",
};
