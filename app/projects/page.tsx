'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BsGithub } from 'react-icons/bs';
import {
  HiArrowRight,
  HiOutlineFolder,
  HiOutlineLockClosed,
} from 'react-icons/hi';
import PageTransition from '@/app/components/PageTransition';
import CTAFooter from '@/app/components/CTAFooter';
import { containerVariants, itemVariants } from '@/app/lib/animations';
import LazyArchitectureDiagram from '@/app/components/LazyArchitectureDiagram';
import ThemedScreenshot from '@/app/components/ThemedScreenshot';
import type { ArchitectureDiagramProps } from '@/app/components/ArchitectureDiagram';
import { balancelyScreenshots } from '@/app/projects/balancely/screenshots';
import {
  balancelyArchitecture,
  backupArchitecture,
  portfolioArchitecture,
} from '@/app/components/architectureDiagramData';

// Pre-generated blur data URLs for project images
const blurDataURLs: Record<string, string> = {
  '/tyler-grant-site.webp':
    'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAGAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMG/8QAHRAAAgIBBQAAAAAAAAAAAAAAAQIAITEDERITkf/EABQBAQAAAAAAAAAAAAAAAAAAAAL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDLllKjbTCniMGsZkepjdexEYv/2Q==',
  '/selfhosting.png':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAQMEAgMBAAAAAAAAAAAAAQIDBAUGAAcRIRITMUH/xAAVAQEBAAAAAAAAAAAAAAAAAAAEBf/EABwRAAICAgMAAAAAAAAAAAAAAAECAAMEERIhMf/aAAwDAQACEQMRAD8AzO2tv1K4bUpFS9bKYsSQyl9uMhwrUEqAIJUQACeeeOc5xjFLJrVAT2eO37//2Q==',
  '/boxie.png':
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAcI/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQIDBAUGEQAHEiEIE0Fx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESITH/2gAMAwEAAhEDEEA/ANS7b2JAsmyaZbcN556PBbKfcv8AKlqJJUo8QByST116x1pdWk1t+p//2Q==',
  '/backup.png':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAARklEQVQYV2NkYPj/n4EIwMjIxPCfgRhFjIxMDAQVMTIyMRBUxMjIxEBQESMjEwNBRYyMTAwEFTEyMjEQVMTIyMRAUBEAZk0FC1VB1B0AAAAASUVORK5CYII=',
};

interface Project {
  title: string;
  subtitle: string | null;
  repo: string | null;
  privateRepo: boolean;
  demo: string | null;
  caseStudy: string | null;
  diagram: (ArchitectureDiagramProps & { title: string }) | null;
  date: string;
  bullets: string[];
}

interface GridProject extends Project {
  image: string;
}

// Screens shown on the featured Balancely card, middle one in front
const featuredScreens = [
  '02b-bank-review-card',
  '01-home',
  '03b-budgets-list',
].map((file) => balancelyScreenshots.find((shot) => shot.file === file)!);

