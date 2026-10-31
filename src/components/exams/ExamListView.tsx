'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Filter,
  Sparkles,
  Layers,
  History,
} from 'lucide-react';
import { ExamDefinition, ExamType, ExamSubmissionResult } from '@/lib/types/exam';
import { OFFICIAL_EXAMS } from '@/lib/exams/examRegistry';
import { ExamSessionManager } from '@/lib/exams/examSessionManager';
import { authManager } from '@/lib/auth/authManager';
import { Card, Badge, Button } from '@/components/ui';

export const ExamListView: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ExamType | 'all'>('all');
  const [userResults, setUserResults] = useState<ExamSubmissionResult[]>([]);
  const [isClient, setIsClient] = useState(false);

  const currentUser = authManager.getCurrentUser();
  const userId = currentUser?.id || 'usr-default-001';

  useEffect(() => {
    setIsClient(true);
    const history = ExamSessionManager.getUserResults(userId);
    setUserResults(history);
  }, [userId]);

  const filteredExams = selectedType === 'all'
    ? OFFICIAL_EXAMS
    : OFFICIAL_EXAMS.filter((e) => e.type === selectedType);

  const getBestScore = (examSlug: string) => {
    const attempts = userResults.filter((r) => r.examSlug === examSlug);
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map((a) => a.score));
  };

  const getBadgeForType = (type: ExamType) => {
    switch (type) {
      case 'topic_diagnostic':
        return <Badge variant="sky" size="sm">Khảo sát theo chủ đề</Badge>;
      case 'chapter_end':
        return <Badge variant="lavender" size="sm">Cuối chương</Badge>;
      case 'comprehensive':
        return <Badge variant="mint" size="sm">Thi thử tổng hợp 12 chương</Badge>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* 1. Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--pastel-mint-light) 0%, var(--pastel-sky-light) 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: '28px',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.6rem' }}>🎓</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Hệ Thống Đánh Giá & Thi Thử Python (Mock Exams)
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '640px', lineHeight: 1.5, margin: 0 }}>
          Ngân hàng bài thi chuẩn hóa từ kiểm tra đầu vào, đánh giá cuối chương đến bài thi thử tổng hợp nhiều chương có bấm giờ, chấm điểm tự động và lời giải chi tiết.
        </p>
      </div>

      {/* 2. Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Button
          variant={selectedType === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedType('all')}
        >
          Tất cả bài thi ({OFFICIAL_EXAMS.length})
        </Button>
        <Button
          variant={selectedType === 'topic_diagnostic' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedType('topic_diagnostic')}
        >
          Đầu vào chủ đề
        </Button>
        <Button
          variant={selectedType === 'chapter_end' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedType('chapter_end')}
        >
          Kiểm tra cuối chương
        </Button>
        <Button
          variant={selectedType === 'comprehensive' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setSelectedType('comprehensive')}
        >
          Thi thử tổng hợp
        </Button>
      </div>

      {/* 3. Exam Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
        {filteredExams.map((exam) => {
          const bestScore = getBestScore(exam.slug);
          const isPassed = bestScore !== null && bestScore >= exam.passingScore;

          return (
            <Card
              key={exam.id}
              variant="default"
              padding="lg"
              style={{
                borderRadius: 'var(--radius-xl)',
                border: isPassed ? '1.5px solid var(--pastel-mint)' : '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  {getBadgeForType(exam.type)}
                  {bestScore !== null && (
                    <Badge variant={isPassed ? 'mint' : 'peach'} size="sm" icon={isPassed ? <CheckCircle2 size={12} /> : undefined}>
                      Điểm cao nhất: {bestScore}%
                    </Badge>
                  )}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {exam.title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  {exam.description}
                </p>

                <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />
                    <span>{exam.durationMinutes} phút</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BookOpen size={14} />
                    <span>{exam.questionIds.length} câu hỏi</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={14} />
                    <span>Chuẩn đạt: {exam.passingScore}%</span>
                  </div>
                </div>
              </div>

              <Link href={`/exams/${exam.slug}`} style={{ textDecoration: 'none' }}>
                <Button variant={isPassed ? 'secondary' : 'primary'} size="md" style={{ width: '100%' }} rightIcon={<ArrowRight size={16} />}>
                  {bestScore !== null ? 'Thi lại bài này' : 'Bắt đầu làm bài thi'}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
