# Antigravity Build Prompt

> **Before you paste this:** put `requirements.md`, `design.md`, `features.md` and `api.md` in a `/docs` folder at the project root, and add the logo as `public/brand/logo.png`. The agent is told to read them first. Replace the three `{{...}}` values in section 0.

---

## 0. Project values (fill these in)

```
BRAND_NAME   = PH Home Nursing Services
DOMAIN       = https://homenursingservice.in/            
PHONE        = +919353997698
WHATSAPP     = +919353997698
EMAIL        = info@homenursingservice.in
ADDRESS      = Near 108, 39, 8th Main Rd, Near Rajkumar Samadhi, Kanteerava Nagar, Bengaluru 560096


```

---

## 1. Role and goal

You are building a production website for a home nursing business in Bengaluru, from scratch, in this repository.

**Source of truth: the four files in `/docs`.** Read all of them completely before writing any code:

1. `/docs/requirements.md`: scope, non-functional requirements, acceptance criteria
2. `/docs/features.md`: the three features in detail
3. `/docs/design.md`: brand tokens, components, hero carousel, wireframes
4. `/docs/api.md`: every endpoint, request/response shape, data model, env vars

If this prompt and a doc disagree, **the doc wins**. If two docs disagree, stop and ask me instead of guessing.

## 2. The three features (nothing else)

1. **SEO** (main feature): server-rendered pages, metadata, sitemap, robots, JSON-LD, redirects.
2. **Queries**: two forms, both sent by email through the Resend API. **Nothing is stored by the site.**
   - **Customer enquiry** (name, phone, optional email, message) → `POST /api/query/customer`, shown on Home, every service page and Contact.
   - **Job applicant** (name, phone, email, service type / role) → `POST /api/query/applicant`, shown only on `/careers`.
3. **Updates**: public blog + owner-only admin to create/edit/publish updates (MongoDB), posted at `/admin/login` → `/admin/updates` → New update.

Do **not** build: cart, product catalogue, prices, a jobs database or job listings, CV/file uploads, applicant tracking, testimonials CMS, gallery, newsletter, visitor accounts, an enquiry or application dashboard. (A single `/careers` page with the applicant form **is** in scope.)

## 3. Hard rules (violating any of these is a failed build)

