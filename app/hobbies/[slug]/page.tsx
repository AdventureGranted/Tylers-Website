import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import PhotoGrid from '@/app/components/PhotoGrid';
import CommentSection from '@/app/components/CommentSection';
import ReceiptManager from '@/app/components/ReceiptManager';
import LessonsLearned from '@/app/components/LessonsLearned';
import ProjectStatus from '@/app/components/ProjectStatus';
import TimeTracker from '@/app/components/TimeTracker';
import BudgetTracker from '@/app/components/BudgetTracker';
import ProjectTimeline from '@/app/components/ProjectTimeline';
import MaterialsChecklist from '@/app/components/MaterialsChecklist';
import PrivateNotes from '@/app/components/PrivateNotes';
import DifficultyRating from '@/app/components/DifficultyRating';
import ProjectTags from '@/app/components/ProjectTags';
import RelatedLinks from '@/app/components/RelatedLinks';
import BeforeAfterToggle from '@/app/components/BeforeAfterToggle';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import Image from 'next/image';
import { HiOutlinePhotograph } from 'react-icons/hi';

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tyler-grant.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      images: { take: 1, orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const ogImage = project.images[0]?.url || '/og-image.png';

  return {
    title: project.title,
    description:
      project.description ||
      `Check out ${project.title} - a hobby project by Tyler Grant`,
    alternates: {
      canonical: `${siteUrl}/hobbies/${slug}`,
    },
    openGraph: {
      title: project.title,
      description:
        project.description ||
        `Check out ${project.title} - a hobby project by Tyler Grant`,
      url: `${siteUrl}/hobbies/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description || `Check out ${project.title}`,
      images: [ogImage],
    },
  };
}

export default async function HobbyDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      receipts: true,
    },
  });

  if (!project || !project.published || project.category !== 'hobby') {
    notFound();
  }

  // Calculate actual cost from receipts
  const actualCost = project.receipts.reduce(
    (sum, r) => sum + r.toolAmount + r.materialAmount,
    0
  );

  // Public info sidebar (read-only for everyone)
  const PublicInfoSidebar = () => (
    <div className="space-y-4">
      <ProjectStatus
        projectId={project.id}
        initialStatus={project.status}
        readOnly
      />
      <ProjectTimeline projectId={project.id} readOnly />
      <DifficultyRating projectId={project.id} readOnly />
      <ProjectTags projectId={project.id} readOnly />
    </div>
  );

  // Admin left sidebar - Project info (read-only view)
  const AdminLeftSidebar = () => (
    <div className="space-y-4">
      <ProjectStatus
        projectId={project.id}
        initialStatus={project.status}
        readOnly
      />
      <ProjectTimeline projectId={project.id} readOnly />
      <DifficultyRating projectId={project.id} readOnly />
      <ProjectTags projectId={project.id} readOnly />
      <RelatedLinks projectId={project.id} readOnly />
      <PrivateNotes projectId={project.id} readOnly />
    </div>
  );

  // Admin right sidebar - Costs & tracking (read-only view)
  const AdminRightSidebar = () => (
    <div className="space-y-4">
      <BudgetTracker projectId={project.id} actualCost={actualCost} readOnly />
      <TimeTracker projectId={project.id} readOnly />
      <ReceiptManager projectId={project.id} readOnly allowUpload />
      <MaterialsChecklist projectId={project.id} readOnly />
      <LessonsLearned projectId={project.id} readOnly />
    </div>
  );

  // Combined for mobile (admin) - read-only view
  const AdminMobileSidebar = () => (
    <div className="space-y-4">
      <ProjectStatus
        projectId={project.id}
        initialStatus={project.status}
        readOnly
      />
      <ProjectTimeline projectId={project.id} readOnly />
      <BudgetTracker projectId={project.id} actualCost={actualCost} readOnly />
      <TimeTracker projectId={project.id} readOnly />
      <ReceiptManager projectId={project.id} readOnly allowUpload />
      <MaterialsChecklist projectId={project.id} readOnly />
      <DifficultyRating projectId={project.id} readOnly />
      <ProjectTags projectId={project.id} readOnly />
      <RelatedLinks projectId={project.id} readOnly />
      <LessonsLearned projectId={project.id} readOnly />
      <PrivateNotes projectId={project.id} readOnly />
    </div>
  );

  return (
    <main className="min-h-screen px-4 py-12">
      <div className={`mx-auto ${isAdmin ? 'max-w-[1600px]' : 'max-w-6xl'}`}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Hobbies', href: '/hobbies' },
            { label: project.title },
          ]}
        />

        {/* Back Navigation - far left */}
        <div className="mb-6">
          <Link
            href="/hobbies"
            className="inline-flex items-center text-[var(--text-muted)] transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
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
        </div>

        {/* Layout: 3-column for admin, 2-column for users */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          {/* Left Sidebar on desktop (Admin Only) */}
          {isAdmin && (
            <div className="hidden w-96 shrink-0 xl:block">
              <div className="sticky top-24">
                <AdminLeftSidebar />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="mx-auto max-w-4xl xl:min-w-0 xl:flex-1">
            {/* Title Row - title left, edit right */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <h1 className="text-4xl font-bold text-yellow-500 dark:text-yellow-300">
                {project.title}
              </h1>
              {isAdmin && (
                <Link
                  href={`/admin/projects/${project.id}?from=${encodeURIComponent(`/hobbies/${slug}`)}`}
                  className="inline-flex shrink-0 items-center rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
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

            {/* Description */}
            {project.description && (
              <p className="mb-6 text-xl text-[var(--text-secondary)]">
                {project.description}
              </p>
            )}

            {/* Before/After Toggle or Single Image */}
            {project.images.length >= 1 && (
              <div className="mb-8">
                {project.compareMode === 'single' ? (
                  <div className="rounded-2xl bg-[var(--input-bg)] p-4">
                    <div className="mb-3 flex items-center">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                        <HiOutlinePhotograph className="text-yellow-500 dark:text-yellow-300" />
                        Featured Photo
                      </h3>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-[var(--card-border)]">
                      {(() => {
                        // Filter to images only (same as BeforeAfterToggle does)
                        const imagesOnly = project.images.filter(
                          (img) => img.type !== 'video'
                        );
                        const imageIndex = project.afterImageIndex ?? 0;
                        const image = imagesOnly[imageIndex] || imagesOnly[0];
                        if (!image) return null;
                        return (
                          <Image
                            src={image.url}
                            alt={image.alt || project.title}
                            fill
                            className="object-cover"
                          />
                        );
                      })()}
                    </div>
                  </div>
                ) : project.images.length >= 2 ? (
                  <BeforeAfterToggle
                    images={project.images}
                    readOnly
                    initialBeforeIndex={project.beforeImageIndex ?? undefined}
                    initialAfterIndex={project.afterImageIndex ?? undefined}
                    initialMode={
                      (project.compareMode as 'toggle' | 'slider') ?? undefined
                    }
                  />
                ) : null}
              </div>
            )}

            {/* Content */}
            {project.content && (
              <div className="prose prose-invert dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-[var(--text-primary)]">
                  {project.content}
                </div>
              </div>
            )}

            {/* Photo grid - all photos */}
            {project.images.length > 0 && (
              <div className="mt-8 mb-8">
                <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
                  Photos
                </h3>
                <PhotoGrid images={project.images} />
              </div>
            )}

            {/* Sidebar on mobile */}
            <div className="mt-8 mb-8 xl:hidden">
              {isAdmin ? <AdminMobileSidebar /> : <PublicInfoSidebar />}
            </div>

            {/* Comments */}
            <CommentSection projectId={project.id} />
          </div>

          {/* Right Sidebar on desktop */}
          <div className="hidden w-96 shrink-0 xl:block">
            <div className="sticky top-24">
              {isAdmin ? <AdminRightSidebar /> : <PublicInfoSidebar />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
