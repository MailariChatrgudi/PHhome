# Design System

Style: **modern, minimal, calm.** The audience is a worried family member on a phone. The design must feel clean, human and trustworthy, never clinical or cluttered.

The theme is taken directly from the logo: **plum-magenta** (the nurse and the ring) and **deep blue** (the hands), on a soft off-white.

---

## 1. Principles

1. **One action per screen.** The primary action is always "Call" or "Send a request".
2. **Whitespace is trust.** Generous spacing, few elements, no decoration for its own sake.
3. **Real over stock.** Real photos of real caregivers are preferred. Until they exist, the hero may use illustrations drawn in the brand palette (plum and blue only). No generic stock-hospital photos, no off-palette clip-art.
4. **Legible first.** Large body text, high contrast, plain language.
5. **Fast is a design feature.** No sliders, autoplay or heavy animation anywhere **except the hero carousel** (section 6), which has strict performance and accessibility rules, plus **one attention animation**: a subtle pulse ring on the hero Call button (section 5.1, D2).
6. **60 / 30 / 10 Rule.** About 60% neutral surfaces (`--bg`, `--surface`), 30% plum and blue tints and dark brand sections, 10% saturated accents (plum actions, amber attention).

## 2. Brand colours (from the logo)

Read from the supplied logo image by eye. **Before launch, confirm each hex with an eyedropper on the original logo file** (or ask the client for the brand file) and adjust the tokens below if they differ.

| Logo element | Hex | Token |
|--------------|-----|-------|
| Nurse figure, cap, leaves | `#A31758` | `--plum` |
| Outer ring | `#B0215A` | `--plum-ring` |
| Hands | `#185E96` | `--blue` |
| Logo background | `#F6F6F6` | `--bg-logo` |

Plum is the **primary** brand colour (actions, emphasis). Blue is the **secondary** (links, secondary buttons, small icons, information). Amber is the **attention accent** (urgent callouts, warning strips, hero announcement). Never use them at equal weight on the same component.

### Colour tokens (v2)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#FBF8F9` | Page background (warm off-white, faint plum undertone) |
| `--surface` | `#FFFFFF` | Cards, form surface |
| `--ink` | `#1F1A1D` | Headings, body text |
| `--ink-muted` | `#6A5A62` | Secondary text, input placeholders |
| `--line` | `#ECE4E8` | Decorative card borders, dividers (never for inputs) |
| `--plum` | `#A31758` | Primary buttons, key accents, active states |
| `--plum-ring` | `#B0215A` | Logo outer ring accent |
| `--plum-dark` | `#7E1244` | Primary button hover/pressed |
| `--plum-deep` | `#4A0B2A` | Footer, hero overlay base, dark CTA band base |
| `--plum-tint` | `#FBEFF4` | Soft section backgrounds, badges |
| `--plum-100` | `#F6D9E6` | Stronger plum tint (badges, icon circles) |
| `--blue` | `#185E96` | Links, secondary buttons, focus outline, icons |
| `--blue-dark` | `#124A76` | Link/secondary hover |
| `--blue-deep` | `#0E3A5F` | Deep brand blue accent |
| `--blue-tint` | `#EAF2F9` | Info boxes, alternate section background |
| `--blue-100` | `#D6E7F5` | Stronger blue tint (badges, icon circles) |
| `--amber` | `#FFB020` | Attention accent only (announcement bar, CTA call button) |
| `--amber-tint` | `#FFF4DC` | Urgent callout background |
| `--amber-ink` | `#6B4200` | Amber-toned text/icons on amber-tint or white |
| `--green` / `--success` | `#1B7F4B` | Availability, success messages, icons |
| `--green-tint` | `#E7F6EE` | Success card background, icon circles |
| `--whatsapp` | `#0B7A5A` | WhatsApp buttons & pills (meets 4.5:1 with white text) |
| `--danger` | `#B3261E` | Error alert borders & icons |
| `--danger-tint` | `#FDECEA` | Error alert background |
| `--field-border` | `#85737C` | Form field borders (3:1 or better non-text contrast) |

