# CodeCoBUG Page Catalog

> **Tài liệu kiểm kê cấu trúc các trang:** Phân tích chi tiết 100% các route giao diện tìm thấy trong source code CodeCoBUG.

---

### Page 1: Dashboard Học Tập (Home Page)

- **Route:** `/`
- **Main source file:** `src/app/page.tsx`
- **Layout:** `AppShell` (`src/components/layout/AppShell.tsx`)
- **Purpose:** Màn hình chính sau khi truy cập ứng dụng, hiển thị tổng quan tiến trình học tập cá nhân, vệt ngày học (streak), thành tích và danh sách các chương trình Python.
- **Authentication requirements:** Hỗ trợ cả hai chế độ: Chế độ Khách (Guest LocalStorage Mode) và Người dùng đăng nhập (Supabase Auth). Không chặn truy cập nếu chưa đăng nhập.
- **Main sections:**
  1. *Hero Welcome Banner:* Lời chào theo tên người học, danh hiệu hiện tại và chip số ngày vệt học tập (Streak) nổi bật sắc vàng pastel.
  2. *Quick Stats Grid:* 4 thẻ thống kê nhanh (Bài đã hoàn thành / Tổng số bài, Điểm kinh nghiệm XP, Tỷ lệ chấm đạt, Huy hiệu đạt được).
  3. *Resume Learning Card:* Khối đề xuất tiếp tục bài học dang dở với nút "Học tiếp ngay" chuyển thẳng vào Workspace.
  4. *Chapters Roadmap Grid:* Danh sách 12 chương trình học hiển thị dưới dạng lưới thẻ pastel, thanh tiến độ % hoàn thành, số lượng bài học và cấp độ.
- **Components:** `AppShell`, `LearningDashboard`, `Card`, `Badge`, `Button`, `Sidebar`, `MobileNav`, `AuthModal`, `AISettingsModal`, `HelpModal`, `WeaknessTrackerModal`.
- **Data sources:** `src/lib/curriculum/curriculumRegistry.ts`, `localStorage` (`codecobug_submissions`, `codecobug_user_profile`).
- **Interactive elements:** Nút "Bắt đầu học", Nút "Xem lộ trình", Thẻ chương trình nhấp để điều hướng, Nút mở Cài đặt AI, Nút Đăng nhập/Đăng xuất.
- **Responsive behavior:**
  - *Desktop (>1024px):* Sidebar bên trái cố định (260px), nội dung chính bên phải trải rộng, lưới chương trình chia 2-3 cột.
  - *Tablet (768px-1024px):* Lưới chuyển thành 2 cột, khoảng cách đệm co giãn.
  - *Mobile (<768px):* Sidebar ẩn hoàn toàn, chuyển sang MobileNav ở đáy màn hình, lưới chuyển về 1 cột dọc (stacked cards).
- **Loading state:** Hiển thị khung Skeleton Cards nhấp nháy pastel nhẹ trong khi nạp tiến độ từ localStorage.
- **Empty state:** Khi là tài khoản mới, thanh tiến độ hiển thị 0%, streak = 1 ngày, gợi ý bắt đầu từ Bài 1 Chương 1.
- **Error state:** Hiển thị thông báo lỗi nhẹ dạng Card khi không đọc được dữ liệu cấu hình.
- **Accessibility:** Thẻ ngữ nghĩa `main`, `nav`, `aside`, nhãn `aria-label` cho các nút bấm điều hướng.
- **Evidence / source paths:** `src/app/page.tsx`, `src/components/dashboard/LearningDashboard.tsx`.

---

### Page 2: Danh Mục Lộ Trình (Curriculum Browser)

- **Route:** `/curriculum`
- **Main source file:** `src/app/curriculum/page.tsx`
- **Layout:** `AppShell` (`src/components/layout/AppShell.tsx`)
- **Purpose:** Khám phá toàn diện 12 chương (120 bài học) chuẩn Python từ Cơ bản đến Nâng cao, lọc theo chủ đề và độ khó.
- **Authentication requirements:** Công khai cho tất cả người dùng (Public).
- **Main sections:**
  1. *Header Lộ trình:* Tiêu đề trang, thanh tìm kiếm thời gian thực (Search bar) và các nút lọc nhanh độ khó (Tất cả, Cơ bản, Trung bình, Nâng cao).
  2. *Thống kê tóm tắt:* Tổng số chương, tổng số bài học, số bài đã giải thành công.
  3. *Danh sách chương (Accordion list):* 12 thẻ chương với tiêu đề, mô tả ngắn, danh sách các bài học con kèm trạng thái (Chưa học, Đã hoàn thành).
- **Components:** `AppShell`, `CurriculumBrowser`, `Card`, `Badge`, `Button`, `Input`.
- **Data sources:** `src/lib/curriculum/curriculumRegistry.ts`, `curriculumRegistry.getAllChapters()`.
- **Interactive elements:** Ô gõ tìm kiếm bài học tức thì, Nút chọn độ khó (Filter Chips), Nút bấm vào từng bài học để chuyển sang URL `/exercises/[exerciseSlug]`.
- **Responsive behavior:** Ô tìm kiếm co giãn 100% trên điện thoại, các thẻ bài học xếp chồng gọn gàng, thanh lọc độ khó hỗ trợ cuộn ngang (horizontal scroll).
- **Loading state:** Render tức thì từ Client Registry tĩnh, không có độ trễ mạng.
- **Empty state:** Khi tìm kiếm không có kết quả, hiển thị thông báo "Không tìm thấy bài học phù hợp với từ khóa" kèm nút "Đặt lại bộ lọc".
- **Error state:** Not found in inspected source (dữ liệu tĩnh đảm bảo luôn khả dụng).
- **Accessibility:** Sử dụng phím `Tab` để di chuyển qua từng bài học, độ tương phản văn bản chuẩn WCAG AA.
- **Evidence / source paths:** `src/app/curriculum/page.tsx`, `src/components/curriculum/CurriculumBrowser.tsx`.

