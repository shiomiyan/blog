import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";
import { SOURCES, type Category, type Feed } from "../src/feeds";
import type { Snapshot } from "../src/schema";

const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_DELAYS_MS = [500, 1_000] as const;
const REQUEST_ATTEMPTS = RETRY_DELAYS_MS.length + 1;

const parser = new Parser();

const getFeedCategory = (feedConfig: Feed): Category | null => {
  if ("category" in feedConfig && feedConfig.category) {
    return feedConfig.category;
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

const fetchFeedXml = async (feedConfig: Feed): Promise<string> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= REQUEST_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      console.log(
        `Fetching ${feedConfig.name} (${attempt}/${REQUEST_ATTEMPTS}): ${feedConfig.url}`,
      );

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
      lastError = error;

      if (attempt < REQUEST_ATTEMPTS) {
        const delayMs = RETRY_DELAYS_MS[attempt - 1];
        console.warn(
          `Retrying ${feedConfig.name} after ${delayMs}ms: ${toErrorMessage(error)}`,
        );
        await sleep(delayMs);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new Error(
    `Failed to fetch ${feedConfig.name}: ${toErrorMessage(lastError)}`,
  );
};

const normalizeFeed = async (feedConfig: Feed): Promise<Snapshot> => {
  const xml = await fetchFeedXml(feedConfig);
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
      category: getFeedCategory(feedConfig),
      tags: [feedConfig.tag] as Snapshot["items"][number]["tags"],
    });
  }

  items.sort((a, b) => b.date.localeCompare(a.date));

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
  const results = await Promise.allSettled(
    SOURCES.map(async (feedConfig) => ({
      feedConfig,
      snapshot: await normalizeFeed(feedConfig),
    })),
  );

  const failures = results.flatMap((result, index) => {
    if (result.status === "fulfilled") return [];

    return [`${SOURCES[index].name}: ${toErrorMessage(result.reason)}`];
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
          feedConfig: Feed;
          snapshot: Snapshot;
        }> => result.status === "fulfilled",
      )
      .map(({ value }) => writeSnapshot(value.feedConfig, value.snapshot)),
  );
};

main().catch((error) => {
  console.error(toErrorMessage(error));
  process.exitCode = 1;
});
