import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";
import { SOURCES, type Category, type Feed } from "../src/feeds";
import type { Snapshot } from "../src/schema";

const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1_000;

const parser = new Parser();

const getFeedCategory = (feedConfig: Feed): Category | undefined => {
  return "category" in feedConfig ? feedConfig.category : undefined;
};

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const fetchFeedXml = async (feedConfig: Feed): Promise<string> => {
  for (let attempt = 1; attempt <= RETRY_COUNT; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      console.log(`Fetching ${feedConfig.name}: ${feedConfig.url}`);

      const response = await fetch(feedConfig.url, {
        signal: controller.signal,
        headers: {
          "user-agent": "blog.736b.moe feed fetcher",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Unexpected response ${response.status} ${response.statusText}`,
        );
      }

      return await response.text();
    } catch (error) {
      if (attempt === RETRY_COUNT) {
        throw error;
      }

      console.warn(
        `Retrying ${feedConfig.name} (${attempt}/${RETRY_COUNT})...`,
      );
      await sleep(RETRY_DELAY_MS);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new Error(`Failed to fetch ${feedConfig.name}`);
};

const normalizeFeed = async (feedConfig: Feed): Promise<Snapshot> => {
  const xml = await fetchFeedXml(feedConfig);
  const feed = await parser.parseString(xml);
  const fetchedAt = new Date().toISOString();
  const items: Snapshot["items"] = [];

  for (const item of feed.items) {
    const id = item.guid || item.id;
    if (!id || !item.pubDate) continue;

    const created = new Date(item.pubDate);
    if (Number.isNaN(created.getTime())) continue;
    const category = getFeedCategory(feedConfig);

    items.push({
      id,
      title: item.title ?? item.link ?? id,
      link: item.link ?? id,
      created: created.toISOString(),
      ...(category ? { category } : {}),
      tags: [feedConfig.tag] as Snapshot["items"][number]["tags"],
    });
  }

  items.sort((a, b) => b.created.localeCompare(a.created));

  return {
    sourceUrl: feedConfig.url,
    fetchedAt,
    items,
  };
};

const writeSnapshot = async (
  feedConfig: Feed,
  snapshot: Snapshot,
): Promise<void> => {
  const outputPath = path.resolve(process.cwd(), feedConfig.cacheFile);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(snapshot, null, 2)}\n`,
    "utf-8",
  );
  console.log(`Wrote ${feedConfig.name} snapshot to ${feedConfig.cacheFile}`);
};

const main = async (): Promise<void> => {
  await Promise.all(
    SOURCES.map(async (feedConfig) => {
      const snapshot = await normalizeFeed(feedConfig);
      await writeSnapshot(feedConfig, snapshot);
    }),
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
