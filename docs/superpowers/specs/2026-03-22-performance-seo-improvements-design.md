# Performance & SEO Improvements Design

## Overview

Batch 1 of portfolio website improvements covering performance optimization, skeleton loaders, SEO enhancements, and Lighthouse fixes. Applied component-by-component in order so earlier changes compound into later improvements.

## Current State

- All images already use Next.js `<Image>` component (no raw `<img>` tags)
- Blur placeholders exist on project page images and photo grid
- SEO metadata exists at root layout level (OG tags, Twitter cards, JSON-LD Person schema, dynamic sitemap, robots.txt)
- Per-page metadata already exists for: projects (`projects/layout.tsx`), contact (`contact/layout.tsx`), hobbies (`hobbies/page.tsx`), hobby detail (`hobbies/[slug]/page.tsx` with `generateMetadata`)
- Loading skeletons exist for projects, hobbies, and hobby detail pages
- Lighthouse scores: Performance 84, Accessibility 90, Best Practices 100, SEO 100
- PWA configured with `@ducanh2912/next-pwa` and `skipWaiting: true`
- `og-image.png` is referenced in root metadata but does not exist on disk (live broken reference)

## Success Criteria

- Performance score >= 90 (currently 84)
- LCP < 2.5s (currently 4.5s)
- Accessibility score >= 95 (currently 90)
- All Lighthouse accessibility audits pass
- `og-image.png` exists and renders correctly in social share previews

## Section 1: Image Optimization

### Goal

Reduce payload of large images and ensure all images have proper sizing hints, blur placeholders, and priority flags.

### Changes

**Compress source images in `public/`:**

- `profile.jpg` (3.4MB) → compress to ~200-500KB
- `family.jpeg` (1.3MB) → compress to ~200-500KB
- Other large PNGs (`backup.png`, `balancely.png`, `boxie.png`, `selfhosting.png`) → compress as needed
- Company logos and about page images → compress if over 200KB
- Use sharp CLI to compress without visible quality loss

**Add `sizes` prop where missing:**

- Audit all `<Image>` usages and add appropriate `sizes` values based on layout breakpoints
- Ensures browser picks the right resolution image for the viewport

**Add blur placeholders where missing:**

- About page images (`/about/*.jpg`)
- Company logos in WorkExperienceCard
- HobbyCard featured images (dynamic — use `placeholder="blur"` with `blurDataURL`)
- NavBar logo

**Add `priority` to above-the-fold images:**

- ProfileCard profile image (already has `priority` — verify)
- First visible project card image on projects page
- About page hero image

**Enable AVIF in next.config.ts:**

- Add `images: { formats: ['image/avif', 'image/webp'] }` to next config

### Files to modify

- `next.config.ts` — add AVIF format
- `app/components/ProfileCard.tsx` — verify priority/sizes
- `app/components/WorkExperienceCard.tsx` — add blur placeholders, sizes
- `app/projects/page.tsx` — verify priority on first card
- `app/about/page.tsx` — add blur placeholders, priority on hero, sizes
- `app/components/HobbyCard.tsx` — add blur placeholder support
- `app/components/NavBar.tsx` — add sizes
- Physical image files in `public/` — compress

### Verification

- Run `npx next build` and check for image optimization warnings
- Compare page weight before/after using browser DevTools Network tab
- Visually verify no quality degradation on compressed images

## Section 2: Skeleton Loaders

### Goal

Replace the generic spinner on the home page with a proper skeleton, and add skeletons for about and contact pages.

### Changes

**Home page (`app/loading.tsx`):**

- Replace spinner with skeleton matching: ProfileCard (circle + text lines), TechnicalSkills (category headers + tag grid), WorkExperience (cards with logo placeholders)
- Use `animate-pulse` on `bg-gray-700/bg-gray-200` shapes matching the dark/light theme

**About page (`app/about/loading.tsx`):**

- New file — skeleton matching the about page layout (hero image + text blocks + photo grid)

**Contact page (`app/contact/loading.tsx`):**

- New file — skeleton matching contact form and contact info sections

**Note:** `loading.tsx` skeletons show during route transitions (initial navigation and client-side route changes). For client components like the contact page (`'use client'`), the skeleton appears during route navigation, not during client-side data fetching within the page. This is the expected and correct behavior.

### Design pattern

- Match existing skeleton style from `app/projects/loading.tsx` and `app/hobbies/loading.tsx`
- Use `animate-pulse` with gray tones
- Respect dark/light theme using `dark:` variants

### Files to modify

- `app/loading.tsx` — rewrite from spinner to skeleton
- `app/about/loading.tsx` — new file
- `app/contact/loading.tsx` — new file

