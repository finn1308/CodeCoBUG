'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  ArrowRight,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Clock,
  Play,
  AlertTriangle,
  Award,
  Zap,
} from 'lucide-react';
import { PersonalizedPathState, LearningGoalType, LearningPace, DiagnosticResult } from '@/lib/types/learningPath';
import { LearningPathManager } from '@/lib/learning-path/learningPathManager';
import { Card, Badge, Button } from '@/components/ui';
import { DiagnosticAssessmentModal } from './DiagnosticAssessmentModal';
import { StageTimelineCard } from './StageTimelineCard';
import { authManager } from '@/lib/auth/authManager';

export const LearningPathView: React.FC = () => {
  const [pathState, setPathState] = useState<PersonalizedPathState | null>(null);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const state = LearningPathManager.getPathState();
    setPathState(state);
  }, []);

  const handleDiagnosticComplete = (
    diag: DiagnosticResult,
    goal: LearningGoalType,
    pace: LearningPace
  ) => {
    const userId = authManager.getCurrentUser()?.id || 'usr-default-001';
    LearningPathManager.updatePreferences(userId, goal, pace);
    const updated = LearningPathManager.applyDiagnostic(userId, diag);
    setPathState(updated);
  };

  const handleSkipStage = (stageNumber: number) => {
    if (window.confirm(`Bạn có chắc muốn bỏ qua Chặng ${stageNumber}? Bạn vẫn có thể quay lại luyện tập bất cứ lúc nào.`)) {
      const userId = authManager.getCurrentUser()?.id || 'usr-default-001';
      const updated = LearningPathManager.skipStage(userId, stageNumber);
      setPathState(updated);
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có muốn đặt lại khảo sát và thiết lập lại lộ trình cá nhân hóa?')) {
      const userId = authManager.getCurrentUser()?.id || 'usr-default-001';
      const reset = LearningPathManager.resetPath(userId);
      setPathState(reset);
      setIsDiagnosticOpen(true);
    }
  };

  if (!isClient || !pathState) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Đang nạp bản đồ lộ trình học tập cá nhân...
      </div>
    );
  }

  const { goal, pace, diagnostic, stages, recommendedNextExercise } = pathState;

  // Calculate overall completed stats
  const totalExercises = stages.reduce((acc, s) => acc + s.totalExercisesCount, 0);
  const completedExercises = stages.reduce((acc, s) => acc + s.completedExercisesCount, 0);
  const overallPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const goalTitleMap: Record<LearningGoalType, string> = {
    start_from_scratch: 'Học từ số 0 (Mới bắt đầu)',
    reinforce_basics: 'Củng cố nền tảng & Lấp lỗ hổng',
    practice_mastery: 'Luyện bài tập & Tư duy giải thuật',
    prepare_projects: 'Chuẩn bị làm 3 Dự án thực chiến',
  };

  const paceTitleMap: Record<LearningPace, string> = {
    relaxed: 'Thư giãn (1-2 bài/ngày)',
    standard: 'Tiêu chuẩn (3-5 bài/ngày)',
    intensive: 'Tốc lực (6+ bài/ngày)',
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* 1. HERO HEADER */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--pastel-mint-light) 0%, var(--pastel-lavender-light) 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: '24px 28px',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.4rem' }}>🗺️</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Lộ Trình Học Python Cá Nhân Hóa
            </h1>
            <Badge variant="mint" size="sm">
              Adaptive Path
            </Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
            Tự động thích ứng theo kết quả chấm bài của Auto-Judge, lỗ hổng kiến thức từ Weakness Tracker và mục tiêu của bạn.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDiagnosticOpen(true)}
            leftIcon={<Sliders size={14} />}
          >
            {diagnostic ? 'Đổi mục tiêu / Khảo sát' : 'Khảo sát đầu vào'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw size={14} />}
            title="Đặt lại lộ trình"
          >
            Đặt lại
          </Button>
        </div>
      </div>

      {/* 2. RECOMMENDED NEXT EXERCISE HERO CALLOUT */}
      {recommendedNextExercise ? (
        <Card
          variant="default"
          padding="lg"
          style={{
            borderRadius: 'var(--radius-xl)',
            border: recommendedNextExercise.isReview ? '2px solid var(--pastel-peach-text)' : '2px solid var(--pastel-mint-text)',
            backgroundColor: recommendedNextExercise.isReview ? 'var(--pastel-peach-light)' : 'var(--pastel-mint-light)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: recommendedNextExercise.isReview ? 'var(--pastel-peach)' : 'var(--pastel-mint)',
                color: recommendedNextExercise.isReview ? 'var(--pastel-peach-text)' : 'var(--pastel-mint-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              {recommendedNextExercise.isReview ? <AlertTriangle size={24} /> : <Play size={24} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Badge variant={recommendedNextExercise.isReview ? 'peach' : 'mint'} size="sm">
                  {recommendedNextExercise.isReview ? 'ƯU TIÊN ÔN TẬP' : 'ĐỀ XUẤT TIẾP THEO'}
                </Badge>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {recommendedNextExercise.chapterTitle}
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                {recommendedNextExercise.title}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                💡 {recommendedNextExercise.reason}
              </div>
            </div>
          </div>

          <Link href={`/exercises/${recommendedNextExercise.slug}`} style={{ textDecoration: 'none' }}>
            <Button
              variant={recommendedNextExercise.isReview ? 'danger' : 'primary'}
              size="md"
              rightIcon={<ArrowRight size={16} />}
              style={{ fontWeight: 700 }}
            >
              {recommendedNextExercise.isReview ? 'Vào sửa bài này ngay' : 'Học bài này ngay'}
            </Button>
          </Link>
        </Card>
      ) : (
        <Card
          variant="default"
          padding="md"
          style={{
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--pastel-mint-light)',
            border: '1px solid var(--pastel-mint)',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <Award size={32} style={{ color: 'var(--pastel-mint-text)', margin: '0 auto 8px auto' }} />
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            🎉 Chúc mừng! Bạn đã hoàn thành xuất sắc toàn bộ bài tập trong lộ trình!
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Hãy sẵn sàng bước vào thử thách 3 Dự án lớn thực chiến (Alien Invasion, Data Visualization, Web Django).
          </div>
        </Card>
      )}

      {/* 3. CURRENT PROFILE & GOALS BAR */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Mục tiêu học tập
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '2px' }}>
            {goalTitleMap[goal]}
          </div>
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Tốc độ đề xuất
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '2px' }}>
            {paceTitleMap[pace]}
          </div>
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Tiến độ tổng thể
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontWeight: 800, color: 'var(--pastel-mint-text)', fontSize: '1rem' }}>
              {overallPercentage}%
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {completedExercises}/{totalExercises} bài hoàn thành
            </span>
          </div>
        </div>
      </div>

      {/* 4. FOUR STAGES ROADMAP TIMELINE */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Bản Đồ 4 Chặng Lộ Trình (Curriculum Stages)
        </h2>

        {stages.map((st, idx) => {
          // Check if this is the active current stage
          const isCurrent =
            st.status === 'in_progress' ||
            (st.status === 'not_started' && (idx === 0 || stages[idx - 1].status === 'mastered'));

          return (
            <StageTimelineCard
              key={st.id}
              stage={st}
              isCurrentStage={isCurrent}
              onSkipStage={handleSkipStage}
            />
          );
        })}
      </div>

      {/* DIAGNOSTIC MODAL */}
      <DiagnosticAssessmentModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onComplete={handleDiagnosticComplete}
      />
    </div>
  );
};