### Shadows & Depth

- `--shadow-rest`: `0 1px 2px rgba(74,11,42,.06), 0 4px 16px rgba(74,11,42,.06)` (cards at rest)
- `--shadow-lift`: `0 12px 32px rgba(74,11,42,.14)` (cards on hover)

### Gradients (The Only Allowed Gradients)

- `--grad-brand`: `linear-gradient(135deg, #4A0B2A 0%, #7E1244 55%, #A31758 100%)` (dark CTA band, step badges, form top accent)
- `--grad-blue`: `linear-gradient(135deg, #0E3A5F 0%, #185E96 100%)` (update fallback cover)
- *Never on text, never on page or section backgrounds.*

### Contrast (WCAG AA)

| Pair | Ratio |
|------|-------|
| `--ink` on `--amber` | 9.38 : 1 |
| **White on `--amber`** | **1.83 : 1 (NEVER USE)** |
| `--amber` text on `--plum-deep` | 8.37 : 1 |
| `--amber-ink` on `--amber-tint` / white | 8.00 / 8.73 : 1 |
| White on `--plum` / `--plum-dark` / `--plum-deep` | 7.44 / 10.21 / 15.30 : 1 |
| White on `--blue` / `--blue-deep` | 6.82 / 11.74 : 1 |
| White on `--green` / `--whatsapp` | 5.02 / 5.32 : 1 |
| `--plum` on `--plum-tint` / `--plum-100` | 6.65 / 5.67 : 1 |
| `--blue` on `--blue-tint` / `--blue-100` | 6.03 / 5.39 : 1 |
| `--ink` on any tint (plum-100, blue-100, amber, green, danger) | 13.06 : 1 or better |
| `--ink-muted` on white, `--bg`, plum-tint, blue-tint, amber-tint | 5.71 to 6.46 : 1 |
| Footer text (white at 80%) on `--plum-deep` | 10.05 : 1 |
| `--field-border` vs white / plum-tint (non-text) | 4.43 / 3.96 : 1 |
| `--line` vs white (non-text) | 1.25 : 1 (decorative card edges only, **never for inputs**) |

### Colour usage rules (hard)

1. **Plum** = the primary action (one per view). **Blue** = secondary actions, links, info. **Amber** = attention only. **Green** = availability, success and WhatsApp only. Never decorative.
2. **At most one amber element per viewport height.** Attention colours lose their power when repeated.
3. Text on amber is ALWAYS `--ink`, never white. Amber on a white card is a decorative accent only; the card's text carries the meaning.
4. Green text only on white. On `--green-tint` use `--ink` text with a green icon.
5. **Never convey meaning by colour alone.** Every status has an icon plus text.
6. **Black (`#000`) and Tailwind's `black`/`gray-900` are banned.**
7. **All colours come from tokens.** No hex or rgb literals outside `globals.css`.

### Logo usage

- Use the circular logo as supplied; never recolour, stretch or add effects.
- Header: 44 px circle (40 px on mobile). Footer: 64 px on a white circle backing, because the plum ring disappears on `--plum-deep`.
- Clear space around the logo: at least the height of the cross on the cap.
- Favicon / app icon: the full logo is too detailed at 16–32 px. Use a simplified mark (the nurse cap with cross on a plum square) for 16/32 px, and the full circle for 180 px and above.

## 3. Typography

- **Font:** Inter (variable), loaded with `next/font`, `display: swap`. Fallback: system UI stack.
- Hero `h1`: Inter 600 with tight tracking (-0.02em); no second font family.

| Style | Mobile | Desktop | Weight | Line height |
|-------|--------|---------|--------|-------------|
| Hero H1 | 34 px | 60 px | 600 | 1.08 |
| H1 (inner pages) | 32 px | 48 px | 600 | 1.1 |
| H2 | 26 px | 36 px | 600 | 1.2 |
| H3 | 20 px | 24 px | 600 | 1.3 |
| Body | 17 px | 18 px | 400 | 1.65 |
| Small / meta | 14 px | 14 px | 400 | 1.5 |
| Button / label | 16 px | 16 px | 500 | 1 |