function ProjectDetails({ project }: { project: Project }) {
  return (
    <>
      <h2 className="text-accent mb-1 text-2xl font-semibold">
        {project.title}
      </h2>
      {project.subtitle && (
        <div className="text-md mb-1 text-gray-700 dark:text-gray-400">
          {project.subtitle}
        </div>
      )}
      <div className="mb-3 text-sm text-gray-700 dark:text-gray-400">
        {project.date}
      </div>
      {(project.repo ||
        project.privateRepo ||
        project.demo ||
        project.caseStudy) && (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {project.caseStudy && (
            <Link
              href={project.caseStudy}
              className="group/cs bg-accent-fill hover:bg-accent-fill-hover inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 transition-colors"
            >
              Screenshots &amp; Details
              <HiArrowRight className="transition-transform group-hover/cs:translate-x-0.5" />
            </Link>
          )}
          {project.repo && (
            <Link
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:border-accent inline-flex w-fit items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <BsGithub />
              View Code
            </Link>
          )}
          {project.privateRepo && (
            <span className="inline-flex w-fit items-center gap-1.5 text-sm text-gray-700 dark:text-gray-400">
              <HiOutlineLockClosed />
              Private repo
            </span>
          )}
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent-fill hover:bg-accent-fill-hover inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 transition-colors"
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
        </div>
      )}
      <ul className="list-outside list-disc space-y-2 pl-5 text-gray-900 dark:text-gray-200">
        {project.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      {/* Pinned to the bottom so it lines up across cards in a row */}
      {project.diagram && (
        <div className="mt-auto">
          <LazyArchitectureDiagram {...project.diagram} />
        </div>
      )}
    </>
  );
}

export default function ProjectsPage() {
  const featuredProject: Project = {
    title: 'Balancely',
    subtitle: 'iOS Personal Finance App',
    repo: null,
    privateRepo: true,
    demo: null,
    caseStudy: '/projects/balancely',
    diagram: { ...balancelyArchitecture, title: 'Balancely Architecture' },
    date: 'January 2026 – Present',
    bullets: [
      'Born from a passion for personal finance developed over nearly 4 years in consumer lending at EnerBank USA',
      'Designed and built end to end as a personal project my household uses daily: a native SwiftUI iOS app with a watchOS companion and home-screen widgets',
      'Pulls in transactions automatically through SimpleFIN and Plaid bank feeds and Apple Card via FinanceKit, then queues them in a swipe-to-review deck with suggested categories and confidence levels',
      'Tracks budget pace, account-backed savings goals, and subscriptions, and flags unusual spending with adaptive per-category anomaly detection',
      'Backed by a self-hosted Next.js 16 REST API with Prisma, PostgreSQL, and BullMQ/Redis background workers, deployed through GitHub Actions',
      'Keeps iOS and backend in sync without a generated client: backend tests record real JSON responses as contract fixtures that the iOS test suite decodes',
      'Uses a self-hosted LLM for transaction categorization, budget audits, and receipt parsing',
    ],
  };

  const projects: GridProject[] = [
    {
      title: 'Back Up – Card Board Game',
      subtitle: 'Multiplayer Mobile Game',
      repo: null,
      privateRepo: true,
      demo: null,
      caseStudy: null,
      diagram: { ...backupArchitecture, title: 'Back Up Architecture' },
      date: 'January 2026 – Present',
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
      repo: 'https://github.com/AdventureGranted/Tylers-Website',
      privateRepo: false,
      demo: 'https://tyler-grant.com/demo/receipt-parser',
      caseStudy: null,
      diagram: {
        ...portfolioArchitecture,
        title: 'Tyler-Grant.com Architecture',
      },
      date: 'June 2025 – Present',
      image: '/tyler-grant-site.webp',
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
      repo: null,
      privateRepo: false,
      demo: null,
      caseStudy: null,
      diagram: null,
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
      repo: null,
      privateRepo: false,
      demo: null,
      caseStudy: null,
      diagram: null,
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
      <div className="flex min-h-screen flex-col items-center overflow-x-clip px-4 py-12 md:py-20">
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
            <div className="relative">
              <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-900 md:mb-6 md:text-5xl dark:text-gray-200">
                <HiOutlineFolder className="h-9 w-9 text-purple-500 md:h-11 md:w-11 dark:text-purple-400" />
                Projects
              </h1>
              <div className="bg-accent mx-auto mb-6 h-1 w-full max-w-xs rounded-full md:max-w-sm" />
              <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-400">
                Apps and infrastructure I&apos;ve built outside my day job:
                native iOS and mobile apps, full-stack web, and self-hosted
                systems.
              </p>
            </div>
          </motion.div>

          {/* Featured project */}
          <motion.div
            variants={itemVariants}
            className="group hover:border-accent/50 mb-8 grid gap-6 rounded-3xl border border-gray-300 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:grid-cols-2 md:gap-8 md:p-8 dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
          >
            {/* Duplicates the "Screenshots & Details" button, so it's skipped
                by keyboard and screen readers */}
            <Link
              href={featuredProject.caseStudy!}
              tabIndex={-1}
              aria-hidden="true"
              className="bg-accent/10 flex items-center justify-center overflow-hidden rounded-2xl border border-gray-300 px-[4%] py-8 md:order-last dark:border-gray-700"
            >
              {featuredScreens.map((shot, i) => (
                <div
                  key={shot.file}
                  className={`overflow-hidden rounded-[1.25rem] border-4 border-gray-900 bg-gray-900 shadow-xl transition-transform duration-300 md:rounded-[1.75rem] md:border-[6px] dark:border-gray-700 ${
                    i === 1
                      ? 'z-10 -mx-[7%] w-[40%] group-hover:-translate-y-1'
                      : 'w-[33%] translate-y-6 opacity-90'
                  }`}
                >
                  <ThemedScreenshot
                    basePath="/balancely"
                    file={shot.file}
                    alt={shot.alt}
                    sizes="(min-width: 768px) 240px, 40vw"
                  />
                </div>
              ))}
            </Link>
            <div className="flex flex-col">
              <ProjectDetails project={featuredProject} />
            </div>
          </motion.div>

          <div className="grid w-full gap-8 md:grid-cols-2">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group hover:border-accent/50 flex flex-col rounded-3xl border border-gray-300 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
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
                    placeholder="blur"
                    blurDataURL={blurDataURLs[project.image]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <ProjectDetails project={project} />
              </motion.div>
            ))}
          </div>

          <CTAFooter />
        </motion.div>
      </div>
    </PageTransition>
  );
}
