/**
 * app/sitemap.ts
 *
 * Auto-generated sitemap — features.md §1.2, requirements.md FR-S4.
 *
 * Includes:
 *  1. All static public pages (hard-coded — no DB).
 *  2. All 9 service detail pages (from content/services.ts).
 *  3. Published updates (Phase 7 wires in real DB; for now returns an empty
 *     array so the build passes. The sitemap is revalidated after every
 *     publish/unpublish via revalidatePath — Phase 8.)
 *
 * Excluded:
 *  - /admin/* — noindex, disallowed in robots.txt.
 *  - /api/*   — not page routes.
 *  - /token-test — development utility, not public.
 */
import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { servicesSlugs } from '@/content/services';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update } from '@/models/Update';

// Build date used as lastModified for static pages (changes on each deploy).
// Using a constant string avoids "new Date() in server component" warnings.
const BUILD_DATE = '2026-10-28T00:00:00.000Z';

async function getPublishedUpdates(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  if (!isDatabaseConfigured()) {
    return [];
  }
  try {
    await connectToDatabase();
    const docsRaw = await Update.find({ status: 'published' as const })
      .select('slug updatedAt')
      .lean();
    const docs = docsRaw as unknown as Array<{ slug: string; updatedAt?: Date | string }>;
    return docs.map((doc) => ({
      slug: doc.slug,
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : BUILD_DATE,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  /* ── 1. Core static pages ──────────────────────────────────────────────── */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/services`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/faq`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/careers`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/updates`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  /* ── 2. Service detail pages ────────────────────────────────────────────── */
  const servicePages: MetadataRoute.Sitemap = servicesSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  /* ── 3. Published blog updates (Phase 7 fills this) ───────────────────── */
  const publishedUpdates = await getPublishedUpdates();
  const updatePages: MetadataRoute.Sitemap = publishedUpdates.map((u) => ({
    url: `${base}/updates/${u.slug}`,
    lastModified: u.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...updatePages];
}

