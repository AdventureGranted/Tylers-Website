import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

// GET time entries for a project (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const entries = await prisma.timeEntry.findMany({
    where: { projectId: id },
    orderBy: { date: 'desc' },
  });

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  return NextResponse.json({ entries, totalHours });
}

// POST new time entry (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { hours, description, date } = await request.json();

  if (!hours || hours <= 0) {
    return NextResponse.json(
      { error: 'Valid hours required' },
      { status: 400 }
    );
  }

  const entry = await prisma.timeEntry.create({
    data: {
      projectId: id,
      hours: parseFloat(hours),
      description: description || null,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
