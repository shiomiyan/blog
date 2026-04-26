import { isCategoryId, isTagId } from "@lib/taxonomy";
import { z } from "astro/zod";

/**
 * Validates category IDs stored in post frontmatter.
 *
 * Frontmatter keeps URL-safe taxonomy IDs while page rendering resolves labels
 * from the taxonomy collections.
 */
const categorySchema = z.string().refine(isCategoryId, {
  message: "Unknown category id. Add it to src/data/categories.json.",
});

/**
 * Validates optional tag IDs in post frontmatter.
 *
 * Missing tags become an empty array so consumers can always map and filter
 * tags without checking for undefined.
 */
const tagSchema = z
  .array(
    z.string().refine(isTagId, {
      message: "Unknown tag id. Add it to src/data/tags.json.",
    }),
  )
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

/**
 * Schema for one external feed item after normalization.
 *
 * Feed items are intentionally smaller than local posts and are not categorized
 * or tagged because taxonomy pages only use the local `posts` collection.
 */
export const feedEntrySchema = postSchema
  .pick({
    id: true,
    title: true,
    created: true,
  })
  .extend({ link: z.url() });

const feedSourceSnapshotSchema = z.strictObject({
  source: z.url(),
  items: z.array(feedEntrySchema),
});

/**
 * Schema for the generated external feed cache.
 *
 * All sources share one fetched timestamp so content sync reads a single
 * generated artifact while preserving each service as its own collection.
 */
export const feedSnapshotsSchema = z.strictObject({
  fetchedAt: z.coerce.date(),
  zenn: feedSourceSnapshotSchema,
  qiita: feedSourceSnapshotSchema,
  note: feedSourceSnapshotSchema,
  speakerdeck: feedSourceSnapshotSchema,
});

export type FeedSourceSnapshot = z.infer<typeof feedSourceSnapshotSchema>;
export type FeedSnapshots = z.infer<typeof feedSnapshotsSchema>;
