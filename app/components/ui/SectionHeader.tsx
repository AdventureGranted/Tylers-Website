'use client';

import { motion, Variants } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  variants?: Variants;
}

export function SectionHeader({ title, variants }: SectionHeaderProps) {
  return (
    <motion.div variants={variants} className="mb-8 text-center">
      <h2 className="text-3xl font-bold text-[var(--text-primary)]">{title}</h2>
      <div className="mx-auto mt-2 h-1 w-72 rounded bg-gradient-to-r from-purple-500 to-yellow-300" />
    </motion.div>
  );
}
