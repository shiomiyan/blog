import {
	getCollection,
	type AnyEntryMap,
	type CollectionEntry,
} from "astro:content";

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
export const getFavicon = async (url: string): Promise<string | undefined> => {
	try {
		const hostname = new URL(url).hostname;
		const res = await fetch(`https://icons.duckduckgo.com/ip3/${hostname}.ico`);
		const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
		return `data:image/png;base64,${base64}`;
	} catch (e) {
		console.error(`Error while fetching ${url}\n`, e);
		return undefined;
	}
};

/**
 * Retrieve all posts data including external posts.
 * @returns Posts collection sorted by date (newest first)
 */
export const getCollectionByCollectionKeys = async <
	C extends keyof AnyEntryMap,
>(
	...collectionKeys: C[]
): Promise<CollectionEntry<C>[]> => {
	const promises = collectionKeys.map((collectionKey) =>
		getCollection(collectionKey),
	);
	const collections = (await Promise.all(promises)).flat();
	collections.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
	return collections;
};
