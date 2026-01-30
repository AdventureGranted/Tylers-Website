import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projectIds } = await request.json();

    if (!Array.isArray(projectIds)) {
      return NextResponse.json(
        { error: 'projectIds must be an array' },
        { status: 400 }
      );
    }

    // Update each project's sortOrder based on its position in the array
    await Promise.all(
      projectIds.map((id: string, index: number) =>
        prisma.project.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    // Revalidate the hobbies page
    revalidatePath('/hobbies');
    revalidatePath('/projects');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder projects:', error);
    return NextResponse.json(
      { error: 'Failed to reorder projects' },
      { status: 500 }
    );
  }
}
