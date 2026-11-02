'use client';

import { useState } from 'react';
import { ROLES, type RoleValue } from '@/content/roles';
import { site } from '@/content/site';

interface FormState {
  name: string;
  phone: string;
  email: string;
  role: RoleValue | '';
  website: string; // honeypot
}

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  role?: string;
}

/**
 * ApplicantForm — spec: features.md §2.2 & design.md §5 & Phase 1 Tokens
 * Surface card, 24px padding, stacked fields with labels above inputs,
 * Native <select> for roles from content/roles.ts with 1.5px --field-border,
 * Button "Apply now" (--plum, pill), honeypot, privacy notice.
 */
export default function ApplicantForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    role: '',
    website: '',
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    const nameTrimmed = form.name.trim();
    if (!nameTrimmed) {
      errs.name = 'Please enter your full name';
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

    const emailTrimmed = form.email.trim();
    if (!emailTrimmed) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!form.role) {
      errs.role = 'Please select the role you are applying for';
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
      const res = await fetch('/api/query/applicant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error?.fields) {
          setErrors(data.error.fields);
        }
        const errorMsg =
          data.error?.message ||
            (res.status === 429
              ? 'Too many applications submitted recently. Please contact our team directly.'
              : res.status === 502
              ? 'Email delivery temporarily unavailable. Please contact us via Phone or WhatsApp.'
              : 'Could not deliver your application. Please call us directly.');
        setStatus('error');
        setErrorMessage(errorMsg);
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage(
        navigator.onLine === false
          ? 'Network connection lost. Please call us directly to apply.'
          : 'Could not deliver your application. Please call us directly.'
      );
    }
  };

  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-card)] border border-[var(--line)] shadow-[var(--shadow-rest)] overflow-hidden">
      {/* 4px top brand gradient accent */}
      <div
        className="h-1 w-full shrink-0"
        style={{ background: 'var(--grad-brand)' }}
      />

      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight">
            Caregiver Application Form
          </h3>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Join our Bengaluru home healthcare and caregiver team.
          </p>
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
            Application Submitted
          </h4>
          <p className="text-sm text-[var(--ink-muted)] max-w-sm mx-auto leading-relaxed">
            Thank you, {form.name}. Our recruitment team will review your application
            and contact you at <strong className="text-[var(--ink)]">{form.phone}</strong> or{' '}
            <strong className="text-[var(--ink)]">{form.email}</strong> to discuss current openings
            and request verification documents.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setForm({ name: '', phone: '', email: '', role: '', website: '' });
              }}
              className="text-sm text-[var(--blue)] font-medium hover:underline"
            >
              Submit another application →
            </button>
          </div>
        </div>
      ) : (
        <form
          action="/api/query/applicant"
          method="POST"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* Honeypot field — hidden from humans and autofill */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="applicant-website">Leave this field blank</label>
            <input
              id="applicant-website"
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
              htmlFor="applicant-name"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Full Name <span className="text-[var(--plum)]" aria-hidden="true">*</span>
            </label>
            <input
              id="applicant-name"
              name="name"
              type="text"
              required
              maxLength={80}
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              aria-describedby={errors.name ? 'applicant-name-error' : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
              className={`w-full h-12 px-4 rounded-lg bg-[var(--surface)] border ${
                errors.name
                  ? 'border-[var(--danger)] bg-[var(--danger-tint)] ring-2 ring-[var(--danger)]/20'
                  : 'border-[var(--field-border)]'
              } text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 transition-all text-base`}
            />
            {errors.name && (
              <p id="applicant-name-error" className="mt-1.5 text-xs font-semibold text-[var(--danger)] flex items-center gap-1.5">
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
              htmlFor="applicant-phone"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Mobile Number <span className="text-[var(--plum)]" aria-hidden="true">*</span>
            </label>
            <input
              id="applicant-phone"
              name="phone"
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              aria-describedby={errors.phone ? 'applicant-phone-error' : undefined}
              aria-invalid={errors.phone ? 'true' : 'false'}
              className={`w-full h-12 px-4 rounded-lg bg-[var(--surface)] border ${
                errors.phone
                  ? 'border-[var(--danger)] bg-[var(--danger-tint)] ring-2 ring-[var(--danger)]/20'
                  : 'border-[var(--field-border)]'
              } text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 transition-all text-base`}
            />
            {errors.phone && (
              <p id="applicant-phone-error" className="mt-1.5 text-xs font-semibold text-[var(--danger)] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="applicant-email"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Email Address <span className="text-[var(--plum)]" aria-hidden="true">*</span>
            </label>
            <input
              id="applicant-email"
              name="email"
              type="email"
              required
              placeholder="e.g. priya@example.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              aria-describedby={errors.email ? 'applicant-email-error' : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
              className={`w-full h-12 px-4 rounded-lg bg-[var(--surface)] border ${
                errors.email
                  ? 'border-[var(--danger)] bg-[var(--danger-tint)] ring-2 ring-[var(--danger)]/20'
                  : 'border-[var(--field-border)]'
              } text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 transition-all text-base`}
            />
            {errors.email && (
              <p id="applicant-email-error" className="mt-1.5 text-xs font-semibold text-[var(--danger)] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Role Native Select */}
          <div>
            <label
              htmlFor="applicant-role"
              className="block text-sm font-medium text-[var(--ink)] mb-1.5"
            >
              Role You Are Applying For <span className="text-[var(--plum)]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                id="applicant-role"
                name="role"
                required
                value={form.role}
                onChange={(e) => {
                  setForm({ ...form, role: e.target.value as RoleValue });
                  if (errors.role) setErrors({ ...errors, role: undefined });
                }}
                aria-describedby={errors.role ? 'applicant-role-error' : undefined}
                aria-invalid={errors.role ? 'true' : 'false'}
                className={`w-full h-12 px-4 pr-10 rounded-lg bg-[var(--surface)] border ${
                  errors.role
                    ? 'border-[var(--danger)] bg-[var(--danger-tint)] ring-2 ring-[var(--danger)]/20'
                    : 'border-[var(--field-border)]'
                } text-[var(--ink)] focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 transition-all text-base appearance-none cursor-pointer`}
              >
                <option value="" disabled>
                  Select a role
                </option>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--ink-muted)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            {errors.role && (
              <p id="applicant-role-error" className="mt-1.5 text-xs font-semibold text-[var(--danger)] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.role}
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
                You can reach our careers desk immediately by calling{' '}
                <a
                  href={`tel:${site.phone}`}
                  className="font-semibold text-[var(--plum)] hover:underline"
                >
                  {site.phoneDisplay}
                </a>{' '}
                or messaging on{' '}
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
            disabled={status === 'submitting'}
            style={{ minHeight: 48 }}
            className="btn-primary w-full shadow-[var(--shadow-rest)] transition-all duration-150 focus:outline-none focus:ring-3 focus:ring-[var(--blue)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            {status === 'submitting' ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting application...
              </>
            ) : (
              'Apply now'
            )}
          </button>

          {/* Privacy & No-Upload Notice */}
          <p className="text-xs text-center text-[var(--ink-muted)] leading-relaxed pt-1">
            Your application is emailed directly to our team. We do not store your data on this website.
          </p>
        </form>
      )}
      </div>
    </div>
  );
}
