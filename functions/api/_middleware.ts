interface Env {
	FUNCTIONS_CORS_ORIGIN: string;
}

// Respond to OPTIONS method
export const onRequestOptions: PagesFunction<Env> = async (context) => {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": context.env.FUNCTIONS_CORS_ORIGIN,
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Max-Age": "86400",
		},
	});
};

// Set CORS to all /api responses
export const onRequest: PagesFunction<Env> = async (context) => {
	const response = await context.next();
	response.headers.set(
		"Access-Control-Allow-Origin",
		context.env.FUNCTIONS_CORS_ORIGIN,
	);
	response.headers.set("Access-Control-Max-Age", "86400");
	return response;
};
