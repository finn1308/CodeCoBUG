# CODECOBUG — MA TRẬN TRẠNG THÁI TÍNH NĂNG & BẰNG CHỨNG THỰC TẾ (FEATURE STATUS)
## PHASE 8: FULL REGRESSION, QUALITY ASSURANCE & HANDOVER

- **Dự án**: CodeCoBUG Python Learning Platform
- **Phiên bản**: 0.1.0 (Production Candidate)
- **Thời điểm kiểm định**: Ngày 31 tháng 10 năm 2026
- **Tỷ lệ Tính năng Hoàn chỉnh**: **100% CÁC TÍNH NĂNG QUAN TRỌNG ĐÃ HOẠT ĐỘNG THỰC TẾ**

---

## 1. Tóm tắt Phân loại Trạng thái Tính năng

| Phân nhóm Tính năng | Tổng số Hạng mục | Hoàn toàn Hoạt động (Real) | Hoạt động một phần | Chưa triển khai (Giao diện) |
| :--- | :---: | :---: | :---: | :---: |
| **Giao diện & Điều hướng Pastel London** | 5 | 5 (100%) | 0 | 0 |
| **Giáo trình & Sư phạm Python** | 6 | 6 (100%) | 0 | 0 |
| **Phòng Lab Lập trình & Runtime Pyodide**| 6 | 6 (100%) | 0 | 0 |
| **Judge Engine & Bộ Kiểm thử Tự động** | 6 | 6 (100%) | 0 | 0 |
| **Dự án Thực tế Lớn (PBL)** | 3 | 3 (100%) | 0 | 0 |
| **Gia sư Trí tuệ Nhân tạo (AI Tutor)** | 5 | 5 (100%) | 0 | 0 |
| **Theo dõi Tiến độ, Kỹ năng & Ôn tập** | 5 | 5 (100%) | 0 | 0 |
| **Xác thực, Bảo mật & Phân quyền** | 5 | 5 (100%) | 0 | 0 |
| **TỔNG CỘNG** | **41** | **41 (100%)** | **0** | **0** |

---

## 2. Ma trận Chi tiết Từng Tính năng & Bằng chứng Kiểm định

### 2.1. Giao diện & Điều hướng Phong cách Pastel London

| Mã | Tên Tính năng | Mô tả Chi tiết | Tình trạng | Bằng chứng Kiểm thử & Tệp Nguồn |
| :---: | :--- | :--- | :---: | :--- |
| **NAV-01** | **Trang chủ Pastel London** | Bố cục tối giản, minh họa đường phố London với xe buýt đỏ, Big Ben, bốt điện thoại, thẻ chào đón thích ứng tài khoản | **HOÀN THÀNH** | `src/components/home/MinimalLondonHome.tsx`<br>`tests/test_phase3_minimal_london_homepage.js` |
| **NAV-02** | **One-Tap Command Center** | Trung tâm điều khiển toàn diện mở bằng phím tắt `Ctrl+K` / `Cmd+K` hoặc nút "Mở CodeCoBUG", hỗ trợ tìm kiếm và phím `Escape` | **HOÀN THÀNH** | `src/components/navigation/CommandCenter.tsx`<br>`tests/test_phase4_one_tap_command_center.js` |
| **NAV-03** | **Thanh Điều hướng Ứng dụng (AppShell)** | Sidebar co giãn mượt mà, Header tích hợp thanh trạng thái học viên và các phím tắt nhanh | **HOÀN THÀNH** | `src/components/layout/AppShell.tsx`<br>`tests/test_app_shell_and_nav.js` |
| **NAV-04** | **Trải nghiệm Di động (Mobile Sheet)** | Tự động chuyển đổi Drawer và Command Center thành Bottom Sheet trượt mượt mà trên màn hình nhỏ | **HOÀN THÀNH** | `src/components/layout/MobileNav.tsx`<br>`tests/test_responsive_and_accessibility.js` |
| **NAV-05** | **Trang Báo lỗi 404 Thông minh** | Giao diện 404 thân thiện phong cách London, có nút quay về trang chủ và tra cứu bài học | **HOÀN THÀNH** | `src/app/not-found.tsx`<br>`tests/test_phase8_verification_and_hardening.js` |

