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
import { AITutorPanel } from '@/components/ai';
import {
  FileText,
  Code2,
  Terminal as TerminalIcon,
  Play,
  CheckCircle2,
  Loader2,
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
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      {/* Mobile Tab Switcher (< 1024px) - Keeps Run easy to reach */}
      <div className="mobile-tab-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="btn"
            style={{
              padding: '6px 12px',
              fontSize: '0.80rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: mobileTab === 'problem' ? 'var(--pastel-mint)' : 'var(--bg-tertiary)',
              color: mobileTab === 'problem' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
              border: mobileTab === 'problem' ? '1px solid var(--pastel-mint-active)' : '1px solid var(--border-subtle)',
              fontWeight: mobileTab === 'problem' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
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
              padding: '6px 12px',
              fontSize: '0.80rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: mobileTab === 'editor' ? 'var(--pastel-mint)' : 'var(--bg-tertiary)',
              color: mobileTab === 'editor' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
              border: mobileTab === 'editor' ? '1px solid var(--pastel-mint-active)' : '1px solid var(--border-subtle)',
              fontWeight: mobileTab === 'editor' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
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
              padding: '6px 12px',
              fontSize: '0.80rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: mobileTab === 'terminal' ? 'var(--pastel-mint)' : 'var(--bg-tertiary)',
              color: mobileTab === 'terminal' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
              border: mobileTab === 'terminal' ? '1px solid var(--pastel-mint-active)' : '1px solid var(--border-subtle)',
              fontWeight: mobileTab === 'terminal' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
            onClick={() => setMobileTab('terminal')}
          >
            <TerminalIcon size={14} />
            <span>Terminal / Kết quả</span>
          </button>
        </div>

        {/* Quick mobile Run button: always reachable regardless of selected tab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="btn"
            disabled={isRunning || isSubmitting}
            onClick={handleRun}
            style={{
              padding: '6px 12px',
              fontSize: '0.80rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--pastel-sky)',
              color: 'var(--pastel-sky-text)',
              border: '1px solid var(--pastel-sky-text)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: isRunning || isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isRunning || isSubmitting ? 0.7 : 1,
            }}
            title="Chạy thử code nhanh trên mobile"
          >
            {isRunning ? (
              <Loader2 size={13} className="spin" />
            ) : (
              <Play size={13} fill="currentColor" />
            )}
            <span>{isRunning ? 'Đang chạy' : 'Chạy'}</span>
          </button>

          <button
            type="button"
            className="btn"
            disabled={isRunning || isSubmitting}
            onClick={handleSubmit}
            style={{
              padding: '6px 12px',
              fontSize: '0.80rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--pastel-mint)',
              color: 'var(--pastel-mint-text)',
              border: '1px solid var(--pastel-mint-active)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: isRunning || isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isRunning || isSubmitting ? 0.7 : 1,
            }}
            title="Nộp bài và chấm điểm ngay trên mobile"
          >
            {isSubmitting ? (
              <Loader2 size={13} className="spin" />
            ) : (
              <CheckCircle2 size={13} />
            )}
            <span>{isSubmitting ? 'Đang chấm' : 'Nộp'}</span>
          </button>
        </div>
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
            style={isTerminalCollapsed ? { flex: 1, minHeight: 0 } : undefined}
          >
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              starterCode={exercise.starterCode}
              disabled={isRunning || isSubmitting}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isTerminalCollapsed={isTerminalCollapsed}
              onToggleTerminal={() => setIsTerminalCollapsed((prev) => !prev)}
            />
          </div>

          {/* Terminal Output Container */}
          <div
            className={`terminal-wrapper ${mobileTab === 'terminal' ? 'mobile-visible' : 'mobile-hidden'}`}
            style={isTerminalCollapsed ? { flex: '0 0 44px', minHeight: '44px', maxHeight: '44px' } : undefined}
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
              isCollapsed={isTerminalCollapsed}
              onToggleCollapse={() => setIsTerminalCollapsed((prev) => !prev)}
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
          <>
            <div
              className="ai-drawer-backdrop"
              onClick={() => setIsAITutorOpen(false)}
            />
            <aside
              className="ai-drawer-panel"
              style={{
                width: '380px',
                maxWidth: '100vw',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-modal)',
                zIndex: 100,
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <AITutorPanel
                isDrawer={true}
              exerciseContext={{
                title: exercise.title,
                slug: exercise.slug,
                difficulty: exercise.difficulty,
                description: exercise.description,
                constraints: exercise.completionCriteria?.forbiddenTokens,
                starterCode: exercise.starterCode,
              }}
              submissionData={{
                submittedCode: code,
                verdict: submissionReport?.verdict,
                score: submissionReport?.score,
                totalPoints: submissionReport?.totalPoints,
                cleanTraceback: [...logs].reverse().find((l) => l.type === 'stderr')?.content,
                errorMessage: submissionReport?.testResults?.find((t) => !t.isPassed)?.errorMessage,
                failedTestInfo: (() => {
                  const firstFailed = submissionReport?.testResults?.find((t) => !t.isPassed);
                  return firstFailed
                    ? {
                        orderIndex: firstFailed.orderIndex,
                        inputData: firstFailed.isHidden ? undefined : firstFailed.inputData,
                        expectedOutput: firstFailed.isHidden ? undefined : firstFailed.expectedOutput,
                        actualOutput: firstFailed.isHidden ? undefined : firstFailed.actualOutput,
                        errorMessage: firstFailed.errorMessage,
                      }
                    : undefined;
                })(),
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onClose={() => setIsAITutorOpen(false)}
              onLoadExerciseCode={(starterCode, title) => {
                handleCodeChange(starterCode);
                setLogs((prev) => [
                  ...prev,
                  {
                    id: `log-${Date.now()}-ai-ex`,
                    type: 'system',
                    content: `Đã nạp bài tập tự luyện [${title}] vào trình soạn thảo.`,
                    timestamp: Date.now(),
                  },
                ]);
              }}
            />
          </aside>
        </>
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
