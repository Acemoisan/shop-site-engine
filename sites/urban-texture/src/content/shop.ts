import type { ShopContent } from "@studio0rbit/shared";
export const shop: ShopContent = {
  name: "Urban Texture Hair Studio",
  tagline: "A luxury salon, with laid-back vibes.",
  vertical: "salon",
  phone: "+14033988260",
  address: "#320, 12024 Sarcee Trail NW, Calgary, AB T3R 0A1",
  mapUrl: "https://maps.google.com/?q=12024+Sarcee+Trail+NW+Calgary+AB+T3R+0A1",
  serviceArea: "Northwest Calgary",
  bookingUrl: "https://urbantexturehairstudio.com/pages/new-guest",
  hours: [
    { day: "Sunday", open: "", close: "", closed: true },
    { day: "Mon–Thu", open: "9:00", close: "21:00" },
    { day: "Friday", open: "9:00", close: "17:00" },
    { day: "Saturday", open: "9:00", close: "16:00" },
  ],
  services: [
    { name: "Custom Colour", price: "$125+", description: "Bespoke colour tailored to you — gloss, root touch-ups, all-over." },
    { name: "Modern Lightening", price: "$250+", description: "Our specialty: balayage, blonding, foils and soft lived-in dimension." },
    { name: "Haircuts", price: "$60+", description: "Precision cuts for long hair, lobs, layers and lived-in shapes." },
    { name: "Blowouts & Styling", price: "$45+", description: "A polished finish for an event — or just because." },
    { name: "K18 & Head Spa Treatments", price: "Ask us", description: "Luxury bond-repair and restorative scalp rituals." },
  ],
  heroImage: "/img/hero-salon.webp",
  reviewsBlurb: "Rated 4.9 stars across 973 Google reviews — Northwest Calgary's most-loved studio for balayage, blonding and lived-in colour.",
  rating: 4.9,
  url: "https://urbantexturehairstudio.com",
};
