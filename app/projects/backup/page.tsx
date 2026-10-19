'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineBadgeCheck,
  HiOutlineBell,
  HiOutlineChip,
  HiOutlineDeviceMobile,
  HiOutlineEye,
  HiOutlineLockClosed,
  HiOutlinePuzzle,
  HiOutlineRefresh,
  HiOutlineServer,
  HiOutlineSparkles,
  HiOutlineStatusOnline,
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import PageTransition from '@/app/components/PageTransition';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import ScreenshotGallery from '@/app/components/ScreenshotGallery';
import CTAFooter from '@/app/components/CTAFooter';
import LazyArchitectureDiagram from '@/app/components/LazyArchitectureDiagram';
import { backupArchitecture } from '@/app/components/architectureDiagramData';
import { containerVariants, itemVariants } from '@/app/lib/animations';
import { backupClips, backupScreenshots } from './screenshots';

const features = [
  {
    icon: HiOutlineUserGroup,
    title: '2 to 6 players, with teams',
    body: 'Partners sit across from each other in 4- and 6-player games. With 3 or 5 players, the game starts free-for-all and switches to teams once the first player finishes.',
  },
  {
    icon: HiOutlineDeviceMobile,
    title: 'Pass-and-play with bots',
    body: 'Play on one phone with a handoff screen between players, and fill any seat with an Easy, Medium or Hard bot.',
  },
  {
    icon: HiOutlineStatusOnline,
    title: 'Live online matches',
    body: 'Lobbies with join codes, a 45-second turn timer and pause by vote. If someone drops and doesn’t reconnect within 30 seconds, a bot takes their seat.',
  },
  {
    icon: HiOutlineBell,
    title: 'Async games',
    body: '24-hour turns with push notifications, and a catch-up replay of the moves made while you were away.',
  },
  {
    icon: HiOutlineAcademicCap,
    title: 'Interactive tutorial',
    body: 'Ten steps played on real game states, from leaving home to the Back Up rule and jack swaps.',
  },
  {
    icon: HiOutlineEye,
    title: 'Spectating and replays',
    body: 'Ask to watch a friend’s game, and step through any finished game move by move.',
  },
  {
    icon: HiOutlineTrendingUp,
    title: 'Ratings and friends',
    body: 'ELO ratings, a leaderboard, ranked stats and a head-to-head record against each friend.',
  },
  {
    icon: HiOutlineSparkles,
    title: 'Match highlights',
    body: 'Every game ends with highlights like Executioner for the most knockouts and Globetrotter for the most spaces traveled.',
  },
];

const stack = [
  {
    icon: HiOutlineDeviceMobile,
    title: 'App',
    bullets: [
      'React Native 0.81 and Expo SDK 54 with Expo Router',
      'Board drawn in SVG, with Reanimated piece movement and pinch-to-zoom',
      'Engine events feed an animation queue that drives piece moves, sounds and haptics',
      'Light, dark and system themes, plus board skins',
    ],
  },
  {
    icon: HiOutlineChip,
    title: 'Game engine',
    bullets: [
      'Plain TypeScript with no UI code: each move takes a game state and returns a new one plus a list of events',
      'Generates every legal move per card, falling back to a partner’s pieces and then to dropping the hand',
      'The server compiles the same engine, so the phone and the server play by one set of rules',
    ],
  },
  {
    icon: HiOutlinePuzzle,
    title: 'Bots',
    bullets: [
      'Easy plays a random legal move; Medium scores moves with hand-tuned rules',
      'Hard plans out the rest of its hand within a 30 ms budget, weighing knockout risk from the cards it hasn’t seen',
      'Bots see only their own hand, the same view a human player gets',
      'A bot-vs-bot tournament harness measures each new Hard bot against the last',
    ],
  },
  {
    icon: HiOutlineServer,
    title: 'Game server',
    bullets: [
      'Express 5 and Socket.IO 4 with the Redis adapter',
      'Checks every move against the engine’s legal moves before applying it, and sends each player only their own hand',
      'Redis holds live game state, per-game locks, turn deadlines and rate limits',
      'PostgreSQL through plain SQL with 24 versioned migrations',
      'JWT access and refresh tokens, ELO ratings and Expo push notifications',
    ],
  },
  {
    icon: HiOutlineRefresh,
    title: 'Reliability',
    bullets: [
      'Move numbers and idempotency keys, so a retried move is applied once',
      'Reconnects with backoff and a fresh token, then sends any moves queued while offline',
      'A per-game Redis lock that only its owner can release',
    ],
  },
  {
    icon: HiOutlineBadgeCheck,
    title: 'Testing and delivery',
    bullets: [
      '700+ Jest tests across the engine, bots, server and UI, plus Maestro end-to-end flows',
      'CI type-checks, lints and tests the app and the server on every pull request',
      'The server deploys from a self-hosted GitHub Actions runner with PM2 and a health check',
      'iOS builds ship to TestFlight',
    ],
  },
];

