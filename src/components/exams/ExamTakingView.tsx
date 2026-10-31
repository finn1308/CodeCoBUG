'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Send,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import {
  ExamDefinition,
  ExamQuestion,
  ExamSessionState,
  ExamSubmissionResult,
} from '@/lib/types/exam';
import { ExamEngine } from '@/lib/exams/examEngine';
import { ExamSessionManager } from '@/lib/exams/examSessionManager';
import { authManager } from '@/lib/auth/authManager';
import { Card, Badge, Button, Modal } from '@/components/ui';
import { ExamCountdownTimer } from './ExamCountdownTimer';
import { ExamQuestionCard } from './ExamQuestionCard';
import { ExamResultSummary } from './ExamResultSummary';

export interface ExamTakingViewProps {
  exam: ExamDefinition;
}

export const ExamTakingView: React.FC<ExamTakingViewProps> = ({ exam }) => {
  const [session, setSession] = useState<ExamSessionState | null>(null);
  const [questions, setQuestions] = useState<Array<Omit<ExamQuestion, 'correctOptionId' | 'explanation'>>>([]);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ExamSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const currentUser = authManager.getCurrentUser();
  const userId = currentUser?.id || 'usr-default-001';

  // Initialize or resume session
  useEffect(() => {
    setIsClient(true);
    const activeSession = ExamSessionManager.startOrResumeSession(
      userId,
      exam.id,
      exam.slug,
      exam.title,
      exam.durationMinutes
    );
    setSession(activeSession);

    const sanitizedQs = ExamEngine.getSanitizedQuestionsForExam(exam, true);
    setQuestions(sanitizedQs);

    // Check if user already submitted this session earlier
    const existingResults = ExamSessionManager.getUserResults(userId);
    const matchedResult = existingResults.find((r) => r.sessionId === activeSession.sessionId);
    if (matchedResult) {
      setSubmissionResult(matchedResult);
    }
  }, [exam, userId]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submissionResult) return;
    const updated = ExamSessionManager.saveAnswer(userId, questionId, optionId);
    if (updated) {
      setSession({ ...updated });
    }
  };

  const executeGrading = (isTimeout = false) => {
    if (!session || isSubmitting || submissionResult) return;
    setIsSubmitting(true);

    const startedTime = new Date(session.startedAt).getTime();
    const timeSpent = Math.max(1, Math.round((Date.now() - startedTime) / 1000));

    // Grade authoritatively using ExamEngine
    const result = ExamEngine.gradeExamSubmission(
      exam,
      userId,
      session.sessionId,
      session.answers,
      timeSpent
    );

    // Finalize session & save to persistent storage
    ExamSessionManager.finalizeSession(userId, result);
    setSubmissionResult(result);
    setIsSubmitting(false);
    setIsConfirmSubmitOpen(false);

    // Scroll to top to see results
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetake = () => {
    ExamSessionManager.clearActiveSession(userId);
    const freshSession = ExamSessionManager.startOrResumeSession(
      userId,
      exam.id,
      exam.slug,
      exam.title,
      exam.durationMinutes
    );
    setSession(freshSession);
    setSubmissionResult(null);
  };

  if (!isClient || !session) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Đang khởi tạo bài thi an toàn...
      </div>
    );
  }

  const answeredCount = Object.keys(session.answers).length;
  const totalQuestions = questions.length;
  const isAllAnswered = answeredCount === totalQuestions;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* 1. Sticky Navigation Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          position: 'sticky',
          top: '12px',
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/exams" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Danh sách bài thi
            </Button>
          </Link>
          <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
            {exam.title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Progress */}
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Đã làm: <strong>{answeredCount}/{totalQuestions}</strong> câu
          </span>

          {/* Countdown Clock */}
          <ExamCountdownTimer
            expiresAt={session.expiresAt}
            onTimeExpired={() => executeGrading(true)}
            isSubmitted={!!submissionResult}
          />

          {/* Submit button */}
          {!submissionResult && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsConfirmSubmitOpen(true)}
              leftIcon={<Send size={14} />}
            >
              Nộp bài
            </Button>
          )}
        </div>
      </div>

      {/* 2. Result Summary Banner (Shown after submission) */}
      {submissionResult && (
        <ExamResultSummary result={submissionResult} onRetakeExam={handleRetake} />
      )}

      {/* 3. Question Cards List */}
      <div>
        {questions.map((q, idx) => {
          const detail = submissionResult?.answers.find((a) => a.questionId === q.id);

          return (
            <ExamQuestionCard
              key={q.id}
              question={q}
              questionIndex={idx}
              totalQuestions={totalQuestions}
              selectedOptionId={session.answers[q.id]}
              onSelectOption={(optId) => handleSelectOption(q.id, optId)}
              isSubmitted={!!submissionResult}
              correctOptionId={detail?.correctOptionId}
              explanation={detail?.explanation}
            />
          );
        })}
      </div>

      {/* 4. Bottom Submit Button Bar */}
      {!submissionResult && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsConfirmSubmitOpen(true)}
            rightIcon={<Send size={18} />}
          >
            Hoàn thành & Nộp bài thi
          </Button>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={isConfirmSubmitOpen}
        onClose={() => setIsConfirmSubmitOpen(false)}
        title="Xác nhận nộp bài thi"
        maxWidth="480px"
      >
        <div style={{ padding: '4px 0' }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: 1.5, marginBottom: '14px' }}>
            Bạn đã hoàn thành <strong>{answeredCount}</strong> trên tổng số <strong>{totalQuestions}</strong> câu hỏi.
          </p>

          {!isAllAnswered && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--pastel-peach-light)',
                border: '1px solid var(--pastel-peach)',
                color: 'var(--pastel-peach-text)',
                fontSize: '0.86rem',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} />
              <span>Cảnh báo: Vẫn còn {totalQuestions - answeredCount} câu chưa trả lời!</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="ghost" onClick={() => setIsConfirmSubmitOpen(false)}>
              Quay lại làm tiếp
            </Button>
            <Button
              variant="primary"
              onClick={() => executeGrading(false)}
              isLoading={isSubmitting}
              rightIcon={<FileCheck size={16} />}
            >
              Đồng ý nộp bài
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
