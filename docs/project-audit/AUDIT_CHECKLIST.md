# CODECOBUG — COMPREHENSIVE AUDIT CHECKLIST & EVIDENCE
## (PHASE 1: COMPLETE PROJECT AUDIT)

**Tài liệu**: Bảng kiểm tra kiểm toán hệ thống có chứng cứ và đối chiếu mã nguồn  
**Giai đoạn**: Phase 1 — Đọc và phân tích kiểm toán toàn diện (Read-Only Audit)  
**Quy tắc**: Mọi mục kiểm tra đều có đường dẫn tệp mã nguồn cụ thể hoặc bộ test case tự động làm bằng chứng.

---

## 1. Danh mục Kiểm tra Kiểm toán (Audit Checklist)

### 1.1 Quy tắc Dự án & Kiến trúc Tổng thể
- [x] **Đọc toàn bộ AGENT.md và các hướng dẫn liên quan**:
  - *Bằng chứng*: Đã đối chiếu toàn bộ các phần: Mục tiêu dự án, tiêu chuẩn nội dung bài học 10 phần, quy chuẩn bộ chấm bài, an toàn khóa API BYOK, nguyên tắc giao diện và định nghĩa hoàn thành (Definition of Done) trong `AGENT.md` (2,068 dòng).
- [x] **Khảo sát package.json, manifest, dependencies và scripts**:
  - *Bằng chứng*: `package.json` xác nhận Next.js `^15.2.0`, React `^19.0.0`, TypeScript `^5.7.3`, Pyodide `^0.27.8`, Monaco Editor `^4.7.0`, Supabase SSR/JS `^0.12.7`/`^2.118.0`, Lucide React `^1.16.0`.
  - Scripts: `npm run dev`, `npm run build`, `npm start`, `npm run lint`, `npm run type-check`, `npm test`.
- [x] **Lập bản đồ cấu trúc mã nguồn**:
  - *Bằng chứng*: Đã lập danh mục chi tiết 91 tệp nguồn trong `src/` và 27 tệp kiểm thử trong `tests/` tại tài liệu `PROJECT_OVERVIEW.md`.

---

### 1.2 Kiểm kê Tuyến đường & Giao diện (Routes & Pages)
- [x] **Lập danh sách đầy đủ tất cả route và trang ứng dụng**:
  - *Bằng chứng*: Đã ghi nhận tại `ROUTE_CATALOG.md`. Bao gồm 70 routes tĩnh được Next.js App Router biên dịch thành công (`70/70 static pages`), 1 route phòng lab động `/exercises/[exerciseSlug]`, 1 route 404 và 5 API endpoints backend.
- [x] **Kiểm tra Layouts, Components, Modals và Sidebars**:
  - *Bằng chứng*: Khung ứng dụng chính nằm tại `src/components/layout/AppShell.tsx`, kết nối với `Sidebar.tsx`, `Header.tsx`, `MobileNav.tsx`, cùng 5 cửa sổ modal toàn cục (`AuthModal`, `AISettingsModal`, `WeaknessTrackerModal`, `HelpModal`, `AITutorModal`).
- [x] **Xác định các chức năng trùng lặp hoặc điều hướng rối**:
  - *Bằng chứng*:
    - Thanh điều hướng đã được tinh giản thành 3 điểm đến chính: `1. Tổng quan`, `2. Học Python`, `3. Luyện tập`.
    - Tránh việc đặt quá nhiều nút trên header bằng cách gom: Quản lý điểm yếu và Lịch sử nộp bài vào chung một Modal `WeaknessTrackerModal` có 4 tab trực quan.
    - Cài đặt AI (BYOK) được đưa vào modal phụ riêng biệt, tránh làm phân tâm học viên khi đang làm bài.

---

### 1.3 Phân định Chức năng Thật vs Giao diện Giả (Real vs UI-Only)
- [x] **Phân loại trạng thái từng tính năng theo chuẩn nghiêm ngặt**:
  - *Bằng chứng*: Đã lập bảng tại `FEATURE_INVENTORY.md` sử dụng 6 nhãn: `VERIFIED`, `PARTIAL`, `UI_ONLY`, `BROKEN`, `NOT_FOUND`, `NOT_TESTED`.
  - Không có tính năng nào bị gán nhãn ảo. Toàn bộ 44 bài học, 87 bài tập, bộ chấm Pyodide và hệ thống lưu trữ đều có logic thực thi thật.
- [x] **Kiểm tra tính năng nộp bài và chấm điểm**:
  - *Bằng chứng*: Hàm `evaluateSubmission()` trong `src/lib/judge/runner.ts` thực sự chạy code qua test cases, so sánh đầu ra với `comparator.ts` và trả về kết quả điểm số/phán quyết thực. Bằng chứng kiểm thử: `tests/test_judge_engine.js` (28/28 pass).
- [x] **Kiểm tra tính năng lưu trữ tiến độ**:
  - *Bằng chứng*: `src/lib/auth/authManager.ts` lưu bài nộp vào `codecobug_submissions` kèm mảng `testCaseResults` chi tiết; hàm `getLessonStatus()` suy ra tiến độ bài học dựa trên kết quả giải bài tập con. Bằng chứng kiểm thử: `tests/test_step5_curriculum_fullstack_connection.js`.

---

### 1.4 Kiểm tra Mô hình Dữ liệu & Luồng Tương tác (Data & Architecture)
- [x] **Kiểm tra mô hình dữ liệu Supabase & LocalStorage**:
  - *Bằng chứng*: Đã đối chiếu 4 tệp migration SQL trong `supabase/migrations/` và cấu trúc khóa lưu trữ client trong `docs/CODECOBUG_DATA_MODEL.md`.
