import type { Loader } from "astro/loaders";
import { z } from "astro:content";
import Parser from "rss-parser";

export function rssLoader(options: { url: string; slug: string }): Loader {
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
				if (!item.guid) continue;
				const data = await parseData({
					id: item.guid,
					data: item,
				});
				store.set({ id: item.guid, data });
			}
		},
		schema: z.object({
			title: z.string(),
			link: z.string(),
		}),
	};
}
