import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  rounded?: '2xl' | '3xl';
  padding?: string;
}

export function Card({
  children,
  className = '',
  style,
  rounded = '2xl',
  padding = 'p-6',
}: CardProps) {
  const roundedClass = rounded === '3xl' ? 'rounded-3xl' : 'rounded-2xl';
  return (
    <div
      className={`${roundedClass} border border-[var(--card-border)] bg-[var(--card-bg)] ${padding} ${className}`}
      style={{ boxShadow: 'var(--card-shadow)', ...style }}
    >
      {children}
    </div>
  );
}
