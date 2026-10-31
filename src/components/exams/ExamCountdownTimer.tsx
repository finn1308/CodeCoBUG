'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui';

export interface ExamCountdownTimerProps {
  expiresAt: string;
  onTimeExpired: () => void;
  isSubmitted?: boolean;
}

export const ExamCountdownTimer: React.FC<ExamCountdownTimerProps> = ({
  expiresAt,
  onTimeExpired,
  isSubmitted = false,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
      if (diff <= 0) {
        setSecondsRemaining(0);
        clearInterval(interval);
        onTimeExpired();
      } else {
        setSecondsRemaining(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onTimeExpired, isSubmitted]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining < 180; // Dưới 3 phút đổi sang màu peach cảnh báo

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isUrgent ? 'var(--pastel-peach-light)' : 'var(--bg-surface)',
        border: isUrgent ? '1px solid var(--pastel-peach)' : '1px solid var(--border-medium)',
        color: isUrgent ? 'var(--pastel-peach-text)' : 'var(--text-primary)',
        boxShadow: 'var(--shadow-xs)',
        fontWeight: 700,
        fontSize: '0.92rem',
        fontFamily: 'var(--font-mono)',
        transition: 'all var(--transition-base)',
      }}
    >
      {isUrgent ? <AlertTriangle size={16} /> : <Clock size={16} />}
      <span>{formattedTime}</span>
      {isUrgent && (
        <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
          Sắp hết giờ!
        </span>
      )}
    </div>
  );
};
