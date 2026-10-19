import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tyler-grant.com';

const description =
  'Balancely is a personal-finance and budgeting app I designed and built end to end: a native SwiftUI iOS app with a watchOS companion and widgets, backed by a custom Next.js API.';

export const metadata: Metadata = {
  title: 'Balancely',
  description,
  alternates: {
    canonical: `${siteUrl}/projects/balancely`,
  },
  openGraph: {
    title: 'Balancely | Tyler Grant',
    description,
    url: `${siteUrl}/projects/balancely`,
    images: [{ url: '/balancely.png', width: 1024, height: 1024 }],
    type: 'article',
  },
};

export default function BalancelyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
