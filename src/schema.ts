import { CATEGORIES, TAGS } from "@/constants";
import { z } from "astro/zod";

const tagKeys = Object.keys(TAGS) as [keyof typeof TAGS];

const tagSchema = z.array(z.enum(tagKeys)).default([]);
const categorySchema = z.enum(CATEGORIES).optional();

export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  ulid: z.string(),
  category: categorySchema,
  tags: tagSchema,
});

export const rssSchema = z.object({
  title: z.string(),
  link: z.string(),
  date: z.date(),
  category: categorySchema,
  tags: tagSchema,
});

export const externalRssSchema = rssSchema.extend({
  id: z.string(),
  date: z.iso.datetime({ offset: true }),
  category: z.enum(CATEGORIES).nullable(),
});

export const snapshotSchema = z.object({
  sourceUrl: z.url(),
  fetchedAt: z.iso.datetime({ offset: true }),
  items: z.array(externalRssSchema),
});

export type Snapshot = z.infer<typeof snapshotSchema>;
