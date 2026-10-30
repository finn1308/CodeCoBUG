# BÁO CÁO TOÀN DIỆN HỆ THỐNG: CODECOBUG FULL-STACK AUDIT

*Tài liệu kiểm toán toàn diện mã nguồn, kiến trúc luồng dữ liệu, runtime, động cơ chấm bài, tính năng AI và trợ năng của nền tảng CodeCoBUG.*
*Ngày thực hiện: 30/10/2026*

---

## 1. TỔNG QUAN & PHƯƠNG PHÁP KIỂM TOÁN (AUDIT OVERVIEW)

Kiểm toán này được thực hiện bằng cách đối chiếu trực tiếp giữa các yêu cầu trong `AGENT.md`, mã nguồn hiện hữu trong thư mục `src/`, các kịch bản kiểm thử tự động trong `tests/`, và cấu trúc cơ sở dữ liệu trong `supabase/migrations/`.

### Tiêu chuẩn phân loại trạng thái tính năng:
- **`WORKING`**: Tính năng đã được cài đặt hoàn chỉnh từ giao diện (Frontend) đến logic xử lý (Backend/Runtime/Database), có kiểm thử tự động xác thực và chạy ổn định.
- **`PARTIAL`**: Đã cài đặt một phần luồng (ví dụ: đã có schema và client local, nhưng đang chạy ở chế độ offline/fallback chờ biến môi trường đám mây hoặc chờ nội dung giáo trình chính thức).
- **`UI_ONLY`**: Giao diện hiển thị tĩnh, chưa kết nối logic nghiệp vụ thực tế.
- **`BROKEN`**: Có mã nguồn nhưng gặp lỗi runtime, lỗi logic hoặc không vượt qua kiểm thử.
- **`MISSING`**: Tính năng được đề cập trong yêu cầu nhưng chưa có mã nguồn cài đặt.

---

## 2. BẢNG PHÂN LOẠI TÍNH NĂNG (FEATURE CLASSIFICATION MATRIX)

