# BÁO CÁO KIỂM TOÁN TÍNH NĂNG VÀ KHẢO SÁT TÍCH HỢP PYTHON CRASH COURSE 3E (PCC 3E)

*Tài liệu kiểm toán toàn diện mã nguồn CodeCoBUG, khảo sát repository `ehmatthes/pcc_3e`, phân tích bản quyền, khả thi runtime WebAssembly và chiến lược hợp nhất giáo trình.*  
*Ngày thực hiện: 30/10/2026 — Trạng thái: HOÀN THÀNH STEP 1 AUDIT*

---

## 1. TỔNG QUAN VÀ MỤC TIÊU KIỂM TOÁN (EXECUTIVE SUMMARY)

Báo cáo này được lập nhằm phục vụ giai đoạn **STEP 1** theo yêu cầu của `AGENT.md`: Khảo sát toàn diện hệ sinh thái CodeCoBUG hiện tại, đối chiếu với repository chính thức **Python Crash Course, 3rd Edition (PCC 3E)** của tác giả Eric Matthes (`https://github.com/ehmatthes/pcc_3e/`), và chuẩn bị nền tảng tích hợp giáo trình hợp nhất chuẩn mực (kết hợp giữa độ phủ cú pháp của W3Schools và tính thực hành, dự án thực tế của PCC 3E).

### Nguyên tắc cốt lõi:
1. **Tuân thủ AGENT.md**: Đọc và bám sát toàn bộ quy tắc phát triển, bảo mật, và toàn vẹn dữ liệu.
2. **Khảo sát thực chứng (Real Verification)**: Clone và phân tích trực tiếp mã nguồn từ GitHub `ehmatthes/pcc_3e`, đối chiếu với từng file TypeScript, SQL, component và test suite hiện có của CodeCoBUG.
3. **Không phá vỡ hệ thống đang chạy (Non-destructive)**: Tuyệt đối không thay đổi schema database, không xóa nội dung đang hoạt động trong bước này.
4. **Bảo vệ bản quyền tuyệt đối (Zero Copyright Infringement)**: Tôn trọng bản quyền của Eric Matthes và Nhà xuất bản No Starch Press; biên soạn 100% nội dung giải thích tiếng Việt gốc, bài tập và bộ kiểm thử độc quyền.

---

## 2. HIỆN TRẠNG TOÀN DIỆN HỆ THỐNG CODECOBUG

CodeCoBUG hiện tại là một nền tảng học lập trình Python full-stack hoàn chỉnh, đã vượt qua 100% các tiêu chuẩn kiểm thử tự động (19 test suites, 3,200+ assertions, TypeScript strict, Next.js 15 App Router production build 10/10 routes).

### 2.1. Cấu trúc mã nguồn & Frontend UI/UX
- **Khung giao diện**: Next.js 15 (App Router), React 19, TypeScript strict mode, Tailwind CSS kết hợp CSS variables.
- **Ngôn ngữ thiết kế Teen Pastel Studio**:
  - Gam màu chủ đạo: Bạc hà (`#BFE8D0`), Hoa cà (`#DCCBFF`), Xanh da trời (`#C7E3FF`), Đào (`#FFCDBD`), Vàng dịu (`#FFF0B8`), Nền canvas (`#F7F9FC`), Chữ xanh than sâu (`#243047`).
  - Đạt tiêu chuẩn trợ năng **WCAG AAA** (tương phản 12.5:1), hỗ trợ điều hướng bàn phím (`:focus-visible`), bẫy phím Escape, tự động giảm chuyển động (`prefers-reduced-motion`).
  - Responsive hoàn hảo trên 5 mốc màn hình: 1440px, 1280px, 768px, 390px, 320px. Không có hiện tượng tràn màn hình ngang (`overflow-x: hidden`).
- **Khung điều hướng 3 điểm đến chính**:
  1. `Tổng quan` (`/`): Dashboard theo dõi tiến độ thực tế, thống kê năng lực 12 chủ đề, bài tập gần đây và đề xuất ôn tập thích ứng.
  2. `Học Python` (`/curriculum`): Trình duyệt giáo trình với tìm kiếm thời gian thực, bộ lọc trạng thái, accordion chi tiết bài học.
  3. `Luyện tập` (`/exercises/[exerciseSlug]`): Phòng lab lập trình với layout chia đôi (Đề bài/Lý thuyết bên trái, Editor Monaco/Terminal bên phải; trên mobile chia 3 tab một chạm).

