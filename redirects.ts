/**
 * redirects.ts
 *
 * 301 permanent redirect map from the old Boost-360 site URLs.
 * Used by next.config.ts — only applies if the same domain is reused.
 *
 * Pattern rules (build-prompt §6):
 *  - :id  matches any trailing path segment (old slug/ID)
 *  - :path* matches zero or more additional segments
 *
 * Phase 5 — requirements.md FR-S7
 */

export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
  basePath?: false;
}

export const redirects: Redirect[] = [
  // ── Service page redirects ────────────────────────────────────────────────
  {
    source: '/page/nursing-care-services/:id',
    destination: '/services/home-nursing',
    permanent: true,
  },
  {
    source: '/page/elderly-care-services/:id',
    destination: '/services/elderly-care',
    permanent: true,
  },
  {
    source: '/page/patient-care-services/:id',
    destination: '/services',
    permanent: true,
  },
  {
    source: '/page/ambulance-services/:id',
    destination: '/services/patient-transport',
    permanent: true,
  },
  {
    source: '/page/patient-transport-vehicle/:id',
    destination: '/services/patient-transport',
    permanent: true,
  },
  {
    source: '/page/surgical-instruments-purchased-and-rented/:id',
    destination: '/services',
    permanent: true,
  },
  {
    source: '/page/home-attendants/:id',
    destination: '/services/bedside-attendants',
    permanent: true,
  },
  {
    source: '/page/hospital-special-nursing-care/:id',
    destination: '/services/hospital-nursing',
    permanent: true,
  },
  {
    source: '/page/dementia-care/:id',
    destination: '/services/dementia-care',
    permanent: true,
  },
  {
    source: '/page/mother-and-baby-care/:id',
    destination: '/services/mother-and-baby-care',
    permanent: true,
  },
  {
    source: '/page/patient-care-male-female-24-7/:id',
    destination: '/services/live-in-caretaker',
    permanent: true,
  },

  // ── Careers / jobs redirects ──────────────────────────────────────────────
  {
    source: '/products/patient-care-jobs/:id',
    destination: '/careers',
    permanent: true,
  },
  {
    source: '/products/home-nursing-services-jobs-health-care-services-at-home/:id',
    destination: '/careers',
    permanent: true,
  },
  {
    source: '/products/ph-home-nursing-services/:id',
    destination: '/careers',
    permanent: true,
  },
  {
    source: '/products/category/home-nursing-services-jobs/:path*',
    destination: '/careers',
    permanent: true,
  },

  // ── Generic products / all-products → services ────────────────────────────
  {
    source: '/products/:path*',
    destination: '/services',
    permanent: true,
  },
  {
    source: '/all-products/:path*',
    destination: '/services',
    permanent: true,
  },

  // ── Blog / updates ────────────────────────────────────────────────────────
  {
    source: '/latest-updates/:path*',
    destination: '/updates',
    permanent: true,
  },
  {
    source: '/latest-update/:path*',
    destination: '/updates',
    permanent: true,
  },

  // ── Map / contact ─────────────────────────────────────────────────────────
  {
    source: '/mapview/:path*',
    destination: '/contact',
    permanent: true,
  },

  // ── Misc old pages → home ─────────────────────────────────────────────────
  {
    source: '/testimonials/:path*',
    destination: '/',
    permanent: true,
  },
  {
    source: '/image-gallery/:path*',
    destination: '/',
    permanent: true,
  },
  {
    source: '/pages/:path*',
    destination: '/',
    permanent: true,
  },
];

