import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, email, userId } = await request.json();

    // Visitors can chat anonymously; contact info is optional
    const session = await prisma.chatSession.create({
      data: {
        visitorName: (typeof name === 'string' && name.trim()) || 'Anonymous',
        visitorEmail: (typeof email === 'string' && email.trim()) || '',
        userId: userId || null,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// Attach visitor info to an existing (anonymous) session
export async function PATCH(request: NextRequest) {
  try {
    const { sessionId, name, email } = await request.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    if (!trimmedName && !trimmedEmail) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        ...(trimmedName ? { visitorName: trimmedName } : {}),
        ...(trimmedEmail ? { visitorEmail: trimmedEmail } : {}),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error updating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
