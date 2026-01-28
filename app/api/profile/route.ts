import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await request.json();

    // Get current user to check name change cooldown
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, nameChangedAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if name is actually changing
    const isNameChanging = name !== user.name;

    if (isNameChanging && user.nameChangedAt) {
      const timeSinceLastChange = Date.now() - user.nameChangedAt.getTime();
      if (timeSinceLastChange < THIRTY_DAYS_MS) {
        const daysRemaining = Math.ceil(
          (THIRTY_DAYS_MS - timeSinceLastChange) / (24 * 60 * 60 * 1000)
        );
        return NextResponse.json(
          {
            error: `You can only change your display name once per month. Please wait ${daysRemaining} more day${daysRemaining === 1 ? '' : 's'}.`,
          },
          { status: 429 }
        );
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        ...(isNameChanging && { nameChangedAt: new Date() }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
