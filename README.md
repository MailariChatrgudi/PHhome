# PH Home Nursing Services — Website & Publishing Platform

A fast, search-optimised, modern web application and content publishing platform for **PH Home Nursing Services** (Bengaluru, Karnataka). Built to rank on Google for local healthcare searches, deliver high-intent customer enquiries and job applications directly to the owner's inbox with zero database PII exposure, and empower the business owner to publish care guides from any mobile phone or computer.

---

## 1. Architecture & Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 | Server-Side Rendering (SSR) & Static Site Generation (SSG) for SEO |
| **Language & Styling** | TypeScript 5 + Tailwind CSS v4 | Type safety and strict Brand Color System v2 tokens |
| **Database** | MongoDB Atlas (via Mongoose) | **Updates/Blog collection only** — zero enquiry or visitor PII stored |
| **Email Delivery** | Resend API (Node.js SDK) | High-deliverability transactional email directly from verified domain |
| **Admin Auth** | Edge JWT (`jose`) + `bcryptjs` | Single-owner authentication without database user records |
| **Media Hosting** | Cloudinary | Authenticated direct browser-to-Cloudinary image uploads |
| **Deployment** | Vercel | Global edge CDN, automated SSL, Partial Prerendering (PPR) |

---

## 2. Quickstart & Local Setup

### Prerequisites
- Node.js `v20.x` or `v22.x+` (tested on Node.js v24)
- npm `v10+`

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the website.

### Run Verification & Tests
```bash
# Run unit & integration test suite (40 tests across 11 suites)
npm test

# Run ESLint validation
npm run lint

# Run production build
npm run build
```

---

## 3. Environment Variables Reference

Configure these in `.env.local` for local development, and in your **Vercel Project Settings → Environment Variables** for production.

| Variable | Required | Description | Example |
|---|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string (used only for the `updates` collection). | `mongodb+srv://user:pass@cluster.mongodb.net/ph_home?retryWrites=true&w=majority` |
| `JWT_SECRET` | Yes | Random 32+ character string used to cryptographically sign session cookies. | `c48f219d...` |
| `ADMIN_EMAIL` | Yes | Email address used by the business owner to sign in at `/admin/login`. | `owner@homenursingservice.in` |
| `ADMIN_PASSWORD_HASH` | Yes | `bcrypt` hash of the owner's password (never store plain text). | `$2a$12$...` |
| `RESEND_API_KEY` | Yes | Resend API key for sending email notifications. **Server only** (never prefix with `NEXT_PUBLIC_`). | `re_123456789...` |
| `QUERY_TO_EMAIL` | Yes | Destination inbox that receives incoming customer care enquiries. | `enquiries@homenursingservice.in` |
| `APPLICANT_TO_EMAIL` | No | Destination inbox for job applications (defaults to `QUERY_TO_EMAIL` if omitted). | `careers@homenursingservice.in` |
| `QUERY_FROM_EMAIL` | Yes | Verified sender address on your custom domain in Resend. | `notifications@homenursingservice.in` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account cloud name for cover image hosting. | `ph-home-care` |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API Key. | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API Secret (used on the server to sign client upload requests). | `abcdefghijklmnopqrstuvwxyz` |
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile server secret (leave blank to disable). | `0x4AAAAAA...` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile public site key (leave blank to disable). | `0x4AAAAAA...` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site origin without trailing slash. | `https://homenursingservice.in` |

---

## 4. Security & Authentication Setup

### Generating the Admin Password Hash
To set up or change the owner password, generate a secure `bcrypt` hash using Node.js:

```bash
node -e "const b=require('bcryptjs'); b.hash('YourChosenPasswordHere', 12).then(console.log)"
```

Copy the output string (starts with `$2a$12$...` or `$2b$12$...`) and assign it to `ADMIN_PASSWORD_HASH` in `.env.local` or Vercel.

### Resetting the Admin Password
To reset the password:
1. Run the one-liner command above with the new password.
2. Update the `ADMIN_PASSWORD_HASH` variable in Vercel (or `.env.local`).
3. Redeploy or restart the application. All existing sessions will remain valid until expiration, while new logins will require the new password.

---

## 5. Email Setup (Resend) & Domain Verification

The site sends customer enquiries and job applications directly to the owner's inbox without storing PII in any database.

1. **Create an Account:** Sign up at [resend.com](https://resend.com) and create an API Key.
2. **Add Your Domain:** In the Resend Dashboard, navigate to **Domains → Add Domain** (`homenursingservice.in`).
3. **Configure DNS Records:** Add the DNS records provided by Resend to your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.):
   * **DKIM Record:** `TXT` record with name `resend._domainkey` and the provided public key.
   * **SPF Record:** `TXT` record with value `v=spf1 include:resend.com ~all`.
4. **Verify Domain:** Wait for Resend to confirm verification status (usually under 15 minutes).
5. **Configure Variables:**
   * Set `RESEND_API_KEY` = your Resend API Key.
   * Set `QUERY_FROM_EMAIL` = `enquiries@homenursingservice.in` (or any address on the verified domain).
   * Set `QUERY_TO_EMAIL` = your personal or business receiving inbox.

---

## 6. How the Owner Posts an Update (Non-Technical Guide)

> **Bookmark this URL on your phone and computer:**  
> `https://homenursingservice.in/admin/login`  
> *(This page is hidden from search engines and not linked in public menus)*

