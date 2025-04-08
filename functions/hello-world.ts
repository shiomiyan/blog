export const onRequestGet: PagesFunction<Env> = async (context) => {
	const teapot = "🫖";
	return new Response(JSON.stringify({ whoami: teapot }), {
		status: 418,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
