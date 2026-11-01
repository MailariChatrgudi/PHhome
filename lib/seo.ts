/**
 * lib/seo.ts
 *
 * Central SEO helper — wraps every page's Metadata so canonical URLs,
 * OG images and Twitter cards are always consistent.
 *
 * Usage:
 *   export const metadata = buildMetadata({
 *     title: 'Home Nursing Services in Bengaluru',   // ≤60 chars (enforced at lint)
 *     description: '…',                              // ≤160 chars
 *     path: '/services/home-nursing',                // relative path — canonical is derived here
 *   });
 *
 * Phase 5 — features.md §1.2
 */

import type { Metadata } from 'next';
import { site } from '@/content/site';

export interface SeoParams {
  /** Page title — must be ≤60 chars. The brand suffix is added automatically. */
  title: string;
  /** Meta description — must be ≤160 chars. */
  description: string;
  /** Relative path, e.g. '/services/home-nursing'. Used to build the canonical URL. */
  path: string;
  /** Optional OG image URL. Defaults to site.ogImage. */
  ogImage?: string;
  /** Set true only for admin/draft pages that must never be indexed. */
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage = site.ogImage,
  noIndex = false,
}: SeoParams): Metadata {
  const canonical = `${site.url}${path}`;
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${site.url}${ogImage}`;

  return {
    title: {
      absolute: fullTitle,
    },
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title: fullTitle,
      description,
      siteName: site.name,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

