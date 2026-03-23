# Performance & SEO Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Lighthouse Performance score from 84→90+, Accessibility from 90→95+, fix image payload bloat, add missing skeleton loaders, and enhance SEO metadata.

**Architecture:** Component-by-component changes applied in dependency order — image compression first, then code-level image optimization, skeleton loaders, SEO metadata, and finally Lighthouse-specific fixes. Each task produces an independently testable commit.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS 4, sharp (image compression)

**Spec:** `docs/superpowers/specs/2026-03-22-performance-seo-improvements-design.md`

---

## File Structure

**Files to modify:**

- `next.config.ts` — add AVIF image format
- `app/layout.tsx` — add WebSite JSON-LD, preconnect hints, lazy-load AIChatBubble via client wrapper
- `app/loading.tsx` — rewrite spinner to skeleton
- `app/about/page.tsx` — add blur placeholders, sizes, and priority to images
- `app/components/NavBar.tsx:527-528` — add aria-label to hamburger button
- `app/components/AIChatBubble.tsx:337` — replace `aria-hidden` with `inert`
- `app/components/ProfileCard.tsx:52-60` — add sizes prop
- `app/components/ArchitectureDiagram.tsx` — extract data exports to separate file
- `app/projects/page.tsx:9-13` — lazy-load ArchitectureDiagram via client wrapper

**Files to create:**

- `scripts/compress-images.mjs` — one-time sharp compression script
- `app/about/loading.tsx` — about page skeleton
- `app/contact/loading.tsx` — contact page skeleton
- `app/about/layout.tsx` — metadata for about page
- `app/components/LazyAIChatBubble.tsx` — client component wrapper for dynamic import
- `app/components/LazyArchitectureDiagram.tsx` — client component wrapper for dynamic import
- `app/components/architectureDiagramData.ts` — extracted architecture data/types for code-splitting
- `public/og-image.png` — OG image (1200x630)

---

### Task 1: Compress Source Images

**Files:**

- Create: `scripts/compress-images.mjs`
- Modify: images in `public/` (8 files over 500KB)

- [ ] **Step 1: Create the compression script**

```javascript
// scripts/compress-images.mjs
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const PUBLIC_DIR = 'public';
const ABOUT_DIR = 'public/about';
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;

async function compressImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const info = await stat(filePath);
  const sizeMB = (info.size / 1024 / 1024).toFixed(2);

  if (info.size < 200 * 1024) {
    console.log(`SKIP ${filePath} (${sizeMB}MB - already small)`);
    return;
  }

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = sharp(filePath);

  // Resize if larger than MAX_DIMENSION
  if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  }

  const buffer = await pipeline.toBuffer();
  const newSizeMB = (buffer.length / 1024 / 1024).toFixed(2);

  if (buffer.length < info.size) {
    await sharp(buffer).toFile(filePath);
    console.log(`COMPRESSED ${filePath}: ${sizeMB}MB -> ${newSizeMB}MB`);
  } else {
    console.log(`SKIP ${filePath} (${sizeMB}MB - compression not smaller)`);
  }
}

async function processDirectory(dir, extensions = ['.jpg', '.jpeg', '.png']) {
  const entries = await readdir(dir);
  for (const entry of entries) {
    const filePath = join(dir, entry);
    const entryStat = await stat(filePath);
    if (
      entryStat.isFile() &&
      extensions.includes(extname(entry).toLowerCase())
    ) {
      await compressImage(filePath);
    }
  }
}

console.log('Compressing images in public/...');
await processDirectory(PUBLIC_DIR);
console.log('\nCompressing images in public/about/...');
await processDirectory(ABOUT_DIR);
console.log('\nDone!');
```

- [ ] **Step 2: Run the compression script**

Run: `node scripts/compress-images.mjs`
Expected: Output showing compressed files with before/after sizes. Target files:

- `public/about/family.jpg` (8.5MB → ~400KB)
- `public/about/server.jpg` (5.9MB → ~400KB)
- `public/about/tyler_ashton.jpg` (5.1MB → ~400KB)
- `public/profile.jpg` (3.5MB → ~300KB)
- `public/about/workshop.jpg` (2.6MB → ~300KB)
- `public/about/skiing.jpg` (2.3MB → ~300KB)
- `public/family.jpeg` (1.3MB → ~200KB)
- `public/about/drPepperCan.png` (984KB → smaller)

- [ ] **Step 3: Visually verify compressed images**

Run: `npx next dev` and check profile, about, and projects pages in browser. Ensure no visible quality degradation.

- [ ] **Step 4: Commit**

