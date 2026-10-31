# CODECOBUG — DATA FLOW & SYSTEM INTERACTIONS
## (PHASE 1: COMPLETE PROJECT AUDIT)

**Tài liệu**: Bản đồ Luồng dữ liệu chi tiết giữa Frontend, Backend, WebAssembly Runtime và Database  
**Giai đoạn**: Phase 1 — Đọc và phân tích kiểm toán toàn diện (Read-Only Audit)  
**Mục tiêu bảo toàn**: Đảm bảo các luồng dữ liệu nghiệp vụ này được giữ nguyên 100% khi tái cấu trúc giao diện Pastel London.

---

## 1. Luồng 1: Chạy Thử Code Tại Chỗ (Run Code Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Học viên
    participant Editor as Monaco CodeEditor
    participant Workspace as ExerciseWorkspace
    participant Pyodide as PyodideClient (WebAssembly)
    participant Terminal as TerminalOutput

    Learner->>Editor: Viết / Sửa mã Python
    Editor->>Workspace: Lưu bản nháp (Auto-save draft vào LocalStorage)
    Learner->>Workspace: Bấm nút "Chạy thử" (Run Code / Phím Ctrl+Enter)
    Workspace->>Terminal: Đặt trạng thái đang chạy, hiển thị dòng lệnh "$ python main.py"
    Workspace->>Pyodide: runCode(submittedCode, inputs, timeoutMs=5000)
    activate Pyodide
    Pyodide->>Pyodide: Thiết lập stdout hook & stdin buffer
    Pyodide->>Pyodide: Thực thi mã trong Sandbox WebAssembly Python 3.11
    Pyodide-->>Terminal: Bắn sự kiện stdout theo thời gian thực (batched output)
    deactivate Pyodide
    alt Chạy thành công
        Pyodide-->>Workspace: Trả về { output, executionTimeMs }
        Workspace->>Terminal: Render kết quả thành công, thời gian chạy
    else Lỗi cú pháp hoặc ngoại lệ (SyntaxError / Exception)
        Pyodide-->>Workspace: Trả về { error, cleanTraceback }
        Workspace->>Terminal: Render thông báo lỗi đỏ, trích dẫn dòng code lỗi
    else Vòng lặp vô tận (Timeout)
        Pyodide-->>Workspace: Ngắt tiến trình sau 5000ms (TimeLimitExceeded)
        Workspace->>Terminal: Báo lỗi giới hạn thời gian chạy bị vượt quá
    end
```

---

## 2. Luồng 2: Nộp Bài & Chấm Điểm Tự Động (Submit Code Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Học viên
    participant Workspace as ExerciseWorkspace
    participant Judge as Judge Engine (runner.ts)
    participant TestsRepo as Server Test Repository (Hidden Tests)
    participant Auth as AuthManager (Persistence)
    participant Review as ReviewEngine (Queue Sync)

    Learner->>Workspace: Bấm nút "Nộp bài" (Submit Code)
    Workspace->>Workspace: Đặt trạng thái isSubmitting = true
    Workspace->>Judge: evaluateSubmission(testConfig, code, totalPoints)
    activate Judge
    Judge->>TestsRepo: Lấy bộ test máy chủ của bài tập (Bao gồm cả Public & Hidden Tests)
    Judge->>Judge: Kiểm tra từ khóa cấm (Forbidden Tokens Check)
    alt Vi phạm từ khóa cấm
        Judge-->>Workspace: Trả về wrong_answer kèm lý do cấm biến tạm
    else Mã hợp lệ
        loop Duyệt qua từng Test Case (Public + Hidden)
            Judge->>Judge: Nạp inputData vào stdin
            Judge->>Judge: Chạy mã và lấy actualOutput
            Judge->>Judge: So sánh actualOutput với expectedOutput qua comparator.ts
            Judge->>Judge: Ghi nhận isPassed, thời gian chạy executionTimeMs
        end
        Judge->>Judge: Tính tổng điểm và xác định phán quyết (Accepted / Wrong Answer)
        Judge->>Judge: Che giấu tuyệt đối inputData & expectedOutput của Test Ẩn
        Judge-->>Workspace: Trả về SubmissionEvaluationReport (Kèm mảng testResults an toàn)
    end
    deactivate Judge

    Workspace->>Auth: saveSubmission({ exerciseSlug, verdict, score, testCaseResults })
    Auth->>Auth: Lưu vào mảng codecobug_submissions của tài khoản hiện tại
    alt Phán quyết là "Accepted" (Đạt 100% test)
        Auth->>Auth: syncLessonProgressAfterSubmission(exerciseSlug)
        Note over Auth: Nếu 100% bài tập con đạt accepted -> Cập nhật Lesson sang "completed"
        Auth->>Auth: Cộng điểm thưởng người dùng (userPoints)
    end

    Workspace->>Review: syncReviewQueue(userId, allUserSubmissions)
    Note over Review: Cập nhật hàng đợi bài sai & giải phóng bài đã sửa thành công
    Workspace->>Workspace: Cập nhật UI kết quả kiểm thử & Bắn thông báo Toast chúc mừng
```

