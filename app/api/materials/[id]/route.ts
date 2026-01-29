import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

// PUT update material item (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { name, acquired, quantity, notes } = await request.json();

  const material = await prisma.materialItem.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(acquired !== undefined && { acquired }),
      ...(quantity !== undefined && { quantity }),
      ...(notes !== undefined && { notes }),
    },
  });

  return NextResponse.json(material);
}

// DELETE a material item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  await prisma.materialItem.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
