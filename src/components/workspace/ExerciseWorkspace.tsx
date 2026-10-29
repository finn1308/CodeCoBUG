'use client';

import React, { useState, useEffect } from 'react';
import { Exercise } from '@/lib/types/curriculum';
import { OutputLog } from '@/lib/types/runtime';
import { SubmissionEvaluationReport } from '@/lib/judge/runner';
import { AppShell } from '@/components/layout';
import { ProblemStatement } from './ProblemStatement';
import { CodeEditor } from './CodeEditor';
import { TerminalOutput } from './TerminalOutput';
import { AISettingsModal } from '@/components/settings/AISettingsModal';
import { usePyodide } from '@/hooks/usePyodide';
import { authManager, SavedSubmissionRecord } from '@/lib/auth/authManager';
import { AIGeneratedExercise } from '@/lib/ai/tutorService';
import {
  FileText,
  Code2,
  Terminal as TerminalIcon,
  Bot,
  Sparkles,
  X,
  Send,
  Key,
  Lightbulb,
  AlertTriangle,
  Loader2,
  HelpCircle,
} from 'lucide-react';

interface ExerciseWorkspaceProps {
  exercise: Exercise;
  topicTitle?: string;
}

export const ExerciseWorkspace: React.FC<ExerciseWorkspaceProps> = ({
  exercise,
  topicTitle,
}) => {
  const [code, setCode] = useState(exercise.starterCode || '');
  const [customStdin, setCustomStdin] = useState(
    exercise.examples[0]?.inputData || ''
  );
  const [logs, setLogs] = useState<OutputLog[]>([]);
  const [submissionReport, setSubmissionReport] = useState<SubmissionEvaluationReport | null>(null);
  const [pastSubmissions, setPastSubmissions] = useState<SavedSubmissionRecord[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | undefined>(undefined);
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor' | 'terminal'>('editor');
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [aiResponses, setAiResponses] = useState<{
    id: string;
    role: 'user' | 'assistant';
    text: string;
    generatedExercise?: AIGeneratedExercise;
  }[]>([]);

  // Pyodide WebAssembly Hook
  const { isReady, isLoading, statusMessage, runPython } = usePyodide();

  // Load and subscribe to persistent code draft and submission history for active user
  useEffect(() => {
    const refreshSubmissions = () => {
      const history = authManager.getSubmissionsForExercise(exercise.slug);
      setPastSubmissions(history);
    };

    const savedDraft = authManager.getDraft(exercise.slug);
    if (savedDraft !== null) {
      setCode(savedDraft);
    } else {
      setCode(exercise.starterCode || '');
    }
    refreshSubmissions();

    const unsub = authManager.subscribe(() => {
      const userDraft = authManager.getDraft(exercise.slug);
      if (userDraft !== null) {
        setCode(userDraft);
      } else {
        setCode(exercise.starterCode || '');
      }
      refreshSubmissions();
    });

    return () => unsub();
  }, [exercise.slug, exercise.starterCode]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    authManager.saveDraft(exercise.slug, newCode);
  };

  // Apply input from example card into Terminal Stdin
  const handleApplyInput = (inputData: string) => {
    setCustomStdin(inputData);
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-stdin-applied`,
        type: 'system',
        content: `Đã nạp dữ liệu ví dụ vào tab "Dữ liệu vào (Input)".`,
        timestamp: Date.now(),
      },
    ]);
  };

  // Run Code Action: ONLY executes on Pyodide client without affecting exercise completion!
  const handleRun = async () => {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);

    // Initial terminal command
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-start`,
        type: 'system',
        content: `$ python main.py`,
        timestamp: Date.now(),
      },
    ]);

    try {
      const result = await runPython(code, customStdin, (type, text) => {
        setLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}-${Math.random()}`,
            type: type === 'stderr' ? 'stderr' : 'stdout',
            content: text,
            timestamp: Date.now(),
          },
        ]);
      });

      setExecutionTimeMs(result.executionTimeMs);

      if (result.status === 'completed') {
        setLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}-done`,
            type: 'system',
            content: `\n[Tiến trình hoàn thành trong ${result.executionTimeMs}ms]`,
            timestamp: Date.now(),
          },
        ]);
      } else if (result.status === 'error') {
        setLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}-err`,
            type: 'stderr',
            content: result.cleanTraceback || result.errorMessage || 'Lỗi thực thi không xác định.',
            timestamp: Date.now(),
          },
          {
            id: `log-${Date.now()}-err-exit`,
            type: 'system',
            content: `\n[Tiến trình kết thúc với lỗi: ${result.errorCategory} (${result.executionTimeMs}ms)]`,
            timestamp: Date.now(),
          },
        ]);
      } else if (result.status === 'timeout') {
        setLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}-timeout`,
            type: 'stderr',
            content: result.cleanTraceback || 'TimeLimitExceeded: Thực thi bị hủy do chạy quá thời gian (5000ms).',
            timestamp: Date.now(),
          },
          {
            id: `log-${Date.now()}-timeout-exit`,
            type: 'system',
            content: `\n[Tiến trình bị ngắt bởi Watchdog: Time Limit Exceeded]`,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}-fatal`,
          type: 'stderr',
          content: `Lỗi hệ thống: ${err instanceof Error ? err.message : String(err)}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsRunning(false);
    }

    setMobileTab('terminal');
  };

  // Submit Code Action: Deterministic Judge Engine grading against public & hidden tests
  const handleSubmit = async () => {
    if (isSubmitting || isRunning) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/judge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseSlug: exercise.slug,
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const report: SubmissionEvaluationReport = await response.json();
      setSubmissionReport(report);
      setExecutionTimeMs(report.totalExecutionTimeMs);

      // Persist submission record under the authenticated user
      try {
        await authManager.saveSubmission({
          exerciseSlug: exercise.slug,
          submittedCode: code,
          verdict: report.verdict,
          score: report.score,
          totalPoints: report.totalPoints,
          passedTestsCount: report.passedTestsCount,
          totalTestsCount: report.totalTestsCount,
          executionTimeMs: report.totalExecutionTimeMs,
        });
        const history = authManager.getSubmissionsForExercise(exercise.slug);
        setPastSubmissions(history);
      } catch (persistErr) {
        console.warn('Could not persist submission:', persistErr);
      }
    } catch (err) {
      console.error('[Submit Error]', err);
      setLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}-submit-err`,
          type: 'stderr',
          content: `Lỗi kết nối Judge Engine: ${err instanceof Error ? err.message : String(err)}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }

    setMobileTab('terminal');
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Helper to read stored AI settings
  const getStoredAISettings = () => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('codecobug_ai_settings');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  // Dispatch real AI Request to /api/ai/chat
  const executeAIRequest = async (
    action: 'explain_error' | 'get_hint' | 'analyze_weakness' | 'generate_exercise' | 'chat',
    userQuery?: string,
    selectedHintLevel?: 1 | 2 | 3
  ) => {
    if (isAILoading) return;
    const aiConfig = getStoredAISettings();

    if (!aiConfig || !aiConfig.apiKey) {
      setIsSettingsOpen(true);
      setAiResponses((prev) => [
        ...prev,
        {
          id: `warn-${Date.now()}`,
          role: 'assistant',
          text: 'Chưa cấu hình API Key. Đã mở hộp thoại Cài đặt AI để bạn nhập khóa cá nhân (Gemini, OpenAI hoặc Anthropic) theo chuẩn BYOK.',
        },
      ]);
      return;
    }

    // Extract real terminal error or judge feedback
    const latestStderrLog = [...logs].reverse().find((l) => l.type === 'stderr')?.content;
    const firstFailedTest = submissionReport?.testResults?.find((t) => !t.isPassed);

    const submissionPayload = {
      submittedCode: code,
      verdict: submissionReport?.verdict,
      score: submissionReport?.score,
      totalPoints: submissionReport?.totalPoints,
      cleanTraceback: latestStderrLog,
      errorMessage: firstFailedTest?.errorMessage,
      failedTestInfo: firstFailedTest
        ? {
            orderIndex: firstFailedTest.orderIndex,
            inputData: firstFailedTest.isHidden ? undefined : firstFailedTest.inputData,
            expectedOutput: firstFailedTest.isHidden ? undefined : firstFailedTest.expectedOutput,
            actualOutput: firstFailedTest.isHidden ? undefined : firstFailedTest.actualOutput,
            errorMessage: firstFailedTest.errorMessage,
          }
        : undefined,
    };

    const userMessageText =
      userQuery ||
      (action === 'explain_error'
        ? 'Giải thích lỗi mã nguồn hiện tại'
        : action === 'get_hint'
        ? `Yêu cầu gợi ý (Mức ${selectedHintLevel || hintLevel})`
        : action === 'analyze_weakness'
        ? 'Phân tích điểm yếu thường gặp'
        : action === 'generate_exercise'
        ? 'Tạo bài tập tự luyện tương tự'
        : aiPrompt);

    if (userQuery || aiPrompt || action !== 'chat') {
      setAiResponses((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: 'user', text: userMessageText },
      ]);
    }

    setAiPrompt('');
    setIsAILoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: aiConfig,
          action,
          exerciseContext: {
            title: exercise.title,
            slug: exercise.slug,
            difficulty: exercise.difficulty,
            description: exercise.description,
            constraints: exercise.completionCriteria?.forbiddenTokens,
            starterCode: exercise.starterCode,
          },
          submissionData: submissionPayload,
          userPrompt: userQuery || aiPrompt,
          hintLevel: selectedHintLevel || hintLevel,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setAiResponses((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            text: data.text,
            generatedExercise: data.generatedExercise,
          },
        ]);
        if (action === 'get_hint') {
          setHintLevel((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 1));
        }
      } else {
        setAiResponses((prev) => [
          ...prev,
          {
            id: `assistant-err-${Date.now()}`,
            role: 'assistant',
            text: `⚠️ ${data?.error || 'Không thể tạo phản hồi từ nhà cung cấp AI.'}`,
          },
        ]);
      }
    } catch (err: unknown) {
      setAiResponses((prev) => [
        ...prev,
        {
          id: `assistant-fatal-${Date.now()}`,
          role: 'assistant',
          text: `⚠️ Lỗi kết nối máy chủ AI: ${err instanceof Error ? err.message : String(err)}`,
        },
      ]);
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <AppShell
      defaultCollapsed={true}
      headerProps={{
        exerciseTitle: exercise.title,
        topicTitle: topicTitle,
        isRunning: isRunning || isSubmitting,
        onRun: handleRun,
        onSubmit: handleSubmit,
        onToggleAITutor: () => setIsAITutorOpen((prev) => !prev),
        isAITutorOpen: isAITutorOpen,
      }}
    >
      {/* Mobile Tab Switcher (< 1024px) */}
      <div className="mobile-tab-bar">
        <button
          type="button"
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '0.82rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: mobileTab === 'problem' ? 'var(--pastel-mint)' : 'transparent',
            color: mobileTab === 'problem' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
            border: mobileTab === 'problem' ? '1px solid var(--pastel-mint-active)' : '1px solid transparent',
            fontWeight: mobileTab === 'problem' ? 700 : 500,
          }}
          onClick={() => setMobileTab('problem')}
        >
          <FileText size={14} />
          <span>Đề bài</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '0.82rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: mobileTab === 'editor' ? 'var(--pastel-mint)' : 'transparent',
            color: mobileTab === 'editor' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
            border: mobileTab === 'editor' ? '1px solid var(--pastel-mint-active)' : '1px solid transparent',
            fontWeight: mobileTab === 'editor' ? 700 : 500,
          }}
          onClick={() => setMobileTab('editor')}
        >
          <Code2 size={14} />
          <span>Editor</span>
        </button>

        <button
          type="button"
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '0.82rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: mobileTab === 'terminal' ? 'var(--pastel-mint)' : 'transparent',
            color: mobileTab === 'terminal' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
            border: mobileTab === 'terminal' ? '1px solid var(--pastel-mint-active)' : '1px solid transparent',
            fontWeight: mobileTab === 'terminal' ? 700 : 500,
          }}
          onClick={() => setMobileTab('terminal')}
        >
          <TerminalIcon size={14} />
          <span>Terminal / Kết quả</span>
        </button>
      </div>

      {/* Workspace Body */}
      <div className="workspace-container">
        {/* Left Pane: Problem Statement */}
        <div
          className={`workspace-left-pane ${mobileTab === 'problem' ? 'mobile-visible' : 'mobile-hidden'}`}
        >
          <ProblemStatement
            exercise={exercise}
            topicTitle={topicTitle}
            onApplyInput={handleApplyInput}
          />
        </div>

        {/* Right Pane: Code Editor + Terminal Output */}
        <div
          className={`workspace-right-pane ${mobileTab !== 'problem' ? 'mobile-visible' : 'mobile-hidden'}`}
        >
          {/* Editor Container */}
          <div
            className={`editor-wrapper ${mobileTab === 'editor' ? 'mobile-visible' : 'mobile-hidden'}`}
          >
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              starterCode={exercise.starterCode}
              disabled={isRunning || isSubmitting}
            />
          </div>

          {/* Terminal Output Container */}
          <div
            className={`terminal-wrapper ${mobileTab === 'terminal' ? 'mobile-visible' : 'mobile-hidden'}`}
          >
            <TerminalOutput
              logs={logs}
              onClearLogs={handleClearLogs}
              submissionReport={submissionReport}
              customStdin={customStdin}
              onStdinChange={setCustomStdin}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              executionTimeMs={executionTimeMs}
              pastSubmissions={pastSubmissions}
              onRestoreSubmissionCode={(restoredCode) => {
                handleCodeChange(restoredCode);
                setLogs((prev) => [
                  ...prev,
                  {
                    id: `log-${Date.now()}-restore`,
                    type: 'system',
                    content: `Đã khôi phục mã nguồn từ bản nộp bài vào Editor.`,
                    timestamp: Date.now(),
                  },
                ]);
              }}
              pyodideStatus={{
                isReady,
                isLoading,
                message: statusMessage,
              }}
            />
          </div>
        </div>

        {/* AI Tutor Slide Drawer */}
        {isAITutorOpen && (
          <aside
            style={{
              width: '380px',
              borderLeft: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-modal)',
              zIndex: 40,
            }}
          >
            <div className="pane-header">
              <div className="pane-title">
                <Bot size={16} style={{ color: 'var(--pastel-lavender-text)' }} />
                <span>AI Tutor Studio</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: '4px', borderRadius: 'var(--radius-full)' }}
                onClick={() => setIsAITutorOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Architecture Intro */}
              <div
                style={{
                  backgroundColor: 'var(--pastel-lavender-light)',
                  border: '1px solid var(--pastel-lavender)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--pastel-lavender-text)', fontWeight: 700, marginBottom: '4px' }}>
                  <Sparkles size={14} />
                  <span>AI Gia sư Sư phạm (BYOK)</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.78rem' }}>
                  Tôn trọng kết quả Judge Engine, phân tích lỗi thực tế và gợi ý nâng bậc (không giải hộ bài).
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '8px', fontSize: '0.78rem', padding: '6px', borderRadius: 'var(--radius-md)' }}
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Key size={13} style={{ color: 'var(--pastel-lavender-text)' }} />
                  <span>Cài đặt / Kiểm tra API Key</span>
                </button>
              </div>

              {/* Four Pedagogical Quick Action Buttons */}
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '8px' }}>
                  Hành động sư phạm:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={isAILoading}
                    onClick={() => executeAIRequest('explain_error')}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 10px',
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'flex-start',
                      cursor: isAILoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <AlertTriangle size={14} style={{ color: 'var(--status-error)' }} />
                    <span>Giải thích lỗi này</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAILoading}
                    onClick={() => executeAIRequest('get_hint')}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 10px',
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'flex-start',
                      cursor: isAILoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Lightbulb size={14} style={{ color: 'var(--status-warning)' }} />
                    <span>Gợi ý (Mức {hintLevel})</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAILoading}
                    onClick={() => executeAIRequest('analyze_weakness')}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 10px',
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'flex-start',
                      cursor: isAILoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <HelpCircle size={14} style={{ color: 'var(--status-info)' }} />
                    <span>Phân tích điểm yếu</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAILoading}
                    onClick={() => executeAIRequest('generate_exercise')}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 10px',
                      fontSize: '0.76rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'flex-start',
                      cursor: isAILoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Sparkles size={14} style={{ color: 'var(--pastel-lavender-text)' }} />
                    <span>Tạo bài tương tự</span>
                  </button>
                </div>
              </div>

              {/* Chat Thread */}
              {aiResponses.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                  {aiResponses.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        lineHeight: 1.5,
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '92%',
                        background: msg.role === 'user' ? 'var(--bg-elevated)' : 'rgba(168, 85, 247, 0.1)',
                        border: `1px solid ${msg.role === 'user' ? 'var(--border-medium)' : 'rgba(168, 85, 247, 0.25)'}`,
                        color: msg.role === 'user' ? 'var(--text-primary)' : 'var(--text-primary)',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.text}

                      {/* AI Generated Exercise Card with Unverified Status Badge */}
                      {msg.generatedExercise && (
                        <div
                          style={{
                            marginTop: '10px',
                            padding: '10px',
                            background: 'var(--bg-primary)',
                            border: '1px solid rgba(251, 191, 36, 0.4)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.82rem' }}>
                              {msg.generatedExercise.title}
                            </span>
                            <span
                              style={{
                                background: 'rgba(251, 191, 36, 0.15)',
                                color: '#fbbf24',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                              }}
                            >
                              Chưa kiểm chứng (Unverified)
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                            {msg.generatedExercise.description}
                          </div>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            style={{
                              alignSelf: 'flex-start',
                              padding: '3px 8px',
                              fontSize: '0.72rem',
                              color: 'var(--accent-light)',
                            }}
                            onClick={() => {
                              const gen = msg.generatedExercise;
                              if (!gen) return;
                              handleCodeChange(gen.starterCode);
                              setLogs((prev) => [
                                ...prev,
                                {
                                  id: `log-${Date.now()}-ai-ex`,
                                  type: 'system',
                                  content: `Đã nạp bài tập tự luyện [${gen.title}] vào trình soạn thảo. (Lưu ý: Nút "Nộp bài" chấm theo yêu cầu bài học chính thức).`,
                                  timestamp: Date.now(),
                                },
                              ]);
                            }}
                          >
                            <span>Thử bài tập này trên Editor</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Loading Indicator */}
              {isAILoading && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--accent-purple)',
                    fontSize: '0.78rem',
                    padding: '8px 12px',
                    background: 'rgba(168, 85, 247, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>AI Gia sư đang phân tích mã nguồn và ngữ cảnh...</span>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div style={{ padding: '14px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={aiPrompt}
                disabled={isAILoading}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') executeAIRequest('chat');
                }}
                placeholder="Hỏi AI Gia sư về bài tập này..."
                className="form-input"
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  fontSize: '0.84rem',
                }}
              />
              <button
                type="button"
                className="btn btn-mint"
                disabled={isAILoading}
                style={{ padding: '9px 16px' }}
                onClick={() => executeAIRequest('chat')}
              >
                {isAILoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </AppShell>
  );
};
