import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StarfieldWrapper from './components/StarfieldWrapper';
import Navbar from './components/NavBar';
import SessionProvider from './components/SessionProvider';
import AnalyticsTracker from './components/AnalyticsTracker';
import AIChatBubble from './components/AIChatBubble';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tyler-grant.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Tyler Grant | Software Developer',
    template: '%s | Tyler Grant',
  },
  description:
    'A portfolio website showcasing my skills, projects, and experience as a computer scientist. Explore my work in software development, algorithms, and problem-solving, and learn more about my passion for building innovative and efficient solutions.',
  keywords: [
    'Tyler Grant',
    'Software Developer',
    'Portfolio',
    'Web Development',
    'Computer Science',
    'React',
    'Next.js',
    'TypeScript',
  ],
  authors: [{ name: 'Tyler Grant' }],
  creator: 'Tyler Grant',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Tyler Grant',
    title: 'Tyler Grant | Software Developer',
    description:
      'A portfolio showcasing skills, projects, and experience in software development.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tyler Grant - Software Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tyler Grant | Software Developer',
    description:
      'A portfolio showcasing skills, projects, and experience in software development.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tyler Grant',
  url: siteUrl,
  jobTitle: 'Software Developer',
  description:
    'A software developer passionate about building innovative and efficient solutions.',
  email: 'recruit.tyler.grant@gmail.com',
  sameAs: [
    'https://github.com/tylerbb812',
    'https://www.linkedin.com/in/tyler-james-grant/',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <AnalyticsTracker />
          <StarfieldWrapper
            starCount={800}
            starColor={[255, 255, 255]}
            speedFactor={0.05}
            backgroundColor="black"
          />
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-yellow-300 focus:px-4 focus:py-2 focus:text-gray-900 focus:outline-none"
          >
            Skip to main content
          </a>
          <div className="min-h-screen bg-gray-900">
            <Navbar />
            <main id="main-content" className="mt-6">
              {children}
            </main>
          </div>
          <AIChatBubble />
        </SessionProvider>
      </body>
    </html>
  );
}
