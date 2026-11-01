# Features

Three features. Everything else on the site exists to support them.

| # | Feature | Stored in DB? | Priority |
|---|---------|---------------|----------|
| 1 | SEO | No | **Main** |
| 2 | Queries: two forms (customer enquiry, job applicant), both sent by direct email | **No** | Required |
| 3 | Updates (blog) | Yes (updates only) | Required |

---

## 1. SEO (main feature)

**Goal:** rank for local, high-intent searches such as "home nursing services in Bengaluru", "elderly care at home Bengaluru", "post-operative nurse at home", "dementia care Bengaluru", "home nurse jobs in Bengaluru".

### 1.1 Site structure (all indexable)

| Path | Purpose | Primary keyword theme |
|------|---------|-----------------------|
| `/` | Home | home nursing services Bengaluru |
| `/services` | Service index | home care services Bengaluru |
| `/services/home-nursing` | Home nursing | home nurse at home |
| `/services/elderly-care` | Elderly care | elderly care at home |
| `/services/post-hospital-care` | Post-op / post-discharge | post operative care at home |
| `/services/dementia-care` | Dementia and Alzheimer's | dementia care at home |
| `/services/bedside-attendants` | Bedside attendants | patient attendant Bengaluru |
| `/services/mother-and-baby-care` | Mother and baby | postnatal care at home |
| `/services/hospital-nursing` | Hospital special nursing | hospital special nurse |
| `/services/live-in-caretaker` | 24/7 live-in caretaker | live-in caretaker Bengaluru |
| `/services/patient-transport` | Patient transport / ambulance | patient transport Bengaluru |
| `/about` | About and trust | – |
| `/faq` | FAQ | question-style searches |
| `/updates` | Blog list | long-tail informational |
| `/updates/[slug]` | Blog post | long-tail informational |
| `/careers` | Careers: applicant form | home nurse jobs Bengaluru |
| `/contact` | Contact and customer form | NAP (name, address, phone) |

Equipment rental/sale from the old site is covered as a short section inside relevant service pages and the FAQ, not as a catalogue. The service list above is a proposal; the owner confirms which services are genuinely offered before launch.

### 1.2 Technical SEO

- Server-rendered / static pages; no content that depends on client JS.
- Per-page `<title>`, meta description, canonical, Open Graph and Twitter cards through the Next.js Metadata API.
- `/sitemap.xml` generated from the static page list plus published updates (with `lastmod`); `/robots.txt` allows all and points at the sitemap; draft updates and `/admin` are `noindex` and disallowed.
- Redirect map from old URLs (see `requirements.md` FR-S7). Old job-style product pages redirect to `/careers`.
- Core Web Vitals targets in `requirements.md` section 5; fonts via `next/font`; images via `next/image`.
- Internal linking: each service links to 2 related services and the customer form; each update links to 1–2 relevant services; `/careers` is linked from the footer and from the Contact page.
- Custom 404 page that links to services and contact.

### 1.3 Structured data (JSON-LD)

- Site-wide: `LocalBusiness` (type `MedicalBusiness`) with name, URL, logo, telephone, email, address, geo, opening hours, `areaServed`.
- `BreadcrumbList` on all inner pages.
- `FAQPage` on `/faq` and on service pages that have FAQs.
- `Article` on each update (headline, datePublished, dateModified, image, author = business).
- No fabricated `aggregateRating` or `Review` markup. Only add rating markup when genuine, consented reviews exist.
- **No `JobPosting` markup.** `/careers` is an open application form, not a posted vacancy. `JobPosting` is only valid for a real, specific opening; faking it breaks Google's guidelines and can cost rankings.

### 1.4 On-page content rules

- One `h1` per page containing the main keyword naturally.
- 400+ words of unique, useful copy on each service page: what's included, who it suits, how it works, what to prepare, FAQs.
- No keyword stuffing, no duplicate paragraphs across pages, no claims the owner cannot back up.
- Always show the same business name, address and phone number (matching the Google Business Profile).

### 1.5 Off-site (checklist for the owner, not code)

- Claim and complete the Google Business Profile; post updates there.
- Submit the sitemap in Google Search Console and Bing Webmaster Tools.
- Collect real Google reviews from happy families (with permission).
- List the business in relevant local directories using identical name/address/phone.

### 1.6 Acceptance

- Rich Results Test passes; Search Console shows no coverage errors; Lighthouse SEO = 100 on Home, a service page, an update page and `/careers`.

---

## 2. Queries (two forms, direct email)

