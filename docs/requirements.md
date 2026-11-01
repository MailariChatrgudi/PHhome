# Project Requirements

**Project:** Home nursing business website rebuild
**Brand name:** PH Home Nursing Services 
**Location served:** Bengaluru, Karnataka
**Version:** 1.0 · 2026-10-23

---

## 1. Purpose

Replace the existing Boost 360 template site (homenursingservice.in) with a fast, clean, search-optimised website whose job is to:

1. **Rank on Google** for local home-nursing and elder-care searches (main goal).
2. **Turn visitors into customer enquiries and job applications** that arrive directly in the owner's email inbox.
3. **Publish regular updates** (blog) that the owner can post without a developer.

## 2. Scope

### In scope (the only three features)

| # | Feature | Priority |
|---|---------|----------|
| 1 | **SEO** – technical, on-page, local, structured data | Main |
| 2 | **Queries**: two forms, a **customer enquiry** and a **job applicant** form, each sent by direct email and **not stored in any database** | Required |
| 3 | **Updates** – blog with public pages and an owner-only admin | Required |

Supporting static pages (Home, Services, About, Contact, FAQ, Careers) exist only to carry SEO content and to host the two forms. Their content lives in code/config, not in a database.

### Out of scope (explicitly removed from the old site)

- Shopping cart, product catalogue, prices, checkout
- Job postings listed as products, a jobs database or job listings, applicant tracking, CV or file uploads (a single `/careers` page with the applicant form **is** in scope)
- Testimonials system, photo gallery CMS, newsletter subscription
- User accounts for visitors
- Storing enquiries or applications in a database or dashboard

## 3. Users

| User | Needs |
|------|-------|
| Family member of a patient (mobile, often stressed, often urgent) | Understand services, trust the business, call or send a request in under a minute |
| Google / Bing crawler | Clean HTML, fast pages, structured data, sitemap |
| Job applicant (nurse or caregiver, mobile) | Find the Careers page, say who they are and what role they want, submit in under a minute |
| Owner / admin (non-technical) | Post, edit, unpublish updates from a phone at `/admin/login`; receive customer enquiries and job applications by email |

## 4. Functional requirements

### SEO
- **FR-S1** Every page is server-rendered or statically generated (no client-only content).
- **FR-S2** Unique `<title>` (≤ 60 chars) and meta description (≤ 160 chars) per page, one `<h1>` per page.
- **FR-S3** Canonical URL on every page; correct `og:url`, `og:title`, `og:description`, `og:image` (the old site pointed `og:url` at the homepage on every page).
- **FR-S4** Auto-generated `/sitemap.xml` (static pages + published updates) and `/robots.txt`.
- **FR-S5** JSON-LD: `LocalBusiness`/`MedicalBusiness` (name, address, phone, hours, area served), `BreadcrumbList`, `FAQPage` on the FAQ, `Article` on each update.
- **FR-S6** One dedicated page per service with unique copy (no duplicated or keyword-stuffed text).
- **FR-S7** 301 redirects from every old URL pattern (`/page/*`, `/products/*`, `/latest-update/*`) to the closest new page (only if the same domain is reused).
- **FR-S8** Clean, lowercase, hyphenated URLs; no trailing-ID URLs.
- **FR-S9** Images: `alt` text, modern formats, explicit width/height, lazy loading below the fold.

### Queries
- **FR-Q1** **Customer enquiry form** with name, phone, email (optional), message. Shown on Home, every service page and Contact. Endpoint `POST /api/query/customer`; email goes to `QUERY_TO_EMAIL`.
- **FR-Q2** **Job applicant form** with name, phone, email, service type / role (a fixed list in a `<select>`). Shown only on `/careers`. Endpoint `POST /api/query/applicant`; email goes to `APPLICANT_TO_EMAIL`, falling back to `QUERY_TO_EMAIL`. No CV or file upload.
- **FR-Q3** Each submission is validated server-side and sent as one email to the owner's inbox through Resend.
- **FR-Q4** **No database write for either form.** Nothing about an enquiry or an application is persisted by the application; request bodies are not logged.
- **FR-Q5** Spam protection on both: honeypot field, per-IP rate limit (customer 5/hour, applicant 3/hour), optional Cloudflare Turnstile; line breaks stripped from the name before it goes into the email subject.
- **FR-Q6** Visitor sees a clear success or failure state and a fallback "Call / WhatsApp" link on failure.
- **FR-Q7** Persistent Call and WhatsApp buttons on every page (`tel:` and `wa.me` links).
- **FR-Q8** `/careers` page (indexable, in the sitemap) hosts the applicant form and is linked from the footer and the Contact page. It carries no `JobPosting` markup.

