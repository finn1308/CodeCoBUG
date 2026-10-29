'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'mint'
  | 'lavender'
  | 'sky'
  | 'peach'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    // Map variant to CSS class name
    const variantClass = variant === 'primary' ? 'btn-primary' : `btn-${variant}`;

    // Size-specific styles
    const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
      sm: {
        padding: '5px 10px',
        fontSize: '0.8rem',
        borderRadius: 'var(--radius-sm)',
        gap: '6px',
      },
      md: {
        padding: '8px 16px',
        fontSize: '0.88rem',
        borderRadius: 'var(--radius-md)',
        gap: '8px',
      },
      lg: {
        padding: '11px 22px',
        fontSize: '0.96rem',
        borderRadius: 'var(--radius-lg)',
        gap: '10px',
      },
    };

    const combinedStyle: React.CSSProperties = {
      ...sizeStyles[size],
      width: fullWidth ? '100%' : undefined,
      ...style,
    };

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        className={`btn ${variantClass} ${className}`.trim()}
        style={combinedStyle}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2
            size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
            style={{ animation: 'spin 1s linear infinite' }}
          />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
