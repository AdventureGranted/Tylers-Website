import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

// GET links for a project (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const links = await prisma.projectLink.findMany({
    where: { projectId: id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ links });
}

// POST new link (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { title, url } = await request.json();

  if (!title?.trim() || !url?.trim()) {
    return NextResponse.json(
      { error: 'Title and URL required' },
      { status: 400 }
    );
  }

  const link = await prisma.projectLink.create({
    data: {
      projectId: id,
      title: title.trim(),
      url: url.trim(),
    },
  });

  return NextResponse.json(link, { status: 201 });
}
