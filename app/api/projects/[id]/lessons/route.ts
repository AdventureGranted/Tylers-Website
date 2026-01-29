import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

// GET lessons learned for a project (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: { lessonsLearned: true },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ lessons: project.lessonsLearned });
}

// PUT update lessons learned (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { lessons } = await request.json();

  if (!Array.isArray(lessons)) {
    return NextResponse.json(
      { error: 'Lessons must be an array' },
      { status: 400 }
    );
  }

  const project = await prisma.project.update({
    where: { id },
    data: { lessonsLearned: lessons },
    select: { lessonsLearned: true },
  });

  return NextResponse.json({ lessons: project.lessonsLearned });
}
