'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiServer,
  HiDatabase,
  HiCloud,
  HiCog,
  HiChip,
  HiGlobe,
  HiDeviceMobile,
  HiDesktopComputer,
  HiLockClosed,
  HiMail,
  HiClock,
  HiCode,
  HiPhotograph,
  HiChat,
  HiChartBar,
  HiCollection,
  HiLightningBolt,
  HiDocumentText,
  HiShieldCheck,
  HiTerminal,
} from 'react-icons/hi';
import { IconType } from 'react-icons';

interface ServiceBox {
  name: string;
  icon: IconType;
  details: string[];
  layerColor: string;
  cardColor: string;
}

interface ArchLayer {
  title: string;
  layerColor: string;
  cardColor: string;
  services: ServiceBox[];
}

interface ArchitectureDiagramProps {
  layers: ArchLayer[];
  stats?: string[];
}

function ServiceCard({ service }: { service: ServiceBox }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className={`rounded-xl border p-3 transition-shadow hover:shadow-lg sm:p-4 ${service.cardColor}`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <service.icon className="h-5 w-5 shrink-0" />
        <span className="text-sm font-bold">{service.name}</span>
      </div>
      <ul className="space-y-0.5">
        {service.details.map((d, i) => (
          <li key={i} className="text-xs text-gray-700 dark:text-gray-400">
            {d}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ConnectionArrow() {
  return (
    <div className="flex justify-center py-2">
      <div className="flex flex-col items-center">
        <div className="h-4 w-px bg-gray-300 dark:bg-yellow-300/40" />
        <div className="h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-gray-300 dark:border-t-yellow-300/40" />
      </div>
    </div>
  );
}

export default function ArchitectureDiagram({
  layers,
  stats,
}: ArchitectureDiagramProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-teal-500 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-600 transition-all hover:bg-teal-500/20 dark:border-yellow-300/30 dark:bg-yellow-300/10 dark:text-yellow-300 dark:hover:bg-yellow-300/20"
      >
        <HiCode className="h-4 w-4" />
        {isOpen ? 'Hide' : 'View'} Architecture
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="translate-y-px"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-1 rounded-2xl border border-gray-300 bg-white p-4 backdrop-blur-sm sm:p-6 dark:border-gray-700 dark:bg-gray-900/50">
              {layers.map((layer, idx) => (
                <div key={idx}>
                  {idx > 0 && <ConnectionArrow />}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className={`rounded-xl border p-3 sm:p-4 ${layer.layerColor}`}
                    >
                      <h4 className="mb-3 text-center text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-300">
                        {layer.title}
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        {layer.services.map((service, sIdx) => (
                          <ServiceCard key={sIdx} service={service} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}

              {stats && stats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: layers.length * 0.1 }}
                  className="mt-4 flex flex-wrap justify-center gap-3"
                >
                  {stats.map((stat, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-700 dark:border-yellow-300/20 dark:bg-yellow-300/5 dark:text-yellow-300"
                    >
                      {stat}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Color constants ──────────────────────────────────────────────────────────
// Layer = outer section border/bg, Card = inner service card border/bg/text
// Light mode first, dark: overrides second

const BLUE_LAYER =
  'border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/5';
const BLUE_CARD =
  'border-blue-200 bg-blue-50/80 text-blue-900 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-200';

const PURPLE_LAYER =
  'border-purple-200 bg-purple-50 dark:border-purple-500/30 dark:bg-purple-500/5';
const PURPLE_CARD =
  'border-purple-200 bg-purple-50/80 text-purple-900 dark:border-purple-400/30 dark:bg-purple-400/10 dark:text-purple-200';

const GREEN_LAYER =
  'border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/5';
const GREEN_CARD =
  'border-green-200 bg-green-50/80 text-green-900 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-200';

const ORANGE_LAYER =
  'border-orange-200 bg-orange-50 dark:border-orange-500/30 dark:bg-orange-500/5';
const ORANGE_CARD =
  'border-orange-200 bg-orange-50/80 text-orange-900 dark:border-orange-400/30 dark:bg-orange-400/10 dark:text-orange-200';

const CYAN_LAYER =
  'border-cyan-200 bg-cyan-50 dark:border-cyan-500/30 dark:bg-cyan-500/5';
const CYAN_CARD =
  'border-cyan-200 bg-cyan-50/80 text-cyan-900 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200';

const RED_LAYER =
  'border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/5';
const RED_CARD =
  'border-red-200 bg-red-50/80 text-red-900 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200';

// Helper to build a service with shared layer colors
function svc(
  name: string,
  icon: IconType,
  details: string[],
  layerColor: string,
  cardColor: string
): ServiceBox {
  return { name, icon, details, layerColor, cardColor };
}

// ─── Balancely Architecture Data ──────────────────────────────────────────────

export const balancelyArchitecture: ArchitectureDiagramProps = {
  layers: [
    {
      title: 'Clients',
      layerColor: BLUE_LAYER,
      cardColor: BLUE_CARD,
      services: [
        svc(
          'Browser (React 19)',
          HiDesktopComputer,
          ['Next.js App Router', '20 dashboard pages', 'shadcn/ui'],
          BLUE_LAYER,
          BLUE_CARD
        ),
        svc(
          'iOS App (JWT)',
          HiDeviceMobile,
          ['API authentication', 'Push notifications', 'Native app'],
          BLUE_LAYER,
          BLUE_CARD
        ),
        svc(
          'PWA / Offline',
          HiGlobe,
          ['Dexie.js', 'Offline support', 'Service worker'],
          BLUE_LAYER,
          BLUE_CARD
        ),
      ],
    },
    {
      title: 'Next.js 16 (App Router) — 90+ API Routes',
      layerColor: PURPLE_LAYER,
      cardColor: PURPLE_CARD,
      services: [
        svc(
          'Frontend Layer',
          HiCollection,
          [
            'Auth pages (login, register, reset)',
            'Dashboard, transactions, budgets',
            'Goals, savings, net worth, calendar',
            'Reports, forecast, merchants',
            'Subscriptions, settings, admin',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
        svc(
          'API Layer (90+ routes)',
          HiServer,
          [
            '/api/auth, /api/transactions',
            '/api/budgets, /api/receipts',
            '/api/savings, /api/goals',
            '/api/ai, /api/household',
            '/api/forecast, /api/cron',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
        svc(
          'Shared Libraries',
          HiCode,
          [
            'Auth: JWT, CSRF, passwords',
            'Data: Prisma, cache, Redis',
            'AI: categorize, insights, OCR',
            'Services: email, S3, Firebase',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
      ],
    },
    {
      title: 'Infrastructure',
      layerColor: GREEN_LAYER,
      cardColor: GREEN_CARD,
      services: [
        svc(
          'PostgreSQL',
          HiDatabase,
          ['35 models', 'Prisma ORM', 'Relational data'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Redis',
          HiLightningBolt,
          ['Caching', 'Job queues (BullMQ)', 'Rate limiting'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'S3 (MinIO)',
          HiPhotograph,
          ['Receipt storage', 'Attachments', 'Presigned URLs'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'AI Service (OpenWebUI)',
          HiChip,
          ['Auto-categorize', 'OCR / Vision', 'Spending insights'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Firebase',
          HiCloud,
          ['Push notifications', 'Device management'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Sentry',
          HiShieldCheck,
          ['Error tracking', 'Performance monitoring'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'SMTP Server',
          HiMail,
          ['Email alerts', 'Weekly digests'],
          GREEN_LAYER,
          GREEN_CARD
        ),
      ],
    },
    {
      title: 'Background Processing',
      layerColor: ORANGE_LAYER,
      cardColor: ORANGE_CARD,
      services: [
        svc(
          'BullMQ Workers',
          HiCog,
          ['email.worker.ts', 'budget-alert.worker.ts'],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
        svc(
          'Ofelia Scheduler (Cron)',
          HiClock,
          [
            '06:00 Recurring transactions',
            '07:00 Receipt emails',
            '08:00 Monthly reports',
            '09:00 Bill reminders',
            '18:00 Notification digests',
            '20:00 Anomaly detection',
          ],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
      ],
    },
    {
      title: 'Deployment (Docker Compose)',
      layerColor: CYAN_LAYER,
      cardColor: CYAN_CARD,
      services: [
        svc(
          'balancely (Next.js)',
          HiServer,
          ['Port 3000', 'App container'],
          CYAN_LAYER,
          CYAN_CARD
        ),
        svc(
          'worker (BullMQ)',
          HiCog,
          ['ts-node', 'Background jobs'],
          CYAN_LAYER,
          CYAN_CARD
        ),
        svc(
          'redis (7-alpine)',
          HiLightningBolt,
          ['Cache + queues'],
          CYAN_LAYER,
          CYAN_CARD
        ),
        svc(
          'scheduler (Ofelia)',
          HiClock,
          ['Cron jobs', '10 scheduled tasks'],
          CYAN_LAYER,
          CYAN_CARD
        ),
      ],
    },
  ],
  stats: [
    '35 DB Models',
    '90+ API Routes',
    '20 Dashboard Pages',
    '10 Cron Jobs',
    '4 Docker Services',
    '7 Infrastructure Services',
  ],
};

// ─── Back Up Architecture Data ────────────────────────────────────────────────

export const backupArchitecture: ArchitectureDiagramProps = {
  layers: [
    {
      title: 'Client (React Native + Expo)',
      layerColor: BLUE_LAYER,
      cardColor: BLUE_CARD,
      services: [
        svc(
          'App Routes (Expo Router)',
          HiCollection,
          [
            'Home, Tutorial, Auth',
            'Local: Setup, Game, Results',
            'Online: Lobby, Game, Spectate',
            'Replay, Leaderboard, Profile',
          ],
          BLUE_LAYER,
          BLUE_CARD
        ),
        svc(
          'UI Components',
          HiDeviceMobile,
          [
            'BoardView, AnimatedPiece, ZoomableBoard',
            'CardView, HandView, HandoffScreen',
            'TurnIndicator, EmojiReaction',
            'ReplayViewer, EloChart',
          ],
          BLUE_LAYER,
          BLUE_CARD
        ),
        svc(
          'Hooks & Services',
          HiCog,
          [
            'useOnlineGame (Socket.IO sync)',
            'useBotTurns, useGameAnimations',
            'useSpectate, useAsyncGame',
            'Sound, haptics, push notifications',
          ],
          BLUE_LAYER,
          BLUE_CARD
        ),
      ],
    },
    {
      title: 'Game Engine (Pure TypeScript)',
      layerColor: PURPLE_LAYER,
      cardColor: PURPLE_CARD,
      services: [
        svc(
          'Core Engine',
          HiChip,
          [
            'Immutable state: GameState in → new GameState out',
            'Board config, deck, shuffle, deal',
            'Game init, round dealing, turn advancement',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
        svc(
          'Movement & Rules',
          HiCode,
          [
            'Legal move generation for all card types',
            'Forward/backward destination calc',
            'Knock-outs, swaps, execute-move',
            'Win condition & team detection',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
        svc(
          'Bot AI',
          HiLightningBolt,
          [
            'Move scoring heuristics',
            'Exit home priority, safe zone logic',
            'Ace conservation strategy',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
      ],
    },
    {
      title: 'Server (Node.js + Express + Socket.IO)',
      layerColor: GREEN_LAYER,
      cardColor: GREEN_CARD,
      services: [
        svc(
          'Auth',
          HiLockClosed,
          [
            'JWT access/refresh tokens',
            'Bcrypt password hashing',
            'HTTP & Socket.IO middleware',
          ],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Game Rooms',
          HiServer,
          [
            'Socket.IO room management',
            'Server-side move validation',
            'GameState storage & sync',
            'Turn timer with auto-drop',
          ],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Online Features',
          HiGlobe,
          [
            'Matchmaking & lobby',
            'ELO rating system',
            'Spectator mode, replays',
            'Async (correspondence) games',
          ],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Social & Safety',
          HiShieldCheck,
          [
            'Friends system',
            'Push notifications (Expo)',
            'Socket rate limiting',
            'Game history & stats',
          ],
          GREEN_LAYER,
          GREEN_CARD
        ),
      ],
    },
    {
      title: 'Data & Infrastructure',
      layerColor: ORANGE_LAYER,
      cardColor: ORANGE_CARD,
      services: [
        svc(
          'PostgreSQL',
          HiDatabase,
          ['Users, games, history', 'ELO ratings & stats', '5 SQL migrations'],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
        svc(
          'Redis',
          HiClock,
          ['Session storage', 'Ephemeral game state', 'Async game timers'],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
      ],
    },
  ],
  stats: [
    '2/4/6 Players',
    'Real-Time Multiplayer',
    'Async Turn-Based',
    'Pure TS Engine',
    '271 Jest Tests',
    'Bot AI with Heuristics',
  ],
};

// ─── Tyler-Grant.com Architecture Data ────────────────────────────────────────

export const portfolioArchitecture: ArchitectureDiagramProps = {
  layers: [
    {
      title: 'Frontend (Next.js 16 App Router)',
      layerColor: BLUE_LAYER,
      cardColor: BLUE_CARD,
      services: [
        svc(
          'React 19 + TypeScript',
          HiDesktopComputer,
          [
            'Tailwind CSS 4 styling',
            'Framer Motion animations',
            'Dark / Light theme',
            'PWA support',
          ],
          BLUE_LAYER,
          BLUE_CARD
        ),
        svc(
          'Pages',
          HiCollection,
          [
            'Home, About, Projects',
            'Contact, Hobbies, Demos',
            'Login, Register, Admin',
            'Receipt Parser demo',
          ],
          BLUE_LAYER,
          BLUE_CARD
        ),
        svc(
          'Interactive Features',
          HiChat,
          [
            'AI Chat assistant',
            'Drag-and-drop reordering',
            'Image cropping & lightbox',
            'Before/After comparisons',
          ],
          BLUE_LAYER,
          BLUE_CARD
        ),
      ],
    },
    {
      title: 'API Layer (31 Routes)',
      layerColor: PURPLE_LAYER,
      cardColor: PURPLE_CARD,
      services: [
        svc(
          'Auth & Users',
          HiLockClosed,
          [
            'NextAuth.js (JWT)',
            'Registration & login',
            'Role-based access (admin/user)',
            'Profile management',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
        svc(
          'Content Management',
          HiDocumentText,
          [
            'Projects CRUD',
            'Comments & lessons',
            'Time tracking & materials',
            'Receipt parsing',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
        svc(
          'Communication',
          HiMail,
          [
            'Contact form + email alerts',
            'AI chat (streaming)',
            'Chat session management',
            'Unread notifications',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
        svc(
          'Analytics & Media',
          HiChartBar,
          [
            'Page view tracking',
            'Event deduplication',
            'S3 file uploads',
            'HEIC auto-conversion',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
      ],
    },
    {
      title: 'Infrastructure',
      layerColor: GREEN_LAYER,
      cardColor: GREEN_CARD,
      services: [
        svc(
          'PostgreSQL + Prisma',
          HiDatabase,
          [
            '14 models',
            'Users, projects, analytics',
            'Chat sessions, contacts',
          ],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'OpenWebUI (Self-Hosted AI)',
          HiChip,
          [
            'Qwen 2.5 14B (chat)',
            'Llama 3.2 Vision (OCR)',
            'Streaming responses',
          ],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Garage (S3 Storage)',
          HiPhotograph,
          [
            'Self-hosted object storage',
            'CDN via Cloudflare tunnel',
            'Images, videos, PDFs',
          ],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'SMTP (Nodemailer)',
          HiMail,
          ['Contact notifications', 'Admin alerts'],
          GREEN_LAYER,
          GREEN_CARD
        ),
      ],
    },
    {
      title: 'Security & Rate Limiting',
      layerColor: RED_LAYER,
      cardColor: RED_CARD,
      services: [
        svc(
          'Authentication',
          HiLockClosed,
          ['bcrypt password hashing', 'JWT sessions', 'RBAC (admin/user)'],
          RED_LAYER,
          RED_CARD
        ),
        svc(
          'Rate Limiting',
          HiShieldCheck,
          [
            'Contact: 5 req/min',
            'Chat: 30 req/min',
            '429 + Retry-After headers',
          ],
          RED_LAYER,
          RED_CARD
        ),
      ],
    },
    {
      title: 'Deployment',
      layerColor: CYAN_LAYER,
      cardColor: CYAN_CARD,
      services: [
        svc(
          'GitHub Actions CI/CD',
          HiTerminal,
          [
            'Push-to-main trigger',
            'Build in staging directory',
            'Prisma generate + migrate',
          ],
          CYAN_LAYER,
          CYAN_CARD
        ),
        svc(
          'PM2 Process Manager',
          HiServer,
          ['Port 3000', 'Auto-restart on crash', 'Rsync deployment'],
          CYAN_LAYER,
          CYAN_CARD
        ),
      ],
    },
  ],
  stats: [
    '14 DB Models',
    '31 API Routes',
    '2 AI Models',
    'Self-Hosted Infrastructure',
    'GitHub Actions CI/CD',
  ],
};
