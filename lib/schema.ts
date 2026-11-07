/**
 * lib/schema.ts
 *
 * Typed builders for every JSON-LD schema used on the site.
 *
 * Rules (build-prompt §3, features.md §1.3):
 *  - No aggregateRating, Review, or fabricated markup of any kind.
 *  - No JobPosting — /careers is an open application form.
 *  - Article schema used on update pages (Phase 7).
 *
 * Phase 5 — requirements.md FR-S5
 */

import { site } from '@/content/site';

const BASE = site.url;

/* ─── LocalBusiness / MedicalBusiness (site-wide) ──────────────────────── */

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: site.name,
    url: BASE,
    logo: `${BASE}${site.logo.path}`,
    image: `${BASE}${site.ogImage}`,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      postalCode: site.address.postalCode,
      addressCountry: site.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    areaServed: {
      '@type': 'City',
      name: site.areaServed,
    },
    // IMPORTANT: No aggregateRating, no Review (features.md §1.3)
  };
}

/* ─── BreadcrumbList ────────────────────────────────────────────────────── */

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  const listItems = [
    // Home always first
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE,
    },
    ...items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: item.name,
      ...(item.href ? { item: `${BASE}${item.href}` } : {}),
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };
}

/* ─── FAQPage ───────────────────────────────────────────────────────────── */

export interface FaqSchemaItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqSchemaItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/* ─── Article (used on /updates/[slug] — Phase 7) ──────────────────────── */

export interface ArticleSchemaParams {
  headline: string;
  description: string;
  url: string;
  datePublished: string; // ISO 8601
  dateModified: string;  // ISO 8601
  imageUrl?: string;
}

export function articleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
}: ArticleSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${BASE}${url}`,
    datePublished,
    dateModified,
    image: imageUrl
      ? (imageUrl.startsWith('http') ? imageUrl : `${BASE}${imageUrl}`)
      : `${BASE}${site.ogImage}`,
    author: {
      '@type': 'Organization',
      name: site.name,
      url: BASE,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE}${site.logo.path}`,
      },
    },
  };
}