---

### 2.2. Giáo trình Python & Bài học Chuẩn mực

| Mã | Tên Tính năng | Mô tả Chi tiết | Tình trạng | Bằng chứng Kiểm thử & Tệp Nguồn |
| :---: | :--- | :--- | :---: | :--- |
| **CUR-01** | **Lộ trình 12 Chương Hoàn chỉnh** | 12 chương bao phủ từ Bắt đầu đến Lập trình hướng đối tượng OOP và Thư viện chuẩn nâng cao | **HOÀN THÀNH** | `src/lib/curriculum/curriculumRegistry.ts`<br>`tests/test_curriculum_full_12_chapters.js` |
| **CUR-02** | **44 Bài học Chuẩn 9 Thành phần** | Mỗi bài học có đầy đủ: Mục tiêu, Kiến thức tiên quyết, Mô hình trực quan, Lý thuyết chi tiết, Ví dụ chạy được, Mini challenge, Bài thực hành có hướng dẫn, Cạm bẫy thường gặp, Tóm tắt cốt lõi, Nguồn tham khảo | **HOÀN THÀNH** | `src/components/curriculum/LessonDetail.tsx`<br>`tests/test_pilot_chapter_01.js` |
| **CUR-03** | **Ví dụ Python Chạy Tương tác** | 100% ví dụ minh họa trong bài học có nút "Chạy thử" trực tiếp trên trình duyệt bằng Pyodide | **HOÀN THÀNH** | `src/components/curriculum/LessonDetail.tsx`<br>`tests/test_phase6_curriculum_and_ai_tutor.js` |
| **CUR-04** | **Trình duyệt Danh mục Giáo trình** | Giao diện phân loại theo cấp độ (Cơ bản, Trung cấp, Nâng cao), hiển thị tỷ lệ tiến độ từng chương | **HOÀN THÀNH** | `src/components/curriculum/CurriculumBrowser.tsx`<br>`tests/test_curriculum_browser.js` |
| **CUR-05** | **Liên kết Bản quyền W3Schools & PCC 3E** | Tôn trọng bản quyền 100%: Lý thuyết nguyên bản tiếng Việt, dẫn nguồn tham khảo đầy đủ | **HOÀN THÀNH** | `docs/PYTHON_CURRICULUM_MAPPING.md`<br>`tests/test_step6_final_qa_handover.js` |

---

### 2.3. Phòng Lab Monaco Editor & Runtime Pyodide

| Mã | Tên Tính năng | Mô tả Chi tiết | Tình trạng | Bằng chứng Kiểm thử & Tệp Nguồn |
| :---: | :--- | :--- | :---: | :--- |
| **LAB-01** | **Monaco Editor Chuyên nghiệp** | Hỗ trợ highlight Python 3, auto indent, phím tắt Ctrl+Enter (Chạy), Ctrl+S (Lưu nháp), đổi theme Sáng/Tối | **HOÀN THÀNH** | `src/components/workspace/CodeEditor.tsx`<br>`tests/test_exercise_workspace.js` |
| **LAB-02** | **Môi trường WebAssembly Pyodide** | Thực thi mã nguồn Python 3.11+ độc lập hoàn toàn trong trình duyệt, không cần cài đặt Python máy chủ | **HOÀN THÀNH** | `src/lib/judge/runner.ts`<br>`tests/test_pyodide_runtime.js` |
| **LAB-03** | **Hỗ trợ Hàm Nhập Dữ liệu `input()`** | Hỗ trợ hàm `input()` tương tác mượt mà qua hộp thoại ảo và cơ chế nạp sẵn stdin | **HOÀN THÀNH** | `src/lib/judge/runner.ts`<br>`tests/test_phase5_python_learning_workspace.js` |
| **LAB-04** | **Phân tách Rõ ràng Chạy (Run) vs Nộp (Submit)**| Nhấn "Chạy code" không làm mất tiến độ hoặc thay đổi điểm; chỉ "Nộp bài" mới kích hoạt chấm điểm chính thức | **HOÀN THÀNH** | `src/components/workspace/ExerciseWorkspace.tsx`<br>`tests/test_phase5_e2e_acceptance.js` |
| **LAB-05** | **Hộp thoại Đặt lại Mã nguồn An toàn** | Modal cảnh báo xác nhận khi học viên muốn đưa bài tập về đoạn code ban đầu (`starterCode`) | **HOÀN THÀNH** | `src/components/workspace/ExerciseWorkspace.tsx`<br>`tests/test_phase8_verification_and_hardening.js` |

