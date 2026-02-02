import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { AI_SYSTEM_PROMPT } from '@/app/lib/ai-context';

const OPENWEBUI_URL = process.env.OPENWEBUI_URL || 'http://192.168.1.203:8080';
const OPENWEBUI_API_KEY = process.env.OPENWEBUI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'qwen2.5:14b';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Fetch hobby projects from database and format for AI context
async function getHobbiesContext(): Promise<string> {
  try {
    const hobbies = await prisma.project.findMany({
      where: { published: true, category: 'hobby' },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        title: true,
        slug: true,
        description: true,
        status: true,
        tags: true,
        completionDate: true,
      },
    });

    if (hobbies.length === 0) {
      return '';
    }

    // Find the most recently completed project (by completionDate)
    const completedHobbies = hobbies.filter((h) => h.completionDate !== null);
    const latestCompleted = completedHobbies.sort(
      (a, b) =>
        new Date(b.completionDate!).getTime() -
        new Date(a.completionDate!).getTime()
    )[0];

    let context = '\n\n## Current Hobby Projects (from database)\n';
    context +=
      "These are Tyler's hobby projects showcased on the Hobbies page. When discussing a specific project, include a markdown link so visitors can view it (e.g., [Toy Room](/hobbies/toy-room)):\n\n";

    hobbies.forEach((hobby, index) => {
      const isLatest =
        latestCompleted && hobby.title === latestCompleted.title
          ? ' [MOST RECENTLY COMPLETED]'
          : '';
      context += `### ${index + 1}. ${hobby.title}${isLatest}\n`;
      context += `- URL: /hobbies/${hobby.slug}\n`;
      if (hobby.description) {
        context += `${hobby.description}\n`;
      }
      if (hobby.status) {
        context += `- Status: ${hobby.status}\n`;
      }
      if (hobby.tags && Array.isArray(hobby.tags) && hobby.tags.length > 0) {
        context += `- Tags: ${(hobby.tags as string[]).join(', ')}\n`;
      }
      context += '\n';
    });

    return context;
  } catch (error) {
    console.error('Error fetching hobbies for AI context:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, userName, sessionId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the latest user message to save
    const latestUserMessage = messages
      .filter((m: ChatMessage) => m.role === 'user')
      .pop();

    // Update session message count and save the user's question
    if (sessionId && latestUserMessage) {
      prisma.chatSession
        .update({
          where: { id: sessionId },
          data: {
            messageCount: { increment: 1 },
            lastActiveAt: new Date(),
            messages: {
              create: {
                content: latestUserMessage.content,
              },
            },
          },
        })
        .catch((err) => console.error('Failed to update chat session:', err));
    }

    // Get dynamic hobbies context
    const hobbiesContext = await getHobbiesContext();

    // Build user context if we have a name
    const userContext = userName
      ? `\n\n## Current Visitor\nYou are chatting with ${userName}. Address them by name when appropriate to make the conversation personal.`
      : '';

    // Build the full message history with system prompt + dynamic hobbies + user context
    const fullMessages: ChatMessage[] = [
      {
        role: 'system',
        content: AI_SYSTEM_PROMPT + hobbiesContext + userContext,
      },
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
