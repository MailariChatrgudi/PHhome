import { site } from '@/content/site';

/**
 * AnnouncementBar — spec: design.md §5.1 (D1)
 * Sits above the header, scrolls away with page (not sticky), non-dismissible.
 * --amber background, --ink text 14px, min-height 40px, phone as underlined tel link.
 * Responsive: wraps cleanly to at most 2 lines at 360px without overflow.
 */
export default function AnnouncementBar() {
  if (!site.announcement?.enabled) return null;

  return (
    <aside
      aria-label="Urgent care announcement"
      className="w-full min-h-[40px] py-2 px-4 flex items-center justify-center text-center text-sm font-medium z-40 select-none"
      style={{
        backgroundColor: 'var(--amber)',
        color: 'var(--ink)',
      }}
    >
      <div className="container-content flex items-center justify-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 font-semibold">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--amber-ink)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          {site.announcement.text}:
        </span>
        <a
          href={`tel:${site.phone}`}
          className="font-bold underline hover:opacity-80 transition-opacity whitespace-nowrap"
          style={{ color: 'var(--ink)' }}
        >
          {site.announcement.phoneLabel}
        </a>
      </div>
    </aside>
  );
}

