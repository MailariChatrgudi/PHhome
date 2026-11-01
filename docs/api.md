# API Reference

Base URL: same origin as the site, `https://homenursingservice.in/api`
Format: JSON (`Content-Type: application/json`) unless noted.
Implementation: Next.js route handlers.

---

## Conventions

**Success:** `2xx` with a JSON body.
**Error shape (all errors):**
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable message", "fields": { "phone": "Enter a valid 10-digit mobile number" } } }
```
`fields` is present only for validation errors.

| Status | Code | Meaning |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Body failed validation |
| 401 | `UNAUTHENTICATED` | Missing or invalid admin session |
| 404 | `NOT_FOUND` | Resource missing (or draft requested publicly) |
| 409 | `SLUG_TAKEN` | Slug already used by another update |
| 413 | `PAYLOAD_TOO_LARGE` | Body above limit |
| 429 | `RATE_LIMITED` | Too many requests (`Retry-After` header set) |
| 502 | `MAIL_FAILED` | Mail provider rejected or timed out |
| 500 | `SERVER_ERROR` | Unexpected failure |

**Auth:** admin endpoints require the `session` cookie (JWT, `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`). Same origin, so `Lax` is sufficient. If the API is ever hosted on a different origin, change to `SameSite=None; Secure` and configure CORS with credentials.

---

## 1. Queries (mail only, no database)

Two public endpoints share the same pipeline. **Neither writes to any database, file or log of the request body.**

| Endpoint | Form | Goes to | Rate limit per IP |
|----------|------|---------|-------------------|
| `POST /api/query/customer` | Customer enquiry | `QUERY_TO_EMAIL` | 5/hour, 20/day |
| `POST /api/query/applicant` | Job applicant | `APPLICANT_TO_EMAIL` (falls back to `QUERY_TO_EMAIL`) | 3/hour, 10/day |

Counters are kept per endpoint and per IP.

**Shared server behaviour (in this order)**
1. Reject body > 10 KB or non-JSON (`413` / `400`).
2. If `website` (honeypot) is non-empty: return `200 { "ok": true }` and send nothing (don't tip off bots).
3. Check the rate limit for this endpoint and IP (`429`).
4. Validate with Zod (`400` with `fields`).
5. Verify Turnstile if enabled.
6. Escape all fields; strip `\r` and `\n` from `name` before it goes into the subject.
7. Send the email with the Resend SDK (`resend.emails.send`). Resend returns `{ data, error }` instead of throwing on API errors: if `error` is set, or the call throws, respond `502 MAIL_FAILED`.
8. Return `200 { "ok": true }`. Log only `{ form, status, timestamp }`.

### 1.1 `POST /api/query/customer`

**Request**
```json
{
  "name": "Anita Rao",
  "phone": "9876543210",
  "email": "anita@example.com",
  "message": "My father needs a night attendant after discharge.",
  "sourcePage": "/services/elderly-care",
  "website": "",
  "turnstileToken": "optional-if-enabled"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | yes | 2–80 chars, trimmed |
| `phone` | string | yes | `^(\+91)?[6-9]\d{9}$` after stripping spaces/dashes |
| `email` | string | no | valid email, ≤ 120 chars |
| `message` | string | yes | 10–1000 chars |
| `sourcePage` | string | no | `^/[a-z0-9\-/]*$`, ≤ 200 chars; if it does not match it is ignored, not an error |
| `website` | string | no | honeypot, **must be empty** |
| `turnstileToken` | string | only if Turnstile enabled | verified server-side |

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "ok": true }` |
| 400 | `VALIDATION_ERROR` with `fields` |
| 413 | `PAYLOAD_TOO_LARGE` (body > 10 KB) |
| 429 | `RATE_LIMITED` (5/hour, 20/day per IP) |
| 502 | `MAIL_FAILED` |

**Email to the owner**
- To: `QUERY_TO_EMAIL`
- From: `QUERY_FROM_EMAIL`
- Reply-To: visitor's email if given
- Subject: `New customer enquiry – {name}`
- Body (plain text + simple HTML): name, phone, email (or "not given"), message, source page, received time (IST).

### 1.2 `POST /api/query/applicant`

**Request**
```json
{
  "name": "Ravi Kumar",
  "phone": "9123456780",
  "email": "ravi@example.com",
  "role": "bedside-attendant",
  "website": "",
  "turnstileToken": "optional-if-enabled"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | yes | 2–80 chars, trimmed |
| `phone` | string | yes | `^(\+91)?[6-9]\d{9}$` after stripping spaces/dashes |
| `email` | string | yes | valid email, ≤ 120 chars |
| `role` | string | yes | one of: `nurse`, `bedside-attendant`, `elderly-caretaker`, `dementia-caretaker`, `mother-baby-caretaker`, `live-in-caretaker`, `patient-transport-driver`, `other` |
| `website` | string | no | honeypot, **must be empty** |
| `turnstileToken` | string | only if Turnstile enabled | verified server-side |

The role list lives in one shared constant (`content/roles.ts`), used by the form's `<select>`, the Zod enum and the email label, so they cannot drift apart.

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "ok": true }` |
| 400 | `VALIDATION_ERROR` with `fields` |
| 413 | `PAYLOAD_TOO_LARGE` (body > 10 KB) |
| 429 | `RATE_LIMITED` (3/hour, 10/day per IP) |
| 502 | `MAIL_FAILED` |

**Email to the owner**
- To: `APPLICANT_TO_EMAIL` (or `QUERY_TO_EMAIL` if unset)
- From: `QUERY_FROM_EMAIL`
- Reply-To: applicant's email (always present)
- Subject: `New job application – {roleLabel} – {name}`
- Body (plain text + simple HTML): name, phone, email, role label, received time (IST).

### 1.3 Resend notes (both endpoints)

- `QUERY_FROM_EMAIL` is an address on a domain verified in Resend (for example `enquiries@yourdomain.in`) with its SPF/DKIM DNS records in place, so it passes authentication.
- One client module (`lib/mail.ts`) creates `new Resend(process.env.RESEND_API_KEY)` and is the only file that imports the SDK. It exposes one function per form (`sendCustomerEnquiry`, `sendApplicantApplication`).
- Field names in the SDK call are `from`, `to`, `replyTo`, `subject`, `html`, `text`. Send both `html` and `text`.
- Until the sending domain is verified, Resend's sandbox sender `onboarding@resend.dev` can only deliver to the account owner's own address. That is fine for local testing and **not** usable in production. Check Resend's current docs for this behaviour and for free-tier sending limits before launch.
- Resend keeps delivery logs in its dashboard. The site does not write the enquiry or application anywhere, but the provider does (see `features.md` section 2.5).

**Rate limiting note:** an in-memory limiter works for a single server instance. On serverless hosting use an external store (e.g. Upstash Redis) or rely on Turnstile, since in-memory counters reset per instance. This store holds only counters, never enquiry or application content.

---

## 2. Updates (public)

### `GET /api/updates`

List published updates, newest first.

**Query params:** `page` (default 1), `limit` (default 9, max 30)

**200**
```json
{
  "items": [
    {
      "slug": "caring-for-a-parent-after-surgery",
      "title": "Caring for a parent after surgery",
      "excerpt": "Five things to prepare before discharge.",
      "coverImage": { "url": "https://res.cloudinary.com/...", "alt": "..." },
      "publishedAt": "2026-10-20T06:30:00.000Z",
      "updatedAt": "2026-10-21T08:10:00.000Z"
    }
  ],
  "page": 1,
  "limit": 9,
  "total": 14,
  "totalPages": 2
}
```

### `GET /api/updates/:slug`

One published update. Returns `404 NOT_FOUND` for drafts and unknown slugs.

**200**
```json
{
  "slug": "caring-for-a-parent-after-surgery",
  "title": "Caring for a parent after surgery",
  "excerpt": "Five things to prepare before discharge.",
  "content": "## Before discharge\n...markdown...",
  "coverImage": { "url": "https://res.cloudinary.com/...", "alt": "..." },
  "seo": { "title": "Caring for a parent after surgery | {{BRAND_NAME}}", "description": "..." },
  "publishedAt": "2026-10-20T06:30:00.000Z",
  "updatedAt": "2026-10-21T08:10:00.000Z"
}
```
Markdown is sanitised to HTML at render time on the server.

---

## 3. Admin authentication

Single owner account. Credentials come from environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`), so there is no users collection.

