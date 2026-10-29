'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Bot,
  Target,
  TrendingUp,
  Settings,
  User,
  X,
  Sparkles,
  Award,
} from 'lucide-react';
import { authManager, UserProfile } from '@/lib/auth/authManager';
import { Badge } from '@/components/ui';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenAISettings: () => void;
  onOpenWeaknessTracker: (initialTab?: 'skills' | 'queue' | 'policy') => void;
  onToggleAITutor?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenAISettings,
  onOpenWeaknessTracker,
  onToggleAITutor,
}) => {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(authManager.getCurrentUser());

  useEffect(() => {
    const unsub = authManager.subscribe((activeUser) => {
      setUser(activeUser);
    });
    return () => unsub();
  }, []);

  // Trap Escape key and prevent background scroll when drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isHome = pathname === '/';
  const isExercise = pathname.startsWith('/exercises');

  return (
    <div
      className="mobile-nav-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng di động"
      >
        {/* Drawer Header */}
        <div
          style={{
            height: 'var(--header-height)',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--pastel-mint)',
                color: 'var(--pastel-mint-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--pastel-mint-active)',
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                CodeCoBUG
              </div>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--pastel-mint-text)' }}>
                STUDIO DI ĐỘNG
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: 'var(--radius-full)' }}
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: '20px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
          }}
        >
          {/* 1. Dashboard */}
          <Link
            href="/"
            onClick={onClose}
            className={`sidebar-nav-item ${isHome ? 'sidebar-nav-item-active' : ''}`}
            style={{ minHeight: '48px', padding: '12px 16px' }}
          >
            <LayoutDashboard size={20} />
            <span>Bảng điều khiển</span>
          </Link>

          {/* 2. Python Curriculum */}
          <Link
            href="/#curriculum"
            onClick={onClose}
            className="sidebar-nav-item"
            style={{ minHeight: '48px', padding: '12px 16px' }}
          >
            <BookOpen size={20} />
            <span>Giáo trình Python</span>
          </Link>

          {/* 3. Practice Exercises */}
          <Link
            href="/exercises/in-loi-chao-codecobug"
            onClick={onClose}
            className={`sidebar-nav-item ${isExercise ? 'sidebar-nav-item-active' : ''}`}
            style={{ minHeight: '48px', padding: '12px 16px' }}
          >
            <Code2 size={20} />
            <span>Luyện tập Code</span>
          </Link>

          {/* 4. AI Tutor */}
          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() => {
              onClose();
              if (onToggleAITutor) {
                onToggleAITutor();
              } else {
                onOpenAISettings();
              }
            }}
            style={{ minHeight: '48px', padding: '12px 16px', width: '100%', textAlign: 'left', background: 'none' }}
          >
            <Bot size={20} style={{ color: 'var(--pastel-lavender-text)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span>AI Tutor</span>
              <Badge variant="lavender" size="sm">BYOK</Badge>
            </div>
          </button>

          {/* 5. Review Mistakes */}
          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() => {
              onClose();
              onOpenWeaknessTracker('queue');
            }}
            style={{ minHeight: '48px', padding: '12px 16px', width: '100%', textAlign: 'left', background: 'none' }}
          >
            <Target size={20} style={{ color: 'var(--pastel-peach-text)' }} />
            <span>Ôn tập bài sai</span>
          </button>

          {/* 6. Learning Progress */}
          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() => {
              onClose();
              onOpenWeaknessTracker('skills');
            }}
            style={{ minHeight: '48px', padding: '12px 16px', width: '100%', textAlign: 'left', background: 'none' }}
          >
            <TrendingUp size={20} style={{ color: 'var(--pastel-mint-text)' }} />
            <span>Tiến độ kỹ năng</span>
          </button>
        </nav>

        {/* Drawer Footer */}
        <div
          style={{
            padding: '16px 14px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() => {
              onClose();
              onOpenAISettings();
            }}
            style={{ minHeight: '44px', padding: '10px 14px', width: '100%', textAlign: 'left', background: 'none' }}
          >
            <Settings size={18} />
            <span>Cài đặt AI (BYOK)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              minHeight: '48px',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--pastel-mint)',
                color: 'var(--pastel-mint-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: '1px solid var(--pastel-mint-active)',
              }}
            >
              {user ? user.displayName.charAt(0).toUpperCase() : <User size={16} />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user ? user.displayName : 'Đăng nhập tài khoản'}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {user ? (
                  <>
                    <Award size={12} style={{ color: 'var(--pastel-mint-text)' }} />
                    <span>{user.points} pt</span>
                  </>
                ) : (
                  <span>Lưu kết quả học tập</span>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
