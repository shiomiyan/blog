import { EXTERNAL_FEEDS } from "@consts";
import type { CollectionEntry } from "astro:content";
import { clsx, type ClassValue } from "clsx";
import Parser from "rss-parser";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Get posts from other platform RSS.
 * @returns RSS entries defined in {@link EXTERNAL_FEEDS}
 */
export async function fetchExternalFeed(): Promise<CollectionEntry<"posts">[]> {
  const parser = new Parser();
  const items: CollectionEntry<"posts">[] = [];

  for (const dataSource of EXTERNAL_FEEDS) {
    const feed = await parser.parseURL(dataSource.URL);
    const feedItems = feed.items.map(
      item =>
        ({
          data: {
            title: item.title,
            date: item.pubDate ? new Date(item.pubDate) : new Date(),
            url: item.link,
            platform: dataSource.NAME,
            isExternal: true,
          },
        }) as CollectionEntry<"posts">
    );
    items.push(...feedItems);
  }
  return items;
}
