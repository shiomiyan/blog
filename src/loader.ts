import { readFile } from "node:fs/promises";
import path from "node:path";
import type { CATEGORIES, TAGS } from "@constants";
import { rssSchema, snapshotSchema } from "@schema";
import type { Loader } from "astro/loaders";

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const rssLoader = (options: {
  cacheFile: string;
  tag: keyof typeof TAGS;
  category?: (typeof CATEGORIES)[number];
}): Loader => {
  return {
    name: "rss-loader",
    load: async ({
      store,
      logger,
      parseData,
      generateDigest,
    }): Promise<void> => {
      logger.info(`Loading RSS snapshot from ${options.cacheFile}`);

      const snapshotPath = path.resolve(process.cwd(), options.cacheFile);
      let snapshot;

      try {
        const rawSnapshot = await readFile(snapshotPath, "utf-8");
        snapshot = snapshotSchema.parse(JSON.parse(rawSnapshot));
      } catch (error) {
        const message = toErrorMessage(error);
        throw new Error(
          `Failed to load RSS snapshot from ${options.cacheFile}: ${message}. Run "pnpm run fetch-feeds" to refresh external feeds.`,
          { cause: error },
        );
      }

      store.clear();

      for (const item of snapshot.items) {
        const data = await parseData({
          id: item.id,
          data: {
            title: item.title,
            link: item.link,
            date: new Date(item.date),
            category: item.category ?? options.category,
            tags: item.tags.length > 0 ? item.tags : [options.tag],
          },
        });
        const digest = generateDigest(data);

        store.set({ id: item.id, data, digest });
      }
    },
    schema: rssSchema,
  };
};
