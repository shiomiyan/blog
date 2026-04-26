export type FeedConfig = {
  name: string;
  url: string;
};

export const FEEDS_CACHE_FILE = "src/data/generated/feeds.json";

export const SOURCES = [
  {
    name: "zenn",
    url: "https://zenn.dev/736b/feed",
  },
  {
    name: "qiita",
    url: "https://qiita.com/736b/feed",
  },
  {
    name: "note",
    url: "https://note.com/736b/rss",
  },
  {
    name: "speakerdeck",
    url: "https://speakerdeck.com/shiomiyan.rss",
  },
] as const satisfies readonly FeedConfig[];

export type Feed = (typeof SOURCES)[number];
export type FeedName = Feed["name"];
