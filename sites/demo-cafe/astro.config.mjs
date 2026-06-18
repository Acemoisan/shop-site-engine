import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Public canonical origin. Canonical/OG/sitemap URLs all derive from this — set it
// to the shop's live domain at deploy time (e.g. https://maplesteam.ca).
export default defineConfig({
  site: "https://demo-cafe.studio0rbit.ca",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
