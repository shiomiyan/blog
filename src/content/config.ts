import { rssLoader } from "@loader";
import { defineCollection } from "astro:content";
import { postSchema } from "./schema";

const posts = defineCollection({
	type: "content",
	schema: postSchema,
});

const zenn = defineCollection({
	loader: rssLoader({ url: "https://zenn.dev/736b/feed", slug: "zenn" }),
});

const qiita = defineCollection({
	loader: rssLoader({ url: "https://qiita.com/736b/feed", slug: "qiita" }),
});

export const collections = { posts, zenn, qiita };
