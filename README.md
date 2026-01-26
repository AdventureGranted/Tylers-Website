# Tyler Grant's Portfolio

A modern, responsive portfolio website built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/).

## Features

- **Responsive Design:** Mobile-first, dark-themed, and fully responsive.
- **Animated UI:** Mobile menu transitions, animated banners, and modals.
- **Component-Based:** Reusable components for cards, modals, navigation, and more.
- **Project Showcase:** Expandable project cards with images and details.
- **Work Experience:** Data-driven, visually organized experience cards.
- **Contact & About Pages:** Easy-to-update sections for personal info and contact.
- **Resume Download:** Downloadable PDF with a custom thank-you modal.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`
  - `page.tsx` – Home page (Profile, Skills, Experience, animated chat bubble)
  - `about/page.tsx` – About Me (Family, Hobbies, Other)
  - `projects/page.tsx` – Projects grid with images and details
  - `contact/page.tsx` – Contact info (email, phone)
  - `components/`
    - `NavBar.tsx` – Responsive navigation bar with animated mobile dropdown
    - `ProfileCard.tsx` – Profile and resume download with modal
    - `WorkExperienceCard.tsx` – Work experience cards
    - `TechnicalSkills.tsx` – Skills and technologies
    - `Card.tsx` – Reusable card component
    - `Modal.tsx` – Reusable modal dialog
- `public/` – Static assets (images, resume PDF, favicon)

## Customization

- **Update your resume:** Replace `public/Tyler_Grant_Resume_2025.pdf`.
- **Add projects:** Edit `app/projects/page.tsx` and add to the `projects` array.
- **Edit About/Contact:** Update `app/about/page.tsx` and `app/contact/page.tsx`.

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS 4
- TypeScript
- React Icons

## License

This project is for personal portfolio use. Feel free to fork and adapt for your own site!
