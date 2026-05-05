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
      {
        protocol: 'https',
        hostname: 'dash.salahdecor.net',
      },
    ],
  },
  async rewrites() {
    const uploadProxy = process.env.UPLOAD_PROXY_URL || '';
    if (uploadProxy) {
      return [
        {
          source: '/uploads/:path*',
          destination: `${uploadProxy}/uploads/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
