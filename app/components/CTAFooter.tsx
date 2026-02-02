'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

export default function CTAFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="relative mt-16 overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] px-8 py-16 text-center md:px-16 md:py-20"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      {/* Background decorations */}
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-yellow-300/10 blur-3xl" />

      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl"
        >
          Let&apos;s Work Together
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-8 max-w-2xl text-lg text-[var(--text-secondary)]"
        >
          I&apos;m always interested in hearing about new projects and
          opportunities. Whether you have a question or just want to say hi,
          feel free to reach out!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-yellow-300 px-10 py-4 text-lg font-bold text-gray-900 shadow-lg shadow-yellow-300/25 transition-all duration-300 hover:scale-105 hover:bg-yellow-400 hover:shadow-yellow-300/40"
          >
            Get In Touch
            <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
