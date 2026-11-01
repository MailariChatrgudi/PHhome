import { NextResponse } from 'next/server';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update } from '@/models/Update';

/**
 * GET /api/updates
 * Public endpoint to list published updates, newest first.
 * Spec: api.md §2
 *
 * Query params:
 * - page (default 1)
 * - limit (default 9, max 30)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '9', 10);

    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const limit = Math.min(30, Math.max(1, isNaN(limitParam) ? 9 : limitParam));
    const skip = (page - 1) * limit;

    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        items: [],
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      });
    }

    await connectToDatabase();

    const filter = { status: 'published' as const };

    const [itemsRaw, total] = await Promise.all([
      Update.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('slug title excerpt coverImage publishedAt updatedAt')
        .lean(),
      Update.countDocuments(filter),
    ]);

    const items = itemsRaw as unknown as Array<{
      slug: string;
      title: string;
      excerpt?: string;
      coverImage?: { url?: string; alt?: string };
      publishedAt?: Date | string;
      updatedAt?: Date | string;
    }>;

    const formattedItems = items.map((item) => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || '',
      coverImage: {
        url: item.coverImage?.url || '',
        alt: item.coverImage?.alt || item.title,
      },
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json({
      items: formattedItems,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Failed to fetch updates' } },
      { status: 500 }
    );
  }
}
