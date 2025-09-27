import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  env: {
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || "",
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || "",
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || "",
    AUTH0_SECRET: process.env.AUTH0_SECRET || "",
    APP_BASE_URL: process.env.APP_BASE_URL || "",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.auth0.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
