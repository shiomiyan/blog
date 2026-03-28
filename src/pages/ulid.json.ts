import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getCollection("posts");
  const ulids = posts.map((post: CollectionEntry<"posts">) => post.data.ulid);

  return new Response(JSON.stringify(ulids), {
    headers: { "Content-Type": "application/json" },
  });
};
