import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'tylers-website.web.192.168.1.251.nip.io',
        port: '3902',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
