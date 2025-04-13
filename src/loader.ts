import { rssSchema } from "@content/schema";
import type { Loader } from "astro/loaders";
import Parser from "rss-parser";

export const rssLoader = (options: { url: string; tag: string }): Loader => {
	return {
		name: "rss-loader",
		load: async ({ store, logger, parseData }): Promise<void> => {
			logger.info(`Loading RSS feed from ${options.url}`);
			type itemDef = { title: string; link: string; pubDate: Date };
			const parser = new Parser<{ item: itemDef[] }>();
			const feed = await parser.parseURL(options.url);
			for (const item of feed.items) {
				const itemId = item.guid || item.id;
				if (!itemId) continue;

				const data = await parseData({
					id: itemId,
					data: {
						title: item.title,
						link: item.link,
						date: new Date(item.pubDate || ""),
						tags: [options.tag],
					},
				});
				store.set({ id: itemId, data });
			}
		},
		schema: rssSchema,
	};
};
