import { CATEGORIES, TAGS } from "./constants";

export type Tag = keyof typeof TAGS;
export type Category = (typeof CATEGORIES)[number];

export type FeedConfig = {
  name: string;
  url: string;
  cacheFile: string;
  tag: Tag;
  category?: Category;
};

export const SOURCES = [
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
] as const satisfies readonly FeedConfig[];

export type Feed = (typeof SOURCES)[number];
export type FeedName = Feed["name"];