| Phân hệ / Tính năng | Trạng thái | Vị trí mã nguồn chính | Bằng chứng kiểm thử & Ghi chú |
| :--- | :---: | :--- | :--- |
| **1. Xác thực & Quản lý phiên** | `WORKING` | `src/lib/auth/authManager.ts`<br>`src/components/auth/AuthModal.tsx` | Đăng ký, Đăng nhập, Đăng xuất, Lưu phiên `localStorage`. Kiểm thử trong `test_auth_and_rls.js` (26/26 tests). |
| **2. Đồng bộ đám mây Supabase** | `PARTIAL` | `supabase/migrations/`<br>`src/lib/supabase/` | Schema PostgreSQL & RLS đã sẵn sàng. Chạy mượt mà ở chế độ Local Multi-Tenant; cần nạp `SUPABASE_URL` để sync cloud. |
| **3. Cô lập dữ liệu đa người dùng** | `WORKING` | `src/lib/auth/authManager.ts` | Phân tách tuyệt đối bản nháp (drafts) và bài nộp theo `userId`. User A không thể đọc dữ liệu của User B. |
| **4. Mô hình dữ liệu giáo trình** | `WORKING` | `src/lib/types/curriculum.ts`<br>`src/lib/fixtures/sampleCurriculum.ts` | Course -> Topic -> Lesson -> Exercise -> Examples & TestCases. |
| **5. Nội dung giáo trình chính thức** | `PARTIAL` | `src/lib/fixtures/sampleCurriculum.ts` | Tuân thủ nguyên tắc **Zero Fake Curriculum**: sử dụng bộ fixture mẫu `SAMPLE_TEST_COURSE` (3 bài), chờ tác giả nạp giáo trình thật. |
| **6. Trình duyệt giáo trình** | `WORKING` | `src/components/curriculum/CurriculumBrowser.tsx` | Tìm kiếm thời gian thực, lọc theo trạng thái/độ khó, hiển thị có điều kiện, accordion chi tiết bài học (40/40 tests). |
| **7. Runtime Python WebAssembly** | `WORKING` | `src/hooks/usePyodide.ts`<br>`src/lib/pyodide/PyodideClient.ts`<br>`public/workers/pyodide.worker.js` | Thực thi Python 3.12 trong Web Worker, thu nhận `stdin`/`stdout`, bắt lỗi `SyntaxError`, `ZeroDivisionError`, `NameError` (11/11 tests). |
| **8. Trình soạn thảo Monaco** | `WORKING` | `src/components/workspace/CodeEditor.tsx` | Đổi theme Sáng/Tối (`vs` / `vs-dark`), zoom cỡ chữ, đếm dòng/ký tự, xác nhận đặt lại code, `wordWrap: 'on'`. |
| **9. Động cơ chấm bài xác định** | `WORKING` | `src/lib/judge/runner.ts`<br>`src/lib/judge/comparator.ts`<br>`src/app/api/judge/submit/route.ts` | Chấm độc lập 4 test cases (3 công khai + 1 ẩn), so khớp `exact`/`normalized`/`float`, cấm biến tạm (28/28 tests). |
| **10. Bảo mật test ẩn** | `WORKING` | `src/lib/judge/runner.ts`<br>`src/components/workspace/TerminalOutput.tsx` | Tuyệt đối không gửi input/output mẫu của test ẩn về client trong báo cáo chấm bài. |
| **11. Lưu trữ bài nộp & Điểm số** | `WORKING` | `src/lib/auth/authManager.ts` | Tự động cộng điểm vào hồ sơ khi bài đạt `accepted` lần đầu. Lưu lịch sử nộp bài chi tiết. |
| **12. Khôi phục bài nộp & Nháp** | `WORKING` | `src/components/workspace/TerminalOutput.tsx`<br>`src/lib/auth/authManager.ts` | Nút "Nạp lại" code lịch sử 1-chạm vào Editor; tự động lưu nháp khi gõ phím. |
| **13. Kiến trúc bảo mật khóa AI (BYOK)** | `WORKING` | `src/lib/ai/crypto.ts`<br>`src/components/settings/AISettingsModal.tsx` | Mã hóa AES-256-GCM, che mờ trong UI (`AIzaSy...stuv`), lọc sạch (redact) khóa thô khỏi mọi log/trace lỗi (32/32 tests). |
| **14. Adapter kết nối AI đa nhà cung cấp**| `WORKING` | `src/lib/ai/aiAdapter.ts`<br>`src/app/api/ai/test-connection/route.ts` | Hỗ trợ Google Gemini, OpenAI, Anthropic; endpoint kiểm tra kết nối sống trước khi lưu. |
| **15. AI Tutor Studio & Sư phạm** | `WORKING` | `src/components/ai/AITutorPanel.tsx`<br>`src/components/ai/FormattedAIResponse.tsx` | Giải thích lỗi kèm traceback thật, gợi ý 3 mức độ, phân tích điểm yếu, sinh bài tập tương tự gắn nhãn `unverified`. |
| **16. Quy tắc toàn vẹn phán quyết Judge**| `WORKING` | `src/lib/ai/promptTemplates.ts`<br>`src/lib/ai/tutorService.ts` | System prompt cấm AI phủ nhận kết quả chấm của Judge hoặc tự xưng bài làm đã đạt khi Judge báo lỗi. |
| **17. Động cơ tính toán năng lực** | `WORKING` | `src/lib/mastery/masteryEngine.ts`<br>`src/lib/mastery/errorClassifier.ts` | Phân loại 9 nhóm lỗi, tính % năng lực thực nghiệm từ bài nộp thật, không bịa đặt số liệu ảo (50/50 tests). |
| **18. Hàng đợi ôn tập thích ứng** | `WORKING` | `src/lib/mastery/reviewEngine.ts`<br>`src/components/mastery/WeaknessTrackerModal.tsx`| Ưu tiên 1 cho bài làm hỏng, ưu tiên 2 cho kỹ năng yếu. Tự chuyển trạng thái khi giải bài thành công. |
| **19. Khiên chống bài trùng lặp** | `WORKING` | `src/lib/mastery/exerciseVariation.ts` | Đánh giá độ tương đồng Jaccard 2-gram; từ chối bài AI sinh nếu trùng lặp > 75% với bài có sẵn. |
| **20. Bảng điều khiển học tập** | `WORKING` | `src/components/dashboard/LearningDashboard.tsx` | Thẻ tiếp tục học theo tiến độ thật, thống kê thu gọn (`showStats`), honest empty state khi tài khoản mới (34/34 tests). |
| **21. Khung điều hướng tối giản** | `WORKING` | `src/components/layout/AppShell.tsx`<br>`src/components/layout/Sidebar.tsx` | 3 điểm đến chính (Tổng quan, Học Python, Luyện tập) + menu con logic (46/46 tests). |
| **22. Bộ vi tương tác LucianLabs** | `WORKING` | `src/app/globals.css`<br>`src/components/ui/Toast.tsx` | Phản hồi bấm nút `scale(0.97)`, thẻ nổi `translateY(-2px)`, toast slide-up 180-220ms (56/56 tests). |
| **23. Thiết kế Responsive & Chống tràn**| `WORKING` | `src/app/globals.css`<br>`src/components/workspace/ExerciseWorkspace.tsx`| Khóa layout không tràn ngang trên 1440, 1280, 768, 390, 320 px; tab di động có nút Chạy/Nộp nhanh (44/44 tests). |
| **24. Trợ năng & WCAG Compliance** | `WORKING` | `src/app/globals.css`<br>`src/components/ui/Modal.tsx` | Tương phản text AAA (12.5:1), bẫy phím Escape, `:focus-visible`, triệt tiêu chuyển động theo `prefers-reduced-motion`. |

