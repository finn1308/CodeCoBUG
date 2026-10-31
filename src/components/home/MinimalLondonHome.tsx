'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Code2,
  Award,
  ArrowRight,
  PlayCircle,
  Sparkles,
  User,
  Zap,
  CheckCircle2,
  Clock,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { authManager, UserProfile, SavedSubmissionRecord } from '@/lib/auth/authManager';
import { OFFICIAL_PYTHON_COURSE } from '@/lib/curriculum';
import { Card, Badge, Button, BigBen, LondonBus, StreetLamp, UndergroundRoundel, AfternoonTea } from '@/components/ui';
import { AuthModal } from '@/components/auth/AuthModal';
import { LearningDashboard } from '@/components/dashboard/LearningDashboard';
import { CommandCenter } from '@/components/navigation';

export interface MinimalLondonHomeProps {
  onOpenAuth?: () => void;
  onOpenAISettings?: () => void;
  onOpenWeaknessTracker?: (initialTab?: 'skills' | 'queue' | 'policy' | 'history') => void;
  onOpenCommandCenter?: () => void;
}

/**
 * London Streetscape Vector Illustration (Pastel Street Art)
 * Depicts Bloomsbury brick architecture, the London Bookshop, Big Ben silhouette,
 * a classic London red double-decker bus, and a Victorian cast-iron streetlamp.
 * Pure vector SVG, zero external assets, lightweight & fully responsive.
 */
