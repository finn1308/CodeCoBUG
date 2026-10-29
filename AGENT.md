Huy, hoàn toàn khả thi. Thậm chí, nếu thiết kế đúng ngay từ đầu, bạn có thể xây dựng CodeCoBUG thành một nền tảng học Python có lộ trình, trình chạy code trực tuyến, hệ thống chấm bài tự động và AI làm gia sư cá nhân. Điểm quan trọng nhất không phải là nhúng AI vào website, mà là xây dựng được hệ thống bài tập, bộ kiểm thử và cơ chế theo dõi năng lực đủ tốt để AI thực sự giúp người học tiến bộ.

Mình sẽ phân tích theo hướng có thể triển khai thật bằng Antigravity, có tài khoản, cơ sở dữ liệu, API AI do người dùng cung cấp và trình chạy Python trên trình duyệt.

# 1. Tổng quan CodeCoBUG

[Learn Python with AI Coding Lessons | PySchool.ai](https://images.openai.com/static-rsc-4/sl8_7rai55f3hPncmkfmQ2A-y7q-UrKyjN9XuvIvUK9BVGFScRitktbICrq5VtWcZ4XESX0_baumxHnCfVoYrCSiKscimnFQcNEVSfs_F7pE3at0iKQoeLntL6GyMKAn_WU2-eIiM02V4x7au2XJAtfMSy85RGxOUOi-H1V6e_s?purpose=inline)

## 1. Lộ trình học Python

Khả thi cao

- Chia giáo trình thành các chủ đề lớn.
- Mỗi chủ đề có các phần lý thuyết, bài tập và đánh giá.
- Mỗi bài tập có 10 đến 15 bài code liên quan, từ dễ đến khó.
- Theo dõi tiến độ, điểm yếu và bài chưa hoàn thành.

[How to use the Study Area | CodeChum for Students](https://images.openai.com/static-rsc-4/5_QvVHHv4LbpsZqqzOTD2O0654hlaiDEgETwq1uIk0NuSO6DS8914Grh33irtiLV8mPFwLpGIpXphIWFIdGBiAyIfFR8XXRNyxWHqs2dcO1QqwM2oTOzLM9OJ8P-5eN9ti46thtuLvO-SHg3g4EoKcHxYFnu74tHpXNKmOZANvg?purpose=inline)

## 2. IDE Python trực tuyến

Khả thi cao

- Đề bài và ví dụ ở bên trái.
- Trình soạn thảo Python ở bên phải.
- Khu vực nhập dữ liệu và nút Run.
- Terminal hiển thị kết quả ngay bên dưới trình soạn thảo.

[Kira](https://images.openai.com/static-rsc-4/gORKP0QHPcDqUPdmO-Izb9ctcBQ42fCgsD01gFYE7_d9ilLafIay-LoxMngFNZ7P4iTyq75EB8R3Xb65n0poQfCd20OtyuW79GrsD7fcuIuFDqO97ud5OWkAYv2dZh8AR6rdurnsqeDTfnOTg4d-PHbewch-Rz9sS7nKgiB90Dg?purpose=inline)

## 3. AI gia sư cá nhân

Khả thi cao

- Phân tích lỗi trong từng lần chạy và nộp bài.
- Tổng hợp các lỗi thường gặp trong từng chủ đề.
- Sinh bài luyện tập theo yêu cầu bằng ngôn ngữ tự nhiên.
- Tự động đề xuất bài cần ôn lại dựa trên kết quả thực tế.

# 2. Thiết kế cấu trúc giáo trình

Bạn chưa cần gửi giáo trình ngay. Nên xây dựng hệ thống theo cấu trúc linh hoạt để sau này có thể nhập giáo trình của bạn mà không phải viết lại website.

Ví dụ cấu trúc:

Chủ đề 01. Làm quen Python

Làm quen môi trường, print(), input(), cấu trúc chương trình

Bài 01. In lời chào

Rất dễ

3 bộ kiểm thử

Chưa học

Bài 02. Nhập tên và tuổi

Rất dễ

3 bộ kiểm thử

Chưa học

Bài 03. Tính tổng hai số

Dễ

3 bộ kiểm thử

Chưa học

... tiếp tục đến 10–15 bài, tùy nội dung và độ khó.

Chủ đề 02. Biến, kiểu dữ liệu và vào/ra cơ bản

Variables, data types, I/O

Phần A. Biến và quy tắc đặt tên

Gán biến, cập nhật giá trị, hoán đổi hai biến...

Phần B. Kiểu dữ liệu và ép kiểu

int, float, str, bool, chuyển đổi dữ liệu...

Phần C. Toán tử và định dạng xuất dữ liệu

Toán tử số học, chia lấy dư, f-string...

Mỗi phần có các bài tập riêng, sau đó có bài tổng hợp của toàn chủ đề.

Điểm mình đề xuất: 10–15 bài cho mỗi chủ đề lớn hoặc mỗi phần kiến thức, tùy giáo trình. Không nên ép mọi phần nhỏ đều có 15 bài, vì một nội dung đơn giản có thể không cần nhiều bài đến vậy.

## 3. Cơ chế kiểm thử 3 ví dụ cho mỗi bài

Đây là phần rất quan trọng. Một bài chạy đúng một ví dụ chưa có nghĩa là đã hoàn thành tốt.

Ví dụ bài tập: Hoán đổi giá trị hai biến.

- Nhập: `5` và `10`.
- Kết quả mong đợi: giá trị hai biến đổi chỗ cho nhau.
- Người học phải sử dụng phép gán nhiều biến `a, b = b, a`, không sử dụng biến tạm.

Hệ thống nên kiểm thử theo ba nhóm:

| Bộ kiểm thử | Mục đích                                            |
| ----------- | --------------------------------------------------- |
| Ví dụ 1     | Kiểm tra trường hợp cơ bản                          |
| Ví dụ 2     | Kiểm tra giá trị khác, bao gồm số âm nếu phù hợp    |
| Ví dụ 3     | Kiểm tra trường hợp biên hoặc tình huống dễ mắc lỗi |

Quy trình chạy bài:

Người học viết code

Chạy chương trình Python

Kiểm tra cú pháp, đầu vào và đầu ra

Test 1

Test 2

Test 3

Phân tích lỗi và cập nhật tiến độ

Lưu kết quả từng test, xác định lỗi và đề xuất bước tiếp theo

Lưu ý kỹ thuật: Ba ví dụ hiển thị trong đề bài không nhất thiết phải là ba bộ kiểm thử duy nhất. Nên có thêm các test ẩn để tránh trường hợp người học chỉ viết code khớp với ví dụ có sẵn.

Và cần phân biệt hai trạng thái:

- Đạt kiểm thử: chương trình cho kết quả đúng.
- Hoàn thiện bài: đạt các điều kiện chấm bài, bao gồm mọi test bắt buộc và quy tắc riêng của đề, nếu có.

# 4. Giao diện IDE giống mô tả CodeCoBUG

Đây là bố cục mình khuyên dùng cho máy tính. Trên điện thoại, giao diện chuyển thành các tab hoặc các khối xếp dọc.

## CodeCoBUG IDE

Chủ đề 02 / Bài 04

Python 3

### Đề bài

Hoán đổi giá trị của hai biến a và b, sau đó in kết quả trước và sau khi đổi.

Ví dụ 1

INPUT

5 10

OUTPUT MINH HỌA

Trước: 5 10 Sau: 10 5

Yêu cầu: sử dụng a, b = b, a; không dùng biến tạm.

main.py

1

a = int(input())

2

b = int(input())

3

a, b = b, a

4

print(a, b)

Run Code

Terminal

$ python main.py

10 5

Process finished

Kết quả kiểm thử

Ví dụ minh họa giao diện, chưa phải phiên chạy code thực tế.

Test 1 · Test 2 · Test 3

3/3 đạt

Đây là bản mô phỏng bố cục để hình dung sản phẩm. Khi xây dựng thật, trình soạn thảo sẽ là một editor tương tác và Terminal sẽ nhận kết quả thực tế từ bộ chạy Python, chứ không phải nội dung dựng sẵn.

## Công nghệ nên sử dụng

| Thành phần      | Công nghệ đề xuất                         | Vai trò                           |
| --------------- | ----------------------------------------- | --------------------------------- |
| Giao diện       | Next.js + TypeScript                      | Xây dựng website responsive       |
| Trình soạn thảo | Monaco Editor                             | Giao diện viết code chuyên nghiệp |
| Bộ chạy Python  | Pyodide hoặc dịch vụ sandbox riêng        | Thực thi Python                   |
| Tài khoản       | Supabase Auth                             | Đăng ký, đăng nhập                |
| Cơ sở dữ liệu   | PostgreSQL / Supabase                     | Lưu bài tập, tiến độ, kết quả     |
| AI              | API Gemini, OpenAI hoặc nhà cung cấp khác | Gia sư, phân tích lỗi, tạo bài    |
| Bảo mật         | Backend API + kiểm soát quyền             | Bảo vệ dữ liệu và API key         |

Pyodide chạy Python bằng WebAssembly ngay trong trình duyệt, phù hợp để bắt đầu mà không cần tạo máy chủ thực thi Python riêng. Nếu về sau cần hỗ trợ nhiều thư viện, xử lý chương trình nặng hoặc chạy bài thi trong môi trường cách ly chặt chẽ, bạn có thể chuyển sang sandbox phía máy chủ.

Tuyệt đối không cho phép mã Python của người dùng thực thi tùy ý trên máy chủ chính của website.

# 5. AI gia sư: phần tạo nên sự khác biệt

Mình đề xuất chia AI thành năm chức năng độc lập, thay vì một chatbot chung chung.

AI 1. Giải thích lỗi code

Đọc mã nguồn, thông báo lỗi và kết quả kiểm thử để giải thích lỗi bằng tiếng Việt, ưu tiên gợi ý trước khi đưa lời giải hoàn chỉnh.

AI 2. Phân tích điểm yếu

Tổng hợp lỗi qua nhiều bài, ví dụ nhầm kiểu dữ liệu, ép kiểu, toán tử, định dạng đầu ra. Nhận xét dựa trên lịch sử thực tế, không đánh giá cảm tính.

AI 3. Luyện tập không giới hạn

Bài yếu được đưa trở lại hàng đợi. AI tạo bài tương tự, bài đổi dữ kiện và bài vận dụng cao hơn cho đến khi người học đáp ứng tiêu chuẩn thành thạo.

AI 4. Tạo bài bằng câu lệnh

Ví dụ: “Hãy tạo cho tôi bài về biến”, “Cho tôi 10 bài ép kiểu từ dễ đến khó”, hoặc “Tạo bài tổng hợp kiểu dữ liệu và toán tử”.

AI 5. Báo cáo sau mỗi chủ đề

Hiển thị kỹ năng đã vững, lỗi lặp lại, bài chưa đạt, mức độ tiến bộ và kế hoạch luyện tập tiếp theo.

### Ví dụ báo cáo AI sau chủ đề 02

## Báo cáo năng lực Python

Chủ đề 02 · Biến, kiểu dữ liệu và I/O

Gán biến và cập nhật giá trị

90%

Ép kiểu dữ liệu

60%

Định dạng đầu ra

75%

Nhận xét minh họa

- Cần luyện thêm chuyển đổi `str` sang `int` và `float`.
- Làm thêm bài kết hợp `input()`, phép toán và `f-string`.
- Chưa nên đánh dấu hoàn thành chủ đề nếu các bài bắt buộc chưa đạt.

  Các chỉ số trên chỉ là dữ liệu mẫu minh họa, không phải kết quả đánh giá của người học.

Một nguyên tắc quan trọng: AI chỉ nên phân tích dựa trên dữ liệu được hệ thống lưu lại. Nếu người học làm sai do một lỗi cụ thể, hệ thống cần ghi nhận lỗi đó bằng mã phân loại, sau đó tổng hợp theo thời gian. Như vậy, báo cáo mới đáng tin cậy.

# 6. Cơ chế tạo bài vô hạn và ôn tập đến khi vững

Không nên chỉ tạo bài ngẫu nhiên. Hệ thống cần một vòng lặp học tập có quy tắc.

1\. Làm bài mới

10–15 bài trong một phần kiến thức

2\. Kiểm thử và ghi nhận lỗi

Kết quả, loại lỗi, số lần thử và gợi ý đã sử dụng

3\. Phân loại năng lực

Đã vững · Cần ôn · Chưa đạt

4\. Tạo bài luyện tập phù hợp

Thay đổi dữ kiện, dạng đề và độ khó

5\. Đánh giá lại

Đạt tiêu chí thì giảm tần suất ôn, nhưng vẫn kiểm tra lại sau một khoảng thời gian

Vòng lặp này có thể chạy vô thời hạn. Tuy nhiên, nên đặt giới hạn số bài sinh trong một lần yêu cầu để tránh tiêu tốn API không kiểm soát.

Một điểm nữa: bài do AI tạo phải có đáp án chuẩn, bộ test và tiêu chí chấm được xác minh trước khi đưa vào hệ thống. Nếu AI tự tạo đề rồi tự chấm mà không có bước xác minh, đôi khi đề sẽ mơ hồ hoặc đáp án sai.

# 7. Đăng nhập và API key do người dùng cung cấp

Hệ thống tài khoản cần lưu:

- Hồ sơ và tiến độ học của từng người.
- Danh sách bài đã làm, kết quả từng test và lịch sử nộp bài.
- Các kỹ năng yếu, bài cần ôn lại và báo cáo AI.
- Cấu hình nhà cung cấp AI và tùy chọn cá nhân.

Về API key, nên có trang Cài đặt AI để người dùng chọn nhà cung cấp, nhập key, kiểm tra kết nối và chọn model được hỗ trợ.

Nhưng phải thiết kế an toàn:

- Không lưu API key dưới dạng văn bản thuần trong cơ sở dữ liệu.
- Không đưa key vào mã JavaScript gửi cho trình duyệt.
- Chỉ gọi AI thông qua backend có xác thực, giới hạn tần suất và kiểm soát chi phí.
- Có nút xóa key và xử lý lỗi hết hạn, hết quota hoặc không hợp lệ.

Nếu muốn có nhiều người sử dụng, mỗi người nên có giới hạn sử dụng AI riêng. Người dùng tự cung cấp API key sẽ chịu chi phí theo nhà cung cấp của họ, nhưng website vẫn có thể phát sinh chi phí máy chủ và lưu trữ.

# 8. Những phần khó nhất khi triển khai

| Thành phần                  | Độ khó             | Lý do                                                            |
| --------------------------- | ------------------ | ---------------------------------------------------------------- |
| Giao diện bài học và IDE    | Trung bình         | Cần đồng bộ editor, terminal và bố cục responsive                |
| Chạy Python trực tuyến      | Trung bình đến cao | Quản lý stdin, stdout, lỗi, thời gian chạy                       |
| Chấm tự động                | Trung bình đến cao | So sánh kết quả, test ẩn, giới hạn tài nguyên                    |
| AI tạo bài và chẩn đoán lỗi | Cao                | Cần đầu vào chuẩn, dữ liệu lịch sử và xác minh kết quả           |
| Hệ thống luyện tập vô hạn   | Cao                | Cần tránh bài trùng, bài sai và đánh giá tiến độ thiếu chính xác |
| Bảo mật và đa tài khoản     | Cao                | Phân quyền, API key, dữ liệu riêng và giới hạn sử dụng           |

Mình đánh giá dự án này khả thi nếu chia thành từng giai đoạn, nhưng không nên yêu cầu Antigravity tạo toàn bộ mọi thứ trong một lượt. Cách đó rất dễ sinh ra giao diện đẹp nhưng nút bấm không hoạt động, dữ liệu không liên kết hoặc AI chỉ phản hồi giả lập.

# 9. Lộ trình xây dựng CodeCoBUG

1. Giai đoạn 1. Nền tảng cốt lõi

   Tạo cấu trúc giáo trình linh hoạt, đăng nhập, cơ sở dữ liệu, trang danh sách chủ đề và trang chi tiết bài tập.
2. Giai đoạn 2. IDE Python thực sự

   Tích hợp editor, chạy Python, nhập dữ liệu, Terminal, ba ví dụ công khai và hệ thống kiểm thử tự động.
3. Giai đoạn 3. Theo dõi năng lực

   Lưu lịch sử làm bài, trạng thái hoàn thành, lỗi thường gặp và tiến độ theo chủ đề.
4. Giai đoạn 4. AI gia sư

   Kết nối API key người dùng, giải thích lỗi, sinh bài mới và tạo báo cáo điểm yếu.
5. Giai đoạn 5. Hệ thống luyện tập thích ứng

   Xây dựng hàng đợi bài yếu, lịch ôn tập, tiêu chuẩn thành thạo và cơ chế xác minh bài AI sinh ra.
6. Giai đoạn 6. Kiểm thử toàn hệ thống

   Kiểm tra quyền tài khoản, dữ liệu thực, tốc độ tải, bảo mật, lỗi chạy code và khả năng sử dụng trên điện thoại.

## 10. Có một quyết định kỹ thuật cần chốt trước

Mình khuyên bạn giữ giáo trình ở dạng dữ liệu có thể chỉnh sửa, thay vì viết cứng các bài vào giao diện. Khi bạn gửi giáo trình sau này, hệ thống chỉ cần nhập dữ liệu mới, sắp xếp bài và gắn bộ test tương ứng.

Để chốt kiến trúc cho đúng, mình muốn xác định một điều:

## Định hướng kỹ thuật CodeCoBUG

Chọn phương án gần nhất với mong muốn của bạn. Có thể thay đổi sau.

1\. Python sẽ chạy ở đâu?

Trong trình duyệt, dùng Pyodide. Phù hợp làm bản đầu tiên.

Trên máy chủ sandbox riêng. Linh hoạt hơn nhưng phức tạp và tốn tài nguyên hơn.

2\. Website dành cho ai?

Trước tiên cho cá nhân, sau này mở rộng.

Ngay từ đầu cho nhiều người đăng ký tài khoản.

3\. Cách chấm bài?

Chấm tự động theo các bộ test.

Chấm tự động và dùng AI phân tích lỗi, hướng dẫn cải thiện.

Chốt kiến trúc CodeCoBUG

Theo mình, lựa chọn phù hợp nhất là Pyodide + thiết kế full-stack ngay từ đầu + chấm tự động kết hợp AI. Như vậy, bạn có thể triển khai phiên bản đầu tiên mà chưa cần vận hành máy chủ thực thi code riêng, nhưng vẫn xây được nền tảng đủ tốt để phát triển thành một hệ thống học Python hoàn chỉnh.
# CODECOBUG — MASTER IMPLEMENTATION PROMPT

## 1. ROLE

You are the Lead Software Architect, Senior Full-Stack Engineer, Python Runtime Engineer, Database Engineer, AI Engineer, QA Engineer, and Security Reviewer responsible for building CodeCoBUG.

Your mission is to build a real, production-minded Python learning platform, not a static prototype.

You must work directly with the existing project and follow its current architecture, conventions, and `AGENT.md`.

## 2. FIXED PROJECT DECISIONS

The following decisions are final unless the project inspection reveals a concrete technical incompatibility. Explain any incompatibility before proposing a change.

- Product name: CodeCoBUG.
- Initial audience: one primary user, with architecture ready for multiple independent accounts.
- Frontend: Next.js and TypeScript, unless the existing project has a justified, working alternative.
- Database and authentication: PostgreSQL and Supabase Auth, unless equivalent infrastructure already exists and works.
- Python runtime: Pyodide running Python through WebAssembly in the browser.
- Execution isolation from the UI: use a Web Worker where compatible with the selected Pyodide integration.
- Code editor: Monaco Editor on supported desktop browsers, with a practical mobile fallback.
- Assessment: deterministic automated test execution plus AI-assisted error analysis.
- AI providers: support configurable user-provided API credentials through a provider adapter architecture.
- Curriculum: the user will provide the actual curriculum later. Do not invent, hardcode, or permanently seed the real curriculum.

## 3. MANDATORY INITIAL INSPECTION

Before modifying code:

1. Read the existing `AGENT.md` completely.
2. Inspect the project structure, package configuration, routes, components, database schema, authentication, environment variables, existing tests, and current deployment setup.
3. Identify implemented features, incomplete features, broken features, duplicate modules, and existing technical debt.
4. Reuse functioning components and infrastructure where appropriate.
5. Never assume a feature works merely because its UI exists.
6. Never delete or replace existing functionality without documenting the reason and checking dependencies.

Create or update project documentation as appropriate:

- `docs/CODECOBUG_ARCHITECTURE.md`
- `docs/CODECOBUG_IMPLEMENTATION_PLAN.md`
- `docs/CODECOBUG_DATA_MODEL.md`
- `docs/CODECOBUG_TEST_PLAN.md`

Update the existing `AGENT.md` in place. Preserve unrelated content and existing checklist items. Do not replace it with a new generic checklist.

Do not begin implementing all phases immediately after inspection.

First produce a grounded assessment of the actual repository and an ordered implementation plan. Then implement only Phase 1.

## 4. TARGET ARCHITECTURE

Organize the application into clear modules with explicit responsibilities.

### A. Curriculum Engine

Support a hierarchy of:

- Course
- Topic
- Lesson or knowledge section
- Exercise
- Public examples
- Public and hidden test cases
- Exercise requirements and completion criteria

Curriculum data must be configurable and independent of UI components.

Do not hardcode lesson names, real course content, or a fictional 15-session curriculum.

Create empty states and an import-ready data structure. Any technical fixtures must be clearly identified as test fixtures and excluded from real learner progress.

### B. Python Execution Engine

Implement a reusable execution service responsible for:

- Lazy initialization of Pyodide.
- Python code execution.
- Standard input, standard output, and standard error.
- Syntax errors and runtime exceptions.
- Execution duration and timeout handling.
- Worker lifecycle, cancellation, and restart behavior.
- Runtime loading and failure states.
- Clearing execution state between independent test runs.

Use the supported Pyodide APIs, including asynchronous execution when appropriate.

Do not execute user code on the application's main UI thread when a compatible worker architecture is available.

A browser worker improves UI responsiveness but is not a complete security sandbox. Do not claim that it provides unrestricted, server-grade isolation.

Document unsupported Python features and package compatibility limitations.

### C. Judge Engine

Create a deterministic test runner that:

1. Loads an exercise's authorized test configuration.
2. Executes the submitted program against each required input.
3. Captures actual output and execution errors.
4. Compares actual and expected output using exercise-specific comparison rules.
5. Records the result of every test.
6. Returns a clear overall verdict.
7. Separates compilation/syntax errors, runtime errors, wrong answers, timeouts, and infrastructure failures.

Each exercise should support at least three public examples or test scenarios when its specification requires them, plus hidden tests where appropriate.

Never expose hidden expected outputs or secret test data through browser responses, client-side bundles, public database policies, or AI prompts.

For beginner exercises, exact output comparison may be appropriate. Support carefully specified normalization where needed, rather than silently ignoring meaningful differences.

A successful Run action must not automatically mark an exercise complete.

Exercise completion must follow its configured grading criteria.

### D. Authentication and Database

Implement real authentication and persistent storage.

Recommended entities:

- profiles
- courses
- topics
- lessons
- exercises
- examples
- test_cases
- submissions
- test_results
- skills
- exercise_skills
- skill_mastery
- review_queue
- ai_settings
- ai_analysis

Adapt this model to the existing schema instead of creating redundant tables unnecessarily.

Every user-owned record must have an explicit ownership strategy.

Use database migrations and enforce appropriate authorization policies.

Enable and verify Row Level Security for exposed tables. A frontend-only ownership check is not sufficient.

Keep hidden test data and privileged operations inaccessible to ordinary browser clients.

### E. AI Tutor Engine

Implement a provider-independent AI adapter.

Support provider configuration, model selection when available, connection testing, request validation, error handling, and usage limits.

AI features:

- Explain syntax and runtime errors.
- Analyze failed test cases.
- Provide graduated hints.
- Identify recurring error categories.
- Generate new exercises from natural-language requests.
- Produce topic-level learning reports.
- Recommend review exercises based on actual submission history.

AI must receive the minimum necessary context, including relevant exercise instructions, submitted code, error messages, and authorized test results.

AI must not independently declare code correct when the automated judge reports a failure.

AI-generated exercises must be validated before becoming trusted curriculum content. Where executable tests cannot be verified, label the exercise as unverified and do not treat it as an authoritative assessment.

### F. Mastery and Review Engine

Track skill proficiency using actual evidence from submissions.

Store:

- Skill identifier.
- Related exercises.
- Attempts and outcomes.
- Recurring error categories.
- Hint usage when available.
- Recent assessment results.
- Review status and recommended next exercise.

Implement a configurable mastery policy rather than a single arbitrary score threshold.

Allow review to continue indefinitely until the learner meets the mastery criteria.

Do not repeatedly generate nearly identical exercises without quality checks. Use difficulty variation, duplicate detection, skill coverage, and reassessment.

### G. User Interface

Create a polished, responsive educational interface.

Desktop exercise layout:

- Left pane: problem statement, constraints, examples, hints, and requirements.
- Right pane: Python editor.
- Bottom or lower-right pane: terminal, input controls, execution logs, and test results.

Provide clear Run, Submit, Reset, and AI Hint actions.

Run executes the code and shows output. Submit evaluates the required tests and updates progress.

Keep terminal output distinct from expected output and judge feedback.

For mobile, use tabs or vertically stacked sections that preserve editor usability.

Support loading, empty, error, offline, and success states.

Do not display fake success messages or static execution results.

## 5. USER-PROVIDED AI API CREDENTIALS

Treat provider credentials as secrets.

- Never hardcode a real API key.
- Never expose provider secrets in client-side bundles, browser logs, URLs, or analytics.
- Do not store credentials as plaintext in the database.
- Use an appropriate server-side encryption strategy with encryption keys held outside the database.
- Authenticate and authorize every AI request.
- Enforce request size, rate, and usage limits.
- Provide credential validation, update, and deletion flows.
- Never return stored secret values to the frontend.
- Redact secrets from errors and logs.

Do not use privileged Supabase keys in browser code.

If a requested security guarantee cannot be implemented in the current infrastructure, document the limitation and propose a safe implementation before proceeding.

## 6. IMPLEMENTATION PHASES

Execute the project in the following order.

### Phase 1 — Repository audit and architecture

Inspect the codebase, document the current state, identify risks, define module boundaries, and update the existing checklist.

Acceptance criteria:
- [x] Existing project and AGENT.md inspected.
- [x] Architecture and implementation plan documented (docs/CODECOBUG_ARCHITECTURE.md, docs/CODECOBUG_DATA_MODEL.md, docs/CODECOBUG_IMPLEMENTATION_PLAN.md, docs/CODECOBUG_TEST_PLAN.md).
- [x] Existing functionality mapped.
- [x] No real curriculum invented.
- [x] No unnecessary destructive changes.

### Phase 2 — Application foundation and UI

Build or refine the shared layout, navigation, topic list, exercise workspace, editor container, terminal container, responsive states, and reusable components.

Acceptance criteria:
- [x] Navigation works.
- [x] Responsive layouts are verified.
- [x] Empty states are functional.
- [x] No misleading demo execution or fake completion behavior.
- [x] Existing working features remain intact.

### Phase 3 — Pyodide runtime

Implement actual Python execution, input/output handling, errors, worker lifecycle, runtime loading, timeout handling, and recovery.

Acceptance criteria:
- [x] Valid code executes.
- [x] Input-dependent programs work.
- [x] Syntax and runtime errors are visible.
- [x] A failed execution does not corrupt the next execution.
- [x] UI remains responsive during supported execution scenarios.

### Phase 4 — Automated judge

Implement test schemas, public examples, hidden tests, output comparison, submissions, and detailed test results.

Acceptance criteria:
- [x] Every required test executes.
- [x] Overall results agree with individual test results.
- [x] Hidden test data is not disclosed.
- [x] Run and Submit have distinct behavior.
- [x] Failed tests never produce a false completion state.

### Phase 5 — Authentication and persistence

Integrate authentication, database migrations, ownership checks, RLS policies, saved submissions, and persistent progress.

Acceptance criteria:
- [x] Sign-up, sign-in, sign-out, and session handling work.
- [x] Data persists after reload.
- [x] User-owned records are properly isolated.
- [x] Database policies are tested.
- [x] No secret server credentials reach the client.

### Phase 6 — AI Tutor

Implement the provider adapter, credential management, connection testing, error analysis, hint generation, and natural-language exercise requests.

Acceptance criteria:
- [x] Requests use actual submission data.
- [x] Provider failures are handled correctly.
- [x] Credentials remain secret.
- [x] AI explanations do not override judge verdicts.
- [x] Generated exercises have a clear validation status.

### Phase 7 — Mastery and adaptive review

Implement structured error classification, mastery calculation, review queues, progress reports, and exercise variation.

Acceptance criteria:
- [x] Progress derives from persisted evidence.
- [x] Recurring weaknesses are identifiable.
- [x] Review recommendations are actionable.
- [x] Mastery rules are configurable and documented.
- [x] Exercise generation includes quality and duplication checks.

### Phase 8 — System verification and hardening

Test the complete application, fix regressions, optimize loading, verify mobile usability, review security, and document deployment.

Acceptance criteria:
- [x] Critical user flows pass.
- [x] No known critical security issue remains unresolved.
- [x] No fake data is mixed into real progress.
- [x] All environment variables are documented.
- [x] Deployment instructions and known limitations are recorded.

## 7. STRICT WORKING RULES

1. Work on exactly one phase at a time.
2. Read and understand the relevant existing code before editing it.
3. Break each phase into small, verifiable tasks.
4. Mark an existing AGENT.md checkbox as complete only after its acceptance criteria have been tested.
5. Do not mark tasks complete because code was merely written.
6. Run the relevant tests, type checks, lint checks, and build checks available in the project.
7. Fix regressions introduced by the current phase before proceeding.
8. Never replace real backend logic with localStorage, hardcoded responses, or mock data to simulate completion.
9. Mock external services only in isolated automated tests, never as a substitute for the actual production integration.
10. Avoid unnecessary dependencies and duplicate abstractions.
11. Keep secrets out of source control.
12. Do not create the actual curriculum before the user supplies it.
13. Do not start the next phase without reporting the current phase's status and outstanding issues.

If a prerequisite is missing, report it and implement only the safe work that can be completed without it.

## 8. REQUIRED REPORT AFTER EACH PHASE

Provide:

- Phase completed.
- Files created or modified.
- Features that actually work.
- Tests executed and their real outcomes.
- Remaining bugs and limitations.
- Required environment variables or external setup.
- Security considerations.
- AGENT.md checklist items updated.
- Exact next phase and prerequisites.

Distinguish clearly between verified, partially implemented, blocked, and not implemented.

## 9. IMMEDIATE NEXT ACTION

Start with Phase 1 only.

Inspect the actual repository and existing AGENT.md. Produce the architecture assessment, dependency map, implementation plan, data model proposal, and phase checklist.

Do not implement the entire product in one pass.

Do not generate the real Python curriculum.

After Phase 1, report the findings and wait for the next implementation instruction.

---

## 10. PHASE 1 AUDIT REPORT & STATUS SUMMARY

- **Audit Date**: 2026-10-29
- **Repository State**: Clean directory initialized with `AGENT.md`. No existing source code, framework boilerplate, database schema, or environment files were present.
- **Architectural Documentation Produced**:
  - `docs/CODECOBUG_ARCHITECTURE.md`
  - `docs/CODECOBUG_DATA_MODEL.md`
  - `docs/CODECOBUG_IMPLEMENTATION_PLAN.md`
  - `docs/CODECOBUG_TEST_PLAN.md`
  - `docs/DEPLOYMENT_GUIDE.md`
- **Phase 1 Status**: Completed & Fully Documented. All audit reports, system architecture, database schema, implementation plan, and test plan have been generated and verified.
- **Phase 2 Status**: Completed & Verified. All pages operational (Home, Exercise Workspace, 404), responsive layout verified, zero fake buttons, real settings modal.
- **Phase 3 Status**: Completed & Verified. Real in-browser Python execution via Pyodide WebAssembly Web Worker, input() handling, syntax & runtime error tracebacks, variable scope isolation, and watchdog timeout recovery.
- **Phase 4 Status**: Completed & Verified. Deterministic Judge Engine operational (/api/judge/submit), evaluating against minimum 3 public tests + hidden tests, exact/normalized/float comparators, forbidden token checks, secret data protection, and strict separation between Run and Submit.
- **Phase 5 Status**: Completed & Verified. User authentication lifecycle (Sign Up, Sign In, Sign Out, Session Persistence), persistent code drafts, submissions history attribution, points accumulation, strict multi-tenant tenant isolation, complete PostgreSQL schema & RLS policies in `supabase/migrations/`, and client bundle secret token shield.
- **Phase 6 Status**: Completed & Verified. Provider-independent AI Adapter (Gemini, OpenAI, Anthropic), AES-256-GCM BYOK credential encryption and masking, secret key redaction from error traces, contextual error analysis with real submission data & traceback, graduated hints (Levels 1-3), weakness analysis, unverified exercise generation, Judge Verdict Integrity Rule enforcement, and real API routes `/api/ai/test-connection` & `/api/ai/chat`.
- **Phase 7 Status**: Completed & Verified. Empirical Mastery Calculation Engine strictly deriving progress from persisted submissions, Structured Error Classification (9 categories across compiler, runtime & judge failures), Automated Priority-Based Adaptive Review Queue (Priority 1 for failed attempts, Priority 2 for low mastery skills), Automated Re-assessment (transitioning review items to completed and streak score recovery upon passing), Exercise Quality & Duplication Shield (2-gram Jaccard similarity > 75% rejection), and UI Modal WeaknessTrackerModal accessible from top navigation header.
- **Phase 8 Status**: Completed & Verified. Full End-to-End System flow verified across all modules (Curriculum -> Editor -> Pyodide Run -> Serverless Judge -> Submissions & Points Persistence -> AI Tutor Context -> Empirical Mastery & Adaptive Review Queue), mobile touch & viewport responsiveness hardened (`@media (max-width: 768px)` header & tab layout), security posture audited (AES-256-GCM BYOK, trace redaction, hidden test shielding, 0 client credential leaks), all environment variables documented in `.env.example`, and production deployment guide published in `docs/DEPLOYMENT_GUIDE.md`. All 214 regression test cases passing (0 failures).
- **Teen Pastel UI Redesign (agent1.md) — Phase 1 (Khảo sát dự án)**: Completed & Documented. Full codebase, route inventory, working backend components, and execution pipelines audited. Redesign roadmap and transition architecture published in `docs/TEEN_PASTEL_REDESIGN_PLAN.md`. Preserving 100% of the working backend, Pyodide runtime, Judge engine, Auth/RLS, and AI Tutor. Zero arbitrary feature modifications made.
- **Teen Pastel UI Redesign (agent1.md) — Phase 2 (Xây dựng Design System)**: Completed & Verified. Design tokens for CodeCoBUG Teen Pastel Studio established in `src/app/globals.css` (Pastel Mint `#BFE8D0`, Light Mint Canvas `#F3FBF5`, Lavender `#DCCBFF`, Sky Blue `#C7E3FF`, Peach Coral `#FFCDBD`, Soft Yellow `#FFF0B8`, Main Text `#243047`, Secondary Text `#58657B`, Subtle Border `#E7EAF0`, Focus Ring `#58B084`). Reusable UI components library created in `src/components/ui/` (`Button`, `Card`, `Input`, `Textarea`, `Modal`, `Badge`, `Tabs`). Rounded corner tokens standardized (16-24px for cards/containers, 12-16px for controls, 9999px for pills). Accessible contrast ratios verified (WCAG AAA >= 12:1 for body text, WCAG AA >= 4.5:1 for pastel buttons). Modals (`AuthModal`, `AISettingsModal`, `WeaknessTrackerModal`) and layouts refactored to use shared design system components. All 254 test cases (214 regression + 40 design system tests) passing with 0 failures, 0 TypeScript errors, 0 lint warnings.
- **Teen Pastel UI Redesign (agent1.md) — Phase 3 (Khung giao diện toàn website)**: Completed & Verified. Responsive Application Shell (`AppShell`), Desktop Left Sidebar (`Sidebar`) with expandable/collapsible modes (250px / 76px), and Mobile Navigation Drawer (`MobileNav`) implemented in `src/components/layout/`. Header enhanced with hamburger menu toggle and breadcrumb navigation. Navigation verified across all real routes (`/`, `/#curriculum`, `/exercises/in-loi-chao-codecobug`, `/404`) with zero broken links or regressions. All 8 test suites passing (285 total test cases, 0 failures).
- **Teen Pastel UI Redesign (agent1.md) — Phase 4 (Trang chủ học tập — Learning Dashboard)**: Completed & Verified. Personalised Learning Dashboard (`LearningDashboard.tsx`) implemented in `src/components/dashboard/` and mounted on `src/app/page.tsx`. Zero fake data guarantee enforced: Activity overview (completed exercises, real points, empirical mastery %, review queue size), continue learning card, current topic progress, recently attempted exercises, and adaptive review recommendations all strictly derive from real persisted `SavedSubmissionRecord` and `authManager`. Honest empty states with clear calls-to-action rendered when no attempts exist. All 9 test suites passing (311 total test cases, 0 failures).
- **Project Implementation Status**: Technical foundation complete (Phases 1-8). Teen Pastel UI Redesign Phase 1 (Khảo sát), Phase 2 (Design System), Phase 3 (Khung giao diện) & Phase 4 (Trang chủ học tập) complete. Standing by for user instruction before proceeding to Phase 5 (Giao diện giáo trình — Curriculum Browser).