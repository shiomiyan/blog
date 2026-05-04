import { isCategoryId } from "@lib/taxonomy";
import { z } from "astro/zod";

/**
 * Validates category IDs stored in post frontmatter.
 *
 * Frontmatter keeps URL-safe taxonomy IDs while page rendering resolves labels
 * from the taxonomy collections.
 */
const categorySchema = z.string().refine(isCategoryId, {
  message: "Unknown category id. Add it to src/constants.ts.",
});

/**
 * Validates optional tag labels in post frontmatter.
 *
 * Missing tags become an empty array so consumers can always map and filter
 * tags without checking for undefined.
 */
const tagSchema = z
  .array(z.string().min(1))
  .default([])
  .refine((tags) => new Set(tags).size === tags.length, {
    message: "Duplicate tags are not allowed.",
  });

/**
 * Schema for local Markdown posts.
 *
 * Frontmatter is strict so typos like `descripton` or `catgory` fail during
 * content sync instead of being silently ignored.
 */
export const postSchema = z.strictObject({
  title: z.string(),
  description: z.string(),
  created: z.coerce.date(),
  draft: z.boolean().default(true),
  id: z.string(),
  category: categorySchema,
  tags: tagSchema,
});