const LondonStreetscapeIllustration: React.FC = () => (
  <div
    style={{
      width: '100%',
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: 'linear-gradient(180deg, #EDF5FE 0%, #FFF9EF 75%, #F4EBE1 100%)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '24px',
    }}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 960 260"
      width="100%"
      height="100%"
      style={{ display: 'block', maxHeight: '220px' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EAF3FD" />
          <stop offset="60%" stopColor="#FBF7F0" />
          <stop offset="100%" stopColor="#FFF9EF" />
        </linearGradient>
        <linearGradient id="brickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DE7C68" />
          <stop offset="100%" stopColor="#C96551" />
        </linearGradient>
        <linearGradient id="busGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DC444D" />
          <stop offset="100%" stopColor="#C93C45" />
        </linearGradient>
      </defs>

      {/* Pastel Sky Background */}
      <rect width="960" height="260" fill="url(#skyGrad)" />

      {/* Fluffy Pastel Clouds */}
      <g fill="#FFFFFF" opacity="0.85">
        <circle cx="140" cy="50" r="26" />
        <circle cx="165" cy="42" r="22" />
        <circle cx="185" cy="52" r="18" />
        <rect x="135" y="52" width="55" height="18" rx="8" />

        <circle cx="780" cy="65" r="22" />
        <circle cx="802" cy="58" r="18" />
        <circle cx="820" cy="66" r="15" />
        <rect x="775" y="66" width="50" height="15" rx="7" />
      </g>

      {/* Distant London Skyline (Lavender Slate Silhouette) */}
      <g fill="#CBD6E8" opacity="0.6">
        {/* Elizabeth Tower / Big Ben Silhouette */}
        <path d="M110 210 L110 80 L116 80 L116 55 L119 55 L119 32 L120 20 L121 32 L121 55 L124 55 L124 80 L130 80 L130 210 Z" />
        <rect x="113" y="85" width="14" height="14" rx="2" fill="#DFE8F5" />
        {/* Distant rooftops & spires */}
        <rect x="60" y="140" width="45" height="70" />
        <polygon points="60,140 82,115 105,140" />
        <rect x="135" y="130" width="70" height="80" />
        <polygon points="135,130 170,105 205,130" />
        {/* St Pauls / Arch Silhouette in background */}
        <path d="M830 210 L830 120 Q860 90 890 120 L890 210 Z" opacity="0.45" />
        <rect x="740" y="145" width="80" height="65" opacity="0.45" />
      </g>

      {/* Middleground: Victorian Terraced Townhouse (London Brick) */}
      <g>
        {/* Brick Building Body */}
        <rect x="230" y="85" width="230" height="125" fill="url(#brickGrad)" rx="3" />
        {/* Roof Cornice */}
        <rect x="225" y="80" width="240" height="8" fill="#3B4B5A" rx="2" />
        <rect x="250" y="65" width="22" height="16" fill="#A85241" />
        <rect x="410" y="65" width="22" height="16" fill="#A85241" />

        {/* Upper Sashed Windows with Cream Stone Surrounds */}
        <rect x="255" y="100" width="36" height="42" rx="3" fill="#FFF9EF" />
        <rect x="259" y="104" width="28" height="34" rx="1" fill="#C7E3FF" />
        <line x1="273" y1="104" x2="273" y2="138" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="259" y1="120" x2="287" y2="120" stroke="#FFFFFF" strokeWidth="2" />

        <rect x="325" y="100" width="36" height="42" rx="3" fill="#FFF9EF" />
        <rect x="329" y="104" width="28" height="34" rx="1" fill="#C7E3FF" />
        <line x1="343" y1="104" x2="343" y2="138" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="329" y1="120" x2="357" y2="120" stroke="#FFFFFF" strokeWidth="2" />

        <rect x="395" y="100" width="36" height="42" rx="3" fill="#FFF9EF" />
        <rect x="399" y="104" width="28" height="34" rx="1" fill="#C7E3FF" />
        <line x1="413" y1="104" x2="413" y2="138" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="399" y1="120" x2="427" y2="120" stroke="#FFFFFF" strokeWidth="2" />

        {/* Ground Floor: The London Code Bookshop (Hiệu Sách Lập Trình) */}
        {/* Mint Awning Canopy */}
        <path d="M245 158 L445 158 L440 172 L250 172 Z" fill="#BFE8D0" stroke="#A5DCBC" strokeWidth="1" />
        {/* Striped Canopy detailing */}
        <polygon points="270,158 290,158 288,172 268,172" fill="#FFFFFF" opacity="0.6" />
        <polygon points="320,158 340,158 338,172 318,172" fill="#FFFFFF" opacity="0.6" />
        <polygon points="370,158 390,158 388,172 368,172" fill="#FFFFFF" opacity="0.6" />
        <polygon points="420,158 440,158 438,172 418,172" fill="#FFFFFF" opacity="0.6" />

        {/* Bookshop Window */}
        <rect x="255" y="174" width="115" height="36" rx="2" fill="#243047" />
        <rect x="258" y="176" width="109" height="32" rx="1" fill="#FFFDF8" />
        {/* Books on display in window */}
        <rect x="264" y="190" width="8" height="15" fill="#C93C45" rx="1" />
        <rect x="274" y="186" width="7" height="19" fill="#10B981" rx="1" />
        <rect x="283" y="191" width="9" height="14" fill="#3B82F6" rx="1" />
        <rect x="294" y="187" width="8" height="18" fill="#F59E0B" rx="1" />
        <rect x="304" y="193" width="7" height="12" fill="#8B5CF6" rx="1" />
        {/* Bookshop Fascia Sign */}
        <rect x="265" y="160" width="160" height="10" rx="2" fill="#243047" />
        <text x="345" y="168" fill="#FFF9EF" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="1">
          LONDON CODE BOOKSHOP
        </text>

        {/* Front Arched Doorway */}
        <path d="M390 210 L390 178 Q405 168 420 178 L420 210 Z" fill="#243047" />
        <circle cx="414" cy="195" r="2" fill="#FFE699" />
      </g>

      {/* Street Pavement / Sidewalk */}
      <rect x="0" y="210" width="960" height="22" fill="#E8EDF4" />
      <line x1="0" y1="210" x2="960" y2="210" stroke="#D1D9E6" strokeWidth="2" />
      {/* Curb edge */}
      <rect x="0" y="232" width="960" height="28" fill="#C7D2DF" />

      {/* Victorian Cast-Iron Street Lamp */}
      <g>
        <rect x="205" y="206" width="12" height="4" fill="#243047" rx="1" />
        <line x1="211" y1="206" x2="211" y2="135" stroke="#243047" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M205 135 L217 135 L219 118 L203 118 Z" fill="#FFEAA7" opacity="0.9" />
        <polygon points="201,118 221,118 211,108" fill="#243047" />
        <line x1="211" y1="108" x2="211" y2="104" stroke="#243047" strokeWidth="2" />
        {/* Warm Lamp Glow */}
        <circle cx="211" cy="126" r="14" fill="#FFF0B8" opacity="0.35" />
      </g>

      {/* Iconic London Red Routemaster Bus (Foreground Hero) */}
      <g transform="translate(520, 115)">
        {/* Bus Shadow */}
        <ellipse cx="145" cy="100" rx="140" ry="8" fill="#A9B7CD" opacity="0.45" />

        {/* Bus Main Chassis */}
        <rect x="10" y="10" width="270" height="80" rx="8" fill="url(#busGrad)" />
        <path d="M10 20 Q10 10 20 10 L270 10 Q280 10 280 20 L280 90 L10 90 Z" fill="url(#busGrad)" />

        {/* Cream Mid-band with Route Info */}
        <rect x="10" y="46" width="270" height="8" fill="#FFF9EF" />
        <text x="145" y="52.5" fill="#243047" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.8">
          01 • CODECOBUG PYTHON EXPRESS • WESTMINSTER TO BLOOMSBURY
        </text>

        {/* Upper Deck Windows */}
        <g fill="#E0F2FE" stroke="#A9B7CD" strokeWidth="1">
          <rect x="25" y="18" width="32" height="22" rx="3" />
          <rect x="65" y="18" width="32" height="22" rx="3" />
          <rect x="105" y="18" width="32" height="22" rx="3" />
          <rect x="145" y="18" width="32" height="22" rx="3" />
          <rect x="185" y="18" width="32" height="22" rx="3" />
          <rect x="225" y="18" width="40" height="22" rx="3" />
        </g>

        {/* Lower Deck Windows */}
        <g fill="#E0F2FE" stroke="#A9B7CD" strokeWidth="1">
          <rect x="25" y="58" width="32" height="22" rx="3" />
          <rect x="65" y="58" width="32" height="22" rx="3" />
          <rect x="105" y="58" width="32" height="22" rx="3" />
          <rect x="145" y="58" width="32" height="22" rx="3" />
          <rect x="185" y="58" width="32" height="22" rx="3" />
        </g>

        {/* Front Grille & Driver Windshield */}
        <rect x="225" y="58" width="45" height="24" rx="2" fill="#E0F2FE" stroke="#A9B7CD" strokeWidth="1" />
        <rect x="268" y="70" width="10" height="14" rx="1" fill="#FFE699" /> {/* Headlight */}

        {/* Wheels */}
        <circle cx="65" cy="90" r="15" fill="#243047" />
        <circle cx="65" cy="90" r="7" fill="#E7EAF0" />
        <circle cx="225" cy="90" r="15" fill="#243047" />
        <circle cx="225" cy="90" r="7" fill="#E7EAF0" />
      </g>

      {/* Red London Telephone Kiosk / Pillar Box */}
      <g transform="translate(485, 172)">
        <rect x="0" y="0" width="14" height="38" rx="3" fill="#C93C45" />
        <rect x="2" y="4" width="10" height="20" rx="1" fill="#FFFFFF" opacity="0.8" />
        <line x1="7" y1="4" x2="7" y2="24" stroke="#C93C45" strokeWidth="1" />
        <rect x="3" y="27" width="8" height="2" fill="#243047" />
      </g>

      {/* Mint Tree Planter on Sidewalk */}
      <g transform="translate(160, 185)">
        <rect x="6" y="24" width="18" height="15" rx="2" fill="#A9B7CD" />
        <circle cx="15" cy="14" r="14" fill="#BFE8D0" />
        <circle cx="10" cy="18" r="10" fill="#A5DCBC" />
        <circle cx="20" cy="16" r="11" fill="#8CCFA8" />
      </g>
    </svg>
  </div>
);

export const MinimalLondonHome: React.FC<MinimalLondonHomeProps> = ({
  onOpenAuth: externalOpenAuth,
  onOpenAISettings,
  onOpenWeaknessTracker,
  onOpenCommandCenter: externalOpenCommandCenter,
}) => {
  const [user, setUser] = useState<UserProfile | null>(authManager.getCurrentUser());
  const [submissions, setSubmissions] = useState<SavedSubmissionRecord[]>([]);
  const [internalAuthOpen, setInternalAuthOpen] = useState(false);
  const [internalCommandCenterOpen, setInternalCommandCenterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'london' | 'dashboard'>('london');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const refreshData = () => {
      const currentUser = authManager.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setSubmissions(authManager.getAllUserSubmissions());
      } else {
        setSubmissions([]);
      }
    };

    refreshData();
    const unsub = authManager.subscribe(() => {
      refreshData();
    });
    return () => unsub();
  }, []);

  const handleOpenAuth = externalOpenAuth || (() => setInternalAuthOpen(true));
  const handleOpenCommandCenter =
    externalOpenCommandCenter || (() => setInternalCommandCenterOpen(true));

  // Determine current learning progress & next exercise target
  const acceptedSlugs = new Set(
    submissions.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
  );
  const completedCount = acceptedSlugs.size;

  // Flatten all exercises from official course
  const allExercises = OFFICIAL_PYTHON_COURSE.topics.flatMap((t) =>
    t.lessons.flatMap((l) =>
      l.exercises.map((e) => ({
        ...e,
        topicTitle: t.title,
        topicSlug: t.slug,
      }))
    )
  );

  // Find next target exercise: first uncompleted exercise or default
  const nextTargetExercise =
    allExercises.find((e) => !acceptedSlugs.has(e.slug)) ||
    allExercises[0] || {
      slug: 'in-loi-chao-codecobug',
      title: 'In lời chào CodeCoBUG',
      topicTitle: 'Chủ đề 01: Làm quen với Python',
      description: 'Lệnh Python đầu tiên với hàm print().',
    };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '20px 16px 48px', width: '100%' }}>
      {/* 1. View Switcher Mode Tabs (Phố London vs Bàn học tập) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className={`btn ${viewMode === 'london' ? 'btn-london-red' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => setViewMode('london')}
          >
            <LondonBus size={15} color={viewMode === 'london' ? '#FFFFFF' : '#C93C45'} />
            <span>Phố London (Trang chủ)</span>
          </button>

          <button
            type="button"
            className={`btn ${viewMode === 'dashboard' ? 'btn-mint' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => setViewMode('dashboard')}
          >
            <LayoutDashboard size={15} />
            <span>Bàn học tập chi tiết</span>
          </button>
        </div>

        {/* User Session Quick Badge */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant="mint" size="sm" icon={<Award size={13} />}>
              {user.points} pt
            </Badge>
            <Badge variant="sky" size="sm">
              {completedCount} bài đã xong
            </Badge>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', color: 'var(--london-red)', fontWeight: 600 }}
            onClick={handleOpenAuth}
          >
            <User size={14} />
            <span>Đăng nhập lưu tiến độ</span>
          </button>
        )}
      </div>

      {/* 2. Main Content Depending on View Mode */}
      {viewMode === 'dashboard' ? (
        <div id="curriculum">
          <LearningDashboard course={OFFICIAL_PYTHON_COURSE} />
        </div>
      ) : (
        <div>
          {/* Pastel London Streetscape Header Illustration */}
          <LondonStreetscapeIllustration />

          {/* Central Hero Card (One-Tap Entry to Learning Studio) */}
          <Card
            variant="cream"
            padding="lg"
            style={{
              marginBottom: '28px',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle London Skyline watermark accent in card background */}
            <div
              style={{
                position: 'absolute',
                right: '16px',
                bottom: '-8px',
                opacity: 0.12,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <BigBen size={140} color="var(--london-slate)" />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
              {/* Account-Aware Greeting Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {user ? (
                  <span className="london-bus-badge" style={{ fontSize: '0.72rem' }}>
                    <LondonBus size={13} color="#FFFFFF" />
                    <span>Trạm học tập • {user.displayName}</span>
                  </span>
                ) : (
                  <span className="london-underground-badge" style={{ fontSize: '0.72rem' }}>
                    <BigBen size={13} color="#C93C45" />
                    <span>CodeCoBUG • Trạm học tập Pastel London</span>
                  </span>
                )}
                <Badge variant="sky" size="sm">
                  Python 3.12 • Thực chứng
                </Badge>
              </div>

              {/* Account-Aware Headline */}
              <h1
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: '0 0 10px 0',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                {user
                  ? `Xin chào, ${user.displayName}! 🇬🇧`
                  : 'Lập trình Python trên phố Pastel London 🇬🇧'}
              </h1>

              {/* Subtitle Description */}
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.96rem',
                  lineHeight: 1.6,
                  margin: '0 0 20px 0',
                }}
              >
                {user
                  ? `Chào mừng quay trở lại. Bạn đã hoàn thành ${completedCount} bài tập trên lộ trình. Tiếp tục rèn luyện tư duy lập trình ngay tại trạm tiếp theo:`
                  : 'Không gian rèn luyện tư duy lập trình Python thực chứng theo phong cách Pastel London — Tinh tế, Dễ hiểu, Trực quan và Chuẩn mực kiến thức.'}
              </p>

              {/* Active Next Lesson / Exercise Summary Box */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {nextTargetExercise.topicTitle || 'Chủ đề 01: Làm quen với Python'}
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {nextTargetExercise.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {nextTargetExercise.description}
                  </div>
                </div>

                <Badge variant="mint" size="sm" icon={<Zap size={13} />}>
                  {completedCount > 0 ? 'Tiếp tục bài này' : 'Bài nhập môn'}
                </Badge>
              </div>

              {/* Central ONE-TAP Action Button (Mở CodeCoBUG) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <Button
                  variant="london_red"
                  size="lg"
                  onClick={handleOpenCommandCenter}
                  leftIcon={<LondonBus size={20} color="#FFFFFF" />}
                  rightIcon={<ArrowRight size={18} />}
                  style={{
                    padding: '13px 30px',
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  title="Mở trung tâm điều hướng một chạm (Phím tắt: ⌘K hoặc Ctrl+K)"
                >
                  Mở CodeCoBUG
                </Button>

                <Link
                  href={`/exercises/${nextTargetExercise.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<PlayCircle size={18} style={{ color: 'var(--london-red)' }} />}
                  >
                    Vào bài học ngay
                  </Button>
                </Link>

                <Link href="/curriculum" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="ghost"
                    size="lg"
                    leftIcon={<BookOpen size={17} />}
                  >
                    Xem Giáo trình 12 chương
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setViewMode('dashboard')}
                  leftIcon={<LayoutDashboard size={16} />}
                >
                  Bảng điều khiển học tập
                </Button>
              </div>

              {/* Short Guiding Line for Newcomers */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--border-subtle)',
                }}
              >
                <StreetLamp size={16} color="var(--london-red)" />
                <span>
                  <strong>Gợi ý cho người mới:</strong> Bắt đầu từ Bài 1: In lời chào đầu tiên với Python (lệnh <code>print()</code>) hoặc duyệt toàn bộ lộ trình theo năng lực.
                </span>
              </div>
            </div>
          </Card>

          {/* 3. London Underground Quick Transit Stations (4-Card Grid) */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
              }}
            >
              <UndergroundRoundel size={18} color="var(--london-red)" />
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Các trạm học tập nhanh (Quick Stations)
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
              }}
            >
              {/* Station 1: Curriculum */}
              <Link href="/curriculum" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card
                  variant="default"
                  padding="md"
                  interactive
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--pastel-sky-light)',
                          color: 'var(--pastel-sky-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <BookOpen size={18} />
                      </div>
                      <Badge variant="sky" size="sm">
                        12 Chương
                      </Badge>
                    </div>

                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                      Lộ trình Python toàn diện
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      Giáo trình thống nhất kết hợp W3Schools và Python Crash Course 3E.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-link)', fontWeight: 600, marginTop: '12px' }}>
                    <span>Khám phá bài học</span>
                    <ArrowRight size={14} />
                  </div>
                </Card>
              </Link>

              {/* Station 2: Exercise Coding Lab */}
              <Link href={`/exercises/${nextTargetExercise.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card
                  variant="default"
                  padding="md"
                  interactive
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--pastel-mint-light)',
                          color: 'var(--pastel-mint-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Code2 size={18} />
                      </div>
                      <Badge variant="mint" size="sm">
                        87 Bài tập
                      </Badge>
                    </div>

                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                      Phòng Lab Code Thực hành
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      Monaco Editor & Pyodide WebAssembly chạy trực tiếp trên trình duyệt.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-link)', fontWeight: 600, marginTop: '12px' }}>
                    <span>Vào phòng lab</span>
                    <ArrowRight size={14} />
                  </div>
                </Card>
              </Link>

              {/* Station 3: PBL Projects */}
              <Link href="/projects" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card
                  variant="default"
                  padding="md"
                  interactive
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--pastel-peach-light)',
                          color: 'var(--pastel-peach-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Award size={18} />
                      </div>
                      <Badge variant="peach" size="sm">
                        3 Dự án PBL
                      </Badge>
                    </div>

                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                      Dự án thực tế lớn
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      Game Alien Invasion, Trực quan hóa dữ liệu và Web App hoàn chỉnh.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-link)', fontWeight: 600, marginTop: '12px' }}>
                    <span>Xem các dự án</span>
                    <ArrowRight size={14} />
                  </div>
                </Card>
              </Link>

              {/* Station 4: AI Tutor Assistant */}
              <Card
                variant="default"
                padding="md"
                interactive
                onClick={onOpenAISettings}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--pastel-lavender-light)',
                        color: 'var(--pastel-lavender-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Bot size={18} />
                    </div>
                    <Badge variant="lavender" size="sm">
                      BYOK AI
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    Gia sư AI Đồng hành
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    Gợi ý giải bài theo 3 cấp độ, phân tích lỗi sai và bảo mật khóa AES-256.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-link)', fontWeight: 600, marginTop: '12px' }}>
                  <span>Cài đặt AI</span>
                  <ArrowRight size={14} />
                </div>
              </Card>
            </div>
          </div>

          {/* 4. Guest / Account State Banner */}
          {!user ? (
            <Card
              variant="brick"
              padding="md"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#FDF1F2',
                    color: 'var(--london-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Bạn đang trải nghiệm dưới danh nghĩa Khách
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Đăng nhập hoặc tạo hồ sơ miễn phí để lưu lại tiến độ nộp bài và nhận điểm thưởng.
                  </div>
                </div>
              </div>

              <Button
                variant="london_red"
                size="sm"
                onClick={handleOpenAuth}
                leftIcon={<User size={14} />}
              >
                Đăng nhập ngay
              </Button>
            </Card>
          ) : (
            <Card
              variant="mint"
              padding="md"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--pastel-mint)',
                    color: 'var(--pastel-mint-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Hồ sơ: {user.displayName} ({user.email})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Tiến độ đã được lưu an toàn • {user.points} điểm tích lũy • {completedCount} bài đã giải
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenAuth}
              >
                Quản lý tài khoản
              </Button>
            </Card>
          )}

          {/* Curriculum Anchor for testing and quick jump */}
          <div id="curriculum" style={{ marginTop: '24px' }}>
            {/* Soft London Skyline Accent Footer */}
            <div
              style={{
                textAlign: 'center',
                padding: '24px 0 12px',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                <BigBen size={16} color="var(--london-slate)" />
                <span style={{ fontWeight: 600 }}>CodeCoBUG • London Pastel Learning Studio</span>
                <LondonBus size={16} color="var(--london-red)" />
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Rèn luyện tư duy lập trình qua bài tập thực chứng và trải nghiệm một chạm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Internal AuthModal Fallback */}
      {!externalOpenAuth && (
        <AuthModal
          isOpen={internalAuthOpen}
          onClose={() => setInternalAuthOpen(false)}
        />
      )}

      {/* Internal CommandCenter Fallback */}
      {!externalOpenCommandCenter && (
        <CommandCenter
          isOpen={internalCommandCenterOpen}
          onClose={() => setInternalCommandCenterOpen(false)}
          onOpenAuth={handleOpenAuth}
          onOpenAISettings={onOpenAISettings}
          onOpenWeaknessTracker={onOpenWeaknessTracker}
        />
      )}
    </div>
  );
};

