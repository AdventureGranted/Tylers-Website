'use client';

import dynamic from 'next/dynamic';

const ArchitectureDiagram = dynamic(() => import('./ArchitectureDiagram'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
  ),
});

export default ArchitectureDiagram;
