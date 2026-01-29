import { prisma } from '@/app/lib/prisma';
import HobbyCard from '@/app/components/HobbyCard';

export default async function HobbiesPage() {
  const projects = await prisma.project.findMany({
    where: { published: true, category: 'hobby' },
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">Hobbies</h1>

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
