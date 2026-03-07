'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaReceipt } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { MdAccountBalance } from 'react-icons/md';

const demos = [
  {
    title: 'Receipt Parser',
    description:
      'Upload receipt images and let AI categorize items into materials, tools, and misc. Built for tracking home improvement and woodworking project costs.',
    href: '/demo/receipt-parser',
    icon: <FaReceipt className="text-2xl" />,
    external: false,
  },
  {
    title: 'Balancely',
    description:
      'A budgeting app that helps you manage finances with intuitive tracking, smart categorization, and clear spending insights.',
    href: 'https://budget.adventuregranted.com',
    icon: <MdAccountBalance className="text-2xl" />,
    external: true,
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
        <h1 className="mb-4 text-4xl font-bold text-gray-200">Demos</h1>
        <p className="mx-auto max-w-2xl text-gray-400">
          Interactive demos and side projects to explore.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
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
                className="group block h-full rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg transition-all hover:border-yellow-300/50 hover:shadow-yellow-300/5"
              >
                <DemoCardContent demo={demo} />
              </a>
            ) : (
              <Link
                href={demo.href}
                className="group block h-full rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg transition-all hover:border-yellow-300/50 hover:shadow-yellow-300/5"
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-300/10 text-yellow-300">
          {demo.icon}
        </div>
        {demo.external && (
          <HiOutlineExternalLink className="text-lg text-gray-500 transition-colors group-hover:text-yellow-300" />
        )}
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-200 transition-colors group-hover:text-yellow-300">
        {demo.title}
      </h2>
      <p className="text-sm leading-relaxed text-gray-400">
        {demo.description}
      </p>
    </>
  );
}