### Updates (blog)
- **FR-U1** Public list page and detail page per update, with pagination.
- **FR-U2** Admin login (single owner account), session in an httpOnly cookie.
- **FR-U3** Admin can create, edit, publish/unpublish and delete updates; Markdown body; cover image upload; custom SEO title/description per post.
- **FR-U4** Only published updates are public and appear in the sitemap.
- **FR-U5** Slug generated from the title, editable, unique.
- **FR-U6** The owner posts updates on the same site at `/admin/login`, then `/admin/updates`, then **New update** (`/admin/updates/new`). The admin is not linked from the public site, is `noindex`, and works on a 360 px phone screen. The editor has a simple toolbar (heading, bold, list, link) and a live preview so Markdown knowledge is not required.
- **FR-U7** Publishing, editing, unpublishing or deleting an update revalidates the affected pages and the sitemap, so the change is live within a minute **without a redeploy**.

## 5. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Performance | Lighthouse mobile ≥ 90 for Performance, SEO, Accessibility, Best Practices; LCP < 2.5 s on 4G; CLS < 0.1 |
| Accessibility | WCAG 2.1 AA: contrast ≥ 4.5:1, keyboard navigable, visible focus, labelled form fields |
| Responsive | Mobile-first; tested at 360 px, 768 px, 1280 px |
| Security | HTTPS only; admin password hashed (bcrypt/argon2); JWT in httpOnly + Secure cookie; input validation and sanitisation of Markdown output; rate limiting on login and query endpoints; secrets only in env vars |
| Privacy | No enquiry storage by this site (the email provider, Resend, keeps its own delivery logs under its own policy); a one-line notice under the form ("Your details are emailed to us and not stored on this site"); no third-party trackers beyond analytics the owner approves |
| Reliability | Both query endpoints return a clear error if the mail provider fails; no silent drops |
| Maintainability | Service and FAQ content in one typed config file; documented env vars |

## 6. Technical approach

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js (App Router), React | SSR/SSG is required for SEO |
| Styling | Tailwind CSS | Fast, consistent tokens |
| API | Next.js route handlers (`/api/*`) | Same origin as the site, so cookie auth stays simple |
| Database | MongoDB (Atlas) – **updates only** | Blog posts are the only persisted data |
| Mail | Resend (official `resend` Node SDK, HTTPS API) | Reliable delivery from the site's own verified domain; no SMTP credentials or mailbox passwords to manage |
| Images | Cloudinary | Upload and on-the-fly optimisation |
| Hosting | Vercel (app) + Atlas (db) | Low-maintenance |

## 7. Content and access needed from the client before build

- Final brand name, logo, brand colour(s)
- Real photos (team, equipment, premises), ideally 8–12
- Final copy approval for each service page; confirmation of every claim (e.g. "24x7 care manager", "certified caregivers", "app with real-time updates") – **claims that cannot be verified are not published**
- Exact business hours, phone/WhatsApp number, email, address, areas served
- Registration/licence details, if any
- Domain and DNS access; Google Business Profile access; Google Search Console access
- The final list of applicant roles for the `/careers` form (a starting list is in `features.md` section 2.2) and whether job applications go to the same inbox as customer enquiries or a separate one
- The owner's admin login email, and a password he will choose (the developer stores only its hash)
- A Resend account and API key
- DNS access to the sending domain, so the SPF/DKIM records Resend gives you can be added and the domain verified (the "from" address must be on this domain)
- The inbox address that will receive enquiries

## 8. Acceptance criteria

1. All pages listed in `features.md` are live and indexable; `/sitemap.xml` validates in Search Console.
2. Rich Results Test passes for `LocalBusiness`, `FAQPage` and `Article`.
3. Submitting the customer form delivers an email to `QUERY_TO_EMAIL` within 30 seconds, and submitting the applicant form delivers an email to `APPLICANT_TO_EMAIL` (or the fallback) within 30 seconds. **No record of either exists in the database** (verified by inspecting the collections).
4. Owner can sign in at `/admin/login`, create and publish a new update from a phone, and see it on the public site and in the sitemap within 1 minute, without a redeploy.
5. Lighthouse mobile scores meet section 5 on Home, a service page and an update page.
6. Old URLs redirect with 301 (if domain reused).

## 9. Assumptions and open items

- **Open:** brand name (`{{BRAND_NAME}}`) and whether the domain stays `homenursingservice.in`.
- Single admin user; no multi-user roles in v1.
- English only in v1 (Kannada can be added later through the same content config).
- No medical advice is published; blog content is general information and is written by the owner.