**Goal:** a family member or a job applicant sends their details and they land in the owner's inbox. **Nothing is saved by the application, for either form.**

### 2.0 The two forms at a glance

| | Customer enquiry | Job applicant |
|---|------------------|---------------|
| Who | Families needing care | Nurses and caregivers seeking work |
| Where it appears | Home page (section), every service page (sidebar card), Contact page | `/careers` only |
| Endpoint | `POST /api/query/customer` | `POST /api/query/applicant` |
| Email goes to | `QUERY_TO_EMAIL` | `APPLICANT_TO_EMAIL`, falling back to `QUERY_TO_EMAIL` if unset |
| Email subject | `New customer enquiry – {name}` | `New job application – {roleLabel} – {name}` |
| Rate limit per IP | 5 per hour, 20 per day | 3 per hour, 10 per day |
| Button text | **Send request** | **Apply now** |

Persistent Call and WhatsApp buttons appear everywhere as the non-form route.

### 2.1 Customer enquiry: fields

| Field | Required | Rules |
|-------|----------|-------|
| Name | Yes | 2–80 chars |
| Phone | Yes | Indian mobile, 10 digits (optional +91), normalised |
| Email | No | Valid format if given. Optional because many families only share a phone number |
| Message | Yes | 10–1000 chars |
| `sourcePage` (hidden) | Auto | Path of the page the form was sent from (e.g. `/services/elderly-care`), so the owner knows which service the visitor was reading. Must match `^/[a-z0-9\-/]*$`; otherwise ignored |
| `website` (honeypot, hidden) | Hidden | Must be empty |

### 2.2 Job applicant: fields

| Field | Required | Rules |
|-------|----------|-------|
| Name | Yes | 2–80 chars |
| Phone | Yes | Indian mobile, 10 digits (optional +91), normalised |
| Email | Yes | Valid format. Required so the owner can reply and ask for documents |
| Service type / role | Yes | Native `<select>`, one of the values below |
| `website` (honeypot, hidden) | Hidden | Must be empty |

Role options (they mirror the service pages; the owner confirms the final list, `OWNER-CONFIRM`):

| Value | Label |
|-------|-------|
| `nurse` | Nurse |
| `bedside-attendant` | Bedside attendant |
| `elderly-caretaker` | Elderly caretaker |
| `dementia-caretaker` | Dementia / Alzheimer's caretaker |
| `mother-baby-caretaker` | Mother and baby caretaker |
| `live-in-caretaker` | Live-in caretaker |
| `patient-transport-driver` | Patient transport driver |
| `other` | Other |

**No CV or file upload.** Uploads would need file storage, which this project does not have. The success message tells applicants the team will contact them to request documents.

### 2.3 Behaviour (both forms)

1. Client does basic validation and disables the button while sending.
2. The endpoint validates again on the server (never trust the client).
3. Bots are rejected silently (honeypot filled, or Turnstile fails if enabled).
4. Server sends one email to the right inbox through the Resend API with all fields and a timestamp (IST). `replyTo` is set to the sender's email when present (always present for applicants). Resend's `send()` returns an `error` object instead of throwing on API errors, so any returned `error` (or a thrown network failure) is treated as a mail failure.
5. Response is returned. Success messages:
   - Customer: "Thanks, we'll call you back soon."
   - Applicant: "Thanks for applying. We'll contact you if there is a suitable opening."
   - Failure (both): an error message with the phone and WhatsApp links.
6. **No database insert, no file write, no request-body logging.** Only a non-sensitive log line is allowed: form type, status and timestamp.

### 2.4 Abuse protection

- Per-IP limits as in the table in 2.0, tracked separately per form.
- Honeypot field; optional Cloudflare Turnstile.
- Max request body 10 KB; reject non-JSON.
- HTML in any field is escaped before it goes into the email body.
- Line breaks are stripped from `name` before it goes into the subject, and the email must pass strict validation before it is used as `replyTo`, so a visitor cannot inject extra headers or recipients.

### 2.5 Privacy

- Notice under the customer form: "Your details are sent to us by email and are not stored on this website."
- Notice under the applicant form: "Your details are sent to us by email and are not stored on this website. We may contact you about suitable openings."
- Because the site saves nothing, the owner's mailbox is the only record the site creates; the owner is responsible for that mailbox. Applicant details are personal data of job seekers: the owner should not forward them casually or keep them longer than needed.
- "Not stored" means **not stored by this website**. Resend processes every message and keeps its own delivery logs, which can include the message content, in its dashboard for its own retention period. Tell the owner this, restrict dashboard access to the owner, and do not promise visitors that the data exists nowhere else.

