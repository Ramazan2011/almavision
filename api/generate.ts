// api/generate.ts
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();

    // Use "as any" to bypass the TypeScript 'Cannot find name process' error
    // This works because Vercel provides 'process' at runtime automatically
    const apiKey = (globalThis as any).process.env.VITE_LANGDOCK_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key missing on server' }), { status: 500 });
    }

    const response = await fetch('https://api.langdock.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...body,
        stream: true,
      }),
    });

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
