'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Code2,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  PlayCircle,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Zap,
  ChevronDown,
  ChevronUp,
  BarChart2,
} from 'lucide-react';
import { authManager, UserProfile, SavedSubmissionRecord } from '@/lib/auth/authManager';
import { SAMPLE_TEST_COURSE } from '@/lib/fixtures/sampleCurriculum';
import { MasteryEngine, LearnerMasteryReport } from '@/lib/mastery/masteryEngine';
import { ReviewEngine, ReviewItem } from '@/lib/mastery/reviewEngine';
import { Card, Badge, Button } from '@/components/ui';
import { CurriculumBrowser } from '@/components/curriculum';

export const LearningDashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(authManager.getCurrentUser());
  const [submissions, setSubmissions] = useState<SavedSubmissionRecord[]>([]);
  const [masteryReport, setMasteryReport] = useState<LearnerMasteryReport | null>(null);
  const [pendingReviews, setPendingReviews] = useState<ReviewItem[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const refreshData = () => {
      const currentUser = authManager.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const userSubs = authManager.getAllUserSubmissions();
        setSubmissions(userSubs);

        const report = MasteryEngine.computeMastery(userSubs);
        setMasteryReport(report);

        ReviewEngine.syncReviewQueue(currentUser.id, userSubs);
        const pending = ReviewEngine.getPendingReviews(currentUser.id);
        setPendingReviews(pending);
      } else {
        setSubmissions([]);
        setMasteryReport(null);
        setPendingReviews([]);
      }
    };

    refreshData();
    const unsub = authManager.subscribe(() => {
      refreshData();
    });

    return () => unsub();
  }, []);

  // Compute all curriculum exercises and real completion statuses
  const allExercises = SAMPLE_TEST_COURSE.topics.flatMap((t) =>
    t.lessons.flatMap((l) =>
      l.exercises.map((e) => ({
        ...e,
        topicTitle: t.title,
        topicSlug: t.slug,
        topicId: t.id,
      }))
    )
  );

  const totalExercisesCount = allExercises.length;

  // Set of exercise slugs that have at least one accepted submission
  const acceptedExerciseSlugs = new Set(
    submissions.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
  );
  const completedExercisesCount = acceptedExerciseSlugs.size;
  const overallProgressPercentage = totalExercisesCount > 0
    ? Math.round((completedExercisesCount / totalExercisesCount) * 100)
    : 0;

  // Determine "Continue Learning" recommended exercise based strictly on real submissions
  let nextExercise = allExercises[0]; // Default to first exercise if brand new
  let recommendedReason = 'Bắt đầu bài tập nhập môn đầu tiên của lộ trình.';

  if (submissions.length > 0) {
    if (pendingReviews.length > 0) {
      const topReview = pendingReviews[0];
      const foundReviewExercise = allExercises.find((e) => e.slug === topReview.exerciseSlug);
      if (foundReviewExercise) {
        nextExercise = foundReviewExercise;
        recommendedReason = `Cần ôn tập: ${topReview.reasonDescription}`;
      }
    } else {
      const firstIncomplete = allExercises.find((e) => !acceptedExerciseSlugs.has(e.slug));
      if (firstIncomplete) {
        nextExercise = firstIncomplete;
        recommendedReason = 'Bài tập tiếp theo cần hoàn thành trong lộ trình.';
      } else {
        nextExercise = allExercises[0];
        recommendedReason = 'Tuyệt vời! Bạn đã hoàn thành tất cả bài tập hiện có trong khóa học.';
      }
    }
  }

  // Topic progress calculations (Strictly derived from real accepted submissions)
  const topicProgressList = SAMPLE_TEST_COURSE.topics.map((topic) => {
    const topicExs = topic.lessons.flatMap((l) => l.exercises);
    const totalInTopic = topicExs.length;
    const completedInTopic = topicExs.filter((e) => acceptedExerciseSlugs.has(e.slug)).length;
    const percentage = totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0;

    return {
      topic,
      totalInTopic,
      completedInTopic,
      percentage,
      isCompleted: completedInTopic === totalInTopic && totalInTopic > 0,
      isStarted: completedInTopic > 0,
    };
  });

  // Current learning topic
  const currentTopic = topicProgressList.find((t) => !t.isCompleted) || topicProgressList[0];

  // Recent unique attempts (max 4 for scannability)
  const recentSubmissions = submissions.slice(0, 4);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 20px 48px', width: '100%' }}>
      {/* 1. Compact Welcoming Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.25 }}>
            Tổng quan học tập
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '3px', margin: 0 }}>
            {user ? `Xin chào ${user.displayName} 👋 • Lộ trình rèn luyện tư duy Python thực chứng` : 'Xin chào học viên 👋 • Lộ trình rèn luyện tư duy Python thực chứng'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="mint" size="sm" icon={<Award size={13} />}>
            {user ? user.points : 0} pt
          </Badge>
          <Badge variant="sky" size="sm">
            {completedExercisesCount}/{totalExercisesCount} bài ({overallProgressPercentage}%)
          </Badge>
        </div>
      </div>

      {/* 2. One Prominent Continue Learning Action (Focused & Non-oversized) */}
      <Card variant="mint" padding="md" style={{ marginBottom: '20px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--pastel-mint-active)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--pastel-mint-text)',
                  textTransform: 'uppercase',
                }}
              >
                Khu vực học tiếp
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                • {currentTopic ? currentTopic.topic.title : 'Chủ đề 01'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {nextExercise.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, margin: '0 0 12px 0', maxWidth: '580px' }}>
              {nextExercise.description}
            </p>

            {/* Current Topic Progress Bar */}
            {currentTopic && (
              <div style={{ maxWidth: '380px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Tiến độ chủ đề hiện tại</span>
                  <span>{currentTopic.completedInTopic}/{currentTopic.totalInTopic} bài ({currentTopic.percentage}%)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${currentTopic.percentage}%`,
                      backgroundColor: 'var(--status-success)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.76rem', color: 'var(--pastel-mint-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={13} />
              <span>Gợi ý tiếp theo: {recommendedReason}</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: 'center' }}>
            <Link href={`/exercises/${nextExercise.slug}`} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md" leftIcon={<PlayCircle size={16} />}>
                {submissions.length > 0 ? 'Tiếp tục bài học' : 'Bắt đầu bài tập đầu tiên'}
              </Button>
            </Link>
            <a href="#curriculum" style={{ textDecoration: 'none', textAlign: 'center' }}>
              <Button variant="ghost" size="sm" style={{ width: '100%', fontSize: '0.78rem' }}>
                Xem giáo trình
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* 3. Collapsible Detailed Statistics Section */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setShowStats((prev) => !prev)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)',
          }}
          aria-expanded={showStats}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={16} style={{ color: 'var(--pastel-mint-text)' }} />
            <span>Thống kê chi tiết & Năng lực học viên</span>
            <Badge variant="neutral" size="sm">
              {masteryReport ? `${masteryReport.overallMasteryPercentage}% thành thạo` : '0%'}
            </Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            <span>{showStats ? 'Thu gọn' : 'Mở rộng'}</span>
            {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {showStats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginTop: '10px',
            }}
          >
            <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--pastel-mint)', color: 'var(--pastel-mint-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {completedExercisesCount}/{totalExercisesCount}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Bài hoàn thành ({overallProgressPercentage}%)
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--pastel-yellow)', color: 'var(--pastel-yellow-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Award size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {user ? user.points : 0} đ
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Điểm số tích lũy
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--pastel-sky)', color: 'var(--pastel-sky-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {masteryReport ? masteryReport.overallMasteryPercentage : 0}%
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Độ thành thạo kỹ năng
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--pastel-peach)', color: 'var(--pastel-peach-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Target size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {pendingReviews.length}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Hàng đợi ôn tập
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* 4. Two-Column Layout: Recently Attempted Exercises vs Weak Skills & Review */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {/* Column Left: Recently Attempted Exercises (Honest Real Data) */}
        <Card variant="default" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--pastel-sky-text)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Bài tập gần đây
              </h3>
            </div>
            {recentSubmissions.length > 0 && (
              <Badge variant="sky" size="sm">
                {submissions.length} lần nộp thật
              </Badge>
            )}
          </div>

          {recentSubmissions.length === 0 ? (
            /* Honest Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: '28px 14px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-medium)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--pastel-sky-light)',
                  color: 'var(--pastel-sky-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                }}
              >
                <Code2 size={18} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Chưa có bài tập nào được nộp
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto 12px auto', lineHeight: 1.4 }}>
                Toàn bộ lịch sử nộp bài và thời gian thực thi của bạn sẽ được hiển thị trung thực tại đây sau khi nộp bài.
              </p>
              <Link href="/exercises/in-loi-chao-codecobug" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="sm" leftIcon={<PlayCircle size={14} />}>
                  Làm bài tập đầu tiên
                </Button>
              </Link>
            </div>
          ) : (
            /* Real Recent Attempts List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentSubmissions.map((sub) => {
                const isAccepted = sub.verdict === 'accepted';
                const ex = allExercises.find((e) => e.slug === sub.exerciseSlug);
                const title = ex ? ex.title : sub.exerciseSlug;
                const formattedTime = new Date(sub.submittedAt).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                });

                return (
                  <div
                    key={sub.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                        {title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{formattedTime}</span>
                        <span>•</span>
                        <span>Điểm: {sub.score} đ</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge variant={isAccepted ? 'success' : 'error'} size="sm">
                        {isAccepted ? 'ĐẠT' : 'CHƯA ĐẠT'}
                      </Badge>

                      <Link href={`/exercises/${sub.exerciseSlug}`} style={{ textDecoration: 'none' }}>
                        <Button variant="ghost" size="sm" style={{ padding: '3px 8px', fontSize: '0.76rem' }}>
                          Làm lại
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Column Right: Weak Skills & Review Recommendations (Honest Real Data) */}
        <Card variant="default" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} style={{ color: 'var(--pastel-peach-text)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Đề xuất ôn tập thích ứng
              </h3>
            </div>
            {pendingReviews.length > 0 && (
              <Badge variant="peach" size="sm">
                {pendingReviews.length} bài cần ôn
              </Badge>
            )}
          </div>

          {pendingReviews.length === 0 ? (
            /* Honest Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: '28px 14px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-medium)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--pastel-mint-light)',
                  color: 'var(--pastel-mint-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Không có điểm yếu cần củng cố
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.4 }}>
                Hệ thống chỉ đề xuất bài ôn tập khi phát hiện lỗi sai thực tế hoặc kỹ năng dưới ngưỡng 40%.
              </p>
            </div>
          ) : (
            /* Real Review Recommendations List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingReviews.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: 'var(--pastel-peach-light)',
                    border: '1px solid var(--pastel-peach)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.exerciseTitle}
                      </span>
                      <Badge variant={item.priority === 1 ? 'peach' : 'yellow'} size="sm">
                        {item.priority === 1 ? 'ƯU TIÊN CAO' : 'CỦNG CỐ'}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.reasonDescription}
                    </div>
                  </div>

                  <Link href={`/exercises/${item.exerciseSlug}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <Button variant="peach" size="sm" leftIcon={<RotateCcw size={13} />}>
                      Ôn ngay
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 5. Python Curriculum Browser & Topic Progress (Clean embedded view without duplicate header) */}
      <div id="curriculum">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pastel-sky-text)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
          <BookOpen size={16} />
          <span>Tiến độ giáo trình Python</span>
        </div>
        <CurriculumBrowser showCourseHeader={false} id="curriculum-browser-inner" />
      </div>
    </div>
  );
};
