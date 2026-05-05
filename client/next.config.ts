import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '172.19.128.1', '10.229.140.90'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'salahdecor.net',
      },
      {
        protocol: 'http',
        hostname: 'salahdecor.net',
      },
    ],
  },
};

export default nextConfig;
