import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/content/services';
import { CategoryChip } from '@/components/Chip';

interface ServiceCardProps {
  service: Service;
}

/**
 * ServiceCard — spec: design.md §5 & Phase 4 Section Update
 * Card with photo, 1px --line border, rest shadow, lift on hover,
 * 4px top group accent bar, filled category chip with group dot,
 * and solid ink typography.
 */
export default function ServiceCard({ service }: ServiceCardProps) {
  const photoSrc = service.image || `/services/${service.slug}.jpg`;
  const accent = service.accent || 'plum';

  const accentBarClass = (() => {
    switch (accent) {
      case 'blue':
        return 'bg-[var(--blue)]';
      case 'amber':
        return 'bg-[var(--amber)]';
      case 'green':
        return 'bg-[var(--green)]';
      case 'plum':
      default:
        return 'bg-[var(--plum)]';
    }
  })();

  return (
    <article className="group relative bg-[var(--surface)] rounded-[var(--radius-card)] border border-[var(--line)] overflow-hidden card-base card-hover flex flex-col justify-between">
      {/* 4px top accent bar in group colour */}
      <div className={`h-1 w-full ${accentBarClass} shrink-0`} />

      <div className="flex-1 flex flex-col">
        {/* Service Photo */}
        <div className="relative w-full aspect-[16/10] bg-[var(--blue-tint)] overflow-hidden">
          <Image
            src={photoSrc}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Category Chip with group dot */}
          <div className="absolute top-3 left-3 z-10">
            <CategoryChip
              label={service.categoryTag || 'Home Care'}
              groupAccent={accent}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-[var(--ink)] group-hover:text-[var(--plum)] transition-colors mb-2.5 leading-snug">
            <Link
              href={`/services/${service.slug}`}
              className="focus:outline-none focus:ring-2 focus:ring-[var(--blue)] rounded-sm after:absolute after:inset-0"
            >
              {service.name}
            </Link>
          </h3>

          <p className="text-[15px] leading-relaxed text-[var(--ink-muted)] line-clamp-3">
            {service.shortDescription}
          </p>
        </div>
      </div>

      {/* Learn more link */}
      <div className="px-6 pb-6 pt-0 border-t border-[var(--line)] flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--blue)] group-hover:text-[var(--blue-dark)] transition-colors flex items-center gap-1.5 pt-4">
          Learn more
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </article>
  );
}
