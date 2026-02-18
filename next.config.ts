import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  // Enable standalone output for production deployment
  output: 'standalone',
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Allow unoptimized images in production if needed
    unoptimized: false,
    // Add domains for image optimization
    domains: [],
  },
  // Rewrite /uploads/* to API route to ensure uploaded images are served correctly
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
