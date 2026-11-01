import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | PH Home Nursing Services',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16"
    >
      <div className="w-16 h-16 rounded-full bg-[var(--plum-tint)] text-[var(--plum)] flex items-center justify-center text-3xl mb-4 select-none">
        🏥
      </div>
      <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-base text-[var(--ink-muted)] max-w-md mx-auto mb-8 leading-relaxed">
        Sorry, we could not find the page you were looking for. You can explore our home care services or contact our team directly.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/services"
          className="inline-flex items-center justify-center h-12 px-6 bg-[var(--plum)] hover:bg-[var(--plum-dark)] text-white font-medium rounded-full transition-colors text-sm"
        >
          Browse services
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-12 px-6 bg-white border border-[var(--line)] hover:border-[var(--blue)] text-[var(--ink)] font-medium rounded-full transition-colors text-sm"
        >
          Contact our team
        </Link>
      </div>
    </main>
  );
}

