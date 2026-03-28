import { rssLoader } from "@loader";
import { postSchema } from "@schema";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/posts" }),
  schema: postSchema,
});

const zenn = defineCollection({
  loader: rssLoader({ url: "https://zenn.dev/736b/feed", tag: "zenn" }),
});

const qiita = defineCollection({
  loader: rssLoader({ url: "https://qiita.com/736b/feed", tag: "qiita" }),
});

const note = defineCollection({
  loader: rssLoader({
    url: "https://note.com/736b/rss",
    tag: "random",
    category: "Diary",
  }),
});

const speakerdeck = defineCollection({
  loader: rssLoader({
    url: "https://speakerdeck.com/shiomiyan.rss",
    tag: "slides",
  }),
});

export const collections = { posts, zenn, qiita, speakerdeck, note };
