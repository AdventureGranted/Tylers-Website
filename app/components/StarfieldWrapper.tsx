'use client';

import dynamic from 'next/dynamic';

const Starfield = dynamic(() => import('./Starfield'), {
  ssr: false,
});

interface Props {
  starCount?: number;
  starColor?: [number, number, number];
  speedFactor?: number;
  backgroundColor?: string;
}

export default function StarfieldWrapper(props: Props) {
  return <Starfield {...props} />;
}
