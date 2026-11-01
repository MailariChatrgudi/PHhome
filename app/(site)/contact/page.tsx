import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CustomerForm from '@/components/CustomerForm';
import JsonLd from '@/components/JsonLd';
import { site } from '@/content/site';
import { breadcrumbSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { FaWhatsapp } from "react-icons/fa";
import { PiPhoneCallFill } from "react-icons/pi";

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with PH Home Nursing Services in Bengaluru. Call +91 93539 97698, WhatsApp us, or send an enquiry for prompt care assistance.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="container-content section-py">
      {/* JSON-LD: BreadcrumbList */}
      <JsonLd data={breadcrumbSchema([{ name: 'Contact Us', href: '/contact' }])} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      {/* Header */}
      <div className="max-w-3xl mb-10 sm:mb-14">
        <div className="inline-block px-3 py-1 text-xs font-semibold text-[var(--plum)] bg-[var(--plum-tint)] rounded-full mb-3">
          Get in Touch
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight leading-tight mb-4">
          Contact Our Care Team
        </h1>
        <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
          We are here to help your family navigate care options with clarity and empathy. Call us directly for immediate assistance, reach out on WhatsApp, or send us an enquiry below.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16">
        {/* Left Column: Contact details, NAP, Map, Careers link */}
        <div className="lg:col-span-5 space-y-8">
          {/* Direct Phone & WhatsApp buttons */}
          <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--line)] shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              Direct Assistance
            </h2>
            <div className="space-y-3">
              <a
                href={`tel:${site.phone}`}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--plum-tint)] hover:bg-[var(--plum)] text-[var(--plum)] hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    <PiPhoneCallFill color='#3DDC84' />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)] group-hover:text-white/80">
                      Call 24/7
                    </p>
                    <p className="text-base font-bold text-[var(--ink)] group-hover:text-white">
                      {site.phoneDisplay}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-semibold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>

              <a
                href={`https://wa.me/${site.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--blue-tint)] hover:bg-[var(--blue)] text-[var(--blue)] hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    <FaWhatsapp color='#25D366' />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)] group-hover:text-white/80">
                      Message on WhatsApp
                    </p>
                    <p className="text-base font-bold text-[var(--ink)] group-hover:text-white">
                      {site.phoneDisplay}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-semibold group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Business Details (NAP) */}
          <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--line)] space-y-5">
            <h2 className="text-lg font-semibold text-[var(--ink)] pb-2 border-b border-[var(--line)]">
              Office &amp; Service Details
            </h2>

            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--ink-muted)] mb-1">
                Office Address (Bengaluru)
              </p>
              <address className="not-italic text-sm text-[var(--ink)] leading-relaxed">
                {site.address.streetAddress}
                <br />
                {site.address.addressLocality}, {site.address.addressRegion} — {site.address.postalCode}
              </address>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--ink-muted)] mb-1">
                Email Address
              </p>
              <a
                href={`mailto:${site.email}`}
                className="text-sm font-medium text-[var(--blue)] hover:underline"
              >
                {site.email}
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--ink-muted)] mb-1">
                Availability
              </p>
              <p className="text-sm text-[var(--ink)]">
                Phone &amp; WhatsApp inquiries taken 24 hours a day
              </p>
            </div>
          </div>

          {/* Lazy-loaded Google Map Embed (design.md §7) */}
          <div className="rounded-[var(--radius-card)] overflow-hidden border border-[var(--line)] shadow-sm bg-[var(--bg)]">
            <div className="p-3 bg-white border-b border-[var(--line)] text-xs font-medium text-[var(--ink-muted)]">
              📍 Kanteerava Nagar, Bengaluru
            </div>
            <div className="w-full aspect-[4/3] relative">
              <iframe
                title="Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.2185567303037!2d77.5342784!3d13.0217523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d8a5763b655%3A0xe5a3c22ffbc7766!2sKanteerava%20Nagar%2C%20Nandini%20Layout%2C%20Bengaluru%2C%20Karnataka%20560096!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Link to Careers (features.md §1.2 & design.md §7) */}
          <div className="p-4 rounded-xl bg-[var(--blue-tint)] border border-[var(--line)] text-sm text-[var(--ink)] flex items-center justify-between">
            <span>
              Looking for work as a nurse or caregiver?
            </span>
            <Link
              href="/careers"
              className="font-semibold text-[var(--blue)] hover:underline whitespace-nowrap ml-2"
            >
              Apply on Careers →
            </Link>
          </div>
        </div>

        {/* Right Column: Customer Form Card */}
        <div className="lg:col-span-7">
          <CustomerForm sourcePage="/contact" />
        </div>
      </div>
    </div>
  );
}
