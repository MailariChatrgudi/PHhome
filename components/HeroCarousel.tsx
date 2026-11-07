'use client';

/**
 * HeroCarousel — Updated for Brand GIFs (spec: Phase 4 & user direction)
 *
 * - 3 slides using brand GIFs from /brand/ (GifImage1.gif, GifImage2.gif, GifImage3.gif)
 * - Animated GIFs served with `unoptimized` for fluid native playback
 * - Clean crossfade between slides (900ms ease-in-out)
 * - Zero carousel progress indicators or pause/play button (per user prompt)
 * - Retains accessible carousel landmark, auto-pause on hover/reduced motion
 * - Desktop: 21/9 aspect with brand plum gradient overlay
 * - Mobile: 4/3 image container with clear text block below
 */

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { site } from '@/content/site';

const SLIDE_DURATION = 6000; // 6 s
const CROSSFADE_DURATION = 900; // 900 ms

interface Slide {
  id: number;
  label: string;
  href: string;
  image: string;
  alt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    label: 'Home nursing',
    href: '/services/home-nursing',
    image: '/brand/GifImage1.gif',
    alt: 'Skilled home nursing and patient care in Bengaluru',
  },
  {
    id: 2,
    label: 'Elderly care & attendants',
    href: '/services/elderly-care',
    image: '/brand/GifImage2.gif',
    alt: 'Elderly care and trained caregiver support in Bengaluru',
  },
  {
    id: 3,
    label: 'Hospital & post-hospital care',
    href: '/services/post-hospital-care',
    image: '/brand/GifImage3.gif',
    alt: 'Post-hospital clinical recovery and nursing support in Bengaluru',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [chipVisible, setChipVisible] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  // Detect prefers-reduced-motion on mount
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const id = setTimeout(() => {
      setReducedMotion(mq.matches);
      if (mq.matches) setPaused(true);
    }, 0);
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setPaused(true);
    };
    mq.addEventListener('change', handler);
    return () => {
      clearTimeout(id);
      mq.removeEventListener('change', handler);
    };
  }, []);

  // Advance to next slide
  const advance = useCallback(() => {
    setPrev(current);
    setChipVisible(false);
    setTimeout(() => setChipVisible(true), 300);
    setCurrent((c) => (c + 1) % slides.length);
  }, [current]);

  // Autoplay timer
  useEffect(() => {
    if (paused || reducedMotion) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(advance, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, reducedMotion, advance]);

  // Pause on tab hidden
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <section
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our services"
      aria-live={paused ? 'polite' : 'off'}
      onMouseEnter={() => !reducedMotion && setPaused(true)}
      onMouseLeave={() => !reducedMotion && setPaused(false)}
      onFocusCapture={() => !reducedMotion && setPaused(true)}
      onBlurCapture={(e) => {
        if (!regionRef.current?.contains(e.relatedTarget as Node)) {
          if (!reducedMotion) setPaused(false);
        }
      }}
      className="relative w-full max-w-[1400px] mx-auto md:my-6 md:rounded-[28px] overflow-hidden bg-[var(--surface)] shadow-[var(--shadow-soft)] border border-[var(--line)]"
    >
      {/* ── Slide Media Container ── */}
      <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          const isPrev = idx === prev;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${slides.length}: ${slide.label}`}
              aria-hidden={!isActive}
              className="absolute inset-0 transition-opacity duration-900 ease-in-out"
              style={{
                opacity: isActive ? 1 : isPrev ? 0 : 0,
                transition: reducedMotion
                  ? 'none'
                  : `opacity ${CROSSFADE_DURATION}ms ease-in-out`,
                zIndex: isActive ? 2 : isPrev ? 1 : 0,
              }}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
                unoptimized
                sizes="(max-width: 768px) 100vw, 1400px"
                className="object-fill w-full h-full"
                style={{ objectFit: 'fill' }}
              />

              {/* Desktop gradient overlay */}
              <div
                className="hidden md:block absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(20,10,25,0.72) 0%, rgba(20,10,25,0.40) 40%, rgba(20,10,25,0) 70%)',
                }}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {/* ── Text Content ── */}
      <div className="relative md:absolute md:inset-0 z-10 flex flex-col justify-end p-5 sm:p-8 md:p-12 bg-[var(--bg)] md:bg-transparent">
        {/* Label Chip */}
        <div className="mb-3">
          <Link
            href={slides[current].href}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-medium transition-opacity duration-300 backdrop-blur-xs select-none"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              color: 'var(--surface)',
              opacity: chipVisible ? 1 : 0,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--surface)] shrink-0" />
            <span>{slides[current].label}</span>
          </Link>
        </div>

        {/* Static H1 Heading */}
        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white md:text-white mb-2 leading-tight max-w-xl"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
          }}
        >
          Skilled, compassionate care, at home.
        </h1>

        <p
          className="text-sm sm:text-base md:text-lg text-[var(--ink-muted)] md:text-white/95 mb-6 max-w-lg leading-relaxed"
          style={{
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
          }}
        >
          Professional home nursing and caregiver services across Bengaluru — for
          families who need skilled, reliable support at home.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`tel:${site.phone}`}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full font-medium text-base text-white bg-[var(--plum)] hover:bg-[var(--plum-dark)] transition-colors hero-call-pulse shadow-md select-none"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Call now</span>
          </a>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              const fn = (window as typeof window & { __openEnquiryModal?: () => void }).__openEnquiryModal;
              if (fn) fn();
            }}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full font-medium text-base text-[var(--ink)] md:text-white border border-[var(--line)] md:border-white/70 hover:bg-white/10 transition-colors select-none cursor-pointer"
          >
            Send a request
          </button>
        </div>
      </div>

      {/* ── WhatsApp Floating Tab (Right Edge on Desktop) ── */}
      <a
        href={site.social.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 items-center gap-1.5 py-2.5 px-3 rounded-l-lg bg-[var(--whatsapp)] text-white text-[13px] font-semibold shadow-lg select-none [writing-mode:vertical-lr] tracking-wide"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="rotate-90"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>Chat with us</span>
      </a>
    </section>
  );
}
