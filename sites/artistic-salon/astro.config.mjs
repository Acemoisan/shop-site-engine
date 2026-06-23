import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// `site` is the client's production domain — canonical + absolute OG/Twitter +
// sitemap all derive from it. Staging lives on artistic-salon.pages.dev; at
// domain cutover this stays correct (the site serves from artisticsalon.ca).
export default defineConfig({
  site: "https://artisticsalon.ca",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
