import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import { EyebrowChip } from '@/components/Chip';
import { site } from '@/content/site';
import { breadcrumbSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description:
    'Learn about PH Home Nursing Services in Bengaluru — our compassionate approach to skilled home nursing, elderly care, and dedicated patient assistance.',
  path: '/about',
});

const serviceAreas = [
  'Kanteerava Nagar',
  'Yeshwanthpur',
  'Malleshwaram',
  'Rajajinagar',
  'Hebbal',
  'Indiranagar',
  'Koramangala',
  'Jayanagar',
  'Whitefield',
  'All Bengaluru Zones',
];

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD: BreadcrumbList */}
      <JsonLd data={breadcrumbSchema([{ name: 'About Us', href: '/about' }])} />

      {/* Header on --plum-tint (spec: Phase 4) */}
      <div className="bg-[var(--plum-tint)] border-b border-[var(--line)] py-8 sm:py-12">
        <div className="container-content">
          <Breadcrumb items={[{ label: 'About Us' }]} />

          <div className="max-w-3xl mt-5">
            <EyebrowChip className="mb-3">Our Story &amp; Purpose</EyebrowChip>
            <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
              Dedicated Home Healthcare for Bengaluru Families
            </h1>
            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
              At {site.name}, we believe recovery and aging are best supported in familiar surroundings, surrounded by family warmth. We provide professional home nursing, compassionate elderly care, and patient bedside assistance across Bengaluru.
            </p>
          </div>
        </div>
      </div>

      <div className="container-content section-py">
        {/* Story & Philosophy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16">
          <div className="lg:col-span-7 space-y-6 text-base text-[var(--ink-muted)] leading-relaxed">
            <h2 className="text-2xl font-semibold text-[var(--ink)] tracking-tight">
              Caring for Loved Ones with Empathy and Professionalism
            </h2>
            <p>
              When a family member undergoes surgery, receives a life-changing diagnosis, or experiences the gradual limitations of aging, families often face immense emotional and logistical stress. Hospital stays can be exhausting, and navigating post-discharge care at home without clinical guidance is daunting.
            </p>
            <p>
              {site.name} was established to bridge this vital gap. Our team works hand-in-hand with treating doctors, hospital discharge teams, and families to bring skilled clinical procedures, safe mobility support, and daily companionship into the patient’s home.
            </p>
            <p>
              We take pride in building genuine relationships with the families we serve. We do not treat care as a transaction; we treat every patient with the dignity, patience, and warmth we would want for our own parents and children.
            </p>

            <div className="pt-4 border-t border-[var(--line)]">
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-3">
                What Sets Our Care Apart
              </h3>
              <ul className="space-y-3.5 text-[var(--ink)]">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[var(--plum-100)] text-[var(--plum)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>Doctor-Guided Protocols:</strong> Our nurses strictly adhere to prescriptions and clinical discharge instructions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[var(--plum-100)] text-[var(--plum)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>Attentive Family Updates:</strong> Regular, transparent communication with family members regarding appetite, vitals, and recovery progress.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[var(--plum-100)] text-[var(--plum)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>Flexible Care Timings:</strong> From single clinical dressing visits to full 12-hour day/night shifts and 24-hour live-in caretakers.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Info Box: Verified Business Facts */}
          <div className="lg:col-span-5 bg-[var(--surface)] rounded-2xl p-6 sm:p-8 border border-[var(--line)] shadow-[var(--shadow-rest)] space-y-6">
            <h3 className="text-xl font-semibold text-[var(--ink)] tracking-tight pb-3 border-b border-[var(--line)]">
              Our Care Centre
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-semibold mb-1">
                  Office Location
                </p>
                <p className="text-[var(--ink)] font-medium leading-snug">
                  {site.address.streetAddress}, {site.address.addressLocality}, {site.address.addressRegion} {site.address.postalCode}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-semibold mb-1">
                  Enquiry Hours
                </p>
                <p className="text-[var(--ink)] font-medium">
                  24 Hours a Day · 7 Days a Week
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-semibold mb-1">
                  Direct Contact
                </p>
                <p className="text-[var(--ink)] font-medium">
                  Phone:{' '}
                  <a href={`tel:${site.phone}`} className="text-[var(--plum)] hover:underline font-semibold">
                    {site.phoneDisplay}
                  </a>
                </p>
                <p className="text-[var(--ink)] font-medium mt-1">
                  Email:{' '}
                  <a href={`mailto:${site.email}`} className="text-[var(--blue)] hover:underline">
                    {site.email}
                  </a>
                </p>
              </div>

              {/* Service Areas as Chips */}
              <div>
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--ink-muted)] font-semibold mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Areas Served in Bengaluru
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-block px-2.5 py-1 text-xs rounded-full bg-[var(--blue-tint)] text-[var(--blue)] font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full h-12 bg-[var(--plum)] hover:bg-[var(--plum-dark)] text-white font-medium rounded-full transition-colors text-sm shadow-xs"
              >
                Contact our team →
              </Link>
            </div>
          </div>
        </div>

        {/* Core Values Strip: 3 cards with 44px tinted icon circles */}
        <section className="bg-[var(--plum-tint)] rounded-2xl p-8 sm:p-12 border border-[var(--line)] shadow-[var(--shadow-rest)]">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight text-center mb-8">
            The Principles Guiding Our Care
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--line)] shadow-[var(--shadow-rest)]">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
                style={{
                  backgroundColor: 'var(--plum-100)',
                  color: 'var(--plum)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Respect &amp; Dignity</h3>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Every patient is treated with deep respect, honouring their personal autonomy, privacy, and individual preferences.
              </p>
            </div>

            <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--line)] shadow-[var(--shadow-rest)]">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
                style={{
                  backgroundColor: 'var(--blue-100)',
                  color: 'var(--blue)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Hygiene &amp; Safety</h3>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Rigorous infection control protocols, sterile technique in dressings, and proactive fall prevention in the home.
              </p>
            </div>

            <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--line)] shadow-[var(--shadow-rest)]">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
                style={{
                  backgroundColor: 'var(--green-tint)',
                  color: 'var(--whatsapp)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Honesty &amp; Transparency</h3>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Clear schedules, honest consultation regarding patient needs, and direct communication without hidden charges.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
