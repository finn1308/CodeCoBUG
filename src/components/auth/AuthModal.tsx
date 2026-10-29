'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Sparkles, LogOut, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { authManager, UserProfile } from '@/lib/auth/authManager';
import { Modal, Button, Input, Badge, Tabs } from '@/components/ui';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authManager.getCurrentUser());
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authManager.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        throw new Error('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      }
      await authManager.signIn(email, password);
      setSuccess('Đăng nhập thành công! Phiên làm việc đã được khôi phục.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        throw new Error('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      }
      if (password.length < 6) {
        throw new Error('Mật khẩu tối thiểu 6 ký tự.');
      }
      await authManager.signUp(email, password, displayName);
      setSuccess('Đăng ký tài khoản thành công! Dữ liệu của bạn được phân tách an toàn.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng ký không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authManager.signOut();
    setSuccess('Đã đăng xuất khỏi phiên làm việc.');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentUser ? 'Thông tin tài khoản' : mode === 'signin' ? 'Đăng nhập CodeCoBUG' : 'Đăng ký tài khoản'}
      description={currentUser ? 'Lưu trữ tiến độ học tập và điểm số bền vững' : 'Bảo vệ quyền truy cập và phân tách dữ liệu'}
      icon={<User size={18} />}
      maxWidth="480px"
    >
      {/* Notification Messages */}
      {error && (
        <div
          style={{
            background: 'var(--status-error-bg)',
            border: '1px solid var(--status-error-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            color: 'var(--status-error-text)',
            fontSize: '0.84rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          style={{
            background: 'var(--status-success-bg)',
            border: '1px solid var(--status-success-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            color: 'var(--status-success-text)',
            fontSize: '0.84rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* VIEW A: Currently Logged In */}
      {currentUser ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              background: 'var(--pastel-mint-light)',
              border: '1px solid var(--pastel-mint)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--pastel-mint)',
                color: 'var(--pastel-mint-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
                flexShrink: 0,
                border: '1px solid var(--pastel-mint-active)',
              }}
            >
              {currentUser.displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                {currentUser.displayName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <Badge variant="mint" size="sm">
                  {currentUser.role.toUpperCase()}
                </Badge>
                <Badge variant="success" size="sm" icon={<Sparkles size={11} />}>
                  {currentUser.points} Điểm
                </Badge>
              </div>
            </div>
          </div>

          {/* Multi-tenant Isolation Notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={18} style={{ color: 'var(--status-info)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Phân tách dữ liệu an toàn:</strong> Toàn bộ lịch sử nộp bài, bản nháp code và tiến độ được gán cố định với User ID <code style={{ backgroundColor: '#FFFFFF', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>{currentUser.id}</code>.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
            <Button
              variant="danger"
              onClick={handleSignOut}
              leftIcon={<LogOut size={15} />}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      ) : (
        /* VIEW B: Sign In or Sign Up Form */
        <div>
          {/* Tab Switcher */}
          <div style={{ marginBottom: '18px' }}>
            <Tabs
              variant="pill"
              fullWidth
              activeTab={mode}
              onChange={(newMode) => {
                setMode(newMode);
                setError(null);
              }}
              tabs={[
                { id: 'signin', label: 'Đăng nhập' },
                { id: 'signup', label: 'Tạo tài khoản mới' },
              ]}
            />
          </div>

          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <Input
                label="Tên hiển thị"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nguyễn Văn A"
                leftIcon={<User size={16} />}
              />
            )}

            <Input
              label="Địa chỉ Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              leftIcon={<Mail size={16} />}
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              leftIcon={<Lock size={16} />}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight size={16} />}
              style={{ marginTop: '6px' }}
            >
              {mode === 'signin' ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
};
