import { MetadataRoute } from 'next';
import { prisma } from './lib/prisma';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tyler-grant.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/hobbies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic hobby project pages
  let hobbyPages: MetadataRoute.Sitemap = [];
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    hobbyPages = projects.map((project) => ({
      url: `${siteUrl}/hobbies/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // If database is unavailable, continue with static pages only
    console.error('Failed to fetch projects for sitemap');
  }

  return [...staticPages, ...hobbyPages];
}