### Verification

- Navigate between pages with network throttling enabled (Slow 3G) to see skeletons
- Verify skeletons match the layout of the actual page content (no jarring shifts)

## Section 3: SEO & Discoverability

### Goal

Enhance per-page metadata with OG tags where missing and expand structured data for richer search results.

### Changes

**Per-page metadata:**

- `app/about/page.tsx` is `'use client'` so cannot export metadata directly. Create `app/about/layout.tsx` with metadata export (title, description, OG tags) — same pattern as contact page.
- Hobbies pages already have metadata (`hobbies/page.tsx` has `metadata`, `hobbies/[slug]/page.tsx` has `generateMetadata`) — enhance the slug page's `generateMetadata` to include OG image from the hobby's featured image if not already present.
- Contact and projects already have metadata via their layouts — no changes needed.

**Expand JSON-LD structured data:**

- Root layout: add `WebSite` schema alongside existing `Person` schema (enables sitelinks search box in Google)
- Add `BreadcrumbList` schema on subpages (projects, about, contact, hobbies) for breadcrumb-rich search results

**Create og-image.png (priority — currently a broken reference):**

- Create a 1200x630px OG image using Next.js `ImageResponse` API (`app/opengraph-image.tsx`) for dynamic generation, or a static PNG in `public/og-image.png`
- Use site branding: dark background, "Tyler Grant | Software Engineer" text, yellow accent
- Recommended approach: static PNG for simplicity, since the content rarely changes

### Files to modify

- `app/about/layout.tsx` — new file with metadata export
- `app/hobbies/[slug]/page.tsx` — enhance generateMetadata with OG image
- `app/layout.tsx` — add WebSite JSON-LD
- `public/og-image.png` — create (1200x630px branded image)

### Verification

- Use https://www.opengraph.xyz/ or Twitter Card Validator to verify OG previews for each page
- Validate JSON-LD with Google's Rich Results Test

## Section 4: Lighthouse Fixes

### Goal

Address specific issues flagged by Lighthouse audit to improve Performance and Accessibility scores.

### Performance fixes

**Reduce LCP (4.5s → <2.5s):**

- Image optimization from Section 1 will help (compressed images, AVIF, priority flags)
- Add `preconnect` hints for external origins (CDN at `cdn.tyler-grant.com`)
- Verify font loading uses `display: swap` (Geist fonts via `next/font` should handle this)

**Lazy-load heavy components:**

- `AIChatBubble` — dynamic import with `next/dynamic` (ssr: false) in `app/layout.tsx` where it is consumed
- `ArchitectureDiagram` — dynamic import in `app/projects/page.tsx` where it is consumed

**Reduce render-blocking resources (110ms):**

- Audit font loading — ensure `next/font` handles preloading correctly
- Add `preconnect` link hints in layout for external domains

**Enable modern image formats:**

- Covered by AVIF config in Section 1

### Accessibility fixes

**Fix `aria-hidden` with focusable descendants (AIChatBubble):**

- When chat is collapsed, use the `inert` attribute instead of `aria-hidden="true"` on the chat container
- The `inert` attribute is supported in React 19 and all modern browsers (Chrome 102+, Firefox 112+, Safari 15.5+)
- Fallback: conditionally render chat content only when expanded (remove from DOM when collapsed)

**Fix button without accessible name (NavBar hamburger):**

- Add `aria-label="Toggle navigation menu"` to the mobile menu button

### PWA cache note

The PWA service worker (`@ducanh2912/next-pwa`) caches assets. After compressing images, `skipWaiting: true` is already configured, so the new service worker will activate immediately on the next visit. No additional cache invalidation steps needed.

### Files to modify

- `app/layout.tsx` — add preconnect hints, dynamic import AIChatBubble
- `app/components/AIChatBubble.tsx` — fix aria-hidden → inert
- `app/components/NavBar.tsx` — add aria-label to hamburger button
- `app/projects/page.tsx` — dynamic import for ArchitectureDiagram

### Verification

- Run Lighthouse again after all changes
- Verify AIChatBubble still opens/closes correctly with inert attribute
- Test keyboard navigation through the NavBar hamburger menu

## Implementation Order

1. Image compression (physical files)
2. Image optimization (code changes — sizes, blur, priority, AVIF config)
3. Skeleton loaders (home, about, contact)
4. SEO metadata (about layout, OG image, JSON-LD expansion)
5. Lighthouse fixes (dynamic imports, accessibility, preconnect)

Each step is independently testable and builds on the previous one. Run `npx next build` after each step to catch regressions.
