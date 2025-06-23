export default function ProjectsPage() {
  const projects = [
    {
      title: "Self Hosted Media & Automation Platform",
      subtitle: "Full-Stack Infrastructure Development",
      date: "September 2022 – Present",
      bullets: [
        "Built a full-stack, self-hosted ecosystem with Plex, Sonarr, Radarr, Home Assistant, and more using Docker and reverse proxies for secure access",
        "Automated home and media workflows via REST APIs, webhooks, and OAuth2 authentication",
        "Deployed GitHub Actions runners to streamline CI/CD for personal and open-source projects",
        "Implemented logging, backups, and monitoring tools to maintain uptime and system resilience",
      ],
    },
    {
      title: "Boxy – Senior Project",
      subtitle: null,
      date: "January 2022 – December 2022",
      bullets: [
        "Developed a mobile app for tracking and organizing bin-stored items using React Native, AWS Amplify, and Expo",
        "Authored user and technical documentation to support long-term maintainability and user onboarding",
      ],
    },
    {
      title: "Tyler-Grant.com",
      subtitle: "https://github.com/AdventureGranted/Tylers-Website",
      date: "June – Present",
      bullets: [
        "Created a personal portfolio website using Next.js, TypeScript, and Tailwind CSS",
        "Implemented server-side rendering for SEO optimization and fast initial load times",
        "Deployed on personal server with automated CI/CD workflows for seamless updates",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-8">Projects</h1>
      <div className="grid gap-8 w-full max-w-6xl md:grid-cols-2">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-3xl shadow-lg p-6 flex flex-col border border-gray-700 hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold text-yellow-300 mb-1">
              {project.title}
            </h2>
            {project.subtitle && (
              <div className="text-md text-gray-400 mb-1">
                {project.subtitle}
              </div>
            )}
            <div className="text-sm text-gray-400 mb-3">{project.date}</div>
            <ul className="list-disc list-inside text-gray-200 space-y-2 pl-2">
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
