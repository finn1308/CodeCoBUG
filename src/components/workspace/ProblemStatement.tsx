'use client';

import React, { useState } from 'react';
import { Exercise } from '@/lib/types/curriculum';
import { FileText, AlertCircle, Award, Copy, Check, ChevronDown, ChevronUp, Lightbulb, CornerDownRight } from 'lucide-react';
import { Badge } from '@/components/ui';

interface ProblemStatementProps {
  exercise: Exercise;
  topicTitle?: string;
  onApplyInput?: (input: string) => void;
}

export const ProblemStatement: React.FC<ProblemStatementProps> = ({
  exercise,
  topicTitle,
  onApplyInput,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);

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
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {exercise.title}
        </h1>
      </div>

      {/* Description */}
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          lineHeight: 1.7,
          backgroundColor: 'var(--bg-tertiary)',
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 700 }}>
          <FileText size={16} style={{ color: 'var(--pastel-sky-text)' }} />
          <span>Mô tả bài toán</span>
        </div>
        <p style={{ whiteSpace: 'pre-line' }}>{exercise.description}</p>
      </div>

      {/* Constraints & Requirements */}
      {exercise.completionCriteria && (
        <div
          style={{
            backgroundColor: 'var(--pastel-sky-light)',
            border: '1px solid var(--pastel-sky)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 18px',
            fontSize: '0.86rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pastel-sky-text)', fontWeight: 700, marginBottom: '8px' }}>
            <AlertCircle size={16} />
            <span>Yêu cầu & Điều kiện hoàn thành</span>
          </div>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

      {/* 3 Example Scenarios */}
      <div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Ví dụ minh họa ({exercise.examples.length} ví dụ)
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Chương trình của bạn phải xử lý chính xác các trường hợp cơ bản và trường hợp biên sau:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {exercise.examples.map((example, idx) => (
            <div key={example.id || idx} className="example-card">
              <div className="example-header">
                <span style={{ fontWeight: 700 }}>Ví dụ {idx + 1}</span>
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
                          }}
                          title="Nạp dữ liệu vào tab Input của Terminal"
                        >
                          <CornerDownRight size={12} />
                          <span>Dùng Input</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <pre className="io-content">{example.inputData}</pre>
                </div>
              )}

              <div className="io-block">
                <div className="io-label">OUTPUT MONG ĐỢI</div>
                <pre className="io-content" style={{ color: 'var(--status-success-text)', fontWeight: 600 }}>
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
            padding: '14px 18px',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.88rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={16} style={{ color: 'var(--status-warning)' }} />
            <span>Gợi ý hướng dẫn bài tập</span>
          </div>
          {hintsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {hintsOpen && (
          <div style={{ padding: '0 18px 16px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <p>1. Đọc kỹ kiểu dữ liệu đầu vào. Với các bài tính toán hoặc số học, hãy nhớ ép kiểu bằng <code>int()</code> hoặc <code>float()</code>.</p>
            <p style={{ marginTop: '6px' }}>2. Đảm bảo định dạng xuất chuỗi khớp chính xác từng ký tự và khoảng trắng theo mẫu Output mong đợi.</p>
          </div>
        )}
      </div>
    </div>
  );
};
