import type { NextConfig } from "next";
import { redirects as redirectMap } from "./redirects";

const isProd = process.env.NODE_ENV === 'production';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://vercel.live;
  style-src 'self' 'unsafe-inline' https://vercel.live;
  img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://vercel.live https://vercel.com https:;
  font-src 'self' data: https://vercel.live https://assets.vercel.com;
  frame-src 'self' https://challenges.cloudflare.com https://www.google.com https://maps.google.com https://vercel.live;
  connect-src 'self' ws: wss: https://challenges.cloudflare.com https://api.cloudinary.com https://vercel.live https://*.pusher.com wss://*.pusher.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`;

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.149.193.57', '10.149.193.57:3000', 'localhost:3000'],
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
      },
    },
  },
  async redirects() {
    return redirectMap;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: isProd ? 'max-age=63072000; includeSubDomains; preload' : 'max-age=0',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
