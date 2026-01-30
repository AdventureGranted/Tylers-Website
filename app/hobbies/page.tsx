import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import Link from 'next/link';
import HobbyCard from '@/app/components/HobbyCard';
import { HiPlus } from 'react-icons/hi';

export default async function HobbiesPage() {
  const [projects, session] = await Promise.all([
    prisma.project.findMany({
      where: { published: true, category: 'hobby' },
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    }),
    getServerSession(authOptions),
  ]);

  const isAdmin = session?.user?.role === 'admin';

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-4xl font-bold text-white">Hobbies</h1>
        {isAdmin && (
          <Link
            href="/admin/projects/new?from=/hobbies"
            className="flex items-center gap-1 rounded-lg bg-yellow-300 px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-yellow-400"
          >
            <HiPlus className="h-4 w-4" />
            Add
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400">No hobby projects yet.</p>
      ) : (
        <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <HobbyCard
              key={project.id}
              slug={project.slug}
              title={project.title}
              description={project.description}
              images={project.images}
              beforeImageIndex={project.beforeImageIndex}
              afterImageIndex={project.afterImageIndex}
              compareMode={project.compareMode}
            />
          ))}
        </div>
      )}
    </main>
  );
}
