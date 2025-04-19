import rss from "@astrojs/rss";
import { SITE } from "@constants";
import { getCollection } from "astro:content";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

type Context = {
	site: string;
};

export async function GET(context: Context) {
	const posts = (await getCollection("posts")).filter(
		(post) => !post.data.draft,
	);

	const items = await Promise.all(
		posts.map(async (item) => {
			const { title, description, date } = item.data;
			const content = sanitizeHtml(await marked.parse(item.body));
			return {
				title,
				description,
				pubDate: date,
				link: `/${item.collection}/${item.slug}/`,
				content,
			};
		}),
	);
	items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

	return rss({
		title: SITE.TITLE,
		description: SITE.DESCRIPTION,
		site: context.site,
		items,
	});
}