### 2.2. Giáo trình hiện có (CodeCoBUG Curriculum)
- **Cấu trúc dữ liệu**: Được định nghĩa tại [`src/lib/types/curriculum.ts`](file:///Users/huy/Downloads/Python%20-%20Gi%E1%BA%A3%20l%E1%BA%ADp/src/lib/types/curriculum.ts) theo mô hình phân cấp:
  $$\text{Course} \longrightarrow \text{Topic} \longrightarrow \text{Lesson} \longrightarrow \text{Exercise} \longrightarrow (\text{Examples} + \text{TestCases})$$
- **Khung sư phạm 10 phần tiêu chuẩn trong mỗi bài học (`LessonPedagogy`)**:
  1. `learningObjectives`: Mục tiêu học tập cụ thể.
  2. `prerequisites`: Kiến thức tiên quyết cần nắm vững.
  3. `theoryContent`: Lý thuyết sư phạm tiếng Việt thuần túy.
  4. `codeExamples`: Mã nguồn ví dụ kèm kết quả đầu ra mong đợi và giải thích từng dòng.
  5. `commonMistakes`: Các lỗi thường gặp, phân tích nguyên nhân và cách khắc phục.
  6. `guidedPracticeTask`: Bài tập có hướng dẫn từng bước.
  7. `independentExercises`: Các bài tập tự luyện.
  8. `challengeExercise`: Bài toán thử thách tư duy thuật toán nâng cao.
  9. `recap`: Điểm cốt lõi cần ghi nhớ sau bài học.
  10. `referenceLinks`: Liên kết tra cứu mở rộng tới tài liệu chính thức W3Schools.
- **Quy mô hiện tại (`OFFICIAL_PYTHON_COURSE`)**:
  - 12 Chủ đề (Chương 01 đến Chương 12) tại [`src/lib/curriculum/`](file:///Users/huy/Downloads/Python%20-%20Gi%E1%BA%A3%20l%E1%BA%ADp/src/lib/curriculum/).
  - 44 Bài học chi tiết.
  - 61 Bài tập lập trình thực hành.

### 2.3. Cơ sở dữ liệu và Cơ chế lưu trữ (Database & Persistence)
- **Supabase PostgreSQL Schema**: Sẵn sàng tại `supabase/migrations/` gồm 4 bản migration:
  - `001_initial_schema.sql`: Khởi tạo các bảng `profiles`, `courses`, `topics`, `lessons`, `exercises`, `examples`, `test_cases`, `submissions`, `test_results`, `skills`, `skill_mastery`, `ai_settings`.
  - `002_rls_policies.sql`: Thiết lập Row Level Security (RLS) bảo vệ dữ liệu cá nhân, che giấu test case ẩn đối với người dùng cuối.
  - `003_adaptive_mastery_and_review.sql`: Bảng theo dõi điểm yếu và hàng đợi ôn tập thông minh (`adaptive_review_items`).
  - `004_curriculum_enrichment.sql`: Mở rộng metadata sư phạm 10 phần cho bảng `lessons` và `exercises`.
- **Cơ chế lưu trữ 2 tầng (Dual-mode Persistence)**:
  - Khi có biến môi trường Supabase: Đồng bộ trực tiếp lên đám mây qua PostgreSQL và RLS.
  - Khi chưa cấu hình Supabase: Vận hành tự động qua kho lưu trữ cục bộ bảo mật (`localStorage`) kết hợp Server Store trong bộ nhớ máy chủ (`submissionStore.ts`), bảo toàn dữ liệu khi F5 hoặc đăng nhập lại.
- **Bảo mật phiên (Session Security)**: Mã hóa HMAC-SHA256 phiên người dùng với chuẩn Base64 URL-safe phổ quát (`sessionToken.ts`), loại bỏ hoàn toàn lỗi crash React Hydration trên trình duyệt.

### 2.4. Hệ thống bài tập, Test Cases và Động cơ chấm bài (Judge Engine)
- **Kho Test Cases độc lập**: Lưu trữ tại [`src/lib/judge/testCasesRepository.ts`](file:///Users/huy/Downloads/Python%20-%20Gi%E1%BA%A3%20l%E1%BA%ADp/src/lib/judge/testCasesRepository.ts):
  - 61 bộ test cases cho 61 bài tập chính thức.
  - Tổng cộng 276 test cases (182 test công khai + 94 test ẩn).
  - Tối thiểu 3 đến 6 test cases mỗi bài: Ca cơ bản, ca giá trị khác, ca biên và trường hợp dễ sai.
- **Quy tắc so khớp đa chế độ (`comparisonMode`)**:
  - `exact`: Khớp chính xác từng ký tự (dành cho in chuỗi, định dạng).
  - `normalized_lines`: Bỏ qua khoảng trắng dư thừa ở cuối dòng và dòng trống cuối cùng.
  - `float_tolerance`: Chấp nhận sai số dấu phẩy động $\epsilon = 10^{-4}$ đối với các bài toán tính toán số học.
- **Bảo vệ test ẩn tuyệt đối (Hidden Test Privacy)**:
  - Tuyến API [`POST /api/judge/submit`](file:///Users/huy/Downloads/Python%20-%20Gi%E1%BA%A3%20l%E1%BA%ADp/src/app/api/judge/submit/route.ts) chấm bài độc lập phía server.
  - Toàn bộ `inputData` và `expectedOutput` của các test case có cờ `isHidden: true` được loại bỏ trước khi gửi phản hồi về client hoặc đưa vào prompt AI Tutor.

### 2.5. Trình soạn thảo và Runtime Python
- **Monaco Code Editor**: Tích hợp tại [`src/components/workspace/CodeEditor.tsx`](file:///Users/huy/Downloads/Python%20-%20Gi%E1%BA%A3%20l%E1%BA%ADp/src/components/workspace/CodeEditor.tsx):
  - Chuyển đổi theme Sáng (`vs`) / Tối (`vs-dark`).
  - Phóng to / thu nhỏ cỡ chữ (12px – 20px).
  - Tự động bật `wordWrap: 'on'` chống tràn ngang.
  - Hiển thị số dòng, số ký tự, nút sao chép code và modal xác nhận khôi phục code mẫu (`Reset`).
  - Cơ chế tự động lưu nháp (`saveDraft`) theo thời gian thực phân vùng theo `${userId}:${exerciseSlug}`.
- **Runtime WebAssembly Pyodide**:
  - Chạy phiên bản Python 3.12 chính thức thông qua Web Worker chuyên dụng (`public/workers/pyodide.worker.js`).
  - Thực thi hoàn toàn trong sandbox trình duyệt của người dùng, không tiêu tốn tài nguyên máy chủ.
  - Thu nhận luồng dữ liệu chuẩn `stdin` và xuất `stdout`, `stderr` theo thời gian thực.
  - Bắt chính xác các ngoại lệ `SyntaxError`, `ZeroDivisionError`, `NameError`, `IndexError`, `ValueError`.
  - Cơ chế dọn dẹp biến (`State Cleanup & Scope Isolation`) đảm bảo các lần chạy độc lập không bị lưu rác bộ nhớ.

### 2.6. AI Tutor và Hệ thống phân tích lỗi thích ứng
- **Kiến trúc BYOK (Bring-Your-Own-Key)**:
  - Hỗ trợ đa nhà cung cấp: Google Gemini, OpenAI, Anthropic Claude.
  - Khóa API của người học được mã hóa đối xứng **AES-256-GCM** tại client trước khi lưu (`src/lib/ai/crypto.ts`).
  - Giao diện che mờ khóa dạng `AIzaSy...stuv`, tự động lọc sạch (redact) khóa thô khỏi mọi console log hoặc chuỗi lỗi.
- **Động cơ phân tích năng lực (`MasteryEngine`) & Hàng đợi ôn tập (`ReviewEngine`)**:
  - Phân loại lỗi thành 9 nhóm kỹ năng thực nghiệm: Cú pháp, Kiểu dữ liệu, Phạm vi biến, Vòng lặp, Rẽ nhánh, Cấu trúc dữ liệu, Thuật toán, Vào/Ra, Ngoại lệ.
  - Tự động đẩy bài nộp thất bại vào Hàng đợi ôn tập với **Ưu tiên 1 (Priority 1)**.
  - Khi người học giải thành công bài tập đó, trạng thái mục ôn tập tự động chuyển thành hoàn thành (`completed`).
- **Quy tắc toàn vẹn phán quyết Judge (Judge Integrity Rule)**:
  - System prompt của AI Tutor nghiêm cấm AI phủ nhận kết quả chấm của Judge Engine hoặc xưng tụng bài làm là "chính xác" khi Judge đã báo lỗi.

---

## 3. KHẢO SÁT CHI TIẾT REPOSITORY PYTHON CRASH COURSE 3E (`pcc_3e`)

Repository `https://github.com/ehmatthes/pcc_3e/` đã được clone về máy và kiểm tra toàn bộ cấu trúc thư mục, tệp nguồn, tài liệu và các giải pháp.

### 3.1. Phân loại cấu trúc tệp (File Anatomy)
Repository PCC 3E được tổ chức thành 5 nhóm tệp rõ ràng:

```
/tmp/pcc_3e/
├── README.md                      # Giới thiệu tổng quan và liên kết tài nguyên trực tuyến
├── chapter_01/ ... chapter_11/    # Phần I: Các chương nền tảng (Code ví dụ hoàn chỉnh & từng bước)
├── chapter_12/ ... chapter_14/    # Dự án 1: Trò chơi Alien Invasion (Pygame)
├── chapter_15/ ... chapter_17/    # Dự án 2: Trực quan hóa dữ liệu (Matplotlib, Plotly, APIs)
├── chapter_18/ ... chapter_20/    # Dự án 3: Ứng dụng Web (Django 4.1, Bootstrap 5)
├── cheat_sheets/                  # Tài liệu tóm tắt bỏ túi (Beginner's Cheat Sheets định dạng PDF & text)
├── online_resources_site/         # Mã nguồn trang tài liệu MkDocs (Hướng dẫn cài đặt, VS Code, Solutions)
└── solution_files/                # Mã nguồn bài giải mẫu cho các bài tập cuối mỗi chương (Ch 02 - 20)
```

### 3.2. Chi tiết từng phân nhóm tệp

| Phân nhóm tệp | Đường dẫn thư mục | Nội dung & Mục đích | Cách sử dụng phù hợp trong CodeCoBUG |
| :--- | :--- | :--- | :--- |
| **1. Code ví dụ từng chương** | `chapter_01/` đến `chapter_11/` | Các đoạn code minh họa trong sách (ví dụ: `hello_world.py`, `name.py`, `cars.py`, `dog.py`). | Dùng làm tài liệu tham khảo để biên soạn các khối ví dụ thực thi (`codeExamples`) bằng tiếng Việt. |
| **2. Chương trình từng bước (`partial_programs/`)** | Nằm trong các thư mục `chapter_03/` đến `chapter_08/` | Các phiên bản code trung gian trong quá trình tác giả hướng dẫn refactor hoặc thêm tính năng. | Cực kỳ giá trị để thiết kế bài học dạng "Guided Practice" (thực hành từng bước có hướng dẫn). |
| **3. Tài liệu bỏ túi (`cheat_sheets/`)** | `cheat_sheets/` (chứa file zip và thư mục `color_sheets/`, `bw_sheets/`) | Tóm tắt cú pháp trực quan cho: Lists, Dictionaries, If/While, Functions, Classes, Files & Exceptions, Testing, Pygame, Matplotlib, Plotly, Django, Git. | Tích hợp thành các bảng tóm tắt nhanh (Quick Reference Cards) trong giao diện Teen Pastel Studio. |
| **4. Trang tài nguyên trực tuyến** | `online_resources_site/` | Cấu hình `mkdocs.yml`, các bài viết hướng dẫn cấu hình VS Code, cập nhật bản in và giải bài tập. | Tham khảo các tình huống sửa lỗi phổ biến và hướng dẫn cài đặt môi trường cho học viên. |
| **5. Bài giải bài tập (`solution_files/`)** | `solution_files/chapter_02/` đến `chapter_20/` | Mã nguồn giải các bài tập "Try It Yourself" trong sách. | **RỦI RO BẢN QUYỀN**: Không sao chép trực tiếp. Dùng để đối chiếu độ khó và yêu cầu đầu ra để sáng tác bài tập tương đương. |
| **6. Mã nguồn Dự án lớn** | `chapter_12-14`, `chapter_15-17`, `chapter_18-20` | Toàn bộ mã nguồn 3 dự án lớn: Game Alien Invasion, Data Visualization và Django Learning Log. | Chia nhỏ thành các mốc dự án (Project Checkpoints) và bài tập thành phần trong học phần Dự án (Part II). |

---

## 4. PHÂN TÍCH RỦI RO BẢN QUYỀN & CHÍNH SÁCH BẢO VỆ SỞ HỮU TRÍ TUỆ

### 4.1. Đánh giá tình trạng bản quyền
- Cuốn sách **"Python Crash Course, 3rd Edition"** là tác phẩm có bản quyền thuộc sở hữu của tác giả **Eric Matthes** và nhà xuất bản **No Starch Press** (Mỹ).
- Repository GitHub `pcc_3e` cung cấp mã nguồn nhằm mục đích hỗ trợ độc giả mua sách học tập. Mặc dù mã nguồn mở trên GitHub, nhưng toàn bộ cấu trúc văn bản giải thích, hệ thống bài tập "Try It Yourself" và lời văn trong sách đều được bảo hộ nghiêm ngặt theo luật bản quyền quốc tế (DMCA, Berne Convention).
- Trang web W3Schools (`w3schools.com`) cũng sở hữu bản quyền toàn bộ các bài viết và bài giảng hướng dẫn.

### 4.2. Chính sách "Zero Copyright Infringement" của CodeCoBUG
Để đảm bảo nền tảng CodeCoBUG hoàn toàn trong sạch về mặt pháp lý, sẵn sàng thương mại hóa hoặc phát hành công cộng:
1. **Không sao chép nguyên văn (No Verbatim Copying)**: Tuyệt đối không copy-paste bất kỳ đoạn văn giải thích lý thuyết nào từ sách PCC 3E hoặc từ trang web W3Schools.
2. **Biên soạn 100% tiếng Việt nguyên bản (Original Vietnamese Pedagogy)**:
   - Toàn bộ nội dung bài học được viết bằng tiếng Việt tự nhiên, phù hợp với lứa tuổi học sinh, sinh viên và người mới bắt đầu lập trình tại Việt Nam.
   - Sử dụng các ví dụ thực tế gần gũi với đời sống Việt Nam (quản lý tiền ăn, điểm thi đại học, tính tiền điện, phân tích thời tiết Hà Nội/TP.HCM).
3. **Độc quyền bài tập và Test Cases (Original Exercises & Test Suites)**:
   - Không lấy nguyên văn các đề bài "Try It Yourself" của sách.
   - Tự thiết kế đề bài mới kiểm tra cùng một khái niệm cốt lõi (Core Competency) với ít nhất 3 bộ test case độc lập do CodeCoBUG phát triển.
4. **Ghi nhận nguồn cảm hứng & Dẫn link tham khảo (Proper Attribution & External Links)**:
   - Nêu rõ trong phần tài liệu tham khảo: Nền tảng lấy cảm hứng từ cấu trúc sư phạm của W3Schools và Python Crash Course 3E của tác giả Eric Matthes.
   - Đặt link tra cứu mở rộng tới trang chính thức của Eric Matthes (`https://ehmatthes.github.io/pcc_3e/`) và W3Schools (`https://www.w3schools.com/python/`).

---

## 5. ĐÁNH GIÁ KHẢ THI KỸ THUẬT: MÔI TRƯỜNG WEBASSEMBLY (PYODIDE) VS CÁC DỰ ÁN PCC 3E

Một trong những thách thức kỹ thuật lớn nhất khi tích hợp PCC 3E vào CodeCoBUG là việc CodeCoBUG đang sử dụng **Pyodide WebAssembly** chạy trực tiếp trong trình duyệt người dùng. Dưới đây là phân tích chi tiết khả năng tương thích của từng phần trong PCC 3E:

| Học phần PCC 3E | Công nghệ yêu cầu | Khả năng chạy trên Pyodide WebAssembly | Giải pháp kiến trúc của CodeCoBUG |
| :--- | :--- | :---: | :--- |
| **Chương 1–10: Nền tảng Python** | Python core, cú pháp, I/O, OOP, File text/JSON | **100% Khả thi** | Chạy mượt mà trong Web Worker; Pyodide tích hợp sẵn hệ thống tệp ảo Emscripten MEMFS để mô phỏng đọc/ghi file. |
| **Chương 11: Testing với `pytest`** | Thư viện bên thứ ba `pytest` | **Khả thi cao** | `pytest` có thể cài đặt trực tiếp vào Pyodide thông qua `micropip.install('pytest')`. Hoặc CodeCoBUG có thể biên soạn bộ runner kiểm thử unit test hiển thị trực quan trên giao diện. |
| **Dự án 1: Alien Invasion (Ch 12–14)** | Thư viện đồ họa `pygame` | **Bị giới hạn** | Pygame desktop cần hệ thống cửa sổ SDL native. Giải pháp kết hợp: <br>1. **Module Thuật toán**: Các bài tập chia nhỏ chấm điểm logic tọa độ, va chạm, tính điểm bằng Judge Engine.<br>2. **Trình giả lập Canvas**: Sử dụng `pygame-ce` wasm hoặc Canvas 2D render cho phiên bản demo.<br>3. **Hướng dẫn Local**: Khóa học cung cấp checklist và hướng dẫn học viên tải code về chạy trên VS Code máy tính thật. |
| **Dự án 2: Data Visualization (Ch 15–17)** | `matplotlib`, `plotly`, `requests` | **Rất khả thi** | - `matplotlib` được Pyodide hỗ trợ chính thức, có thể xuất hình ảnh đồ thị ra thẻ HTML5 Canvas hoặc định dạng SVG trực tiếp.<br>- `plotly` có thể xuất dữ liệu JSON và vẽ biểu đồ tương tác cực đẹp bằng thư viện Plotly.js ở giao diện frontend.<br>- `requests`: Pyodide bị chặn raw sockets do chính sách CORS trình duyệt, nhưng có thể thay thế bằng `pyodide-http` hoặc fetch API. |
| **Dự án 3: Web Apps với Django (Ch 18–20)** | Django 4.1, SQLite, HTTP Server, Platform.sh | **Không khả thi trên WebAssembly thuần** | Django là một web framework phía backend cần tiến trình server chạy ngầm liên tục và kết nối mạng thực. Giải pháp kiến trúc:<br>1. **Module MVT Sandbox**: Chấm điểm các bài tập viết Django Models, Views, Forms, URL routing bằng các bộ unit test mock.<br>2. **Project Milestones**: Học viên phát triển dự án trên môi trường máy cá nhân theo hướng dẫn từng bước của CodeCoBUG và nộp link GitHub / Platform.sh để AI Tutor đánh giá mã nguồn. |

---

## 6. PHÂN TÍCH KHOẢNG TRỐNG KIẾN THỨC (GAP ANALYSIS)

### 6.1. Những nội dung xuất sắc trong PCC 3E mà CodeCoBUG cần bổ sung (Gaps to Add)
1. **Kiểm thử tự động với `pytest` (Chương 11)**:
   - *Hiện trạng*: CodeCoBUG mới chỉ có Judge Engine chấm bài nộp của học viên, chưa dạy học viên tự viết Unit Test cho code của mình.
   - *Giải pháp*: Bổ sung Chương/Bài học chuyên biệt về Viết mã kiểm thử với `pytest`, tư duy Test-Driven Development (TDD), hàm `assert`, và sử dụng `@pytest.fixture`.
2. **Thao tác tệp hiện đại với module `pathlib` (Chương 10)**:
   - *Hiện trạng*: CodeCoBUG Chương 10 đang dạy hàm `open()` truyền thống theo chuẩn W3Schools.
   - *Giải pháp*: Cập nhật thêm cách tiếp cận hướng đối tượng hiện đại của Python 3.11+ bằng `from pathlib import Path`, `Path.read_text()`, `Path.write_text()`.
3. **Các phương thức xử lý chuỗi mới trong Python 3.9+ (Chương 2)**:
   - *Bổ sung*: `removeprefix()` và `removesuffix()`, kỹ năng phân tích thông báo lỗi mới rõ ràng của Python 3.11+.
4. **Học tập thông qua dự án hoàn chỉnh (Part II Projects)**:
   - *Hiện trạng*: CodeCoBUG chủ yếu tập trung vào các bài tập giải thuật đơn lẻ từ 1 đến 50 dòng code.
   - *Giải pháp*: Bổ sung phân hệ Dự án (Projects Module) với 3 dự án lớn: Game Pygame, Trực quan hóa dữ liệu và Ứng dụng Web Django.

### 6.2. Những nội dung W3Schools / CodeCoBUG sở hữu mà PCC 3E bỏ qua hoặc nói rất lướt
1. **Tuple và Set chuyên sâu**: PCC 3E chỉ giới thiệu Tuple ngắn gọn trong 2 trang và Set trong 1 trang. CodeCoBUG Chủ đề 05 dạy rất kỹ các phép toán tập hợp (Hợp, Giao, Hiệu, Hiệu đối xứng) và tính bất biến của Tuple.
2. **Hàm ẩn danh Lambda & Công cụ hàm**: W3Schools và CodeCoBUG dạy `lambda`, `map()`, `filter()`. PCC 3E hoàn toàn không đề cập đến `lambda`.
3. **Đệ quy (Recursion)**: CodeCoBUG Chủ đề 08 dạy tư duy đệ quy, điều kiện cơ sở (base case) và đệ quy đuôi. PCC 3E không có đệ quy.
4. **Phương thức đặc biệt Dunder / Magic Methods**: CodeCoBUG Chủ đề 11 dạy `__str__`, `__repr__`, `__len__`, `__add__`. PCC 3E chỉ dạy duy nhất `__init__`.
5. **Bộ sinh dữ liệu (Generators & `yield`)**: CodeCoBUG Chủ đề 12 có bài học về Generators giúp tiết kiệm bộ nhớ khi xử lý dữ liệu lớn. PCC 3E không có.
6. **Biểu thức chính quy (Regular Expressions - `re`)**: Module tìm kiếm mẫu chuỗi nâng cao có trong W3Schools và CodeCoBUG.

---

## 7. KẾT LUẬN & HOÀN THÀNH STEP 1 COMPLETION GATE

Báo cáo kiểm toán này xác nhận:
- [x] Đã đọc toàn bộ `AGENT.md`.
- [x] Đã clone và kiểm tra trực tiếp repository `ehmatthes/pcc_3e` trên thực tế.
- [x] Đã phân biệt rõ ràng 5 nhóm tệp: Code ví dụ, chương trình từng bước, cheat sheets, tài liệu online, và solution files.
- [x] Đã xác định rõ ràng phạm vi bản quyền và cam kết 100% nội dung tiếng Việt gốc độc quyền.
- [x] Đã đánh giá tính khả thi khi chạy trên WebAssembly Pyodide.
- [x] Không can thiệp sửa đổi database hay xóa bất kỳ tính năng nào ở bước khảo sát này.

Hai tài liệu tiếp theo đã được lập để hoàn tất đầy đủ yêu cầu của Step 1:
- [`docs/PYTHON_CURRICULUM_MAPPING.md`](file:///Users/huy/Downloads/Python%20-%20Gi%E1%BA%A3%20l%E1%BA%ADp/docs/PYTHON_CURRICULUM_MAPPING.md): Bản đồ đối chiếu hợp nhất 20 chương PCC 3E, W3Schools và 12 Chủ đề CodeCoBUG.
- [`docs/PYTHON_LEARNING_PREREQUISITES.md`](file:///Users/huy/Downloads/Python%20-%20Gi%E1%BA%A3%20l%E1%BA%ADp/docs/PYTHON_LEARNING_PREREQUISITES.md): Sơ đồ cây điều kiện tiên quyết trước khi bước vào từng chương và từng dự án lớn.
