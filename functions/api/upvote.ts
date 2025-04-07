interface Env {
	blog_736b_moe_upvote_counter: KVNamespace;
}

/**
 * Request handler for POST requests.
 * Increment the upvote count for a post.
 * @param context EventContext
 * @returns
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
	try {
		const { post_id } = await context.request.json<{ post_id: string }>();

		if (!post_id) {
			return new Response(JSON.stringify({ error: "post_id is required" }), {
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		const kv = context.env.blog_736b_moe_upvote_counter;
		// Get upvote count from KV
		const currentUpvotes = parseInt((await kv.get(post_id)) || "1");

		// Increment upvote count
		const newUpvotes = currentUpvotes + 1;

		// Save updated value to KV
		await kv.put(post_id, newUpvotes.toString());

		return new Response(
			JSON.stringify({
				post_id,
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
				JSON.stringify({ error: "post_id parameter is required" }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const kv = context.env.blog_736b_moe_upvote_counter;

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
		console.error("Error fetching upvote count:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};
