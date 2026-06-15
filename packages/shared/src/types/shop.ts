export interface ShopHours { day: string; open: string; close: string; closed?: boolean }
export interface ShopService { name: string; price?: string; description?: string }
export interface ShopContent {
  name: string;
  tagline: string;
  vertical: "salon" | "cafe" | "trades" | "retail";
  heroImage?: string;      // full-bleed hero background image URL
  phone: string;
  address: string;
  mapUrl: string;          // Google Maps link
  serviceArea?: string;
  bookingUrl?: string;     // third-party embed/link (Square, Fresha, OpenTable...)
  hours: ShopHours[];
  services: ShopService[]; // doubles as menu for cafe/restaurant
  reviewsBlurb?: string;
  rating?: number;
  geo?: { lat: number; lng: number };
  url: string;
}