Max text width: **68 characters** (`max-w-prose`).

## 4. Layout and spacing

- 8 px base scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Content container: max-width 1120 px, side padding 20 px mobile / 32 px desktop.
- **Hero container: wider than content** (see section 6), matching the width of the old site's hero.
- Section vertical padding: 64 px mobile / 112 px desktop.
- 12-column grid on desktop; single column on mobile.
- Corners: 12 px cards, 28 px hero card, 999 px (pill) buttons and chips.
- Borders over shadows: 1 px `--line` plus `--shadow-rest` on cards; form fields use `--field-border` (1.5 px, 3:1 contrast); no black anywhere.

## 5. Components

**Buttons**
- **Primary button:** `--plum` fill, white text, pill, 48 px high; hover `--plum-dark`; trailing arrow icon that moves 2 px on hover.
- **Secondary button:** transparent, 1.5 px `--blue` border and text, pill, 48 px high; hover `--blue-tint` fill.
- **On-dark buttons (hero & CTA band):**
  - Hero: white fill with `--plum` text (primary) and translucent white glass with white border (secondary).
  - CTA band: amber fill with `--ink` text (Call) and `--whatsapp` fill with white text (WhatsApp).
- **Call button:** primary style plus phone icon.
- **WhatsApp button:** `--whatsapp` fill (`#0B7A5A`), white text, WhatsApp glyph.
- **Text link:** `--blue`, underline on hover.
- **Focus:** 3 px `--blue` outline with 2 px offset (on dark backgrounds: 3 px white outline).

**Chips & Badges**
- **Eyebrow chip:** `--plum-tint` fill, `--plum` text 13 px / 600, small dot, **no outline**.
- **Category chip on images:** white fill, `--ink` text, 8 px dot in the group colour (Clinical = blue, Senior/Memory = plum, Mother/Baby = amber, Patient Transport = green).
- **Status chip:** tint fill, icon plus text.

**Cards**
- `1px solid var(--line)` plus `--shadow-rest`.
- On hover (inside `@media (hover:hover)` only): `--shadow-lift` and `translateY(-2px)`, disabled under `prefers-reduced-motion`.

**Form Fields (inputs, selects, textareas)**
- `1.5px solid var(--field-border)` (3:1 or better non-text contrast), white background.
- Placeholder: `var(--ink-muted)` (solid, never faded blue-purple).
- Focus: 3 px `--blue` outline with 2 px offset.

**Alerts (4 variants)**
- All: 4 px solid left border, inline icon, optional bold title, body in `--ink`.
- **Info:** `--blue-tint` background, `--blue` border & icon (`role="status"`). Used for privacy notices under forms.
- **Attention:** `--amber-tint` background, `--amber` border, `--amber-ink` icon (`role="status"`). Used for "Urgent? Call..." callouts.
- **Success:** `--green-tint` background, `--green` border & icon (`role="status"`). Used for form submission confirmation.
- **Danger:** `--danger-tint` background, `--danger` border & icon (`role="alert"`). Used for errors/mail failures with phone/WhatsApp links.

**Enquiry form cards** – two variants that share one look: white surface card with 4 px `--grad-brand` top bar, 24 px padding, fields stacked, labels above inputs, `1.5px solid var(--field-border)` borders, `--blue` focus ring, inline error text under each field, single primary button, privacy note below.
- **Customer form** (Home, service pages, Contact): Name, Phone, Email (marked "optional"), Message (textarea, 4 rows). Top attention callout (D5). Button **Send request** (full-width on mobile).
- **Applicant form** (`/careers` only): Name, Phone, Email, **Service type / role** as a native `<select>`. Button **Apply now**. Placeholder option "Select a role" is disabled and not submittable.
- Both: success state replaces the form inside the same card (check icon + message, `aria-live="polite"`); error state keeps the typed values and shows the Call / WhatsApp links. Hidden honeypot field is removed from layout with `position:absolute; left:-9999px` and `tabindex="-1"` `aria-hidden="true"`.

