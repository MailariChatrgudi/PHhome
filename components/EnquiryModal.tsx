'use client';

import { useEffect, useRef } from 'react';
import CustomerForm from '@/components/CustomerForm';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * EnquiryModal — wraps CustomerForm in a full-screen backdrop overlay.
 * Opens automatically after delay (controlled by parent) and via CTA button.
 * Pressing Escape or clicking the backdrop closes it.
 * Body scroll is locked while open.
 */
export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape key handler + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    // Focus the dialog for accessibility
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send an enquiry"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(10, 6, 14, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'enquiry-modal-fade-in 220ms ease both',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Dialog card */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 560,
          maxHeight: '90dvh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-card)',
          backgroundColor: 'var(--bg)',
          boxShadow: '0 24px 64px rgba(74,11,42,0.18), 0 2px 8px rgba(0,0,0,0.12)',
          animation: 'enquiry-modal-slide-up 260ms cubic-bezier(0.16,1,0.3,1) both',
          outline: 'none',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
          suppressHydrationWarning
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid var(--line)',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 150ms, color 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--plum-tint)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--plum)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-muted)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Modal header
        <div
          style={{
            padding: '20px 24px 0',
            borderBottom: '1px solid var(--line)',
            marginBottom: 0,
            paddingBottom: 16,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 4 }}>
            Get in touch
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
            Send Us an Enquiry
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ink-muted)', marginTop: 4 }}>
            We&apos;ll respond within a few hours — no advance deposit needed.
          </p>
        </div> */}

        {/* Form */}
        <div style={{ padding: '0 0 8px' }}>
          <CustomerForm sourcePage="modal" className="modal-form" />
        </div>
      </div>

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes enquiry-modal-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes enquiry-modal-slide-up {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

