# CodeCoBUG — Kế Hoạch Khảo Sát & Tái Thiết Kế Giao Diện Teen Pastel Studio
(Teen Pastel UI Redesign Plan & Codebase Audit)

---

## 1. Mục Tiêu & Định Hướng Thiết Kế (Design Direction)

Theo đặc tả trong `agent1.md`, nền tảng học lập trình Python **CodeCoBUG** sẽ được chuyển đổi giao diện từ phong cách Dark Mode/Cyberpunk hiện tại sang phong cách **CodeCoBUG Teen Pastel Studio**:
- **Đối tượng người dùng**: Thanh thiếu niên, học sinh bắt đầu học lập trình Python.
- **Cảm xúc định hướng**: Tươi sáng, thân thiện, vui tươi nhưng nghiêm túc, kích thích tư duy, không gây mỏi mắt trong các phiên học kéo dài.
- **Nguyên tắc thị giác**:
  - Bo tròn mềm mại (16–24px cho thẻ/card, 12–16px cho nút bấm và trường nhập liệu).
  - Viền mỏng thanh mảnh (`#E7EAF0`) và bóng đổ mềm mượt (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05)`).
  - Đảm bảo độ tương phản màu sắc cho văn bản theo chuẩn tiếp cận (Accessible Contrast), không dùng chữ mờ trên nền nhạt.
  - Phân cấp thông tin rõ ràng, khoảng cách rộng rãi, tránh rối rắm thị giác.
- **Bảng màu chủ đạo (Pastel Palette)**:
  - Nền trang (Light Mint Background): `#F3FBF5`
  - Nền thẻ (Card Background): `#FFFFFF`
  - Màu nhấn chính (Primary Mint): `#BFE8D0` (accent hover/active `#9BD9B3`)
  - Màu hoa cà (Lavender): `#DCCBFF`
  - Màu xanh da trời (Sky Blue): `#C7E3FF`
  - Màu hồng đào (Peach Coral): `#FFCDBD`
  - Màu vàng nhạt (Soft Yellow): `#FFF0B8`
  - Màu chữ chính (Main Text): `#243047`
  - Màu chữ phụ (Secondary Text): `#697386`
  - Màu thành công (Success): `#10B981` / `#059669`
  - Màu cảnh báo/lỗi (Error): `#E11D48` / `#EF4444`

---

## 2. Khảo Sát Hiện Trạng Codebase (Current State Audit)

### 2.1. Cấu trúc Công nghệ & Thư viện
- **Framework**: Next.js 15.5.28 (App Router), React 19, TypeScript 5.7.3.
- **Trình soạn thảo**: `@monaco-editor/react` v4.7.0.
- **Môi trường Python**: `pyodide` v0.27.8 chạy trong isolated Web Worker (`public/workers/pyodide.worker.js`).
- **Icons**: `lucide-react` v1.16.0.
- **Cơ sở dữ liệu & Xác thực**: Supabase SSR + PostgreSQL RLS schema (`supabase/migrations/`).
- **Styling hiện tại**: Vanilla CSS trong `src/app/globals.css`.

### 2.2. Bản Đồ Các Luồng & Tính Năng Đang Hoạt Động Cần Bảo Tồn 100%
| Phân hệ chức năng | File thực thi chính | Yêu cầu bảo tồn khi Redesign |
| :--- | :--- | :--- |
| **Trang chủ & Danh mục** | `src/app/page.tsx`, `sampleCurriculum.ts` | Giữ nguyên cấu trúc dữ liệu khóa học, bài học, bài tập. |
| **Không gian làm bài (Workspace)** | `src/components/workspace/ExerciseWorkspace.tsx` | Giữ nguyên cơ chế state: code, logs, submit, AI Tutor drawer. |
| **Khung đề bài (Left Pane)** | `src/components/workspace/ProblemStatement.tsx` | Giữ nguyên các nút "Copy Input" và "Dùng Input" truyền dữ liệu vào Terminal. |
| **Trình soạn thảo Monaco (Editor)** | `src/components/workspace/CodeEditor.tsx` | Chuyển đổi theme Monaco sang light theme tương thích pastel, giữ nguyên phóng to/thu nhỏ font và nạp lại code nháp. |
| **Terminal & Kết quả kiểm thử** | `src/components/workspace/TerminalOutput.tsx` | Giữ nguyên 4 tab: Terminal, Kết quả kiểm thử, Dữ liệu vào (Input), Lịch sử nộp bài. |
| **Động cơ Pyodide Client** | `src/lib/pyodide/PyodideClient.ts` | Giữ nguyên toàn bộ cơ chế truyền thông điệp với Worker, watchdog ngắt vòng lặp vô tận sau 5000ms. |
| **Động cơ chấm bài (Judge)** | `src/lib/judge/runner.ts`, `/api/judge/submit` | Giữ nguyên quy trình chấm 3 test công khai + test ẩn, cấm biến tạm, dung sai float. |
| **Xác thực & Tiến độ** | `src/lib/auth/authManager.ts` | Giữ nguyên phân tách người dùng, lưu bản nháp theo `userId:exerciseSlug`, tích lũy điểm thưởng. |
| **AI Tutor BYOK Engine** | `src/lib/ai/`, `/api/ai/chat` | Giữ nguyên mã hóa AES-256-GCM, bảo vệ API key, xóa vết khóa khỏi error trace. |
| **Mastery & Review Queue** | `src/lib/mastery/` | Giữ nguyên tính toán điểm thành thạo thực chứng, nhận diện lỗi lặp lại, lập lịch ôn tập ưu tiên. |

