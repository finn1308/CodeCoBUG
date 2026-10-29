'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  CheckCircle2,
  Bot,
  Sparkles,
  BookOpen,
  Settings,
  User,
  Target,
  Menu,
} from 'lucide-react';
import { AISettingsModal } from '@/components/settings/AISettingsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { WeaknessTrackerModal } from '@/components/mastery/WeaknessTrackerModal';
import { authManager, UserProfile } from '@/lib/auth/authManager';
import { Button, Badge } from '@/components/ui';

export interface HeaderProps {
  exerciseTitle?: string;
  topicTitle?: string;
  isRunning?: boolean;
  onRun?: () => void;
  onSubmit?: () => void;
  onToggleAITutor?: () => void;
  isAITutorOpen?: boolean;
  onToggleMobileNav?: () => void;
  onOpenAuth?: () => void;
  onOpenAISettings?: () => void;
  onOpenWeaknessTracker?: (initialTab?: 'skills' | 'queue' | 'policy') => void;
  showBrand?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  exerciseTitle,
  topicTitle,
  isRunning = false,
  onRun,
  onSubmit,
  onToggleAITutor,
  isAITutorOpen = false,
  onToggleMobileNav,
  onOpenAuth: externalOpenAuth,
  onOpenAISettings: externalOpenAISettings,
  onOpenWeaknessTracker: externalOpenTracker,
  showBrand = true,
}) => {
  const [internalSettingsOpen, setInternalSettingsOpen] = useState(false);
  const [internalAuthOpen, setInternalAuthOpen] = useState(false);
  const [internalTrackerOpen, setInternalTrackerOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(authManager.getCurrentUser());

  useEffect(() => {
    const unsub = authManager.subscribe((activeUser) => {
      setUser(activeUser);
    });
    return () => unsub();
  }, []);

  const handleOpenAuth = externalOpenAuth || (() => setInternalAuthOpen(true));
  const handleOpenSettings = externalOpenAISettings || (() => setInternalSettingsOpen(true));
  const handleOpenTracker = externalOpenTracker || (() => setInternalTrackerOpen(true));

  return (
    <>
      <header className="app-header">
        {/* Left Side: Hamburger (Mobile) + Brand Logo + Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onToggleMobileNav && (
            <button
              type="button"
              className="btn btn-ghost mobile-nav-toggle"
              style={{ padding: '6px 8px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
              onClick={onToggleMobileNav}
              aria-label="Mở menu di động"
              title="Mở menu di động"
            >
              <Menu size={20} />
            </button>
          )}

          {showBrand && (
            <Link href="/" className="brand-logo">
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
              <span>CodeCoBUG</span>
              <span className="brand-badge">Studio</span>
            </Link>
          )}

          {exerciseTitle && (
            <div
              className="header-breadcrumb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.84rem',
                color: 'var(--text-secondary)',
                borderLeft: showBrand ? '1px solid var(--border-subtle)' : 'none',
                paddingLeft: showBrand ? '16px' : '0',
              }}
            >
              <BookOpen size={15} style={{ color: 'var(--text-muted)' }} />
              <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {topicTitle || 'Chủ đề'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {exerciseTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Action Buttons & User Profile */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onRun && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRun}
              disabled={isRunning}
              isLoading={isRunning}
              leftIcon={!isRunning ? <Play size={14} style={{ color: 'var(--pastel-sky-text)' }} /> : undefined}
              title="Chạy code kiểm tra đầu ra (Phím tắt: Ctrl + Enter)"
            >
              <span className="header-btn-text">Run Code</span>
            </Button>
          )}

          {onSubmit && (
            <Button
              variant="mint"
              size="sm"
              onClick={onSubmit}
              disabled={isRunning}
              leftIcon={<CheckCircle2 size={15} />}
              title="Nộp bài và chấm toàn bộ test case"
            >
              <span className="header-btn-text">Nộp bài</span>
            </Button>
          )}

          {onToggleAITutor && (
            <Button
              variant={isAITutorOpen ? 'lavender' : 'secondary'}
              size="sm"
              onClick={onToggleAITutor}
              leftIcon={<Bot size={15} />}
              title="Mở bảng hỗ trợ AI Gia Sư"
            >
              <span className="header-btn-text">AI Tutor</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenTracker('queue')}
            leftIcon={<Target size={14} style={{ color: 'var(--pastel-mint-text)' }} />}
            title="Theo dõi điểm yếu & Hàng đợi ôn tập thích ứng"
          >
            <span className="header-btn-text">Điểm yếu & Ôn tập</span>
          </Button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '7px 10px', borderRadius: 'var(--radius-full)' }}
            onClick={handleOpenSettings}
            title="Cài đặt khóa AI (BYOK) & Mô hình"
            aria-label="Cài đặt AI"
          >
            <Settings size={18} />
          </button>

          {/* User Account / Session Pill */}
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 12px 4px 6px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-xs)',
            }}
            onClick={handleOpenAuth}
            title="Quản lý tài khoản và phân tách dữ liệu"
          >
            {user ? (
              <>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--pastel-mint)',
                    color: 'var(--pastel-mint-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: '1px solid var(--pastel-mint-active)',
                  }}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="user-display-name" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName}
                </span>
                <Badge variant="mint" size="sm">
                  {user.points} pt
                </Badge>
              </>
            ) : (
              <>
                <User size={16} style={{ color: 'var(--text-secondary)' }} />
                <span className="header-btn-text" style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>Đăng nhập</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Internal Modals (Fallback if not wrapped by AppShell) */}
      {!externalOpenAISettings && (
        <AISettingsModal
          isOpen={internalSettingsOpen}
          onClose={() => setInternalSettingsOpen(false)}
        />
      )}

      {!externalOpenAuth && (
        <AuthModal
          isOpen={internalAuthOpen}
          onClose={() => setInternalAuthOpen(false)}
        />
      )}

      {!externalOpenTracker && (
        <WeaknessTrackerModal
          isOpen={internalTrackerOpen}
          onClose={() => setInternalTrackerOpen(false)}
        />
      )}
    </>
  );
};