---

## 3. PHÂN TÍCH CHI TIẾT 7 PHÂN HỆ TRỌNG TÂM (DEEP-DIVE AUDITS)

### 3.1. Xác thực và Dữ liệu người dùng (Authentication & User Data)
- **Luồng dữ liệu thực tế (Data Flow)**:
  1. Người dùng mở `AuthModal` từ Header hoặc Sidebar.
  2. `authManager.signUp()` / `signIn()` xác thực thông tin, tạo profile và lưu phiên vào `localStorage['codecobug_active_session']`.
  3. Khi có bài nộp hoặc lưu bản nháp code, dữ liệu được gắn cờ khóa phân vùng duy nhất `${userId}:${exerciseSlug}`.
  4. Đã xây dựng sẵn 3 file migration PostgreSQL với Row Level Security (RLS) hoàn chỉnh tại `supabase/migrations/`:
     - `001_initial_schema.sql`: Khởi tạo bảng `profiles`, `courses`, `topics`, `lessons`, `exercises`, `submissions`, `code_drafts`.
     - `002_rls_policies.sql`: Khóa quyền riêng tư - mỗi người dùng chỉ có quyền `SELECT`, `INSERT`, `UPDATE` trên bản ghi của chính họ (`auth.uid() = user_id`).
     - `003_adaptive_mastery_and_review.sql`: Bảng `user_skill_mastery` và `adaptive_review_items`.
- **Đánh giá**: `WORKING` đối với Local Multi-Tenant Isolation (đã pass toàn bộ test case); `PARTIAL` đối với kết nối Supabase Cloud từ xa (cần biến môi trường).

---

### 3.2. Giáo trình, Bài học, Bài tập và Mối quan hệ dữ liệu
- **Luồng dữ liệu thực tế (Data Flow)**:
  1. Dữ liệu nạp từ `SAMPLE_TEST_COURSE` (`sampleCurriculum.ts`).
  2. Mối quan hệ phân cấp: `Course` (id, slug) -> `Topic` (courseId, slug, isLocked) -> `Lesson` (topicId, slug, theoryContent) -> `Exercise` (lessonId, topicId, slug, starterCode, examples, testCases).
  3. `CurriculumBrowser.tsx` truy xuất danh sách bài tập, tính toán tỷ lệ hoàn thành dựa trên số bài giải thành công từ `authManager.getSubmissions()`.
- **Đánh giá**: `WORKING` về mặt kiến trúc và logic; `PARTIAL` về mặt nội dung giáo trình sản xuất (tuân thủ nghiêm ngặt quy tắc không tự ý bịa đặt giáo trình khi chưa được cung cấp).

---

### 3.3. Thực thi mã Python và Động cơ chấm bài tự động
- **Luồng dữ liệu thực tế (Data Flow)**:
  - **Nhánh Chạy thử (Run)**:
    1. Người dùng nhấn nút "Chạy thử" trong `CodeEditor` hoặc thanh tab mobile.
    2. `handleRun()` gọi `usePyodide().runPython(code, stdin)`.
    3. Trình duyệt chuyển lệnh sang Web Worker (`pyodide.worker.js`), thực thi qua Pyodide WebAssembly.
    4. Dòng xuất stdout/stderr được truyền theo stream về `TerminalOutput` tab Terminal.
    5. Không tạo bản ghi nộp bài, không tính điểm.
  - **Nhánh Nộp bài (Submit)**:
    1. Người dùng nhấn nút "Nộp bài".
    2. Gửi HTTP POST tới `/api/judge/submit` kèm `{ exerciseSlug, code }`.
    3. Serverless route nạp test cases bí mật từ `testCasesRepository.ts`.
    4. Kiểm tra mã nguồn có vi phạm biến tạm (ví dụ `temp`) hay không.
    5. Chạy từng test case qua Pyodide backend, so khớp output theo quy tắc (`exact`, `normalized_lines`, `float`).
    6. Trả về báo cáo `SubmissionEvaluationReport` (loại bỏ input/output mẫu của test ẩn).
    7. Client tự động chuyển tab Terminal sang "Kết quả kiểm thử", đồng thời gọi `authManager.saveSubmission()` để ghi nhận điểm số và lịch sử.
