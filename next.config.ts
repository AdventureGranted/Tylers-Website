import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    skipWaiting: true,
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Update this to your Cloudflare tunnel domain for images
        hostname: 'images.tyler-grant.com',
        pathname: '/**',
      },
    ],
  },
  // Required for Next.js 16 with Turbopack
  turbopack: {},
};

export default withPWA(nextConfig);
