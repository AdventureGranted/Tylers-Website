'use client';

import dynamic from 'next/dynamic';
import { useTheme } from './ThemeProvider';

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
  const { theme } = useTheme();

  // Hide starfield in light mode - it's designed for dark backgrounds
  if (theme === 'light') {
    return null;
  }

  return (
    <Starfield
      {...props}
      backgroundColor="black"
      starColor={[255, 255, 255]}
      blendMode="screen"
    />
  );
}
