// api/generate.ts
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { prompt, messages } = await req.json();
  
  const response = await fetch('https://api.langdock.com/openai/eu/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VITE_LANGDOCK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messages,
      stream: true,
    }),
  });

  return new Response(response.body);
}
