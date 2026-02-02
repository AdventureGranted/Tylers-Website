import { NextRequest } from 'next/server';
import { AI_SYSTEM_PROMPT } from '@/app/lib/ai-context';

const OPENWEBUI_URL = process.env.OPENWEBUI_URL || 'http://192.168.1.203:8080';
const OPENWEBUI_API_KEY = process.env.OPENWEBUI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'qwen2.5:14b';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build the full message history with system prompt
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      ...messages,
    ];

    // Call OpenWebUI API (OpenAI-compatible endpoint)
    const response = await fetch(`${OPENWEBUI_URL}/api/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(OPENWEBUI_API_KEY && {
          Authorization: `Bearer ${OPENWEBUI_API_KEY}`,
        }),
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: fullMessages,
        stream: true,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWebUI error:', response.status, errorText);
      console.error('Using URL:', `${OPENWEBUI_URL}/api/v1/chat/completions`);
      console.error('API Key present:', !!OPENWEBUI_API_KEY);
      console.error('API Key length:', OPENWEBUI_API_KEY?.length);
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the response back to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }
                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch {
                  // Skip malformed JSON lines
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
