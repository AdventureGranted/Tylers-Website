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
  HiLibrary,
  HiRefresh,
  HiBell,
  HiSparkles,
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
  title?: string;
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
      title: 'Apple Clients',
      layerColor: BLUE_LAYER,
      cardColor: BLUE_CARD,
      services: [
        svc(
          'iOS App (SwiftUI)',
          HiDeviceMobile,
          [
            'iOS 18+, MVVM with @Observable',
            'async/await networking',
            'CoreData offline queue with replay',
            'Apple Card via FinanceKit',
          ],
          BLUE_LAYER,
          BLUE_CARD
        ),
        svc(
          'watchOS App & Widgets',
          HiClock,
          [
            'watchOS companion app',
            'WidgetKit home-screen widgets',
            'Share data with the app via an App Group',
          ],
          BLUE_LAYER,
          BLUE_CARD
        ),
      ],
    },
    {
      title: 'Next.js 16 REST API',
      layerColor: PURPLE_LAYER,
      cardColor: PURPLE_CARD,
      services: [
        svc(
          'Route Handlers',
          HiServer,
          ['REST API for the apps', 'Prisma ORM', 'Shared households'],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
        svc(
          'API Contract',
          HiDocumentText,
          [
            'No generated client',
            'Route tests record JSON fixtures',
            'iOS tests decode them with app models',
            'Parity check: iOS endpoints vs routes',
          ],
          PURPLE_LAYER,
          PURPLE_CARD
        ),
      ],
    },
    {
      title: 'Background Workers (BullMQ)',
      layerColor: ORANGE_LAYER,
      cardColor: ORANGE_CARD,
      services: [
        svc(
          'Bank Sync',
          HiRefresh,
          ['SimpleFIN and Plaid feeds', 'New transactions land as drafts'],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
        svc(
          'Budget Alerts',
          HiBell,
          ['Pace-based budget alerts'],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
        svc(
          'AI Jobs',
          HiSparkles,
          ['Run on the self-hosted LLM'],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
        svc(
          'Merchant-Logo Learning',
          HiPhotograph,
          ['Logos in the transaction feed'],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
      ],
    },
    {
      title: 'Data & Services',
      layerColor: GREEN_LAYER,
      cardColor: GREEN_CARD,
      services: [
        svc(
          'PostgreSQL',
          HiDatabase,
          ['Primary data store', 'Prisma ORM'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Redis',
          HiLightningBolt,
          ['BullMQ job queues'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Self-Hosted LLM',
          HiChip,
          ['Transaction categorization', 'Budget audits', 'Receipt parsing'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Bank Feeds',
          HiLibrary,
          ['SimpleFIN', 'Plaid'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Firebase',
          HiCloud,
          ['Push notifications'],
          GREEN_LAYER,
          GREEN_CARD
        ),
        svc(
          'Sentry',
          HiShieldCheck,
          ['Error tracking'],
          GREEN_LAYER,
          GREEN_CARD
        ),
      ],
    },
    {
      title: 'Deployment',
      layerColor: CYAN_LAYER,
      cardColor: CYAN_CARD,
      services: [
        svc(
          'GitHub Actions',
          HiTerminal,
          ['Deploy pipeline', 'Self-hosted server'],
          CYAN_LAYER,
          CYAN_CARD
        ),
      ],
    },
  ],
  stats: [
    'iOS, watchOS & Widgets',
    'Offline Queue with Replay',
    'Contract-Tested API',
    'Self-Hosted Backend & LLM',
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
            'Easy: random legal move',
            'Medium: heuristic move scoring',
            'Hard: plans the rest of its hand (30 ms budget)',
            'Sees only its own hand, like a human',
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
            'Lobbies with join codes',
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
          [
            'Users, games, move log',
            'ELO history, friends',
            '24 SQL migrations',
          ],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
        svc(
          'Redis',
          HiClock,
          [
            'Live game state & per-game locks',
            'Turn deadlines, rooms, spectators',
            'Rate limits, Socket.IO adapter',
          ],
          ORANGE_LAYER,
          ORANGE_CARD
        ),
      ],
    },
  ],
  stats: [
    '2 to 6 Players',
    'Real-Time Multiplayer',
    'Async Turn-Based',
    'Pure TS Engine',
    '700+ Jest Tests',
    'Easy / Medium / Hard Bots',
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
            'Contact, Hobbies',
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
