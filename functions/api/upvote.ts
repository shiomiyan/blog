const ERROR_MESSAGE_POST_ID_REQUIRED = "post_id is required";
const ERROR_MESSAGE_FAILED_TO_FETCH_ULIDS = "Failed to fetch ulids.json";
const ERROR_MESSAGE_INVALID_ULID = "Invalid ULID";
/**
 * Request handler for POST requests.
 * Increment the upvote count for a post.
 * @param context EventContext
 * @returns
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
	try {
		const { post_id: postId } = await context.request.json<{
			post_id: string;
		}>();

		// リクエストにpost_idがない場合はエラーレスポンスを返す
		if (!postId) {
			return new Response(
				JSON.stringify({ error: ERROR_MESSAGE_POST_ID_REQUIRED }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		// ビルド時に生成したulids.jsonをHTTP経由で取得する
		// わざわざ取りに行かない方法はないものだろうか...
		const dataResponse = await fetch(
			context.env.FUNCTIONS_CORS_ORIGIN + "/data/ulids.json",
		);
		// ulids.jsonに存在しないpost_idが指定されていたらエラーレスポンスを返す
		if (!dataResponse.ok) {
			return new Response(
				JSON.stringify({ error: ERROR_MESSAGE_FAILED_TO_FETCH_ULIDS }),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const json = await dataResponse.json<{ ulid: string[] }>();
		const ulids = json.ulid;
		if (!ulids.includes(postId)) {
			return new Response(
				JSON.stringify({ error: ERROR_MESSAGE_INVALID_ULID }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const kv = context.env.BLOG_736B_MOE_UPVOTE_COUNTER;
		// Get upvote count from KV
		const currentUpvotes = parseInt((await kv.get(postId)) || "1");

		// Increment upvote count
		const newUpvotes = currentUpvotes + 1;

		// Save updated value to KV
		await kv.put(postId, newUpvotes.toString());

		return new Response(
			JSON.stringify({
				post_id: postId,
				upvotes: newUpvotes,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("Error processing upvote:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};

/**
 * Request handler for GET requests.
 * Get the current upvote count for a post.
 * @param context EventContext
 * @returns
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
	try {
		const url = new URL(context.request.url);
		const post_id = url.searchParams.get("post_id");

		if (!post_id) {
			return new Response(
				JSON.stringify({ error: ERROR_MESSAGE_POST_ID_REQUIRED }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const kv = context.env.BLOG_736B_MOE_UPVOTE_COUNTER;

		// Get upvote count from KV
		const upvotes = parseInt((await kv.get(post_id)) || "1");

		return new Response(
			JSON.stringify({
				post_id,
				upvotes,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};
