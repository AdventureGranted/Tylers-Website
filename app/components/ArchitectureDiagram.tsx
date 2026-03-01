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

// Colors use CSS custom properties so they adapt to .dark / .light theme classes.
// Each "palette" defines border, bg, and text as inline style objects.
type Palette = {
  layer: React.CSSProperties;
  card: React.CSSProperties;
};

const palettes = {
  blue: {
    layer: {
      borderColor: 'color-mix(in srgb, var(--accent-primary) 25%, #3b82f6 75%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 90%, #3b82f6 10%)',
    },
    card: {
      borderColor: 'color-mix(in srgb, var(--card-border) 50%, #3b82f6 50%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 85%, #3b82f6 15%)',
      color: 'var(--text-primary)',
    },
  },
  purple: {
    layer: {
      borderColor: 'color-mix(in srgb, var(--accent-primary) 25%, #8b5cf6 75%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 90%, #8b5cf6 10%)',
    },
    card: {
      borderColor: 'color-mix(in srgb, var(--card-border) 50%, #8b5cf6 50%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 85%, #8b5cf6 15%)',
      color: 'var(--text-primary)',
    },
  },
  green: {
    layer: {
      borderColor: 'color-mix(in srgb, var(--accent-primary) 25%, #22c55e 75%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 90%, #22c55e 10%)',
    },
    card: {
      borderColor: 'color-mix(in srgb, var(--card-border) 50%, #22c55e 50%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 85%, #22c55e 15%)',
      color: 'var(--text-primary)',
    },
  },
  orange: {
    layer: {
      borderColor: 'color-mix(in srgb, var(--accent-primary) 25%, #f97316 75%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 90%, #f97316 10%)',
    },
    card: {
      borderColor: 'color-mix(in srgb, var(--card-border) 50%, #f97316 50%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 85%, #f97316 15%)',
      color: 'var(--text-primary)',
    },
  },
  cyan: {
    layer: {
      borderColor: 'color-mix(in srgb, var(--accent-primary) 25%, #06b6d4 75%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 90%, #06b6d4 10%)',
    },
    card: {
      borderColor: 'color-mix(in srgb, var(--card-border) 50%, #06b6d4 50%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 85%, #06b6d4 15%)',
      color: 'var(--text-primary)',
    },
  },
  red: {
    layer: {
      borderColor: 'color-mix(in srgb, var(--accent-primary) 25%, #ef4444 75%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 90%, #ef4444 10%)',
    },
    card: {
      borderColor: 'color-mix(in srgb, var(--card-border) 50%, #ef4444 50%)',
      backgroundColor: 'color-mix(in srgb, var(--card-bg) 85%, #ef4444 15%)',
      color: 'var(--text-primary)',
    },
  },
} satisfies Record<string, Palette>;

type PaletteKey = keyof typeof palettes;

interface ServiceBox {
  name: string;
  icon: IconType;
  details: string[];
  palette: PaletteKey;
}

interface ArchLayer {
  title: string;
  palette: PaletteKey;
  services: ServiceBox[];
}

interface ArchitectureDiagramProps {
  layers: ArchLayer[];
  stats?: string[];
}