**Service card** – white card with 4 px top accent in the group colour, image 16:10, filled category chip (white backing, 8 px dot in group colour), title, one-line description, "Learn more →" in `--blue` with arrow moving 2 px on hover.

**Update (blog) card** – white card, 16:9 cover image. Fallback cover when there is no image: `--grad-blue` or `--plum-tint` with 48 px white category icon. Category chip as a tint chip. Date 13 px `--ink-muted`. Title clamped to 2 lines. "All updates →" as a secondary pill button.

**FAQ** – native `<details>` accordions with a plus/minus indicator in `--plum`.

**Header** – white, 1 px `--line` bottom border, soft shadow once scrolled. Call pill is the plum primary button. At 320–1023 px: menu button plus the Call pill both stay visible.

**Footer** – `--plum-deep`: logo on white circle, name, address, phone, email, quick links, small print in white at 80% opacity.

## 5.1 Attention System

Discipline: at most one amber element per viewport height, and at most one running animation on screen besides the carousel.

| # | Device | Spec |
|---|--------|------|
| **D1** | **Announcement bar** | Above the header, scrolls away (not sticky), not dismissible. `--amber` background, `--ink` text 14 px, min-height 40 px, phone number as an underlined `tel:` link. At 360 px text wraps cleanly without overflow. |
| **D2** | **Hero Call button pulse** | 2 px `rgba(255,255,255,.7)` ring via `::after`, animated with `transform: scale(1 → 1.25)` and `opacity` only, 1.6 s duration, **3 cycles** after a 1.5 s delay, then stops. Off under `prefers-reduced-motion`. White ring, keeping amber limited to the announcement bar in hero viewport. |
| **D3** | **Trust strip** | Sits **below** the hero with a 24 px gap (does not overlap carousel progress indicators). White card, `--shadow-rest`, 16 px radius. Inline SVG icons in 44 px circles (`--plum-100`, `--blue-100`, `--green-tint`). Headings `--ink` 600, text `--ink-muted`. |
| **D4** | **CTA band** | Full-width dark brand section between Services and How It Works, `--grad-brand`, 80 px vertical padding (56 px mobile). H2 white, text white at 90%. Decorative faint circles (white at 6%) in pure CSS. Buttons: **Call now** (amber fill, `--ink` text) and **WhatsApp us** (`--whatsapp` fill, white text). |
| **D5** | **Urgent callout in customer form** | Attention alert at the top of the form card: "Urgent? Call {phone} instead of waiting for a reply." Phone is an underlined `tel:` link. |
| **D6** | **Sticky mobile bar** | Fixed to viewport bottom on mobile (<768 px). Call = `--plum` fill, WhatsApp = `--whatsapp` fill, both 56 px high with icons, upward shadow, `padding-bottom: env(safe-area-inset-bottom)`. Matching page bottom padding and `scroll-padding-bottom` (WCAG 2.4.11). Hidden on `/contact`. |

## 6. Hero section (home page) — Updated 2026-11

> **Status:** Implemented. The media carousel has been brought **inside** the Home Hero. The redundant TrustStrip section and separate "See us in action" strip below have been removed.

### 6.1 Design intent & layout

Three-second goal: visitors immediately perceive clinical trustworthiness, 24/7 availability, and immediate responsiveness, and tap **Call** or **Request a callback**.

#### Responsive layout structure:
- **Mobile (<768px)** (stacked single column):
  1. Eyebrow pill: "Home nursing in Bengaluru" with pulsing green indicator
  2. H1 headline: "Skilled, compassionate care, at home." ("at home." in `#FFB3D1` accent with hand-drawn wavy underline)
  3. Subtext: 2 lines max, 16px, white at 85% opacity
  4. CTA row: "Call now" (54px, accent fill `#FFB3D1`, phone icon, 4s pulse ring) + "Request a callback" (54px, outlined glass). Full width stacked on mobile.
  5. Trust strip: 3 compact inline items with green icon tint ("Trained caregivers", "Same-day response", "Available 24 × 7")
  6. Media card: full width minus gutter, `aspect-ratio: 4/3`, `border-radius: 24px`, soft shadow, thin `border border-white/15` lifting off the gradient