```bash
git add public/ scripts/compress-images.mjs
git commit -m "Compress source images with sharp

Reduce total image payload by ~25MB. Largest files:
profile.jpg, about/ photos, family.jpeg all resized
to max 1920px and compressed with mozjpeg/PNG optimization."
```

---

### Task 2: Enable AVIF Format, Add Image Sizes, and Blur Placeholders

**Files:**

- Modify: `next.config.ts:13-22`
- Modify: `app/components/ProfileCard.tsx:52-60`
- Modify: `app/about/page.tsx` (multiple Image elements at lines 146, 376, 570, 639, 651, 675, 687)

Note: `app/components/WorkExperienceCard.tsx` logo images use fixed `width={64} height={64}` (not `fill`), so `sizes` has no effect on them. Skipping.

- [ ] **Step 1: Add AVIF format to next.config.ts**

In `next.config.ts`, add `formats` to the existing `images` config:

```typescript
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.tyler-grant.com',
        pathname: '/**',
      },
    ],
  },
  turbopack: {},
};
```

- [ ] **Step 2: Add `sizes` prop to ProfileCard image**

In `app/components/ProfileCard.tsx:52-60`, add `sizes` to the Image component:

```tsx
<Image
  src="/profile.jpg"
  alt="Profile Picture of Tyler"
  fill
  priority
  sizes="(min-width: 1280px) 200px, 192px"
  placeholder="blur"
  blurDataURL={profileBlurDataURL}
  className="object-cover object-top"
/>
```

- [ ] **Step 3: Add blur placeholders, sizes, and priority to about page images**

In `app/about/page.tsx`, the about page has 5 large images using `fill` without `sizes` or blur placeholders. Generate blur data URLs using plaiceholder or hard-code tiny base64 placeholders. For each `fill` Image:

Add `sizes` and `placeholder="blur"` with `blurDataURL`:

**Server image (line 570-574):**

```tsx
<Image
  src="/about/server.jpg"
  alt="Tyler's self-hosted server, NAS, and networking rack"
  fill
  sizes="(min-width: 640px) 70vw, 100vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAIRAAAgIBBAIDAAAAAAAAAAAAAQIDBAAFERIhBjETQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Az0XV9Ur6akFq0I7EEXBnVSVUEkDf97yHUdbr2tRlitW5Z5I2KO0jkkEHog++8YxUFLYjLduf/9k="
  className="object-cover transition-transform duration-300 group-hover:scale-105"
/>
```

**Skiing image (line 639-643):**

```tsx
<Image
  src="/about/skiing.jpg"
  alt="Tyler skiing"
  fill
  sizes="(min-width: 640px) 48vw, 100vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAIRAAAgIBBAIDAAAAAAAAAAAAAQIDBAAFERIhBjETQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Az0XV9Ur6akFq0I7EEXBnVSVUEkDf97yHUdbr2tRlitW5Z5I2KO0jkkEHog++8YxUFLYjLduf/9k="
  className="object-cover transition-transform duration-300 group-hover:scale-105"
/>
```

**Workshop image (line 651-655):**

```tsx
<Image
  src="/about/workshop.jpg"
  alt="Tyler's woodworking workshop"
  fill
  sizes="(min-width: 640px) 48vw, 100vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAIRAAAgIBBAIDAAAAAAAAAAAAAQIDBAAFERIhBjETQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Az0XV9Ur6akFq0I7EEXBnVSVUEkDf97yHUdbr2tRlitW5Z5I2KO0jkkEHog++8YxUFLYjLduf/9k="
  className="object-cover transition-transform duration-300 group-hover:scale-105"
/>
```

**Family image (line 675-679):**

```tsx
<Image
  src="/about/family.jpg"
  alt="Tyler with his family"
  fill
  priority
  sizes="(min-width: 640px) 60vw, 100vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAIRAAAgIBBAIDAAAAAAAAAAAAAQIDBAAFERIhBjETQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Az0XV9Ur6akFq0I7EEXBnVSVUEkDf97yHUdbr2tRlitW5Z5I2KO0jkkEHog++8YxUFLYjLduf/9k="
  className="object-cover transition-transform duration-300 group-hover:scale-105"
/>
```

**Tyler & Ashton image (line 687-691):**

```tsx
<Image
  src="/about/tyler_ashton.jpg"
  alt="Tyler with his son Ashton"
  fill
  sizes="(min-width: 640px) 35vw, 70vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAIRAAAgIBBAIDAAAAAAAAAAAAAQIDBAAFERIhBjETQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Az0XV9Ur6akFq0I7EEXBnVSVUEkDf97yHUdbr2tRlitW5Z5I2KO0jkkEHog++8YxUFLYjLduf/9k="
  className="object-cover transition-transform duration-300 group-hover:scale-105"
/>
```