- **Neither form is ever persisted** (customer enquiry or job applicant). No DB write, no file write, no request-body logging, no analytics event containing form data. The only allowed log is `{ form, status, timestamp }`. Applicant data is personal data of job seekers: treat it with the same rule, and never add CV/file upload.
- **Resend rules.** The API key is server-only (never `NEXT_PUBLIC_`). `resend.emails.send` returns `{ data, error }` and does not throw on API errors, so always check `error` and return `502 MAIL_FAILED`; also catch thrown network errors. `lib/mail.ts` is the only file that imports `resend`. Never log the payload or the error body, only the status. The `from` address must be on a domain verified in Resend.
- **No invented content.** Do not make up certifications, years of experience, response times, prices, ratings, testimonials, statistics or an "app". Put all business facts in one file, `content/site.ts`, using the values in section 0, and mark every unconfirmed fact with `// OWNER-CONFIRM`.
- **No medical advice** in any copy. General information only.
- **No fake structured data.** No `aggregateRating`, `Review` or similar markup.
- **Auth:** JWT in an `HttpOnly; Secure; SameSite=Lax` cookie. Never use `localStorage` for tokens. Single admin from env vars (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`); no users collection.
- **Markdown safety:** render the blog body through a sanitiser. Never use `dangerouslySetInnerHTML` with unsanitised input.
- **No GIFs or video** for the hero. No third-party trackers, no chat widgets other than the plain `wa.me` link.
- **No new dependency** beyond the list in section 4 without telling me why.
- **Secrets** only in env vars; commit a `.env.example` with every variable from `api.md` section 7 and no real values.

## 4. Stack (fixed)

- Next.js (App Router) + TypeScript (strict), Tailwind CSS
- `next/font` (Inter), `next/image`
- MongoDB with Mongoose, **updates collection only**
- Resend (`resend` SDK) for email, Zod (validation), bcryptjs, `jose` (JWT)
- `react-markdown` with `rehype-sanitize` (or equivalent) for the blog body
- Cloudinary signed uploads for cover images
- Optional: Cloudflare Turnstile (feature-flagged by env var)

Suggested structure:

```
app/
  (site)/ page.tsx, services/, services/[slug]/, about/, faq/, careers/, contact/, updates/, updates/[slug]/
  admin/ login/, updates/, updates/new/, updates/[id]/
  api/ query/customer/, query/applicant/, updates/, updates/[slug]/, auth/{login,logout,me}/, admin/updates/, admin/uploads/sign/
  sitemap.ts, robots.ts, not-found.tsx
components/ Header, Footer, StickyContactBar, HeroCarousel, ServiceCard, CustomerForm, ApplicantForm, UpdateCard, Faq, JsonLd
content/ site.ts, services.ts, faq.ts, roles.ts
lib/ db.ts, mail.ts, auth.ts, rateLimit.ts, validators.ts, seo.ts, markdown.ts
models/ Update.ts
redirects.ts
```

## 5. Build in phases. Stop and verify at the end of each

After every phase: run `npm run lint` and `npm run build`. If either fails, fix it before continuing. End each phase with a **5-line summary**: what was built, files touched, how I can see it, what you were unsure about, what is next. Do not start the next phase until the current one is clean.

### Phase 1: Scaffold and design tokens
- Create the Next.js project, configure Tailwind, add the CSS tokens from `design.md` section 12 to `globals.css`, and map them in the Tailwind theme.
- Inter via `next/font`. Base typography scale from `design.md` section 3.
- **Check:** a test page shows every token (swatches) and every type style.

### Phase 2: Layout shell
- Header (circular logo, nav, **Call now** pill), Footer (`--plum-deep`, logo on white circle), mobile menu sheet, `StickyContactBar` (Call + WhatsApp, mobile only, hidden on `/contact`), skip-to-content link.
- Content container 1120 px; hero container rules from `design.md` section 6.2.
- **Check:** keyboard tab order works, 44 px touch targets, no horizontal scroll at 360 px.

### Phase 3: Hero carousel
Implement exactly as `design.md` section 6:
- 4 slides, crossfade 900 ms, 6 s per slide, Ken Burns zoom 1 → 1.06 over 7 s with varied origins, story-style progress bars, fixed `aspect-ratio` (21/9 desktop, 16/9 tablet, 4/3 media on mobile with text below).
- H1 and buttons are **static**; only the label chip changes and links to its service page.
- Pause button; pause on hover, focus, touch-hold and `visibilitychange`; `prefers-reduced-motion` disables autoplay and animation.
- ARIA exactly as `design.md` section 6.9.
- Slide 1 `priority` + `fetchpriority="high"`; slides 2–4 lazy. Until real images exist, create **placeholder slides** (flat brand-palette gradient images, clearly labelled `PLACEHOLDER`) and list in a comment where the real files go.
- **Check:** Lighthouse mobile LCP < 2.5 s, CLS = 0, carousel fully operable by keyboard, reduced-motion respected.

### Phase 4: Static pages and service content
- Home sections in the order from `design.md` section 7. Service pages generated from `content/services.ts` via `generateStaticParams`, using the slugs in `features.md` section 1.1.
- Draft copy for each service (400+ words, unique, plain and warm): what's included, who it suits, how it works, what to prepare, 3–5 FAQs. **Mark every service file `// OWNER-REVIEW` at the top.** Follow the "no invented content" rule strictly.
- About, FAQ, Contact pages. Contact has a lazy-loaded map embed and a link to Careers.
- `/careers` page per `features.md` section 2.6 and `design.md` (h1, short intro, role list, applicant form placeholder wired up in Phase 6). Add "Careers" to the footer, not the header. Do **not** add `JobPosting` structured data.
- **Check:** every route renders with JS disabled (view-source shows the content).

### Phase 5: SEO layer (main feature)
- Metadata API on every route: unique title ≤ 60, description ≤ 160, canonical, Open Graph, Twitter. Central helper in `lib/seo.ts`.
- `app/sitemap.ts` (static pages + published updates with `lastmod`) and `app/robots.ts` (disallow `/admin` and `/api`, point at the sitemap).
- `JsonLd` component: `LocalBusiness` as `MedicalBusiness` site-wide, `BreadcrumbList` on inner pages, `FAQPage` where FAQs exist, `Article` on updates (added in Phase 7).
- `redirects.ts` wired into `next.config` with permanent (301) redirects (section 6 below).
- Custom `not-found.tsx` linking to services and contact.
- **Check:** each page has exactly one `<h1>`; run the structured data through a validator and paste me any warnings.

### Phase 6: Queries (two forms)
- `CustomerForm` (Home section, service page sidebar, Contact) and `ApplicantForm` (`/careers` only) per `features.md` section 2 and the "Enquiry form cards" component in `design.md`: labels above inputs, inline errors, `aria-live` status, the correct privacy notice for each, honeypot named `website`, Turnstile only if env keys exist. The customer form sends a hidden `sourcePage` (current path). The applicant form's role `<select>`, the Zod enum and the email label all read from one constant in `content/roles.ts`.
- `POST /api/query/customer` and `POST /api/query/applicant` per `api.md` section 1, sharing one pipeline in this order: body-size limit → honeypot (silent 200) → rate limit → Zod validation → Turnstile (if enabled) → escape fields and strip line breaks from `name` in the subject → send mail → respond. Limits: customer 5/hour and 20/day, applicant 3/hour and 10/day, counted separately per endpoint and IP.
- `lib/mail.ts` exposes `sendCustomerEnquiry` and `sendApplicantApplication`. Applications go to `APPLICANT_TO_EMAIL`, falling back to `QUERY_TO_EMAIL` when unset.
- `lib/rateLimit.ts` is an in-memory limiter behind an interface so it can be swapped for Upstash; add a comment explaining why in-memory is weak on serverless.
- Mail failure returns `502 MAIL_FAILED` and the UI shows the error with Call/WhatsApp links and keeps the typed values. **Never show a false success.**
- **Check:** write tests for **each** endpoint: valid submit (mock the `resend` module) → 200 and exactly one `emails.send` call to the correct recipient with the correct subject; honeypot → 200 and **zero** calls; invalid phone → 400 with `fields`; missing role (applicant) or missing message (customer) → 400; rate limit exceeded (sixth customer, fourth applicant) → 429; a `name` containing `\r\n` does not change the subject line; Resend returns `{ error }` → 502; Resend throws → 502. Then search the codebase and prove no DB import exists in either query route.

### Phase 7: Updates (public)
- `models/Update.ts` per `api.md` section 6 with the listed indexes.
- `GET /api/updates`, `GET /api/updates/[slug]`; pages `/updates` (9 per page, pagination) and `/updates/[slug]` (sanitised Markdown, cover, date, reading time, CTA box, related posts, `Article` JSON-LD, `notFound()` for drafts).
- A seed script `scripts/seed.ts` that creates 3 clearly fake posts titled `[SAMPLE] ...` for local testing only.
- **Check:** a draft is invisible on the list, the detail page and the sitemap.

### Phase 8: Admin
- `POST /api/auth/login|logout`, `GET /api/auth/me`, middleware protecting `/admin/*` and `/api/admin/*` (401 for API, redirect to login for pages). Login rate limit: 5 failures per 15 minutes per IP; identical error for wrong email or password.
- Admin list, create and edit pages per `features.md` section 3.2: Markdown editor with live preview, slug auto-generation and uniqueness check (`409 SLUG_TAKEN`), SEO fields, cover upload via signed Cloudinary upload (`/api/admin/uploads/sign`), Save draft / Publish / Unpublish / Delete with confirmation.
- The owner's flow is **`/admin/login` → `/admin/updates` → New update → Publish**, exactly as in `features.md` section 3.2 and the admin wireframes in `design.md`. Include the editor toolbar (heading, bold, list, link) so the owner does not need to know Markdown, the live preview (tabs on mobile, side by side on desktop), a sticky Save draft / Publish bar on mobile, and a "View on site" link after publishing. Do not link `/admin` from the public header, footer or sitemap.
- After every create-as-published, publish, edit of a published post, unpublish and delete, call `revalidatePath` for `/updates`, the post's page (and the old slug if it changed), `/` and `/sitemap.xml`, so changes show **without a redeploy**. If revalidation throws, keep the write and return `"revalidated": false`.
- Slug change on a published post stores the old slug in `previousSlugs` and the public route 301-redirects it.
- Admin pages are `noindex`. Keep the UI plain and mobile-friendly, using the same tokens.
- **Check:** unauthenticated calls to every admin endpoint return 401; publishing from a 360 px viewport works end to end; a post published in the admin appears on `/updates`, at its URL and in `/sitemap.xml` without restarting or rebuilding; unpublishing makes it return 404.

### Phase 9: Hardening and handover
- Security headers in `next.config` (CSP that allows only Cloudinary images, the map embed and Turnstile if enabled; `X-Content-Type-Options`; `Referrer-Policy`; frame protections).
- Run Lighthouse (mobile) on Home, one service page and one update page; fix anything under 90 in any category.
- Write `README.md`: setup, env vars, how to generate `ADMIN_PASSWORD_HASH`, how to create the Resend API key and verify the sending domain (add the SPF/DKIM DNS records, wait for "Verified", then set `QUERY_FROM_EMAIL`), how to deploy (Vercel + Atlas), how to add a service, how to replace hero images, how to change the list of applicant roles (`content/roles.ts`), how to reset the admin password (generate a new `ADMIN_PASSWORD_HASH`), a **"How the owner posts an update"** section with the admin URL and the numbered steps from `features.md` section 3.2 (written for a non-technical reader), and the pre-launch checklist.
- **Final report:** a table of every acceptance criterion in `requirements.md` section 8 with PASS / FAIL / NOT TESTED and evidence. Do not mark anything PASS without having run it.

## 6. Redirect map (only used if the old domain is reused)

Old site paths → new paths, all permanent (301). Use path patterns so the old trailing IDs match.

| Old pattern | New |
|-------------|-----|
| `/page/nursing-care-services/:id` | `/services/home-nursing` |
| `/page/elderly-care-services/:id` | `/services/elderly-care` |
| `/page/patient-care-services/:id` | `/services` |
| `/page/ambulance-services/:id` | `/services/patient-transport` |
| `/page/patient-transport-vehicle/:id` | `/services/patient-transport` |
| `/page/surgical-instruments-purchased-and-rented/:id` | `/services` |
| `/page/home-attendants/:id` | `/services/bedside-attendants` |
| `/page/hospital-special-nursing-care/:id` | `/services/hospital-nursing` |
| `/page/dementia-care/:id` | `/services/dementia-care` |
| `/page/mother-and-baby-care/:id` | `/services/mother-and-baby-care` |
| `/page/patient-care-male-female-24-7/:id` | `/services/live-in-caretaker` |
| `/products/patient-care-jobs/:id` | `/careers` |
| `/products/home-nursing-services-jobs-health-care-services-at-home/:id` | `/careers` |
| `/products/ph-home-nursing-services/:id` | `/careers` |
| `/products/category/home-nursing-services-jobs/:path*` | `/careers` |
| `/products/:path*`, `/all-products/:path*` | `/services` |
| `/latest-updates/:path*`, `/latest-update/:path*` | `/updates` |
| `/mapview/:path*` | `/contact` |
| `/testimonials/:path*`, `/image-gallery/:path*`, `/pages/:path*` | `/` |

## 7. How to work with me

- Ask a question **only** when a doc contradicts another doc or a required value is missing. Otherwise decide, and note the decision in the phase summary.
- Show the file tree after Phase 1 and after Phase 5.
- Keep code readable: small components, typed props, comments only where the reason is not obvious.
- When you take a shortcut, say so in the summary. Do not hide it.
- Never claim something works without running it. If you cannot run it, say "not verified".

## 8. Definition of done

- All pages in `features.md` section 1.1 exist and render without JavaScript.
- Both forms (customer enquiry and job applicant) send email to the right inbox, store nothing, and pass every test in Phase 6.
- `/careers` exists, is in the sitemap, is linked from the footer and Contact, and has no `JobPosting` markup.
- The owner can go to `/admin/login`, sign in, tap New update and publish; the post appears on `/updates`, at its own URL and in `/sitemap.xml` without a redeploy.
- Hero carousel matches `design.md` section 6 including pause control and reduced-motion behaviour.
- Lighthouse mobile ≥ 90 in all four categories on Home, a service page and an update page.
- `.env.example` and `README.md` are complete; `npm run build` passes with zero lint errors.
- Every `OWNER-CONFIRM` and `OWNER-REVIEW` marker is listed in the final report so the owner knows exactly what to verify before launch.
