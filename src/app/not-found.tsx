import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
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
        <Card
          variant="default"
          padding="lg"
          style={{
            maxWidth: '480px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--pastel-peach)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--pastel-peach-text)',
              marginBottom: '18px',
            }}
          >
            <AlertCircle size={30} />
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
            404 — Không tìm thấy bài tập
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
            Bài tập bạn đang tìm kiếm không tồn tại trong giáo trình hoặc đường dẫn chưa chính xác.
          </p>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="mint" size="md" leftIcon={<ArrowLeft size={16} />}>
              Quay lại trang chủ
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