Note: The placeholder blur data URLs above are generic small placeholders. For better results, generate proper ones from the actual compressed images using `plaiceholder` (already a project dependency) or a one-off script. But generic gray placeholders work fine as a starting point.

- [ ] **Step 4: Verify build succeeds**

Run: `npx next build`
Expected: Build succeeds with no image-related warnings.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts app/components/ProfileCard.tsx app/about/page.tsx
git commit -m "Enable AVIF format, add image sizes and blur placeholders

Add image/avif to Next.js image formats for modern browsers.
Add sizes prop to ProfileCard and about page images.
Add blur placeholders to about page photos for better loading UX."
```

---

### Task 3: Skeleton Loaders

**Files:**

- Modify: `app/loading.tsx`
- Create: `app/about/loading.tsx`
- Create: `app/contact/loading.tsx`

- [ ] **Step 1: Rewrite home page loading skeleton**

Replace `app/loading.tsx` with a skeleton matching the home page layout (ProfileCard + TechnicalSkills + WorkExperience). Reference existing skeleton style from `app/projects/loading.tsx`.

```tsx
export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <main className="mx-6 pt-4 pb-16 lg:mx-25">
        {/* ProfileCard skeleton */}
        <div className="relative mx-auto mt-4 overflow-hidden rounded-3xl border border-gray-300 bg-white p-8 shadow-md xl:min-h-[280px] xl:py-12 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center xl:flex-row xl:items-start xl:gap-8">
            <div className="mx-auto mb-6 h-40 w-48 animate-pulse rounded-3xl bg-gray-200 xl:mb-0 xl:h-[200px] xl:w-[200px] xl:shrink-0 dark:bg-gray-700" />
            <div className="flex w-full flex-col items-center text-center">
              <div className="mb-4 h-10 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-6 h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex gap-3">
                <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* TechnicalSkills skeleton */}
        <div className="mt-8 rounded-3xl border border-gray-300 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="mb-3 h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="h-8 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WorkExperience skeleton */}
        <div className="mt-8 rounded-3xl border border-gray-300 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 h-8 w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-gray-200 p-6 dark:border-gray-700"
              >
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1">
                  <div className="mb-2 h-6 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mb-1 h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create about page skeleton**

Create `app/about/loading.tsx`:

```tsx
export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        {/* Hero section skeleton */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-5 w-96 max-w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Stats skeleton */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-300 bg-white p-6 text-center shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mx-auto mb-2 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>

        {/* Content sections skeleton */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="mb-8 rounded-3xl border border-gray-300 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 h-7 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create contact page skeleton**

Create `app/contact/loading.tsx`:

```tsx
export default function ContactLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12 md:py-20">
      <div className="w-full max-w-2xl md:max-w-4xl">
        {/* Hero skeleton */}
        <div className="mb-10 text-center md:mb-14">
          <div className="mx-auto mb-4 h-10 w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto mb-6 h-1 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-5 w-96 max-w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Contact methods skeleton */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 md:mb-10 md:gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-gray-300 bg-white p-6 shadow-md md:gap-6 md:rounded-3xl md:p-8 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-gray-200 md:h-16 md:w-16 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Social links skeleton */}
        <div className="mb-8 rounded-2xl border border-gray-300 bg-white p-6 shadow-md md:mb-10 md:rounded-3xl md:p-10 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex justify-center gap-4 md:gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-14 w-14 animate-pulse rounded-xl bg-gray-200 md:h-16 md:w-16 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>

        {/* Contact form skeleton */}
        <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-md md:rounded-3xl md:p-10 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 h-7 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-4">
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-32 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-12 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify skeletons appear**

Run: `npx next dev`, navigate to each page, and use browser DevTools Network tab to throttle to "Slow 3G". Verify skeletons show during route transitions.

- [ ] **Step 5: Commit**

```bash
git add app/loading.tsx app/about/loading.tsx app/contact/loading.tsx
git commit -m "Add skeleton loaders for home, about, and contact pages

Replace home page spinner with layout-matching skeleton.
Add new skeleton loaders for about and contact pages.
Matches existing skeleton style from projects/hobbies pages."
```

---

### Task 4: SEO Metadata Enhancements

**Files:**

- Create: `app/about/layout.tsx`
- Modify: `app/layout.tsx:95-109` (JSON-LD), `app/layout.tsx:138-141` (script tag)
- Create: `public/og-image.png` (via script)

- [ ] **Step 1: Create about page layout with metadata**