const tech = [
  'React Native',
  'Expo',
  'TypeScript',
  'Reanimated',
  'Node.js',
  'Express',
  'Socket.IO',
  'PostgreSQL',
  'Redis',
  'Jest',
  'Maestro',
  'GitHub Actions',
  'Sentry',
];

const cardClass =
  'rounded-3xl border border-gray-300 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg';

export default function BackupPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center overflow-x-clip px-4 py-12 md:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-6xl"
        >
          <Breadcrumbs
            items={[
              { label: 'Projects', href: '/projects' },
              { label: 'Back Up' },
            ]}
          />

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl dark:text-gray-200">
              Back Up
            </h1>
            <div className="text-md mb-1 text-gray-700 dark:text-gray-400">
              Multiplayer Card-Driven Board Game for iOS
            </div>
            <div className="mb-4 text-sm text-gray-700 dark:text-gray-400">
              February 2026 – Present
            </div>
            <div className="bg-accent mb-6 h-1 w-full max-w-xs rounded-full md:max-w-sm" />
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300">
                <HiOutlineUserGroup />
                Personal project
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-400">
                <HiOutlineLockClosed />
                Private repo
              </span>
            </div>
            <div className="max-w-3xl space-y-4 text-lg text-gray-900 dark:text-gray-200">
              <p>
                Back Up is a board game for 2 to 6 players that I designed and
                built end to end: a React Native iOS app and a Node.js game
                server. Cards decide how your pieces move, partners play as a
                team, and you can play on one phone, against bots, or online in
                real time or one turn a day.
              </p>
              <p>
                The same rules engine runs on the phone and on the server, so
                local games, bots and online matches all play by one set of
                rules.
              </p>
            </div>
          </motion.div>

          {/* Screenshots */}
          <motion.section
            variants={itemVariants}
            className={`${cardClass} mb-8`}
            aria-labelledby="screens-heading"
          >
            <h2
              id="screens-heading"
              className="text-accent mb-1 text-2xl font-semibold"
            >
              Screens
            </h2>
            <p className="mb-4 text-sm text-gray-700 dark:text-gray-400">
              Bots fill the other seats in these matches.
            </p>
            <ScreenshotGallery
              screenshots={backupScreenshots}
              basePath="/backup"
              label="Back Up app screenshots"
            />
          </motion.section>

          {/* How it plays */}
          <motion.section
            variants={itemVariants}
            className={`${cardClass} mb-8`}
            aria-labelledby="rules-heading"
          >
            <h2
              id="rules-heading"
              className="text-accent mb-1 text-2xl font-semibold"
            >
              How it plays
            </h2>
            <p className="mb-6 text-sm text-gray-700 dark:text-gray-400">
              Each turn you play one card to move one piece around the board and
              into your safe zone. Recorded in the app:
            </p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {backupClips.map((clip) => (
                <figure key={clip.file}>
                  <div className="overflow-hidden rounded-[1.5rem] border-[6px] border-gray-900 bg-gray-900 shadow-lg dark:border-gray-700">
                    <picture>
                      <source
                        media="(prefers-reduced-motion: reduce)"
                        srcSet={`/backup/clips/${clip.file}-still.webp`}
                      />
                      <img
                        src={`/backup/clips/${clip.file}.webp`}
                        alt={clip.alt}
                        width={400}
                        height={813}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full"
                      />
                    </picture>
                  </div>
                  <figcaption className="mt-3 px-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      {clip.title}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                      {clip.caption}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </motion.section>

          {/* What it does */}
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-accent mb-4 text-2xl font-semibold">
              What it does
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className={cardClass}>
                  <feature.icon className="mb-3 h-7 w-7 text-purple-500 dark:text-purple-400" />
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* How it's built */}
          <motion.section variants={itemVariants}>
            <h2 className="text-accent mb-4 text-2xl font-semibold">
              How it’s built
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {stack.map((part) => (
                <div key={part.title} className={cardClass}>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-200">
                    <part.icon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                    {part.title}
                  </h3>
                  <ul className="list-outside list-disc space-y-2 pl-5 text-gray-900 dark:text-gray-200">
                    {part.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-400"
                >
                  {t}
                </span>
              ))}
            </div>
            <LazyArchitectureDiagram
              {...backupArchitecture}
              title="Back Up Architecture"
            />
          </motion.section>

          <CTAFooter />
        </motion.div>
      </div>
    </PageTransition>
  );
}
