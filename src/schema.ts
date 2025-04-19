import { TAGS } from "@/constants";
import { z } from "astro:content";

const tagSlugs = Object.keys(TAGS) as [
	keyof typeof TAGS,
	...(keyof typeof TAGS)[],
];

const tagSchema = z.array(z.enum(tagSlugs)).default([]);

export const postSchema = z.object({
	title: z.string(),
	description: z.string(),
	date: z.coerce.date(),
	draft: z.boolean().optional(),
	ulid: z.string(),
	tags: tagSchema,
});

export const rssSchema = z.object({
	title: z.string(),
	link: z.string(),
	date: z.date(),
	tags: tagSchema,
});
