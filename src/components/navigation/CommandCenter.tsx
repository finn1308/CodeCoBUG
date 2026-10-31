'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Compass,
  BookOpen,
  Code2,
  Award,
  PlayCircle,
  RotateCcw,
  TrendingUp,
  Bot,
  User,
  Settings,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';
import { authManager, UserProfile, SavedSubmissionRecord } from '@/lib/auth/authManager';
import { OFFICIAL_PYTHON_COURSE } from '@/lib/curriculum';
import { ReviewEngine } from '@/lib/mastery/reviewEngine';
import { Badge, LondonBus, BigBen, StreetLamp, UndergroundRoundel } from '@/components/ui';

export interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
  onOpenAISettings?: () => void;
  onOpenWeaknessTracker?: (initialTab?: 'skills' | 'queue' | 'policy' | 'history') => void;
  onToggleAITutor?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'practice' | 'tracking' | 'personal';
  categoryLabel: string;
  icon: React.ReactNode;
  badgeText?: string;
  badgeVariant?: 'mint' | 'sky' | 'lavender' | 'peach' | 'london_red' | 'cream' | 'neutral';
  href?: string;
  action?: () => void;
  keywords: string[];
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenAISettings,
  onOpenWeaknessTracker,
  onToggleAITutor,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [user, setUser] = useState<UserProfile | null>(authManager.getCurrentUser());
  const [submissions, setSubmissions] = useState<SavedSubmissionRecord[]>([]);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Sync user state and review count
  useEffect(() => {
    const refreshData = () => {
      const activeUser = authManager.getCurrentUser();
      setUser(activeUser);
      if (activeUser) {
        const subs = authManager.getAllUserSubmissions();
        setSubmissions(subs);
        ReviewEngine.syncReviewQueue(activeUser.id, subs);
        setPendingReviewsCount(ReviewEngine.getPendingReviews(activeUser.id).length);
      } else {
        setSubmissions([]);
        setPendingReviewsCount(0);
      }
    };

    refreshData();
    const unsub = authManager.subscribe(() => refreshData());
    return () => unsub();
  }, []);

  // Compute completed exercises count and next target
  const acceptedSlugs = new Set(
    submissions.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
  );
  const completedExercisesCount = acceptedSlugs.size;

  const allExercises = OFFICIAL_PYTHON_COURSE.topics.flatMap((t) =>
    t.lessons.flatMap((l) => l.exercises)
  );
  const nextTargetExercise =
    allExercises.find((e) => !acceptedSlugs.has(e.slug)) ||
    allExercises[0] || {
      slug: 'in-loi-chao-codecobug',
      title: 'In lời chào CodeCoBUG',
    };

  // Build the complete, authoritative list of command items
  const commandItems: CommandItem[] = [
    // 1. Học tập (Learning)
    {
      id: 'cmd-home',
      title: 'Tổng quan học tập',
      description: 'Trang chủ, trạng thái học tập và tổng quan lộ trình Python',
      category: 'learning',
      categoryLabel: 'Học tập',
      icon: <Compass size={18} style={{ color: 'var(--pastel-sky-text)' }} />,
      badgeText: 'Pastel London',
      badgeVariant: 'sky',
      href: '/',
      keywords: ['tong quan', 'trang chu', 'home', 'dashboard', 'london', 'overview'],
    },
    {
      id: 'cmd-curriculum',
      title: 'Học Python (Giáo trình toàn diện)',
      description: '12 chương & 44 bài học chuẩn mực kết hợp W3Schools và PCC3E',
      category: 'learning',
      categoryLabel: 'Học tập',
      icon: <BookOpen size={18} style={{ color: 'var(--pastel-mint-text)' }} />,
      badgeText: '12 Chương',
      badgeVariant: 'mint',
      href: '/curriculum',
      keywords: ['giao trinh', 'chuong', 'bai hoc', 'curriculum', 'learn', 'hoc python'],
    },
    {
      id: 'cmd-projects',
      title: 'Dự án thực tế lớn (PBL)',
      description: 'Alien Invasion Game, Trực quan hóa dữ liệu & Django Web App',
      category: 'learning',
      categoryLabel: 'Học tập',
      icon: <Award size={18} style={{ color: 'var(--pastel-peach-text)' }} />,
      badgeText: '3 Dự án PBL',
      badgeVariant: 'peach',
      href: '/projects',
      keywords: ['du an', 'project', 'pbl', 'alien invasion', 'data visualization', 'django web'],
    },

    // 2. Thực hành & Luyện tập (Practice)
    {
      id: 'cmd-practice-lab',
      title: 'Luyện tập (Phòng Lab Code)',
      description: 'Monaco Editor & Pyodide WebAssembly chạy trực tiếp trên trình duyệt',
      category: 'practice',
      categoryLabel: 'Luyện tập',
      icon: <Code2 size={18} style={{ color: 'var(--pastel-sky-text)' }} />,
      badgeText: '87 Bài tập',
      badgeVariant: 'sky',
      href: `/exercises/in-loi-chao-codecobug`,
      keywords: ['luyen tap', 'phong lab', 'code', 'editor', 'practice', 'bai tap'],
    },
    {
      id: 'cmd-continue-exercise',
      title: `Tiếp tục bài tập: ${nextTargetExercise.title}`,
      description: 'Vào ngay bài tập tiếp theo cần hoàn thành trên lộ trình của bạn',
      category: 'practice',
      categoryLabel: 'Luyện tập',
      icon: <PlayCircle size={18} style={{ color: 'var(--london-red)' }} />,
      badgeText: completedExercisesCount > 0 ? 'Tiếp tục' : 'Nhập môn',
      badgeVariant: 'london_red',
      href: `/exercises/${nextTargetExercise.slug}`,
      keywords: ['tiep tuc', 'bai tap tiep', 'continue', 'next', 'play', nextTargetExercise.title.toLowerCase()],
    },

    // 3. Theo dõi & Trợ giúp (Tracking & Assistance)
    {
      id: 'cmd-review-queue',
      title: 'Ôn tập bài sai (Review Queue)',
      description: 'Hàng đợi ôn tập thích ứng, củng cố các kỹ năng còn yếu từ lần nộp sai',
      category: 'tracking',
      categoryLabel: 'Theo dõi & Trợ giúp',
      icon: <RotateCcw size={18} style={{ color: 'var(--pastel-peach-text)' }} />,
      badgeText: pendingReviewsCount > 0 ? `${pendingReviewsCount} bài cần ôn` : 'Đã sạch lỗi',
      badgeVariant: pendingReviewsCount > 0 ? 'peach' : 'mint',
      action: () => {
        onClose();
        onOpenWeaknessTracker?.('queue');
      },
      keywords: ['on tap', 'bai sai', 'hang doi', 'review', 'mistakes', 'queue'],
    },
    {
      id: 'cmd-progress-mastery',
      title: 'Tiến độ & Năng lực học viên',
      description: 'Báo cáo làm chủ kiến thức, độ chính xác từng chủ đề và lịch sử làm bài',
      category: 'tracking',
      categoryLabel: 'Theo dõi & Trợ giúp',
      icon: <TrendingUp size={18} style={{ color: 'var(--pastel-mint-text)' }} />,
      badgeText: `${completedExercisesCount}/87 bài`,
      badgeVariant: 'mint',
      action: () => {
        onClose();
        onOpenWeaknessTracker?.('skills');
      },
      keywords: ['tien do', 'nang luc', 'ky nang', 'progress', 'mastery', 'skills', 'lich su'],
    },
    {
      id: 'cmd-ai-tutor',
      title: 'AI Tutor (Gia sư thông minh)',
      description: 'Gợi ý giải thuật 3 cấp độ, giải thích traceback lỗi sai theo ngữ cảnh',
      category: 'tracking',
      categoryLabel: 'Theo dõi & Trợ giúp',
      icon: <Bot size={18} style={{ color: 'var(--pastel-lavender-text)' }} />,
      badgeText: 'BYOK AI',
      badgeVariant: 'lavender',
      action: () => {
        onClose();
        onToggleAITutor?.();
      },
      keywords: ['ai tutor', 'gia su', 'tro ly', 'goi y', 'giai thich loi', 'tro giup'],
    },

    // 4. Cá nhân & Cài đặt (Personal & Settings)
    {
      id: 'cmd-account-profile',
      title: user ? `Hồ sơ: ${user.displayName}` : 'Hồ sơ và Đăng nhập',
      description: user
        ? `Quản lý tài khoản (${user.email}) • Tích lũy ${user.points} điểm thưởng`
        : 'Đăng nhập hoặc đăng ký để lưu tiến độ và lịch sử làm bài tập an toàn',
      category: 'personal',
      categoryLabel: 'Cá nhân & Cài đặt',
      icon: <User size={18} style={{ color: 'var(--pastel-mint-text)' }} />,
      badgeText: user ? `${user.points} pt` : 'Chưa đăng nhập',
      badgeVariant: user ? 'mint' : 'neutral',
      action: () => {
        onClose();
        onOpenAuth?.();
      },
      keywords: ['ho so', 'tai khoan', 'dang nhap', 'dang xuat', 'profile', 'auth', 'account'],
    },
    {
      id: 'cmd-ai-settings',
      title: 'Cài đặt khóa AI (BYOK)',
      description: 'Cấu hình API Key cá nhân (Gemini, OpenAI) với chuẩn mã hóa AES-256',
      category: 'personal',
      categoryLabel: 'Cá nhân & Cài đặt',
      icon: <Settings size={18} style={{ color: 'var(--text-secondary)' }} />,
      badgeText: 'Mã hóa AES',
      badgeVariant: 'neutral',
      action: () => {
        onClose();
        onOpenAISettings?.();
      },
      keywords: ['cai dat', 'settings', 'api key', 'byok', 'gemini', 'openai', 'khoa'],
    },
  ];

  // Filter items based on user query
  const query = searchQuery.trim().toLowerCase();
  const filteredItems = commandItems.filter((item) => {
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.categoryLabel.toLowerCase().includes(query) ||
      item.keywords.some((k) => k.includes(query))
    );
  });

  // Focus management: store previous active element, autofocus input on open, restore on close
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
      setSearchQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Execute selected item
  const handleSelectItem = useCallback(
    (item: CommandItem) => {
      if (item.action) {
        item.action();
      } else if (item.href) {
        onClose();
        router.push(item.href);
      }
    },
    [onClose, router]
  );

  // Keyboard navigation within Command Center
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
      } else if (e.key === 'Enter' && !e.isComposing) {
        if (filteredItems.length > 0 && selectedIndex >= 0 && selectedIndex < filteredItems.length) {
          e.preventDefault();
          handleSelectItem(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, handleSelectItem]);

  if (!isOpen) return null;

  // Group filtered items by category for scannable layout
  const categories: Array<{ key: CommandItem['category']; label: string }> = [
    { key: 'learning', label: 'Học tập' },
    { key: 'practice', label: 'Thực hành' },
    { key: 'tracking', label: 'Theo dõi & Trợ giúp' },
    { key: 'personal', label: 'Cá nhân & Cài đặt' },
  ];

  return (
    <div
      className="command-center-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="command-center-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Trung tâm điều hướng CodeCoBUG"
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 18px 12px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--london-red-light)',
                border: '1px solid var(--london-red-border)',
                color: 'var(--london-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LondonBus size={18} color="var(--london-red)" />
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Trung tâm điều hướng CodeCoBUG
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Phố học tập Pastel London • Tất cả khu vực trong một chạm
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '2px 6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Command size={11} /> K
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '6px', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}
              onClick={onClose}
              aria-label="Đóng trung tâm điều hướng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Instant Search Bar */}
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Tìm khu vực học tập, bài tập, dự án hoặc cài đặt... (Esc để đóng)"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.92rem',
              color: 'var(--text-primary)',
            }}
            aria-label="Tìm kiếm trong trung tâm điều hướng"
          />
          {searchQuery && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '2px', borderRadius: 'var(--radius-full)' }}
              onClick={() => setSearchQuery('')}
              aria-label="Xóa nội dung tìm kiếm"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Scrollable Command Items List */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 14px',
            maxHeight: '440px',
          }}
        >
          {filteredItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '36px 16px',
                color: 'var(--text-secondary)',
              }}
            >
              <StreetLamp size={32} color="var(--london-red)" style={{ margin: '0 auto 10px', opacity: 0.8 }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Không tìm thấy chức năng phù hợp
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Thử tìm với từ khóa &ldquo;học&rdquo;, &ldquo;bài tập&rdquo;, &ldquo;dự án&rdquo;, &ldquo;ai&rdquo; hoặc &ldquo;hồ sơ&rdquo;.
              </p>
            </div>
          ) : (
            categories.map(({ key, label }) => {
              const itemsInCategory = filteredItems.filter((i) => i.category === key);
              if (itemsInCategory.length === 0) return null;

              return (
                <div key={key} style={{ marginBottom: '14px' }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{label}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {itemsInCategory.map((item) => {
                      const itemOverallIndex = filteredItems.indexOf(item);
                      const isSelected = itemOverallIndex === selectedIndex;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`command-item ${isSelected ? 'command-item-active' : ''}`}
                          onClick={() => handleSelectItem(item)}
                          onMouseEnter={() => setSelectedIndex(itemOverallIndex)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isSelected ? 'var(--bg-surface)' : 'var(--bg-tertiary)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {item.icon}
                            </div>
                            <div style={{ minWidth: 0, textAlign: 'left' }}>
                              <div
                                style={{
                                  fontSize: '0.88rem',
                                  fontWeight: 700,
                                  color: 'var(--text-primary)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.76rem',
                                  color: 'var(--text-secondary)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  marginTop: '1px',
                                }}
                              >
                                {item.description}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            {item.badgeText && (
                              <Badge variant={item.badgeVariant || 'mint'} size="sm">
                                {item.badgeText}
                              </Badge>
                            )}
                            <ArrowRight
                              size={15}
                              style={{
                                color: isSelected ? 'var(--london-red)' : 'var(--text-muted)',
                                transform: isSelected ? 'translateX(2px)' : 'none',
                                transition: 'transform 0.15s ease, color 0.15s ease',
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>
              <kbd style={{ padding: '1px 5px', borderRadius: '3px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }}>
                ↑↓
              </kbd>{' '}
              Di chuyển
            </span>
            <span>
              <kbd style={{ padding: '1px 5px', borderRadius: '3px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }}>
                Enter
              </kbd>{' '}
              Mở
            </span>
            <span>
              <kbd style={{ padding: '1px 5px', borderRadius: '3px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }}>
                Esc
              </kbd>{' '}
              Đóng
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--london-red)', fontWeight: 600 }}>
            <UndergroundRoundel size={12} color="var(--london-red)" />
            <span>CodeCoBUG One-Tap UX</span>
          </div>
        </div>
      </div>
    </div>
  );
};