Create `app/about/layout.tsx` (following the same pattern as `app/contact/layout.tsx`):

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn more about Tyler Grant — a software engineer passionate about building innovative solutions, self-hosting, woodworking, and family life.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 2: Add WebSite JSON-LD to root layout**

In `app/layout.tsx`, replace the single `jsonLd` variable (lines 95-109) with two separate schemas:

```typescript
// JSON-LD structured data
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tyler Grant',
  url: siteUrl,
  jobTitle: 'Software Engineer',
  description:
    'A software engineer passionate about building innovative and efficient solutions.',
  email: 'recruit.tyler.grant@gmail.com',
  sameAs: [
    'https://github.com/tylerbb812',
    'https://www.linkedin.com/in/tyler-james-grant/',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Tyler Grant',
  url: siteUrl,
  description:
    'A portfolio showcasing skills, projects, and experience in software development.',
  author: { '@type': 'Person', name: 'Tyler Grant' },
};
```

Then update the JSON-LD `<script>` tag in `<head>` (lines 138-141) to render both:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify([personJsonLd, websiteJsonLd]),
  }}
/>
```

- [ ] **Step 3: Create OG image**

Create a script to generate the OG image using sharp (ESM syntax to match project setup):

Create `scripts/generate-og-image.mjs`:

```javascript
import sharp from 'sharp';

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111827;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fde047;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect x="100" y="290" width="400" height="4" rx="2" fill="url(#accent)" />
  <text x="100" y="270" font-family="sans-serif" font-size="64" font-weight="bold" fill="#f3f4f6">Tyler Grant</text>
  <text x="100" y="340" font-family="sans-serif" font-size="32" fill="#fde047">Software Engineer</text>
  <text x="100" y="400" font-family="sans-serif" font-size="22" fill="#9ca3af">tyler-grant.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('Created public/og-image.png (1200x630)');
```

Run: `node scripts/generate-og-image.mjs`

- [ ] **Step 4: Verify metadata**

Run: `npx next build && npx next start`, then check:

- View page source on `/about` — should have title "About | Tyler Grant"
- Check JSON-LD in page source — should have both Person and WebSite schemas
- Verify `public/og-image.png` exists and looks correct

- [ ] **Step 5: Commit**

```bash
git add app/about/layout.tsx app/layout.tsx public/og-image.png scripts/generate-og-image.mjs
git commit -m "Enhance SEO with about page metadata, WebSite JSON-LD, and OG image

Add metadata to about page via layout (same pattern as contact).
Add WebSite schema alongside existing Person JSON-LD.
Create branded OG image referenced by root metadata."
```

---

### Task 5: Lighthouse Accessibility Fixes

**Files:**

- Modify: `app/components/NavBar.tsx:527-528`
- Modify: `app/components/AIChatBubble.tsx:337`

- [ ] **Step 1: Add aria-label to NavBar hamburger button**

In `app/components/NavBar.tsx`, line 527-528, the hamburger button has no accessible name. Add `aria-label`:

```tsx
<button
  className="relative px-4 text-2xl text-gray-900 dark:text-gray-200"
  onClick={() => setIsOpen(!isOpen)}
  aria-label="Toggle navigation menu"
>
```

- [ ] **Step 2: Replace aria-hidden with inert on AIChatBubble**

In `app/components/AIChatBubble.tsx`, line 337, replace:

```tsx
aria-hidden={!isOpen}
```

with:

```tsx
{...(!isOpen ? { inert: true } : {})}
```

Remove the `aria-hidden` attribute entirely. The `inert` attribute is supported natively in React 19 and all modern browsers. It prevents focus on descendants when the chat is collapsed, which is what Lighthouse wants.

- [ ] **Step 3: Verify fixes**

Run: `npx next dev`, open Chrome DevTools > Lighthouse > Accessibility audit. Both issues should be resolved:

- "Buttons have an accessible name" should pass
- "`[aria-hidden="true"]` elements contain focusable descendants" should pass

- [ ] **Step 4: Commit**

```bash
git add app/components/NavBar.tsx app/components/AIChatBubble.tsx
git commit -m "Fix Lighthouse accessibility issues

Add aria-label to NavBar hamburger button.
Replace aria-hidden with inert attribute on AIChatBubble
to prevent focus on descendants when chat is collapsed."
```

---

### Task 6: Lighthouse Performance — Lazy Loading and Preconnect

**Files:**

- Create: `app/components/LazyAIChatBubble.tsx` — client wrapper for dynamic import
- Create: `app/components/LazyArchitectureDiagram.tsx` — client wrapper for dynamic import
- Modify: `app/layout.tsx:7,163` — swap AIChatBubble for lazy wrapper
- Modify: `app/projects/page.tsx:9-13` — swap ArchitectureDiagram for lazy wrapper
- Modify: `app/layout.tsx` `<head>` — add preconnect hint

**Important:** `app/layout.tsx` is a server component. `next/dynamic` with `{ ssr: false }` requires a client component boundary. We must create client wrapper components.

- [ ] **Step 1: Create LazyAIChatBubble client wrapper**

Create `app/components/LazyAIChatBubble.tsx`:

```tsx
'use client';

