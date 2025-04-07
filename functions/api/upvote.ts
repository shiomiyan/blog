interface Env {
  blog_736b_moe_upvote_counter: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    // リクエストのJSONを解析
    const { post_id } = await context.request.json<{ post_id: string }>();

    if (!post_id) {
      return new Response(JSON.stringify({ error: "post_id is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // KVから現在のupvote数を取得（存在しない場合は0）
    const currentUpvotes = parseInt(await context.env.blog_736b_moe_upvote_counter.get(post_id) || "0");

    // upvote数をインクリメント
    const newUpvotes = currentUpvotes + 1;

    // 更新された値をKVに保存
    await context.env.blog_736b_moe_upvote_counter.put(post_id, newUpvotes.toString());

    return new Response(JSON.stringify({
      post_id,
      upvotes: newUpvotes
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error processing upvote:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

// GETリクエストで現在のupvote数を取得できるようにする
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    // URLからpost_idを取得
    const url = new URL(context.request.url);
    const post_id = url.searchParams.get("post_id");

    if (!post_id) {
      return new Response(JSON.stringify({ error: "post_id parameter is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // KVから現在のupvote数を取得
    const upvotes = parseInt(await context.env.blog_736b_moe_upvote_counter.get(post_id) || "0");

    return new Response(JSON.stringify({
      post_id,
      upvotes
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching upvote count:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
