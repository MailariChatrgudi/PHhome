'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/updates';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.message || 'Too many login attempts. Please wait 15 minutes.');
        } else {
          setError(data.message || 'Invalid email or password.');
        }
        setSubmitting(false);
        return;
      }

      // Login successful, redirect to admin updates
      router.push(from);
      router.refresh();
    } catch {
      setError('Connection error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl border border-[var(--line)] shadow-[var(--shadow-soft)] overflow-hidden">
      {/* Top 4px Brand Gradient Bar */}
      <div
        className="h-1 w-full"
        style={{ background: 'var(--grad-brand)' }}
      />

      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-[var(--ink)] tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            PH Home Nursing Services · Updates Management
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 mb-5 rounded-xl text-sm font-medium bg-[var(--danger-tint)] text-[var(--danger)] border-l-4 border-l-[var(--danger)] border border-[var(--line)]"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@homenursingservice.in"
              className="w-full h-11 px-3.5 rounded-xl bg-[var(--surface)] text-base text-[var(--ink)] placeholder:text-[var(--ink-muted)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 px-3.5 rounded-xl bg-[var(--surface)] text-base text-[var(--ink)] placeholder:text-[var(--ink-muted)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ minHeight: 48 }}
            className="btn-primary w-full mt-2 shadow-[var(--shadow-rest)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--line)] text-center">
          <Link
            href="/"
            className="text-xs text-[var(--ink-muted)] hover:text-[var(--blue)] hover:underline"
          >
            ← Back to public website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--bg)]"
    >
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl p-8 border border-[var(--line)] text-center text-sm text-[var(--ink-muted)]">
            Loading login form...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