import dynamic from 'next/dynamic';

const AIChatBubble = dynamic(() => import('./AIChatBubble'), {
  ssr: false,
});

export default function LazyAIChatBubble() {
  return <AIChatBubble />;
}
```

- [ ] **Step 2: Update layout.tsx to use lazy wrapper**

In `app/layout.tsx`, replace:

```tsx
import AIChatBubble from './components/AIChatBubble';
```

with:

```tsx
import LazyAIChatBubble from './components/LazyAIChatBubble';
```

And at line 163, replace:

```tsx
<AIChatBubble />
```

with:

```tsx
<LazyAIChatBubble />
```

- [ ] **Step 3: Extract architecture data to separate file**

The `ArchitectureDiagram.tsx` file contains both the heavy rendering component (framer-motion, 20+ react-icons) and plain data exports (`balancelyArchitecture`, etc.). Importing data from the same file defeats code-splitting since the entire module gets bundled.

Create `app/components/architectureDiagramData.ts` by moving from `ArchitectureDiagram.tsx`:

- The `ArchitectureDiagramProps` interface (and any types it depends on like `ArchNode`, `ArchConnection`)
- The `balancelyArchitecture`, `backupArchitecture`, and `portfolioArchitecture` const exports

Leave the default export component in `ArchitectureDiagram.tsx` and have it import its types from the new data file.

- [ ] **Step 4: Create LazyArchitectureDiagram client wrapper**

Create `app/components/LazyArchitectureDiagram.tsx`:

```tsx
'use client';

import dynamic from 'next/dynamic';

const ArchitectureDiagram = dynamic(() => import('./ArchitectureDiagram'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
  ),
});

export default ArchitectureDiagram;
```

- [ ] **Step 5: Update projects page to use lazy wrapper and data file**

In `app/projects/page.tsx`, replace lines 9-13:

```tsx
import ArchitectureDiagram, {
  balancelyArchitecture,
  backupArchitecture,
  portfolioArchitecture,
} from '@/app/components/ArchitectureDiagram';
```

with:

```tsx
import LazyArchitectureDiagram from '@/app/components/LazyArchitectureDiagram';
import {
  balancelyArchitecture,
  backupArchitecture,
  portfolioArchitecture,
} from '@/app/components/architectureDiagramData';
```

Then find-and-replace all `<ArchitectureDiagram` with `<LazyArchitectureDiagram` in the file.

This ensures only the lightweight data objects are bundled with the projects page. The heavy rendering code (framer-motion, react-icons) is loaded lazily via the dynamic import.

- [ ] **Step 6: Add preconnect hint for CDN**

In `app/layout.tsx`, inside `<head>` (after the theme script, before the JSON-LD script), add:

```tsx
<link rel="preconnect" href="https://cdn.tyler-grant.com" />
```

- [ ] **Step 7: Verify build and no regressions**

Run: `npx next build`
Expected: Build succeeds. AIChatBubble and ArchitectureDiagram are code-split into separate chunks.

- [ ] **Step 8: Commit**

```bash
git add app/components/LazyAIChatBubble.tsx app/components/LazyArchitectureDiagram.tsx app/components/architectureDiagramData.ts app/components/ArchitectureDiagram.tsx app/layout.tsx app/projects/page.tsx
git commit -m "Lazy-load AIChatBubble and ArchitectureDiagram, add preconnect

Extract architecture data to separate file for proper code-splitting.
Create client wrapper components for dynamic imports since
layout.tsx is a server component. Add CDN preconnect hint."
```

---

### Task 7: Final Verification

- [ ] **Step 1: Run full build**

Run: `npx next build`
Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Run Lighthouse audit**

Run: `npx next start` (in one terminal), then run Lighthouse in Chrome DevTools or via CLI.
Expected:

- Performance >= 90 (was 84)
- Accessibility >= 95 (was 90)
- Best Practices = 100 (unchanged)
- SEO = 100 (unchanged)
- LCP < 2.5s (was 4.5s)

- [ ] **Step 3: Clean up**

Delete the old Lighthouse report (untracked file, not in git):

```bash
rm tyler-grant.com_2026-03-22_21-41-17.report.html
```