- [x] **Kiểm tra cách ly dữ liệu đa người dùng (Multi-Tenant Isolation)**:
  - *Bằng chứng*: Kiểm thử trong `tests/test_step5_curriculum_fullstack_connection.js` (nhóm 6) chứng minh Người dùng Diana hoàn toàn không thấy bài nộp, hàng đợi ôn tập của Người dùng Charlie khi đăng nhập trên cùng một trình duyệt.
- [x] **Vẽ bản đồ luồng dữ liệu giữa các phân hệ**:
  - *Bằng chứng*: Đã vẽ 5 sơ đồ Sequence Diagram chuẩn Mermaid trong `DATA_FLOW.md` (Run Code, Submit Code, AI Tutor, Adaptive Review, Multi-Tenant).

---

### 1.5 Kiểm tra Tích hợp Bên ngoài & Bảo mật (External Integrations & Security)
- [x] **Ghi nhận tích hợp AI Tutor BYOK và bảo mật khóa API**:
  - *Bằng chứng*: `src/lib/ai/crypto.ts` mã hóa khóa bằng `AES-256-GCM` với vector ngẫu nhiên 96-bit (IV) và mã xác thực 128-bit (Auth Tag). Không lưu khóa lộ thiên. Bằng chứng kiểm thử: `tests/test_ai_tutor.js` (nhóm 1).
- [x] **Kiểm tra lọc bỏ khóa API khỏi thông báo lỗi (Key Redaction)**:
  - *Bằng chứng*: `src/lib/ai/providerAdapter.ts` tự động phát hiện và thay thế các chuỗi khóa `AIza...` hoặc `sk-...` bằng placeholder `[REDACTED_API_KEY]`. Bằng chứng kiểm thử: `tests/test_ai_tutor.js` (nhóm 1 & 3).
- [x] **Kiểm tra bảo vệ Test Case Ẩn (Hidden Tests Protection)**:
  - *Bằng chứng*: `src/lib/judge/runner.ts` xóa hoàn toàn `inputData` và `expectedOutput` của các test case có cờ `isHidden: true` trước khi trả kết quả về client. Bằng chứng kiểm thử: `tests/test_judge_engine.js` (nhóm 5).

---

### 1.6 Xác định Rủi ro & Tính năng Cần Bảo toàn (Risks & Invariants)
- [x] **Lập danh sách rủi ro kỹ thuật cần xử lý**:
  - *Bằng chứng*: Đã ghi nhận tại `TECHNICAL_RISKS.md` (Rủi ro CSS đơn khối, lỗi FOUC cache, xung đột theme Monaco, tải nặng Pyodide trên mobile, rủi ro vô tình làm lộ khóa khi đổi form).
- [x] **Lập danh sách các tính năng bất biến phải bảo toàn**:
  - *Bằng chứng*: Đã xác định rõ tại `PROJECT_OVERVIEW.md` và `IMPLEMENTATION_PLAN.md`: Bảo toàn 100% logic `authManager`, `runner`, `testCasesRepository`, `tutorService`, `reviewEngine`; giữ nguyên 70 routes tĩnh và 27 bộ kiểm thử tự động.

---

### 1.7 Bằng chứng về Tính Toàn vẹn Mã nguồn trong Phase 1 (Integrity Proof)
- [x] **Xác nhận KHÔNG chỉnh sửa mã nguồn ứng dụng trong Phase 1**:
  - *Lệnh kiểm tra*: `git status --porcelain src/ package.json tsconfig.json`
  - *Kết quả*: **Không có bất kỳ thay đổi nào trong `src/`, `package.json` hay cấu hình hệ thống**. Toàn bộ công việc trong Phase 1 chỉ tạo tài liệu phân tích trong thư mục `docs/project-audit/`.

---

## 2. Giới hạn Kiểm toán Hiện tại (Audit Limitations)

Mặc dù hệ thống đã được kiểm toán sâu rộng, các hạn chế sau đây cần được lưu ý minh bạch:
1. **Kiểm thử Supabase Trực tiếp trên Cloud**:
   - Các API route `/api/submissions` và `/api/review-queue` đã được kiểm chứng hoạt động hoàn hảo với adapter LocalStorage (Guest Mode) và bộ kiểm thử giả lập session token.
   - Việc kết nối tới cơ sở dữ liệu Supabase Production trực tiếp trên đám mây đòi hỏi dự án phải được cung cấp URL và Service Role Key thực tế trong `.env.local`.
2. **Kiểm thử Gọi Live LLM với Tài khoản Có phí**:
   - Logic kết nối tới Gemini API và OpenAI API, cơ chế bắt mã lỗi HTTP 401, 429, cơ chế giải mã AES-256-GCM và sinh prompt đã được kiểm thử 100% với các fixture và mock adapter.
   - Việc kiểm tra chất lượng câu trả lời thực tế từ mô hình `gemini-2.0-flash` hoặc `gpt-4o` phụ thuộc vào khóa API cá nhân của người học khi trải nghiệm thực tế.
3. **Thao tác Cảm ứng trên Thiết bị Di động Thực tế**:
   - Bố cục responsive đã được xác thực trên trình duyệt Chrome Headless tại kích thước viewport $390 \times 844\text{px}$.
   - Trải nghiệm gõ phím ảo trên bàn phím ảo của điện thoại iOS/Android thực tế với Monaco Editor phụ thuộc vào trình duyệt của thiết bị đầu cuối.

