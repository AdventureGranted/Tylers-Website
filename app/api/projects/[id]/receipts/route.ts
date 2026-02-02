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

  const toolTotal = receipts.reduce((sum, r) => sum + r.toolAmount, 0);
  const materialTotal = receipts.reduce((sum, r) => sum + r.materialAmount, 0);
  const miscTotal = receipts.reduce((sum, r) => sum + r.miscAmount, 0);
  const total = toolTotal + materialTotal + miscTotal;

  return NextResponse.json({
    receipts,
    total,
    toolTotal,
    materialTotal,
    miscTotal,
  });
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

  const { imageUrl, toolAmount, materialAmount, miscAmount, description } =
    await request.json();

  const toolAmt = parseFloat(toolAmount) || 0;
  const materialAmt = parseFloat(materialAmount) || 0;
  const miscAmt = parseFloat(miscAmount) || 0;

  if (toolAmt === 0 && materialAmt === 0 && miscAmt === 0) {
    return NextResponse.json(
      { error: 'At least one amount (tool, material, or misc) is required' },
      { status: 400 }
    );
  }

  const receipt = await prisma.receipt.create({
    data: {
      projectId: id,
      imageUrl: imageUrl || null,
      toolAmount: toolAmt,
      materialAmount: materialAmt,
      miscAmount: miscAmt,
      description,
    },
  });

  return NextResponse.json(receipt, { status: 201 });
}
