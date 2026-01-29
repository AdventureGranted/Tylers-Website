import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

// GET project metadata (public for basic info, admin for private notes)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      status: true,
      estimatedBudget: isAdmin,
      startDate: true,
      completionDate: true,
      privateNotes: isAdmin,
      difficulty: true,
      tags: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PUT update project metadata (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();

  const updateData: Record<string, unknown> = {};

  if (data.status !== undefined) updateData.status = data.status;
  if (data.estimatedBudget !== undefined)
    updateData.estimatedBudget = data.estimatedBudget;
  if (data.startDate !== undefined)
    updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.completionDate !== undefined)
    updateData.completionDate = data.completionDate
      ? new Date(data.completionDate)
      : null;
  if (data.privateNotes !== undefined)
    updateData.privateNotes = data.privateNotes;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
  if (data.tags !== undefined) updateData.tags = data.tags;

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
    select: {
      status: true,
      estimatedBudget: true,
      startDate: true,
      completionDate: true,
      privateNotes: true,
      difficulty: true,
      tags: true,
    },
  });

  return NextResponse.json(project);
}
