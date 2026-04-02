import { rssLoader } from "@loader";
import { postSchema } from "@schema";
import { FEED_SOURCES, type FeedSourceName } from "./feedSources";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

const posts = defineCollection({
  // Keep post templates prefixed with `_` so they stay out of this glob.
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/posts" }),
  schema: postSchema,
});

const getFeedSource = (name: FeedSourceName) => {
  const source = FEED_SOURCES.find((feedSource) => feedSource.name === name);
  if (!source) {
    throw new Error(`Feed source "${name}" is not configured.`);
  }
  return source;
};

const zenn = defineCollection({
  loader: rssLoader({
    cacheFile: getFeedSource("zenn").cacheFile,
    tag: "zenn",
  }),
});

const qiita = defineCollection({
  loader: rssLoader({
    cacheFile: getFeedSource("qiita").cacheFile,
    tag: "qiita",
  }),
});

const note = defineCollection({
  loader: rssLoader({
    cacheFile: getFeedSource("note").cacheFile,
    tag: "random",
    category: "Diary",
  }),
});

const speakerdeck = defineCollection({
  loader: rssLoader({
    cacheFile: getFeedSource("speakerdeck").cacheFile,
    tag: "slides",
  }),
});

export const collections = { posts, zenn, qiita, speakerdeck, note };