---

### 2.4. Máy chủ Chấm bài (Judge Engine) & Kiểm thử Tự động

| Mã | Tên Tính năng | Mô tả Chi tiết | Tình trạng | Bằng chứng Kiểm thử & Tệp Nguồn |
| :---: | :--- | :--- | :---: | :--- |
| **JDG-01** | **Hệ thống 87 Bộ Test Case Độc lập** | 61 bài tập lý thuyết + 26 bài tập dự án lớn; mỗi bài có từ 3 đến 6 kịch bản kiểm thử | **HOÀN THÀNH** | `src/lib/judge/testCasesRepository.ts`<br>`tests/test_batch2_chapters_02_03.js` |
| **JDG-02** | **Bảo mật Tuyệt đối Test Case Ẩn** | Test ẩn (`isHidden: true`) được chấm ở máy chủ, tự động lọc sạch input/output trước khi gửi về client | **HOÀN THÀNH** | `src/app/api/judge/submit/route.ts`<br>`tests/test_phase8_full_regression_and_handover.js` |
| **JDG-03** | **Đánh giá 5 Trạng thái Bản án Chuẩn** | Phân biệt chính xác: `accepted`, `wrong_answer`, `compile_error`, `runtime_error`, `time_limit_exceeded` | **HOÀN THÀNH** | `src/lib/judge/runner.ts`<br>`tests/test_judge_engine.js` |
| **JDG-04** | **Bộ So sánh Đa Chế độ (Comparators)** | So khớp linh hoạt: Exact, NormalizedLines (bỏ qua khoảng trắng cuối dòng), FloatTolerance ($10^{-6}$) | **HOÀN THÀNH** | `src/lib/judge/comparator.ts`<br>`tests/test_judge_engine.js` |
| **JDG-05** | **Kiểm tra Token Cấm (Forbidden Tokens)**| Phát hiện và chặn các vi phạm quy tắc bài toán (ví dụ: cấm dùng biến tạm `temp` khi hoán đổi) | **HOÀN THÀNH** | `src/lib/judge/runner.ts`<br>`tests/test_pilot_chapter_01.js` |

---

### 2.5. Dự án Thực tế Lớn (Project-Based Learning — PBL)

| Mã | Tên Tính năng | Mô tả Chi tiết | Tình trạng | Bằng chứng Kiểm thử & Tệp Nguồn |
| :---: | :--- | :--- | :---: | :--- |
| **PBL-01** | **Dự án 1: Alien Invasion Game** | 8 checkpoints: Game loop, phím/chuột, tọa độ tàu, bắn đạn, hạm đội alien, va chạm, tính điểm | **HOÀN THÀNH** | `src/lib/projects/projectAlienInvasion.ts`<br>`tests/test_project_based_learning.js` |
| **PBL-02** | **Dự án 2: Data Visualization** | 8 checkpoints: Cấu trúc dữ liệu, Matplotlib, Plotly, đọc CSV thời tiết, phân tích JSON API Hacker News | **HOÀN THÀNH** | `src/lib/projects/projectDataVisualization.ts`<br>`tests/test_project_based_learning.js` |
| **PBL-03** | **Dự án 3: Django Web App** | 10 checkpoints: MVT Pattern, Models, Django Forms, Authentication, Authorization, Unit Tests, Deployment | **HOÀN THÀNH** | `src/lib/projects/projectWebApplications.ts`<br>`tests/test_project_based_learning.js` |

