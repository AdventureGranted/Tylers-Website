import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/app/components/PageTransition';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'View my software development projects including full-stack applications, self-hosted infrastructure, and mobile apps.',
};

// Pre-generated blur data URLs for project images
const blurDataURLs: Record<string, string> = {
  '/family.jpeg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAQMEAgMBAAAAAAAAAAAAAQIDBAAFBhEhEjEHQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABwRAAICAgMAAAAAAAAAAAAAAAECAAMEERIhQf/aAAwDAQACEQMRAD8Ax3CseuWRY1CuV3bZS0+yh9HiCQvSgDRIPBII/ta9SlRZGTUxd+xnR5z/2Q==',
  '/selfhosting.png':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAQMEAgMBAAAAAAAAAAAAAQIDBAUGAAcRIRITMUH/xAAVAQEBAAAAAAAAAAAAAAAAAAAEBf/EABwRAAICAgMAAAAAAAAAAAAAAAECAAMEERIhMf/aAAwDAQACEQMRAD8AzO2tv1K4bUpFS9bKYsSQyl9uMhwrUEqAIJUQACeeeOc5xjFLJrVAT2eO37//2Q==',
  '/boxie.png':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAcI/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQIDBAUGEQAHEiEIE0Fx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESITH/2gAMAwEAAhEDEEA/ANS7b2JAsmyaZbcN556PBbKfcv8AKlqJJUo8QByST116x1pdWk1t+p//2Q==',
};

export default function ProjectsPage() {
  const projects = [
    {
      title: 'Tyler-Grant.com',
      subtitle: 'Full-Stack Portfolio & Authentication System',
      link: 'https://github.com/AdventureGranted/Tylers-Website',
      date: 'June 2024 – Present',
      image: '/family.jpeg',
      bullets: [
        'Built a full-stack portfolio using Next.js, TypeScript, Tailwind CSS, and Framer Motion for smooth animations',
        'Implemented user authentication with NextAuth.js including registration, role-based access control, and profile management',
        'Integrated self-hosted AI chatbot powered by local LLM to answer visitor questions about my skills, experience, and projects',
        'Built a receipt parser demo using self-hosted vision AI model (Llama 3.2 Vision) to extract and categorize receipt data',
        'Self-hosted S3-compatible object storage using Garage for image uploads with Cloudflare tunnel for secure access',
        'Designed PostgreSQL database with Prisma ORM for users, projects, and comments',
        'Created admin dashboard for content and member management with search and filtering',
        'Deployed on personal server with GitHub Actions CI/CD pipeline for automated builds and deployments',
      ],
    },
    {
      title: 'Self Hosted Media & Automation Platform',
      subtitle: 'Full-Stack Infrastructure Development',
      link: null,
      date: 'September 2022 – Present',
      image: '/selfhosting.png',
      bullets: [
        'Built a full-stack, self-hosted ecosystem with Plex, Sonarr, Radarr, Home Assistant, and more using Docker and reverse proxies for secure access',
        'Automated home and media workflows via REST APIs, webhooks, and OAuth2 authentication',
        'Deployed GitHub Actions runners to streamline CI/CD for personal and open-source projects',
        'Implemented logging, backups, and monitoring tools to maintain uptime and system resilience',
      ],
    },
    {
      title: 'Boxy – Senior Project',
      subtitle: null,
      link: null,
      date: 'January 2022 – December 2022',
      image: '/boxie.png',
      bullets: [
        'Developed a mobile app for tracking and organizing bin-stored items using React Native, AWS Amplify, and Expo',
        'Authored user and technical documentation to support long-term maintainability and user onboarding',
      ],
    },
  ];

  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-[var(--text-primary)]">
          Projects
        </h1>
        <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-gray-700">
                <Image
                  src={project.image}
                  alt={project.title + ' image'}
                  fill
                  className={`${
                    project.image === '/boxie.png'
                      ? 'object-center'
                      : 'object-cover'
                  } transition-transform duration-300 hover:scale-105`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={idx === 0}
                  placeholder="blur"
                  blurDataURL={blurDataURLs[project.image]}
                />
              </div>
              <h2 className="mb-1 text-2xl font-semibold text-yellow-300">
                {project.title}
              </h2>
              {project.subtitle && (
                <div className="text-md mb-1 text-[var(--text-secondary)]">
                  {project.subtitle}
                </div>
              )}
              {project.link && (
                <Link
                  href={project.link}
                  className="text-md mb-1 text-[var(--text-secondary)]"
                >
                  {project.link}
                </Link>
              )}
              <div className="mb-3 text-sm text-[var(--text-secondary)]">
                {project.date}
              </div>
              <ul className="list-inside list-disc space-y-2 pl-2 text-[var(--text-primary)]">
                {project.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </PageTransition>
  );
}
