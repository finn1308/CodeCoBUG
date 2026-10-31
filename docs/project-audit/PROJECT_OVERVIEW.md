# CODECOBUG — ARCHITECTURE & PROJECT OVERVIEW
## (PHASE 1: COMPLETE PROJECT AUDIT)

**Tài liệu**: Tổng quan kiến trúc hệ thống và phân tích mã nguồn  
**Giai đoạn**: Phase 1 — Đọc và phân tích kiểm toán toàn diện (Read-Only Audit)  
**Trạng thái mã nguồn ứng dụng**: **Bảo toàn 100% — Tuyệt đối không chỉnh sửa mã nguồn**  
**Thời gian kiểm toán**: 31/10/2026

---

## 1. Mục tiêu và Sứ mệnh của CodeCoBUG

**CodeCoBUG** là một nền tảng học lập trình Python 3 tương tác, hiện đại và sư phạm dành cho học viên và thanh thiếu niên. Hệ thống kết hợp:
1. **Lộ trình học tập thực chứng**: Tích hợp toàn diện giữa chuẩn cú pháp W3Schools và tư duy lập trình thực chiến từ cuốn sách *Python Crash Course 3rd Edition (PCC 3E)*.
2. **Trình thông dịch WebAssembly tại chỗ (Pyodide)**: Thực thi code Python 3 ngay trong trình duyệt của học viên mà không cần cài đặt môi trường và không tải máy chủ backend.
3. **Bộ chấm bài tự động nghiêm ngặt (Automated Judge Engine)**: Đánh giá bài nộp dựa trên các test case đa dạng (public và hidden), bảo vệ tính liêm chính và ngăn chặn gian lận.
4. **AI Gia sư Cá nhân (AI Tutor - BYOK)**: Đồng hành hướng dẫn sư phạm, giải thích lỗi, gợi ý nâng bậc và đề xuất bài tập bổ trợ mà không bao giờ phủ nhận kết quả của bộ chấm.
5. **Cơ chế theo dõi điểm yếu & Ôn tập thích ứng**: Tự động phát hiện lỗi sai, đưa vào hàng đợi ôn tập theo thuật toán lặp lại ngắt quãng (Spaced Repetition) và lưu trữ lịch sử nộp bài minh bạch.

---

## 2. Công nghệ & Stack Kiến trúc (Technology Stack)

| Lớp kiến trúc (Layer) | Công nghệ chính | Phiên bản | Vai trò & Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Framework Frontend** | Next.js (App Router) | `^15.2.0` | Khung ứng dụng chính, routing hỗn hợp SSG (70 static pages) và Dynamic Routes |
| **Thư viện UI** | React / React DOM | `^19.0.0` | Thư viện xây dựng giao diện người dùng |
| **Ngôn ngữ lập trình** | TypeScript | `^5.7.3` | Kiểm soát an toàn kiểu dữ liệu tĩnh (`tsc --noEmit`) |
| **Trình soạn thảo Code** | `@monaco-editor/react` | `^4.7.0` | Trình soạn thảo mã nguồn VS Code trong trình duyệt (Python syntax, autocomplete) |
| **Trình thực thi Python** | `pyodide` | `^0.27.8` | Trình thông dịch Python 3 WebAssembly chạy in-browser trong sandbox |
| **Hệ thống Icon** | `lucide-react` | `^1.16.0` | Bộ biểu tượng giao diện sắc nét, nhẹ và đồng bộ |
| **Cơ sở dữ liệu & Auth** | `@supabase/ssr` / `@supabase/supabase-js` | `^0.12.7` / `^2.118.0` | Xác thực người dùng, Row Level Security (RLS) và lưu trữ đám mây |
| **Lưu trữ Cục bộ** | LocalStorage API | Native | Chế độ Học viên Khách (Guest Mode) offline-first với dữ liệu bền vững |
| **Mã hóa Bảo mật** | Web Crypto / Node Crypto (AES-256-GCM) | Native | Mã hóa khóa API cá nhân (BYOK) với IV và Auth Tag riêng biệt |
| **Kiểm thử tự động** | Node Test Runner / TSX | `node:assert`, `tsx` | 27 bộ kiểm thử độc lập kiểm chứng toàn bộ luồng nghiệp vụ |

---

## 3. Cấu trúc Thư mục và Mã nguồn

