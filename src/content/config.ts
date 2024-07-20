import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    url: z.string().url().optional(),
    platform: z.string().optional(),
    isExternal: z.boolean().optional(),
  }),
});

export const collections = { posts };
