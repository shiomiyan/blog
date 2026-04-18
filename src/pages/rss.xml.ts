import rss from "@astrojs/rss";
import { SITE } from "@constants";
import { getCollection } from "astro:content";

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
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const items: RssItem[] = posts.map((item) => {
    const { title, description, date } = item.data;
    return {
      title,
      description,
      pubDate: date,
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
    site: context.site,
    items,
  });
}
