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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Pane Header & Tabs */}
      <div className="pane-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: '0.78rem',
              color: activeTab === 'console' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeTab === 'console' ? 'var(--bg-elevated)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={() => setActiveTab('console')}
          >
            <TerminalIcon size={14} style={{ color: 'var(--terminal-prompt)' }} />
            <span>Terminal</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: '0.78rem',
              color: activeTab === 'tests' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeTab === 'tests' ? 'var(--bg-elevated)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={() => setActiveTab('tests')}
          >
            <CheckCircle2 size={14} style={{ color: '#34d399' }} />
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
              color: activeTab === 'stdin' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeTab === 'stdin' ? 'var(--bg-elevated)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={() => setActiveTab('stdin')}
          >
            <Keyboard size={14} style={{ color: 'var(--accent-amber)' }} />
            <span>Dữ liệu vào (Input)</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 10px',
              fontSize: '0.78rem',
              color: activeTab === 'history' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeTab === 'history' ? 'var(--bg-elevated)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
            }}
            onClick={() => setActiveTab('history')}
            title="Lịch sử các lần nộp bài được lưu trữ trên tài khoản"
          >
            <History size={14} style={{ color: 'var(--accent-purple)' }} />
            <span>Lịch sử ({pastSubmissions.length})</span>
          </button>
        </div>

        {/* Right Info: Pyodide Wasm Runtime Status & Execution Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {pyodideStatus && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                color: pyodideStatus.isReady ? '#34d399' : pyodideStatus.isLoading ? 'var(--accent-light)' : 'var(--text-muted)',
                background: 'rgba(0,0,0,0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
              title={pyodideStatus.message}
            >
              <Cpu size={12} />
              <span>{pyodideStatus.isReady ? 'Python Wasm Ready' : pyodideStatus.isLoading ? 'Loading Python...' : 'Python Idle'}</span>
            </div>
          )}

          {executionTimeMs !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Clock size={12} />
              <span>{executionTimeMs} ms</span>
            </div>
          )}

          {activeTab === 'console' && onClearLogs && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
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
              style={{ padding: '3px 6px', fontSize: '0.72rem' }}
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
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* TAB 1: CONSOLE */}
        {activeTab === 'console' && (
          <div className="terminal-output">
            {isRunning && (
              <div className="terminal-line terminal-line-system" style={{ color: 'var(--accent-light)', marginBottom: '8px' }}>
                ⏳ Đang thực thi mã nguồn Python trên Pyodide WebAssembly...
              </div>
            )}

            {logs.length === 0 && !isRunning ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '16px 0' }}>
                $ python main.py
                <div style={{ marginTop: '8px', fontStyle: 'italic', color: '#475569' }}>
                  (Nhấn &quot;Run Code&quot; để thực thi Python ngay trong trình duyệt. Nhấn &quot;Nộp bài&quot; để chấm điểm).
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
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
            {isSubmitting && (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--accent-light)' }}>
                <Clock size={28} style={{ margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
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
                  Chạy thử bằng nút &quot;Run Code&quot; không chấm điểm. Hãy nhấn nút &quot;Nộp bài&quot; để kích hoạt Judge Engine đánh giá toàn diện.
                </p>
              </div>
            )}

            {!isSubmitting && submissionReport && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Overall Verdict Banner */}
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background:
                      verdict === 'accepted'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${
                      verdict === 'accepted'
                        ? 'rgba(16, 185, 129, 0.35)'
                        : 'rgba(239, 68, 68, 0.35)'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {verdict === 'accepted' ? (
                      <CheckCircle2 size={24} style={{ color: '#34d399' }} />
                    ) : (
                      <XCircle size={24} style={{ color: '#fb7185' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: verdict === 'accepted' ? '#34d399' : '#fb7185' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-light)' }}>
                      <Award size={15} />
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
                        background: 'var(--bg-tertiary)',
                        border: `1px solid ${
                          test.isPassed
                            ? 'rgba(16, 185, 129, 0.25)'
                            : 'rgba(239, 68, 68, 0.25)'
                        }`,
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                      }}
                    >
                      {/* Test Item Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {test.isPassed ? (
                            <CheckCircle2 size={16} style={{ color: '#34d399' }} />
                          ) : (
                            <XCircle size={16} style={{ color: '#fb7185' }} />
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
                                background: 'rgba(255,255,255,0.06)',
                                padding: '1px 5px',
                                borderRadius: '4px',
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
                              background: test.isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: test.isPassed ? '#34d399' : '#fb7185',
                              fontSize: '0.72rem',
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
                              <code style={{ background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}>
                                {test.inputData.replace(/\n/g, ' ↵ ')}
                              </code>
                            </div>
                          )}

                          <div>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Kết quả mong đợi: </span>
                            <code style={{ background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                              {test.expectedOutput}
                            </code>
                          </div>

                          <div>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Kết quả thực tế: </span>
                            <code style={{ background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px', color: test.isPassed ? '#34d399' : '#fb7185', fontFamily: 'var(--font-mono)' }}>
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
                        <div style={{ marginTop: '8px', fontSize: '0.76rem', color: '#fb7185', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
          <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
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
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
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
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
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
                        background: 'var(--bg-tertiary)',
                        border: `1px solid ${isAccepted ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isAccepted ? (
                            <CheckCircle2 size={16} style={{ color: '#34d399' }} />
                          ) : (
                            <XCircle size={16} style={{ color: '#fb7185' }} />
                          )}
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: isAccepted ? '#34d399' : '#fb7185' }}>
                            {isAccepted ? 'Accepted' : sub.verdict.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            #{pastSubmissions.length - idx} • {dateStr}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--accent-light)' }}>
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
                            style={{ padding: '2px 8px', fontSize: '0.72rem', color: 'var(--accent-light)' }}
                            onClick={() => setExpandedSubmissionId(isExpanded ? null : sub.id)}
                          >
                            {isExpanded ? 'Ẩn code' : 'Xem code'}
                          </button>
                          {onRestoreSubmissionCode && (
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '2px 8px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}
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
                              borderRadius: 'var(--radius-sm)',
                              padding: '10px',
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
