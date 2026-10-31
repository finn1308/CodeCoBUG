'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  RotateCcw,
  Code2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Play,
  CheckCircle2,
  Loader2,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';

// Dynamic import with SSR disabled to guarantee compatibility with Next.js App Router
const Monaco = dynamic(() => import('@monaco-editor/react').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        background: 'var(--terminal-bg)',
      }}
    >
      <span>Đang tải trình soạn thảo Monaco...</span>
    </div>
  ),
});

export interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  starterCode?: string;
  disabled?: boolean;
  isRunning?: boolean;
  isSubmitting?: boolean;
  onRun?: () => void;
  onSubmit?: () => void;
  isTerminalCollapsed?: boolean;
  onToggleTerminal?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  starterCode = '',
  disabled = false,
  isRunning = false,
  isSubmitting = false,
  onRun,
  onSubmit,
  isTerminalCollapsed = false,
  onToggleTerminal,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs'>('vs-dark');

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại mã nguồn về trạng thái ban đầu?')) {
      onChange(starterCode);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const toggleTheme = () => {
    setEditorTheme((prev) => (prev === 'vs-dark' ? 'vs' : 'vs-dark'));
  };

  const linesCount = value.split('\n').length;
  const charsCount = value.length;

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
      {/* Editor Toolbar */}
      <div
        className="pane-header"
        style={{
          padding: '8px 14px',
          flexWrap: 'wrap',
          gap: '8px',
          minHeight: '44px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-tertiary)',
        }}
      >
        {/* Left: File tag, language badge, theme toggle & zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div className="pane-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Code2 size={16} style={{ color: 'var(--pastel-mint-text)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>main.py</span>
            <Badge variant="sky" size="sm">
              Python 3
            </Badge>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              backgroundColor: 'var(--bg-surface)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Theme Toggle Button */}
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                padding: '3px 6px',
                fontSize: '0.72rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
              }}
              onClick={toggleTheme}
              title={editorTheme === 'vs-dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              aria-label="Đổi giao diện trình soạn thảo"
            >
              {editorTheme === 'vs-dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            {/* Font Size Zoom Controls */}
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                padding: '3px 5px',
                fontSize: '0.72rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
              }}
              onClick={() => setFontSize((prev) => Math.max(11, prev - 1))}
              title="Giảm cỡ chữ"
              aria-label="Giảm cỡ chữ"
            >
              <ZoomOut size={13} />
            </button>
            <span
              style={{
                fontSize: '0.70rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                minWidth: '28px',
                textAlign: 'center',
              }}
            >
              {fontSize}px
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                padding: '3px 5px',
                fontSize: '0.72rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
              }}
              onClick={() => setFontSize((prev) => Math.min(22, prev + 1))}
              title="Tăng cỡ chữ"
              aria-label="Tăng cỡ chữ"
            >
              <ZoomIn size={13} />
            </button>
          </div>
        </div>

        {/* Right: Code stats, copy, reset, and PRIMARY ACTION BUTTONS (Run & Submit) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span
            style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '4px' }}
            className="desktop-only-stats"
          >
            {linesCount} dòng • {charsCount} ký tự
          </span>

          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 7px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
            }}
            onClick={handleCopy}
            title="Sao chép mã nguồn"
            aria-label="Sao chép mã nguồn"
          >
            {copied ? <Check size={13} style={{ color: 'var(--status-success)' }} /> : <Copy size={13} />}
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-secondary)',
            }}
            onClick={handleReset}
            disabled={disabled || isRunning || isSubmitting}
            title="Đặt lại code ban đầu"
            aria-label="Đặt lại code ban đầu"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          {/* RUN BUTTON: Prominent Pyodide execution button */}
          {onRun && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRun}
              disabled={disabled || isRunning || isSubmitting}
              isLoading={isRunning}
              leftIcon={
                isRunning ? (
                  <Loader2 size={13} className="spin" />
                ) : (
                  <Play size={13} fill="currentColor" style={{ color: 'var(--pastel-sky-text)' }} />
                )
              }
              style={{
                fontWeight: 700,
                backgroundColor: 'var(--pastel-sky-light)',
                border: '1px solid var(--pastel-sky)',
                color: 'var(--pastel-sky-text)',
                boxShadow: 'var(--shadow-xs)',
              }}
              title="Chạy thử nghiệm trên Pyodide WebAssembly (không tính điểm bài tập)"
            >
              <span>{isRunning ? 'Đang chạy...' : 'Chạy thử'}</span>
            </Button>
          )}

          {/* SUBMIT BUTTON: Judge Engine evaluation */}
          {onSubmit && (
            <Button
              variant="mint"
              size="sm"
              onClick={onSubmit}
              disabled={disabled || isRunning || isSubmitting}
              isLoading={isSubmitting}
              leftIcon={
                isSubmitting ? (
                  <Loader2 size={13} className="spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )
              }
              style={{
                fontWeight: 700,
                boxShadow: 'var(--shadow-xs)',
              }}
              title="Nộp bài và chấm toàn bộ test case công khai & ẩn"
            >
              <span>{isSubmitting ? 'Đang chấm...' : 'Nộp bài'}</span>
            </Button>
          )}

          {/* Terminal Collapse/Expand Toggle */}
          {onToggleTerminal && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                padding: '4px 6px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
              }}
              onClick={onToggleTerminal}
              title={isTerminalCollapsed ? 'Mở rộng Terminal' : 'Thu gọn Terminal'}
              aria-label={isTerminalCollapsed ? 'Mở rộng Terminal' : 'Thu gọn Terminal'}
            >
              {isTerminalCollapsed ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
        <Monaco
          height="100%"
          language="python"
          theme={editorTheme}
          value={value}
          onChange={(newVal) => onChange(newVal || '')}
          options={{
            readOnly: disabled || isRunning || isSubmitting,
            fontSize,
            fontFamily: 'var(--font-mono)',
            tabSize: 4,
            insertSpaces: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 },
            lineDecorationsWidth: 8,
          }}
        />
      </div>
    </div>
  );
};
