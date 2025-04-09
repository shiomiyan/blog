import { getAllTagSlug } from "@lib/tags";
import { rssLoader } from "@loader";
import { defineCollection, z } from "astro:content";

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
		ulid: z.string().optional(),
		tags: z
			.array(z.string())
			.default([])
			.refine((arr) => arr.every((tag) => validTags.includes(tag)), {
				message: `Invalid tag specified. Use: ${validTags.join(", ")}`,
			}),
	}),
});

const zenn = defineCollection({
	loader: rssLoader({ url: "https://zenn.dev/736b/feed", slug: "zenn" }),
});

const qiita = defineCollection({
	loader: rssLoader({ url: "https://qiita.com/736b/feed", slug: "qiita" }),
});

export const collections = { posts, zenn, qiita };
