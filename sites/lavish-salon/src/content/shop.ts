import type { ShopContent } from "@studio0rbit/shared";

// Real content lifted from www.ilovelavish.com (Lavish Salon, Calgary).
// Services have no public prices on the existing site — listed without prices
// rather than inventing numbers. Confirm pricing at intake if desired.
export const shop: ShopContent = {
  name: "Lavish Salon",
  tagline: "Great hair is just a click away.",
  vertical: "salon",
  phone: "+1-403-244-5162",
  address: "9919 Fairmount Dr SE #143, Calgary, AB T2J 0S3",
  mapUrl: "https://maps.google.com/?q=Lavish+Salon+9919+Fairmount+Dr+SE+143+Calgary+AB+T2J+0S3",
  serviceArea: "Fairmount, Calgary SE",
  bookingUrl: "https://phorest.com/book/salons/lavishsalon",
  hours: [
    { day: "Monday", open: "10:00 am", close: "5:00 pm" },
    { day: "Tuesday", open: "9:00 am", close: "9:00 pm" },
    { day: "Wednesday", open: "10:00 am", close: "9:00 pm" },
    { day: "Thursday", open: "10:00 am", close: "9:00 pm" },
    { day: "Friday", open: "8:00 am", close: "6:00 pm" },
    { day: "Saturday", open: "9:00 am", close: "5:00 pm" },
    { day: "Sunday", open: "", close: "", closed: true },
  ],
  services: [
    { name: "Cuts", description: "Precision cuts and shaping for every hair type, finished with a style you can recreate at home." },
    { name: "Colour", description: "Balayage, highlights, full colour and corrections by colour specialists." },
    { name: "Styling", description: "Blowouts, special-occasion styling and event-ready finishes." },
    { name: "Hair Treatments", description: "Restorative and bond-building treatments to keep colour and condition healthy." },
    { name: "Hair Extensions", description: "Custom-matched extensions for added length, volume and dimension." },
  ],
  heroImage: "/img/salon-interior.webp",
  reviewsBlurb: "Rated 4.8 out of 5 across 780+ Google reviews from Calgary clients.",
  rating: 4.8,
  geo: { lat: 50.9665, lng: -114.0479 },
  url: "https://www.ilovelavish.com",
};
