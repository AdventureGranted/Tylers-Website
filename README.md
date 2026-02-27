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

## NAS Storage Setup (Optional)

Uploads are stored on a NAS for persistence. To set up locally:

### Windows (WSL Development)

1. **Map NAS share to a drive letter in Windows:**
   - File Explorer → Right-click "This PC" → Map network drive
   - Map `\\your-nas\path\to\uploads` to `U:`

2. **Mount the drive in WSL:**

   ```bash
   sudo mkdir -p /mnt/u
   sudo mount -t drvfs U: /mnt/u

   # Add to /etc/fstab for persistence:
   echo "U: /mnt/u drvfs defaults 0 0" | sudo tee -a /etc/fstab
   ```

3. **Create a Windows junction (required for Next.js):**

   In **PowerShell (as Administrator)**:

   ```powershell
   New-Item -ItemType Junction -Path "C:\Users\YourUser\path\to\project\public\uploads" -Target "U:\"
   ```

   Or in **CMD (as Administrator)**:

   ```cmd
   mklink /D "C:\Users\YourUser\path\to\project\public\uploads" "U:\"
   ```

### Linux Server (Production)

1. **Mount NAS:**

   ```bash
   sudo mkdir -p /mnt/nas/uploads
   sudo mount -t nfs your-nas-ip:/path/to/share /mnt/nas/uploads
   ```

2. **Symlink to public folder:**

   ```bash
   ln -s /mnt/nas/uploads /path/to/app/public/uploads
   ```

### Proxmox LXC Container

Pass through the NAS mount to the container:

```bash
pct set <container_id> --mp0 /mnt/pve/NAS/uploads,mp=/mnt/nas/uploads
```

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

- **Update your resume:** Replace `public/Tyler_Grant_Resume_2026.pdf`.
- **Add projects:** Edit `app/projects/page.tsx` and add to the `projects` array.
- **Edit About/Contact:** Update `app/about/page.tsx` and `app/contact/page.tsx`.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript
- PostgreSQL + Prisma
- NextAuth.js
- React Icons

## License

This project is for personal portfolio use. Feel free to fork and adapt for your own site!
