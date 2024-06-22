import { parseFeed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { writeJson } from "https://deno.land/x/jsonfile@1.0.0/mod.ts";

const rssURLs = [
    "https://qiita.com/736b/feed",
];

const allEntries: Array<{ title: string; link: string; pubDate: string }> = [];

for (const rssURL of rssURLs) {
    const response = await fetch(rssURL);
    const xml = await response.text();
    const feed = await parseFeed(xml);

    const entries = feed.entries
        .filter((entry) =>
            entry.title && entry.title.value && entry.links && entry.links[0] &&
            entry.published
        )
        .map((entry) => ({
            title: entry.title.value,
            link: entry.links[0].href,
            pubDate: entry.published,
        }));

    allEntries.push(...entries);
}

await writeJson("data/rss.json", allEntries, { spaces: 2 });
