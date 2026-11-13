import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import UpdateCard from '@/components/UpdateCard';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update } from '@/models/Update';
import { breadcrumbSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

// Allow a blocking route in Next.js 16 with cacheComponents: true
// (Direct MongoDB queries and searchParams without Suspense)
export const instant = false;

export const metadata: Metadata = buildMetadata({
  title: 'Care Updates & Practical Guides',
  description:
    'Helpful care tips, post-hospital recovery advice, and home health guides for families across Bengaluru.',
  path: '/updates',
});

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function UpdatesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const pageParam = parseInt(resolvedParams.page || '1', 10);
  const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
  const limit = 9;
  const skip = (page - 1) * limit;

  let updates: Array<{
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    coverImage?: { url: string; alt: string };
  }> = [];
  let total = 0;

  if (isDatabaseConfigured()) {
    try {
      await connectToDatabase();
      const [docsRaw, count] = await Promise.all([
        Update.find({ status: 'published' as const })
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('slug title excerpt coverImage publishedAt')
          .lean(),
        Update.countDocuments({ status: 'published' as const }),
      ]);

      const docs = docsRaw as unknown as Array<{
        slug: string;
        title: string;
        excerpt?: string;
        publishedAt?: Date | string;
        coverImage?: { url?: string; alt?: string };
      }>;

      updates = docs.map((doc) => {
        const coverUrl = doc.coverImage?.url?.trim();
        return {
          slug: doc.slug,
          title: doc.title,
          excerpt: doc.excerpt || '',
          publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : new Date(0).toISOString(),
          coverImage: coverUrl ? { url: coverUrl, alt: doc.coverImage?.alt || doc.title } : undefined,
        };
      });
      total = count;
    } catch {
      // Graceful fallback if database connection times out
      updates = [];
      total = 0;
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container-content section-py">
      {/* JSON-LD: BreadcrumbList */}
      <JsonLd data={breadcrumbSchema([{ name: 'Updates', href: '/updates' }])} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Updates' }]} />

      {/* Page Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[var(--plum)] bg-[var(--plum-tint)] rounded-full border border-[var(--plum-ring)]/10 mb-3">
          Care Knowledge &amp; Guidance
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
          Care Updates &amp; Practical Guides
        </h1>
        <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
          Helpful guidance on caring for aging parents, managing post-hospital recovery, and organizing comfortable home healthcare in Bengaluru.
        </p>
      </div>

      {/* Updates Grid */}
      {updates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {updates.map((update) => (
              <UpdateCard key={update.slug} update={update} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav
              aria-label="Updates pagination"
              className="flex items-center justify-between border-t border-[var(--line)] pt-6 sm:pt-8"
            >
              <div>
                {page > 1 ? (
                  <Link
                    href={`/updates?page=${page - 1}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[var(--ink)] bg-white border border-[var(--line)] rounded-lg hover:border-[var(--blue)] transition-colors"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[var(--ink-muted)]/50 bg-white border border-[var(--line)]/60 rounded-lg cursor-not-allowed">
                    ← Previous
                  </span>
                )}
              </div>

              <span className="text-sm text-[var(--ink-muted)] font-medium">
                Page {page} of {totalPages}
              </span>

              <div>
                {page < totalPages ? (
                  <Link
                    href={`/updates?page=${page + 1}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[var(--ink)] bg-white border border-[var(--line)] rounded-lg hover:border-[var(--blue)] transition-colors"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[var(--ink-muted)]/50 bg-white border border-[var(--line)]/60 rounded-lg cursor-not-allowed">
                    Next →
                  </span>
                )}
              </div>
            </nav>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[var(--line)] text-center max-w-2xl mx-auto shadow-xs my-8">
          <span className="text-4xl block mb-3" aria-hidden="true">
            📖
          </span>
          <h2 className="text-xl font-semibold text-[var(--ink)] mb-2">
            No Published Articles Yet
          </h2>
          <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
            Our team is preparing practical care guides and articles for families in Bengaluru. In the meantime, explore our home healthcare services or reach out directly with any questions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[var(--plum)] hover:bg-[var(--plum-dark)] text-white text-sm font-medium rounded-full transition-colors"
            >
              View care services →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-[var(--line)] text-[var(--ink)] text-sm font-medium rounded-full hover:border-[var(--blue)] transition-colors"
            >
              Contact our team
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
