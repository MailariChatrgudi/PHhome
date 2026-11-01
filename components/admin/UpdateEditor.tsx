'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface CoverImageData {
  url: string;
  publicId?: string;
  alt?: string;
}

interface SeoData {
  title?: string;
  description?: string;
}

export interface UpdateFormData {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: CoverImageData;
  seo?: SeoData;
  status: 'draft' | 'published';
  publishedAt?: string;
}

interface UpdateEditorProps {
  initialData?: UpdateFormData;
  isNew?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function UpdateEditor({ initialData, isNew = false }: UpdateEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverUrl, setCoverUrl] = useState(initialData?.coverImage?.url || '');
  const [coverAlt, setCoverAlt] = useState(initialData?.coverImage?.alt || '');
  const [coverPublicId, setCoverPublicId] = useState(initialData?.coverImage?.publicId || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || '');
  const [seoDesc, setSeoDesc] = useState(initialData?.seo?.description || '');

  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-slug from title if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual || !slug) {
      setSlug(slugify(val));
    }
  };

  // Markdown Toolbar inserter
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const replacement = `${before}${selected || 'text'}${after}`;
    const newContent =
      textarea.value.slice(0, start) + replacement + textarea.value.slice(end);
    setContent(newContent);
    textarea.focus();
    setTimeout(() => {
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selected ? selected.length : 4)
      );
    }, 0);
  };

  // Cloudinary Direct Signed Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      // 1. Get signature from server
      const signRes = await fetch('/api/admin/uploads/sign', { method: 'POST' });
      const signData = await signRes.json();

      if (!signData.configured) {
        setError('Cloudinary is not configured. You can paste an image URL directly below.');
        setUploadingImage(false);
        return;
      }

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();

      if (cloudData.secure_url) {
        setCoverUrl(cloudData.secure_url);
        setCoverPublicId(cloudData.public_id || '');
        if (!coverAlt) {
          setCoverAlt(title || 'Cover image');
        }
      } else {
        throw new Error(cloudData.error?.message || 'Upload failed');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Image upload failed. You can paste an image URL instead.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (targetStatus: 'draft' | 'published') => {
    setError('');
    setSuccessMsg('');

    const cleanTitle = title.trim();
    if (!cleanTitle || cleanTitle.length < 3 || cleanTitle.length > 120) {
      setError('Title must be between 3 and 120 characters.');
      return;
    }

    const cleanSlug = (slug || slugify(cleanTitle)).trim().toLowerCase();
    if (!cleanSlug) {
      setError('Please provide a URL slug.');
      return;
    }

    setSubmitting(true);

    const payload = {
      title: cleanTitle,
      slug: cleanSlug,
      excerpt: excerpt.trim() || (content ? content.slice(0, 160).replace(/[#*`\n]/g, ' ').trim() : ''),
      content,
      coverImage: {
        url: coverUrl.trim(),
        alt: coverAlt.trim() || cleanTitle,
        publicId: coverPublicId.trim(),
      },
      seo: {
        title: seoTitle.trim(),
        description: seoDesc.trim(),
      },
      status: targetStatus,
    };

    try {
      const endpoint = isNew ? '/api/admin/updates' : `/api/admin/updates/${initialData?._id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError('URL slug is already in use by another post. Please choose a different slug.');
        } else {
          setError(data.message || 'Failed to save update.');
        }
        setSubmitting(false);
        return;
      }

      setStatus(targetStatus);
      setSuccessMsg(
        targetStatus === 'published'
          ? 'Post published live successfully!'
          : 'Draft saved successfully.'
      );

      if (isNew && data._id) {
        router.push(`/admin/updates/${data._id}`);
      } else {
        router.refresh();
      }
    } catch {
      setError('Network error. Could not save update.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?._id) return;
    if (!window.confirm(`Permanently delete "${title}"? This cannot be undone.`)) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/updates/${initialData._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/updates');
      } else {
        alert('Failed to delete post.');
        setSubmitting(false);
      }
    } catch {
      alert('Network error while deleting.');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--ink-muted)] mb-1">
            <Link href="/admin/updates" className="hover:text-[var(--blue)] hover:underline">
              ← Updates
            </Link>
            <span>/</span>
            <span>{isNew ? 'Create New' : 'Edit Post'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight">
            {isNew ? 'New Care Guide Update' : title || 'Edit Update'}
          </h1>
        </div>

        {/* Status indicator & View live link */}
        <div className="flex items-center gap-3">
          {status === 'published' && slug && (
            <Link
              href={`/updates/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-semibold text-[var(--blue)] hover:underline flex items-center gap-1"
            >
              <span>View live on site</span>
              <span aria-hidden="true">↗</span>
            </Link>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--surface)] border border-[var(--line)]">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: status === 'published' ? 'var(--green)' : 'var(--blue)',
              }}
            />
            <span className="capitalize">{status}</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl text-sm font-medium bg-[var(--danger-tint)] text-[var(--danger)] border-l-4 border-l-[var(--danger)] border border-[var(--line)]"
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="p-4 rounded-xl text-sm font-medium bg-[var(--green-tint)] text-[var(--green)] border-l-4 border-l-[var(--green)] border border-[var(--line)]"
        >
          {successMsg}
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Title, Slug, Excerpt, Markdown Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="update-title" className="block text-sm font-semibold text-[var(--ink)] mb-1.5">
              Title <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              id="update-title"
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Preparing Your Home for Post-Hospital Recovery"
              className="w-full h-12 px-4 rounded-xl bg-[var(--surface)] text-lg font-semibold text-[var(--ink)] placeholder:text-[var(--ink-muted)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="update-slug" className="block text-xs font-semibold text-[var(--ink-muted)]">
                URL Slug <span className="text-[var(--danger)]">*</span>
              </label>
              <span className="text-xs text-[var(--ink-muted)]">
                Public URL: <code className="font-mono text-[var(--blue)]">/updates/{slug || '...'}</code>
              </span>
            </div>
            <input
              id="update-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setIsSlugManual(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="preparing-your-home-for-post-hospital-recovery"
              className="w-full h-10 px-3.5 rounded-xl bg-[var(--surface)] text-sm font-mono text-[var(--ink)] placeholder:text-[var(--ink-muted)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="update-excerpt" className="block text-sm font-semibold text-[var(--ink)] mb-1.5">
              Excerpt / Summary
            </label>
            <textarea
              id="update-excerpt"
              rows={2}
              maxLength={250}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for card previews and search engines (defaults to first 160 characters of body)..."
              className="w-full p-3.5 rounded-xl bg-[var(--surface)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] leading-relaxed resize-y"
            />
          </div>

          {/* Markdown Content with Toolbar & Preview */}
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] shadow-[var(--shadow-rest)] overflow-hidden">
            {/* Toolbar & Tabs Header */}
            <div className="p-3 bg-[var(--bg)] border-b border-[var(--line)] flex flex-wrap items-center justify-between gap-2">
              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => insertText('## ')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-[var(--surface)] text-[var(--ink)] border border-transparent hover:border-[var(--line)] transition-colors"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertText('### ')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-[var(--surface)] text-[var(--ink)] border border-transparent hover:border-[var(--line)] transition-colors"
                  title="Heading 3"
                >
                  H3
                </button>
                <div className="w-[1px] h-4 bg-[var(--line)] mx-1" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => insertText('**', '**')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-[var(--surface)] text-[var(--ink)] border border-transparent hover:border-[var(--line)] transition-colors"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertText('*', '*')}
                  className="px-2.5 py-1 text-xs italic rounded-lg hover:bg-[var(--surface)] text-[var(--ink)] border border-transparent hover:border-[var(--line)] transition-colors"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertText('- ')}
                  className="px-2.5 py-1 text-xs rounded-lg hover:bg-[var(--surface)] text-[var(--ink)] border border-transparent hover:border-[var(--line)] transition-colors"
                  title="Bullet list"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => insertText('1. ')}
                  className="px-2.5 py-1 text-xs rounded-lg hover:bg-[var(--surface)] text-[var(--ink)] border border-transparent hover:border-[var(--line)] transition-colors"
                  title="Numbered list"
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() => insertText('[', '](https://)')}
                  className="px-2.5 py-1 text-xs rounded-lg hover:bg-[var(--surface)] text-[var(--ink)] border border-transparent hover:border-[var(--line)] transition-colors"
                  title="Link"
                >
                  🔗 Link
                </button>
              </div>

              {/* Mobile / View Tabs */}
              <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-xl border border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'write'
                      ? 'bg-[var(--plum)] text-white'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-[var(--plum)] text-white'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {/* Editor Textarea vs Live Preview */}
            <div className="p-4 sm:p-6 min-h-[360px]">
              {activeTab === 'write' ? (
                <textarea
                  ref={textareaRef}
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your guide using Markdown... Use the toolbar above to add headings, bold text, lists, and links."
                  className="w-full h-full min-h-[340px] text-base text-[var(--ink)] font-sans leading-relaxed focus:outline-none resize-y placeholder:text-[var(--ink-muted)]"
                />
              ) : (
                <div className="prose max-w-none text-base text-[var(--ink)] leading-relaxed space-y-4">
                  {content.trim() ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm italic text-[var(--ink-muted)]">
                      Preview is empty. Write some Markdown in the Write tab to see it render here.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Cover Image & SEO Settings (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cover Image Upload Card */}
          <div className="bg-[var(--surface)] rounded-2xl p-5 sm:p-6 border border-[var(--line)] shadow-[var(--shadow-rest)] space-y-4">
            <h2 className="text-base font-semibold text-[var(--ink)] pb-2 border-b border-[var(--line)]">
              Cover Image (Optional)
            </h2>

            {coverUrl ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl}
                    alt={coverAlt || 'Cover image preview'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCoverUrl('');
                    setCoverPublicId('');
                  }}
                  className="text-xs font-semibold text-[var(--danger)] hover:underline"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block w-full border-2 border-dashed border-[var(--line)] hover:border-[var(--plum)] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[var(--bg)]/50">
                  <span className="text-2xl mb-1 block">📷</span>
                  <span className="text-xs font-semibold text-[var(--plum)] block">
                    {uploadingImage ? 'Uploading image...' : 'Upload cover photo'}
                  </span>
                  <span className="text-[11px] text-[var(--ink-muted)] block mt-0.5">
                    PNG, JPG, WebP up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            <div>
              <label htmlFor="cover-url" className="block text-xs font-medium text-[var(--ink-muted)] mb-1">
                Or direct Image URL
              </label>
              <input
                id="cover-url"
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-9 px-3 rounded-xl bg-[var(--surface)] text-xs text-[var(--ink)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
              />
            </div>

            <div>
              <label htmlFor="cover-alt" className="block text-xs font-medium text-[var(--ink-muted)] mb-1">
                Image Alt Text
              </label>
              <input
                id="cover-alt"
                type="text"
                value={coverAlt}
                onChange={(e) => setCoverAlt(e.target.value)}
                placeholder="Describe image for screen readers"
                className="w-full h-9 px-3 rounded-xl bg-[var(--surface)] text-xs text-[var(--ink)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
              />
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="bg-[var(--surface)] rounded-2xl p-5 sm:p-6 border border-[var(--line)] shadow-[var(--shadow-rest)] space-y-4">
            <h2 className="text-base font-semibold text-[var(--ink)] pb-2 border-b border-[var(--line)]">
              SEO Overrides (Optional)
            </h2>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="seo-title" className="text-xs font-medium text-[var(--ink-muted)]">
                  Meta Title
                </label>
                <span className="text-[11px] text-[var(--ink-muted)]">
                  {seoTitle.length}/60
                </span>
              </div>
              <input
                id="seo-title"
                type="text"
                maxLength={70}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Defaults to post title"
                className="w-full h-9 px-3 rounded-xl bg-[var(--surface)] text-xs text-[var(--ink)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="seo-desc" className="text-xs font-medium text-[var(--ink-muted)]">
                  Meta Description
                </label>
                <span className="text-[11px] text-[var(--ink-muted)]">
                  {seoDesc.length}/160
                </span>
              </div>
              <textarea
                id="seo-desc"
                rows={3}
                maxLength={170}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Defaults to excerpt or first 160 characters"
                className="w-full p-2.5 rounded-xl bg-[var(--surface)] text-xs text-[var(--ink)] border border-[var(--field-border)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Delete Danger Zone (if editing) */}
          {!isNew && (
            <div className="p-4 rounded-2xl bg-[var(--danger-tint)] border border-[var(--line)] text-center">
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="text-xs font-semibold text-[var(--danger)] hover:underline cursor-pointer disabled:opacity-50"
              >
                Permanently delete this post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar on Mobile & Desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--line)] py-3.5 px-4 sm:px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/admin/updates"
            className="text-xs sm:text-sm font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSave('draft')}
              className="px-4 sm:px-6 h-11 rounded-full text-xs sm:text-sm font-semibold text-[var(--ink)] bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--plum)] transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save draft'}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSave('published')}
              style={{ minHeight: 44 }}
              className="btn-primary px-5 sm:px-8 text-xs sm:text-sm shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : status === 'published' ? (
                'Update & publish'
              ) : (
                'Publish live'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
