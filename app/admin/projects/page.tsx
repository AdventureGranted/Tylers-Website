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
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Manage Projects
          </h1>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="text-[var(--text-muted)] transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
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
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-center">
            <p className="text-[var(--text-muted)]">No projects yet.</p>
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
                className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4"
              >
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    {project.title}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    {project.published ? 'Published' : 'Draft'} &middot;{' '}
                    {project.images.length} images
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-2 text-[var(--text-primary)] transition-colors hover:bg-[var(--nav-hover)]"
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
