import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Fixed port so this template always opens at the same localhost URL.
// SITE_BASE / OUT_DIR are set only by scripts/build-gallery.mjs to assemble the
// combined single-server gallery; normal dev/build use the defaults.
export default defineConfig({
  base: process.env.SITE_BASE || "/",
  server: { port: 4325, host: false },
  outDir: process.env.OUT_DIR || undefined,
  vite: { plugins: [tailwindcss()] },
});
