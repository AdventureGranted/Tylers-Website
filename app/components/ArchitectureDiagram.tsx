'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCode } from 'react-icons/hi';
import type {
  ServiceBox,
  ArchLayer,
  ArchitectureDiagramProps,
} from './architectureDiagramData';

function ServiceCard({ service }: { service: ServiceBox }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className={`rounded-xl border p-3 transition-shadow hover:shadow-lg sm:p-4 ${service.cardColor}`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <service.icon className="h-5 w-5 shrink-0" />
        <span className="text-sm font-bold">{service.name}</span>
      </div>
      <ul className="space-y-0.5">
        {service.details.map((d, i) => (
          <li key={i} className="text-xs text-gray-700 dark:text-gray-400">
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
        <div className="h-4 w-px bg-gray-300 dark:bg-yellow-300/40" />
        <div className="h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-gray-300 dark:border-t-yellow-300/40" />
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
        className="inline-flex items-center gap-2 rounded-lg border border-teal-500 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-600 transition-all hover:bg-teal-500/20 dark:border-yellow-300/30 dark:bg-yellow-300/10 dark:text-yellow-300 dark:hover:bg-yellow-300/20"
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
            <div className="mt-4 space-y-1 rounded-2xl border border-gray-300 bg-white p-4 backdrop-blur-sm sm:p-6 dark:border-gray-700 dark:bg-gray-900/50">
              {layers.map((layer, idx) => (
                <div key={idx}>
                  {idx > 0 && <ConnectionArrow />}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div
                      className={`rounded-xl border p-3 sm:p-4 ${layer.layerColor}`}
                    >
                      <h4 className="mb-3 text-center text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-300">
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
                      className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-700 dark:border-yellow-300/20 dark:bg-yellow-300/5 dark:text-yellow-300"
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

export type { ArchitectureDiagramProps, ArchLayer, ServiceBox };
