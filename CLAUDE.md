# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No testing framework is configured.

## Architecture

**Next.js App Router structure:**

- `app/layout.tsx` - Root layout with Starfield background and NavBar
- `app/page.tsx` - Home page (Profile, Skills, Experience, animated chat bubble)
- `app/about/page.tsx` - About Me page
- `app/projects/page.tsx` - Projects showcase (data-driven `projects` array)
- `app/contact/page.tsx` - Contact information
- `app/components/` - Reusable components (NavBar, ProfileCard, Modal, etc.)
- `public/` - Static assets (images, resume PDF)

**Component pattern:** Components using interactivity (state, effects) require `'use client'` directive.

## Styling

- Dark theme: gray-900 backgrounds, gray-800 cards, yellow-300 accents
- Tailwind CSS with Prettier plugin for consistent class ordering
- Geist Sans & Geist Mono fonts

## Code Style

Prettier config: single quotes, 2-space tabs, ES5 trailing commas.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) deploys on push to main:
- Builds in isolated temp directory
- Syncs to live directory and restarts via PM2 on port 3000
