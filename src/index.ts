export default {
  async fetch(request: Request, env: Env): Promise<Response> {

    const url = new URL(request.url);

    // CORS 처리
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // POST /generate 만 허용
    if (request.method === "POST" && url.pathname === "/generate") {

      try {
        const body = await request.json();
        const prompt = body.prompt;

        if (!prompt) {
          return new Response("Prompt is required", { status: 400 });
        }

        const apiKey = env.GEMINI_API_KEY;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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

        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response";

        return new Response(JSON.stringify({ text }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });

      } catch (err) {
        return new Response("Server Error", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
