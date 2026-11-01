import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import { faqs } from '@/content/faq';
import { site } from '@/content/site';
import { breadcrumbSchema, faqPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Clear answers to common questions about home nursing, booking, caregivers, schedules, and medical equipment assistance in Bengaluru.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <div className="container-content section-py">
      {/* JSON-LD: BreadcrumbList + FAQPage (features.md §1.3) */}
      <JsonLd data={breadcrumbSchema([{ name: 'FAQ', href: '/faq' }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      {/* Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-block px-3 py-1 text-xs font-semibold text-[var(--plum)] bg-[var(--plum-tint)] rounded-full mb-3">
          Help &amp; Answers
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
          Here are clear, straightforward answers to the questions families most frequently ask when arranging home nursing, elderly support, and caregiver services with us in Bengaluru.
        </p>
      </div>

      {/* Grouped Accordions */}
      <div className="max-w-3xl mb-16">
        <FaqAccordion items={faqs} grouped={true} />
      </div>

      {/* General Medical Disclaimer */}
      <div className="max-w-3xl bg-[var(--bg)] rounded-lg p-4 border border-[var(--line)] text-xs text-[var(--ink-muted)] mb-12">
        <strong className="text-[var(--ink)]">Please Note:</strong> Information provided on this website is for general informational purposes only and does not constitute formal medical advice. All clinical procedures are performed in accordance with orders from your treating doctor.
      </div>

      {/* Bottom Contact CTA */}
      <div className="max-w-3xl bg-[var(--plum-tint)] rounded-[var(--radius-card)] p-8 sm:p-10 border border-[var(--line)] text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)]">
          Have a Specific Question About Your Loved One?
        </h2>
        <p className="text-sm text-[var(--ink-muted)] max-w-lg mx-auto leading-relaxed">
          Every care situation is unique. Our care managers are available by phone or WhatsApp to discuss your requirements, schedules, and pricing openly.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${site.phone}`}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-[var(--plum)] hover:bg-[var(--plum-dark)] text-white font-medium rounded-full transition-colors text-sm"
          >
            <span>📞</span> Call {site.phoneDisplay}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white border border-[var(--line)] hover:border-[var(--blue)] text-[var(--ink)] font-medium rounded-full transition-colors text-sm"
          >
            Send an enquiry →
          </Link>
        </div>
      </div>
    </div>
  );
}
