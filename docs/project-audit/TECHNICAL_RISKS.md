# CODECOBUG — TECHNICAL RISKS & ARCHITECTURAL VULNERABILITIES
## (PHASE 1: COMPLETE PROJECT AUDIT)

**Tài liệu**: Đánh giá rủi ro kỹ thuật, phân tích nợ kiến trúc và danh mục cảnh báo trước khi tái cấu trúc Pastel London  
**Giai đoạn**: Phase 1 — Đọc và phân tích kiểm toán toàn diện (Read-Only Audit)  
**Mục tiêu**: Nhận diện trước mọi nguy cơ tiềm ẩn để ngăn ngừa hồi quy (regression) và bảo vệ an toàn hệ thống.

---

## 1. Rủi ro Kiến trúc CSS & Giao diện (CSS Architecture & Styling Risks)

### Rủi ro 1.1: Tệp `globals.css` đơn khối (Monolithic 1,424 dòng)
- **Mô tả hiện trạng**: Toàn bộ hệ thống giao diện, token màu sắc, reset CSS, utility classes, kiểu dáng modal, toast, layout app-shell, sidebar và mobile navigation đều nằm tập trung trong duy nhất một tệp `src/app/globals.css`.
- **Nguy cơ khi đổi sang Pastel London**:
  - Việc sửa trực tiếp hoặc ghi đè cẩu thả tệp `globals.css` có thể làm hỏng đột ngột layout của các màn hình phức tạp như `ExerciseWorkspace` (chia cột tỷ lệ, terminal cuộn, thanh công cụ Monaco).
  - Nguy cơ mất các luật trợ năng quan trọng như `:focus-visible`, `@media (prefers-reduced-motion: reduce)`, hoặc phá vỡ tỷ lệ tương phản WCAG AA/AAA đã được kiểm chứng.
- **Biện pháp phòng ngừa bắt buộc**:
  - Tách token màu sắc Pastel London thành một khối rõ ràng ở đầu tệp hoặc tệp token riêng (`tokens.css`).
  - Giữ nguyên các class layout cốt lõi: `.app-shell`, `.app-sidebar`, `.app-main-content`, `.workspace-container`, `.terminal-container`, `.modal-backdrop`.
  - Thay đổi màu nền, màu viền, đổ bóng và typography mà **không thay đổi cấu trúc Flexbox/Grid hay kích thước chiều cao của các thanh header/sidebar**.

---

### Rủi ro 1.2: Lỗi FOUC (Flash of Unstyled Content) do Lệch Cache Bundle
- **Mô tả hiện trạng**: Như đã phân tích ở các lần kiểm thử trước, khi chạy `next build` trong khi một tiến trình `next dev` cũ đang chạy, hash chunk CSS trong `.next` bị thay đổi khiến trình duyệt nhận mã HTML trỏ tới tệp CSS cũ bị 404, dẫn đến việc giao diện bị hiển thị dưới dạng HTML thô (font Times New Roman, nút viền xám).
- **Nguy cơ**: Người học hoặc tester có thể hoảng sợ tưởng website bị mất giao diện khi tải trang.
- **Biện pháp phòng ngừa**:
  - Luôn đảm bảo tắt sạch các tiến trình Node.js cũ trước khi chạy bản build mới.
  - Hướng dẫn học viên cơ chế Hard Refresh (`Cmd + Shift + R` / `Ctrl + F5`) trong tài liệu bàn giao.
  - Cấu hình Cache-Control hợp lý cho các tài nguyên tĩnh trong `next.config.ts`.

---

## 2. Rủi ro Tương thích Trình soạn thảo & Runtime (Editor & Runtime Risks)

### Rủi ro 2.1: Xung đột Theme giữa Monaco Editor và Màu nền Pastel London
- **Mô tả hiện trạng**: Monaco Editor (`@monaco-editor/react`) có hệ thống theme nội bộ riêng (`vs-dark`, `light`). Hiện tại khu vực gõ code sử dụng theme tối (`vs-dark`) tương phản với nền sáng bên ngoài.
- **Nguy cơ**: Khi chuyển sang phong cách Pastel London với tông màu sương mù xám, kem trà chiều hoặc xanh pastel, nếu đổi theme Monaco không khéo có thể làm mất độ tương phản cú pháp (Syntax Highlighting) của Python, khiến học viên bị mỏi mắt hoặc khó đọc code.
- **Biện pháp phòng ngừa**:
  - Giữ vững khu vực code editor và terminal ở chế độ tối tinh tế (Dark Slate `#1B2332` hoặc London Fog Dark `#1E2430`), tạo cảm giác phòng lab chuyên nghiệp tương phản sang trọng với các tấm panel pastel xung quanh.
  - Kiểm tra kỹ độ hiển thị của con trỏ chuột, dòng đang chọn (active line) và gợi ý cú pháp (IntelliSense dropdown).

