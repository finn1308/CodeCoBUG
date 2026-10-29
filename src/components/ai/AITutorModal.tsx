'use client';

import React from 'react';
import { Modal } from '@/components/ui';
import { AITutorPanel, AITutorPanelProps } from './AITutorPanel';
import { Bot } from 'lucide-react';

export interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  exerciseContext?: AITutorPanelProps['exerciseContext'];
  submissionData?: AITutorPanelProps['submissionData'];
  onLoadExerciseCode?: (code: string, title: string) => void;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  exerciseContext,
  submissionData,
  onLoadExerciseCode,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CodeCoBUG AI Tutor Studio"
      description="Gia sư cá nhân thông minh: hỗ trợ giải thích lỗi, hướng dẫn tư duy lập trình và phân tích điểm yếu."
      icon={<Bot size={20} style={{ color: 'var(--pastel-lavender-text)' }} />}
      maxWidth="760px"
    >
      <div
        style={{
          height: '560px',
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          margin: '-8px -4px',
        }}
      >
        <AITutorPanel
          exerciseContext={exerciseContext}
          submissionData={submissionData}
          onOpenSettings={onOpenSettings}
          onClose={onClose}
          onLoadExerciseCode={onLoadExerciseCode}
          isDrawer={false}
        />
      </div>
    </Modal>
  );
};
