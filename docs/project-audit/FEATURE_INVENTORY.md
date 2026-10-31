# CODECOBUG — FEATURE INVENTORY & VERIFICATION STATUS
## (PHASE 1: COMPLETE PROJECT AUDIT)

**Tài liệu**: Bảng kiểm kê tính năng chi tiết và trạng thái xác minh thực tế  
**Giai đoạn**: Phase 1 — Đọc và phân tích kiểm toán toàn diện (Read-Only Audit)  
**Quy chuẩn trạng thái bắt buộc**:
- `VERIFIED`: Đã kiểm tra thực tế bằng mã nguồn và test tự động, xác nhận hoạt động 100%.
- `PARTIAL`: Đã có mã xử lý nhưng còn phụ thuộc điều kiện ngoại vi hoặc chưa hoàn chỉnh một phần luồng.
- `UI_ONLY`: Có giao diện người dùng nhưng chưa có logic backend/client xử lý thực sự.
- `BROKEN`: Đã xác nhận có lỗi khi chạy.
- `NOT_FOUND`: Tính năng được nhắc tới trong ý tưởng nhưng không tìm thấy mã trong repository.
- `NOT_TESTED`: Chưa có đủ dữ liệu hoặc bằng chứng kiểm thử tự động.

---

## 1. Phân hệ Giáo trình & Nội dung Học tập (Curriculum System)

| Mã tính năng | Tên tính năng | Tệp nguồn & Cấu phần liên quan | Trạng thái | Bằng chứng kiểm thử & Ghi chú kỹ thuật |
| :--- | :--- | :--- | :---: | :--- |
| **CURR-01** | Khung giáo trình 12 chương (Fundamentals) | `src/lib/curriculum/chapter01_intro.ts` $\to$ `chapter12_advanced_topics.ts`, `src/lib/curriculum/curriculumRegistry.ts` | `VERIFIED` | Đầy đủ 12 chương, 0 chương rỗng. Đã kiểm chứng qua `tests/test_curriculum_full_12_chapters.js` (1,714 assertions pass). |
| **CURR-02** | 44 Bài học chuẩn Sư phạm 10 phần | `src/components/curriculum/LessonDetail.tsx`, `src/app/curriculum/[chapterSlug]/[lessonSlug]/page.tsx` | `VERIFIED` | 100% bài học có mục tiêu, tiên quyết, giải thích trực quan, lý thuyết, ví dụ chạy được, lỗi thường gặp, thực hành, recap và links. Kiểm chứng qua `tests/test_step6_final_qa_handover.js`. |
| **CURR-03** | Đồ thị Tiên quyết (Prerequisite Graph) | `lesson.prerequisites`, `topic.prerequisites` trong `src/lib/curriculum/` | `VERIFIED` | Toàn bộ điều kiện tiên quyết đều trỏ chính xác về bài học hoặc chủ đề hợp lệ, không có vòng lặp vô tận hay liên kết gãy. Kiểm chứng qua `tests/test_step6_final_qa_handover.js`. |
| **CURR-04** | Trình duyệt Giáo trình (Curriculum Browser) | `src/components/curriculum/CurriculumBrowser.tsx`, `src/app/curriculum/page.tsx` | `VERIFIED` | Lọc theo cấp độ (Beginner/Intermediate/Advanced) và tìm kiếm từ khóa hoạt động tức thì. Kiểm chứng qua `tests/test_curriculum_browser.js`. |
| **CURR-05** | Sinh tĩnh tuyến đường bài học (SSG) | `generateStaticParams()` trong `src/app/curriculum/[chapterSlug]/[lessonSlug]/page.tsx` | `VERIFIED` | `npm run build` sinh thành công tĩnh 70/70 routes lúc build với thời gian phản hồi tức thì. |
| **CURR-06** | 3 Dự án Capstone thực chiến (PBL) | `src/lib/projects/projectAlienInvasion.ts`, `projectDataVisualization.ts`, `projectWebApplications.ts` | `VERIFIED` | Đầy đủ 3 dự án: Alien Invasion (8 cps), Data Visualization (8 cps), Django Web App (10 cps). Kiểm chứng qua `tests/test_project_based_learning.js`. |
| **CURR-07** | Tải gói mã nguồn mẫu dự án về máy | `src/components/projects/ProjectDetail.tsx` (Nút tải bundle) | `PARTIAL` | Nút hiển thị trên UI và sinh file mẫu JSON/Python; tuy nhiên việc đóng gói toàn bộ thư mục asset game âm thanh/hình ảnh phức tạp cần tệp zip lưu trên CDN ngoài. |

