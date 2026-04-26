import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";
import { FEEDS_CACHE_FILE, SOURCES, type Feed } from "../src/feeds";
import type { FeedSnapshots, FeedSourceSnapshot } from "../src/schema";

const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1_000;

const parser = new Parser();

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

const normalizeFeed = async (feedConfig: Feed): Promise<FeedSourceSnapshot> => {
  const xml = await fetchFeedXml(feedConfig);
  const feed = await parser.parseString(xml);
  const items: FeedSourceSnapshot["items"] = [];

  for (const item of feed.items) {
    const id = item.guid || item.id;
    if (!id || !item.pubDate) continue;

    const created = new Date(item.pubDate);
    if (Number.isNaN(created.getTime())) continue;

    items.push({
      id,
      title: item.title ?? item.link ?? id,
      link: item.link ?? id,
      created,
    });
  }

  items.sort((a, b) => b.created.valueOf() - a.created.valueOf());

  return {
    source: feedConfig.url,
    items,
  };
};

const writeSnapshots = async (snapshots: FeedSnapshots): Promise<void> => {
  const outputPath = path.resolve(process.cwd(), FEEDS_CACHE_FILE);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(snapshots, null, 2)}\n`,
    "utf-8",
  );
  console.log(`Wrote feed snapshots to ${FEEDS_CACHE_FILE}`);
};

const main = async (): Promise<void> => {
  const fetchedAt = new Date();
  const sourceSnapshots = await Promise.all(
    SOURCES.map(async (feedConfig) => {
      const snapshot = await normalizeFeed(feedConfig);
      return [feedConfig.name, snapshot] as const;
    }),
  );

  await writeSnapshots({
    fetchedAt,
    ...Object.fromEntries(sourceSnapshots),
  } as FeedSnapshots);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
