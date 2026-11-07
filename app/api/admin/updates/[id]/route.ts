import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update, type ICoverImage, type ISEO } from '@/models/Update';
import { extractCloudinaryPublicId } from '@/lib/cloudinary';

interface Props {
  params: Promise<{ id: string }>;
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
 * GET /api/admin/updates/:id
 */
export async function GET(request: Request, { params }: Props) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Invalid ID' }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const doc = await Update.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Update not found' }, { status: 404 });
    }
    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    console.error('Admin GET update by id error:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/updates/:id
 */
export async function PUT(request: Request, { params }: Props) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Invalid ID' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'VALIDATION_ERROR', message: 'Invalid JSON' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const existing = await Update.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Update not found' }, { status: 404 });
    }

    const oldSlug = existing.slug;
    const oldStatus = existing.status;
    const newSlug = body.slug ? String(body.slug).trim().toLowerCase() : existing.slug;

    // Check slug uniqueness if changed
    if (newSlug !== oldSlug) {
      const conflict = await Update.findOne({ slug: newSlug, _id: { $ne: id } });
      if (conflict) {
        return NextResponse.json(
          { error: 'SLUG_TAKEN', message: 'This URL slug is already taken' },
          { status: 409 }
        );
      }
      // If previously published, store old slug in previousSlugs for 301 redirects (spec: api.md §4)
      if (oldStatus === 'published' && !existing.previousSlugs.includes(oldSlug)) {
        existing.previousSlugs.push(oldSlug);
      }
      existing.slug = newSlug;
    }

    if (body.title !== undefined) existing.title = String(body.title).trim();
    if (body.excerpt !== undefined) existing.excerpt = String(body.excerpt).trim();
    if (body.content !== undefined) existing.content = String(body.content);
    if (body.coverImage !== undefined) {
      if (body.coverImage && typeof body.coverImage === 'object') {
        const rawCover = body.coverImage as ICoverImage;
        const url = rawCover.url ? String(rawCover.url).trim() : '';
        const publicId =
          (rawCover.publicId ? String(rawCover.publicId).trim() : '') || extractCloudinaryPublicId(url);
        const alt = rawCover.alt ? String(rawCover.alt).trim() : (existing.title || '');
        existing.coverImage = { url, publicId, alt };
      } else {
        existing.coverImage = undefined;
      }
    }
    if (body.seo !== undefined) {
      existing.seo = body.seo ? (body.seo as ISEO) : undefined;
    }

    if (body.status !== undefined) {
      const newStatus = body.status === 'published' ? 'published' : 'draft';
      // First time published -> set publishedAt
      if (newStatus === 'published' && !existing.publishedAt) {
        existing.publishedAt = new Date();
      }
      existing.status = newStatus;
    }

    existing.updatedAt = new Date();
    await existing.save();

    // Revalidate affected paths
    const pathsToRevalidate = ['/updates', `/updates/${existing.slug}`, '/', '/sitemap.xml'];
    if (oldSlug !== existing.slug) {
      pathsToRevalidate.push(`/updates/${oldSlug}`);
    }
    const revalidated = safeRevalidate(pathsToRevalidate);

    return NextResponse.json(
      {
        ...existing.toObject(),
        revalidated,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('Admin PUT update error:', err);
    if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
      return NextResponse.json({ error: 'SLUG_TAKEN', message: 'Slug already in use' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Failed to update' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/updates/:id
 */
export async function DELETE(request: Request, { params }: Props) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Invalid ID' }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const doc = await Update.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Update not found' }, { status: 404 });
    }

    // Revalidate paths
    const revalidated = safeRevalidate(['/updates', `/updates/${doc.slug}`, '/', '/sitemap.xml']);

    return NextResponse.json({ ok: true, revalidated }, { status: 200 });
  } catch (err) {
    console.error('Admin DELETE update error:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
