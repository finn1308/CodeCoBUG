# CodeCoBUG UI Interactions Specification

> **Tài liệu kiểm kê luồng tương tác:** Ghi lại mọi sự kiện tương tác giữa người dùng và giao diện, state biến đổi và luồng dữ liệu tương ứng.

---

## 1. Danh Mục Các Luồng Tương Tác Chính

| # | Element Tương Tác | File Path | Trigger / Sự Kiện | Handler / Hàm Xử Lý | State Thay Đổi | Kết Quả Hiển Thị Trên Giao Diện | Trạng Thái Kiểm Chứng |
|---|---|---|---|---|---|---|---|
| 1 | Nút "Chạy Thử" (Run Code) | `CodeEditor.tsx` / `ExerciseWorkspace.tsx` | Click chuột hoặc phím tắt `Ctrl+Enter` / `Cmd+Enter` | `handleRunCode()` | `isRunning: true -> false`, `terminalOutput: string` | Mở Tab "Stdout" trong TerminalOutput, hiển thị kết quả hàm `print()` hoặc traceback lỗi màu đỏ pastel | Đã xác minh qua code và thực tế |
| 2 | Nút "Nộp Bài" (Submit Code) | `CodeEditor.tsx` / `ExerciseWorkspace.tsx` | Click nút "Nộp bài" | `handleSubmitCode()` | `isSubmitting: true -> false`, `testResults: TestCaseResult[]` | Tự động chuyển sang Tab "Chấm bài (Test Cases)", hiển thị từng test case Xanh (Đạt) hoặc Đỏ (Sai), pop-up chúc mừng nếu đạt 100% | Đã xác minh qua code và thực tế |
| 3 | Nút "Gợi Ý Nhanh" (Hint Button) | `ProblemStatement.tsx` | Click vào nút "Xem gợi ý 1", "Xem gợi ý 2" | `handleRevealHint(index)` | `revealedHints: Set<number>` | Mở rộng khối Card vàng pastel chứa hướng dẫn tư duy từng bước | Đã xác minh qua code |
| 4 | Nút "Hỏi AI Socratic" | `AITutorPanel.tsx` | Click 1 trong 3 nút gợi ý hoặc nhập tin nhắn rồi bấm Enter / Gửi | `handleSendMessage()` | `isLoadingAI: true -> false`, `messages: AIMessage[]` | Tin nhắn của user xuất hiện ngay bên phải, hiện hiệu ứng robot đang suy nghĩ pastel nhấp nháy, sau đó render câu trả lời AI | Đã xác minh qua code và thực tế |
| 5 | Nút "Cài Đặt AI" (Bánh Răng) | `Sidebar.tsx` / `ExerciseWorkspace.tsx` | Click nút Cài đặt hoặc nút thông báo chưa có API key | `setIsAISettingsOpen(true)` | `isAISettingsOpen: boolean` | Hộp thoại `AISettingsModal` mở lên trên nền backdrop làm mờ; tự động nạp cấu hình đã lưu từ LocalStorage | Đã xác minh qua code và thực tế |
| 6 | Nút "Kiểm Tra Kết Nối AI" | `AISettingsModal.tsx` | Click "Kiểm tra kết nối" | `handleTestConnection()` | `testStatus: 'testing' -> 'success' \| 'error'`, `statusMessage` | Nút hiển thị spinner tải; sau đó hiện Badge xanh thành công hoặc dải màu đỏ cảnh báo chi tiết lỗi | Đã xác minh qua code và thực tế |
| 7 | Nút "Sao Chép Mã AI" | `FormattedAIResponse.tsx` | Click nút icon Copy trên góc khối code | `handleCopyCode()` | `copied: true -> false` (timeout 2s) | Icon đổi thành dấu tích xanh lá `Check`, mã nguồn được đưa vào Clipboard hệ thống | Đã xác minh qua code |
| 8 | Thanh Tìm Kiếm Bài Học | `CurriculumBrowser.tsx` | Gõ ký tự vào ô Input tìm kiếm | `setSearchQuery(e.target.value)` | `searchQuery: string`, `filteredChapters` | Lưới danh sách bài học lọc tức thì không cần tải lại trang; hiển thị số lượng bài khớp | Đã xác minh qua code |
| 9 | Nút Lọc Độ Khó (Filter Chips) | `CurriculumBrowser.tsx` | Click chọn độ khó (Tất cả / Dễ / Vừa / Khó) | `setSelectedDifficulty(diff)` | `selectedDifficulty: string` | Nút được chọn chuyển sang màu xanh pastel (`--pastel-mint`), ẩn các bài học không thỏa mãn tiêu chí | Đã xác minh qua code |
| 10 | Chuyển Tab Terminal | `TerminalOutput.tsx` | Click vào Tab "Stdout", "Test Cases", hoặc "Lỗi" | `setActiveTab(tabId)` | `activeTab: string` | Khung hiển thị bên dưới chuyển đổi nội dung mượt mà không làm mất dữ liệu đã chạy trước đó | Đã xác minh qua code |
| 11 | Nút Đăng Nhập / Đăng Ký | `Sidebar.tsx` / `AppShell.tsx` | Click nút "Đăng nhập" ở góc dưới thanh Sidebar | `setIsAuthOpen(true)` | `isAuthOpen: boolean` | Modal đăng nhập hiện lên, cho phép chuyển đổi giữa tab Đăng nhập và Đăng ký | Đã xác minh qua code |
| 12 | Đóng Modal bằng phím tắt | `Modal.tsx` | Bấm phím `Escape` trên bàn phím hoặc click ra vùng nền đen | `onClose()` | State `isOpen` của modal tương ứng chuyển sang `false` | Modal biến mất mượt mà với hiệu ứng mờ dần (fadeOut), khôi phục khả năng cuộn trang chính | Đã xác minh qua code |

