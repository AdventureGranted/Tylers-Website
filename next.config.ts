import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  // Keep the project screenshot sets out of the service worker precache;
  // galleries and cards lazy-load only the ones a visitor scrolls to.
  publicExcludes: [
    '!noprecache/**/*',
    '!balancely/**/*',
    '!backup/**/*',
    '!tyler-grant-site/**/*',
  ],
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    skipWaiting: true,
  },
});

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.tyler-grant.com',
        pathname: '/**',
      },
    ],
  },
  // Required for Next.js 16 with Turbopack
  turbopack: {},
};

export default withPWA(nextConfig);