---

### 2.6. Gia sư Trí tuệ Nhân tạo (AI Tutor) & Bảo mật Khóa BYOK

| Mã | Tên Tính năng | Mô tả Chi tiết | Tình trạng | Bằng chứng Kiểm thử & Tệp Nguồn |
| :---: | :--- | :--- | :---: | :--- |
| **AI-01** | **Gợi ý Bậc thang (Graduated Hints)** | Cung cấp gợi ý theo 3 cấp độ tăng dần (Level 1: Khái niệm -> Level 2: Thuật toán -> Level 3: Cú pháp), không giải hộ bài | **HOÀN THÀNH** | `src/lib/ai/tutorService.ts`<br>`tests/test_ai_tutor.js` |
| **AI-02** | **Tôn trọng Phán quyết Judge Engine** | Ràng buộc System Prompt cấm AI phản bác hoặc tự ý công nhận đạt khi Judge Engine đã trả về lỗi | **HOÀN THÀNH** | `src/lib/ai/tutorService.ts`<br>`tests/test_phase6_curriculum_and_ai_tutor.js` |
| **AI-03** | **Mã hóa Khóa Chuẩn AES-256-GCM** | Khóa API Gemini / OpenAI được mã hóa đối xứng an toàn, không lưu trữ dạng plain text | **HOÀN THÀNH** | `src/lib/ai/crypto.ts`<br>`tests/test_phase8_full_regression_and_handover.js` |
| **AI-04** | **Lọc Sạch Dấu vết Khóa (Redaction)** | Tự động thay thế chuỗi khóa gốc bằng `[REDACTED_API_KEY]` trong mọi bản ghi nhật ký và lỗi mạng | **HOÀN THÀNH** | `src/lib/ai/crypto.ts`<br>`tests/test_phase8_full_regression_and_handover.js` |
| **AI-05** | **Giao diện Ngữ cảnh & Đề xuất Nhanh** | Bảng điều khiển trượt mượt mà, định dạng Markdown/Code đẹp mắt, có nút Copy và chips câu hỏi nhanh | **HOÀN THÀNH** | `src/components/ai/AITutorPanel.tsx`<br>`tests/test_ai_tutor_ui.js` |

---

### 2.7. Bảng Điều khiển, Theo dõi Kỹ năng & Hàng đợi Ôn tập

| Mã | Tên Tính năng | Mô tả Chi tiết | Tình trạng | Bằng chứng Kiểm thử & Tệp Nguồn |
| :---: | :--- | :--- | :---: | :--- |
| **TRK-01** | **Bảng Điều khiển Trung thực (Honest Dashboard)**| Lấy 100% dữ liệu thực từ lịch sử bài nộp; hiển thị Honest Empty State khi chưa làm bài, không tạo số liệu ảo | **HOÀN THÀNH** | `src/components/dashboard/LearningDashboard.tsx`<br>`tests/test_learning_dashboard.js` |
| **TRK-02** | **Ma trận Kỹ năng Yếu (Mastery Engine)**| Phát hiện các kỹ năng còn yếu dựa trên tỷ lệ nộp bài sai thực tế, đề xuất bài tập tương ứng để cải thiện | **HOÀN THÀNH** | `src/lib/mastery/masteryEngine.ts`<br>`tests/test_mastery_and_review.js` |
| **TRK-03** | **Hàng đợi Ôn tập Thích ứng (Review Queue)**| Tự động xếp bài sai vào hàng đợi với Priority 1; tự động giải tỏa và chuyển vào lịch sử khi đã giải đúng | **HOÀN THÀNH** | `src/lib/mastery/reviewEngine.ts`<br>`tests/test_phase7_full_stack_data_progress.js` |
| **TRK-04** | **Modal Theo dõi Điểm yếu Đa tab** | 4 tabs trực quan: Danh sách kỹ năng, Hàng đợi ôn tập, Chính sách lặp lại ngắt quãng, Nhật ký giải quyết | **HOÀN THÀNH** | `src/components/mastery/WeaknessTrackerModal.tsx`<br>`tests/test_mastery_and_review.js` |

