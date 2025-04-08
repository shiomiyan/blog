export const onRequestGet: PagesFunction<Env> = async (context) => {
	return new Response(JSON.stringify(context.request.headers), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
