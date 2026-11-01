import React from 'react';

/**
 * TrustStrip — spec: design.md §5.1 (D3)
 * Sits below the hero with 24px gap (no overlap with carousel controls).
 * White card, --shadow-rest, 16px radius.
 * Icons in 44px circles (--plum-100, --blue-100, --green-tint).
 * Headings in --ink 600, text in --ink-muted.
 */
export default function TrustStrip() {
  return (
    <section className="container-content my-6 pt-0" aria-label="Why families trust us">
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] shadow-[var(--shadow-rest)] p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
          {/* Fact 1: Bengaluru Coverage */}
          <div className="flex flex-col items-center text-center px-4 pt-2 md:pt-0">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-3 shrink-0"
              style={{
                backgroundColor: 'var(--plum-100)',
                color: 'var(--plum)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--ink)] text-base mb-1">
              Serving Bengaluru
            </h3>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Reliable home nursing &amp; elder care across city neighbourhoods
            </p>
          </div>

          {/* Fact 2: Trained Staff */}
          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-3 shrink-0"
              style={{
                backgroundColor: 'var(--blue-100)',
                color: 'var(--blue)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--ink)] text-base mb-1">
              Trained Caregivers &amp; Nurses
            </h3>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Qualified nurses and gentle attendants matched to your needs
            </p>
          </div>

          {/* Fact 3: 24/7 Availability */}
          <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-3 shrink-0"
              style={{
                backgroundColor: 'var(--green-tint)',
                color: 'var(--green)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[var(--ink)] text-base mb-1">
              Available 24/7 for Enquiries
            </h3>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              Direct phone and WhatsApp support when your family needs care
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

