/**
 * HomeHero — Redesigned Home Hero with Carousel INSIDE the hero.
 *
 * Layout:
 * - Mobile (<768px):
 *     1. Eyebrow pill
 *     2. H1 headline
 *     3. Subtext
 *     4. CTAs
 *     5. Trust strip
 *     6. Media card (full width minus gutter, aspect-4/3, 24px radius, soft shadow, thin white/10% border)
 * - Tablet (768px-1023px):
 *     Single column like mobile, with media card capped at max-width 640px & centered.
 * - Desktop (≥1024px):
 *     Two-column grid (55% text / 45% media). Text stays vertically centered.
 *     Media card overlaps the hero's bottom edge by 32px and sits on a blurred brand blob.
 *     Hero shell reuses the 1400px container matching the old carousel width.
 *
 * Server-Side Rendered:
 * - The H1 headline and SEO copy render directly in SSR HTML (LCP text ready immediately).
 * - Client interactivity is isolated in <HeroCtaGroup /> and <HeroMediaCard />.
 */

import HeroMediaCard from '@/components/HeroMediaCard';
import HeroCtaGroup from '@/components/HeroCtaGroup';

function ShieldCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

const TRUST_ITEMS = [
  { icon: <ShieldCheckIcon />, label: 'Trained caregivers' },
  { icon: <ZapIcon />, label: 'Same-day response' },
  { icon: <HeartIcon />, label: 'Available 24 × 7' },
] as const;

export default function HomeHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-section relative overflow-hidden text-white"
      style={{
        background:
          'linear-gradient(145deg, #3D0920 0%, #6B1038 40%, #A31758 75%, #C4256E 100%)',
      }}
    >
      {/* ── Ambient Animated Background Blobs ───────────────────────────── */}
      <div
        aria-hidden="true"
        className="hero-blob absolute rounded-full pointer-events-none"
        style={{
          width: 'clamp(320px, 45vw, 680px)',
          height: 'clamp(320px, 45vw, 680px)',
          background:
            'radial-gradient(circle, rgba(220, 80, 140, 0.35) 0%, transparent 70%)',
          top: '-10%',
          right: '-5%',
          filter: 'blur(60px)',
        }}
      />
      <div
        aria-hidden="true"
        className="hero-blob-2 absolute rounded-full pointer-events-none"
        style={{
          width: 'clamp(240px, 35vw, 500px)',
          height: 'clamp(240px, 35vw, 500px)',
          background:
            'radial-gradient(circle, rgba(74, 11, 42, 0.45) 0%, transparent 70%)',
          bottom: '-5%',
          left: '-5%',
          filter: 'blur(70px)',
        }}
      />

      {/* ── Main Container: 1400px Max-Width (Matching Old Hero) ────────── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* ── Left Column: Copy & Actions (SSR) ────────────────────────── */}
          <div className="flex flex-col justify-center max-w-2xl lg:max-w-none">
            {/* 1. Eyebrow Pill */}
            <div className="mb-4 sm:mb-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-[#FFD6E8] bg-white/12 border border-white/25 backdrop-blur-md">
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80] animate-pulse"
                />
                Home nursing in Bengaluru
              </span>
            </div>

            {/* 2. H1 Headline */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-white !text-white leading-[1.08] mb-4 sm:mb-5"
            > 
              <span className="text-white !text-white" style={{ color: '#ffffff' }}>
                Skilled, compassionate care,
              </span>{' '}
              <span className="text-[#FFB3D1] relative inline-block whitespace-nowrap">
                at home.
                {/* Hand-drawn SVG underline */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 10"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full h-2.5 sm:h-3 overflow-visible"
                >
                  <path
                    d="M2 7 Q30 2 60 6 Q90 10 118 4"
                    stroke="#F9A8D4"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </svg>
              </span>
            </h1>

            {/* 3. Subtext */}
            <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-6 sm:mb-8 max-w-xl">
              Professional home nursing and caregiver services across{' '}
              <strong className="text-white font-semibold">Bengaluru</strong> —
              for families who need skilled, reliable support quickly.
            </p>

            {/* 4. CTA Row */}
            <div className="mb-6 sm:mb-8">
              <HeroCtaGroup />
            </div>

            {/* 5. Trust Strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm font-semibold text-white/90">
              {TRUST_ITEMS.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-2">
                  <span className="text-[#86EFAC]">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── Right Column: Media Card Carousel ───────────────────────── */}
          <div className="w-full max-w-[640px] mx-auto lg:max-w-none relative lg:translate-y-8">
            {/* Background blob behind media card on desktop */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute -inset-4 rounded-[32px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(220, 80, 140, 0.45) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />

            {/* 6. Media Card Carousel */}
            <HeroMediaCard />
          </div>
        </div>
      </div>
    </section>
  );
}
