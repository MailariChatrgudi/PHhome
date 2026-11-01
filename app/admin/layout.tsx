import type { Metadata } from 'next';
import { Suspense } from 'react';
import AdminNav from '@/components/admin/AdminNav';

export const instant = false;

export const metadata: Metadata = {
  title: 'Admin Portal | PH Home Nursing Services',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col text-[var(--ink)]">
      <Suspense fallback={<div className="h-14 sm:h-16 w-full bg-[var(--surface)] border-b border-[var(--line)]" />}>
        <AdminNav />
      </Suspense>
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Suspense fallback={<div className="p-8 text-center text-sm text-[var(--ink-muted)]">Loading admin view...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
