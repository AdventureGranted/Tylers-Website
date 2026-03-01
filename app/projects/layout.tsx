import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'View my software development projects including full-stack applications, self-hosted infrastructure, and mobile apps.',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
