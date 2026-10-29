import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Header />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            marginBottom: '16px',
          }}
        >
          <AlertCircle size={28} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
          404 — Không tìm thấy bài tập
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', marginBottom: '24px', lineHeight: 1.6 }}>
          Bài tập bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <Link href="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    </div>
  );
}