---

## 3. Lộ Trình Triển Khai Tái Thiết Kế (Phased Roadmap)

Tuân theo đúng Mục 12 của `agent1.md`, quá trình thiết kế lại giao diện được chia thành các bước độc lập, kiểm tra sau từng bước:

- **Bước 1: Khảo sát hiện trạng & Lập kế hoạch (ĐANG THỰC HIỆN - Phase 1)**:
  - Khảo sát toàn diện codebase, kiểm tra các route, dependencies, tính năng đang chạy.
  - Lập báo cáo hiện trạng và tài liệu kế hoạch `docs/TEEN_PASTEL_REDESIGN_PLAN.md`.
  - Chưa sửa code hay thay đổi logic tùy tiện.

- **Bước 2: Thiết lập Design Tokens & Bộ Component Bo Tròn Pastel (Phase 2)**:
  - Cập nhật `src/app/globals.css` với toàn bộ biến màu pastel, nền sáng `#F3FBF5`, bo góc 16–24px, đổ bóng nhẹ.
  - Chuẩn hóa hệ thống Typography, Spacing scale, Buttons (Primary Mint, Lavender, Ghost), Badges, Card containers.

- **Bước 3: Shell Ứng Dụng & Điều Hướng Thích Ứng (Phase 3)**:
  - Thiết kế Left Sidebar trên Desktop: Logo CodeCoBUG, Dashboard, Giáo trình, Luyện tập, AI Tutor, Điểm yếu & Ôn tập, Tài khoản/Cài đặt.
  - Thiết kế Mobile Navigation: Drawer / Tab bar nhỏ gọn, chống tràn chiều ngang.

- **Bước 4: Thiết Kế Lại Bảng Điều Khiển Học Tập (Learning Dashboard - Phase 4)**:
  - Nâng cấp `src/app/page.tsx` với giao diện chào mừng học viên thân thiện.
  - Thẻ "Tiếp tục bài học", tiến độ chủ đề, bài tập gần đây (chỉ hiển thị khi có dữ liệu thật).
  - Trạng thái trống (empty state) trung thực khi chưa có bài làm, không tạo số liệu giả.

- **Bước 5: Thiết Kế Lại Giao Diện Giáo Trình (Curriculum Browser - Phase 5)**:
  - Thẻ chủ đề với dải màu pastel phân loại, thanh tiến độ thực tế, tìm kiếm và lọc chủ đề.

- **Bước 6: Thiết Kế Lại Không Gian Làm Bài Lập Trình (Exercise Workspace - Phase 6 - Ưu tiên cao nhất)**:
  - Tái cấu trúc 2 cột cân bằng: Cột trái (Đề bài, Ràng buộc, Ví dụ I/O), Cột phải (Monaco Editor pastel, Nút Run & Nộp bài, Terminal tabbed).
  - Tích hợp theme Monaco sáng màu, độ tương phản cao, phông monospace dễ đọc.
  - Bảo toàn 100% kết nối với Pyodide Worker và Serverless Judge.

- **Bước 7: Nâng Cấp Giao Diện Bảng AI Tutor & Các Cửa Sổ Modal (Phase 7)**:
  - Giao diện AI Tutor dạng ngăn kéo hoặc bong bóng thân thiện, các gợi ý câu hỏi mẫu.
  - Nâng cấp visual cho `AISettingsModal.tsx`, `AuthModal.tsx`, `WeaknessTrackerModal.tsx`.

- **Bước 8: Kiểm Thử Toàn Diện, Tương Thích Di Động & Nghiệm Thu (Phase 8)**:
  - Chạy toàn bộ 214 bài test hồi quy, type-check, lint, production build.
  - Kiểm tra độ tương phản màu sắc (WCAG AA), kiểm tra viewport di động.

---

## 4. Cam Kết & Tiêu Chuẩn Kỹ Thuật (Guarantees & Constraints)
1. **Không tạo dữ liệu giả**: Mọi thanh tiến độ, điểm số, lịch sử làm bài đều phải lấy từ `authManager` và `masteryEngine`.
2. **Không làm hỏng tính năng đang chạy**: Trình thông dịch Python, bộ chấm bài, AI Tutor và database migration phải hoạt động bình thường qua mọi bước đổi giao diện.
3. **Giữ nguyên giáo trình mẫu hiện có**: Không tự ý bịa đặt bài tập mới, chỉ tái thiết kế các component hiển thị.
4. **Kiểm tra hồi quy liên tục**: Chạy `npm run type-check && npm run lint && npm run build` và các tệp test sau mỗi thay đổi giao diện.
