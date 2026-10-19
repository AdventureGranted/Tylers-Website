'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { containerVariants, itemVariants } from '@/app/lib/animations';

export default function CTAFooter() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="relative mt-16 overflow-hidden rounded-3xl border border-gray-300 bg-white px-8 py-16 text-center shadow-md md:px-16 md:py-20 dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg"
    >
      <div className="relative z-10">
        <motion.h2
          variants={itemVariants}
          className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-200"
        >
          Let&apos;s Work Together
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-8 max-w-2xl text-lg text-gray-700 dark:text-gray-400"
        >
          I&apos;m always interested in hearing about new projects and
          opportunities. Whether you have a question or just want to say hi,
          feel free to reach out!
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link
            href="/contact"
            className="group bg-accent-fill shadow-accent/25 hover:bg-accent-fill-hover hover:shadow-accent/40 inline-flex items-center gap-3 rounded-full px-10 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Get In Touch
            <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
