'use client';

import React from 'react';

export type BadgeVariant =
  | 'mint'
  | 'lavender'
  | 'sky'
  | 'peach'
  | 'yellow'
  | 'success'
  | 'error'
  | 'warning'
  | 'neutral'
  | 'very_easy'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'challenge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'mint',
  size = 'md',
  icon,
  className = '',
  style,
  ...props
}) => {
  const sizeStyles: Record<'sm' | 'md', React.CSSProperties> = {
    sm: {
      fontSize: '0.7rem',
      padding: '2px 8px',
      gap: '4px',
    },
    md: {
      fontSize: '0.78rem',
      padding: '4px 10px',
      gap: '5px',
    },
  };

  return (
    <span
      className={`badge badge-${variant} ${className}`.trim()}
      style={{
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </span>
  );
};

