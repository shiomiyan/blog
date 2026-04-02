import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";
import {
  FEED_SOURCES,
  type Category,
  type FeedSource,
} from "../src/feedSources";
import type { Snapshot } from "../src/schema";

const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_DELAYS_MS = [500, 1_000] as const;
const REQUEST_ATTEMPTS = RETRY_DELAYS_MS.length + 1;

const parser = new Parser();

const getFeedCategory = (source: FeedSource): Category | null => {
  if ("category" in source && source.category) {
    return source.category;
  }
  return null;
};

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const fetchFeedXml = async (source: FeedSource): Promise<string> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= REQUEST_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      console.log(
        `Fetching ${source.name} (${attempt}/${REQUEST_ATTEMPTS}): ${source.url}`,
      );

      const response = await fetch(source.url, {
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
      lastError = error;

      if (attempt < REQUEST_ATTEMPTS) {
        const delayMs = RETRY_DELAYS_MS[attempt - 1];
        console.warn(
          `Retrying ${source.name} after ${delayMs}ms: ${toErrorMessage(error)}`,
        );
        await sleep(delayMs);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new Error(
    `Failed to fetch ${source.name}: ${toErrorMessage(lastError)}`,
  );
};

const normalizeFeed = async (source: FeedSource): Promise<Snapshot> => {
  const xml = await fetchFeedXml(source);
  const feed = await parser.parseString(xml);
  const fetchedAt = new Date().toISOString();
  const items: Snapshot["items"] = [];

  for (const item of feed.items) {
    const id = item.guid || item.id;
    if (!id || !item.pubDate) continue;

    const date = new Date(item.pubDate);
    if (Number.isNaN(date.getTime())) continue;

    items.push({
      id,
      title: item.title ?? item.link ?? id,
      link: item.link ?? id,
      date: date.toISOString(),
      category: getFeedCategory(source),
      tags: [source.tag] as Snapshot["items"][number]["tags"],
    });
  }

  items.sort((a, b) => b.date.localeCompare(a.date));

  return {
    sourceUrl: source.url,
    fetchedAt,
    items,
  };
};

const writeSnapshot = async (
  source: FeedSource,
  snapshot: Snapshot,
): Promise<void> => {
  const outputPath = path.resolve(process.cwd(), source.cacheFile);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(snapshot, null, 2)}\n`,
    "utf-8",
  );
  console.log(`Wrote ${source.name} snapshot to ${source.cacheFile}`);
};

const main = async (): Promise<void> => {
  const results = await Promise.allSettled(
    FEED_SOURCES.map(async (source) => ({
      source,
      snapshot: await normalizeFeed(source),
    })),
  );

  const failures = results.flatMap((result, index) => {
    if (result.status === "fulfilled") return [];

    return [`${FEED_SOURCES[index].name}: ${toErrorMessage(result.reason)}`];
  });

  if (failures.length > 0) {
    console.error("Failed to refresh one or more feeds:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  await Promise.all(
    results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          source: FeedSource;
          snapshot: Snapshot;
        }> => result.status === "fulfilled",
      )
      .map(({ value }) => writeSnapshot(value.source, value.snapshot)),
  );
};

main().catch((error) => {
  console.error(toErrorMessage(error));
  process.exitCode = 1;
});
