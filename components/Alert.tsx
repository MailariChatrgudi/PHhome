import React from 'react';

export type AlertVariant = 'info' | 'attention' | 'success' | 'danger';

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Alert component conforming to Phase 2 specifications:
 * 4 variants with 4px solid left border, inline SVG icon (stroke 1.75),
 * optional bold title, body in --ink.
 * - info: --blue-tint background, --blue border & icon (role="status")
 * - attention: --amber-tint background, --amber border, --amber-ink icon (role="status")
 * - success: --green-tint background, --green border & icon (role="status")
 * - danger: --danger-tint background, --danger border & icon (role="alert")
 */
export default function Alert({
  variant,
  title,
  children,
  className = '',
}: AlertProps) {
  const isDanger = variant === 'danger';
  const role = isDanger ? 'alert' : 'status';

  const getAlertStyles = (): { bg: string; border: string; iconColor: string } => {
    switch (variant) {
      case 'info':
        return {
          bg: 'var(--blue-tint)',
          border: 'var(--blue)',
          iconColor: 'var(--blue)',
        };
      case 'attention':
        return {
          bg: 'var(--amber-tint)',
          border: 'var(--amber)',
          iconColor: 'var(--amber-ink)',
        };
      case 'success':
        return {
          bg: 'var(--green-tint)',
          border: 'var(--green)',
          iconColor: 'var(--green)',
        };
      case 'danger':
        return {
          bg: 'var(--danger-tint)',
          border: 'var(--danger)',
          iconColor: 'var(--danger)',
        };
    }
  };

  const { bg, border, iconColor } = getAlertStyles();

  return (
    <div
      role={role}
      className={`p-4 rounded-r-xl text-sm space-y-1.5 shadow-[var(--shadow-rest)] flex items-start gap-3 ${className}`}
      style={{
        backgroundColor: bg,
        borderLeft: `4px solid ${border}`,
        color: 'var(--ink)',
      }}
    >
      <div className="shrink-0 mt-0.5" style={{ color: iconColor }}>
        {variant === 'info' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}

        {variant === 'attention' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        )}

        {variant === 'success' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}

        {variant === 'danger' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
      </div>

      <div className="flex-1">
        {title && (
          <strong className="block font-semibold mb-0.5 leading-snug" style={{ color: 'var(--ink)' }}>
            {title}
          </strong>
        )}
        <div className="leading-relaxed" style={{ color: 'var(--ink)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

