'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { ExamSubmissionResult } from '@/lib/types/exam';
import { Card, Badge, Button } from '@/components/ui';

export interface ExamResultSummaryProps {
  result: ExamSubmissionResult;
  onRetakeExam: () => void;
}

export const ExamResultSummary: React.FC<ExamResultSummaryProps> = ({
  result,
  onRetakeExam,
}) => {
  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;
  const timeFormatted = `${minutes} phút ${seconds} giây`;

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* 1. Header Banner */}
      <Card
        variant="default"
        padding="lg"
        style={{
          borderRadius: 'var(--radius-2xl)',
          backgroundColor: result.isPassed ? 'var(--pastel-mint-light)' : 'var(--pastel-peach-light)',
          border: result.isPassed ? '2px solid var(--pastel-mint)' : '2px solid var(--pastel-peach)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: result.isPassed ? 'var(--pastel-mint)' : 'var(--pastel-peach)',
            color: result.isPassed ? 'var(--pastel-mint-text)' : 'var(--pastel-peach-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {result.isPassed ? <Award size={36} /> : <AlertTriangle size={36} />}
        </div>

        <Badge variant={result.isPassed ? 'mint' : 'peach'} size="sm" style={{ marginBottom: '8px' }}>
          {result.isPassed ? 'ĐẠT YÊU CẦU (PASSED)' : 'CHƯA ĐẠT (NEEDS REVIEW)'}
        </Badge>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
          Kết Quả Bài Thi: {result.score} / 100 Điểm
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 auto 16px auto', maxWidth: '540px' }}>
          {result.isPassed
            ? 'Xin chúc mừng! Bạn đã nắm vững các chủ đề được đánh giá trong bài thi này và sẵn sàng cho các chặng tiếp theo.'
            : 'Bạn chưa đạt điểm chuẩn tối thiểu. Hãy xem lại lời giải chi tiết và các chủ đề cần ôn luyện bên dưới.'}
        </p>

        {/* Quick Meta Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <Clock size={16} />
            <span>Thời gian làm bài: <strong>{timeFormatted}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--pastel-mint-text)' }} />
            <span>Câu đúng: <strong>{result.answers.filter((a) => a.isCorrect).length} / {result.answers.length}</strong></span>
          </div>
        </div>
      </Card>

      {/* 2. Topic Breakdown Card */}
      <Card variant="default" padding="md" style={{ borderRadius: 'var(--radius-xl)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} style={{ color: 'var(--pastel-sky-text)' }} />
          <span>Điểm số phân loại theo từng chủ đề:</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {result.topicBreakdowns.map((tb) => (
            <div key={tb.topicSlug} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {tb.topicTitle}
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: tb.percentage >= 70 ? 'var(--pastel-mint-text)' : 'var(--pastel-peach-text)' }}>
                  {tb.earnedPoints} / {tb.totalPoints} đ ({tb.percentage}%)
                </span>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${tb.percentage}%`,
                    backgroundColor: tb.percentage >= 70 ? 'var(--pastel-mint-text)' : 'var(--pastel-peach-text)',
                  }}
                />
              </div>
              {tb.needsReview && (
                <div style={{ fontSize: '0.76rem', color: 'var(--pastel-peach-text)', marginTop: '4px', fontWeight: 600 }}>
                  ⚠️ Cần ôn tập lại chủ đề này trước khi làm bài tiếp.
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <Button variant="outline" size="md" onClick={onRetakeExam} leftIcon={<RotateCcw size={16} />}>
          Làm lại bài thi
        </Button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/learning-path" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="md" leftIcon={<Target size={16} />}>
              Xem Lộ trình đề xuất
            </Button>
          </Link>
          <Link href="/exams" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>
              Danh sách bài thi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
