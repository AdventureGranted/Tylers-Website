# Performance & SEO Improvements Design

## Overview

Batch 1 of portfolio website improvements covering performance optimization, skeleton loaders, SEO enhancements, and Lighthouse fixes. Applied component-by-component in order so earlier changes compound into later improvements.

## Current State

- All images already use Next.js `<Image>` component (no raw `<img>` tags)
- Blur placeholders exist on project page images and photo grid
- SEO metadata exists at root layout level (OG tags, Twitter cards, JSON-LD Person schema, dynamic sitemap, robots.txt)
- Loading skeletons exist for projects, hobbies, and hobby detail pages
- Lighthouse scores: Performance 84, Accessibility 90, Best Practices 100, SEO 100

## Section 1: Image Optimization

### Goal

Reduce payload of large images and ensure all images have proper sizing hints, blur placeholders, and priority flags.

### Changes

**Compress source images in `public/`:**

- `profile.jpg` (3.4MB) → compress to ~200-500KB
- `family.jpeg` (1.3MB) → compress to ~200-500KB
- Other large PNGs (`backup.png`, `balancely.png`, `boxie.png`, `selfhosting.png`) → compress as needed
- Company logos and about page images → compress if over 200KB
- Use sharp or squoosh CLI to compress without visible quality loss

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

### Design pattern

- Match existing skeleton style from `app/projects/loading.tsx` and `app/hobbies/loading.tsx`
- Use `animate-pulse` with gray tones
- Respect dark/light theme using `dark:` variants

### Files to modify

- `app/loading.tsx` — rewrite from spinner to skeleton
- `app/about/loading.tsx` — new file
- `app/contact/loading.tsx` — new file

## Section 3: SEO & Discoverability

### Goal

Add per-page metadata with OG tags and expand structured data for richer search results.

### Changes

**Per-page metadata exports:**

- `app/about/page.tsx` — add metadata export with title, description, OG tags
- `app/hobbies/page.tsx` or its layout — add metadata export
- `app/hobbies/[slug]/page.tsx` — add `generateMetadata` that pulls hobby title, description, and featured image for social previews

**Expand JSON-LD structured data:**

- Root layout: add `WebSite` schema alongside existing `Person` schema (enables sitelinks search box in Google)
- Add `BreadcrumbList` schema on subpages (projects, about, contact, hobbies) for breadcrumb-rich search results

**Verify og-image.png exists:**

- Metadata references `/og-image.png` — create one if missing (1200x630px with site branding)

### Files to modify

- `app/layout.tsx` — add WebSite JSON-LD
- `app/about/page.tsx` — add metadata export
- `app/hobbies/[slug]/page.tsx` — add generateMetadata
- `app/hobbies/layout.tsx` — add metadata (create if needed)
- `public/og-image.png` — create if missing

## Section 4: Lighthouse Fixes

### Goal

Address specific issues flagged by Lighthouse audit to improve Performance and Accessibility scores.

### Performance fixes

**Reduce LCP (4.5s → lower):**

- Image optimization from Section 1 will help (compressed images, AVIF, priority flags)
- Add `preconnect` hints for external origins (CDN at `cdn.tyler-grant.com`)
- Verify font loading uses `display: swap` (Geist fonts via `next/font` should handle this)

**Lazy-load heavy components:**

- `AIChatBubble` — dynamic import with `next/dynamic`, no SSR
- Architecture diagrams on projects page — dynamic import

**Reduce render-blocking resources (110ms):**

- Audit font loading — ensure `next/font` handles preloading correctly
- Add `preconnect` link hints in layout for external domains

**Enable modern image formats:**

- Covered by AVIF config in Section 1

### Accessibility fixes

**Fix `aria-hidden` with focusable descendants (AIChatBubble):**

- When chat is collapsed, use the `inert` attribute instead of `aria-hidden="true"` on the chat container
- Or conditionally render chat content only when expanded (remove from DOM when collapsed)

**Fix button without accessible name (NavBar hamburger):**

- Add `aria-label="Toggle navigation menu"` to the mobile menu button

### Files to modify

- `app/layout.tsx` — add preconnect hints
- `app/components/AIChatBubble.tsx` — fix aria-hidden, dynamic import wrapper
- `app/components/NavBar.tsx` — add aria-label to hamburger button
- `app/page.tsx` — dynamic import for heavy components if needed
- `app/projects/page.tsx` — dynamic import for ArchitectureDiagram

## Implementation Order

1. Image compression (physical files)
2. Image optimization (code changes — sizes, blur, priority, AVIF config)
3. Skeleton loaders (home, about, contact)
4. SEO metadata (per-page metadata, JSON-LD expansion, og-image)
5. Lighthouse fixes (dynamic imports, accessibility, preconnect)

Each step is independently testable and builds on the previous one.
