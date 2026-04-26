import { postSchema } from "@schema";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

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

export const collections = {
  posts,
};
