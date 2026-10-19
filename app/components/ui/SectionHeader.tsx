'use client';

import { motion, Variants } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  variants?: Variants;
}

export function SectionHeader({ title, variants }: SectionHeaderProps) {
  return (
    <motion.div variants={variants} className="mb-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
        {title}
      </h2>
      <div className="bg-accent mx-auto mt-2 h-1 w-72 rounded" />
    </motion.div>
  );
}
