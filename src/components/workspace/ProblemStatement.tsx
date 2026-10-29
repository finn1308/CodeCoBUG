'use client';

import React, { useState } from 'react';
import { Exercise } from '@/lib/types/curriculum';
import { FileText, AlertCircle, Award, Copy, Check, ChevronDown, ChevronUp, Lightbulb, CornerDownRight } from 'lucide-react';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className={`badge badge-${exercise.difficulty}`}>
            {exercise.difficulty.replace('_', ' ')}
          </span>
          <span
            className="badge"
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              color: 'var(--accent-light)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
            }}
          >
            <Award size={12} />
            {exercise.points} Điểm
          </span>
          {topicTitle && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • {topicTitle}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {exercise.title}
        </h1>
      </div>

      {/* Description */}
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          lineHeight: 1.7,
          background: 'var(--bg-tertiary)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 600 }}>
          <FileText size={16} style={{ color: 'var(--accent-light)' }} />
          <span>Mô tả bài toán</span>
        </div>
        <p style={{ whiteSpace: 'pre-line' }}>{exercise.description}</p>
      </div>

      {/* Constraints & Requirements */}
      {exercise.completionCriteria && (
        <div
          style={{
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-light)', fontWeight: 600, marginBottom: '6px' }}>
            <AlertCircle size={15} />
            <span>Yêu cầu & Điều kiện hoàn thành</span>
          </div>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>
              Vượt qua <strong>toàn bộ test case</strong> (gồm test công khai và test ẩn).
            </li>
            {exercise.completionCriteria.forbiddenTokens && exercise.completionCriteria.forbiddenTokens.length > 0 && (
              <li style={{ color: 'var(--accent-rose)' }}>
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
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Ví dụ minh họa ({exercise.examples.length} ví dụ)
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Chương trình của bạn phải xử lý chính xác các trường hợp cơ bản và trường hợp biên sau:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {exercise.examples.map((example, idx) => (
            <div key={example.id || idx} className="example-card">
              <div className="example-header">
                <span>Ví dụ {idx + 1}</span>
                {example.explanation && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {example.explanation}
                  </span>
                )}
              </div>

              {example.inputData && (
                <div className="io-block">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <div className="io-label">INPUT</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyInput(example.inputData, idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedIdx === idx ? '#34d399' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.7rem',
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
                            color: 'var(--accent-light)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '0.7rem',
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
                <pre className="io-content" style={{ color: '#34d399' }}>
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
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
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
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={16} style={{ color: 'var(--accent-amber)' }} />
            <span>Gợi ý hướng dẫn bài tập</span>
          </div>
          {hintsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {hintsOpen && (
          <div style={{ padding: '0 16px 14px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <p>1. Đọc kỹ kiểu dữ liệu đầu vào. Với các bài tính toán hoặc số học, hãy nhớ ép kiểu bằng <code>int()</code> hoặc <code>float()</code>.</p>
            <p style={{ marginTop: '6px' }}>2. Đảm bảo định dạng xuất chuỗi khớp chính xác từng ký tự và khoảng trắng theo mẫu Output mong đợi.</p>
          </div>
        )}
      </div>
    </div>
  );
};
