import { NextResponse } from 'next/server';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update } from '@/models/Update';

/**
 * GET /api/updates/:slug
 * Public endpoint to fetch one published update by slug.
 * Spec: api.md §2
 *
 * Rules:
 * - Returns 404 NOT_FOUND for drafts and unknown slugs.
 * - If found in previousSlugs of a published post, returns redirect metadata.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = slug.toLowerCase().trim();

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Update not found' } },
        { status: 404 }
      );
    }

    await connectToDatabase();

    // 1. Try finding by current slug
    const update = await Update.findOne({ slug: cleanSlug }).lean();

    if (update) {
      // Drafts are invisible publicly per api.md §2
      if (update.status !== 'published') {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Update not found' } },
          { status: 404 }
        );
      }

      return NextResponse.json({
        slug: update.slug,
        title: update.title,
        excerpt: update.excerpt,
        content: update.content,
        coverImage: {
          url: update.coverImage?.url || '',
          alt: update.coverImage?.alt || update.title,
        },
        seo: {
          title: update.seo?.title || `${update.title} | PH Home Nursing Services`,
          description: update.seo?.description || update.excerpt,
        },
        publishedAt: update.publishedAt,
        updatedAt: update.updatedAt,
      });
    }

    // 2. Check if it exists as an old slug for 301 redirect
    const oldSlugMatch = await Update.findOne({
      previousSlugs: cleanSlug,
      status: 'published',
    }).lean();

    if (oldSlugMatch) {
      return NextResponse.json(
        {
          redirect: true,
          destination: `/updates/${oldSlugMatch.slug}`,
          slug: oldSlugMatch.slug,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Update not found' } },
      { status: 404 }
    );
  } catch {
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Failed to retrieve update' } },
      { status: 500 }
    );
  }
}

