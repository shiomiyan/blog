import { defineCollection, z } from "astro:content";
import json from "@data/tags.json";

const tags = json.tags.map((tag) => tag.slug);

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
			.refine((arr) => arr.every((tag) => tags.includes(tag)), {
				message: `Invalid tag specified. Use: ${tags}`,
			}),
	}),
});

export const collections = { posts };