### 2.6 `/careers` page content

- `h1` containing the keyword naturally (for example "Careers: nursing and caregiver jobs in Bengaluru").
- 2–3 sentences on who the business looks for, a short list of the role types from 2.2, and a plain "how it works" (apply, we contact you, we ask for documents).
- The applicant form.
- Nothing about salary, benefits or guaranteed placement unless the owner confirms it in writing (`OWNER-CONFIRM`). If it is true, the owner may add "We never charge applicants any fee"; do not publish that line unconfirmed.

### 2.7 Acceptance

- Customer form: email arrives in `QUERY_TO_EMAIL` within 30 seconds with name, phone, email (or "not given"), message, source page.
- Applicant form: email arrives in `APPLICANT_TO_EMAIL` (or the fallback) with name, phone, email, role label.
- DB inspection shows no enquiry or application data.
- A submission with the honeypot filled sends no email, for either form.
- The sixth customer submission within an hour from one IP returns HTTP 429; the fourth applicant submission does.
- A name containing a line break cannot alter the subject or headers.
- Mail provider failure shows the error state, not a false success.

---

## 3. Updates (blog)

**Goal:** the owner publishes helpful posts (care tips, service news, announcements) that feed long-tail SEO.

### 3.1 Public side

- `/updates`: card grid (cover, date, title, excerpt), 9 per page, newest first, pagination.
- `/updates/[slug]`: Markdown rendered to sanitised HTML, cover image, date, reading time, call-to-action box, related posts.
- Only `published` posts are visible; drafts return 404.

### 3.2 Admin side (owner only)

**Where the owner posts updates:** on the same website, at `https://{{DOMAIN}}/admin/login`. There is no link to it from the public site (it is `noindex`), so the owner bookmarks it on his phone and computer.

| URL | What it is |
|-----|------------|
| `/admin/login` | Email and password. Success sets an httpOnly, Secure cookie and goes to the list |
| `/admin/updates` | List of all updates with status (Draft / Published), date, and Edit / Unpublish / Delete actions, plus a **New update** button |
| `/admin/updates/new` | Editor for a new update |
| `/admin/updates/[id]` | Editor for an existing update |

**How the owner posts an update (the steps he follows):**

1. Open `/admin/login` and sign in.
2. On the list, tap **New update**.
3. Enter the **title** (the web address is generated automatically and can be edited) and a short **excerpt**.
4. Upload a **cover image** (optional) and write its alt text.
5. Write the **body** in the editor. A small toolbar inserts headings, bold, lists and links so he does not need to know Markdown; a live preview shows how it will look.
6. Optionally fill the **SEO title and description**. If left empty, the title and the first 160 characters of the body are used.
7. Tap **Save draft** to keep working later, or **Publish** to make it live. A published update appears on `/updates`, on its own page and in the sitemap within a minute.
8. To change or hide it later: open it from the list, edit and press **Publish** again, or press **Unpublish** (it returns 404 publicly and leaves the sitemap).

Editor fields:
- Title, slug (auto, editable), excerpt
- Cover image upload (Cloudinary)
- Markdown body with toolbar and live preview
- SEO title and meta description (optional overrides)
- Save draft / Publish / Unpublish / Delete (with confirm)

Admin pages are `noindex`, excluded from the sitemap and disallowed in `robots.txt`.

Forgotten password: there is no reset page. The developer generates a new `ADMIN_PASSWORD_HASH` and updates the environment variable (documented in the README).

### 3.3 Rules

- Slugs are unique, lowercase, hyphenated; changing a published slug creates a redirect from the old one.
- Publishing sets `publishedAt`; editing updates `updatedAt` (feeds `dateModified` and sitemap `lastmod`).
- **Publish, edit, unpublish and delete trigger on-demand revalidation** (`revalidatePath` for `/updates`, the post page, `/` and the sitemap). Without this, statically generated pages would keep showing old content until the next deploy.
- Excerpt defaults to the first 160 characters of the body if empty.
- Markdown output is sanitised (no scripts, no iframes).
- Content written by the owner must be general information, not individual medical advice.

### 3.4 Acceptance

- A new post published from a phone appears on `/updates`, at its own URL and in `/sitemap.xml` within one minute, **without a redeploy**.
- An unpublished post disappears from all three and returns 404.
- The owner can complete steps 1–7 above on a 360 px phone screen without developer help.
- Unauthenticated calls to admin endpoints return 401.
