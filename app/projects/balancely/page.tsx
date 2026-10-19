'use client';

import { motion } from 'framer-motion';
import {
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineCalendar,
  HiOutlineDeviceMobile,
  HiOutlineHeart,
  HiOutlineInboxIn,
  HiOutlineLightningBolt,
  HiOutlineLockClosed,
  HiOutlineReceiptTax,
  HiOutlineRefresh,
  HiOutlineServer,
  HiOutlineSparkles,
  HiOutlineSwitchHorizontal,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import PageTransition from '@/app/components/PageTransition';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import ScreenshotGallery from '@/app/components/ScreenshotGallery';
import CTAFooter from '@/app/components/CTAFooter';
import LazyArchitectureDiagram from '@/app/components/LazyArchitectureDiagram';
import { balancelyArchitecture } from '@/app/components/architectureDiagramData';
import { containerVariants, itemVariants } from '@/app/lib/animations';
import { balancelyScreenshots } from './screenshots';

const features = [
  {
    icon: HiOutlineRefresh,
    title: 'Automatic bank sync',
    body: 'SimpleFIN and Plaid feeds sync on the server, and Apple Card comes in on the device through Apple’s FinanceKit. New transactions land as drafts in a swipe-to-review deck with suggested categories and confidence levels.',
  },
  {
    icon: HiOutlineChartPie,
    title: 'Budgets that track pace',
    body: 'Each budget shows how fast I’m spending through the month, with alerts and an AI budget audit that suggests adjustments and savings opportunities.',
  },
  {
    icon: HiOutlineInboxIn,
    title: 'Account-backed savings goals',
    body: 'Balance changes on savings accounts land in a Money Inbox, where I assign the money to goals.',
  },
  {
    icon: HiOutlineCalendar,
    title: 'Subscriptions and bills',
    body: 'Tracks every recurring bill and automatically detects recurring charges I’m not tracking yet.',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Anomaly detection',
    body: 'Flags category spikes, unusually large transactions and new merchants, using adaptive per-category statistics.',
  },
  {
    icon: HiOutlineReceiptTax,
    title: 'Receipts, splits and refunds',
    body: 'Receipt scanning with OCR and AI-extracted line items, plus splits, refunds and duplicate detection.',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Reports',
    body: 'Cash flow, year-over-year, net worth with projections, a year in review, and tax-deductible tracking.',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Shared households',
    body: 'Two people, one budget, with comments on transactions.',
  },
];

const stack = [
  {
    icon: HiOutlineDeviceMobile,
    title: 'iOS',
    bullets: [
      'SwiftUI (iOS 18+), MVVM with @Observable, async/await',
      'CoreData offline queue with replay',
      'Project generated with XcodeGen',
      'watchOS app and WidgetKit widgets sharing data through an App Group',
    ],
  },
  {
    icon: HiOutlineServer,
    title: 'Backend',
    bullets: [
      'Next.js 16 route handlers as a REST API, with Prisma and PostgreSQL',
      'BullMQ and Redis workers for bank sync, budget alerts, AI jobs and merchant-logo learning',
      'Firebase push notifications and Sentry',
      'Self-hosted, deployed through a GitHub Actions pipeline',
    ],
  },
  {
    icon: HiOutlineSwitchHorizontal,
    title: 'API contract',
    bullets: [
      'No generated client',
      'Backend route tests record real JSON responses as contract fixtures',
      'The iOS test suite decodes those fixtures with the app’s own models',
      'A parity check diffs the endpoints the iOS app calls against the backend routes',
    ],
  },
  {
    icon: HiOutlineSparkles,
    title: 'AI',
    bullets: [
      'A self-hosted LLM handles transaction categorization, budget audits and receipt parsing',
    ],
  },
];

const tech = [
  'SwiftUI',
  'watchOS',
  'WidgetKit',
  'FinanceKit',
  'CoreData',
  'Next.js 16',
  'TypeScript',
  'Prisma',
  'PostgreSQL',
  'BullMQ',
  'Redis',
  'Firebase',
  'Sentry',
  'GitHub Actions',
];

const cardClass =
  'rounded-3xl border border-gray-300 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg';

export default function BalancelyPage() {
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
              { label: 'Balancely' },
            ]}
          />

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="relative mb-10">
            <div className="relative">
              <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl dark:text-gray-200">
                Balancely
              </h1>
              <div className="text-md mb-1 text-gray-700 dark:text-gray-400">
                iOS Personal Finance App
              </div>
              <div className="mb-4 text-sm text-gray-700 dark:text-gray-400">
                January 2026 – Present
              </div>
              <div className="bg-accent mb-6 h-1 w-full max-w-xs rounded-full md:max-w-sm" />
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300">
                  <HiOutlineHeart />
                  Personal project, used daily
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-400">
                  <HiOutlineLockClosed />
                  Private repo
                </span>
              </div>
              <div className="max-w-3xl space-y-4 text-lg text-gray-900 dark:text-gray-200">
                <p>
                  Balancely is a personal-finance and budgeting app I designed
                  and built end to end. It’s a native iOS app backed by a custom
                  API, with a watchOS companion and home-screen widgets.
                </p>
                <p>
                  My household runs its budget on it every day. It’s a personal
                  project, not an App Store release (yet).
                </p>
              </div>
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
              All names, accounts and amounts are a fictional demo household.
            </p>
            <ScreenshotGallery
              screenshots={balancelyScreenshots}
              basePath="/balancely"
              label="Balancely app screenshots"
            />
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
              {...balancelyArchitecture}
              title="Balancely Architecture"
            />
          </motion.section>

          <CTAFooter />
        </motion.div>
      </div>
    </PageTransition>
  );
}
