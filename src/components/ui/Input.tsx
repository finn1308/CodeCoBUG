'use client';

import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div
        className="form-group"
        style={{
          width: fullWidth ? '100%' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          {leftIcon && (
            <div
              style={{
                position: 'absolute',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`form-input ${error ? 'form-input-error' : ''} ${className}`.trim()}
            style={{
              paddingLeft: leftIcon ? '38px' : '14px',
              paddingRight: rightIcon ? '38px' : '14px',
              ...style,
            }}
            {...props}
          />

          {rightIcon && (
            <div
              style={{
                position: 'absolute',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
              }}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <div id={errorId} className="form-error-text" role="alert">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <div id={helperId} className="form-helper-text">
            {helperText}
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
