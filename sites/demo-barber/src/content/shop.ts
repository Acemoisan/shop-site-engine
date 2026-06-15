import type { ShopContent } from "@studio0rbit/shared";
export const shop: ShopContent = {
  name: "Ironside Barber Co.",
  tagline: "Classic cuts, Calgary craft.",
  vertical: "salon",
  heroImage: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&q=70&auto=format&fit=crop",
  phone: "+1-403-555-0142",
  address: "112 17th Ave SW, Calgary, AB",
  mapUrl: "https://maps.google.com/?q=112+17th+Ave+SW+Calgary",
  serviceArea: "Beltline & inner-city Calgary",
  bookingUrl: "https://squareup.com/appointments",
  hours: [
    { day: "Tue–Fri", open: "9:00", close: "19:00" },
    { day: "Sat", open: "9:00", close: "17:00" },
    { day: "Sun–Mon", open: "", close: "", closed: true },
  ],
  services: [
    { name: "Classic Cut", price: "$40" },
    { name: "Cut + Beard", price: "$55" },
    { name: "Hot Towel Shave", price: "$45" },
  ],
  reviewsBlurb: "Rated 4.9★ by 200+ Calgary clients.",
  rating: 4.9,
  geo: { lat: 51.0392, lng: -114.0731 },
  url: "https://ironside.example.com",
};
