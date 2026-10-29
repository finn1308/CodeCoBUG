'use client';

import React from 'react';
import { HelpCircle, Command, Keyboard, Bot, BookOpen } from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAISettings?: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onOpenAISettings,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Trợ giúp & Phím tắt học tập"
      description="Hướng dẫn thao tác và sử dụng hệ thống CodeCoBUG Teen Pastel Studio"
      icon={<HelpCircle size={18} />}
      maxWidth="520px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Navigation structure */}
        <div
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            <BookOpen size={16} style={{ color: 'var(--pastel-mint-text)' }} />
            <span>3 Điểm đến chính của hệ thống</span>
          </div>
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>1. Tổng quan:</strong> Bảng theo dõi tiến độ học, số điểm tích lũy và thống kê năng lực thực tế.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>2. Học Python:</strong> Hệ thống giáo trình, danh sách chủ đề và lý thuyết bài học theo lộ trình.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>3. Luyện tập:</strong> Phòng lab lập trình Python trực tuyến, chạy Pyodide Wasm và hàng đợi ôn tập bài sai.
            </li>
          </ul>
        </div>

        {/* Shortcuts */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
            <Keyboard size={16} style={{ color: 'var(--pastel-sky-text)' }} />
            <span>Phím tắt thuận tiện</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Chạy code nhanh (Run)</span>
              <kbd style={{ backgroundColor: 'var(--bg-muted)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                Ctrl + Enter / ⌘ + Enter
              </kbd>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Đóng cửa sổ / modal / drawer</span>
              <kbd style={{ backgroundColor: 'var(--bg-muted)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                Escape
              </kbd>
            </div>
          </div>
        </div>

        {/* AI Tutor BYOK Notice */}
        <div
          style={{
            background: 'var(--pastel-lavender-light)',
            border: '1px solid var(--pastel-lavender)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <Bot size={20} style={{ color: 'var(--pastel-lavender-text)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1, fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            <div style={{ fontWeight: 700, color: 'var(--pastel-lavender-text)', marginBottom: '4px' }}>
              Trợ lý học tập AI Tutor (BYOK)
            </div>
            <div>
              CodeCoBUG hỗ trợ trợ giảng AI cá nhân hóa với khóa API riêng (BYOK) từ Google Gemini hoặc OpenAI. Mọi khóa API đều được mã hóa AES-256 an toàn và không bao giờ rò rỉ ra trình duyệt.
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
          {onOpenAISettings && (
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                onOpenAISettings();
              }}
            >
              Cài đặt AI
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            Đã hiểu
          </Button>
        </div>
      </div>
    </Modal>
  );
};