---

### Rủi ro 2.2: Tải nặng Pyodide WebAssembly trên Đường truyền Chậm
- **Mô tả hiện trạng**: Pyodide tải gói WebAssembly (~10MB-15MB) từ CDN hoặc cache cục bộ khi mở phòng lab lần đầu.
- **Nguy cơ**: Nếu người dùng có mạng yếu hoặc lần đầu truy cập, việc tải Pyodide có thể mất vài giây. Nếu không có trạng thái loading rõ ràng, người dùng có thể bấm "Chạy thử" nhiều lần gây lỗi race condition.
- **Biện pháp phòng ngừa**:
  - Bảo toàn trạng thái `isPyodideReady` và chỉ báo `Loading Python...` trên thanh công cụ của `ExerciseWorkspace`.
  - Giữ nguyên cơ chế singleton `cachedPyodide` trong `PyodideClient.ts` để chỉ khởi tạo duy nhất một lần trong suốt phiên làm việc.

---

## 3. Rủi ro Bảo mật Khóa API AI (AI Credential Security Risks)

### Rủi ro 3.1: Vô tình làm Lộ Khóa API trong Quá trình Thiết kế lại Form
- **Mô tả hiện trạng**: Modal `AISettingsModal.tsx` hiện đang mã hóa khóa bằng `AES-256-GCM`, che mờ khóa trên ô input (`AIzaSy...stuv`), và `AIProviderAdapter` có bộ lọc tự động che khóa khỏi log lỗi.
- **Nguy cơ**: Khi thiết kế lại giao diện Form theo phong cách Pastel London, nếu lập trình viên thay thế component `Input` bằng input HTML thô hoặc bỏ quên hàm `maskApiKey()`, khóa API có thể bị hiển thị dạng clear-text trên màn hình hoặc lọt vào dev tools.
- **Biện pháp phòng ngừa**:
  - Tuyệt đối giữ nguyên logic trong `AISettingsModal.tsx` và `crypto.ts`.
  - Chỉ thay đổi các lớp CSS (class name) và màu sắc thẻ bọc ngoài, giữ nguyên toàn bộ state management và encryption handlers.
  - Chạy lại bộ test bảo mật `tests/test_ai_tutor.js` sau bất kỳ thay đổi nào liên quan đến Modal cài đặt.

---

## 4. Rủi ro Dữ liệu Học viên & Tiến độ (Data & Progress Integrity Risks)

### Rủi ro 4.1: Nguy cơ "Hoàn thành Ảo" (Premature Lesson Completion)
- **Mô tả hiện trạng**: Một bài học chỉ được chuyển trạng thái `completed` khi và chỉ khi 100% bài tập liên kết có kết quả `accepted`.
- **Nguy cơ**: Nếu khi tái cấu trúc trang chi tiết bài học (`LessonDetail.tsx`) hoặc trang tổng quan (`LearningDashboard.tsx`), lập trình viên thêm nhầm một nút "Đánh dấu hoàn thành" thủ công, logic tiến độ thực chứng sẽ bị phá vỡ, dẫn tới dữ liệu năng lực học viên bị sai lệch.
- **Biện pháp phòng ngừa**:
  - Giữ vững quy tắc: **Không bao giờ có nút bấm tự đánh dấu hoàn thành bài học thủ công**.
  - Trạng thái hoàn thành bài học phải luôn được suy ra tự động từ kết quả bài tập đã chấm trong `authManager`.

---

## 5. Rủi ro Tương thích Thiết bị Di động (Mobile UX Risks)

### Rủi ro 5.1: Xung đột Thao tác Cuộn (Scroll Chaining) trong Phòng Lab
- **Mô tả hiện trạng**: Trên màn hình di động ($390\text{px}$), phòng lab gồm: Tab Đề bài, Tab Code Editor, và Tab Terminal Output.
- **Nguy cơ**: Trên thiết bị cảm ứng, thao tác cuộn bên trong Monaco Editor có thể bị xung đột với thao tác cuộn toàn trang nếu không có `touch-action` và thanh tab chuyển đổi riêng biệt.
- **Biện pháp phòng ngừa**:
  - Bảo tồn hệ thống tab chuyển đổi trên mobile: `[Đề bài]`, `[Mã nguồn]`, `[Terminal]`.
  - Đảm bảo các nút bấm điều khiển chính ("Chạy thử", "Nộp bài", "AI Tutor") luôn có diện tích chạm (Touch Target) $\ge 44 \times 44\text{px}$ theo chuẩn WCAG 2.1.

