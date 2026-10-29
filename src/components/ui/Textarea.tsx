'use client';

import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: customId,
      label,
      helperText,
      error,
      fullWidth = true,
      className = '',
      style,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = customId || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

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
          <label htmlFor={textareaId} className="form-label">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`form-input ${error ? 'form-input-error' : ''} ${className}`.trim()}
          style={{
            resize: 'vertical',
            minHeight: '80px',
            ...style,
          }}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
