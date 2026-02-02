import { Metadata } from 'next';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import SortableHobbyGrid from '@/app/components/SortableHobbyGrid';
import PageTransition from '@/app/components/PageTransition';

export const metadata: Metadata = {
  title: 'Hobbies & Projects',
  description:
    'Explore my hobby projects including woodworking, DIY builds, and creative endeavors.',
};

// Revalidate page data every 60 seconds
export const revalidate = 60;

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
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center px-4 py-12">
        <SortableHobbyGrid projects={projects} isAdmin={isAdmin} />
      </main>
    </PageTransition>
  );
}
