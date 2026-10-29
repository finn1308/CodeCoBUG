'use client';

/**
 * CodeCoBUG Toast Notification System
 * Adapted from LucianLabs UX/UI Prompt patterns (https://lucianlabs.dev/uxui-prompt/)
 * Released under MIT License.
 *
 * Provides compact, accessible, non-disruptive feedback (180–220ms entrance)
 * for user operations (copied code, saved settings, submission status).
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (options: { message: string; title?: string; variant?: ToastVariant; duration?: number }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({
      message,
      title,
      variant = 'info',
      duration = 3200,
    }: {
      message: string;
      title?: string;
      variant?: ToastVariant;
      duration?: number;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, message, title, variant, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 toasts to avoid screen clutter

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (message: string, title?: string) => toast({ message, title, variant: 'success' }),
    [toast]
  );

  const error = useCallback(
    (message: string, title?: string) => toast({ message, title, variant: 'error' }),
    [toast]
  );

  const info = useCallback(
    (message: string, title?: string) => toast({ message, title, variant: 'info' }),
    [toast]
  );

  const warning = useCallback(
    (message: string, title?: string) => toast({ message, title, variant: 'warning' }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 size={16} style={{ color: 'var(--pastel-mint-text)', flexShrink: 0 }} />,
  info: <Info size={16} style={{ color: 'var(--pastel-sky-text)', flexShrink: 0 }} />,
  warning: <AlertTriangle size={16} style={{ color: 'var(--pastel-yellow-text)', flexShrink: 0 }} />,
  error: <AlertCircle size={16} style={{ color: 'var(--status-error-text)', flexShrink: 0 }} />,
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      role="region"
      aria-label="Thông báo hệ thống"
      aria-live="polite"
    >
      {toasts.map((item) => {
        const variant = item.variant || 'info';
        return (
          <div
            key={item.id}
            className={`toast-item toast-item-${variant}`}
            role="status"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              {variantIcons[variant]}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, minWidth: 0 }}>
                {item.title && (
                  <strong style={{ fontSize: '0.82rem', marginBottom: '2px' }}>
                    {item.title}
                  </strong>
                )}
                <span style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.message}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '4px', borderRadius: 'var(--radius-full)', color: 'inherit', flexShrink: 0, marginLeft: '8px' }}
              onClick={() => onDismiss(item.id)}
              aria-label="Đóng thông báo"
              title="Đóng"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