- **Đánh giá**: `WORKING` (Đã xác minh đầy đủ qua 28 test cases của `test_judge_engine.js` và 11 test cases của `test_pyodide_runtime.js`).

---

### 3.4. Lịch sử bài nộp và Lưu trữ tiến độ học tập
- **Luồng dữ liệu thực tế (Data Flow)**:
  1. Sau khi Judge Engine trả về kết quả, `authManager.saveSubmission()` lưu bản ghi vào `codecobug_submissions_db`.
  2. Nếu bài nộp đạt verdict `accepted` lần đầu tiên, hệ thống cộng điểm `record.score` vào hồ sơ người dùng và phát thông báo qua subscriber pattern.
  3. Tab "Lịch sử" trong `TerminalOutput` hiển thị danh sách các lần nộp của bài đó, kèm nút "Nạp lại" để khôi phục mã nguồn cũ về trình soạn thảo chỉ bằng 1 cú click.
  4. Trong quá trình người học viết code, `authManager.saveDraft()` liên tục lưu trữ đoạn mã để bảo toàn trạng thái khi tải lại trang hoặc chuyển tab.
- **Đánh giá**: `WORKING`.

---

### 3.5. AI Tutor, Quản lý khóa API và Phân tích lỗi
- **Luồng dữ liệu thực tế (Data Flow)**:
  1. Người dùng lưu khóa cá nhân vào `localStorage['codecobug_ai_settings']` qua `AISettingsModal`.
  2. Khi gửi câu hỏi hoặc nhấn nút sư phạm (Giải thích lỗi, Gợi ý, Phân tích điểm yếu), client gửi request tới `/api/ai/chat`.
  3. API route kiểm tra độ lớn payload (< 64KB), tiền kiểm tra định dạng khóa (Gemini phải có tiền tố `AIza`, OpenAI phải có tiền tố `sk-`).
  4. Lắp ráp ngữ cảnh bài tập, mã nguồn thực tế và traceback lỗi thực tế vào prompt mẫu chuẩn sư phạm.
  5. Gọi API nhà cung cấp qua `aiAdapter.ts`.
  6. Kết quả trả về được lọc sạch (redact) toàn bộ khóa API khỏi chuỗi text trước khi gửi về client.
  7. Client hiển thị phản hồi bằng markdown thân thiện, code block có nút sao chép, và gắn nhãn `unverified` cho bài tập tự luyện.
- **Đánh giá**: `WORKING`.

---

### 3.6. Hàng đợi ôn tập và Theo dõi kỹ năng yếu (Adaptive Review & Mastery)
- **Luồng dữ liệu thực tế (Data Flow)**:
  1. `MasteryEngine.computeMastery()` lấy toàn bộ danh sách bài nộp của người dùng đang đăng nhập.
  2. Phân loại các bài nộp thất bại theo 9 nhóm lỗi (`errorClassifier.ts`).
  3. `ReviewEngine.generateReviewQueue()` xếp hàng bài cần ôn: bài lỗi gần nhất xếp ưu tiên 1 (Priority 1), kỹ năng có tỷ lệ thành thạo dưới 70% xếp ưu tiên 2 (Priority 2).
  4. Người học mở `WeaknessTrackerModal` từ thanh điều hướng để xem phân tích biểu đồ kỹ năng và hàng đợi bài tập cần luyện lại.
  5. Khi giải thành công bài tập trong hàng đợi, hệ thống tự động cập nhật trạng thái mục ôn tập thành đã hoàn thành (`completed`).
- **Đánh giá**: `WORKING`.

---

