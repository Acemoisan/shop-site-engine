import type { ShopContent } from "@studio0rbit/shared";

// All data sourced from the client's live site (artisticsalon.ca), Google
// Business Profile (4.9★ / 719 reviews), and the audit. No online-booking
// platform is published on their current site, so the booking action is
// call-to-book / free consultation via tel:. Surface as a paid add-on later.
export const shop: ShopContent = {
  name: "Artistic Salon",
  tagline: "Calgary's hair, perfected for over 35 years.",
  vertical: "salon",
  phone: "+14032404014",
  address: "#260, 5255 Richmond Rd SW, Calgary, AB T3E 7C4",
  mapUrl: "https://maps.google.com/?q=Artistic+Salon+5255+Richmond+Rd+SW+Calgary",
  serviceArea: "Calgary · Richmond / Glendale SW",
  bookingUrl: "#book",
  rating: 4.9,
  reviewsBlurb: "Rated 4.9 out of 5 across 719 Google reviews — one of Calgary's most-loved salons.",
  geo: { lat: 51.0316, lng: -114.1453 },
  hours: [
    { day: "Mon–Fri", open: "9:30am", close: "7:00pm" },
    { day: "Saturday", open: "9:00am", close: "6:00pm" },
    { day: "Sunday", open: "11:00am", close: "4:00pm" },
  ],
  // Women's + Men's menu, verbatim names/prices from artisticsalon.ca.
  services: [
    // Women's
    { name: "Women's Cut, Shampoo & Style", price: "$60+" },
    { name: "Girl's Cut (Under 14)", price: "$42+" },
    { name: "Girl's Cut (14–17)", price: "$46+" },
    { name: "Bang Trim", price: "$20+" },
    { name: "Wash & Style", price: "$50+" },
    { name: "Roller Set", price: "$45+" },
    { name: "Updo", price: "$100+" },
    { name: "Root Touch-Up", price: "$120+" },
    { name: "Global Colour", price: "$130+" },
    { name: "Highlights", price: "$150+" },
    { name: "Colour + Highlights", price: "$180+" },
    { name: "Perm", price: "$165+" },
    { name: "Spiral Perm & Style", price: "$250+" },
    { name: "Deep Conditioning Treatment", price: "$45+" },
    { name: "Corrective Colour", price: "Upon consultation" },
    { name: "Balayage", price: "Upon consultation" },
    // Men's
    { name: "Barber Cut, Shampoo & Style", price: "$48+" },
    { name: "Boy's Cut (Under 14)", price: "$40+" },
    { name: "Boy's Cut (14–17)", price: "$45+" },
    { name: "Moustache Trim", price: "$15+" },
    { name: "Moustache & Beard Trim", price: "$25+" },
    { name: "Men's Colour", price: "$95+" },
    { name: "Men's Highlights", price: "$95+" },
    { name: "Partial Perm", price: "$140+" },
  ],
  heroImage: "/img/hero.webp",
  url: "https://artisticsalon.ca",
};
