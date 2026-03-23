import { IconType } from 'react-icons';
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

export interface ServiceBox {
  name: string;
  icon: IconType;
  details: string[];
  layerColor: string;
  cardColor: string;
}

export interface ArchLayer {
  title: string;
  layerColor: string;
  cardColor: string;
  services: ServiceBox[];
}

export interface ArchitectureDiagramProps {
  layers: ArchLayer[];
  stats?: string[];
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
