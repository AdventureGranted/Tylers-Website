'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineFolder } from 'react-icons/hi';
import PageTransition from '@/app/components/PageTransition';
import { containerVariants, itemVariants } from '@/app/lib/animations';
import ArchitectureDiagram, {
  balancelyArchitecture,
  backupArchitecture,
  portfolioArchitecture,
} from '@/app/components/ArchitectureDiagram';

// Pre-generated blur data URLs for project images
const blurDataURLs: Record<string, string> = {
  '/family.jpeg':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAQMEAgMBAAAAAAAAAAAAAQIDBAAFBhEhEjEHQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABwRAAICAgMAAAAAAAAAAAAAAAECAAMEERIhQf/aAAwDAQACEQMRAD8Ax3CseuWRY1CuV3bZS0+yh9HiCQvSgDRIPBII/ta9SlRZGTUxd+xnR5z/2Q==',
  '/selfhosting.png':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAQMEAgMBAAAAAAAAAAAAAQIDBAUGAAcRIRITMUH/xAAVAQEBAAAAAAAAAAAAAAAAAAAEBf/EABwRAAICAgMAAAAAAAAAAAAAAAECAAMEERIhMf/aAAwDAQACEQMRAD8AzO2tv1K4bUpFS9bKYsSQyl9uMhwrUEqAIJUQACeeeOc5xjFLJrVAT2eO37//2Q==',
  '/boxie.png':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAcI/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQIDBAUGEQAHEiEIE0Fx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESITH/2gAMAwEAAhEDEEA/ANS7b2JAsmyaZbcN556PBbKfcv8AKlqJJUo8QByST116x1pdWk1t+p//2Q==',
  '/balancely.png':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAOklEQVQYV2PU+M/wn4EIwMjAxPCfgRhFDMRoYmBiIKyIkYGJgaAiRgYmBoKKGBmYGAgqYmRgYgAAe4oFC/sMFDkAAAAASUVORK5CYII=',
  '/backup.png':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAARklEQVQYV2NkYPj/n4EIwMjIxPCfgRhFjIxMDAQVMTIyMRBUxMjIxEBQESMjEwNBRYyMTAwEFTEyMjEQVMTIyMRAUBEAZk0FC1VB1B0AAAAASUVORK5CYII=',
};

export default function ProjectsPage() {
  const projects = [
    {
      title: 'Balancely',
      subtitle: 'Personal Finance Management App',
      link: 'https://github.com/AdventureGranted/balancely-web',
      demo: 'https://budget.adventuregranted.com',
      date: '2025 – Present',
      image: '/balancely.png',
      bullets: [
        'Built a comprehensive budgeting app with Next.js, React 19, TypeScript, Tailwind CSS, and shadcn/ui',
        'Tracks transactions, budgets, savings goals, net worth, and recurring expenses with real-time alerts',
        'Integrated AI-powered receipt scanning and email receipt import for automatic transaction entry',
        'Supports multi-user households with role-based access, activity logs, and spending limits',
        'Features dashboard with spending insights, merchant analytics, forecasting, and annual reports using Recharts',
        'PostgreSQL database with Prisma ORM, NextAuth.js v5 authentication, and S3-compatible file storage',
      ],
    },
    {
      title: 'Back Up – Card Board Game',
      subtitle: 'Multiplayer Mobile Game',
      link: 'https://github.com/AdventureGranted/backup',
      demo: null,
      date: '2025 – Present',
      image: '/backup.png',
      bullets: [
        'Developed a card-driven board game for 2, 4, or 6 players using React Native, Expo, and TypeScript',
        'Built real-time multiplayer with Socket.IO and async turn-based mode with push notifications',
        'Implemented pure TypeScript game engine with immutable state, legal move validation, and bot AI with difficulty levels',
        'Created Node.js backend with Express, PostgreSQL, Redis, JWT auth, and ELO rating system',
        'Features spectator mode, replay viewer, friends system, animated pieces, sound effects, and haptic feedback',
        'Comprehensive test suite with 271 Jest tests covering game engine and server logic',
      ],
    },
    {
      title: 'Tyler-Grant.com',
      subtitle: 'Full-Stack Portfolio & Authentication System',
      link: 'https://github.com/AdventureGranted/Tylers-Website',
      demo: 'http://tyler-grant.com/demo/receipt-parser',
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
      demo: null,
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
      demo: null,
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
      <main className="flex min-h-screen flex-col items-center px-4 py-12 md:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-6xl"
        >
          {/* Hero Section */}
          <motion.div
            variants={itemVariants}
            className="relative mb-10 text-center md:mb-14"
          >
            {/* Blurred gradient orbs */}
            <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-96 -translate-x-1/2 rounded-full bg-purple-500/15 blur-[100px]" />
            <div className="pointer-events-none absolute -top-20 right-1/3 h-56 w-80 translate-x-1/2 rounded-full bg-yellow-300/15 blur-[100px]" />

            <div className="relative">
              <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl dark:text-gray-200">
                <HiOutlineFolder className="h-9 w-9 text-purple-500 md:h-11 md:w-11 dark:text-purple-400" />
                Projects
              </h1>
              <div className="mx-auto mb-6 h-1 w-full max-w-xs rounded-full bg-gradient-to-r from-purple-500 to-yellow-300 md:max-w-sm" />
            </div>
          </motion.div>

          <div className="grid w-full gap-8 md:grid-cols-2">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group flex flex-col rounded-3xl border border-gray-300 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/50 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg dark:hover:border-yellow-300/50"
              >
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-2xl border border-gray-300 bg-gray-700 dark:border-gray-700">
                  <Image
                    src={project.image}
                    alt={project.title + ' image'}
                    fill
                    className={`${
                      project.image === '/boxie.png'
                        ? 'object-center'
                        : 'object-cover'
                    } transition-transform duration-300 group-hover:scale-105`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx === 0}
                    placeholder="blur"
                    blurDataURL={blurDataURLs[project.image]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <h2 className="mb-1 text-2xl font-semibold text-yellow-300">
                  {project.title}
                </h2>
                {project.subtitle && (
                  <div className="text-md mb-1 text-gray-700 dark:text-gray-400">
                    {project.subtitle}
                  </div>
                )}
                {project.link && (
                  <Link
                    href={project.link}
                    className="text-md mb-1 text-gray-700 dark:text-gray-400"
                  >
                    {project.link}
                  </Link>
                )}
                <div className="mb-3 text-sm text-gray-700 dark:text-gray-400">
                  {project.date}
                </div>
                {project.demo && (
                  <Link
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-3 inline-flex w-fit items-center gap-2 rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
                  >
                    Live Demo
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </Link>
                )}
                <ul className="list-inside list-disc space-y-2 pl-2 text-gray-900 dark:text-gray-200">
                  {project.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                {project.title === 'Balancely' && (
                  <ArchitectureDiagram {...balancelyArchitecture} />
                )}
                {project.title === 'Back Up – Card Board Game' && (
                  <ArchitectureDiagram {...backupArchitecture} />
                )}
                {project.title === 'Tyler-Grant.com' && (
                  <ArchitectureDiagram {...portfolioArchitecture} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
