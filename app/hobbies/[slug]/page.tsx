import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/app/lib/prisma';
import PhotoGrid from '@/app/components/PhotoGrid';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function HobbyDetailPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!project || !project.published || project.category !== 'hobby') {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/hobbies"
          className="mb-6 inline-flex items-center text-gray-400 transition-colors hover:text-yellow-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="mr-2 h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Hobbies
        </Link>

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold text-yellow-300">
          {project.title}
        </h1>

        {/* Description */}
        {project.description && (
          <p className="mb-6 text-xl text-gray-400">{project.description}</p>
        )}

        {/* Photo grid */}
        {project.images.length > 0 && (
          <div className="mb-8">
            <PhotoGrid images={project.images} />
          </div>
        )}

        {/* Content */}
        {project.content && (
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-200">
              {project.content}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
