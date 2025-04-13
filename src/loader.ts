import { rssSchema } from "@content/schema";
import type { Loader } from "astro/loaders";
import Parser from "rss-parser";

export const rssLoader = (options: { url: string; tag: string }): Loader => {
	return {
		name: "rss-loader",
		load: async ({
			store,
			logger,
			parseData,
			generateDigest,
		}): Promise<void> => {
			logger.info(`Loading RSS feed from ${options.url}`);

			const parser = new Parser();
			const feed = await parser.parseURL(options.url);

			store.clear();

			for (const item of feed.items) {
				const itemId = item.guid || item.id;
				if (!itemId || !item.pubDate) continue;

				const data = await parseData({
					id: itemId,
					data: {
						title: item.title,
						link: item.link,
						date: new Date(item.pubDate),
						tags: [options.tag],
					},
				});
				const digest = generateDigest(data);

				store.set({ id: itemId, data, digest });
			}
		},
		schema: rssSchema,
	};
};
