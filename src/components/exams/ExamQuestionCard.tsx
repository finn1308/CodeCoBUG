'use client';

import React from 'react';
import { CheckCircle2, XCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { ExamQuestion } from '@/lib/types/exam';
import { Card, Badge } from '@/components/ui';

export interface ExamQuestionCardProps {
  question: Omit<ExamQuestion, 'correctOptionId' | 'explanation'>;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  // Feedback mode after submission
  isSubmitted?: boolean;
  correctOptionId?: string;
  explanation?: string;
}

export const ExamQuestionCard: React.FC<ExamQuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  isSubmitted = false,
  correctOptionId,
  explanation,
}) => {
  const isCorrect = isSubmitted && selectedOptionId === correctOptionId;
  const isWrong = isSubmitted && selectedOptionId && selectedOptionId !== correctOptionId;
  const isMissed = isSubmitted && !selectedOptionId;

  return (
    <Card
      variant="default"
      padding="lg"
      style={{
        borderRadius: 'var(--radius-xl)',
        marginBottom: '20px',
        border: isSubmitted
          ? isCorrect
            ? '1.5px solid var(--pastel-mint)'
            : '1.5px solid var(--pastel-peach)'
          : selectedOptionId
          ? '1.5px solid var(--pastel-sky)'
          : '1px solid var(--border-medium)',
        backgroundColor: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Question Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant={selectedOptionId ? 'sky' : 'neutral'} size="sm">
            Câu {questionIndex + 1} / {totalQuestions}
          </Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {question.testedSkillName}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="mint" size="sm">
            {question.points} điểm
          </Badge>
          {isSubmitted && (
            isCorrect ? (
              <Badge variant="mint" size="sm" icon={<CheckCircle2 size={12} />}>
                Chính xác
              </Badge>
            ) : (
              <Badge variant="peach" size="sm" icon={<XCircle size={12} />}>
                {isMissed ? 'Chưa trả lời' : 'Chưa chính xác'}
              </Badge>
            )
          )}
        </div>
      </div>

      {/* Prompt */}
      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.5 }}>
        {question.prompt}
      </div>

      {/* Code Snippet if present */}
      {question.codeSnippet && (
        <pre
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-code)',
            color: '#A6E3A1',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.86rem',
            lineHeight: 1.6,
            marginBottom: '16px',
            overflowX: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {question.codeSnippet}
        </pre>
      )}

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isAnswerKey = isSubmitted && correctOptionId === opt.id;

          let optionBg = 'var(--bg-surface)';
          let optionBorder = '1px solid var(--border-medium)';
          let badgeBg = 'var(--bg-tertiary)';
          let badgeColor = 'var(--text-secondary)';

          if (isSubmitted) {
            if (isAnswerKey) {
              optionBg = 'var(--pastel-mint-light)';
              optionBorder = '2px solid var(--pastel-mint-text)';
              badgeBg = 'var(--pastel-mint-text)';
              badgeColor = '#FFFFFF';
            } else if (isSelected && !isCorrect) {
              optionBg = 'var(--pastel-peach-light)';
              optionBorder = '2px solid var(--pastel-peach-text)';
              badgeBg = 'var(--pastel-peach-text)';
              badgeColor = '#FFFFFF';
            }
          } else if (isSelected) {
            optionBg = 'var(--pastel-sky-light)';
            optionBorder = '2px solid var(--pastel-sky-text)';
            badgeBg = 'var(--pastel-sky-text)';
            badgeColor = '#FFFFFF';
          }

          return (
            <div
              key={opt.id}
              onClick={() => {
                if (!isSubmitted) onSelectOption(opt.id);
              }}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: optionBg,
                border: optionBorder,
                cursor: isSubmitted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all var(--transition-base)',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: badgeBg,
                  color: badgeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {opt.id.toUpperCase()}
              </div>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: isSelected || isAnswerKey ? 600 : 400 }}>
                {opt.text}
              </span>
              {isSubmitted && isAnswerKey && (
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--pastel-mint-text)', fontWeight: 700 }}>
                  Đáp án đúng
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* CodeCoBUG Authoritative Explanation */}
      {isSubmitted && explanation && (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--pastel-yellow-light)',
            border: '1px solid var(--pastel-yellow)',
            marginTop: '12px',
            fontSize: '0.86rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--pastel-yellow-text)', marginBottom: '4px' }}>
            <BookOpen size={15} />
            <span>Lời giải chi tiết từ CodeCoBUG:</span>
          </div>
          <div>{explanation}</div>
        </div>
      )}
    </Card>
  );
};
