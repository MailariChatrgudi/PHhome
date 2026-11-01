import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import UpdateCard from '@/components/UpdateCard';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update } from '@/models/Update';
import { site } from '@/content/site';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const instant = false;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getUpdateDoc(slug: string) {
  if (!isDatabaseConfigured()) return null;
  try {
    await connectToDatabase();
    const cleanSlug = slug.toLowerCase().trim();
    const doc = await Update.findOne({ slug: cleanSlug }).lean();
    if (doc) return doc;

    // Check previousSlugs for permanent redirect
    const prevMatch = await Update.findOne({
      previousSlugs: cleanSlug,
      status: 'published',
    }).lean();
    if (prevMatch) {
      permanentRedirect(`/updates/${prevMatch.slug}`);
    }
    return null;
  } catch (err: unknown) {
    // If it's a redirect, re-throw so Next.js can handle it
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err;
    }
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const update = await getUpdateDoc(slug);

  if (!update || update.status !== 'published') {
    return {
      title: 'Update Not Found | PH Home Nursing Services',
      robots: { index: false, follow: false },
    };
  }

  const title =
    update.seo?.title?.trim() || `${update.title} | PH Home Nursing Services`;
  const description =
    update.seo?.description?.trim() || update.excerpt || update.title;

  return buildMetadata({
    title,
    description,
    path: `/updates/${update.slug}`,
    ogImage: update.coverImage?.url || undefined,
  });
}

export default async function UpdateDetailPage({ params }: Props) {
  const { slug } = await params;
  const update = await getUpdateDoc(slug);

  // Drafts and non-existent posts return 404
  if (!update || update.status !== 'published') {
    notFound();
  }

  // Calculate reading time (~200 words per minute)
  const wordCount = (update.content || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const publishDate = update.publishedAt
    ? new Date(update.publishedAt).toISOString()
    : new Date().toISOString();
  const updateDate = update.updatedAt
    ? new Date(update.updatedAt).toISOString()
    : publishDate;

  const formattedDate = new Date(publishDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Fetch 2 other published updates for "Related Articles"
  let relatedPosts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    coverImage?: { url: string; alt: string };
  }> = [];

  try {
    const relatedDocsRaw = await Update.find({
      status: 'published' as const,
      slug: { $ne: update.slug },
    })
      .sort({ publishedAt: -1 })
      .limit(2)
      .select('slug title excerpt coverImage publishedAt')
      .lean();

    const relatedDocs = relatedDocsRaw as unknown as Array<{
      slug: string;
      title: string;
      excerpt?: string;
      publishedAt?: Date | string;
      coverImage?: { url?: string; alt?: string };
    }>;

    relatedPosts = relatedDocs.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      excerpt: doc.excerpt || '',
      publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : new Date().toISOString(),
      coverImage: doc.coverImage?.url ? { url: doc.coverImage.url, alt: doc.coverImage.alt || doc.title } : undefined,
    }));
  } catch {
    relatedPosts = [];
  }

  return (
    <article className="container-content section-py">
      {/* JSON-LD Schemas: Article & Breadcrumb */}
      <JsonLd
        data={articleSchema({
          headline: update.title,
          description: update.excerpt || update.title,
          url: `/updates/${update.slug}`,
          datePublished: publishDate,
          dateModified: updateDate,
          imageUrl: update.coverImage?.url || undefined,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Updates', href: '/updates' },
          { name: update.title, href: `/updates/${update.slug}` },
        ])}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Updates', href: '/updates' },
          { label: update.title },
        ]}
      />

      {/* Header Area */}
      <header className="max-w-3xl mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--ink-muted)] font-medium mb-3">
          <span className="inline-flex items-center px-3 py-1 font-semibold text-[var(--plum)] bg-[var(--plum-tint)] rounded-full border border-[var(--plum-ring)]/10">
            Care Guide
          </span>
          <time dateTime={publishDate}>{formattedDate}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime} min read</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
          {update.title}
        </h1>

        {update.excerpt && (
          <p className="text-lg sm:text-xl text-[var(--ink-muted)] leading-relaxed">
            {update.excerpt}
          </p>
        )}
      </header>

      {/* Optional Cover Image */}
      {update.coverImage?.url && (
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] rounded-2xl overflow-hidden border border-[var(--line)] mb-10 shadow-xs">
          <Image
            src={update.coverImage.url}
            alt={update.coverImage.alt || update.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      )}

      {/* Article Content & CTA Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Main Article Prose */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[var(--line)] shadow-xs space-y-6 text-base text-[var(--ink)] leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-[var(--ink)] tracking-tight mt-8 mb-3 pb-2 border-b border-[var(--line)]">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-[var(--ink)] tracking-tight mt-6 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-base text-[var(--ink)] leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-2 mb-4 text-[var(--ink)]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-2 mb-4 text-[var(--ink)]">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="leading-snug">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--plum)] pl-4 italic text-[var(--ink-muted)] my-4 bg-[var(--plum-tint)]/40 py-2 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[var(--ink)]">{children}</strong>
                ),
              }}
            >
              {update.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sidebar: Consultation Box */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--plum-tint)] rounded-2xl p-6 sm:p-7 border border-[var(--line)] shadow-[var(--shadow-rest)] space-y-4">
            <div className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[var(--plum)] bg-white rounded-full border border-[var(--line)] shadow-[var(--shadow-rest)]">
              Bengaluru Home Care
            </div>
            <h3 className="text-xl font-semibold text-[var(--ink)] tracking-tight">
              Need Personalised Care Assistance?
            </h3>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Our clinical care managers are available 24/7 to assess your family member’s needs and arrange dedicated nursing or caretaker support.
            </p>
            <div className="pt-2 space-y-2.5">
              <a
                href={`tel:${site.phone}`}
                className="w-full h-11 bg-[var(--plum)] hover:bg-[var(--plum-dark)] text-white font-medium rounded-full flex items-center justify-center gap-2 text-sm transition-colors shadow-xs"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call {site.phoneDisplay}
              </a>
              <a
                href={`https://wa.me/${site.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-[var(--surface)] hover:bg-[var(--green-tint)] text-[var(--whatsapp)] border border-[var(--line)] hover:border-[var(--whatsapp)] font-medium rounded-full flex items-center justify-center gap-2 text-sm transition-colors shadow-xs"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Message on WhatsApp
              </a>
              <Link
                href="/contact"
                className="block text-center text-xs font-semibold text-[var(--blue)] hover:underline pt-1"
              >
                Send care enquiry form →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 sm:mt-20 pt-10 border-t border-[var(--line)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[var(--ink)] tracking-tight">
              More Care Guides
            </h2>
            <Link
              href="/updates"
              className="text-sm font-semibold text-[var(--blue)] hover:underline"
            >
              View all updates →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {relatedPosts.map((post) => (
              <UpdateCard key={post.slug} update={post} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
