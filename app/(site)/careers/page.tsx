import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ApplicantForm from '@/components/ApplicantForm';
import JsonLd from '@/components/JsonLd';
import { EyebrowChip } from '@/components/Chip';
import { ROLES } from '@/content/roles';
import { breadcrumbSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Nursing & Caregiver Jobs in Bengaluru',
  description:
    'Looking for nursing or caregiver work in Bengaluru? Apply to join PH Home Nursing Services. Fill out a simple form — no CV upload needed.',
  path: '/careers',
});

export default function CareersPage() {
  return (
    <>
      {/* JSON-LD: BreadcrumbList — no JobPosting (features.md §1.3) */}
      <JsonLd data={breadcrumbSchema([{ name: 'Careers', href: '/careers' }])} />

      {/* Page Header on --plum-tint (spec: Phase 4) */}
      <div className="bg-[var(--plum-tint)] border-b border-[var(--line)] py-8 sm:py-12">
        <div className="container-content">
          <Breadcrumb items={[{ label: 'Careers' }]} />

          <div className="max-w-3xl mt-5">
            <EyebrowChip className="mb-3">Join Our Care Team</EyebrowChip>
            <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
              Careers: Nursing and Caregiver Jobs in Bengaluru
            </h1>
            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
              We are continuously looking for skilled, compassionate nurses and dedicated patient attendants who take pride in caring for individuals and seniors in home and hospital settings across Bengaluru.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (design.md §7) */}
      <div className="container-content section-py">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Roles list as plain chips + How it works */}
          <div className="lg:col-span-5 space-y-8">
            {/* Roles List */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--line)] shadow-[var(--shadow-rest)] space-y-4">
              <h2 className="text-lg font-semibold text-[var(--ink)]">
                Roles We Hire For
              </h2>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                We welcome applications from trained healthcare professionals and experienced attendants for the following positions:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {ROLES.map((role) => (
                  <span
                    key={role.value}
                    className="inline-block px-3 py-1.5 text-xs font-medium text-[var(--ink)] bg-[var(--bg)] border border-[var(--line)] rounded-full"
                  >
                    {role.label}
                  </span>
                ))}
              </div>
            </div>

            {/* How It Works (design.md §7: 1 Apply, 2 We contact you, 3 We ask for documents) */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--line)] shadow-[var(--shadow-rest)] space-y-5">
              <h2 className="text-lg font-semibold text-[var(--ink)] pb-2 border-b border-[var(--line)]">
                How the Application Process Works
              </h2>

              <div className="space-y-4 text-sm text-[var(--ink)]">
                <div className="flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                    style={{ background: 'var(--grad-brand)' }}
                  >
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">Apply Online</p>
                    <p className="text-xs text-[var(--ink-muted)] leading-relaxed mt-0.5">
                      Fill out the short form with your name, phone number, email, and the role you are interested in. No CV or file upload required.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                    style={{ background: 'var(--grad-brand)' }}
                  >
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">We Contact You</p>
                    <p className="text-xs text-[var(--ink-muted)] leading-relaxed mt-0.5">
                      Our team calls you for a short phone discussion regarding your experience, location preference, and shift availability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                    style={{ background: 'var(--grad-brand)' }}
                  >
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">We Ask for Documents</p>
                    <p className="text-xs text-[var(--ink-muted)] leading-relaxed mt-0.5">
                      If there is a mutual fit, we invite you to our Bengaluru office with your identity proof, training certificates, and references before onboarding.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicant Privacy & Transparency Note */}
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink-muted)] leading-relaxed space-y-1">
              <p className="font-semibold text-[var(--ink)]">Personal Data Policy</p>
              <p>
                Your personal information is sent directly to our hiring team via encrypted email and is never sold, shared with third parties, or stored in a public website database.
              </p>
            </div>
          </div>

          {/* Right Column: Applicant Form Card */}
          <div className="lg:col-span-7">
            <ApplicantForm />
          </div>
        </div>
      </div>
    </>
  );
}