- **Tablet (768px–1023px)**: Single column like mobile, media card capped at `max-width: 640px` and horizontally centered (`mx-auto`).
- **Desktop (≥1024px)**: Two-column grid inside `max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12` (reusing the old carousel width shell):
  - Left column (55%): vertically centered copy, H1, CTAs, and trust strip.
  - Right column (45%): media card carousel (`aspect-[4/3]`), overlapping the hero bottom edge by 32px (`translate-y-8`), sitting on a blurred brand-colour radial blob (`blur(50px)`).

### 6.2 Visual tokens & theme

| Token | Value | Usage |
|-------|-------|-------|
| Background | `linear-gradient(145deg, #3D0920 0%, #6B1038 40%, #A31758 75%, #C4256E 100%)` | Rich plum-to-magenta hero background (contrast ≥ 7:1) |
| Blob 1 | Radial pink glow, top-right, `blur(60px)`, 20s drift | Ambient depth |
| Blob 2 | Radial deep-plum glow, bottom-left, `blur(70px)`, 24s drift | Ambient depth |
| Media card blob | Radial magenta glow behind media card on desktop, `blur(50px)` | Layered elevation |
| Headline | `#FFFFFF`, 700 weight, tight line-height 1.08 | No text-shadow |
| Accent highlight | `#FFB3D1` + SVG wavy underline `#F9A8D4` | Accent on "at home." |
| Eyebrow pill | `bg-white/12 border border-white/25 text-[#FFD6E8]` | Legible uppercase letterspaced pill |
| Primary CTA | `#FFB3D1` background, `#3D0920` text, 54px height, 4s pulse ring | Tap target ≥ 48px |
| Secondary CTA | `bg-white/10 border-white/40 text-white`, 54px height | Modal trigger |
| Trust items | Inline icons in `#86EFAC` | 3 verified factual points |
| 24/7 Support badge | Frosted pill over top-right corner of media card with `#4ADE80` pulsing dot | High-contrast trust badge |
| Caption chip | `bg-black/65 border-white/20 text-white/95 backdrop-blur-md` | Bottom-left of media card |

### 6.3 Media conversion & performance table

All heavy GIFs were converted to optimized WebP formats (each under 2 MB, with instant ~3-4 KB posters):

| Original GIF | Original Size | Converted WebP | WebP Size | Poster (LCP) | Reduction |
|---|---|---|---|---|---|
| `GifImage1.gif` | 6.74 MB (6,743,772 B) | `slide-1.webp` | 1.75 MB (1,834,712 B) | `slide-1-poster.webp` (3.0 KB) | **-72.8%** |
| `GifImage2.gif` | 2.91 MB (2,908,304 B) | `slide-2.webp` | 1.40 MB (1,468,620 B) | `slide-2-poster.webp` (4.0 KB) | **-49.5%** |
| `GifImage3.gif` | 6.61 MB (6,605,554 B) | `slide-3.webp` | 1.75 MB (1,836,088 B) | `slide-3-poster.webp` (2.8 KB) | **-72.2%** |
| **Total** | **16.26 MB** | **All 3 Slides** | **4.90 MB** | **All 3 Posters (<10 KB)** | **-69.9%** |

### 6.4 Carousel behaviour & accessibility

- **Slide type:**
  ```ts
  export interface HeroSlide {
    id: number;
    type: 'image' | 'video';
    src: string;
    poster?: string;
    alt: string;
    caption?: string;
    videoSources?: { src: string; type: string }[];
  }
  ```
- **Auto-advance:** 5000ms for images; on video `onEnded` (max 12s fallback) for video slides.
- **Controls & Gestures:**
  - Left / right arrow buttons on desktop (48px tap targets, `w-12 h-12`).
  - Mobile swipe detection (`onTouchStart`/`onTouchEnd`, threshold > 40px).
  - Hover, focus, and touch pause the carousel (`onMouseEnter`, `onFocusCapture`, `onTouchStart`).
