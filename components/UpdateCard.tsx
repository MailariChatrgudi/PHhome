import Link from 'next/link';
import Image from 'next/image';

export interface UpdateCardData {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | Date;
  coverImage?: string | { url?: string; alt?: string };
  tag?: string;
  accent?: 'plum' | 'blue';
}

interface UpdateCardProps {
  update: UpdateCardData;
}

/**
 * UpdateCard — spec: design.md §5 & Phase 4 Updates Section
 * Blog post card with 16:9 cover image or --grad-blue fallback,
 * crisp 48px SVG in white at 40% opacity (no emoji),
 * 4px top accent bar, date (13px), title, 2-line excerpt (15px).
 */
export default function UpdateCard({ update }: UpdateCardProps) {
  const rawImageUrl =
    typeof update.coverImage === 'string'
      ? update.coverImage
      : update.coverImage?.url;
  const imageUrl = rawImageUrl?.trim() || '';
  const imageAlt =
    typeof update.coverImage === 'object'
      ? update.coverImage?.alt || update.title
      : update.title;

  const dateStr =
    typeof update.publishedAt === 'string'
      ? update.publishedAt
      : update.publishedAt?.toISOString?.() || '';

  const accentColor = update.accent === 'blue' ? 'bg-[var(--blue)]' : 'bg-[var(--plum)]';

  // Crisp 48px category SVG by tag
  const renderFallbackIcon = () => {
    const tag = (update.tag || '').toLowerCase();
    if (tag.includes('family') || tag.includes('guide')) {
      // Clipboard icon
      return (
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40"
          aria-hidden="true"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 14h6" />
          <path d="M9 18h6" />
          <path d="M9 10h6" />
        </svg>
      );
    }
    if (tag.includes('dementia') || tag.includes('heart') || tag.includes('recovery')) {
      // Heart with pulse
      return (
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40"
          aria-hidden="true"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 5v14" />
        </svg>
      );
    }
    // Shield default
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  };

  return (
    <article className="group bg-[var(--surface)] rounded-[var(--radius-card)] border border-[var(--line)] overflow-hidden card-base card-hover flex flex-col justify-between">
      {/* 4px top accent bar */}
      <div className={`h-1 w-full ${accentColor} shrink-0`} />

      <div>
        {/* Cover or Brand Gradient Fallback */}
        <div
          className="w-full aspect-[16/9] flex items-center justify-center relative overflow-hidden"
          style={{ background: imageUrl ? undefined : 'var(--grad-blue)' }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center">
              {renderFallbackIcon()}
            </div>
          )}
          {update.tag && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[13px] font-semibold text-[var(--plum)] bg-[var(--plum-tint)] rounded-full shadow-[var(--shadow-rest)]">
              {update.tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {dateStr && (
            <time
              dateTime={dateStr}
              className="text-[13px] text-[var(--ink-muted)] font-medium block mb-2"
            >
              {new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </time>
          )}

          <h3 className="text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--plum)] transition-colors line-clamp-2 mb-2 leading-snug">
            <Link
              href={`/updates/${update.slug}`}
              className="focus:outline-none focus:ring-2 focus:ring-[var(--blue)] rounded-sm"
            >
              {update.title}
            </Link>
          </h3>

          <p className="text-[15px] text-[var(--ink-muted)] line-clamp-2 leading-relaxed">
            {update.excerpt}
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-0">
        <Link
          href={`/updates/${update.slug}`}
          className="text-sm font-semibold text-[var(--blue)] group-hover:text-[var(--blue-dark)] flex items-center gap-1 transition-colors"
        >
          Read article <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
