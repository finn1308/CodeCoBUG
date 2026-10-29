'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { RotateCcw, Code2, Copy, Check, ZoomIn, ZoomOut } from 'lucide-react';

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
        background: '#1e1e1e',
      }}
    >
      <span>Đang tải trình soạn thảo Monaco...</span>
    </div>
  ),
});

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  starterCode?: string;
  disabled?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  starterCode = '',
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);

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

  const linesCount = value.split('\n').length;
  const charsCount = value.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Editor Toolbar */}
      <div className="pane-header">
        <div className="pane-title">
          <Code2 size={16} style={{ color: 'var(--accent-light)' }} />
          <span>main.py</span>
          <span
            style={{
              fontSize: '0.7rem',
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: 'var(--accent-light)',
            }}
          >
            Python 3
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '4px' }}>
            {linesCount} dòng • {charsCount} ký tự
          </span>

          {/* Font Size Zoom Controls */}
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '3px 6px', fontSize: '0.72rem' }}
            onClick={() => setFontSize((prev) => Math.max(11, prev - 1))}
            title="Giảm cỡ chữ"
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{fontSize}px</span>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '3px 6px', fontSize: '0.72rem' }}
            onClick={() => setFontSize((prev) => Math.min(22, prev + 1))}
            title="Tăng cỡ chữ"
          >
            <ZoomIn size={13} />
          </button>

          <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)', margin: '0 2px' }} />

          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            onClick={handleCopy}
            title="Sao chép mã nguồn"
          >
            {copied ? <Check size={13} style={{ color: '#34d399' }} /> : <Copy size={13} />}
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            onClick={handleReset}
            disabled={disabled}
            title="Đặt lại code ban đầu"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Monaco
          height="100%"
          language="python"
          theme="vs-dark"
          value={value}
          onChange={(newVal) => onChange(newVal || '')}
          options={{
            readOnly: disabled,
            fontSize,
            fontFamily: "var(--font-mono)",
            tabSize: 4,
            insertSpaces: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
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