- **Indicators:** Dot indicators at bottom; active dot is wider pill (34px) with filling progress bar (`slideProgressBar` CSS keyframe).
- **Video & Data Saver:** Videos autoplay muted, loop, playsInline without controls. Paused/unloaded when off-screen. If `navigator.connection?.saveData` or `prefers-reduced-motion` is active, video autoplay is suppressed and the poster is shown.
- **Accessibility:**
  - `role="region"`, `aria-roledescription="carousel"`, `aria-label="Care services showcase"`.
  - Slides have `role="group"`, `aria-roledescription="slide"`, `aria-label="Slide X of N: ..."`.
  - `aria-live="off"` while autoplaying, `"polite"` when paused.
  - Buttons and tabs are keyboard operable with visible focus ring.
- **LCP & SSR:**
  - `HomeHero.tsx` is an SSR Server Component: H1 headline and copy are delivered in initial server HTML.
  - Slide 1 has `priority` and `fetchPriority="high"`.
  - Container has fixed `aspect-[4/3]` ensuring CLS < 0.05.

### 6.5 Sticky mobile bottom bar (`MobileActionBar`)

- Visible only on mobile (`< md`).
- Fades in after user scrolls past 90vh (clearing the hero).
- Tap targets: Call Now (`tel:`) + WhatsApp (`wa.me`), 50px high, `safe-area-inset-bottom`.

## 7. Pages and wireframes

### Home
```
[ Header ]
HOME HERO      (section 6) — Two-column (55% text / 45% media carousel inside hero),
               H1, CTAs, trust strip inline, 24/7 badge, 4:3 media card

SERVICES      H2 + 3x3 grid of service cards (plum-tint label chips)

HOW IT WORKS  3 numbered steps on --blue-tint:
              Tell us the need → We assess and match → Care starts at home

LATEST UPDATES  3 update cards + "All updates →"

CUSTOMER FORM Two columns on --plum-tint: left = reassurance text + phone,
              right = form card

[ Footer ]
```

### Service page
```
Breadcrumb
H1  Service name
Intro paragraph (2–3 lines)
Two columns: left = what's included (short list), who it suits, how it works
             right = sticky form card
FAQ (3–5 questions, FAQ schema)
Related services (2 cards)
```

### Updates list / detail
- List: H1 "Updates", card grid, numbered pagination.
- Detail: breadcrumb, H1, date, optional cover, Markdown body at 68-char width, "Need help? Call now" box (`--plum-tint`) at the end, 2 related updates.

### About, FAQ, Contact
- About: short story, what the team does, photos, verified facts only.
- FAQ: grouped accordions.
- Contact: customer form card, phone, WhatsApp, email, address, embedded map (lazy-loaded), hours, and a small text link "Looking for work? Apply on our Careers page →".

### Careers (`/careers`)
```
Breadcrumb
H1  Careers: nursing and caregiver jobs in Bengaluru
Intro (2–3 lines): who we look for, what happens after you apply
Two columns (stacked on mobile):
  left  = role list (the same roles as the form's select, as plain chips),
          "How it works": 1 Apply  2 We contact you  3 We ask for documents
  right = applicant form card (Name, Phone, Email, Role select, [Apply now])
```
Same tokens as the rest of the site; no photos required. Nothing about pay or benefits unless the owner confirms it.

### Admin (utility, not public design)
This is where the owner posts updates: **`/admin/login` → `/admin/updates` → New update.** It is not linked from the public site; the owner bookmarks it. Plain, centred, same tokens, mobile-first (the owner will often post from a phone). No carousel, no marketing styling.

