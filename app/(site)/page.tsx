import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import HomeHero from '@/components/HomeHero';
import CtaBand from '@/components/CtaBand';
import ServiceCard from '@/components/ServiceCard';
import CustomerForm from '@/components/CustomerForm';
import UpdateCard, { type UpdateCardData } from '@/components/UpdateCard';
import Button from '@/components/Button';
import { EyebrowChip } from '@/components/Chip';
import HomePageClient from '@/components/HomePageClient';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { buildMetadata } from '@/lib/seo';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update } from '@/models/Update';

export const metadata: Metadata = buildMetadata({
  title: `${site.name} | Bengaluru`,
  description:
    'Professional home nursing, elderly care, post-hospital care and caregiver services in Bengaluru. Call or WhatsApp — we respond promptly.',
  path: '/',
});

/** ─── Dummy updates shown when fewer than 3 posts are published ─── */
const DUMMY_UPDATES: UpdateCardData[] = [
  {
    slug: 'preparing-home-for-post-hospital-recovery',
    title: 'How to Prepare Your Home for Post-Hospital Recovery',
    excerpt:
      'Essential tips on room setup, hygiene precautions, and caregiver coordination before your family member arrives home from the hospital.',
    publishedAt: '2026-10-15T10:00:00.000Z',
    tag: 'Care Guide',
    accent: 'plum',
    coverImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=500&fit=crop&auto=format',
  },
  {
    slug: 'choosing-between-nurse-and-bedside-attendant',
    title: 'Understanding the Difference Between a Nurse and an Attendant',
    excerpt:
      'A practical guide to help families choose the right level of care: clinical nursing versus daily physical assistance.',
    publishedAt: '2026-10-08T09:30:00.000Z',
    tag: 'Family Guidance',
    accent: 'blue',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop&auto=format',
  },
  {
    slug: 'supporting-aging-parents-with-dementia-at-home',
    title: 'Supporting an Aging Parent with Dementia in Familiar Surroundings',
    excerpt:
      'Why keeping routines consistent and environments familiar reduces anxiety and promotes safety for individuals living with memory loss.',
    publishedAt: '2026-09-28T14:15:00.000Z',
    tag: 'Dementia Care',
    accent: 'plum',
    coverImage: 'https://images.unsplash.com/photo-1581579186913-45ac24ed53e8?w=800&h=500&fit=crop&auto=format',
  },
];

/** Fetch up to 3 published updates from MongoDB (server-side). */
async function fetchPublishedUpdates(): Promise<UpdateCardData[]> {
  try {
    if (!isDatabaseConfigured()) return [];
    await connectToDatabase();
    const raw = await Update.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('slug title excerpt coverImage publishedAt')
      .lean();
    return (
      raw as Array<{
        slug: string;
        title: string;
        excerpt?: string;
        coverImage?: { url?: string; alt?: string };
        publishedAt?: Date | string;
      }>
    ).map((item) => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || '',
      coverImage: item.coverImage,
      publishedAt:
        item.publishedAt instanceof Date
          ? item.publishedAt.toISOString()
          : item.publishedAt || '',
    }));
  } catch {
    return [];
  }
}

/** Async component wrapped in <Suspense> for Next.js 16 Partial Prerendering */
async function LatestUpdatesList() {
  await connection();
  const realPosts = await fetchPublishedUpdates();
  const needed = Math.max(0, 3 - realPosts.length);
  const updateCards: UpdateCardData[] = [
    ...realPosts.slice(0, 3),
    ...DUMMY_UPDATES.slice(0, needed),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {updateCards.map((update) => (
        <UpdateCard key={update.slug} update={update} />
      ))}
    </div>
  );
}

function UpdatesFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {DUMMY_UPDATES.map((update) => (
        <UpdateCard key={update.slug} update={update} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <HomePageClient>
      {/* ── 1. Hero Section (with carousel inside) ── */}
      <HomeHero />

      {/* ── 2. Services Grid ── */}
      <section className="container-content section-py" aria-labelledby="services-heading">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <EyebrowChip className="mb-3">Our Care Services</EyebrowChip>
          <h2
            id="services-heading"
            className="text-2xl sm:text-4xl font-semibold text-[var(--ink)] tracking-tight leading-tight"
          >
            Home Nursing &amp; Caregiver Support in Bengaluru
          </h2>
          <div className="w-12 h-1 bg-[var(--plum)] rounded-full mt-3 mb-4" />
          <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
            From short medical visits to 24/7 live-in support, we bring skilled, compassionate healthcare into your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--blue)] hover:text-[var(--blue-dark)] hover:underline"
          >
            Explore all services &amp; medical equipment support →
          </Link>
        </div>
      </section>

      {/* ── 3. CTA Band ── */}
      <CtaBand />

      {/* ── 4. How It Works ── */}
      <section
        className="bg-[var(--blue-tint)] section-py my-8 border-y border-[var(--line)]"
        aria-labelledby="how-it-works-heading"
      >
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <EyebrowChip className="mb-3">Simple 3-Step Process</EyebrowChip>
            <h2
              id="how-it-works-heading"
              className="text-2xl sm:text-4xl font-semibold text-[var(--ink)] tracking-tight"
            >
              How Care Starts at Home
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-2">
              Arranging home care should not add stress. We keep the process prompt and transparent.
            </p>
          </div>

          <div className="relative">
            <div
              className="hidden md:block absolute top-6 left-[16%] right-[16%] h-[2px] z-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to right, var(--plum) 0, var(--plum) 8px, transparent 8px, transparent 16px)',
                opacity: 0.35,
              }}
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 sm:p-8 border border-[var(--line)] card-base relative flex flex-col items-start text-left">
                <span
                  className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg mb-5 shadow-[var(--shadow-rest)] shrink-0"
                  style={{ background: 'var(--grad-brand)' }}
                >
                  1
                </span>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Tell Us Your Need</h3>
                <p className="text-[15px] text-[var(--ink-muted)] leading-relaxed">
                  Call, WhatsApp, or send an enquiry form detailing the patient&apos;s condition, doctor&apos;s
                  instructions, and required schedule.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 sm:p-8 border border-[var(--line)] card-base relative flex flex-col items-start text-left">
                <span
                  className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg mb-5 shadow-[var(--shadow-rest)] shrink-0"
                  style={{ background: 'var(--grad-brand)' }}
                >
                  2
                </span>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">We Assess &amp; Match</h3>
                <p className="text-[15px] text-[var(--ink-muted)] leading-relaxed">
                  We review medical needs and match a certified nurse or trained attendant whose experience aligns with
                  the patient.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 sm:p-8 border border-[var(--line)] card-base relative flex flex-col items-start text-left">
                <span
                  className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg mb-5 shadow-[var(--shadow-rest)] shrink-0"
                  style={{ background: 'var(--grad-brand)' }}
                >
                  3
                </span>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Care Starts at Home</h3>
                <p className="text-[15px] text-[var(--ink-muted)] leading-relaxed">
                  Your caregiver arrives on schedule, delivers attentive care, and maintains daily communication with
                  your family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Latest Care Advice & News (real + dummy fallback) ── */}
      <section className="container-content section-py" aria-labelledby="updates-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <EyebrowChip className="mb-3">Guides &amp; Updates</EyebrowChip>
            <h2
              id="updates-heading"
              className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight"
            >
              Latest Care Advice &amp; News
            </h2>
          </div>
          <Button variant="secondary" href="/updates" showArrow className="h-10 px-5 text-sm self-start sm:self-auto">
            All updates
          </Button>
        </div>

        <Suspense fallback={<UpdatesFallback />}>
          <LatestUpdatesList />
        </Suspense>
      </section>

      {/* ── 6. Customer Enquiry Form Section ── */}
      <section
        className="bg-[var(--plum-tint)] section-py border-t border-[var(--line)]"
        aria-labelledby="enquiry-section-heading"
      >
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left column */}
            <div className="lg:col-span-5 space-y-6">
              <EyebrowChip>Reach Us Anytime</EyebrowChip>
              <h2
                id="enquiry-section-heading"
                className="text-2xl sm:text-4xl font-semibold text-[var(--ink)] tracking-tight leading-tight"
              >
                Compassionate Care When Your Family Needs It Most
              </h2>
              <p className="text-base text-[var(--ink-muted)] leading-relaxed">
                Whether you need immediate post-hospital nursing or are planning long-term care for an elderly parent, we
                are here to guide you with honesty, empathy, and professionalism.
              </p>

              {/* Contact rows */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--line)] shadow-[var(--shadow-rest)] space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Urgent Care Need? Direct Assistance
                </p>
                <div className="space-y-3">
                  {/* Phone */}
                  <a
                    href={`tel:${site.phone}`}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[var(--plum-tint)] transition-colors group"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--plum-100)', color: 'var(--plum)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--ink-muted)]">Call Directly (24/7)</p>
                      <p className="text-base font-semibold text-[var(--plum)] group-hover:underline">{site.phoneDisplay}</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${site.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[var(--green-tint)] transition-colors group"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--green-tint)', color: 'var(--whatsapp)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--ink-muted)]">WhatsApp Chat</p>
                      <p className="text-base font-semibold text-[var(--whatsapp)] group-hover:underline">Quick Response</p>
                    </div>
                  </a>

                  {/* Coverage */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--blue-100)', color: 'var(--blue)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--ink-muted)]">Coverage Area</p>
                      <p className="text-sm font-semibold text-[var(--ink)]">All Bengaluru Neighbourhoods</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reassurance points */}
              <ul className="space-y-2.5 text-sm text-[var(--ink)]">
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[var(--plum-100)] text-[var(--plum)] flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  No advance deposit to enquire
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[var(--plum-100)] text-[var(--plum)] flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  Transparent consultation before care begins
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[var(--plum-100)] text-[var(--plum)] flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                  Information handled confidentially by registered supervisors
                </li>
              </ul>
            </div>

            {/* Right column: form */}
            <div className="lg:col-span-7">
              <CustomerForm sourcePage="/" />
            </div>
          </div>
        </div>
      </section>
    </HomePageClient>
  );
}
