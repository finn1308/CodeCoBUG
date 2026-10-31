import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeCoBUG — Nền tảng Học Lập trình Python Thông minh',
  description: 'Nền tảng học Python có lộ trình, trình chạy code trực tuyến Pyodide, hệ thống chấm bài tự động và AI gia sư cá nhân.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