```
LOGIN            centred card, 360 px wide: Email, Password, [Sign in]

UPDATES LIST     header: "Updates"                      [ + New update ]
                 filter chips: All · Drafts · Published
                 rows (cards on mobile, table on desktop):
                   Title · status badge (Draft = blue-tint, Published = success)
                   · date · [Edit] [Unpublish / Publish] [Delete]

EDITOR           Title                       (text input)
                 Web address (slug)          (auto, editable, shows /updates/…)
                 Excerpt                     (textarea, 160-char counter)
                 Cover image                 [ Upload ]  + Alt text
                 Body                        toolbar: H2 · Bold · List · Link
                                             textarea  |  Preview (tabs on mobile,
                                             side by side on desktop)
                 SEO (collapsed)             SEO title · Meta description
                 ─────────────────────────────────────────────────────────
                 [ Save draft ]   [ Publish ]            (sticky bottom bar on mobile)
```
- Delete asks for confirmation in a dialog that names the post.
- After **Publish**, a toast shows "Published" with a **View on site** link to the live page.
- Primary button is **Publish** (plum); **Save draft** is secondary (blue outline).

## 8. Imagery

- Real photos preferred; warm natural light; people at ease, not posed medical shots. Illustrations only in the hero until photos exist, and only in the plum/blue palette.
- Rounded corners (16–24 px), no heavy filters.
- Export WebP/AVIF through Next `Image`; hero rules in section 6.8.
- Every image gets descriptive alt text (never "image of...").

## 9. Motion (everywhere except the hero)

- Subtle only: 150–200 ms ease-out on hover/focus, fade-up (8 px) on section reveal.
- Respect `prefers-reduced-motion`: disable all of it.

## 10. Voice and copy

- Plain, warm, specific. "We'll call you back within the hour" beats "Premium healthcare solutions".
- Short sentences. No jargon, no superlatives, no unverified claims.
- Buttons say what happens: "Send request" (customer form), "Apply now" (applicant form), "Call now", "Publish" (admin).

## 11. Accessibility checklist

- Contrast ≥ 4.5:1; touch targets ≥ 44 × 44 px.
- Visible focus on every interactive element; skip-to-content link.
- Form labels, `aria-describedby` for errors, `aria-live="polite"` for the success/failure message.
- Semantic landmarks (`header`, `nav`, `main`, `footer`); heading order never skipped.
- Carousel rules in section 6.9.

## 12. CSS tokens (copy into `globals.css`)

```css
:root {
  /* Neutral surface */
  --bg: #FBF8F9;
  --surface: #FFFFFF;
  --ink: #1F1A1D;
  --ink-muted: #6A5A62;
  --line: #ECE4E8;

  /* Primary brand: plum-magenta */
  --plum: #A31758;
  --plum-ring: #B0215A;
  --plum-dark: #7E1244;
  --plum-deep: #4A0B2A;
  --plum-tint: #FBEFF4;
  --plum-100: #F6D9E6;

  /* Secondary brand: deep blue */
  --blue: #185E96;
  --blue-dark: #124A76;
  --blue-deep: #0E3A5F;
  --blue-tint: #EAF2F9;
  --blue-100: #D6E7F5;

  /* Attention accent */
  --amber: #FFB020;
  --amber-tint: #FFF4DC;
  --amber-ink: #6B4200;

  /* Availability & semantic */
  --green: #1B7F4B;
  --success: #1B7F4B;
  --green-tint: #E7F6EE;
  --whatsapp: #0B7A5A;
  --danger: #B3261E;
  --danger-tint: #FDECEA;

  /* Form fields (non-text contrast 3:1 or better) */
  --field-border: #85737C;

  /* Radius */
  --radius-card: 12px;
  --radius-hero: 28px;

  /* Depth */
  --shadow-soft: 0 8px 30px rgba(74, 11, 42, 0.08);
  --shadow-rest: 0 1px 2px rgba(74, 11, 42, 0.06), 0 4px 16px rgba(74, 11, 42, 0.06);
  --shadow-lift: 0 12px 32px rgba(74, 11, 42, 0.14);

  /* Gradients */
  --grad-brand: linear-gradient(135deg, #4A0B2A 0%, #7E1244 55%, #A31758 100%);
  --grad-blue: linear-gradient(135deg, #0E3A5F 0%, #185E96 100%);
}

:root {
  color-scheme: light;
}
```
