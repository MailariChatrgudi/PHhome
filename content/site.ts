/**
 * content/site.ts
 *
 * Single source of truth for all business facts.
 * OWNER-CONFIRM markers indicate every claim that needs verification before launch.
 * Never use invented data anywhere in the codebase — import from here instead.
 *
 * Rule: do not make up certifications, years of experience, response times,
 * prices, ratings, testimonials, statistics, or an "app". (build-prompt §3)
 */

export const site = {
  /** Brand */
  name: "PH Home Nursing Services",
  legalName: "PH Home Nursing Services", // OWNER-CONFIRM: confirm legal entity name if different

  /** Domain & URLs */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homenursingservice.in",
  adminPath: "/admin",

  /** Contact */
  phone: "+919353997698",
  phoneDisplay: "+91 93539 97698",
  whatsapp: "+919353997698",
  email: "info@homenursingservice.in", // OWNER-CONFIRM: confirm correct spelling (nfo vs info)

  /** Address (matches Google Business Profile NAP exactly) */
  address: {
    streetAddress: "Near 108, 39, 8th Main Rd, Near Rajkumar Samadhi, Kanteerava Nagar",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560096",
    addressCountry: "IN",
    full: "Near 108, 39, 8th Main Rd, Near Rajkumar Samadhi, Kanteerava Nagar, Bengaluru 560096",
  },

  /** Geographic coordinates — used in LocalBusiness JSON-LD */
  geo: {
    latitude: 12.9716, // OWNER-CONFIRM: replace with exact lat/lng from Google Maps
    longitude: 77.5946, // OWNER-CONFIRM: replace with exact lat/lng from Google Maps
  },

  /** Opening hours (ISO 8601 day notation) */
  openingHours: [
    "Mo-Su 00:00-23:59", // OWNER-CONFIRM: confirm if genuinely 24/7 or specific hours
  ],

  /** Area served */
  areaServed: "Bengaluru", // OWNER-CONFIRM: extend to specific neighbourhoods if needed

  /** Social */
  social: {
    whatsappLink: "https://wa.me/919353997698",
  },

  /** Logo (public path) */
  logo: {
    path: "/brand/logo.jpg",
    width: 200,
    height: 200,
    alt: "PH Home Nursing Services logo",
  },

  /** OG image */
  ogImage: "/brand/og-image.jpg", // OWNER-CONFIRM: provide a 1200×630 px OG image

  /** Privacy notice texts (shown below forms) */
  privacyNotice: {
    customer:
      "Your details are sent to us by email and are not stored on this website.",
    applicant:
      "Your details are sent to us by email and are not stored on this website. We may contact you about suitable openings.",
  },

  /**
   * Attention devices copy (Phase 3).
   * All marked OWNER-CONFIRM; no unverified claims on speed, price, or availability.
   */
  announcement: {
    enabled: true,
    text: "Need care urgently? Call us now", // OWNER-CONFIRM
    phoneLabel: "+91 93539 97698",
  },
  ctaBand: {
    heading: "Not sure which care you need?", // OWNER-CONFIRM
    text: "Tell us about your situation and we will help you choose.", // OWNER-CONFIRM
  },
  urgentCallout: "Urgent? Call instead of waiting for a reply.", // OWNER-CONFIRM

  /**
   * Trust strip facts (Home page).
   * Only include claims the owner can back up. (build-prompt §3)
   */
  trustFacts: [
    "Serving Bengaluru", // safe — factual
    "Trained caregivers", // OWNER-CONFIRM: confirm training/qualification details
    "Available 24 × 7", // OWNER-CONFIRM: confirm true 24/7 availability
  ],

  /** How it works steps (Home page) */
  howItWorks: [
    {
      step: 1,
      title: "Tell us the need",
      description:
        "Call or send a request with the patient's condition and preferred timing.",
    },
    {
      step: 2,
      title: "We assess and match",
      description:
        "We discuss the care requirements and assign a suitable caregiver.", // OWNER-CONFIRM: describe real matching process
    },
    {
      step: 3,
      title: "Care starts at home",
      description:
        "A caregiver arrives at the agreed time and begins the care plan.", // OWNER-CONFIRM: confirm wording
    },
  ],
} as const;

export type Site = typeof site;