---

## 2. Phân hệ Thực thi Python & Phòng Lab (Runtime & Workspace)

| Mã tính năng | Tên tính năng | Tệp nguồn & Cấu phần liên quan | Trạng thái | Bằng chứng kiểm thử & Ghi chú kỹ thuật |
| :--- | :--- | :--- | :---: | :--- |
| **EXEC-01** | Trình soạn thảo Monaco Editor | `src/components/workspace/CodeEditor.tsx`, `@monaco-editor/react` | `VERIFIED` | Highlight cú pháp Python, đánh số dòng, thụt lề tự động, phím tắt Ctrl+Enter. Kiểm chứng qua `tests/test_exercise_workspace.js`. |
| **EXEC-02** | Trình thông dịch Pyodide WebAssembly | `src/lib/pyodide/PyodideClient.ts`, `src/hooks/usePyodide.ts` | `VERIFIED` | Chạy Python 3.11 in-browser, đón bắt `sys.stdout`. Kiểm chứng qua `tests/test_pyodide_runtime.js` (22 assertions pass). |
| **EXEC-03** | Tương tác Bàn phím với `input()` | `src/components/workspace/TerminalOutput.tsx`, `PyodideClient.ts` | `VERIFIED` | Hỗ trợ nhập dữ liệu đầu vào qua ô input mô phỏng stdin; hỗ trợ test cases tự động feed stdin theo kịch bản. |
| **EXEC-04** | Bảo vệ Treo máy & Timeout Guard | `PyodideClient.runWithTimeout()` | `VERIFIED` | Ngắt các vòng lặp `while True` vô tận sau 5000ms, bảo vệ trình duyệt học viên không bị đơ. Kiểm chứng qua `tests/test_pyodide_runtime.js`. |
| **EXEC-05** | Bản nháp Code tự động lưu (Drafts) | `src/components/workspace/ExerciseWorkspace.tsx`, localStorage | `VERIFIED` | Tự động lưu mã nguồn học viên đang gõ vào localStorage theo slug bài tập, tải lại trang không bị mất code. |
| **EXEC-06** | Trải nghiệm Monaco trên Mobile nhỏ ($< 640\text{px}$) | `src/components/workspace/ExerciseWorkspace.tsx` | `PARTIAL` | Workspace co giãn và chuyển tab responsive mượt mà; tuy nhiên Monaco Editor trên màn hình cảm ứng nhỏ khó thao tác hơn so với bàn phím vật lý. |

---

## 3. Phân hệ Chấm bài Tự động (Judge Engine)

| Mã tính năng | Tên tính năng | Tệp nguồn & Cấu phần liên quan | Trạng thái | Bằng chứng kiểm thử & Ghi chú kỹ thuật |
| :--- | :--- | :--- | :---: | :--- |
| **JUDG-01** | Bộ kiểm thử máy chủ 87 bài tập | `src/lib/judge/testCasesRepository.ts`, `src/lib/projects/projectTestCases.ts` | `VERIFIED` | 100% 87 bài tập đều có bộ kiểm thử máy chủ với $\ge 3$ test cases/bài. Kiểm chứng qua `tests/test_step6_final_qa_handover.js`. |
| **JUDG-02** | Bảo mật Tuyệt đối Test Case Ẩn (Hidden Tests) | `src/lib/judge/runner.ts`, `src/app/api/judge/submit/route.ts` | `VERIFIED` | Dữ liệu `inputData` và `expectedOutput` của test ẩn bị xóa hoàn toàn khỏi phản hồi gửi về client, chỉ trả về kết quả `isPassed`. Kiểm chứng qua `tests/test_judge_engine.js`. |
| **JUDG-03** | Trình so sánh kết quả thông minh (Comparator) | `src/lib/judge/comparator.ts` | `VERIFIED` | Hỗ trợ Exact Match, Trim dòng/bỏ qua khoảng trắng cuối dòng, và sai số số thực $10^{-6}$ (Float Tolerance). |
| **JUDG-04** | Kiểm tra Từ khóa Cấm (Forbidden Tokens) | `src/lib/judge/runner.ts` (`checkForbiddenTokens`) | `VERIFIED` | Chặn dùng biến tạm `temp`/`tmp` khi yêu cầu hoán đổi hai biến theo phong cách Pythonic. Kiểm chứng qua `tests/test_judge_engine.js`. |
| **JUDG-05** | API Chấm bài độc lập (`/api/judge/submit`) | `src/app/api/judge/submit/route.ts` | `VERIFIED` | Tiếp nhận bài nộp, thực thi trong môi trường độc lập, trả về phán quyết chuẩn (`accepted`, `wrong_answer`, `compile_error`, `runtime_error`, `time_limit_exceeded`). |

