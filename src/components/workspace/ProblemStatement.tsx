'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Exercise, Lesson } from '@/lib/types/curriculum';
import {
  FileText,
  AlertCircle,
  Award,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CornerDownRight,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui';

interface ProblemStatementProps {
  exercise: Exercise;
  lesson?: Lesson;
  topicTitle?: string;
  onApplyInput?: (input: string) => void;
}

export const ProblemStatement: React.FC<ProblemStatementProps> = ({
  exercise,
  lesson,
  topicTitle,
  onApplyInput,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);

  const handleCopyInput = async (inputData: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(inputData);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      // fallback
    }
  };

  return (
    <div
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Exercise Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Badge variant={exercise.difficulty as any} size="sm">
            {exercise.difficulty.replace('_', ' ')}
          </Badge>
          <Badge variant="mint" size="sm" icon={<Award size={12} />}>
            {exercise.points} Điểm
          </Badge>
          {topicTitle && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              • {topicTitle}
            </span>
          )}
        </div>

        <h1
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
          }}
        >
          {exercise.title}
        </h1>
      </div>

      {/* Lesson / Theory Reference Block */}
      {lesson && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <button
            type="button"
            onClick={() => setLessonOpen((prev) => !prev)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.86rem',
              transition: 'background-color 150ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} style={{ color: 'var(--pastel-lavender-text)' }} />
              <span>Lý thuyết bài học: {lesson.title}</span>
            </div>
            {lessonOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {lessonOpen && (
            <div
              style={{
                padding: '0 16px 14px',
                fontSize: '0.83rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    🎯 Mục tiêu bài học:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    {lesson.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {lesson.theoryContent && (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    📖 Tóm tắt kiến thức:
                  </div>
                  <div style={{ whiteSpace: 'pre-line', backgroundColor: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                    {lesson.theoryContent}
                  </div>
                </div>
              )}

              {lesson.codeExamples && lesson.codeExamples.length > 0 && (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    💻 Ví dụ code:
                  </div>
                  {lesson.codeExamples.map((ex, i) => (
                    <div key={i} style={{ marginBottom: '8px', backgroundColor: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                      {ex.title && <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ex.title}</div>}
                      <pre style={{ margin: '4px 0', fontFamily: 'monospace', fontSize: '0.82rem', overflowX: 'auto' }}>{ex.code}</pre>
                    </div>
                  ))}
                </div>
              )}

              {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
                <div style={{ backgroundColor: 'var(--pastel-peach-light)', border: '1px solid var(--pastel-peach)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--pastel-peach-text)', marginBottom: '4px' }}>
                    ⚠️ Sai lầm thường gặp:
                  </div>
                  {lesson.commonMistakes.map((m, i) => (
                    <div key={i} style={{ marginBottom: '6px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>• {m.mistake}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>💡 Cách sửa: {m.fix}</div>
                    </div>
                  ))}
                </div>
              )}

              {lesson.referenceLinks && lesson.referenceLinks.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {lesson.referenceLinks.map((ref, i) => (
                    <a
                      key={i}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.76rem',
                        color: 'var(--pastel-sky-text)',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <ExternalLink size={12} />
                      {ref.title}
                    </a>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '4px' }}>
                <Link
                  href="/curriculum"
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--pastel-mint-text)',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  ← Mở toàn bộ giáo trình
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description Panel */}
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.90rem',
          lineHeight: 1.65,
          backgroundColor: 'var(--bg-tertiary)',
          padding: '16px 18px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
          wordBreak: 'break-word',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.92rem',
          }}
        >
          <FileText size={16} style={{ color: 'var(--pastel-sky-text)' }} />
          <span>Mô tả bài toán</span>
        </div>
        <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{exercise.description}</p>
      </div>

      {/* Constraints & Requirements */}
      {exercise.completionCriteria && (
        <div
          style={{
            backgroundColor: 'var(--pastel-sky-light)',
            border: '1px solid var(--pastel-sky)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            fontSize: '0.85rem',
            wordBreak: 'break-word',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--pastel-sky-text)',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            <AlertCircle size={16} />
            <span>Yêu cầu & Điều kiện hoàn thành</span>
          </div>
          <ul
            style={{
              paddingLeft: '20px',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              margin: 0,
            }}
          >
            <li>
              Vượt qua <strong>toàn bộ test case</strong> (gồm test công khai và test ẩn).
            </li>
            {exercise.completionCriteria.forbiddenTokens && exercise.completionCriteria.forbiddenTokens.length > 0 && (
              <li style={{ color: 'var(--status-error-text)', fontWeight: 600 }}>
                Quy tắc: Không được sử dụng biến tạm ({exercise.completionCriteria.forbiddenTokens.join(', ')}).
              </li>
            )}
            {exercise.completionCriteria.requiredTokens && exercise.completionCriteria.requiredTokens.length > 0 && (
              <li>
                Cú pháp bắt buộc: {exercise.completionCriteria.requiredTokens.join(', ')}.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Example Scenarios */}
      <div>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          Ví dụ minh họa ({exercise.examples.length} ví dụ)
        </h2>
        <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Chương trình của bạn phải xử lý chính xác các trường hợp cơ bản và trường hợp biên sau:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {exercise.examples.map((example, idx) => (
            <div
              key={example.id || idx}
              className="example-card"
              style={{
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                padding: '14px 16px',
                marginTop: 0,
              }}
            >
              <div className="example-header">
                <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>Ví dụ {idx + 1}</span>
                {example.explanation && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {example.explanation}
                  </span>
                )}
              </div>

              {example.inputData && (
                <div className="io-block">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div className="io-label">INPUT</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyInput(example.inputData, idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedIdx === idx ? 'var(--status-success-text)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '2px 4px',
                        }}
                        title="Sao chép input vào clipboard"
                      >
                        {copiedIdx === idx ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedIdx === idx ? 'Đã chép' : 'Copy'}</span>
                      </button>

                      {onApplyInput && (
                        <button
                          type="button"
                          onClick={() => onApplyInput(example.inputData)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--pastel-mint-text)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            padding: '2px 4px',
                          }}
                          title="Nạp dữ liệu vào tab Input của Terminal"
                        >
                          <CornerDownRight size={12} />
                          <span>Dùng Input</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <pre
                    className="io-content"
                    style={{
                      maxHeight: '120px',
                      overflowX: 'auto',
                      overflowY: 'auto',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    {example.inputData}
                  </pre>
                </div>
              )}

              <div className="io-block">
                <div className="io-label">OUTPUT MONG ĐỢI</div>
                <pre
                  className="io-content"
                  style={{
                    color: 'var(--status-success-text)',
                    fontWeight: 600,
                    maxHeight: '120px',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {example.expectedOutput}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hints Section */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <button
          type="button"
          onClick={() => setHintsOpen((prev) => !prev)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.86rem',
            transition: 'background-color 150ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={16} style={{ color: 'var(--status-warning)' }} />
            <span>Gợi ý hướng dẫn bài tập</span>
          </div>
          {hintsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {hintsOpen && (
          <div
            style={{
              padding: '0 16px 14px',
              fontSize: '0.83rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '12px',
            }}
          >
            {exercise.hints && exercise.hints.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exercise.hints.map((hint, idx) => (
                  <p key={idx} style={{ margin: 0 }}>
                    {idx + 1}. {hint}
                  </p>
                ))}
              </div>
            ) : (
              <>
                <p style={{ margin: 0 }}>
                  1. Đọc kỹ kiểu dữ liệu đầu vào. Với các bài tính toán hoặc số học, hãy nhớ ép kiểu bằng <code>int()</code> hoặc <code>float()</code>.
                </p>
                <p style={{ margin: '6px 0 0 0' }}>
                  2. Đảm bảo định dạng xuất chuỗi khớp chính xác từng ký tự và khoảng trắng theo mẫu Output mong đợi.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
