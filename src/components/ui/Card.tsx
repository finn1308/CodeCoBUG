'use client';

import React from 'react';

export type CardVariant = 'default' | 'mint' | 'lavender' | 'sky' | 'peach' | 'yellow';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--bg-surface)',
    borderColor: 'var(--border-subtle)',
  },
  mint: {
    backgroundColor: 'var(--pastel-mint-light)',
    borderColor: 'var(--pastel-mint)',
  },
  lavender: {
    backgroundColor: 'var(--pastel-lavender-light)',
    borderColor: 'var(--pastel-lavender)',
  },
  sky: {
    backgroundColor: 'var(--pastel-sky-light)',
    borderColor: 'var(--pastel-sky)',
  },
  peach: {
    backgroundColor: 'var(--pastel-peach-light)',
    borderColor: 'var(--pastel-peach)',
  },
  yellow: {
    backgroundColor: 'var(--pastel-yellow-light)',
    borderColor: 'var(--pastel-yellow)',
  },
};

const paddingStyles = {
  none: { padding: '0' },
  sm: { padding: '14px' },
  md: { padding: '20px' },
  lg: { padding: '28px' },
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      interactive = false,
      padding = 'md',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`card-pastel ${className}`.trim()}
        style={{
          borderRadius: 'var(--radius-xl)',
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: 'var(--shadow-sm)',
          ...variantStyles[variant],
          ...paddingStyles[padding],
          cursor: interactive ? 'pointer' : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        marginBottom: '16px',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, style, ...props }, ref) => (
    <h3
      ref={ref}
      style={{
        fontSize: '1.18rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: 1.3,
        margin: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, style, ...props }, ref) => (
    <p
      ref={ref}
      style={{
        fontSize: '0.86rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        margin: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, style, ...props }, ref) => (
    <div ref={ref} style={{ flex: 1, ...style }} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-subtle)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