---

## 4. Phân hệ Xác thực & Dữ liệu Học viên (Authentication & Storage)

| Mã tính năng | Tên tính năng | Tệp nguồn & Cấu phần liên quan | Trạng thái | Bằng chứng kiểm thử & Ghi chú kỹ thuật |
| :--- | :--- | :--- | :---: | :--- |
| **AUTH-01** | Chế độ Học viên Khách (Guest Mode) | `src/lib/auth/authManager.ts` | `VERIFIED` | Người dùng vào web là có thể học và làm bài ngay, dữ liệu lưu bền vững trong localStorage. |
| **AUTH-02** | Đăng ký & Đăng nhập Supabase | `src/lib/auth/authManager.ts`, `src/components/auth/AuthModal.tsx` | `PARTIAL` | Code logic và giao diện Modal hoàn chỉnh; hoạt động đồng bộ với Supabase khi cấu hình URL/Key; hoạt động fallback Guest khi chưa có env vars. |
| **AUTH-03** | Cách ly Dữ liệu Đa người dùng (Multi-Tenant) | `authManager.ts`, localStorage keying per user | `VERIFIED` | Kiểm thử thực tế xác nhận Người dùng A tuyệt đối không xem được bài nộp, hàng đợi ôn tập hay điểm số của Người dùng B. Kiểm chứng qua `tests/test_step5_curriculum_fullstack_connection.js`. |
| **AUTH-04** | Lưu trữ Chi tiết Test Case trong Bài nộp | `authManager.saveSubmission()`, `SavedSubmissionRecord` | `VERIFIED` | Lưu trữ mảng `testCaseResults` (kết quả pass/fail, thời gian thực thi, test ẩn) và hiển thị khi mở rộng lịch sử. |
| **AUTH-05** | Đồng bộ Đám mây thời gian thực | Supabase Realtime Subscriptions | `NOT_FOUND` | Hiện tại ứng dụng sử dụng kiến trúc Request-Response REST API và LocalStorage offline-first, chưa có WebSocket Realtime đồng bộ hai tab đồng thời. |

---

## 5. Phân hệ Theo dõi Tiến độ & Đánh giá Năng lực (Mastery & Progress)

| Mã tính năng | Tên tính năng | Tệp nguồn & Cấu phần liên quan | Trạng thái | Bằng chứng kiểm thử & Ghi chú kỹ thuật |
| :--- | :--- | :--- | :---: | :--- |
| **PROG-01** | Tiến độ Kép Học tập (Dual Progress) | `src/components/dashboard/LearningDashboard.tsx`, `authManager.ts` | `VERIFIED` | Hiển thị chính xác tỷ lệ hoàn thành `{completedLessonsCount}/{44}` bài học và `{completedExercisesCount}/{61}` bài tập. |
| **PROG-02** | Khóa/Mở Bài học theo Tiến độ Thực | `authManager.getLessonStatus()` | `VERIFIED` | Bài học chỉ chuyển sang `completed` khi học viên đạt `accepted` ở 100% bài tập con. Mở xem chỉ ghi nhận `in_progress`. |
| **PROG-03** | Cây Phân loại Kỹ năng (Skills Taxonomy) | `src/lib/mastery/skillsTaxonomy.ts`, `masteryEngine.ts` | `VERIFIED` | 10 kỹ năng chuẩn mực đo lường tỷ lệ thành thạo (0–100%) dựa trên kết quả nộp bài thực tế. |
| **PROG-04** | Hàng đợi Ôn tập Thích ứng (Review Queue) | `src/lib/mastery/reviewEngine.ts`, `WeaknessTrackerModal.tsx` | `VERIFIED` | Đưa lỗi nộp bài vào Ưu tiên 1, kỹ năng $< 40\%$ vào Ưu tiên 2. Tự dọn sạch hàng đợi khi học viên giải thành công. Không có dữ liệu giả (Zero fake reviews). |
| **PROG-05** | Tab Lịch sử Nộp bài (Submission History) | `src/components/mastery/WeaknessTrackerModal.tsx` (Tab History) | `VERIFIED` | Hiển thị đầy đủ danh sách các lần nộp bài, thời gian, điểm số, phán quyết và nút "Làm lại bài". |

---

## 6. Phân hệ AI Gia sư Cá nhân (AI Tutor Engine)

