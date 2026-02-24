export default {
	async fetch(request: Request, env: Env): Promise<Response> {
      if (request.method === "GET" && new URL(request.url).pathname === "/") {
        return new Response("서버 정상 작동중");
      }
		
		// CORS 처리
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		// POST /generate 만 처리
		if (new URL(request.url).pathname === "/generate") {

			const { prompt } = await request.json();

			const apiKey = env.GEMINI_API_KEY;

			const response = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						contents: [
							{
								parts: [{ text: prompt }]
							}
						]
					}),
				}
			);

			const data = await response.json();

			return new Response(JSON.stringify(data), {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;
