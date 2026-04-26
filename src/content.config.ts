import { postSchema } from "@schema";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

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

export const collections = {
  posts,
  tags,
  categories,
};
