import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// `site` is the production domain — canonical + absolute OG/Twitter + sitemap
// derive from it. Staging lives on *.pages.dev; at domain cutover this stays
// correct (the new site lives on www.astrosystems.ca, served over HTTPS).
export default defineConfig({
  site: "https://www.astrosystems.ca",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
