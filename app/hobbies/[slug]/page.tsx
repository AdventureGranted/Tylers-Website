import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import PhotoGrid from '@/app/components/PhotoGrid';
import CommentSection from '@/app/components/CommentSection';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function HobbyDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';

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
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/hobbies"
            className="inline-flex items-center text-gray-400 transition-colors hover:text-yellow-300"
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

          {isAdmin && (
            <Link
              href={`/admin/projects/${project.id}?from=${encodeURIComponent(`/hobbies/${slug}`)}`}
              className="inline-flex items-center rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit
            </Link>
          )}
        </div>

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

        {/* Comments */}
        <CommentSection projectId={project.id} />
      </div>
    </main>
  );
}
