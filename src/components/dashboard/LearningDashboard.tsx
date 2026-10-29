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
} from 'lucide-react';
import { authManager, UserProfile, SavedSubmissionRecord } from '@/lib/auth/authManager';
import { SAMPLE_TEST_COURSE } from '@/lib/fixtures/sampleCurriculum';
import { MasteryEngine, LearnerMasteryReport } from '@/lib/mastery/masteryEngine';
import { ReviewEngine, ReviewItem } from '@/lib/mastery/reviewEngine';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@/components/ui';

export const LearningDashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(authManager.getCurrentUser());
  const [submissions, setSubmissions] = useState<SavedSubmissionRecord[]>([]);
  const [masteryReport, setMasteryReport] = useState<LearnerMasteryReport | null>(null);
  const [pendingReviews, setPendingReviews] = useState<ReviewItem[]>([]);
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
    // If user has pending review items, recommend the top priority review
    if (pendingReviews.length > 0) {
      const topReview = pendingReviews[0];
      const foundReviewExercise = allExercises.find((e) => e.slug === topReview.exerciseSlug);
      if (foundReviewExercise) {
        nextExercise = foundReviewExercise;
        recommendedReason = `Cần ôn tập: ${topReview.reasonDescription}`;
      }
    } else {
      // Otherwise find the first uncompleted exercise in course order
      const firstIncomplete = allExercises.find((e) => !acceptedExerciseSlugs.has(e.slug));
      if (firstIncomplete) {
        nextExercise = firstIncomplete;
        recommendedReason = 'Bài tập tiếp theo cần hoàn thành trong lộ trình.';
      } else {
        // All exercises completed
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

  // Recent unique attempts (max 5)
  const recentSubmissions = submissions.slice(0, 5);

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '32px 24px 60px', width: '100%' }}>
      {/* 1. Welcoming Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--pastel-mint-light)',
                border: '1px solid var(--pastel-mint)',
                color: 'var(--pastel-mint-text)',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              <Sparkles size={13} />
              <span>Bảng điều khiển học tập Teen Pastel Studio</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.25 }}>
              Chào mừng trở lại, {user ? user.displayName : 'Học viên'} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
              Không gian rèn luyện tư duy lập trình Python thực chứng và cá nhân hoá.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Badge variant="mint" size="md" icon={<Award size={14} />}>
              {user ? user.points : 0} Điểm thưởng
            </Badge>
            <Badge variant="sky" size="md">
              {user ? user.role.toUpperCase() : 'LEARNER'}
            </Badge>
          </div>
        </div>
      </div>

      {/* 2. Compact Learning Activity Overview (100% Real Persisted Evidence) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '28px',
        }}
      >
        {/* Metric 1: Completed Exercises */}
        <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--pastel-mint)',
                color: 'var(--pastel-mint-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {completedExercisesCount}/{totalExercisesCount}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Bài tập hoàn thành ({overallProgressPercentage}%)
              </div>
            </div>
          </div>
        </Card>

        {/* Metric 2: Total Points */}
        <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--pastel-yellow)',
                color: 'var(--pastel-yellow-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {user ? user.points : 0} đ
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Tổng điểm tích lũy thật
              </div>
            </div>
          </div>
        </Card>

        {/* Metric 3: Overall Mastery */}
        <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--pastel-sky)',
                color: 'var(--pastel-sky-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TrendingUp size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {masteryReport ? masteryReport.overallMasteryPercentage : 0}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Độ thành thạo kỹ năng
              </div>
            </div>
          </div>
        </Card>

        {/* Metric 4: Review Queue */}
        <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--pastel-peach)',
                color: 'var(--pastel-peach-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Target size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {pendingReviews.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Bài tập cần ôn lại
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Continue Learning & Recommended Next Action */}
      <div style={{ marginBottom: '32px' }}>
        <Card variant="mint" padding="lg" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--pastel-mint-active)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--pastel-mint-text)',
                    textTransform: 'uppercase',
                  }}
                >
                  Khu vực học tiếp
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  • {currentTopic ? currentTopic.topic.title : 'Chủ đề 01'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                {nextExercise.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                {nextExercise.description}
              </p>

              {/* Progress Bar of Current Topic */}
              {currentTopic && (
                <div style={{ maxWidth: '420px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                    <span>Tiến độ chủ đề hiện tại</span>
                    <span>{currentTopic.completedInTopic}/{currentTopic.totalInTopic} bài ({currentTopic.percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
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

              <div style={{ fontSize: '0.78rem', color: 'var(--pastel-mint-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} />
                <span>Gợi ý tiếp theo: {recommendedReason}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: 'center' }}>
              <Link href={`/exercises/${nextExercise.slug}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg" leftIcon={<PlayCircle size={18} />}>
                  {submissions.length > 0 ? 'Tiếp tục bài học' : 'Bắt đầu bài tập đầu tiên'}
                </Button>
              </Link>
              <a href="#curriculum" style={{ textDecoration: 'none', textAlign: 'center' }}>
                <Button variant="ghost" size="sm" style={{ width: '100%' }}>
                  Xem danh sách giáo trình
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Two-Column Layout: Recently Attempted Exercises vs Weak Skills & Review */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Column Left: Recently Attempted Exercises (Honest Real Data) */}
        <Card variant="default" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--pastel-sky-text)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
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
                padding: '36px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-medium)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--pastel-sky-light)',
                  color: 'var(--pastel-sky-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                }}
              >
                <Code2 size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Chưa có bài tập nào được nộp
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                Toàn bộ lịch sử nộp bài và thời gian thực thi của bạn sẽ được hiển thị trung thực tại đây sau khi nộp bài.
              </p>
              <Link href="/exercises/in-loi-chao-codecobug" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="sm" leftIcon={<PlayCircle size={15} />}>
                  Làm bài tập đầu tiên
                </Button>
              </Link>
            </div>
          ) : (
            /* Real Recent Attempts List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                      padding: '12px 14px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{formattedTime}</span>
                        <span>•</span>
                        <span>Điểm: {sub.score} đ</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Badge variant={isAccepted ? 'success' : 'error'} size="sm">
                        {isAccepted ? 'ĐẠT' : 'CHƯA ĐẠT'}
                      </Badge>

                      <Link href={`/exercises/${sub.exerciseSlug}`} style={{ textDecoration: 'none' }}>
                        <Button variant="ghost" size="sm" style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} style={{ color: 'var(--pastel-peach-text)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
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
                padding: '36px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-medium)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--pastel-mint-light)',
                  color: 'var(--pastel-mint-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Không có điểm yếu cần củng cố
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto', lineHeight: 1.5 }}>
                Hệ thống chỉ đề xuất bài ôn tập khi phát hiện lỗi sai thực tế hoặc kỹ năng dưới ngưỡng 40%.
              </p>
            </div>
          ) : (
            /* Real Review Recommendations List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingReviews.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    backgroundColor: 'var(--pastel-peach-light)',
                    border: '1px solid var(--pastel-peach)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.exerciseTitle}
                      </span>
                      <Badge variant={item.priority === 1 ? 'peach' : 'yellow'} size="sm">
                        {item.priority === 1 ? 'ƯU TIÊN CAO' : 'CỦNG CỐ'}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
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

      {/* 5. Python Curriculum Browser & Topic Progress */}
      <div id="curriculum">
        <Card variant="default" padding="lg">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pastel-sky-text)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                <BookOpen size={16} />
                <span>Tiến độ giáo trình Python</span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {SAMPLE_TEST_COURSE.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
                {SAMPLE_TEST_COURSE.description}
              </p>
            </div>

            <Badge variant="mint" size="md" icon={<CheckCircle2 size={14} />}>
              Tổng tiến độ: {completedExercisesCount}/{totalExercisesCount} bài ({overallProgressPercentage}%)
            </Badge>
          </div>

          {/* Topics List with Real Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {topicProgressList.map(({ topic, totalInTopic, completedInTopic, percentage, isCompleted, isStarted }, topicIdx) => {
              const topicPastelBg = isCompleted
                ? 'var(--pastel-mint-light)'
                : isStarted
                ? 'var(--pastel-sky-light)'
                : 'var(--bg-tertiary)';
              const topicBorder = isCompleted
                ? 'var(--pastel-mint)'
                : isStarted
                ? 'var(--pastel-sky)'
                : 'var(--border-subtle)';

              return (
                <div
                  key={topic.id}
                  style={{
                    backgroundColor: topicPastelBg,
                    border: `1px solid ${topicBorder}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '22px',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            border: `1px solid ${topicBorder}`,
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                          }}
                        >
                          Chủ đề {String(topicIdx + 1).padStart(2, '0')}
                        </span>
                        <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {topic.title}
                        </h3>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '6px' }}>
                        {topic.summary}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Badge variant={isCompleted ? 'success' : isStarted ? 'sky' : 'neutral'} size="sm">
                        {isCompleted ? 'ĐÃ HOÀN THÀNH' : isStarted ? 'ĐANG HỌC' : 'CHƯA HỌC'}
                      </Badge>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {completedInTopic}/{totalInTopic} bài ({percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Topic Progress Bar */}
                  <div style={{ height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '16px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: isCompleted ? 'var(--status-success)' : 'var(--status-info)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  {/* Exercises in Topic */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {topic.lessons.flatMap((l) => l.exercises).map((ex) => {
                      const isExAccepted = acceptedExerciseSlugs.has(ex.slug);

                      return (
                        <Link
                          key={ex.id}
                          href={`/exercises/${ex.slug}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            backgroundColor: 'var(--bg-surface)',
                            border: `1px solid ${isExAccepted ? 'var(--pastel-mint)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            transition: 'all var(--transition-base)',
                            boxShadow: 'var(--shadow-xs)',
                          }}
                          className="card-pastel"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isExAccepted ? 'var(--pastel-mint)' : 'var(--bg-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isExAccepted ? 'var(--pastel-mint-text)' : 'var(--text-muted)',
                                flexShrink: 0,
                              }}
                            >
                              {isExAccepted ? <CheckCircle2 size={18} /> : <Code2 size={18} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                {ex.title}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                <span>3 ví dụ minh họa</span>
                                <span>•</span>
                                <span>{ex.examples.length} test scenarios</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Badge variant={ex.difficulty as any} size="sm">
                              {ex.difficulty.replace('_', ' ')}
                            </Badge>

                            <Badge variant="mint" size="sm" icon={<Award size={13} />}>
                              {ex.points} đ
                            </Badge>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: isExAccepted ? 'var(--status-success-text)' : 'var(--pastel-mint-text)',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                              }}
                            >
                              <span>{isExAccepted ? 'Làm lại' : 'Làm bài'}</span>
                              <ArrowRight size={14} />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

