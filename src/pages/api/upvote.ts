import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { env } from "cloudflare:workers";

const ERROR_MESSAGE_POST_ID_REQUIRED = "post_id is required";
const ERROR_MESSAGE_INVALID_ULID = "Invalid ULID";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const getKnownPostIds = async () => {
  const posts = await getCollection("posts");
  return new Set(posts.map((post: CollectionEntry<"posts">) => post.data.ulid));
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get("post_id");

    if (!postId) {
      throw new Error(ERROR_MESSAGE_POST_ID_REQUIRED);
    }

    const upvotes = parseInt(
      (await env.BLOG_736B_MOE_UPVOTE_COUNTER.get(postId)) || "1",
      10,
    );

    return json({
      post_id: postId,
      upvotes,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { post_id: postId } = await request.json<{ post_id: string }>();

    if (!postId) {
      throw new Error(ERROR_MESSAGE_POST_ID_REQUIRED);
    }

    const knownPostIds = await getKnownPostIds();
    if (!knownPostIds.has(postId)) {
      throw new Error(ERROR_MESSAGE_INVALID_ULID);
    }

    const currentUpvotes = parseInt(
      (await env.BLOG_736B_MOE_UPVOTE_COUNTER.get(postId)) || "1",
      10,
    );
    const newUpvotes = currentUpvotes + 1;

    await env.BLOG_736B_MOE_UPVOTE_COUNTER.put(postId, newUpvotes.toString());

    return json({
      post_id: postId,
      upvotes: newUpvotes,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
};
