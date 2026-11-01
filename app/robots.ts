/**
 * app/robots.ts
 *
 * Robots.txt generator — features.md §1.2, requirements.md FR-S4.
 * Rules:
 *  - All crawlers: allow everything public, disallow /admin and /api.
 *  - Points at /sitemap.xml.
 */
import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

