import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update, type ICoverImage, type ISEO } from '@/models/Update';
import { extractCloudinaryPublicId } from '@/lib/cloudinary';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeRevalidate(paths: string[]): boolean {
  try {
    for (const p of paths) {
      revalidatePath(p);
    }
    return true;
  } catch (err) {
    console.error('Revalidation error:', err);
    return false;
  }
}

/**
 * GET /api/admin/updates
 * List all updates, including drafts (spec: api.md §4).
 * Query params: page, limit, status ('draft' | 'published' | all)
 */
export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'DATABASE_NOT_CONFIGURED', message: 'MongoDB is not configured' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const statusFilter = searchParams.get('status');

  try {
    await connectToDatabase();

    const query: Record<string, unknown> = {};
    if (statusFilter === 'draft' || statusFilter === 'published') {
      query.status = statusFilter;
    }

    const total = await Update.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const items = await Update.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      items,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (err) {
    console.error('Admin GET updates error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/updates
 * Create a new update (spec: api.md §4).
 */
export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'DATABASE_NOT_CONFIGURED', message: 'MongoDB is not configured' },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  const title = typeof body.title === 'string' ? body.title : '';
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt : '';
  const content = typeof body.content === 'string' ? body.content : '';
  const coverImage = body.coverImage;
  const seo = body.seo;
  const status = body.status === 'published' ? 'published' : 'draft';

  if (!title || title.trim().length < 3 || title.trim().length > 120) {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: 'Title must be between 3 and 120 characters' },
      { status: 400 }
    );
  }

  // Derive or sanitize slug
  let slug = (body.slug ? String(body.slug) : slugify(title)).trim().toLowerCase();
  if (!slug) {
    slug = slugify(title);
  }

  try {
    await connectToDatabase();

    // Check slug uniqueness (spec: 409 SLUG_TAKEN)
    const existing = await Update.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: 'SLUG_TAKEN', message: 'This URL slug is already taken' },
        { status: 409 }
      );
    }

    const isPublished = status === 'published';
    const now = new Date();

    const rawCover = coverImage as ICoverImage | undefined;
    const coverUrl = rawCover?.url ? String(rawCover.url).trim() : '';
    const coverPublicId =
      (rawCover?.publicId ? String(rawCover.publicId).trim() : '') || extractCloudinaryPublicId(coverUrl);
    const coverAlt = rawCover?.alt ? String(rawCover.alt).trim() : title.trim();

    const formattedCoverImage: ICoverImage = {
      url: coverUrl,
      publicId: coverPublicId,
      alt: coverAlt,
    };

    const newUpdate = await Update.create({
      title: title.trim(),
      slug,
      previousSlugs: [],
      excerpt: (excerpt || (content ? content.slice(0, 160) : '')).trim(),
      content: content || '',
      coverImage: formattedCoverImage,
      seo: (seo as ISEO) || { title: '', description: '' },
      status: isPublished ? 'published' : 'draft',
      publishedAt: isPublished ? now : null,
      createdAt: now,
      updatedAt: now,
    });

    let revalidated = true;
    if (isPublished) {
      revalidated = safeRevalidate(['/updates', `/updates/${slug}`, '/', '/sitemap.xml']);
    }

    return NextResponse.json(
      {
        ...newUpdate.toObject(),
        revalidated,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Admin POST update error:', err);
    if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: 'SLUG_TAKEN', message: 'This URL slug is already taken' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Failed to create update' },
      { status: 500 }
    );
  }
}
