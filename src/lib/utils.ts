import { EXTERNAL_FEEDS } from "@consts";
import { getCollection, type CollectionEntry } from "astro:content";
import Parser from "rss-parser";

/**
 * Format date to YYYY-MM-DD
 * @param date Date
 * @returns Formatted date
 */
export function formatDate(date: Date) {
	return Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

/**
 * Get posts from other platform RSS.
 * @returns RSS entries defined in {@link EXTERNAL_FEEDS}
 */
async function fetchExternalPosts(): Promise<CollectionEntry<"posts">[]> {
	const parser = new Parser({ timeout: 3000 });
	const items: CollectionEntry<"posts">[] = [];

	for (const dataSource of EXTERNAL_FEEDS) {
		const feed = await parser.parseURL(dataSource.URL);
		const feedItems = feed.items.map(
			(item) =>
				({
					data: {
						title: item.title,
						date: item.pubDate ? new Date(item.pubDate) : new Date(),
						url: item.link,
						platform: dataSource.NAME,
						isExternal: true,
						tags: [dataSource.TAG],
					},
				}) as CollectionEntry<"posts">,
		);
		items.push(...feedItems);
	}
	return items;
}

/**
 * Retrieve all posts data including external posts.
 * @returns Posts collection sorted by date (newest first)
 */
export async function getAllPosts(): Promise<CollectionEntry<"posts">[]> {
	const posts = (await getCollection("posts")).filter(
		(post) => !post.data.draft,
	);
	const rssPosts = await fetchExternalPosts();
	posts.push(...rssPosts);
	posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
	return posts;
}
