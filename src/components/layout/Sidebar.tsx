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
  ChevronDown,
  Sparkles,
  Award,
  HelpCircle,
  FileCode,
  History,
  Layers,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { authManager, UserProfile } from '@/lib/auth/authManager';
import { Badge } from '@/components/ui';

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenAuth: () => void;
  onOpenAISettings: () => void;
  onOpenWeaknessTracker: (initialTab?: 'skills' | 'queue' | 'policy' | 'history') => void;
  onToggleAITutor?: () => void;
  onOpenHelp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
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

  const isHome = pathname === '/';
  const isCurriculum = pathname.startsWith('/curriculum');
  const isExercise = pathname.startsWith('/exercises');

  // Accordion open/close state for submenu groups (mặc định mở nếu đang ở đúng mục, hoặc người dùng tự đóng/mở)
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

      {/* Main Navigation (3 Primary Destinations) */}
      <nav className="sidebar-nav-list" aria-label="3 Điểm đến chính">
        {/* 1. Tổng quan (Dashboard) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
            <Link
              href="/"
              className={`sidebar-nav-item ${isHome ? 'sidebar-nav-item-active' : ''}`}
              style={{ flex: 1, paddingRight: isCollapsed ? undefined : '36px' }}
              title="1. Tổng quan — Bảng điều khiển học tập"
            >
              <LayoutDashboard size={18} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>Tổng quan</span>}
            </Link>
            {!isCollapsed && (
              <button
                type="button"
                onClick={(e) => toggleSection('home', e)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isHome ? 'var(--pastel-mint-text)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'transform var(--transition-base), color var(--transition-base)',
                }}
                title={openSections.home ? 'Thu gọn mục con' : 'Mở rộng mục con'}
                aria-label={openSections.home ? 'Thu gọn mục con Tổng quan' : 'Mở rộng mục con Tổng quan'}
              >
                {openSections.home ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>
            )}
          </div>

          {!isCollapsed && openSections.home && (
            <div className="sidebar-submenu">
              <Link
                href="/learning-path"
                className={`sidebar-sub-item ${pathname === '/learning-path' ? 'sidebar-sub-item-active' : ''}`}
                title="Lộ trình học Python cá nhân hóa thích ứng"
              >
                <Compass size={14} style={{ color: 'var(--pastel-sky-text)', flexShrink: 0 }} />
                <span>Lộ trình cá nhân hóa</span>
              </Link>
              <button
                type="button"
                className="sidebar-sub-item"
                onClick={() => onOpenWeaknessTracker('skills')}
                title="Thống kê chi tiết & Kỹ năng"
              >
                <TrendingUp size={14} style={{ color: 'var(--pastel-mint-text)', flexShrink: 0 }} />
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
              className={`sidebar-nav-item ${isCurriculum ? 'sidebar-nav-item-active' : ''}`}
              style={{ flex: 1, paddingRight: isCollapsed ? undefined : '36px' }}
              title="2. Học Python — Giáo trình & Chủ đề"
            >
              <BookOpen size={18} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>Học Python</span>}
            </Link>
            {!isCollapsed && (
              <button
                type="button"
                onClick={(e) => toggleSection('curriculum', e)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isCurriculum ? 'var(--pastel-mint-text)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'transform var(--transition-base), color var(--transition-base)',
                }}
                title={openSections.curriculum ? 'Thu gọn mục con' : 'Mở rộng mục con'}
                aria-label={openSections.curriculum ? 'Thu gọn mục con Học Python' : 'Mở rộng mục con Học Python'}
              >
                {openSections.curriculum ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>
            )}
          </div>

          {!isCollapsed && openSections.curriculum && (
            <div className="sidebar-submenu">
              <Link
                href="/curriculum"
                className={`sidebar-sub-item ${isCurriculum ? 'sidebar-sub-item-active' : ''}`}
                title="Chi tiết các chủ đề & Bài học"
              >
                <FileCode size={14} style={{ color: 'var(--pastel-sky-text)', flexShrink: 0 }} />
                <span>Chủ đề & Bài học</span>
              </Link>
              <Link
                href="/projects"
                className={`sidebar-sub-item ${pathname.startsWith('/projects') ? 'sidebar-sub-item-active' : ''}`}
                title="3 Dự án lớn thực chiến (Pygame, Data, Web)"
              >
                <Layers size={14} style={{ color: 'var(--pastel-lavender-text)', flexShrink: 0 }} />
                <span>Dự án thực chiến</span>
              </Link>
            </div>
          )}
        </div>

        {/* 3. Luyện tập (Practice Workspace & Mistakes Review) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
            <Link
              href="/exercises/in-loi-chao-codecobug"
              className={`sidebar-nav-item ${isExercise ? 'sidebar-nav-item-active' : ''}`}
              style={{ flex: 1, paddingRight: isCollapsed ? undefined : '36px' }}
              title="3. Luyện tập — Không gian lập trình & Ôn tập lỗi sai"
            >
              <Code2 size={18} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>Luyện tập</span>}
            </Link>
            {!isCollapsed && (
              <button
                type="button"
                onClick={(e) => toggleSection('practice', e)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isExercise ? 'var(--pastel-mint-text)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'transform var(--transition-base), color var(--transition-base)',
                }}
                title={openSections.practice ? 'Thu gọn mục con' : 'Mở rộng mục con'}
                aria-label={openSections.practice ? 'Thu gọn mục con Luyện tập' : 'Mở rộng mục con Luyện tập'}
              >
                {openSections.practice ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>
            )}
          </div>

          {!isCollapsed && openSections.practice && (
            <div className="sidebar-submenu">
              <Link
                href="/exercises/in-loi-chao-codecobug"
                className={`sidebar-sub-item ${isExercise ? 'sidebar-sub-item-active' : ''}`}
                title="Phòng lab lập trình trực tuyến"
              >
                <Code2 size={14} style={{ color: 'var(--pastel-mint-text)', flexShrink: 0 }} />
                <span>Phòng lab code</span>
              </Link>
              <Link
                href="/exams"
                className={`sidebar-sub-item ${pathname.startsWith('/exams') ? 'sidebar-sub-item-active' : ''}`}
                title="Hệ thống thi thử & Đánh giá năng lực chuẩn hóa"
              >
                <GraduationCap size={14} style={{ color: 'var(--pastel-lavender-text)', flexShrink: 0 }} />
                <span>Đánh giá & Thi thử</span>
              </Link>
              <button
                type="button"
                className="sidebar-sub-item"
                onClick={() => onOpenWeaknessTracker('queue')}
                title="Hàng đợi thích ứng ôn tập các bài làm sai"
              >
                <Target size={14} style={{ color: 'var(--pastel-peach-text)', flexShrink: 0 }} />
                <span>Ôn tập bài sai</span>
              </button>
              <button
                type="button"
                className="sidebar-sub-item"
                onClick={() => onOpenWeaknessTracker('history')}
                title="Xem lại lịch sử các lần nộp bài"
              >
                <History size={14} style={{ color: 'var(--pastel-sky-text)', flexShrink: 0 }} />
                <span>Lịch sử nộp bài</span>
              </button>
            </div>
          )}
        </div>

        {/* Contextual AI Tutor Access */}
        <div style={{ marginTop: '8px' }}>
          {!isCollapsed ? (
            <button
              type="button"
              className="sidebar-assistant-pill"
              onClick={() => {
                if (onToggleAITutor) {
                  onToggleAITutor();
                } else {
                  onOpenAISettings();
                }
              }}
              title="Mở AI Tutor hỗ trợ học tập"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={17} style={{ color: 'var(--pastel-lavender-text)' }} />
                <span>AI Tutor</span>
              </div>
              <Badge variant="lavender" size="sm">BYOK</Badge>
            </button>
          ) : (
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
              title="AI Tutor kèm cặp (BYOK)"
              style={{ justifyContent: 'center', padding: '10px 0' }}
            >
              <Bot size={18} style={{ color: 'var(--pastel-lavender-text)' }} />
            </button>
          )}
        </div>

        <div className="sidebar-section-divider" />

        {/* Secondary Navigation (Help & Preferences) */}
        {onOpenHelp && (
          <button
            type="button"
            className="sidebar-nav-item"
            onClick={onOpenHelp}
            style={{ width: '100%', background: 'none', textAlign: 'left', minHeight: '38px', padding: '7px 14px' }}
            title="Trợ giúp & Phím tắt học tập"
          >
            <HelpCircle size={16} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
            {!isCollapsed && <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Trợ giúp & Phím tắt</span>}
          </button>
        )}
      </nav>

      {/* Sidebar Footer: Account & Settings Menu */}
      <div className="sidebar-footer">
        {/* Settings button */}
        <button
          type="button"
          className="sidebar-nav-item"
          onClick={onOpenAISettings}
          style={{ width: '100%', background: 'none', textAlign: 'left', minHeight: '38px', padding: '6px 12px' }}
          title="Cài đặt AI Provider (BYOK)"
        >
          <Settings size={16} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span style={{ fontSize: '0.82rem' }}>Cài đặt AI (BYOK)</span>}
        </button>

        {/* User Account / Profile Menu */}
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
          title="Tài khoản học viên & Đăng xuất"
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
