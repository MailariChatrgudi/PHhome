import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb component — WCAG compliant semantic breadcrumb navigation.
 * Renders on inner pages (Services, Detail, About, FAQ, Careers, Contact, Updates).
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full py-4 mb-2">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-muted)]">
        <li>
          <Link
            href="/"
            className="hover:text-[var(--blue)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--blue)] rounded-sm"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              <span className="text-[var(--line)] select-none" aria-hidden="true">
                /
              </span>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--blue)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--blue)] rounded-sm"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[var(--ink)] font-medium" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
