import type { ShopContent } from "@studio0rbit/shared";
export const shop: ShopContent = {
  name: "Stillwater Spa",
  tagline: "A quiet place to slow down.",
  vertical: "salon",
  phone: "+1-403-555-0155",
  address: "318 9 Ave SE, Inglewood, Calgary, AB",
  mapUrl: "https://maps.google.com/?q=318+9+Ave+SE+Calgary",
  serviceArea: "Inglewood",
  bookingUrl: "#book",
  hours: [
    { day: "Tue–Fri", open: "10:00", close: "20:00" },
    { day: "Sat–Sun", open: "9:00", close: "18:00" },
    { day: "Mon", open: "", close: "", closed: true },
  ],
  services: [
    { name: "Swedish Massage — 60 min", price: "$130" },
    { name: "Deep Tissue — 90 min", price: "$185" },
    { name: "Signature Facial", price: "$145" },
    { name: "Nordic Sauna Session", price: "$45" },
    { name: "Couples Retreat (2 hr)", price: "$390" },
  ],
  url: "https://stillwater.example.com",
};
