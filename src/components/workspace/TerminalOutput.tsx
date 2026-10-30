'use client';

import React, { useState } from 'react';
import {
  Terminal as TerminalIcon,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Keyboard,
  Cpu,
  Lock,
  AlertTriangle,
  Award,
  History,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { OutputLog } from '@/lib/types/runtime';
import { EvaluatedTestResult, SubmissionEvaluationReport } from '@/lib/judge/runner';
import { SavedSubmissionRecord } from '@/lib/auth/authManager';

export interface TerminalOutputProps {
  logs: OutputLog[];
  onClearLogs?: () => void;
  submissionReport?: SubmissionEvaluationReport | null;
  customStdin: string;
  onStdinChange: (val: string) => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  executionTimeMs?: number;
  pastSubmissions?: SavedSubmissionRecord[];
  onRestoreSubmissionCode?: (code: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  pyodideStatus?: {
    isReady: boolean;
    isLoading: boolean;
    message: string;
  };
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  logs,
  onClearLogs,
  submissionReport = null,
  customStdin,
  onStdinChange,
  isRunning = false,
  isSubmitting = false,
  executionTimeMs,
  pastSubmissions = [],
  onRestoreSubmissionCode,
  isCollapsed = false,
  onToggleCollapse,
  pyodideStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'tests' | 'stdin' | 'history'>(
    submissionReport ? 'tests' : 'console'
  );
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

  // Sync tab when submission completes
  React.useEffect(() => {
    if (submissionReport) {
      setActiveTab('tests');
    }
  }, [submissionReport]);

  const testResults: EvaluatedTestResult[] = submissionReport?.testResults || [];
  const passedCount = submissionReport?.passedTestsCount ?? 0;
  const totalCount = submissionReport?.totalTestsCount ?? 0;
  const verdict = submissionReport?.verdict;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Pane Header & Tabs */}
      <div
        className="pane-header"
        style={{
          padding: '6px 12px',
          minHeight: '44px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-tertiary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: activeTab === 'console' ? 700 : 500,
              color: activeTab === 'console' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: activeTab === 'console' ? 'var(--bg-surface)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'console' ? '1px solid var(--border-subtle)' : '1px solid transparent',
              boxShadow: activeTab === 'console' ? 'var(--shadow-xs)' : 'none',
            }}
            onClick={() => setActiveTab('console')}
          >
            <TerminalIcon size={14} style={{ color: 'var(--pastel-sky-text)' }} />
            <span>Terminal</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: activeTab === 'tests' ? 700 : 500,
              color: activeTab === 'tests' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: activeTab === 'tests' ? 'var(--bg-surface)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'tests' ? '1px solid var(--border-subtle)' : '1px solid transparent',
              boxShadow: activeTab === 'tests' ? 'var(--shadow-xs)' : 'none',
            }}
            onClick={() => setActiveTab('tests')}
          >
            <CheckCircle2 size={14} style={{ color: 'var(--status-success-text)' }} />
            <span>
              Kết quả kiểm thử{' '}
              {submissionReport && `(${passedCount}/${totalCount})`}
            </span>
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: activeTab === 'stdin' ? 700 : 500,
              color: activeTab === 'stdin' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: activeTab === 'stdin' ? 'var(--bg-surface)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'stdin' ? '1px solid var(--border-subtle)' : '1px solid transparent',
              boxShadow: activeTab === 'stdin' ? 'var(--shadow-xs)' : 'none',
            }}
            onClick={() => setActiveTab('stdin')}
          >
            <Keyboard size={14} style={{ color: 'var(--status-warning-text)' }} />
            <span>Dữ liệu vào (Input)</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: activeTab === 'history' ? 700 : 500,
              color: activeTab === 'history' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: activeTab === 'history' ? 'var(--bg-surface)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'history' ? '1px solid var(--border-subtle)' : '1px solid transparent',
              boxShadow: activeTab === 'history' ? 'var(--shadow-xs)' : 'none',
            }}
            onClick={() => setActiveTab('history')}
            title="Lịch sử các lần nộp bài được lưu trữ trên tài khoản"
          >
            <History size={14} style={{ color: 'var(--pastel-lavender-text)' }} />
            <span>Lịch sử ({pastSubmissions.length})</span>
          </button>
        </div>

        {/* Right Info: Pyodide Wasm Runtime Status & Execution Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {pyodideStatus && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: pyodideStatus.isReady
                  ? 'var(--status-success-text)'
                  : pyodideStatus.isLoading
                  ? 'var(--pastel-sky-text)'
                  : 'var(--text-muted)',
                background: pyodideStatus.isReady
                  ? 'var(--pastel-mint-light)'
                  : 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
              title={pyodideStatus.message}
            >
              <Cpu size={12} />
              <span>{pyodideStatus.isReady ? 'Python Wasm Ready' : pyodideStatus.isLoading ? 'Loading Python...' : 'Python Idle'}</span>
            </div>
          )}

          {executionTimeMs !== undefined && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                padding: '2px 6px',
              }}
            >
              <Clock size={12} />
              <span>{executionTimeMs} ms</span>
            </div>
          )}

          {activeTab === 'console' && onClearLogs && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                padding: '3px 8px',
                fontSize: '0.72rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
              }}
              onClick={onClearLogs}
              title="Xóa màn hình Terminal"
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                padding: '3px 6px',
                fontSize: '0.72rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
              }}
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Mở rộng Terminal' : 'Thu gọn Terminal'}
              aria-label={isCollapsed ? 'Mở rộng Terminal' : 'Thu gọn Terminal'}
            >
              {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Pane Content */}
      {!isCollapsed && (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* TAB 1: CONSOLE */}
          {activeTab === 'console' && (
            <div className="terminal-output" style={{ overflowX: 'auto', minWidth: 0 }}>
              {isRunning && (
                <div className="terminal-line terminal-line-system" style={{ color: 'var(--pastel-sky-text)', marginBottom: '8px' }}>
                  ⏳ Đang thực thi mã nguồn Python trên Pyodide WebAssembly...
                </div>
              )}

              {logs.length === 0 && !isRunning ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '16px 0' }}>
                  $ python main.py
                  <div style={{ marginTop: '8px', fontStyle: 'italic', color: '#64748b' }}>
                    (Nhấn &quot;Chạy thử&quot; để thực thi Python ngay trong trình duyệt. Nhấn &quot;Nộp bài&quot; để chấm điểm).
                  </div>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`terminal-line terminal-line-${log.type}`}
                  >
                    {log.content}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: TEST RESULTS / JUDGE BREAKDOWN */}
          {activeTab === 'tests' && (
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: 'var(--bg-secondary)', minWidth: 0 }}>
              {isSubmitting && (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-primary)' }}>
                  <Clock size={28} style={{ margin: '0 auto 8px', animation: 'spin 1s linear infinite', color: 'var(--pastel-sky-text)' }} />
                  <p style={{ fontWeight: 600 }}>Hệ thống Judge Engine đang chấm bài...</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Đang chạy bài làm qua từng bộ test công khai và test ẩn...
                  </p>
                </div>
              )}

              {!isSubmitting && !submissionReport && (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                  <p style={{ fontWeight: 600 }}>Chưa có phiên chấm bài nào.</p>
                  <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                    Chạy thử bằng nút &quot;Chạy thử&quot; không chấm điểm. Hãy nhấn nút &quot;Nộp bài&quot; để kích hoạt Judge Engine đánh giá toàn diện.
                  </p>
                </div>
              )}

              {!isSubmitting && submissionReport && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Overall Verdict Banner */}
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background:
                        verdict === 'accepted'
                          ? 'var(--pastel-mint-light)'
                          : 'rgba(239, 68, 68, 0.10)',
                      border: `1px solid ${
                        verdict === 'accepted'
                          ? 'var(--pastel-mint-active)'
                          : 'rgba(239, 68, 68, 0.30)'
                      }`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {verdict === 'accepted' ? (
                        <CheckCircle2 size={24} style={{ color: 'var(--status-success-text)' }} />
                      ) : (
                        <XCircle size={24} style={{ color: 'var(--status-error-text)' }} />
                      )}
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '0.98rem',
                            color: verdict === 'accepted' ? 'var(--status-success-text)' : 'var(--status-error-text)',
                          }}
                        >
                          {verdict === 'accepted'
                            ? 'ACCEPTED (ĐẠT HOÀN THÀNH)'
                            : verdict === 'wrong_answer'
                            ? 'WRONG ANSWER (SAI KẾT QUẢ)'
                            : verdict === 'runtime_error'
                            ? 'RUNTIME ERROR (LỖI THỰC THI)'
                            : 'COMPILE ERROR (LỖI CÚ PHÁP)'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {submissionReport.verdictMessage}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        <Award size={15} style={{ color: 'var(--pastel-mint-text)' }} />
                        <span>{submissionReport.score}/{submissionReport.totalPoints} Điểm</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Vượt qua {passedCount}/{totalCount} tests
                      </div>
                    </div>
                  </div>

                  {/* Itemized Test Cases Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {testResults.map((test) => (
                      <div
                        key={test.testCaseId || test.orderIndex}
                        style={{
                          background: 'var(--bg-surface)',
                          border: `1px solid ${
                            test.isPassed
                              ? 'var(--pastel-mint-active)'
                              : 'rgba(239, 68, 68, 0.25)'
                          }`,
                          borderRadius: 'var(--radius-lg)',
                          padding: '12px 14px',
                          boxShadow: 'var(--shadow-xs)',
                        }}
                      >
                        {/* Test Item Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {test.isPassed ? (
                              <CheckCircle2 size={16} style={{ color: 'var(--status-success-text)' }} />
                            ) : (
                              <XCircle size={16} style={{ color: 'var(--status-error-text)' }} />
                            )}
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                              Test #{test.orderIndex} {test.isHidden ? '(Test ẩn)' : '(Công khai)'}
                            </span>
                            {test.isHidden && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontSize: '0.68rem',
                                  color: 'var(--text-muted)',
                                  background: 'var(--bg-tertiary)',
                                  padding: '1px 5px',
                                  borderRadius: 'var(--radius-sm)',
                                }}
                              >
                                <Lock size={10} />
                                <span>Ẩn</span>
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {test.executionTimeMs} ms
                            </span>
                            <span
                              className="badge"
                              style={{
                                background: test.isPassed ? 'var(--pastel-mint-light)' : 'rgba(239, 68, 68, 0.12)',
                                color: test.isPassed ? 'var(--status-success-text)' : 'var(--status-error-text)',
                                fontSize: '0.72rem',
                                borderRadius: 'var(--radius-md)',
                                padding: '2px 8px',
                              }}
                            >
                              {test.isPassed ? 'Đạt' : 'Chưa đạt'}
                            </span>
                          </div>
                        </div>

                        {/* Public Test Details (Input, Expected, Actual) */}
                        {!test.isHidden && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                            {test.inputData !== undefined && test.inputData.length > 0 && (
                              <div>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Input: </span>
                                <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', color: 'var(--pastel-sky-text)', fontFamily: 'var(--font-mono)' }}>
                                  {test.inputData.replace(/\n/g, ' ↵ ')}
                                </code>
                              </div>
                            )}

                            <div>
                              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Kết quả mong đợi: </span>
                              <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', color: 'var(--status-success-text)', fontFamily: 'var(--font-mono)' }}>
                                {test.expectedOutput}
                              </code>
                            </div>

                            <div>
                              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Kết quả thực tế: </span>
                              <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', color: test.isPassed ? 'var(--status-success-text)' : 'var(--status-error-text)', fontFamily: 'var(--font-mono)' }}>
                                {test.actualOutput || '(không có output)'}
                              </code>
                            </div>
                          </div>
                        )}

                        {/* Hidden Test Case Security Shield */}
                        {test.isHidden && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>
                            Dữ liệu đầu vào và kết quả mẫu của Test ẩn được bảo vệ trên hệ thống để đánh giá năng lực tư duy tổng quát.
                          </div>
                        )}

                        {/* Error Message */}
                        {test.errorMessage && !test.isPassed && (
                          <div style={{ marginTop: '8px', fontSize: '0.76rem', color: 'var(--status-error-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <AlertTriangle size={13} />
                            <span>{test.errorMessage}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM STDIN */}
          {activeTab === 'stdin' && (
            <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Dữ liệu đầu vào cho lệnh <code>input()</code> khi chạy thử (mỗi dòng tương ứng với 1 lần gọi <code>input()</code>):
              </div>
              <textarea
                value={customStdin}
                onChange={(e) => onStdinChange(e.target.value)}
                placeholder="Ví dụ:&#10;5&#10;10"
                style={{
                  flex: 1,
                  background: 'var(--terminal-bg)',
                  color: 'var(--terminal-text)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  resize: 'none',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* TAB 4: SUBMISSION HISTORY (PERSISTENCE EVIDENCE) */}
          {activeTab === 'history' && (
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: 'var(--bg-secondary)', minWidth: 0 }}>
              {pastSubmissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <History size={32} style={{ margin: '0 auto 10px', opacity: 0.35 }} />
                  <p style={{ fontWeight: 600 }}>Chưa có lịch sử nộp bài.</p>
                  <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                    Các lần nộp bài sẽ được tự động lưu trữ vào hồ sơ của bạn và tồn tại bền vững sau khi tải lại trang.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Lịch sử nộp bài ({pastSubmissions.length} lần nộp)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Dữ liệu được cô lập theo tài khoản người dùng
                    </span>
                  </div>

                  {pastSubmissions.map((sub, idx) => {
                    const isAccepted = sub.verdict === 'accepted';
                    const isExpanded = expandedSubmissionId === sub.id;
                    const dateStr = new Date(sub.submittedAt).toLocaleString('vi-VN');

                    return (
                      <div
                        key={sub.id}
                        style={{
                          background: 'var(--bg-surface)',
                          border: `1px solid ${isAccepted ? 'var(--pastel-mint-active)' : 'rgba(239, 68, 68, 0.25)'}`,
                          borderRadius: 'var(--radius-lg)',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          boxShadow: 'var(--shadow-xs)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isAccepted ? (
                              <CheckCircle2 size={16} style={{ color: 'var(--status-success-text)' }} />
                            ) : (
                              <XCircle size={16} style={{ color: 'var(--status-error-text)' }} />
                            )}
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: isAccepted ? 'var(--status-success-text)' : 'var(--status-error-text)' }}>
                              {isAccepted ? 'Accepted' : sub.verdict.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              #{pastSubmissions.length - idx} • {dateStr}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {sub.score}/{sub.totalPoints} pts
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {sub.passedTestsCount}/{sub.totalTestsCount} tests
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {sub.executionTimeMs}ms
                            </span>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '2px 8px', fontSize: '0.72rem', color: 'var(--pastel-sky-text)', borderRadius: 'var(--radius-sm)' }}
                              onClick={() => setExpandedSubmissionId(isExpanded ? null : sub.id)}
                            >
                              {isExpanded ? 'Ẩn code' : 'Xem code'}
                            </button>
                            {onRestoreSubmissionCode && (
                              <button
                                type="button"
                                className="btn btn-ghost"
                                style={{
                                  padding: '2px 8px',
                                  fontSize: '0.72rem',
                                  color: 'var(--text-secondary)',
                                  borderRadius: 'var(--radius-sm)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                onClick={() => onRestoreSubmissionCode(sub.submittedCode)}
                                title="Khôi phục lại đoạn mã này vào trình soạn thảo"
                              >
                                <RotateCcw size={12} />
                                <span>Nạp lại</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: '6px' }}>
                            <pre
                              style={{
                                background: 'var(--terminal-bg)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                padding: '10px 12px',
                                fontSize: '0.78rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--terminal-text)',
                                overflowX: 'auto',
                                maxHeight: '180px',
                                margin: 0,
                              }}
                            >
                              {sub.submittedCode}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
