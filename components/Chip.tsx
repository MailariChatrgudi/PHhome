import React from 'react';

export type GroupAccent = 'blue' | 'plum' | 'amber' | 'green';

export interface EyebrowChipProps {
  children: React.ReactNode;
  className?: string;
}

export interface CategoryChipProps {
  label: string;
  groupAccent?: GroupAccent;
  className?: string;
}

export interface StatusChipProps {
  status: 'draft' | 'published';
  className?: string;
}

/**
 * Eyebrow chip: --plum-tint fill, --plum text 13px / 600, small dot, no outline.
 */
export function EyebrowChip({ children, className = '' }: EyebrowChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-semibold rounded-full select-none ${className}`}
      style={{
        backgroundColor: 'var(--plum-tint)',
        color: 'var(--plum)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: 'var(--plum)' }}
        aria-hidden="true"
      />
      <span>{children}</span>
    </span>
  );
}

/**
 * Category chip on images: white fill, --ink text, 8px dot in the group colour.
 */
export function CategoryChip({ label, groupAccent = 'plum', className = '' }: CategoryChipProps) {
  const getDotColor = () => {
    switch (groupAccent) {
      case 'blue':
        return 'var(--blue)';
      case 'amber':
        return 'var(--amber)';
      case 'green':
        return 'var(--green)';
      case 'plum':
      default:
        return 'var(--plum)';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-semibold shadow-[var(--shadow-rest)] select-none ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--ink)',
      }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: getDotColor() }}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}

/**
 * Status chip (Admin / status badges): tint fill, icon + text.
 * Draft: --blue-tint with blue text and a dot
 * Published: --green-tint with --ink text and a green dot
 */
export function StatusChip({ status, className = '' }: StatusChipProps) {
  if (status === 'published') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${className}`}
        style={{
          backgroundColor: 'var(--green-tint)',
          color: 'var(--ink)',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: 'var(--green)' }}
          aria-hidden="true"
        />
        Published
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${className}`}
      style={{
        backgroundColor: 'var(--blue-tint)',
        color: 'var(--blue)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: 'var(--blue)' }}
        aria-hidden="true"
      />
      Draft
    </span>
  );
}

