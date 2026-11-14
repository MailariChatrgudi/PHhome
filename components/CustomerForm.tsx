'use client';

import { useState } from 'react';
import { site } from '@/content/site';
import Alert from '@/components/Alert';

interface CustomerFormProps {
  sourcePage?: string;
  className?: string;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
  website: string; // honeypot
}

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

/**
 * CustomerForm — spec: design.md §5 & Phase 1 Tokens
 * Surface card, 24px padding, fields stacked with labels above inputs,
 * 1.5px --field-border, --blue focus ring, inline errors in --danger,
 * Send request primary pill button, privacy note.
 */
export default function CustomerForm({
  sourcePage = '/',
  className = '',
}: CustomerFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    message: '',
    website: '',
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    const nameTrimmed = form.name.trim();
    if (!nameTrimmed) {
      errs.name = 'Please enter your name';
    } else if (nameTrimmed.length < 2 || nameTrimmed.length > 80) {
      errs.name = 'Name must be between 2 and 80 characters';
    }

    const phoneDigits = form.phone.replace(/[\s\-\(\)\+]/g, '');
    const cleanPhone = phoneDigits.startsWith('91') && phoneDigits.length === 12
      ? phoneDigits.slice(2)
      : phoneDigits;

    if (!cleanPhone) {
      errs.phone = 'Please enter your phone number';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (form.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errs.email = 'Please enter a valid email address';
      }
    }

    const msgTrimmed = form.message.trim();
    if (!msgTrimmed) {
      errs.message = 'Please describe your care requirement';
    } else if (msgTrimmed.length < 10) {
      errs.message = 'Message must be at least 10 characters';
    } else if (msgTrimmed.length > 1000) {
      errs.message = 'Message cannot exceed 1000 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/query/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sourcePage,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.ok || data.success)) {
        setStatus('success');
      } else {
        if (data.error?.fields) {
          setErrors(data.error.fields);
        }
        setStatus('error');
        setErrorMessage(
          data.error?.message ||
            'Could not deliver your enquiry. Please call us directly or message on WhatsApp.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        navigator.onLine === false
          ? 'Network connection lost. Please call us directly for urgent assistance.'
          : 'Could not deliver your enquiry. Please call us directly or message on WhatsApp.'
      );
    }
  };

  return (
    <div
      className={`relative bg-[var(--surface)] rounded-[var(--radius-card)] p-6 sm:p-8 border border-[var(--line)] shadow-[var(--shadow-rest)] overflow-hidden ${className}`}
    >
      {/* 4px top gradient accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'var(--grad-brand)' }}
        aria-hidden="true"
      />

      <div className="mb-4">
        <h3 className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight">
          Request Care Support
        </h3>
        <p className="text-sm text-[var(--ink-muted)] mt-1">
          Tell us about your requirement. We will call you promptly.
        </p>
      </div>

      {/* D5 Attention callout */}
      <div className="mb-5">
        <Alert variant="attention">
          Urgent? Call{' '}
          <a
            href={`tel:${site.phone}`}
            className="font-bold underline hover:opacity-85"
            style={{ color: 'var(--ink)' }}
          >
            {site.phoneDisplay}
          </a>{' '}
          instead of waiting for a reply.
        </Alert>
      </div>

      {status === 'success' ? (
        <div
          role="status"
          aria-live="polite"
          className="text-center py-8 space-y-4"
        >
          <div className="w-14 h-14 bg-[var(--green-tint)] text-[var(--green)] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-[var(--ink)]">
            Enquiry Received
          </h4>
          <p className="text-sm text-[var(--ink-muted)] max-w-sm mx-auto leading-relaxed">
            Thank you, {form.name}. Your details have been sent directly to our team.
            We will contact you shortly at{' '}
            <strong className="text-[var(--ink)]">{form.phone}</strong>.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setForm({ name: '', phone: '', email: '', message: '', website: '' });
              }}
              className="text-sm text-[var(--blue)] font-medium hover:underline"
            >
              Send another enquiry →
            </button>
          </div>
        </div>
      ) : (
        <form
          action="/api/query/customer"
          method="POST"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* Hidden metadata */}
          <input type="hidden" name="sourcePage" value={sourcePage} />

          {/* Honeypot field — hidden from humans and autofill */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="customer-website">Leave this field blank</label>
            <input
              id="customer-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              data-form-type="other"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="customer-name"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Your Name <span className="text-[var(--plum)]" aria-hidden="true">*</span>
            </label>
            <input
              id="customer-name"
              name="name"
              type="text"
              required
              maxLength={80}
              placeholder="e.g. Ramesh Kumar"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
              className={`w-full h-12 px-4 rounded-lg bg-[var(--surface)] border ${
                errors.name
                  ? 'border-[var(--danger)] bg-[var(--danger-tint)] ring-2 ring-[var(--danger)]/20'
                  : 'border-[var(--field-border)]'
              } text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 transition-all text-base`}
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs font-semibold text-[var(--danger)] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="customer-phone"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Phone Number <span className="text-[var(--plum)]" aria-hidden="true">*</span>
            </label>
            <input
              id="customer-phone"
              name="phone"
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              aria-invalid={errors.phone ? 'true' : 'false'}
              className={`w-full h-12 px-4 rounded-lg bg-[var(--surface)] border ${
                errors.phone
                  ? 'border-[var(--danger)] bg-[var(--danger-tint)] ring-2 ring-[var(--danger)]/20'
                  : 'border-[var(--field-border)]'
              } text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 transition-all text-base`}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1.5 text-xs font-semibold text-[var(--danger)] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email (Optional) */}
          <div>
            <label
              htmlFor="customer-email"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Email Address <span className="text-xs text-[var(--ink-muted)] font-normal">(Optional)</span>
            </label>
            <input
              id="customer-email"
              name="email"
              type="email"
              suppressHydrationWarning
              placeholder="e.g. yourname@gmail.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
              className={`w-full h-12 px-4 rounded-lg bg-[var(--surface)] border ${
                errors.email
                  ? 'border-[var(--danger)] bg-[var(--danger-tint)] ring-2 ring-[var(--danger)]/20'
                  : 'border-[var(--field-border)]'
              } text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 transition-all text-base`}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs font-semibold text-[var(--danger)] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Message / Care Need */}
          <div>
            <label
              htmlFor="customer-message"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              How can we help? <span className="text-[var(--plum)]" aria-hidden="true">*</span>
            </label>
            <textarea
              id="customer-message"
              name="message"
              suppressHydrationWarning
              required
              rows={4}
              maxLength={1000}
              placeholder="Describe the patient's condition, required care timings, or any specific requirements..."
              value={form.message}
              onChange={(e) => {
                setForm({ ...form, message: e.target.value });
                if (errors.message) setErrors({ ...errors, message: undefined });
              }}
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={errors.message ? 'true' : 'false'}
              className={`w-full p-4 rounded-lg bg-[var(--surface)] border ${
                errors.message
                  ? 'border-[var(--danger)] bg-[var(--danger-tint)] ring-2 ring-[var(--danger)]/20'
                  : 'border-[var(--field-border)]'
              } text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 transition-all text-base resize-none`}
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 text-xs font-semibold text-[var(--danger)] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.message}
              </p>
            )}
          </div>

          {/* Error Banner with Call / WhatsApp fallback */}
          {status === 'error' && (
            <div
              role="alert"
              className="p-4 bg-[var(--danger-tint)] border-l-4 border-[var(--danger)] rounded-r-xl text-sm text-[var(--ink)] space-y-2.5 shadow-[var(--shadow-rest)]"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--danger)] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5" aria-hidden="true">
                  !
                </span>
                <p className="font-semibold text-[var(--danger)] leading-snug">
                  {errorMessage}
                </p>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed pl-7">
                For prompt care, contact us directly: call{' '}
                <a
                  href={`tel:${site.phone}`}
                  className="font-semibold text-[var(--plum)] hover:underline"
                >
                  {site.phoneDisplay}
                </a>{' '}
                or message on{' '}
                <a
                  href={`https://wa.me/${site.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--blue)] hover:underline"
                >
                  WhatsApp
                </a>
                .
              </p>
            </div>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            suppressHydrationWarning
            disabled={status === 'submitting'}
            style={{ minHeight: 48 }}
            className="btn-primary w-full shadow-[var(--shadow-rest)] transition-all duration-150 focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            {status === 'submitting' ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending request...
              </>
            ) : (
              'Send request'
            )}
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-center text-[var(--ink-muted)] leading-relaxed pt-1">
            Your details are emailed to us and not stored on this site.
          </p>
        </form>
      )}
    </div>
  );
}
