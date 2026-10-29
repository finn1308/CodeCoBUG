'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Info, AlertTriangle, Lightbulb } from 'lucide-react';

interface FormattedAIResponseProps {
  content: string;
}

/**
 * Parses and renders AI markdown formatted text safely in pure React.
 * Handles code fences, inline code, bold, lists, and educational callouts.
 */
export const FormattedAIResponse: React.FC<FormattedAIResponseProps> = ({ content }) => {
  if (!content) return null;

  // Split content by code blocks: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const segments: Array<{ type: 'code' | 'text'; lang?: string; code?: string; text?: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        text: content.substring(lastIndex, match.index),
      });
    }

    segments.push({
      type: 'code',
      lang: match[1]?.trim() || 'python',
      code: match[2]?.replace(/\n$/, '') || '',
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      text: content.substring(lastIndex),
    });
  }

  return (
    <div className="ai-formatted-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {segments.map((segment, idx) => {
        if (segment.type === 'code' && segment.code !== undefined) {
          return <CodeSnippetBlock key={`code-${idx}`} lang={segment.lang || 'python'} code={segment.code} />;
        }
        return <TextParagraphBlock key={`text-${idx}`} text={segment.text || ''} />;
      })}
    </div>
  );
};

/**
 * Individual Code Snippet with Language Tag and Copy Button
 */
const CodeSnippetBlock: React.FC<{ lang: string; code: string }> = ({ lang, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const displayLang = lang.toLowerCase() === 'py' || lang.toLowerCase() === 'python' ? 'Python 3' : lang || 'Code';

  return (
    <div className="ai-code-block">
      <div className="ai-code-header">
        <div className="ai-code-lang">
          <Terminal size={13} style={{ color: 'var(--pastel-lavender-text)' }} />
          <span>{displayLang}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="ai-code-copy-btn"
          title="Sao chép mã nguồn"
        >
          {copied ? (
            <>
              <Check size={13} style={{ color: 'var(--status-success-text)' }} />
              <span style={{ color: 'var(--status-success-text)' }}>Đã chép!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Chép</span>
            </>
          )}
        </button>
      </div>
      <pre className="ai-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
};

/**
 * Formats a plain text chunk with inline markdown, lists, callouts, and headers
 */
const TextParagraphBlock: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={`empty-${lineIdx}`} style={{ height: '4px' }} />;
        }

        // Markdown Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={`h4-${lineIdx}`}
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '6px 0 2px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {renderInlineSpans(trimmed.substring(4))}
            </h4>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={`h3-${lineIdx}`}
              style={{
                fontSize: '0.98rem',
                fontWeight: 800,
                color: 'var(--pastel-lavender-text)',
                margin: '8px 0 3px 0',
              }}
            >
              {renderInlineSpans(trimmed.substring(3))}
            </h3>
          );
        }

        // Educational Callout Block (Alert/Tip/Note)
        if (
          trimmed.startsWith('> [!NOTE]') ||
          trimmed.startsWith('> [!TIP]') ||
          trimmed.toLowerCase().startsWith('lưu ý:') ||
          trimmed.toLowerCase().startsWith('mẹo:')
        ) {
          let calloutText = trimmed;
          let icon = <Lightbulb size={14} style={{ color: 'var(--status-warning-text)' }} />;
          let variantClass = 'ai-callout-warning';

          if (trimmed.startsWith('> [!NOTE]') || trimmed.toLowerCase().startsWith('lưu ý:')) {
            calloutText = trimmed.replace(/^> \[\!NOTE\]\s*/i, '').replace(/^lưu ý:\s*/i, '');
            icon = <Info size={14} style={{ color: 'var(--pastel-sky-text)' }} />;
            variantClass = 'ai-callout-info';
          } else if (trimmed.toLowerCase().startsWith('cảnh báo:')) {
            calloutText = trimmed.replace(/^cảnh báo:\s*/i, '');
            icon = <AlertTriangle size={14} style={{ color: 'var(--status-error)' }} />;
            variantClass = 'ai-callout-error';
          } else {
            calloutText = trimmed.replace(/^> \[\!TIP\]\s*/i, '').replace(/^mẹo:\s*/i, '');
          }

          return (
            <div key={`callout-${lineIdx}`} className={`ai-callout ${variantClass}`}>
              <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
              <div style={{ flex: 1, fontSize: '0.82rem', lineHeight: 1.5 }}>
                {renderInlineSpans(calloutText)}
              </div>
            </div>
          );
        }

        // Bulleted List Items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div
              key={`li-${lineIdx}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.84rem',
                lineHeight: 1.55,
                color: 'var(--text-primary)',
                paddingLeft: '4px',
              }}
            >
              <span
                style={{
                  color: 'var(--pastel-lavender-text)',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  fontWeight: 800,
                }}
              >
                •
              </span>
              <div style={{ flex: 1 }}>{renderInlineSpans(trimmed.substring(2))}</div>
            </div>
          );
        }

        // Numbered List Items
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div
              key={`num-${lineIdx}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.84rem',
                lineHeight: 1.55,
                color: 'var(--text-primary)',
                paddingLeft: '4px',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: 'var(--pastel-lavender-text)',
                  minWidth: '18px',
                  fontSize: '0.8rem',
                }}
              >
                {numberedMatch[1]}.
              </span>
              <div style={{ flex: 1 }}>{renderInlineSpans(numberedMatch[2])}</div>
            </div>
          );
        }

        // Default Paragraph Line
        return (
          <p
            key={`p-${lineIdx}`}
            style={{
              fontSize: '0.84rem',
              lineHeight: 1.55,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {renderInlineSpans(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Safely parses inline markdown tokens: `inline code`, **bold**, *italic*
 */
function renderInlineSpans(str: string): React.ReactNode[] {
  // Regex tokenizing inline code `...`, bold **...**, and italic *...*
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = str.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline Code
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={`code-${index}`} className="ai-inline-code">
          {part.substring(1, part.length - 1)}
        </code>
      );
    }

    // Bold text
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={`bold-${index}`} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
          {part.substring(2, part.length - 2)}
        </strong>
      );
    }

    // Italic text
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={`em-${index}`} style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
          {part.substring(1, part.length - 1)}
        </em>
      );
    }

    // Normal text
    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
}
