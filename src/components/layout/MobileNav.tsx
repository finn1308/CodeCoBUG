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
  HelpCircle,
  FileCode,
  History,
  Layers,
  Compass,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { authManager, UserProfile } from '@/lib/auth/authManager';
import { Badge } from '@/components/ui';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenAISettings: () => void;
  onOpenWeaknessTracker: (initialTab?: 'skills' | 'queue' | 'policy' | 'history') => void;
  onToggleAITutor?: () => void;
  onOpenHelp?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenAISettings,
  onOpenWeaknessTracker,
  onToggleAITutor,
  onOpenHelp,
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

  const isHome = pathname === '/';
  const isCurriculum = pathname.startsWith('/curriculum');
  const isExercise = pathname.startsWith('/exercises');

  // Accordion open/close state for submenu groups
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    home: isHome,
    curriculum: isCurriculum,
    practice: isExercise,
  });

  const toggleSection = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isOpen) return null;

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

        {/* Navigation Content: 3 Primary Destinations & Submenus */}
        <nav
          style={{
            flex: 1,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
          }}
          aria-label="Điều hướng chính"
        >
          {/* 1. Tổng quan (Dashboard) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
              <Link
                href="/"
                onClick={onClose}
                className={`sidebar-nav-item ${isHome ? 'sidebar-nav-item-active' : ''}`}
                style={{ flex: 1, minHeight: '48px', padding: '12px 16px', paddingRight: '48px' }}
              >
                <LayoutDashboard size={20} />
                <span>Tổng quan</span>
              </Link>
              <button
                type="button"
                onClick={(e) => toggleSection('home', e)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isHome ? 'var(--pastel-mint-text)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                }}
                title={openSections.home ? 'Thu gọn mục con' : 'Mở rộng mục con'}
                aria-label={openSections.home ? 'Thu gọn mục con Tổng quan' : 'Mở rộng mục con Tổng quan'}
              >
                {openSections.home ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>

            {openSections.home && (
              <div className="sidebar-submenu" style={{ margin: '4px 0 6px 18px', paddingLeft: '14px' }}>
                <Link
                  href="/learning-path"
                  onClick={onClose}
                  className={`sidebar-sub-item ${pathname === '/learning-path' ? 'sidebar-sub-item-active' : ''}`}
                  style={{ minHeight: '44px', padding: '8px 12px' }}
                >
                  <Compass size={16} style={{ color: 'var(--pastel-sky-text)' }} />
                  <span>Lộ trình cá nhân hóa</span>
                </Link>
                <button
                  type="button"
                  className="sidebar-sub-item"
                  style={{ minHeight: '44px', padding: '8px 12px' }}
                  onClick={() => {
                    onClose();
                    onOpenWeaknessTracker('skills');
                  }}
                >
                  <TrendingUp size={16} style={{ color: 'var(--pastel-mint-text)' }} />
                  <span>Thống kê chi tiết</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Học Python (Curriculum) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
              <Link
                href="/#curriculum"
                onClick={onClose}
                className={`sidebar-nav-item ${isCurriculum ? 'sidebar-nav-item-active' : ''}`}
                style={{ flex: 1, minHeight: '48px', padding: '12px 16px', paddingRight: '48px' }}
              >
                <BookOpen size={20} />
                <span>Học Python</span>
              </Link>
              <button
                type="button"
                onClick={(e) => toggleSection('curriculum', e)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isCurriculum ? 'var(--pastel-mint-text)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                }}
                title={openSections.curriculum ? 'Thu gọn mục con' : 'Mở rộng mục con'}
                aria-label={openSections.curriculum ? 'Thu gọn mục con Học Python' : 'Mở rộng mục con Học Python'}
              >
                {openSections.curriculum ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>

            {openSections.curriculum && (
              <div className="sidebar-submenu" style={{ margin: '4px 0 6px 18px', paddingLeft: '14px' }}>
                <Link
                  href="/curriculum"
                  onClick={onClose}
                  className={`sidebar-sub-item ${isCurriculum ? 'sidebar-sub-item-active' : ''}`}
                  style={{ minHeight: '44px', padding: '8px 12px' }}
                >
                  <FileCode size={16} style={{ color: 'var(--pastel-sky-text)' }} />
                  <span>Chủ đề & Bài học</span>
                </Link>
                <Link
                  href="/projects"
                  onClick={onClose}
                  className={`sidebar-sub-item ${pathname.startsWith('/projects') ? 'sidebar-sub-item-active' : ''}`}
                  style={{ minHeight: '44px', padding: '8px 12px' }}
                >
                  <Layers size={16} style={{ color: 'var(--pastel-lavender-text)' }} />
                  <span>Dự án thực chiến</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Luyện tập (Practice) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
              <Link
                href="/exercises/in-loi-chao-codecobug"
                onClick={onClose}
                className={`sidebar-nav-item ${isExercise ? 'sidebar-nav-item-active' : ''}`}
                style={{ flex: 1, minHeight: '48px', padding: '12px 16px', paddingRight: '48px' }}
              >
                <Code2 size={20} />
                <span>Luyện tập</span>
              </Link>
              <button
                type="button"
                onClick={(e) => toggleSection('practice', e)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isExercise ? 'var(--pastel-mint-text)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                }}
                title={openSections.practice ? 'Thu gọn mục con' : 'Mở rộng mục con'}
                aria-label={openSections.practice ? 'Thu gọn mục con Luyện tập' : 'Mở rộng mục con Luyện tập'}
              >
                {openSections.practice ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>

            {openSections.practice && (
              <div className="sidebar-submenu" style={{ margin: '4px 0 6px 18px', paddingLeft: '14px' }}>
                <Link
                  href="/exercises/in-loi-chao-codecobug"
                  onClick={onClose}
                  className={`sidebar-sub-item ${isExercise ? 'sidebar-sub-item-active' : ''}`}
                  style={{ minHeight: '44px', padding: '8px 12px' }}
                >
                  <Code2 size={16} style={{ color: 'var(--pastel-mint-text)' }} />
                  <span>Phòng lab code</span>
                </Link>
                <button
                  type="button"
                  className="sidebar-sub-item"
                  style={{ minHeight: '44px', padding: '8px 12px' }}
                  onClick={() => {
                    onClose();
                    onOpenWeaknessTracker('queue');
                  }}
                >
                  <Target size={16} style={{ color: 'var(--pastel-peach-text)' }} />
                  <span>Ôn tập bài sai</span>
                </button>
                <button
                  type="button"
                  className="sidebar-sub-item"
                  style={{ minHeight: '44px', padding: '8px 12px' }}
                  onClick={() => {
                    onClose();
                    onOpenWeaknessTracker('history');
                  }}
                >
                  <History size={16} style={{ color: 'var(--pastel-sky-text)' }} />
                  <span>Lịch sử nộp bài</span>
                </button>
              </div>
            )}
          </div>

          {/* Contextual AI Tutor Access */}
          <div style={{ marginTop: '6px' }}>
            <button
              type="button"
              className="sidebar-assistant-pill"
              style={{ minHeight: '48px', padding: '10px 14px' }}
              onClick={() => {
                onClose();
                if (onToggleAITutor) {
                  onToggleAITutor();
                } else {
                  onOpenAISettings();
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={20} style={{ color: 'var(--pastel-lavender-text)' }} />
                <span>AI Tutor kèm cặp</span>
              </div>
              <Badge variant="lavender" size="sm">BYOK</Badge>
            </button>
          </div>

          <div className="sidebar-section-divider" />

          {/* Secondary Navigation */}
          {onOpenHelp && (
            <button
              type="button"
              className="sidebar-nav-item"
              onClick={() => {
                onClose();
                onOpenHelp();
              }}
              style={{ minHeight: '44px', padding: '10px 14px', width: '100%', textAlign: 'left', background: 'none' }}
            >
              <HelpCircle size={18} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.84rem' }}>Trợ giúp & Phím tắt</span>
            </button>
          )}
        </nav>

        {/* Drawer Footer: Settings & Account Menu */}
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
