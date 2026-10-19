import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tyler-grant.com';

const description =
  'Back Up is a card-driven board game for 2 to 6 players that I designed and built end to end: a React Native iOS app with bots, live and async online play, and a Node.js game server.';

export const metadata: Metadata = {
  title: 'Back Up',
  description,
  alternates: {
    canonical: `${siteUrl}/projects/backup`,
  },
  openGraph: {
    title: 'Back Up | Tyler Grant',
    description,
    url: `${siteUrl}/projects/backup`,
    images: [{ url: '/backup.png', width: 1024, height: 1024 }],
    type: 'article',
  },
};

export default function BackupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