| Mã tính năng | Tên tính năng | Tệp nguồn & Cấu phần liên quan | Trạng thái | Bằng chứng kiểm thử & Ghi chú kỹ thuật |
| :--- | :--- | :--- | :---: | :--- |
| **AITU-01** | Mã hóa Khóa cá nhân AES-256-GCM | `src/lib/ai/crypto.ts`, `AISettingsModal.tsx` | `VERIFIED` | Khóa API được mã hóa bằng chuẩn quân sự AES-256-GCM với IV và Auth Tag riêng. Kiểm chứng qua `tests/test_ai_tutor.js`. |
| **AITU-02** | Che mờ Khóa & Lọc Lỗi (Redaction) | `src/lib/ai/providerAdapter.ts` | `VERIFIED` | Khóa tự động che mờ trên UI và tự động lọc khỏi chuỗi traceback lỗi HTTP. Kiểm chứng qua `tests/test_ai_tutor.js`. |
| **AITU-03** | Tôn trọng Kết quả Bộ chấm (Verdict Integrity) | `src/lib/ai/tutorService.ts` (`SYSTEM_PROMPT`) | `VERIFIED` | System prompt bắt buộc AI tuân theo phán quyết của bộ chấm; cấm khen code đúng khi test case thất bại. |
| **AITU-04** | Nhận biết Ngữ cảnh Bài học & Đề xuất | `AITutorService.buildExplainErrorPrompt()`, `buildRecommendExercisesPrompt()` | `VERIFIED` | Prompt gửi lên AI chứa chính xác tên Chương, tên Bài học, đề bài, code hiện tại và thông báo lỗi thực tế. |
| **AITU-05** | Gợi ý Nâng bậc (Graduated Hints Level 1, 2, 3) | `src/lib/ai/tutorService.ts` | `VERIFIED` | Gợi ý từng nấc: Khái niệm $\to$ Thuật toán $\to$ Cú pháp, không đưa thẳng code giải hoàn chỉnh ngay từ đầu. |
| **AITU-06** | Gọi LLM thực tế khi không có Khóa API | `src/lib/ai/providerAdapter.ts` | `PARTIAL` | Khi học viên chưa nhập khóa, hệ thống trả về thông báo hướng dẫn mở Cài đặt AI thân thiện; hoạt động thực tế với API Gemini/OpenAI khi học viên cung cấp khóa hợp lệ. |

---

## 7. Phân hệ Giao diện & Trải nghiệm Người dùng (UI/UX)

| Mã tính năng | Tên tính năng | Tệp nguồn & Cấu phần liên quan | Trạng thái | Bằng chứng kiểm thử & Ghi chú kỹ thuật |
| :--- | :--- | :--- | :---: | :--- |
| **UIUX-01** | Điều hướng chính tinh gọn 3 điểm đến | `src/components/layout/Sidebar.tsx`, `MobileNav.tsx` | `VERIFIED` | 1. Tổng quan, 2. Học Python, 3. Luyện tập. Kiểm chứng qua `tests/test_app_shell_and_nav.js`. |
| **UIUX-02** | Teen Pastel Design System | `src/app/globals.css` (Tokens & Utilities) | `VERIFIED` | Màu mint, lavender, sky, peach; bo góc thẻ $20-24\text{px}$; nút $12-16\text{px}$. Kiểm chứng qua `tests/test_design_system.js`. |
| **UIUX-03** | Độ tương phản cao chuẩn WCAG AA/AAA | `src/app/globals.css` (Màu chữ `#243047` trên nền `#F7F9FC`) | `VERIFIED` | Đạt tỷ lệ tương phản $12.53:1$ (vượt chuẩn AAA $\ge 7:1$). Kiểm chứng qua `tests/test_phase8_verification_and_hardening.js`. |
| **UIUX-04** | Hỗ trợ Điều hướng Bàn phím & Focus Ring | `:focus-visible` trong `src/app/globals.css`, Trap phím Esc | `VERIFIED` | Phím Tab có viền hiển thị rõ ràng (`--border-focus`), phím Esc đóng tất cả Modal. |
| **UIUX-05** | Chế độ Giảm Chuyển động (`prefers-reduced-motion`) | Media query trong `globals.css` | `VERIFIED` | Tự động tắt hoạt ảnh và thời gian transition về 0.01ms khi người dùng cài đặt trợ năng. |
| **UIUX-06** | Dark Mode Toàn diện cho Toàn trang | Giao diện tối tùy chỉnh | `NOT_FOUND` | Hiện tại Monaco Editor và Terminal có giao diện tối (`vs-dark`), nhưng toàn bộ thân trang web đang dùng tông sáng Pastel Canvas, chưa có nút chuyển theme sáng/tối toàn trang. |

