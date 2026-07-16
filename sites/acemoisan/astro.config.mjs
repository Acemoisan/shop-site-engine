import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Personal utility hub. `site` is the production Cloudflare Pages origin —
// canonical + absolute OG/Twitter + sitemap derive from it. Everything ships
// from this one project; the MacroFactor app lives at /apps/macrofactor.
export default defineConfig({
  site: "https://acemoisan.pages.dev",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
