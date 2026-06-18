import type { ShopContent } from "@studio0rbit/shared";

// All data lifted from https://www.restylesalon.com/ (real client content).
// Prices are NOT published on their site, so service entries carry honest
// category descriptions instead of invented prices.
export const shop: ShopContent = {
  name: "Restyle Salon",
  tagline: "Discover the beauty within you.",
  vertical: "salon",
  phone: "+14033387877",
  address: "#1520 - 6004 Country Hills Blvd NE, Calgary, AB T3N 1A8",
  mapUrl: "https://maps.google.com/?q=Restyle+Salon+6004+Country+Hills+Blvd+NE+Calgary",
  serviceArea: "Calgary & area",
  bookingUrl: "#book",
  hours: [
    { day: "Mon", open: "9:00", close: "19:00" },
    { day: "Tue", open: "9:00", close: "19:00" },
    { day: "Wed", open: "9:00", close: "19:00" },
    { day: "Thu", open: "9:00", close: "19:00" },
    { day: "Fri", open: "9:00", close: "19:00" },
    { day: "Sat", open: "9:00", close: "19:00" },
    { day: "Sun", open: "9:00", close: "19:00" },
  ],
  // Real service categories (Signature Services grid). No public prices —
  // descriptions only, so nothing is fabricated.
  services: [
    { name: "Gents", description: "Haircuts, fades, beard styling and grooming for men." },
    { name: "Ladies", description: "Cuts, layers, blow-outs and finished styling." },
    { name: "Hair Colour", description: "Highlights, balayage and ombré by trained colourists." },
    { name: "Facials", description: "Premium skincare facials tailored to your skin." },
    { name: "Bridal", description: "Complete bridal packages — makeup, hairstyling and pre-wedding treatments." },
    { name: "Threading", description: "Precise, gentle facial threading." },
    { name: "Waxing", description: "Full-body and facial waxing services." },
    { name: "Laser Treatment", description: "Professional laser hair-removal and skin treatments." },
  ],
  reviewsBlurb: "Rated 4.8 across 1,823 Google reviews — one of Calgary's most-loved salons.",
  rating: 4.8,
  geo: { lat: 51.1561, lng: -114.0686 },
  url: "https://www.restylesalon.com/",
};