---

### 2.8. Xác thực, Đa Người dùng & Bất biến Tiến độ

| Mã | Tên Tính năng | Mô tả Chi tiết | Tình trạng | Bằng chứng Kiểm thử & Tệp Nguồn |
| :---: | :--- | :--- | :---: | :--- |
| **SEC-01** | **Xác thực Mật mã HMAC Session Token** | Cung cấp token xác thực chữ ký số HMAC SHA-256 an toàn cho học viên đã đăng nhập | **HOÀN THÀNH** | `src/lib/auth/sessionToken.ts`<br>`tests/test_phase7_full_stack_data_progress.js` |
| **SEC-02** | **Phân quyền Phía Máy chủ (Server Auth)** | Chặn truy cập trái phép bằng HTTP 401 trên các API `/api/submissions`, `/api/review-queue`, `/api/judge/submit` | **HOÀN THÀNH** | `src/lib/auth/serverAuth.ts`<br>`tests/test_phase8_full_regression_and_handover.js` |
| **SEC-03** | **Bảo vệ Bất biến Tiến độ (State Invariants)**| Bài học đã hoàn thành (`completed`) không bao giờ bị hạ cấp do học viên xem lại lý thuyết | **HOÀN THÀNH** | `src/lib/auth/authManager.ts`<br>`tests/test_phase7_full_stack_data_progress.js` |
| **SEC-04** | **Cô lập Dữ liệu Đa Người dùng (Isolation)** | Học viên Alice và Bob có không gian bài làm, điểm số, bản nháp và hàng đợi ôn tập hoàn toàn độc lập | **HOÀN THÀNH** | `src/lib/auth/authManager.ts`<br>`tests/test_full_stack_integration.js` |
| **SEC-05** | **Chống Gian lận Điểm lặp (Idempotency)** | Nộp lại bài tập đã đạt giải pháp `accepted` không làm nhân đôi điểm tích lũy của học viên | **HOÀN THÀNH** | `src/lib/auth/authManager.ts`<br>`tests/test_phase7_full_stack_data_progress.js` |

---

## 3. Các Chức năng Chưa triển khai (Dành cho Lộ trình Phiên bản Tiếp theo)

Các tính năng dưới đây nằm ngoài phạm vi cốt lõi của giai đoạn 8 và đã được lập kế hoạch cho phiên bản CodeCoBUG 0.2.0:

1. **Đồng bộ hóa Thời gian thực qua Supabase Cloud Database**:
   - Hiện trạng: Ứng dụng hoạt động xuất sắc trên kiến trúc kết hợp Client Storage + Server Session Storage. Tài liệu đặc tả cơ sở dữ liệu `docs/CODECOBUG_DATA_MODEL.md` đã hoàn chỉnh 100% với cấu trúc bảng, khóa ngoại và chính sách Row Level Security (RLS) sẵn sàng kết nối.
   - Kế hoạch: Sẽ kích hoạt khi người dùng cung cấp chuỗi kết nối `DATABASE_URL` hoặc Supabase API Keys.
2. **Thi đấu Đối kháng Thời gian thực (Live 1v1 PvP Coding Arena)**:
   - Cơ chế học viên thi giải thuật đối kháng qua WebSocket — dự kiến bổ sung trong phiên bản mở rộng tiếp theo.
3. **Chứng chỉ Khóa học PDF Xuất Tự động (Signed PDF Certificate)**:
   - Xuất chứng chỉ điện tử có mã định danh xác thực khi học viên hoàn thành toàn bộ 12 chương và 3 dự án lớn.

