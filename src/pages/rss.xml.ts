import rss from "@astrojs/rss";
import { SITE } from "@constants";
import { getCollection, type CollectionEntry } from "astro:content";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export const prerender = true;

type Context = {
  site: string;
};

type RssItem = {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
  content: string;
};

export async function GET(context: Context) {
  const posts = (await getCollection("posts")).filter(
    (post: CollectionEntry<"posts">) => !post.data.draft,
  );

  const items: RssItem[] = await Promise.all(
    posts.map(async (item: CollectionEntry<"posts">) => {
      const { title, description, date } = item.data;
      const content = sanitizeHtml(await marked.parse(item.body ?? ""));
      return {
        title,
        description,
        pubDate: date,
        link: `/${item.collection}/${item.id}/`,
        content,
      };
    }),
  );
  items.sort((a: RssItem, b: RssItem) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    site: context.site,
    items,
  });
}
