import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { env } from "cloudflare:workers";

const ERROR_MESSAGE_POST_ID_REQUIRED = "post_id is required";
const ERROR_MESSAGE_INVALID_POST_ID = "Invalid post ID";
const ERROR_MESSAGE_INVALID_UPVOTE_COUNT = "Invalid upvote count";
const DEFAULT_UPVOTE_COUNT = 1;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const getKnownPostIds = async () => {
  const posts = await getCollection("posts");
  return new Set(posts.map((post: CollectionEntry<"posts">) => post.data.id));
};

const parseUpvoteCount = (rawUpvoteCount: string | null) => {
  const upvoteCount = parseInt(
    rawUpvoteCount ?? DEFAULT_UPVOTE_COUNT.toString(),
    10,
  );

  if (Number.isNaN(upvoteCount)) {
    throw new Error(ERROR_MESSAGE_INVALID_UPVOTE_COUNT);
  }

  return upvoteCount;
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get("post_id");

    if (!postId) {
      throw new Error(ERROR_MESSAGE_POST_ID_REQUIRED);
    }

    const upvotes = parseUpvoteCount(
      await env.BLOG_736B_MOE_UPVOTE_COUNTER.get(postId),
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
      throw new Error(ERROR_MESSAGE_INVALID_POST_ID);
    }

    const currentUpvotes = parseUpvoteCount(
      await env.BLOG_736B_MOE_UPVOTE_COUNTER.get(postId),
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
