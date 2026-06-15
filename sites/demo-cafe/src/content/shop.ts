import type { ShopContent } from "@studio0rbit/shared";
export const shop: ShopContent = {
  name: "Maple & Steam Café",
  tagline: "Calgary's neighbourhood roastery.",
  vertical: "cafe",
  phone: "+1-403-555-0188",
  address: "455 Kensington Rd NW, Calgary, AB",
  mapUrl: "https://maps.google.com/?q=455+Kensington+Rd+NW+Calgary",
  serviceArea: "Kensington",
  bookingUrl: "https://www.opentable.com",
  hours: [
    { day: "Mon–Fri", open: "7:00", close: "18:00" },
    { day: "Sat–Sun", open: "8:00", close: "17:00" },
  ],
  services: [
    { name: "Flat White", price: "$5", description: "House espresso, microfoam" },
    { name: "Maple Latte", price: "$6", description: "Local maple, double shot" },
    { name: "Sourdough Avocado", price: "$14" },
  ],
  reviewsBlurb: "Loved by Kensington regulars — 4.8★.",
  rating: 4.8,
  geo: { lat: 51.0535, lng: -114.0915 },
  url: "https://maplesteam.example.com",
};
