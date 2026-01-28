import type { NextConfig } from "next";

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
};

export default nextConfig;