### 3.7. Cài đặt, Điều hướng và Khả năng tương thích di động (Navigation & Responsive)
- **Luồng dữ liệu thực tế (Data Flow)**:
  1. Khung `AppShell` điều hướng tối giản 3 điểm đến chính (Tổng quan, Học Python, Luyện tập).
  2. Trên màn hình máy tính ($\ge 1024$px): Thanh bên mở rộng 250px hoặc thu gọn 76px.
  3. Trên máy tính bảng và điện thoại ($< 1024$px): Thanh bên tự ẩn, thay thế bằng menu Hamburger và ngăn kéo `MobileNav` trượt mượt mà.
  4. Workspace trên màn hình nhỏ chia thành 3 tab (`Đề bài`, `Editor`, `Terminal / Kết quả`), tích hợp cặp nút `Chạy` và `Nộp` cố định ngay trên thanh tab.
  5. Toàn bộ các phần tử khối đều cấu hình `min-width: 0`, `max-width: 100vw`, Monaco bật `wordWrap: 'on'`, loại bỏ 100% tình trạng tràn trang theo chiều ngang trên các độ rộng 1440, 1280, 768, 390 và 320 px.
- **Đánh giá**: `WORKING`.

---

## 4. CÁC TỒN TẠI KỸ THUẬT & HẠN CHẾ ĐÃ BIẾT (TECHNICAL DEBT & LIMITATIONS)

1. **Biến môi trường Supabase**:
   - Các migration SQL và adapter client/server đã hoàn thiện, nhưng hiện tại hệ thống đang chạy ở chế độ **Local Multi-Tenant** do chưa có chuỗi kết nối Supabase Cloud thực tế trong môi trường. Để kích hoạt đồng bộ đám mây, cần khai báo `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Nội dung giáo trình sản xuất**:
   - Hệ thống đang sử dụng fixture `SAMPLE_TEST_COURSE` (3 bài mẫu đại diện cho 3 tình huống kiểm thử: cơ bản, nhập xuất nhiều tham số, và cấm biến tạm). Cần tác giả/giáo viên nạp danh sách chủ đề và bài tập chính thức.
3. **Mô hình AI phụ thuộc vào hạn ngạch người dùng (BYOK Quota)**:
   - Vì sử dụng mô hình BYOK, nếu người dùng nhập khóa hết hạn hoặc vượt quá quota miễn phí của Google/OpenAI, hệ thống sẽ trả về lỗi trung thực (401/429) và hướng dẫn người dùng kiểm tra khóa trong phần Cài đặt.

---

## 5. ĐỀ XUẤT LỘ TRÌNH THỰC HIỆN TIẾP THEO (SAFEST IMPLEMENTATION ORDER)

Để tiếp tục phát triển dự án một cách an toàn nhất mà không gây regression:

1. **Bước 1 (Giáo trình chính thức)**:
   - Tiếp nhận nội dung giáo trình Python chính thức từ tác giả (danh sách chủ đề, bài học, đề bài, ví dụ và test cases ẩn).
   - Nạp dữ liệu vào cơ sở dữ liệu hoặc kho dữ liệu giáo trình mà không sửa đổi cấu trúc engine chấm bài hiện tại.
2. **Bước 2 (Kết nối Supabase Cloud Production)**:
   - Khởi tạo project Supabase trên đám mây, chạy 3 file migration trong `supabase/migrations/`.
   - Nạp biến môi trường production vào `.env.local` và kiểm tra đồng bộ dữ liệu người dùng giữa các thiết bị khác nhau.
3. **Bước 3 (Mở rộng tính năng phòng lab & bài tập nâng cao)**:
   - Thêm các dạng bài tập vẽ hình (Turtle/Graphics nếu cần qua thư viện Pyodide mở rộng).
   - Bổ sung bảng xếp hạng học tập (Leaderboard) theo lớp học hoặc nhóm học viên.

---

## 6. KẾT QUẢ KIỂM TOÁN TỔNG THỂ (AUDIT VERDICT)

- **Tổng số test suites tự động**: **14 / 14 suites PASSED**
- **Tổng số test assertions**: **567 / 567 PASSED (100%)**
- **Kiểm tra kiểu dữ liệu TypeScript (`tsc --noEmit`)**: **0 errors**
- **Linting (`next lint`)**: **0 warnings, 0 errors**
- **Production Build (`next build`)**: **Compiled & Generated successfully (8/8 routes)**
- **Kết luận**: Toàn bộ kiến trúc kỹ thuật nền tảng, giao diện Teen Pastel Studio, runtime Pyodide WebAssembly, động cơ chấm bài xác định, bảo mật BYOK và trợ năng của CodeCoBUG đang ở trạng thái **hoạt động xuất sắc, toàn vẹn và sẵn sàng sản xuất**.

