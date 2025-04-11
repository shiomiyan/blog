import type { Loader } from "astro/loaders";
import { z } from "astro:content";
import Parser from "rss-parser";

export const rssLoader = (options: { url: string; slug: string }): Loader => {
	return {
		name: "rss-loader",
		load: async ({
			store,
			logger,
			parseData,
			meta,
			generateDigest,
		}): Promise<void> => {
			logger.info(`Loading RSS feed from ${options.url}`);
			const parser = new Parser();
			const feed = await parser.parseURL(options.url);
			for (const item of feed.items) {
				const itemId = item.guid || item.id;
				if (!itemId) continue;

				const data = await parseData({
					id: itemId,
					data: {
						title: item.title,
						link: item.link,
						pubdate: item.pubDate,
					},
				});
				store.set({ id: itemId, data });
			}
		},
		schema: z.object({
			title: z.string(),
			link: z.string(),
			pubdate: z.string(),
		}),
	};
};
