import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCard from '@/components/ServiceCard';
import CustomerForm from '@/components/CustomerForm';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import { EyebrowChip } from '@/components/Chip';
import { getService, servicesSlugs, services } from '@/content/services';
import { site } from '@/content/site';
import { breadcrumbSchema, faqPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicesSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: `${service.name} in Bengaluru`,
    description: service.metaDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  // Find the 2 related services
  const relatedServices = service.relatedSlugs
    .map((rSlug) => services.find((s) => s.slug === rSlug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      {/* JSON-LD: BreadcrumbList + FAQPage (features.md §1.3) */}
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Services', href: '/services' },
          { name: service.name, href: `/services/${service.slug}` },
        ])}
      />
      {service.faqs.length > 0 && (
        <JsonLd data={faqPageSchema(service.faqs)} />
      )}

      {/* Page Header on --plum-tint (spec: Phase 4) */}
      <div className="bg-[var(--plum-tint)] border-b border-[var(--line)] py-8 sm:py-12">
        <div className="container-content">
          <Breadcrumb
            items={[
              { label: 'Services', href: '/services' },
              { label: service.name },
            ]}
          />

          <div className="max-w-3xl mt-5">
            <EyebrowChip className="mb-3">
              {service.categoryTag || 'Home Care'}
            </EyebrowChip>
            <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
              {service.name} in Bengaluru
            </h1>
            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
              {service.intro}
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (design.md §7) */}
      <div className="container-content section-py">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Comprehensive Copy (400+ words) */}
          <div className="lg:col-span-7 space-y-12">
            {/* 1. What's Included */}
            <section aria-labelledby="included-heading">
              <h2
                id="included-heading"
                className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight mb-4 pb-2 border-b border-[var(--line)]"
              >
                What’s Included in {service.name}
              </h2>
              <ul className="space-y-3.5">
                {service.included.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-base text-[var(--ink)]">
                    <span className="w-5 h-5 rounded-full bg-[var(--plum-100)] text-[var(--plum)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 2. Who It Suits */}
            <section aria-labelledby="who-it-suits-heading">
              <h2
                id="who-it-suits-heading"
                className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight mb-3 pb-2 border-b border-[var(--line)]"
              >
                Who This Service Suits
              </h2>
              <p className="text-base text-[var(--ink-muted)] leading-relaxed">
                {service.whoItSuits}
              </p>
            </section>

            {/* 3. How It Works */}
            <section aria-labelledby="how-it-works-heading">
              <h2
                id="how-it-works-heading"
                className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight mb-3 pb-2 border-b border-[var(--line)]"
              >
                How Care Is Arranged &amp; Delivered
              </h2>
              <p className="text-base text-[var(--ink-muted)] leading-relaxed">
                {service.howItWorks}
              </p>
            </section>

            {/* 4. What to Prepare */}
            <section aria-labelledby="what-to-prepare-heading">
              <h2
                id="what-to-prepare-heading"
                className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight mb-3 pb-2 border-b border-[var(--line)]"
              >
                What to Prepare for the First Visit
              </h2>
              <div className="bg-[var(--surface)] rounded-xl p-5 sm:p-6 border border-[var(--line)] shadow-[var(--shadow-rest)]">
                <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                  {service.whatToPrepare}
                </p>
              </div>
            </section>

            {/* 5. Equipment Note (if applicable) */}
            {service.equipmentNote && (
              <section className="bg-[var(--blue-tint)] rounded-[var(--radius-card)] p-6 border-l-4 border-l-[var(--blue)] border border-[var(--line)] shadow-[var(--shadow-rest)]">
                <h3 className="text-base font-semibold text-[var(--blue-dark)] mb-1.5 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Medical Equipment Guidance
                </h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                  {service.equipmentNote}
                </p>
              </section>
            )}

            {/* 6. Frequently Asked Questions (design.md §7) */}
            {service.faqs && service.faqs.length > 0 && (
              <section aria-labelledby="faq-heading" className="pt-4">
                <h2
                  id="faq-heading"
                  className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight mb-4 pb-2 border-b border-[var(--line)]"
                >
                  Questions About {service.name}
                </h2>
                <FaqAccordion items={service.faqs} />
              </section>
            )}

            {/* 7. Related Services (2 cards) */}
            {relatedServices.length > 0 && (
              <section aria-labelledby="related-heading" className="pt-6">
                <h2
                  id="related-heading"
                  className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight mb-6 pb-2 border-b border-[var(--line)]"
                >
                  Related Care Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedServices.map((relService) => (
                    <ServiceCard key={relService.slug} service={relService} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sticky Form Card (design.md §7) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <CustomerForm sourcePage={`/services/${service.slug}`} />

            {/* Quick Call Box */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-6 border border-[var(--line)] shadow-[var(--shadow-rest)] text-center space-y-3">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Prefer to speak with our care manager?
              </p>
              <p className="text-xs text-[var(--ink-muted)]">
                Call directly for immediate assessment and nurse availability in your area.
              </p>
              <div className="pt-1 flex flex-col gap-2.5">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center justify-center gap-2 w-full h-11 bg-[var(--plum-tint)] hover:bg-[var(--plum)] text-[var(--plum)] hover:text-white font-medium rounded-full transition-colors text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call {site.phoneDisplay}
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full h-11 border border-[var(--line)] hover:border-[var(--whatsapp)] text-[var(--ink)] hover:text-[var(--whatsapp)] font-medium rounded-full transition-colors text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
