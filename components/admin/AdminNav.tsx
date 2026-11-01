'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState('');

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.email) setEmail(data.email);
      })
      .catch(() => {});
  }, [isLoginPage]);

  if (isLoginPage) return null;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <header className="w-full bg-[var(--surface)] border-b border-[var(--line)] sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Brand + Nav Link */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/admin/updates"
            className="flex items-center gap-2 font-semibold text-base sm:text-lg text-[var(--plum)]"
          >
            <span
              className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs"
              style={{ background: 'var(--grad-brand)' }}
            >
              PH
            </span>
            <span className="hidden sm:inline">PH Home</span>
            <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--plum-tint)] text-[var(--plum)] font-semibold">
              Admin
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <Link
              href="/admin/updates"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith('/admin/updates')
                  ? 'bg-[var(--plum-tint)] text-[var(--plum)] font-semibold'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              Updates
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden md:inline-block text-xs text-[var(--ink-muted)]">
              {email}
            </span>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-[var(--blue)] hover:underline flex items-center gap-1"
          >
            <span>View site</span>
            <span aria-hidden="true">↗</span>
          </a>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-tint)] transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

