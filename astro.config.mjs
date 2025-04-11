import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import rehypeExternalLinks from "rehype-external-links";
import ulidgen from "./src/integrations/ulidgen";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.736b.moe",
  output: "static",
  integrations: [sitemap(), mdx(), pagefind(), ulidgen()],
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
  experimental: {
    svg: true,
  }
});
