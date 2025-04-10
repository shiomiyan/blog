import { getCollection, type CollectionEntry } from "astro:content";

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
 * duckduckgoのfavicon apiから外部サイトのfaviconを取ってきてbase64 data uriにする
 */
export const getFavicon = async (url: string): Promise<string | null> => {
	try {
		const hostname = new URL(url).hostname;
		const res = await fetch(`https://icons.duckduckgo.com/ip3/${hostname}.ico`);
		const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
		return `data:image/png;base64,${base64}`;
	} catch (e) {
		console.error(`Error while fetching ${url}\n`, e);
		return null;
	}
};

/**
 * Retrieve all posts data including external posts.
 * @returns Posts collection sorted by date (newest first)
 */
export async function getAllPosts(): Promise<CollectionEntry<"posts">[]> {
	const posts = await getCollection("posts", ({ data }) => {
		return data.draft !== true;
	});

	// Get Zenn and Qiita posts from Content Collections
	const zennPosts = await getCollection("zenn");
	const qiitaPosts = await getCollection("qiita");

	// Convert external posts to the same format as regular posts
	const externalPosts = [...zennPosts, ...qiitaPosts].map((item) => {
		return {
			id: item.id,
			slug: item.id,
			collection: "posts",
			data: {
				title: item.data.title,
				date: new Date(item.data.pubdate),
				url: item.data.link,
				platform: item.collection === "zenn" ? "Zenn" : "Qiita",
				isExternal: true,
				tags: [item.collection],
			},
		} as unknown as CollectionEntry<"posts">;
	});

	posts.push(...externalPosts);
	posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
	return posts;
}
