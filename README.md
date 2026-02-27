# Tyler Grant's Portfolio

A modern, full-stack portfolio website built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/).

## Features

- **Responsive Design** — Mobile-first, dark-themed (with light mode toggle), and fully responsive
- **Animated UI** — Page transitions, animated banners, and modals powered by Framer Motion
- **Project Showcase** — Expandable project cards with image carousels, timelines, budget tracking, materials checklists, and lessons learned
- **Hobbies Section** — Dynamic hobby pages with photo grids, before/after comparisons, and difficulty ratings
- **AI Chat Bubble** — Interactive chat assistant on the home page
- **Admin Dashboard** — Manage projects, members, contacts, and chat sessions
- **User Authentication** — Registration, login, and profile management via NextAuth.js
- **Contact Form** — Email notifications via Nodemailer with admin inbox
- **Analytics** — Traffic tracking and charts in the admin panel
- **Receipt Parser** — AI-powered receipt scanning demo
- **PWA Support** — Installable as a progressive web app
- **Resume Download** — Downloadable PDF with a custom thank-you modal

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@your-host:5432/portfolio"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Create an admin user:**

   ```bash
   npx tsx scripts/create-admin.ts your@email.com yourpassword
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── page.tsx                  # Home (Profile, Skills, Experience, AI Chat)
├── about/page.tsx            # About Me
├── projects/page.tsx         # Projects showcase
├── hobbies/                  # Hobbies with dynamic [slug] routes
├── contact/page.tsx          # Contact form
├── profile/page.tsx          # User profile management
├── login/page.tsx            # Login
├── register/page.tsx         # Registration
├── demo/receipt-parser/      # Receipt parser demo
├── admin/                    # Admin dashboard
│   ├── page.tsx              # Dashboard overview & analytics
│   ├── projects/             # Project management (CRUD)
│   ├── members/              # Member management
│   ├── contacts/             # Contact message inbox
│   └── chat-sessions/        # AI chat session logs
├── api/                      # API routes
│   ├── auth/                 # NextAuth + registration
│   ├── projects/             # Project CRUD, comments, materials, time entries
│   ├── chat/                 # AI chat endpoints
│   ├── contact/              # Contact form + admin
│   ├── analytics/            # Traffic analytics
│   ├── upload/               # S3 file uploads
│   └── receipts/             # Receipt parsing
├── components/               # 38 reusable components
│   ├── NavBar.tsx            # Responsive nav with mobile dropdown
│   ├── ProfileCard.tsx       # Profile card with resume download
│   ├── AIChatBubble.tsx      # AI chat assistant
│   ├── ImageCarousel.tsx     # Image carousel with lightbox
│   ├── ContactForm.tsx       # Contact form with validation
│   ├── ThemeToggle.tsx       # Light/dark mode toggle
│   ├── TrafficChart.tsx      # Analytics charts (Recharts)
│   └── ...                   # And many more
└── layout.tsx                # Root layout with Starfield background
```

## Tech Stack

- **Framework:** Next.js 16 / React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js
- **Animations:** Framer Motion
- **Storage:** AWS S3
- **Email:** Nodemailer
- **Charts:** Recharts
- **PWA:** next-pwa

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run format    # Run Prettier
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) deploys on push to `main` — builds in an isolated temp directory, syncs to the live directory, and restarts via PM2.

## License

This project is for personal portfolio use. Feel free to fork and adapt for your own site!