### Step-by-Step Publishing Instructions:
1. **Sign In:**
   * Open `https://homenursingservice.in/admin/login`.
   * Enter your admin email and password, then tap **Sign In**.
2. **Start a New Article:**
   * From the updates dashboard, tap the plum **+ New Update** button.
3. **Add Title & Summary:**
   * Enter your **Title** (e.g. *"Tips for Post-Surgery Care at Home"*). The web address (`slug`) is created automatically.
   * Choose a **Category** (e.g., Care Guide, Elderly Care, Recovery).
   * Write a 1–2 sentence **Excerpt** (this summary appears on cards on the homepage and blog listing).
4. **Add a Cover Photo (Optional):**
   * Tap **Upload Image** to select a photo from your phone or computer.
   * Enter a short **Alt text** describing the photo (e.g., *"Caregiver assisting senior with mobility"*).
5. **Write the Article Content:**
   * Type your article in the editor.
   * Use the easy formatting buttons above the text box to insert **Headings (H2, H3)**, **Bold text**, **Bullet points**, or **Web links**.
   * Tap the **Preview** tab anytime to see exactly how your article will look to visitors.
6. **Publish or Save Draft:**
   * Tap **Save Draft** if you want to finish it later.
   * Tap **Publish** to make it live immediately.
7. **It's Live:**
   * Your new update will instantly appear on `/updates`, on its own web page, and in `sitemap.xml` within 1 minute — no developer or website rebuild required!
8. **To Edit or Unpublish:**
   * Tap **Edit** on any article from your admin list to make changes.
   * Tap **Unpublish** anytime to immediately hide the post from the public.

---

## 7. How to Update Site Content (Developer Guide)

All structured marketing copy and business data live in typed configuration files:

* **Services List & Details (`content/services.ts`):**  
  To add a service or update service descriptions, features, or checklists, edit the `services` array in [`content/services.ts`](file:///e:/Projects/PHHome/content/services.ts).
* **Job Roles for Careers (`content/roles.ts`):**  
  To add or remove roles available in the career application dropdown, edit the `JOB_ROLES` list in [`content/roles.ts`](file:///e:/Projects/PHHome/content/roles.ts).
* **Frequently Asked Questions (`content/faq.ts`):**  
  To update FAQ items and their structured `FAQPage` schema, edit [`content/faq.ts`](file:///e:/Projects/PHHome/content/faq.ts).
* **Hero Carousel Images (`components/HeroCarousel.tsx`):**  
  Hero slide media is stored in `public/brand/` (`GifImage1.gif`, `GifImage2.gif`, `GifImage3.gif`). To update or add slides, replace files in `public/brand/` and update the `slides` array in [`components/HeroCarousel.tsx`](file:///e:/Projects/PHHome/components/HeroCarousel.tsx).

---

## 8. Deployment Guide (Vercel + MongoDB Atlas)

### Step 1: Set Up MongoDB Atlas (Free Tier)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a free M0 cluster (select the `ap-south-1` Mumbai region for lowest latency to Bengaluru visitors).
3. Under **Database Access**, create a user (e.g., `ph_admin`) with read/write privileges.
4. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) so Vercel Serverless Functions can connect.
5. Under **Database → Connect → Drivers**, copy the connection URI and replace `<password>` with your database user password.

### Step 2: Deploy to Vercel
1. Push your repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **Add New → Project**.
3. Import your repository. Next.js settings will be automatically detected.
4. Expand **Environment Variables** and enter all keys from Section 3 above.
5. Click **Deploy**.

### Step 3: Seed Initial Sample Articles (Optional)
Once your database is connected, you can seed sample care guides for initial testing:
```bash
npm run seed
```

---

## 9. Security, Privacy & Compliance

* **Content Security Policy (CSP):** Strict CSP configured in [`next.config.ts`](file:///e:/Projects/PHHome/next.config.ts) whitelisting only Cloudinary for user media, Google Maps iframe, and Cloudflare Turnstile.
* **HTTP Security Headers:** Includes `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
* **Zero PII Storage:** Form submissions are immediately processed and transmitted to authenticated inboxes over TLS; no customer or job applicant data is ever written to MongoDB.
* **Anti-Spam & Rate Limiting:**
  * Silent honeypot field (`website`) traps automated bots without user friction.
  * In-memory sliding window rate limits protect both enquiry forms (5/hour, 20/day per IP) and admin login endpoints (5 attempts per 15 min per IP).
* **301 Permanent Redirects:** 18 legacy Boost-360 URL patterns are permanently mapped in [`redirects.ts`](file:///e:/Projects/PHHome/redirects.ts) to protect legacy search rankings.

---

## 10. Pre-Launch Checklist

- [ ] Domain verified with green checkmarks in Resend (SPF & DKIM DNS records).
- [ ] `QUERY_TO_EMAIL` tested by submitting the contact form on `/contact` and confirming email receipt.
- [ ] `APPLICANT_TO_EMAIL` tested by submitting a job application on `/careers`.
- [ ] Verified that **zero enquiry or applicant records exist in MongoDB Atlas**.
- [ ] Admin password hash created with `bcryptjs` and tested on `/admin/login`.
- [ ] Test update published via `/admin/updates/new` and verified live on `/updates`.
- [ ] Robots.txt confirmed at `/robots.txt` (disallowing `/admin` and `/api`).
- [ ] Sitemap confirmed at `/sitemap.xml` with proper `lastmod` dates.
- [ ] Google Search Console and Google Business Profile linked to canonical URL.
