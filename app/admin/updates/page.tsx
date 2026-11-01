'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatusChip } from '@/components/Chip';

interface UpdateItem {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}

export default function AdminUpdatesListPage() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchUpdates = async () => {
    setLoading(true);
    setError('');
    try {
      const url = filter === 'all' ? '/api/admin/updates' : `/api/admin/updates?status=${filter}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to load updates');
      }
      const data = await res.json();
      setUpdates(data.items || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const url = filter === 'all' ? '/api/admin/updates' : `/api/admin/updates?status=${filter}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load updates');
        const data = await res.json();
        if (!ignore) setUpdates(data.items || []);
      } catch (err: unknown) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Could not load updates');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [filter]);

  const handleTogglePublish = async (item: UpdateItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    setActionLoadingId(item._id);
    try {
      const res = await fetch(`/api/admin/updates/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await fetchUpdates();
      } else {
        alert('Could not update status. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (item: UpdateItem) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${item.title}"?`)) {
      return;
    }
    setActionLoadingId(item._id);
    try {
      const res = await fetch(`/api/admin/updates/${item._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchUpdates();
      } else {
        alert('Failed to delete post.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight">
            Care Guide Updates
          </h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Publish advice, service announcements, and care guides for Bengaluru families.
          </p>
        </div>

        <Link
          href="/admin/updates/new"
          className="btn-primary self-start sm:self-auto shadow-[var(--shadow-rest)]"
          style={{ height: 44, paddingInline: 20, fontSize: 14 }}
        >
          <span className="text-lg leading-none font-bold" aria-hidden="true">+</span>
          <span>New update</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3 text-sm">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[var(--surface)] text-[var(--plum)] shadow-xs border border-[var(--line)] font-semibold'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'published'
              ? 'bg-[var(--surface)] text-[var(--plum)] shadow-xs border border-[var(--line)] font-semibold'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'draft'
              ? 'bg-[var(--surface)] text-[var(--plum)] shadow-xs border border-[var(--line)] font-semibold'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl text-sm font-medium bg-[var(--danger-tint)] text-[var(--danger)] border-l-4 border-l-[var(--danger)] border border-[var(--line)]"
        >
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-sm text-[var(--ink-muted)]">
          <span className="inline-block w-6 h-6 border-2 border-[var(--plum)]/30 border-t-[var(--plum)] rounded-full animate-spin mb-2" />
          <p>Loading updates...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && updates.length === 0 && (
        <div className="bg-[var(--surface)] rounded-2xl p-8 sm:p-12 border border-[var(--line)] text-center max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[var(--plum-tint)] text-[var(--plum)] flex items-center justify-center mx-auto mb-3 text-xl font-bold">
            ✍️
          </div>
          <h2 className="text-lg font-semibold text-[var(--ink)] mb-1">
            No updates found
          </h2>
          <p className="text-sm text-[var(--ink-muted)] mb-6">
            {filter === 'all'
              ? "You haven't written any updates yet. Tap 'New update' to create your first article."
              : `No posts with status '${filter}'.`}
          </p>
          <Link
            href="/admin/updates/new"
            className="btn-primary inline-flex shadow-[var(--shadow-rest)]"
            style={{ height: 44, paddingInline: 20, fontSize: 14 }}
          >
            Create first update
          </Link>
        </div>
      )}

      {/* Updates List */}
      {!loading && updates.length > 0 && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] shadow-[var(--shadow-rest)] divide-y divide-[var(--line)] overflow-hidden">
          {updates.map((item) => (
            <div
              key={item._id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--bg)]/50 transition-colors"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <StatusChip status={item.status} />
                  <span className="text-xs text-[var(--ink-muted)]">
                    {item.publishedAt
                      ? `Published ${new Date(item.publishedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}`
                      : item.updatedAt
                      ? `Updated ${new Date(item.updatedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}`
                      : 'Draft'}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-semibold text-[var(--ink)] truncate">
                  <Link
                    href={`/admin/updates/${item._id}`}
                    className="hover:text-[var(--plum)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--blue)] rounded-sm"
                  >
                    {item.title}
                  </Link>
                </h2>

                <p className="text-xs text-[var(--ink-muted)] font-mono truncate">
                  /updates/{item.slug}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                {item.status === 'published' && (
                  <Link
                    href={`/updates/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--blue)] hover:bg-[var(--blue-tint)] transition-colors"
                  >
                    View ↗
                  </Link>
                )}

                <Link
                  href={`/admin/updates/${item._id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--ink)] bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-colors"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleTogglePublish(item)}
                  disabled={actionLoadingId === item._id}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--plum)] hover:bg-[var(--plum-tint)] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoadingId === item._id
                    ? 'Updating...'
                    : item.status === 'published'
                    ? 'Unpublish'
                    : 'Publish'}
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  disabled={actionLoadingId === item._id}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger-tint)] transition-colors cursor-pointer disabled:opacity-50"
                  aria-label={`Delete ${item.title}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
