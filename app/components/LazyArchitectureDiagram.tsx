'use client';

import dynamic from 'next/dynamic';

const ArchitectureDiagram = dynamic(() => import('./ArchitectureDiagram'), {
  ssr: false,
  loading: () => (
    // Same footprint as the "View Architecture" button it loads, so the card
    // doesn't jump when it swaps in
    <div className="mt-4 h-9 w-44 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
  ),
});

export default ArchitectureDiagram;