---

## 3. Luồng 3: Tương Tác với AI Gia Sư (AI Tutor Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Học viên
    participant Panel as AITutorPanel
    participant Crypto as Crypto Utility (crypto.ts)
    participant TutorService as AITutorService
    participant Provider as AIProviderAdapter
    participant LLM as External LLM (Gemini / OpenAI)

    Learner->>Panel: Bấm "Giải thích lỗi" / "Gợi ý từng bước" / Nhập câu hỏi
    Panel->>Panel: Thu thập ngữ cảnh: { chapterTitle, lessonTitle, exerciseTitle, code, error, failedTest }
    Panel->>Crypto: Lấy và giải mã khóa API cá nhân (AES-256-GCM)
    alt Không có khóa API cá nhân
        Panel->>Learner: Hiển thị hướng dẫn mở Modal Cài đặt AI (BYOK)
    else Khóa API hợp lệ
        Panel->>TutorService: processRequest({ config, action, exerciseContext, submissionData })
        activate TutorService
        TutorService->>TutorService: Lắp ráp System Prompt (Tôn trọng phán quyết bộ chấm)
        TutorService->>TutorService: Lắp ráp User Prompt theo cấp độ gợi ý (Level 1/2/3)
        TutorService->>Provider: generateCompletion(config, messages)
        Provider->>LLM: Gửi request HTTP HTTPS bảo mật (Bearer Token)
        alt Gọi API thành công
            LLM-->>Provider: Trả về nội dung phản hồi markdown
            Provider-->>TutorService: { success: true, text }
            TutorService-->>Panel: Trả về văn bản sư phạm
            Panel->>Panel: FormattedAIResponse render hộp code, callouts, copy button
        else Lỗi kết nối / Hết hạn khóa
            LLM-->>Provider: HTTP 401 / 429 Error
            Provider->>Provider: Lọc hoàn toàn chuỗi API Key khỏi chuỗi lỗi (Redaction)
            Provider-->>Panel: Trả về thông báo lỗi thân thiện tiếng Việt đã được làm sạch
        end
        deactivate TutorService
    end
```

---

## 4. Luồng 4: Phân Tích Điểm Yếu & Ôn Tập Thích Ứng (Adaptive Review Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Học viên
    participant Judge as Judge Engine
    participant Auth as AuthManager
    participant Mastery as MasteryEngine
    participant Review as ReviewEngine
    participant Modal as WeaknessTrackerModal

    Learner->>Judge: Nộp bài tập
    Judge-->>Auth: Ghi nhận bài nộp (ví dụ: Wrong Answer bài hoan-doi-hai-bien)
    Auth->>Review: syncReviewQueue(userId, submissions)
    activate Review
    Review->>Review: Lọc danh sách bài làm sai chưa được khắc phục -> Gán Priority 1
    Review->>Mastery: calculateMastery(userId, submissions)
    Mastery-->>Review: Danh sách kỹ năng có tỷ lệ thành thạo < 40%
    Review->>Review: Đề xuất bài tập bổ trợ cho kỹ năng yếu -> Gán Priority 2
    Review->>Auth: Lưu hàng đợi mới vào LocalStorage/Supabase
    deactivate Review

    Learner->>Modal: Mở bảng "Điểm yếu & Ôn tập"
    Modal->>Review: getPendingReviews(userId)
    Modal->>Modal: Hiển thị thẻ bài sai cần ôn luyện kèm lý do và độ ưu tiên
    Learner->>Modal: Nhấp "Ôn tập ngay" vào bài tập
    Modal->>Learner: Điều hướng tới /exercises/[slug]
    Learner->>Judge: Nộp lại mã nguồn chuẩn xác -> Đạt "Accepted"
    Judge-->>Review: syncReviewQueue(userId)
    Review->>Review: Gỡ bài tập khỏi hàng đợi pending -> Chuyển sang completedReviews
```

---

## 5. Luồng 5: Bảo Vệ & Cách Ly Dữ Liệu Đa Người Dùng (Multi-Tenant Isolation Flow)

```
[Trình duyệt Người học]
      │
      ├── Đăng nhập Tài khoản Alice (ID: user-alice)
      │     └── Khóa lưu trữ: "codecobug_submissions_user-alice"
      │     └── Khóa tiến độ: "codecobug_lessons_progress_user-alice"
      │     └── Khóa điểm yếu: "codecobug_review_queue_user-alice"
      │
      ├── Đăng xuất Alice & Đăng nhập Tài khoản Bob (ID: user-bob)
      │     └── Khóa lưu trữ: "codecobug_submissions_user-bob"
      │     └── Khóa tiến độ: "codecobug_lessons_progress_user-bob"
      │     └── Khóa điểm yếu: "codecobug_review_queue_user-bob"
      │
      └── [Nguyên tắc Bảo mật]:
            - authManager tự động xóa sạch in-memory state khi signOut()
            - Mọi hàm truy xuất đều bắt buộc truyền userId làm partition key
            - Bob hoàn toàn không đọc hoặc ghi đè được dữ liệu của Alice
```

