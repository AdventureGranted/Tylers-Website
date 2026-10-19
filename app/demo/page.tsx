'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaReceipt } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';

const demos = [
  {
    title: 'Receipt Parser',
    description:
      'Upload receipt images and let AI categorize items into materials, tools, and misc. Built for tracking home improvement and woodworking project costs.',
    href: '/demo/receipt-parser',
    icon: <FaReceipt className="text-2xl" />,
    external: false,
  },
];

export default function DemosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-200">
          Demos
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
          Interactive demos and side projects to explore.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-md gap-6">
        {demos.map((demo, i) => (
          <motion.div
            key={demo.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
          >
            {demo.external ? (
              <a
                href={demo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:border-accent-soft/50 dark:hover:border-accent/50 dark:hover:shadow-accent/5 block h-full rounded-2xl border border-gray-300 bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
              >
                <DemoCardContent demo={demo} />
              </a>
            ) : (
              <Link
                href={demo.href}
                className="group hover:border-accent-soft/50 dark:hover:border-accent/50 dark:hover:shadow-accent/5 block h-full rounded-2xl border border-gray-300 bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
              >
                <DemoCardContent demo={demo} />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DemoCardContent({ demo }: { demo: (typeof demos)[number] }) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="bg-accent-soft/10 text-accent dark:bg-accent/10 flex h-12 w-12 items-center justify-center rounded-xl">
          {demo.icon}
        </div>
        {demo.external && (
          <HiOutlineExternalLink className="group-hover:text-accent text-lg text-gray-500 transition-colors" />
        )}
      </div>
      <h2 className="group-hover:text-accent mb-2 text-xl font-semibold text-gray-900 transition-colors dark:text-gray-200">
        {demo.title}
      </h2>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {demo.description}
      </p>
    </>
  );
}