---

### Page 3: Phòng Thí Nghiệm Lập Trình (Exercise Workspace)

- **Route:** `/exercises/[exerciseSlug]`
- **Main source file:** `src/app/exercises/[exerciseSlug]/page.tsx`
- **Layout:** Không dùng AppShell để tối đa hóa diện tích làm việc (Full-screen IDE Layout).
- **Purpose:** Không gian thực hành coding chuyên sâu: Đọc đề bài, viết code Python trên Monaco Editor, chạy code với Pyodide WebAssembly và hỏi đáp gia sư AI Socratic.
- **Authentication requirements:** Cho phép làm bài và chạy code tự do không cần đăng nhập; lưu lịch sử nộp bài vào localStorage (hoặc đồng bộ Supabase nếu đã đăng nhập).
- **Main sections:**
  1. *Top Navigation Bar:* Nút quay lại (`<- Lộ trình`), Tiêu đề bài tập hiện tại, Badge cấp độ, Nút Cài đặt AI (bánh răng), Nút Hướng dẫn.
  2. *Cột Trái (Problem Statement):* Đề bài, định dạng Input/Output, ví dụ mẫu (Test cases), hệ thống mở gợi ý (Hints).
  3. *Cột Giữa (Code Studio):*
     - *Phía trên:* Monaco Code Editor với tính năng đánh số dòng, format code, phím tắt Ctrl+Enter.
     - *Phía dưới:* Terminal Output với 3 Tab: Kết quả (Stdout), Chấm bài (Test Cases), Lỗi (Traceback).
  4. *Cột Phải (AI Tutor Studio):* Khung trò chuyện với Gia sư AI Socratic, nút gợi ý nhanh, lịch sử tin nhắn.
- **Components:** `ExerciseWorkspace`, `ProblemStatement`, `CodeEditor`, `TerminalOutput`, `AITutorPanel`, `AISettingsModal`, `HelpModal`, `AuthModal`.
- **Data sources:** `curriculumRegistry.getExerciseBySlug(slug)`, hook `usePyodide`, `submissionStore`.
- **Interactive elements:**
  - Nút "Chạy thử (Run)" (`Ctrl+Enter` / `Cmd+Enter`).
  - Nút "Nộp bài (Submit)" gọi hệ thống so khớp Test Case.
  - Nút "Lấy gợi ý (Hint)" mở dần từng mức độ trợ giúp.
  - Nút "Hỏi AI" gửi mã nguồn hiện tại sang AI Tutor để nhận phân tích Socratic.
  - Chuyển tab Terminal (Stdout / Tests / Errors).
- **Responsive behavior:**
  - *Desktop (>1024px):* 3 cột song song (Problem 360px - Editor linh hoạt - AI Tutor 380px).
  - *Tablet (768px-1024px):* 2 cột (Đề bài & Editor), AI Tutor chuyển thành Modal bật lên khi cần.
  - *Mobile (<768px):* Chuyển thành hệ thống 3 Tab toàn màn hình: Tab Đề bài | Tab Soạn thảo & Chạy | Tab Hỏi AI.
- **Loading state:** Hiển thị biểu tượng Spinner khi Pyodide WebAssembly đang tải môi trường Python Runtime (~2-3s lần đầu).
- **Empty state:** Nếu URL `slug` không hợp lệ, hiển thị nút quay lại danh sách bài tập.
- **Error state:** Lỗi cú pháp và runtime của code người dùng được phân loại rõ ràng trong Tab Errors và hiển thị nút "Hỏi AI để sửa lỗi này".
- **Accessibility:** Monaco Editor hỗ trợ hoàn toàn bàn phím, các nút bấm có tooltip mô tả phím tắt rõ ràng.
- **Evidence / source paths:** `src/app/exercises/[exerciseSlug]/page.tsx`, `src/components/workspace/ExerciseWorkspace.tsx`.

---

### Page 4: Trang 404 Không Tìm Thấy (Not Found)

- **Route:** Bất kỳ đường dẫn không hợp lệ nào (ví dụ: `/exercises/khong-ton-tai`)
- **Main source file:** `src/app/not-found.tsx`
- **Layout:** Standalone centered container với nền pastel mint nhẹ (`var(--pastel-mint-light)`).
- **Purpose:** Dẫn hướng người học quay trở lại nơi an toàn khi gặp link lỗi hoặc bài tập chưa công bố.
- **Main sections:**
  - Biểu tượng la bàn hoạt họa pastel (`Compass` icon).
  - Tiêu đề lớn: `404 — Không tìm thấy bài học này!`.
  - Mô tả giải thích thân thiện cho lứa tuổi học sinh.
  - Nhóm 2 nút điều hướng chính: "Về Trang Chủ" và "Xem Lộ Trình Học".
- **Components:** `Button`, `lucide-react` icons.
- **Evidence / source paths:** `src/app/not-found.tsx`.