function ServiceCard({ service }: { service: ServiceBox }) {
  const style = palettes[service.palette].card;
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className="rounded-xl border p-3 transition-shadow hover:shadow-lg sm:p-4"
      style={style}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <service.icon className="h-5 w-5 shrink-0" />
        <span className="text-sm font-bold">{service.name}</span>
      </div>
      <ul className="space-y-0.5">
        {service.details.map((d, i) => (
          <li
            key={i}
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
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
        <div
          className="h-4 w-px"
          style={{ backgroundColor: 'var(--text-muted)' }}
        />
        <div
          className="h-0 w-0 border-x-4 border-t-4 border-x-transparent"
          style={{ borderTopColor: 'var(--text-muted)' }}
        />
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
        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all hover:opacity-80"
        style={{
          borderColor: 'var(--accent-primary)',
          backgroundColor:
            'color-mix(in srgb, var(--card-bg) 80%, var(--accent-primary) 20%)',
          color: 'var(--accent-primary)',
        }}
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
            <div
              className="mt-4 space-y-1 rounded-2xl border p-4 backdrop-blur-sm sm:p-6"
              style={{
                borderColor: 'var(--card-border)',
                backgroundColor: 'var(--card-bg)',
              }}
            >
              {layers.map((layer, idx) => (
                <div key={idx}>
                  {idx > 0 && <ConnectionArrow />}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className="rounded-xl border p-3 sm:p-4"
                      style={palettes[layer.palette].layer}
                    >
                      <h4
                        className="mb-3 text-center text-xs font-bold tracking-wider uppercase"
                        style={{ color: 'var(--text-secondary)' }}
                      >
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
                      className="rounded-full border px-3 py-1 text-xs font-medium"
                      style={{
                        borderColor: 'var(--accent-primary)',
                        backgroundColor:
                          'color-mix(in srgb, var(--card-bg) 85%, var(--accent-primary) 15%)',
                        color: 'var(--accent-primary)',
                      }}
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

// ─── Balancely Architecture Data ──────────────────────────────────────────────

export const balancelyArchitecture: ArchitectureDiagramProps = {
  layers: [
    {
      title: 'Clients',
      palette: 'blue',
      services: [
        {
          name: 'Browser (React 19)',
          icon: HiDesktopComputer,
          details: ['Next.js App Router', '20 dashboard pages', 'shadcn/ui'],
          palette: 'blue',
        },
        {
          name: 'iOS App (JWT)',
          icon: HiDeviceMobile,
          details: ['API authentication', 'Push notifications', 'Native app'],
          palette: 'blue',
        },
        {
          name: 'PWA / Offline',
          icon: HiGlobe,
          details: ['Dexie.js', 'Offline support', 'Service worker'],
          palette: 'blue',
        },
      ],
    },
    {
      title: 'Next.js 16 (App Router) — 90+ API Routes',
      palette: 'purple',
      services: [
        {
          name: 'Frontend Layer',
          icon: HiCollection,
          details: [
            'Auth pages (login, register, reset)',
            'Dashboard, transactions, budgets',
            'Goals, savings, net worth, calendar',
            'Reports, forecast, merchants',
            'Subscriptions, settings, admin',
          ],
          palette: 'purple',
        },
        {
          name: 'API Layer (90+ routes)',
          icon: HiServer,
          details: [
            '/api/auth, /api/transactions',
            '/api/budgets, /api/receipts',
            '/api/savings, /api/goals',
            '/api/ai, /api/household',
            '/api/forecast, /api/cron',
          ],
          palette: 'purple',
        },
        {
          name: 'Shared Libraries',
          icon: HiCode,
          details: [
            'Auth: JWT, CSRF, passwords',
            'Data: Prisma, cache, Redis',
            'AI: categorize, insights, OCR',
            'Services: email, S3, Firebase',
          ],
          palette: 'purple',
        },
      ],
    },
    {
      title: 'Infrastructure',
      palette: 'green',
      services: [
        {
          name: 'PostgreSQL',
          icon: HiDatabase,
          details: ['35 models', 'Prisma ORM', 'Relational data'],
          palette: 'green',
        },
        {
          name: 'Redis',
          icon: HiLightningBolt,
          details: ['Caching', 'Job queues (BullMQ)', 'Rate limiting'],
          palette: 'green',
        },
        {
          name: 'S3 (MinIO)',
          icon: HiPhotograph,
          details: ['Receipt storage', 'Attachments', 'Presigned URLs'],
          palette: 'green',
        },
        {
          name: 'AI Service (OpenWebUI)',
          icon: HiChip,
          details: ['Auto-categorize', 'OCR / Vision', 'Spending insights'],
          palette: 'green',
        },
        {
          name: 'Firebase',
          icon: HiCloud,
          details: ['Push notifications', 'Device management'],
          palette: 'green',
        },
        {
          name: 'Sentry',
          icon: HiShieldCheck,
          details: ['Error tracking', 'Performance monitoring'],
          palette: 'green',
        },
        {
          name: 'SMTP Server',
          icon: HiMail,
          details: ['Email alerts', 'Weekly digests'],
          palette: 'green',
        },
      ],
    },
    {
      title: 'Background Processing',
      palette: 'orange',
      services: [
        {
          name: 'BullMQ Workers',
          icon: HiCog,
          details: ['email.worker.ts', 'budget-alert.worker.ts'],
          palette: 'orange',
        },
        {
          name: 'Ofelia Scheduler (Cron)',
          icon: HiClock,
          details: [
            '06:00 Recurring transactions',
            '07:00 Receipt emails',
            '08:00 Monthly reports',
            '09:00 Bill reminders',
            '18:00 Notification digests',
            '20:00 Anomaly detection',
          ],
          palette: 'orange',
        },
      ],
    },
    {
      title: 'Deployment (Docker Compose)',
      palette: 'cyan',
      services: [
        {
          name: 'balancely (Next.js)',
          icon: HiServer,
          details: ['Port 3000', 'App container'],
          palette: 'cyan',
        },
        {
          name: 'worker (BullMQ)',
          icon: HiCog,
          details: ['ts-node', 'Background jobs'],
          palette: 'cyan',
        },
        {
          name: 'redis (7-alpine)',
          icon: HiLightningBolt,
          details: ['Cache + queues'],
          palette: 'cyan',
        },
        {
          name: 'scheduler (Ofelia)',
          icon: HiClock,
          details: ['Cron jobs', '10 scheduled tasks'],
          palette: 'cyan',
        },
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

// ─── Tyler-Grant.com Architecture Data ────────────────────────────────────────

export const portfolioArchitecture: ArchitectureDiagramProps = {
  layers: [
    {
      title: 'Frontend (Next.js 16 App Router)',
      palette: 'blue',
      services: [
        {
          name: 'React 19 + TypeScript',
          icon: HiDesktopComputer,
          details: [
            'Tailwind CSS 4 styling',
            'Framer Motion animations',
            'Dark / Light theme',
            'PWA support',
          ],
          palette: 'blue',
        },
        {
          name: 'Pages',
          icon: HiCollection,
          details: [
            'Home, About, Projects',
            'Contact, Hobbies, Demos',
            'Login, Register, Admin',
            'Receipt Parser demo',
          ],
          palette: 'blue',
        },
        {
          name: 'Interactive Features',
          icon: HiChat,
          details: [
            'AI Chat assistant',
            'Drag-and-drop reordering',
            'Image cropping & lightbox',
            'Before/After comparisons',
          ],
          palette: 'blue',
        },
      ],
    },
    {
      title: 'API Layer (31 Routes)',
      palette: 'purple',
      services: [
        {
          name: 'Auth & Users',
          icon: HiLockClosed,
          details: [
            'NextAuth.js (JWT)',
            'Registration & login',
            'Role-based access (admin/user)',
            'Profile management',
          ],
          palette: 'purple',
        },
        {
          name: 'Content Management',
          icon: HiDocumentText,
          details: [
            'Projects CRUD',
            'Comments & lessons',
            'Time tracking & materials',
            'Receipt parsing',
          ],
          palette: 'purple',
        },
        {
          name: 'Communication',
          icon: HiMail,
          details: [
            'Contact form + email alerts',
            'AI chat (streaming)',
            'Chat session management',
            'Unread notifications',
          ],
          palette: 'purple',
        },
        {
          name: 'Analytics & Media',
          icon: HiChartBar,
          details: [
            'Page view tracking',
            'Event deduplication',
            'S3 file uploads',
            'HEIC auto-conversion',
          ],
          palette: 'purple',
        },
      ],
    },
    {
      title: 'Infrastructure',
      palette: 'green',
      services: [
        {
          name: 'PostgreSQL + Prisma',
          icon: HiDatabase,
          details: [
            '14 models',
            'Users, projects, analytics',
            'Chat sessions, contacts',
          ],
          palette: 'green',
        },
        {
          name: 'OpenWebUI (Self-Hosted AI)',
          icon: HiChip,
          details: [
            'Qwen 2.5 14B (chat)',
            'Llama 3.2 Vision (OCR)',
            'Streaming responses',
          ],
          palette: 'green',
        },
        {
          name: 'Garage (S3 Storage)',
          icon: HiPhotograph,
          details: [
            'Self-hosted object storage',
            'CDN via Cloudflare tunnel',
            'Images, videos, PDFs',
          ],
          palette: 'green',
        },
        {
          name: 'SMTP (Nodemailer)',
          icon: HiMail,
          details: ['Contact notifications', 'Admin alerts'],
          palette: 'green',
        },
      ],
    },
    {
      title: 'Security & Rate Limiting',
      palette: 'red',
      services: [
        {
          name: 'Authentication',
          icon: HiLockClosed,
          details: [
            'bcrypt password hashing',
            'JWT sessions',
            'RBAC (admin/user)',
          ],
          palette: 'red',
        },
        {
          name: 'Rate Limiting',
          icon: HiShieldCheck,
          details: [
            'Contact: 5 req/min',
            'Chat: 30 req/min',
            '429 + Retry-After headers',
          ],
          palette: 'red',
        },
      ],
    },
    {
      title: 'Deployment',
      palette: 'cyan',
      services: [
        {
          name: 'GitHub Actions CI/CD',
          icon: HiTerminal,
          details: [
            'Push-to-main trigger',
            'Build in staging directory',
            'Prisma generate + migrate',
          ],
          palette: 'cyan',
        },
        {
          name: 'PM2 Process Manager',
          icon: HiServer,
          details: ['Port 3000', 'Auto-restart on crash', 'Rsync deployment'],
          palette: 'cyan',
        },
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
