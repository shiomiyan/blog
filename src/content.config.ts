import { postSchema, rssSchema, snapshotSchema } from "@schema";
import { file, glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { SOURCES, type FeedConfig, type FeedName } from "./feeds";

const posts = defineCollection({
  // Keep post templates prefixed with `_` so they stay out of this glob.
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/content/posts",
    retainBody: false,
  }),
  schema: postSchema,
});

const getFeedConfig = (name: FeedName): FeedConfig => {
  const feedConfig = SOURCES.find((source) => source.name === name);
  if (!feedConfig) {
    throw new Error(`Feed source "${name}" is not configured.`);
  }
  return feedConfig;
};

const createFeedCollection = (name: FeedName) => {
  const feedConfig = getFeedConfig(name);

  return defineCollection({
    loader: file(feedConfig.cacheFile, {
      parser: (text) => {
        const snapshot = snapshotSchema.parse(JSON.parse(text));

        return snapshot.items.map((item) => ({
          id: item.id,
          title: item.title,
          link: item.link,
          created: new Date(item.created),
          category: item.category ?? feedConfig.category,
          tags: item.tags.length > 0 ? item.tags : [feedConfig.tag],
        }));
      },
    }),
    schema: rssSchema,
  });
};

const zenn = createFeedCollection("zenn");
const qiita = createFeedCollection("qiita");
const note = createFeedCollection("note");
const speakerdeck = createFeedCollection("speakerdeck");

export const collections = { posts, zenn, qiita, speakerdeck, note };
