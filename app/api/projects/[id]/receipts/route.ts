import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

// GET receipts for a project (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const receipts = await prisma.receipt.findMany({
    where: { projectId: id },
    orderBy: { createdAt: 'desc' },
  });

  const toolTotal = receipts
    .filter((r) => r.category === 'tool')
    .reduce((sum, r) => sum + r.amount, 0);
  const materialTotal = receipts
    .filter((r) => r.category === 'material')
    .reduce((sum, r) => sum + r.amount, 0);
  const total = toolTotal + materialTotal;

  return NextResponse.json({ receipts, total, toolTotal, materialTotal });
}

// POST new receipt (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Verify project exists
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const { imageUrl, amount, category, description } = await request.json();

  if (!imageUrl || amount === undefined) {
    return NextResponse.json(
      { error: 'Image URL and amount are required' },
      { status: 400 }
    );
  }

  const receipt = await prisma.receipt.create({
    data: {
      projectId: id,
      imageUrl,
      amount: parseFloat(amount),
      category: category || 'material',
      description,
    },
  });

  return NextResponse.json(receipt, { status: 201 });
}
