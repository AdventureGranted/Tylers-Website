import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, slug, category, description, content, published, images } =
      await request.json();

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        category: category ?? 'hobby',
        description,
        content,
        published: published ?? false,
        images: {
          create: (images || []).map(
            (img: { url: string; alt?: string; sortOrder?: number }) => ({
              url: img.url,
              alt: img.alt || null,
              sortOrder: img.sortOrder || 0,
            })
          ),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
