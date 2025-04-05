import { defineCollection, z } from "astro:content";
import { getAllTagSlug } from "@lib/tags";

const validTags = getAllTagSlug();

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
		tags: z
			.array(z.string())
			.default([])
			.refine((arr) => arr.every((tag) => validTags.includes(tag)), {
				message: `Invalid tag specified. Use: ${validTags.join(", ")}`,
			}),
	}),
});

export const collections = { posts };
