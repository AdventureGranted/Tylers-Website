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
