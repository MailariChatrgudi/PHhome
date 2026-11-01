import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCard from '@/components/ServiceCard';
import CustomerForm from '@/components/CustomerForm';
import JsonLd from '@/components/JsonLd';
import { EyebrowChip } from '@/components/Chip';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Home Care & Nursing Services in Bengaluru',
  description:
    'Explore professional home nursing, elderly care, post-hospital recovery, and caregiver services across Bengaluru. Transparent guidance and reliable care.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      {/* JSON-LD: BreadcrumbList (features.md §1.3) */}
      <JsonLd data={breadcrumbSchema([{ name: 'Services', href: '/services' }])} />

      {/* Header on --plum-tint (spec: Phase 4) */}
      <div className="bg-[var(--plum-tint)] border-b border-[var(--line)] py-8 sm:py-12">
        <div className="container-content">
          <Breadcrumb items={[{ label: 'Services' }]} />

          <div className="max-w-3xl mt-5">
            <EyebrowChip className="mb-3">Our Specialised Services</EyebrowChip>
            <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
              Home Nursing &amp; Caregiver Services in Bengaluru
            </h1>
            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
              Every patient and family has unique needs. Whether you require skilled clinical nursing following hospital discharge, daily personal care for an aging parent, or 24/7 live-in support, our trained professionals deliver attentive healthcare directly to your home.
            </p>
          </div>
        </div>
      </div>

      <div className="container-content section-py">
        {/* Services Grid (3x3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        {/* Medical Equipment Assistance Section (features.md §1.1) */}
        <section className="bg-[var(--blue-tint)] rounded-2xl p-8 sm:p-10 border border-[var(--line)] shadow-[var(--shadow-rest)] mb-16">
          <div className="max-w-3xl">
            <EyebrowChip className="mb-3">Equipment Support</EyebrowChip>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight mb-3">
              Medical Equipment Rental &amp; Setup Assistance
            </h2>
            <p className="text-base text-[var(--ink-muted)] leading-relaxed mb-6">
              Recovering at home often requires temporary medical devices. While we do not operate an online retail catalogue, our care coordinators assist families in sourcing, delivering, and correctly installing verified medical equipment in Bengaluru, including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[var(--ink)]">
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--line)] shadow-[var(--shadow-rest)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--blue-100)] text-[var(--blue)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-[var(--ink)] block">Hospital Beds</strong>
                  <span className="text-[var(--ink-muted)] text-xs">Manual and motorized Fowler beds with side safety rails</span>
                </div>
              </div>
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--line)] shadow-[var(--shadow-rest)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--blue-100)] text-[var(--blue)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-[var(--ink)] block">Oxygen Support</strong>
                  <span className="text-[var(--ink-muted)] text-xs">Medical oxygen concentrators and portable cylinders</span>
                </div>
              </div>
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--line)] shadow-[var(--shadow-rest)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--blue-100)] text-[var(--blue)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-[var(--ink)] block">Pressure Relief</strong>
                  <span className="text-[var(--ink-muted)] text-xs">Anti-decubitus air mattresses (bubble &amp; tubular)</span>
                </div>
              </div>
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--line)] shadow-[var(--shadow-rest)] flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--blue-100)] text-[var(--blue)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <strong className="text-[var(--ink)] block">Mobility Aids</strong>
                  <span className="text-[var(--ink-muted)] text-xs">Standard &amp; commode wheelchairs, walkers, and IV stands</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-[var(--ink-muted)] mt-5">
              Need guidance on equipment setup for your patient?{' '}
              <Link href="/contact" className="text-[var(--blue)] font-semibold hover:underline">
                Speak to our team
              </Link>{' '}
              during your care consultation.
            </p>
          </div>
        </section>

        {/* Bottom Consultation Form Section */}
        <section className="bg-[var(--plum-tint)] rounded-2xl p-8 sm:p-12 border border-[var(--line)] shadow-[var(--shadow-rest)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <EyebrowChip>Direct Guidance</EyebrowChip>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight">
                Unsure Which Care Level You Need?
              </h2>
              <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                Choosing between a nurse, an attendant, or a live-in caretaker can be challenging. Tell us about the patient’s condition and our care manager will guide you on the most suitable, cost-effective arrangement.
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--plum)] hover:text-[var(--plum-dark)] underline"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Or call {site.phoneDisplay} anytime
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <CustomerForm sourcePage="/services" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
