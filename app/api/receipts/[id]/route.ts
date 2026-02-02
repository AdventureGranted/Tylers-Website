import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

// PUT - Update a receipt (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const receipt = await prisma.receipt.findUnique({
    where: { id },
  });

  if (!receipt) {
    return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
  }

  const { toolAmount, materialAmount, miscAmount, description, items } =
    await request.json();

  const toolAmt = parseFloat(toolAmount) || 0;
  const materialAmt = parseFloat(materialAmount) || 0;
  const miscAmt = parseFloat(miscAmount) || 0;

  if (toolAmt === 0 && materialAmt === 0 && miscAmt === 0) {
    return NextResponse.json(
      { error: 'At least one amount is required' },
      { status: 400 }
    );
  }

  // If items provided, delete existing and create new ones
  if (items !== undefined) {
    await prisma.receiptItem.deleteMany({
      where: { receiptId: id },
    });
  }

  const updated = await prisma.receipt.update({
    where: { id },
    data: {
      toolAmount: toolAmt,
      materialAmount: materialAmt,
      miscAmount: miscAmt,
      description: description || null,
      items:
        items && items.length > 0
          ? {
              create: items.map(
                (item: { name: string; price: number; category: string }) => ({
                  name: item.name,
                  price: item.price,
                  category: item.category,
                })
              ),
            }
          : undefined,
    },
    include: { items: true },
  });

  return NextResponse.json(updated);
}

// DELETE a receipt (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const receipt = await prisma.receipt.findUnique({
    where: { id },
  });

  if (!receipt) {
    return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
  }

  await prisma.receipt.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
