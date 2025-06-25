import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Starfield from './components/Starfield';
import Navbar from './components/NavBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tyler Grant',
  description:
    'A portfolio website showcasing my skills, projects, and experience as a computer scientist. Explore my work in software development, algorithms, and problem-solving, and learn more about my passion for building innovative and efficient solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Starfield
        starCount={1500}
        starColor={[255, 255, 255]}
        speedFactor={0.05}
        backgroundColor="black"
      />
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="min-h-screen bg-gray-900">
            <Navbar />
            {children}
          </div>
        </body>
      </html>
    </>
  );
}
