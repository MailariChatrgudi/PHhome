'use client';

/**
 * HeroMediaCard — High-performance media carousel inside the Home Hero.
 *
 * Capabilities:
 * - Supports both image (WebP) and video (MP4/WebM) slides
 * - Auto-advances every 5s for images, or on video completion (max 12s)
 * - Pauses on hover, focus, and touch; supports mobile swipe gestures
 * - 48px tap target left/right desktop navigation arrows
 * - Bottom dot indicators with wider active pill and filling progress bar
 * - 600ms crossfade with zero layout shift (aspect-[4/3] fixed container)
 * - Bottom-left caption chip on dark frosted scrim
 * - Floating "24/7 support" card with pulsing green dot over top-right
 * - Respects prefers-reduced-motion and navigator.connection.saveData
 * - Accessible landmarks: role="region", aria-roledescription="carousel", aria-live
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

export interface HeroSlide {
  id: number;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
  caption?: string;
  videoSources?: { src: string; type: string }[];
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    type: 'image',
    src: '/brand/slide-1.webp',
    poster: '/brand/slide-1-poster.webp',
    alt: 'Skilled home nursing in Bengaluru and patient bedside care',
    caption: 'Home Nursing & Clinical Care',
  },
  {
    id: 2,
    type: 'image',
    src: '/brand/slide-2.webp',
    poster: '/brand/slide-2-poster.webp',
    alt: 'Elderly care and trained caregiver support for seniors at home',
    caption: 'Elderly Care & Trained Attendants',
  },
  {
    id: 3,
    type: 'image',
    src: '/brand/slide-3.webp',
    poster: '/brand/slide-3-poster.webp',
    alt: 'Post-hospital clinical recovery and rehabilitation care at home',
    caption: 'Post-Hospital Recovery Care',
  },
];

const DEFAULT_SLIDE_DURATION = 5000; // 5s for image slides
const MAX_VIDEO_DURATION = 12000; // max 12s for video slides

export default function HeroMediaCard() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect prefers-reduced-motion & Data Saver on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mq.addEventListener('change', onMotionChange);

    // Data Saver check
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) {
      setDataSaver(true);
    }

    return () => {
      mq.removeEventListener('change', onMotionChange);
    };
  }, []);

  // Slide navigation
  const goTo = useCallback((index: number) => {
    setCurrent((index + heroSlides.length) % heroSlides.length);
  }, []);

  const next = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  // Handle active video playback
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === current && !paused && !reducedMotion && !dataSaver) {
        vid.currentTime = 0;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            /* browser autoplay restriction fallback */
          });
        }
      } else {
        vid.pause();
      }
    });
  }, [current, paused, reducedMotion, dataSaver]);

  // Auto-advance timer
  useEffect(() => {
    if (paused || reducedMotion) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const activeSlide = heroSlides[current];
    const duration =
      activeSlide.type === 'video'
        ? MAX_VIDEO_DURATION
        : DEFAULT_SLIDE_DURATION;

    timerRef.current = setTimeout(() => {
      next();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, paused, reducedMotion, next]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setPaused(false);
    if (touchStartX.current === null || touchStartY.current === null) return;

    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Only register horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Care services showcase"
      aria-live={paused ? 'polite' : 'off'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group relative w-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border border-white/15 bg-[#2A0617] select-none"
    >
      {/* ── Slides ───────────────────────────────────────────────────────── */}
      <div className="relative w-full h-full overflow-hidden">
        {heroSlides.map((slide, index) => {
          const isActive = index === current;
          const isLcp = index === 0;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${heroSlides.length}: ${slide.caption || slide.alt}`}
              aria-hidden={!isActive}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: isActive ? 1 : 0,
                transition: reducedMotion ? 'none' : 'opacity 600ms ease-in-out',
                zIndex: isActive ? 10 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {slide.type === 'video' ? (
                reducedMotion || dataSaver ? (
                  // Poster fallback for reduced-motion or Data Saver
                  slide.poster ? (
                    <Image
                      src={slide.poster}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      className="object-cover w-full h-full"
                    />
                  ) : null
                ) : (
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    poster={slide.poster}
                    onEnded={() => next()}
                    className="object-cover w-full h-full"
                  >
                    {isActive && slide.videoSources ? (
                      slide.videoSources.map((v) => (
                        <source key={v.src} src={v.src} type={v.type} />
                      ))
                    ) : isActive && slide.src ? (
                      <source src={slide.src} />
                    ) : null}
                  </video>
                )
              ) : (
                /* Image Slide */
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={isLcp}
                  loading={isLcp ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 620px"
                  className="object-cover w-full h-full"
                  unoptimized={slide.src.endsWith('.webp') || slide.src.endsWith('.gif')}
                />
              )}

              {/* Subtle bottom gradient scrim so captions and indicators stay legible */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none"
              />
            </div>
          );
        })}
      </div>

      {/* ── Floating "24/7 support" Card (Top Right) ──────────────────────── */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 sm:bg-white/95 text-white sm:text-[#1F1A1D] border border-white/20 sm:border-black/10 backdrop-blur-md shadow-md text-xs font-semibold">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80] animate-pulse"
          />
          <span>24/7 Support</span>
        </div>
      </div>

      {/* ── Slide Caption Chip (Bottom Left) ─────────────────────────────── */}
      {heroSlides[current].caption && (
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none max-w-[65%]">
          <span className="inline-block truncate px-3 py-1.5 rounded-full bg-black/65 text-white/95 border border-white/20 backdrop-blur-md text-xs font-medium shadow-sm">
            {heroSlides[current].caption}
          </span>
        </div>
      )}

      {/* ── Left / Right Desktop Arrow Buttons (48px tap target) ─────────── */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-xs transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-xs transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dot Indicators + Progress Bar (Bottom Center) ─────────────────── */}
      <div
        role="tablist"
        aria-label="Choose slide to display"
        className="absolute bottom-4 right-4 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-20 flex items-center gap-2"
      >
        {heroSlides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={slide.id}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${idx + 1}: ${slide.caption || slide.alt}`}
              onClick={() => goTo(idx)}
              className="relative h-2.5 rounded-full transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                width: isActive ? 34 : 10,
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.45)',
              }}
            >
              {isActive && !reducedMotion && (
                <span
                  key={`progress-${current}-${paused}`}
                  className="absolute inset-y-0 left-0 bg-[#FFB3D1] rounded-full"
                  style={{
                    animationName: 'slideProgressBar',
                    animationDuration: `${DEFAULT_SLIDE_DURATION}ms`,
                    animationTimingFunction: 'linear',
                    animationFillMode: 'forwards',
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

