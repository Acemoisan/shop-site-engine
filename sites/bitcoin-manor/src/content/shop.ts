import type { ShopContent } from "@studio0rbit/shared";

// Local fallback content — the build uses this if Storyblok is down or a field is empty.
// Bitcoin Manor is an online Bitcoin merchandise/maker brand (vertical: retail).
// No public phone/storefront hours — it's a brand/catalog site that deep-links
// to their existing WooCommerce store. `services` holds the product collections.
export const shop: ShopContent = {
  name: "Bitcoin Manor",
  tagline: "Personalizing Your Bitcoin Journey",
  vertical: "retail",
  phone: "",
  address: "Alberta, Canada",
  mapUrl: "",
  serviceArea: "Designed & built in Alberta · ships across Canada",
  bookingUrl: "https://bitcoinmanor.com/bitcoin-merchandise-store/",
  hours: [],
  services: [
    { name: "Stacksworth Matrix", price: "$169 CAD", description: "Bitcoin LED display — block height, live price, fees and mining pool at a glance." },
    { name: "3D-Printed Solutions", description: "Unique 3D-printed Bitcoin pieces, designed in-house and tailored to you." },
    { name: "Laser-Crafted Collectibles", description: "Precision laser engraving — custom Bitcoin collectibles, made to order." },
    { name: "Laser Layers: Proof of Work", price: "from $289 CAD", description: "Bitcoin's untold stories, burned forever into canvas." },
    { name: "Special-Edition COLDbox", description: "Commemorative cases that house your Coinkite cold-storage gear." },
    { name: "Bitcoin for Kids", description: "Books, games and adventures that make Bitcoin click for curious kids." },
  ],
  reviewsBlurb: "Rated 4.8★ by Bitcoiners — trusted for in-house Bitcoin gear that ships across Canada.",
  rating: 4.8,
  url: "https://bitcoinmanor.com",
};
