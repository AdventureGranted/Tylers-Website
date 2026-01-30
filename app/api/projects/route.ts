import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
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

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      title,
      slug,
      category,
      description,
      content,
      published,
      images,
      status,
      difficulty,
      estimatedBudget,
      startDate,
      completionDate,
      privateNotes,
      tags,
      lessonsLearned,
      links,
    } = await request.json();

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
        status: status ?? 'planning',
        difficulty: difficulty ?? null,
        estimatedBudget: estimatedBudget ?? null,
        startDate: startDate ? new Date(startDate) : null,
        completionDate: completionDate ? new Date(completionDate) : null,
        privateNotes: privateNotes ?? null,
        tags: tags ?? [],
        lessonsLearned: lessonsLearned ?? [],
        images: {
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
        links: {
          create: (links || []).map((link: { title: string; url: string }) => ({
            title: link.title,
            url: link.url,
          })),
        },
      },
      include: { images: true, links: true },
    });

    // Revalidate the hobbies and projects pages so they show the new content
    revalidatePath('/hobbies');
    revalidatePath('/projects');

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
