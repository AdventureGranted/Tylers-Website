import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import SortableHobbyGrid from '@/app/components/SortableHobbyGrid';

export default async function HobbiesPage() {
  const [projects, session] = await Promise.all([
    prisma.project.findMany({
      where: { published: true, category: 'hobby' },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    }),
    getServerSession(authOptions),
  ]);

  const isAdmin = session?.user?.role === 'admin';

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 px-4 py-12">
      <SortableHobbyGrid projects={projects} isAdmin={isAdmin} />
    </main>
  );
}
