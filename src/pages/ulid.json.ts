import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
	const posts = await getCollection("posts");
	const ulids = posts.map((post) => post.data.ulid);

	return new Response(JSON.stringify(ulids), {
		headers: { "Content-Type": "application/json" },
	});
};
