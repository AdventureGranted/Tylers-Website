import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

// GET materials for a project (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const materials = await prisma.materialItem.findMany({
    where: { projectId: id },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ materials });
}

// POST new material item (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { name, quantity, notes } = await request.json();

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 });
  }

  const material = await prisma.materialItem.create({
    data: {
      projectId: id,
      name: name.trim(),
      quantity: quantity || null,
      notes: notes || null,
    },
  });

  return NextResponse.json(material, { status: 201 });
}
