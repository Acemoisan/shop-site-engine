import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Public canonical origin. Swap to https://studio0rbit.ca once the domain points
// here — canonical/OG/sitemap URLs all derive from this.
export default defineConfig({
  site: "https://studio0rbit-audit.netlify.app",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
