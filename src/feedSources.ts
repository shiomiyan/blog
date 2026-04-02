import { CATEGORIES, TAGS } from "./constants";

export type Tag = keyof typeof TAGS;
export type Category = (typeof CATEGORIES)[number];

export type FeedSourceConfig = {
  name: string;
  url: string;
  cacheFile: string;
  tag: Tag;
  category?: Category;
};

export const FEED_SOURCES = [
  {
    name: "zenn",
    url: "https://zenn.dev/736b/feed",
    cacheFile: "src/content/external/zenn.json",
    tag: "zenn",
  },
  {
    name: "qiita",
    url: "https://qiita.com/736b/feed",
    cacheFile: "src/content/external/qiita.json",
    tag: "qiita",
  },
  {
    name: "note",
    url: "https://note.com/736b/rss",
    cacheFile: "src/content/external/note.json",
    tag: "random",
    category: "Diary",
  },
  {
    name: "speakerdeck",
    url: "https://speakerdeck.com/shiomiyan.rss",
    cacheFile: "src/content/external/speakerdeck.json",
    tag: "slides",
  },
] as const satisfies readonly FeedSourceConfig[];

export type FeedSource = (typeof FEED_SOURCES)[number];
export type FeedSourceName = FeedSource["name"];
