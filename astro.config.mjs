import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";
import tailwindcss from "@tailwindcss/vite";
import pagefindIndexer from "./src/integrations/pagefindIndexer";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.736b.moe",
	build: {
		format: "file"
	},
  output: "static",
  integrations: [sitemap(), pagefindIndexer()],
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
		contentIntellisense: true,
  },
	devToolbar: {
		enabled: false
	}
});
