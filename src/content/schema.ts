import { getAllTagSlug } from "@lib/tags";
import { z } from "astro:content";

const tagSchema = z
	.array(z.string())
	.default([])
	.refine((arr) => arr.every((tag) => getAllTagSlug().includes(tag)), {
		message: `Invalid tag specified. Use: ${getAllTagSlug().join(", ")}`,
	});

export const postSchema = z.object({
	title: z.string(),
	description: z.string(),
	date: z.coerce.date(),
	draft: z.boolean().optional(),
	ulid: z.string().optional(),
	tags: tagSchema,
});

export const rssSchema = z.object({
	title: z.string(),
	link: z.string(),
	date: z.date(),
	tags: tagSchema,
});