### Admin pages (UI routes, where the owner posts updates)

| URL | Purpose | Protected |
|-----|---------|-----------|
| `/admin/login` | Sign in | No (public, `noindex`, not linked from the site) |
| `/admin/updates` | List, filter by status, New update button | Yes |
| `/admin/updates/new` | Create an update | Yes |
| `/admin/updates/[id]` | Edit, publish, unpublish, delete | Yes |

Unauthenticated visits to a protected page redirect to `/admin/login`. After login the owner lands on `/admin/updates`. The full step-by-step flow is in `features.md` section 3.2.

### `POST /api/auth/login`
```json
{ "email": "owner@example.com", "password": "••••••••" }
```
- **200** `{ "ok": true }` and sets the `session` cookie.
- **401** `UNAUTHENTICATED` (same message for wrong email or wrong password).
- **429** after 5 failed attempts per IP in 15 minutes.

### `POST /api/auth/logout`
- **200** `{ "ok": true }`, clears the cookie.

### `GET /api/auth/me`
- **200** `{ "email": "owner@example.com" }` or **401**.

---

## 4. Updates (admin) – all require the `session` cookie

### `GET /api/admin/updates`
All updates, including drafts. Params: `page`, `limit`, `status` (`draft` | `published`).
**200** same shape as the public list, plus `status` and `_id` on each item.

