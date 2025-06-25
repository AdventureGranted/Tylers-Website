import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsPage() {
  const projects = [
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
    {
      title: 'Tyler-Grant.com',
      subtitle: null,
      link: 'https://github.com/AdventureGranted/Tylers-Website',
      date: 'June – Present',
      image: '/family.jpeg',
      bullets: [
        'Created a personal portfolio website using Next.js, TypeScript, and Tailwind CSS',
        'Implemented server-side rendering for SEO optimization and fast initial load times',
        'Deployed on personal server with automated CI/CD workflows for seamless updates',
      ],
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">Projects</h1>
      <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
          >
            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-2xl border border-gray-700 bg-gray-700">
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
              />
            </div>
            <h2 className="mb-1 text-2xl font-semibold text-yellow-300">
              {project.title}
            </h2>
            {project.subtitle && (
              <div className="text-md mb-1 text-gray-400">
                {project.subtitle}
              </div>
            )}
            {project.link && (
              <Link href={project.link} className="text-md mb-1 text-gray-400">
                {project.link}
              </Link>
            )}
            <div className="mb-3 text-sm text-gray-400">{project.date}</div>
            <ul className="list-inside list-disc space-y-2 pl-2 text-gray-200">
              {project.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
