import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import pagefindIndexer from "./src/integrations/pagefindIndexer";
import remarkCallout from "./src/lib/remarkCallout";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.736b.moe",
  adapter: cloudflare(),
  build: {
    format: "file",
  },
  output: "server",
  integrations: [sitemap(), pagefindIndexer()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
    },
    remarkPlugins: [remarkCallout],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    contentIntellisense: true,
  },
  devToolbar: {
    enabled: false,
  },
});
