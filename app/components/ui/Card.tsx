import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  rounded?: '2xl' | '3xl';
  padding?: string;
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  style,
  rounded = '2xl',
  padding = 'p-6',
  hover = false,
}: CardProps) {
  const roundedClass = rounded === '3xl' ? 'rounded-3xl' : 'rounded-2xl';
  const hoverClass = hover
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
    : '';
  return (
    <div
      className={`${roundedClass} border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 ${padding} ${hoverClass} shadow-md dark:shadow-lg ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
