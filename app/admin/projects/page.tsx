import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import type { ProjectWithImages } from '@/app/lib/types';

export default async function ProjectsAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/admin/projects');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: true },
  });

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-200">Manage Projects</h1>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="text-gray-400 transition-colors hover:text-yellow-300"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/projects/new"
              className="rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
            >
              New Project
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl bg-gray-800 p-8 text-center">
            <p className="text-gray-400">No projects yet.</p>
            <Link
              href="/admin/projects/new"
              className="mt-4 inline-block text-yellow-300 hover:underline"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project: ProjectWithImages) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-xl bg-gray-800 p-4"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-200">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {project.published ? 'Published' : 'Draft'} &middot;{' '}
                    {project.images.length} images
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="rounded-lg bg-gray-700 px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
