import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const {
      title,
      slug,
      category,
      description,
      content,
      published,
      images,
      beforeImageIndex,
      afterImageIndex,
      compareMode,
    } = await request.json();

    // Check if slug is taken by another project
    if (slug) {
      const existing = await prisma.project.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'A project with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update project and replace images
    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        description,
        content,
        published,
        beforeImageIndex: beforeImageIndex ?? null,
        afterImageIndex: afterImageIndex ?? null,
        compareMode: compareMode ?? 'toggle',
        images: {
          deleteMany: {},
          create: (images || []).map(
            (img: {
              url: string;
              alt?: string;
              sortOrder?: number;
              type?: string;
            }) => ({
              url: img.url,
              alt: img.alt || null,
              sortOrder: img.sortOrder || 0,
              type: img.type || 'image',
            })
          ),
        },
      },
      include: { images: true },
    });

    // Revalidate pages that display projects
    revalidatePath('/hobbies');
    revalidatePath('/projects');
    revalidatePath(`/hobbies/${project.slug}`);

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.project.delete({ where: { id } });

    // Revalidate pages that display projects
    revalidatePath('/hobbies');
    revalidatePath('/projects');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
