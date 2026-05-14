import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

function sanitizeFilename(value: string): string {
  return (
    value
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
      .toLowerCase() || 'photo'
  );
}

function extensionFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const image = await prisma.projectImage.findUnique({
    where: { id },
    include: {
      project: {
        select: { slug: true, title: true, published: true, category: true },
      },
    },
  });

  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  if (!image.project.published) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(image.url);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch source file' },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: 'Failed to fetch source file' },
      { status: 502 }
    );
  }

  const contentType =
    upstream.headers.get('content-type') ||
    (image.type === 'video' ? 'video/mp4' : 'image/jpeg');

  const ext =
    extensionFromUrl(image.url) ||
    EXTENSION_BY_MIME[contentType.split(';')[0].trim()] ||
    (image.type === 'video' ? 'mp4' : 'jpg');

  const base = sanitizeFilename(image.project.slug || image.project.title);
  const filename = `${base}-${image.id.slice(-6)}.${ext}`;

  const headers = new Headers();
  headers.set('Content-Type', contentType);
  headers.set(
    'Content-Disposition',
    `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
  );
  const contentLength = upstream.headers.get('content-length');
  if (contentLength) headers.set('Content-Length', contentLength);
  headers.set('Cache-Control', 'private, max-age=0, no-store');

  return new NextResponse(upstream.body, { status: 200, headers });
}
