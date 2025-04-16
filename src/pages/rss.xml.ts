import rss from "@astrojs/rss";
import { SITE } from "@consts";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

type Context = {
	site: string;
};

const parser = new MarkdownIt();

export async function GET(context: Context) {
	const posts = (await getCollection("posts")).filter(
		(post) => !post.data.draft,
	);

	const items = [...posts].sort(
		(a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
	);

	return rss({
		title: SITE.TITLE,
		description: SITE.DESCRIPTION,
		site: context.site,
		items: items.map((item) => ({
			title: item.data.title,
			description: item.data.description,
			pubDate: item.data.date,
			link: `/${item.collection}/${item.slug}/`,
			content: sanitizeHtml(parser.render(item.body)),
		})),
	});
}
