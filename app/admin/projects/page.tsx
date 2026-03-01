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
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            Manage Projects
          </h1>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="text-gray-500 transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/projects/new"
              className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-600 dark:bg-yellow-300 dark:hover:bg-yellow-400"
            >
              New Project
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-500">No projects yet.</p>
            <Link
              href="/admin/projects/new"
              className="mt-4 inline-block text-yellow-500 hover:underline dark:text-yellow-300"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project: ProjectWithImages) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {project.published ? 'Published' : 'Draft'} &middot;{' '}
                    {project.images.length} images
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
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