### `GET /api/admin/updates/:id`
One update by id, including drafts, full `content`.

### `POST /api/admin/updates`
```json
{
  "title": "Caring for a parent after surgery",
  "slug": "caring-for-a-parent-after-surgery",
  "excerpt": "Five things to prepare before discharge.",
  "content": "## Before discharge\n...",
  "coverImage": { "url": "https://res.cloudinary.com/...", "publicId": "updates/abc123", "alt": "..." },
  "seo": { "title": "", "description": "" },
  "status": "draft"
}
```
- `title` required (3–120 chars); `slug` optional (generated from title); `content` required for publishing; `status` is `draft` or `published`.
- **201** the created update. **409** `SLUG_TAKEN`. **400** `VALIDATION_ERROR`.
- If created as `published`, revalidate (see below).

### `PUT /api/admin/updates/:id`
Full or partial update of the same fields.
- Changing `status` to `published` for the first time sets `publishedAt`.
- Changing the slug of a published update stores the old slug in `previousSlugs` so the old URL redirects (301).
- Always sets `updatedAt`.
- **200** the updated document.

### `DELETE /api/admin/updates/:id`
- **200** `{ "ok": true }`. Removes the cover image from Cloudinary on a best-effort basis.

### `POST /api/admin/uploads/sign`
Returns a signed Cloudinary upload payload so the browser uploads directly and the API secret never leaves the server.
**200**
```json
{ "cloudName": "...", "apiKey": "...", "timestamp": 1761200000, "signature": "...", "folder": "updates" }
```

### Revalidation (so new posts appear without a redeploy)
After any successful create-as-published, publish, edit of a published post, unpublish, or delete, the handler calls `revalidatePath` for `/updates`, `/updates/{slug}` (and the old slug if it changed), `/` and `/sitemap.xml`. If revalidation throws, the write still succeeds and the response includes `"revalidated": false` so the failure is visible rather than silent.

---

## 5. Non-JSON routes (SEO)

| Route | Description |
|-------|-------------|
| `GET /sitemap.xml` | Static pages (including `/careers`) + published updates, with `lastmod` |
| `GET /robots.txt` | `Allow: /`, `Disallow: /admin`, `Disallow: /api`, `Sitemap:` line |

---

## 6. Data model (the only collection)

**`updates`**
```js
{
  _id: ObjectId,
  title: String,              // required
  slug: String,               // required, unique, lowercase
  previousSlugs: [String],    // for 301 redirects
  excerpt: String,
  content: String,            // Markdown
  coverImage: { url: String, publicId: String, alt: String },
  seo: { title: String, description: String },
  status: "draft" | "published",
  publishedAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: { slug: 1 } unique; { status: 1, publishedAt: -1 }
```
There is **no collection for customer enquiries or job applications.**

---

## 7. Environment variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Atlas connection (updates only) |
| `JWT_SECRET` | Signs the admin session |
| `ADMIN_EMAIL` | Owner login email |
| `ADMIN_PASSWORD_HASH` | bcrypt/argon2 hash of the owner password |
| `RESEND_API_KEY` | Resend API key. Server only: never prefix with `NEXT_PUBLIC_`, never commit |
| `QUERY_TO_EMAIL` | Inbox that receives customer enquiries |
| `APPLICANT_TO_EMAIL` | Inbox that receives job applications. Optional; falls back to `QUERY_TO_EMAIL` |
| `QUERY_FROM_EMAIL` | Sender address on a domain verified in Resend |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads |
| `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional bot protection |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, schema |
