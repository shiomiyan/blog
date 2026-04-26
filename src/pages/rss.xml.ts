import rss from "@astrojs/rss";
import { SITE } from "@constants";
import type { APIContext } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const prerender = true;

type RssItem = {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
  content: string;
};

export const GET = async (context: APIContext) => {
  const posts = await getCollection(
    "posts",
    (entry: CollectionEntry<"posts">) => !entry.data.draft,
  );
  const items: RssItem[] = posts.map((item: CollectionEntry<"posts">) => {
    const { title, description, created } = item.data;
    return {
      title,
      description,
      pubDate: created,
      link: `/${item.collection}/${item.id}/`,
      content: item.rendered?.html ?? "",
    };
  });
  items.sort(
    (a: RssItem, b: RssItem) => b.pubDate.getTime() - a.pubDate.getTime(),
  );

  return rss({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    site: context.site ?? context.url.origin,
    items,
  });
};