```
Python - Giả lập/
├── .env.example                               # Mẫu cấu hình biến môi trường
├── AGENT.md                                   # Bản quy tắc kỹ thuật và tiêu chuẩn phát triển
├── README.md                                  # Hướng dẫn khởi chạy và tổng quan dự án
├── package.json / package-lock.json           # Khai báo dependencies và scripts
├── tsconfig.json                              # Cấu hình TypeScript compiler
├── next.config.ts                             # Cấu hình Next.js (headers, Pyodide WASM support)
├── public/                                    # Tệp tĩnh công khai
├── docs/                                      # Tài liệu dự án
│   ├── project-audit/                         # [TẠO MỚI] Báo cáo kiểm toán Phase 1
│   ├── PCC3E_FINAL_INTEGRATION_REPORT.md      # Báo cáo tích hợp giáo trình PCC3E
│   ├── PYTHON_CURRICULUM_MAPPING.md           # Bảng ánh xạ giáo trình 12 chương & 3 dự án
│   ├── CODECOBUG_DATA_MODEL.md                # Đặc tả mô hình dữ liệu & RLS
│   └── CODECOBUG_TEST_REPORT.md               # Báo cáo 27 bộ kiểm thử tự động
├── src/
│   ├── app/                                   # Next.js App Router (Giao diện & API Routes)
│   │   ├── layout.tsx                         # Root layout bọc toàn bộ ứng dụng
│   │   ├── page.tsx                           # Trang chủ (LearningDashboard)
│   │   ├── globals.css                        # CSS Design System toàn cục (1,424 dòng)
│   │   ├── curriculum/                        # Duyệt giáo trình & Trang chi tiết bài học
│   │   ├── exercises/[exerciseSlug]/          # Phòng lab lập trình (Monaco & Terminal)
│   │   ├── projects/                          # Tuyến đường dự án thực chiến (PBL)
│   │   └── api/                               # Các API endpoints backend
│   ├── components/                            # Thư viện UI Components
│   │   ├── ui/                                # Các thành phần UI cơ sở (Button, Modal, Card, ...)
│   │   ├── layout/                            # AppShell, Sidebar, Header, MobileNav
│   │   ├── workspace/                         # ExerciseWorkspace, CodeEditor, TerminalOutput
│   │   ├── curriculum/                        # CurriculumBrowser, LessonDetail
│   │   ├── ai/                                # AITutorPanel, FormattedAIResponse, AITutorModal
│   │   ├── mastery/                           # WeaknessTrackerModal, SubmissionHistory
│   │   └── projects/                          # ProjectList, ProjectDetail
│   ├── lib/                                   # Domain Logic & Services
│   │   ├── curriculum/                        # 12 chương giáo trình & curriculumRegistry
│   │   ├── projects/                          # 3 dự án Capstone & 26 checkpoints
│   │   ├── judge/                             # Judge Engine, Comparator, Server Test Cases
│   │   ├── pyodide/                           # Quản lý vòng đời Pyodide WebAssembly
│   │   ├── ai/                                # AI Tutor Service, Provider Adapter, Crypto
│   │   ├── auth/                              # Quản lý Auth, Guest Mode, Multi-tenant
│   │   └── mastery/                           # Thuật toán đánh giá năng lực & Hàng đợi ôn tập
│   └── hooks/                                 # Custom React Hooks (`usePyodide.ts`)
└── tests/                                     # 27 bộ kiểm thử tự động (`test_*.js`)
```

---

## 4. Hiện trạng Giao diện & Định hướng Tái cấu trúc Pastel London

### Hiện trạng (Teen Pastel Studio):
- Hệ thống màu pastel mint (`#BFE8D0`), lavender (`#DCCBFF`), sky blue (`#C7E3FF`), peach (`#FFCDBD`).
- Thẻ bo góc lớn ($20-24\text{px}$), nút bấm ($12-16\text{px}$).
- Tương tác nhẹ nhàng theo phong cách LucianLabs.
- Tệp định nghĩa kiểu dáng hiện tại: `src/app/globals.css` (1,424 dòng) thuần CSS native, không phụ thuộc Tailwind runtime.

### Định hướng Tái cấu trúc (Pastel London):
- Mang phong cách Anh quốc cổ điển kết hợp pastel hiện đại: sang trọng, nhã nhặn, trật tự, tinh tế.
- Tông màu lấy cảm hứng từ London: Sương mù London (Muted Fog Grey), Xanh quý tộc pastel (Pastel Regent Blue), Hồng phấn cổ điển (Vintage Rose/Pastel Coral), Xanh lá công viên Hoàng gia (Royal Sage/Mint), Vàng nhạt trà chiều (Afternoon Tea Cream/Soft Amber).
- Kiểu chữ (Typography): Tinh giản, trang nhã, tương phản cao, dễ đọc trên cả màn hình nhỏ.
- Đường viền và đổ bóng: Viền sắc nét tinh tế ($1\text{px}$ mỏng), đổ bóng mờ có chiều sâu, giữ bố cục trật tự và giảm thiểu xáo trộn thị giác.

---

## 5. Nguyên tắc Bảo toàn Tuyệt đối khi Đổi Giao diện

Trong suốt quá trình tái cấu trúc giao diện sang phong cách Pastel London ở các giai đoạn sau:
1. **Bảo toàn 100% Logic Nghiệp vụ**: Tuyệt đối không thay đổi mã nguồn các bộ xử lý dữ liệu (`authManager`, `runner`, `comparator`, `testCasesRepository`, `tutorService`, `reviewEngine`, `curriculumRegistry`, `projectRegistry`).
2. **Bảo toàn 100% Cấu trúc Tuyến đường (Routing)**: Giữ nguyên toàn bộ 70 routes đã build tĩnh và dynamic parameters (`/`, `/curriculum`, `/curriculum/[chapterSlug]`, `/curriculum/[chapterSlug]/[lessonSlug]`, `/exercises/[exerciseSlug]`, `/projects`, `/projects/[projectSlug]`).
3. **Bảo toàn 100% Mô hình Dữ liệu**: Không thay đổi schema localStorage hay Supabase SQL migrations.
4. **Bảo toàn 100% 27 Bộ Kiểm thử Tự động**: Mọi thay đổi UI phải vượt qua toàn bộ 27 test suites với tỷ lệ thành công 100%.
5. **Zero Disruption for Users**: Không làm gián đoạn trải nghiệm gõ code trên Monaco Editor, chạy code với Pyodide hay nộp bài chấm điểm.

