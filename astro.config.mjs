import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";
import tailwindcss from "@tailwindcss/vite";
import pagefindIndexer from "./src/integrations/pagefindIndexer";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.736b.moe",
  output: "static",
  integrations: [sitemap(), mdx(), pagefindIndexer()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
    },
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
});
