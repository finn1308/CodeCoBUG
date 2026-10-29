'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, CheckCircle2, Bot, Sparkles, BookOpen, Settings, User, Target } from 'lucide-react';
import { AISettingsModal } from '@/components/settings/AISettingsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { WeaknessTrackerModal } from '@/components/mastery/WeaknessTrackerModal';
import { authManager, UserProfile } from '@/lib/auth/authManager';

interface HeaderProps {
  exerciseTitle?: string;
  topicTitle?: string;
  isRunning?: boolean;
  onRun?: () => void;
  onSubmit?: () => void;
  onToggleAITutor?: () => void;
  isAITutorOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  exerciseTitle,
  topicTitle,
  isRunning = false,
  onRun,
  onSubmit,
  onToggleAITutor,
  isAITutorOpen = false,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(authManager.getCurrentUser());

  useEffect(() => {
    const unsub = authManager.subscribe((activeUser) => {
      setUser(activeUser);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <header className="app-header">
        {/* Brand & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" className="brand-logo">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 10px rgba(56, 189, 248, 0.4)',
              }}
            >
              <Sparkles size={18} />
            </div>
            <span>CodeCoBUG</span>
            <span className="brand-badge">Beta</span>
          </Link>

          {exerciseTitle && (
            <div
              className="header-breadcrumb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: '16px',
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

        {/* Action Buttons & User Profile */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onRun && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onRun}
              disabled={isRunning}
              title="Chạy code kiểm tra đầu ra (Phím tắt: Ctrl + Enter)"
            >
              <Play size={15} style={{ color: 'var(--accent-light)' }} />
              <span>{isRunning ? 'Đang chạy...' : 'Run Code'}</span>
            </button>
          )}

          {onSubmit && (
            <button
              type="button"
              className="btn btn-success"
              onClick={onSubmit}
              disabled={isRunning}
              title="Nộp bài và chấm toàn bộ test case"
            >
              <CheckCircle2 size={16} />
              <span>Nộp bài</span>
            </button>
          )}

          {onToggleAITutor && (
            <button
              type="button"
              className={`btn ${isAITutorOpen ? 'btn-primary' : 'btn-secondary'}`}
              onClick={onToggleAITutor}
              title="Mở bảng hỗ trợ AI Gia Sư"
            >
              <Bot size={16} />
              <span className="header-btn-text">AI Tutor</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setIsTrackerOpen(true)}
            title="Theo dõi điểm yếu & Hàng đợi ôn tập thích ứng"
          >
            <Target size={14} style={{ color: 'var(--accent-light)' }} />
            <span className="header-btn-text">Điểm yếu & Ôn tập</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '7px 10px' }}
            onClick={() => setIsSettingsOpen(true)}
            title="Cài đặt khóa AI (BYOK) & Mô hình"
          >
            <Settings size={17} />
          </button>

          {/* User Account / Session Pill */}
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onClick={() => setIsAuthOpen(true)}
            title="Quản lý tài khoản và phân tách dữ liệu"
          >
            {user ? (
              <>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="user-display-name" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName}
                </span>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                  }}
                >
                  {user.points} pt
                </span>
              </>
            ) : (
              <>
                <User size={15} style={{ color: 'var(--text-muted)' }} />
                <span className="header-btn-text" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>Đăng nhập</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Real AI Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Real Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Real Weakness Tracker & Adaptive Review Modal */}
      <WeaknessTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </>
  );
};

