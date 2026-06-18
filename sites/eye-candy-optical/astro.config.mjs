import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// `site` is the production domain — canonical + absolute OG/Twitter + sitemap
// derive from it. Staging lives at eye-candy-optical-yyc.netlify.app; at domain
// cutover this stays correct (the new site lives on www.eyecandyeyewear.com).
export default defineConfig({
  site: "https://www.eyecandyeyewear.com",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
