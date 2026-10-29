'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { authManager, UserProfile } from '@/lib/auth/authManager';
import { Badge } from '@/components/ui';

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenAuth: () => void;
  onOpenAISettings: () => void;
  onOpenWeaknessTracker: (initialTab?: 'skills' | 'queue' | 'policy') => void;
  onToggleAITutor?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
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

  const isHome = pathname === '/';
  const isExercise = pathname.startsWith('/exercises');

  return (
    <aside
      className={`app-sidebar ${isCollapsed ? 'app-sidebar-collapsed' : ''}`}
      aria-label="Thanh điều hướng chính"
    >
      {/* Sidebar Header / Brand */}
      <div className="sidebar-header">
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            overflow: 'hidden',
          }}
          title="CodeCoBUG Studio"
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--pastel-mint)',
              color: 'var(--pastel-mint-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-xs)',
              border: '1px solid var(--pastel-mint-active)',
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} />
          </div>
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <div style={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--text-primary)' }}>
                CodeCoBUG
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--pastel-mint-text)', letterSpacing: '0.04em' }}>
                TEEN PASTEL STUDIO
              </span>
            </div>
          )}
        </Link>

        {onToggleCollapse && (
          <button
            type="button"
            className="btn btn-ghost desktop-only-toggle"
            style={{ padding: '6px', borderRadius: 'var(--radius-full)', color: 'var(--text-muted)' }}
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Main Navigation Items */}
      <nav className="sidebar-nav-list">
        {/* 1. Home / Learning Dashboard */}
        <Link
          href="/"
          className={`sidebar-nav-item ${isHome ? 'sidebar-nav-item-active' : ''}`}
          title="Bảng điều khiển học tập"
        >
          <LayoutDashboard size={18} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Bảng điều khiển</span>}
        </Link>

        {/* 2. Python Curriculum */}
        <Link
          href="/#curriculum"
          className="sidebar-nav-item"
          title="Giáo trình Python"
        >
          <BookOpen size={18} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Giáo trình Python</span>}
        </Link>

        {/* 3. Practice Exercises */}
        <Link
          href="/exercises/in-loi-chao-codecobug"
          className={`sidebar-nav-item ${isExercise ? 'sidebar-nav-item-active' : ''}`}
          title="Luyện tập lập trình"
        >
          <Code2 size={18} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Luyện tập Code</span>}
        </Link>

        {/* 4. AI Tutor */}
        <button
          type="button"
          className="sidebar-nav-item"
          onClick={() => {
            if (onToggleAITutor) {
              onToggleAITutor();
            } else {
              onOpenAISettings();
            }
          }}
          style={{ width: '100%', background: 'none', textAlign: 'left' }}
          title="AI Gia sư kèm cặp"
        >
          <Bot size={18} style={{ flexShrink: 0, color: 'var(--pastel-lavender-text)' }} />
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span>AI Tutor</span>
              <Badge variant="lavender" size="sm">BYOK</Badge>
            </div>
          )}
        </button>

        {/* 5. Review Mistakes (Ôn tập lỗi sai) */}
        <button
          type="button"
          className="sidebar-nav-item"
          onClick={() => onOpenWeaknessTracker('queue')}
          style={{ width: '100%', background: 'none', textAlign: 'left' }}
          title="Ôn tập bài tập sai & Hàng đợi thích ứng"
        >
          <Target size={18} style={{ flexShrink: 0, color: 'var(--pastel-peach-text)' }} />
          {!isCollapsed && <span>Ôn tập bài sai</span>}
        </button>

        {/* 6. Learning Progress (Tiến độ học tập & kỹ năng) */}
        <button
          type="button"
          className="sidebar-nav-item"
          onClick={() => onOpenWeaknessTracker('skills')}
          style={{ width: '100%', background: 'none', textAlign: 'left' }}
          title="Tiến độ kỹ năng & Thành thạo"
        >
          <TrendingUp size={18} style={{ flexShrink: 0, color: 'var(--pastel-mint-text)' }} />
          {!isCollapsed && <span>Tiến độ kỹ năng</span>}
        </button>
      </nav>

      {/* Sidebar Footer: Settings & Account */}
      <div className="sidebar-footer">
        {/* Settings button */}
        <button
          type="button"
          className="sidebar-nav-item"
          onClick={onOpenAISettings}
          style={{ width: '100%', background: 'none', textAlign: 'left', minHeight: '40px', padding: '8px 12px' }}
          title="Cài đặt AI Provider (BYOK)"
        >
          <Settings size={17} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span style={{ fontSize: '0.84rem' }}>Cài đặt AI (BYOK)</span>}
        </button>

        {/* User Account Pill */}
        <button
          type="button"
          onClick={onOpenAuth}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-base)',
          }}
          title="Tài khoản học viên"
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--pastel-mint)',
              color: 'var(--pastel-mint-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78rem',
              fontWeight: 700,
              flexShrink: 0,
              border: '1px solid var(--pastel-mint-active)',
            }}
          >
            {user ? user.displayName.charAt(0).toUpperCase() : <User size={15} />}
          </div>

          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user ? user.displayName : 'Đăng nhập'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {user ? (
                  <>
                    <Award size={11} style={{ color: 'var(--pastel-mint-text)' }} />
                    <span>{user.points} pt</span>
                  </>
                ) : (
                  <span>Lưu tiến độ bài làm</span>
                )}
              </div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
