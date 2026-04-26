import { feedEntrySchema, feedSnapshotsSchema, postSchema } from "@schema";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { FEEDS_CACHE_FILE, type FeedName } from "./feeds";

const taxonomySchema = z.object({
  id: z.string(),
  label: z.string(),
});

/**
 * Local Markdown posts.
 *
 * The content loader keeps Markdown rendering available, unlike the file
 * loader used for plain JSON collections.
 */
const posts = defineCollection({
  // Keep post templates prefixed with `_` so they stay out of this glob.
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/content/posts",
    retainBody: false,
  }),
  schema: postSchema,
});

/**
 * Tag taxonomy loaded from JSON.
 *
 * Keeping taxonomy in Content Collections gives route code the same
 * `getCollection()` API used for posts.
 */
const tags = defineCollection({
  loader: file("src/data/tags.json"),
  schema: taxonomySchema,
});

/**
 * Category taxonomy loaded from JSON.
 *
 * Category URLs use `id`; rendered labels use `label`.
 */
const categories = defineCollection({
  loader: file("src/data/categories.json"),
  schema: taxonomySchema,
});

/**
 * Creates one external feed collection from the shared generated cache file.
 *
 * The cache keeps service metadata together; collections expose only the items
 * so existing `getCollection("note")` style callers remain unchanged.
 */
const createFeedCollection = (name: FeedName) => {
  return defineCollection({
    loader: file(FEEDS_CACHE_FILE, {
      parser: (text) => {
        return feedSnapshotsSchema.parse(JSON.parse(text))[name].items;
      },
    }),
    schema: feedEntrySchema,
  });
};

const zenn = createFeedCollection("zenn");
const qiita = createFeedCollection("qiita");
const note = createFeedCollection("note");
const speakerdeck = createFeedCollection("speakerdeck");

export const collections = {
  posts,
  tags,
  categories,
  zenn,
  qiita,
  speakerdeck,
  note,
};
