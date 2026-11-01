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

## 6. Hero carousel (home page)

The old site has an automatic carousel in the hero that reads almost like a video. **Keep that idea, same width, and modernise it.**

### 6.1 What stays from the old hero

- Automatic slideshow of **4 illustrated slides** (nurse examining an elderly patient, doctor with clipboard, mother and baby care, patient transport/ambulance).
- Hero sits **inset on the page, not full-bleed**, with the headline at the lower left and two buttons beneath it.
- Floating "Chat with us" WhatsApp tab on the right edge.

### 6.2 Width and size (same as old)

| Property | Value |
|----------|-------|
| Desktop width | Fills the page with equal side margins (about 7 % each side, minimum 24 px), **max-width 1400 px**, centred. This matches the old hero, which was ~1500 px wide inside a ~1740 px viewport |
| Desktop shape | `aspect-ratio: 21 / 9` (old ratio ≈ 2.3 : 1), about 600 px tall at 1400 px wide |
| Tablet | Side margin 24 px, `aspect-ratio: 16 / 9` |
| Mobile | Full width minus 20 px margins; media area `aspect-ratio: 4 / 3` on top, text block **below** the media (not overlaid), as on the old mobile layout |
| Corners | 28 px desktop, 20 px mobile |
| Shadow | The single soft shadow from section 4 |

### 6.3 Wireframe: desktop

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [ slide image: crossfading, slowly zooming ]                            │
│                                                                          │
│  ▒▒▒▒ plum-deep gradient (left → transparent) ▒▒▒▒                        │
│                                                                          │
│  ● Home nursing in Bengaluru   ← label chip (links to the slide's service)│
│  Skilled, compassionate                                                  │
│  care, at home.                ← static H1                                │
│  One-line support text.                                                  │
│  [ Call now ]  [ Send a request ]                                        │
│                                                                          │
│  ▬▬▬▬▬ ▭▭▭▭▭ ▭▭▭▭▭ ▭▭▭▭▭   ⏸     ← progress bars + pause button         │
└──────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Wireframe: mobile

```
┌──────────────────────┐
│ [ slide image 4:3 ]  │
│  ▬▬▬ ▭▭▭ ▭▭▭ ▭▭▭  ⏸ │   ← indicators overlaid at the bottom of the image
└──────────────────────┘
  Home nursing in Bengaluru
  Skilled, compassionate care, at home.
  Support text.
  [      Call now      ]
  [   Send a request   ]
```

### 6.5 Motion (the "video" feel)

| Property | Value |
|----------|-------|
| Autoplay | Starts on load |
| Slide duration | 6 s |
| Transition | Crossfade, 900 ms, `ease-in-out` (no sliding) |
| Ken Burns | Active slide scales 1.00 → 1.06 over 7 s, `linear`; each slide alternates its transform origin (top-left, bottom-right, centre, top-right) so the drift varies |
| Text | H1, support text and buttons are **static** (they do not change per slide). Only the label chip swaps (fade, 300 ms) |
| Indicators | Four thin bars (4 px high, pill) along the bottom. The active bar fills left to right in `--white` over 6 s while inactive bars are white at 35 % opacity. Story-style, so it signals time as well as position. Each bar is clickable |
| Loop | Infinite; order fixed |

Only `transform` and `opacity` are animated, so it stays on the GPU and does not cause layout shift.

### 6.6 Overlay and legibility

- Overlay on desktop: `linear-gradient(90deg, rgba(74,11,42,.82) 0%, rgba(74,11,42,.45) 45%, rgba(74,11,42,0) 75%)`, so white text on the left always has ≥ 4.5:1 contrast.
- Overlay on mobile: none, because text sits below the image.
- If a slide's art is dark on the left, keep the same overlay; do not change it per slide.

### 6.7 Slide content

| # | Label chip (links to) | Art subject |
|---|-----------------------|-------------|
| 1 | Home nursing → `/services/home-nursing` | Nurse caring for an elderly patient |
| 2 | Hospital special nursing → `/services/hospital-nursing` | Doctor/nurse with clipboard |
| 3 | Mother and baby care → `/services/mother-and-baby-care` | Postnatal care at home |
| 4 | Patient transport → `/services/patient-transport` | Ambulance / transport vehicle |

- **Interim art:** the existing illustrations are already plum and blue and match the logo, so they may be reused only if the owner holds the rights to them. Export them as WebP at 2800 × 1200 (desktop) and 1200 × 900 (mobile).
- **Preferred art:** real photos of the team and equipment, colour-graded slightly warm, with the subject on the right half so the text area stays clear.

### 6.8 Performance rules (the hero is the LCP element)

- Slide 1 is rendered in the HTML with `priority` (preloaded, `fetchpriority="high"`). Slides 2–4 load **after** the page is interactive (`loading="lazy"` or preloaded when idle) so they never delay LCP.
- Each slide image ≤ 150 KB (WebP/AVIF), served with `srcset` for 640 / 1200 / 2000 px. No GIF or video files.
- The carousel container has a fixed `aspect-ratio`, so there is **zero layout shift**.
- Carousel JS is a small client component; everything else on the page stays server-rendered.
- Target: LCP < 2.5 s on 4G with the carousel present.

### 6.9 Accessibility and SEO rules

- **Pause control is required** (WCAG 2.2.2): a visible ⏸/▶ button, 44 × 44 px, next to the indicators.
- Autoplay also pauses on: hover, keyboard focus inside the hero, touch-and-hold, and when the tab is hidden (`visibilitychange`).
- `prefers-reduced-motion: reduce` → autoplay off, no zoom, no crossfade; slide 1 is shown and the user can step through with the indicators.
- Markup: `role="region" aria-roledescription="carousel" aria-label="Our services"`; each slide `role="group" aria-roledescription="slide" aria-label="1 of 4"`; `aria-live="off"` while autoplaying, `"polite"` once paused. Inactive slides are `aria-hidden`.
- Indicators are real `<button>`s with `aria-label="Go to slide 2: Hospital special nursing"`; keyboard operable with visible focus.
- The page's single `<h1>` is the static headline, **outside** the changing parts, so crawlers see one stable H1. Slide images use meaningful `alt` text, and the label chips are normal crawlable links to the service pages (a useful internal link).

## 7. Pages and wireframes

### Home
```
[ Header ]
HERO CAROUSEL   (section 6)

TRUST STRIP   3 short facts, e.g. "Serving Bengaluru" · "Trained caregivers" · "Available 24/7"
              (only facts the owner confirms)

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
