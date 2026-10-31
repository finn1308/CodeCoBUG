# CodeCoBUG Component Library Catalog

> **Tài liệu kiểm kê chi tiết:** Toàn bộ component UI có mặt trong dự án CodeCoBUG, phân loại từ UI Primitives dùng chung đến các chuyên biệt hóa theo chức năng.

---

## 1. UI Primitives (`src/components/ui/`)

### 1.1. `Button`
- **File:** `src/components/ui/Button.tsx`
- **Mục đích:** Nút bấm tương tác chính với đầy đủ trạng thái hover, focus, disabled, và hiệu ứng tải (loading spinner).
- **Props & Types:**
  - `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` (Mặc định: `'primary'`)
  - `size?: 'sm' | 'md' | 'lg'` (Mặc định: `'md'`)
  - `isLoading?: boolean` (Mặc định: `false`)
  - `leftIcon?: React.ReactNode`
  - `rightIcon?: React.ReactNode`
  - Kế thừa toàn bộ `React.ButtonHTMLAttributes<HTMLButtonElement>`
- **Phong cách thị giác:** Bo góc tròn (`var(--radius-lg)`), hiệu ứng `transform: translateY(-1px)` khi hover, viền mềm mại.

### 1.2. `Card`
- **File:** `src/components/ui/Card.tsx`
- **Mục đích:** Khung chứa nội dung có nền trắng, viền pastel mờ, hỗ trợ đổ bóng khi hover.
- **Props & Types:**
  - `variant?: 'default' | 'mint' | 'lavender' | 'sky' | 'peach' | 'yellow' | 'glass'` (Mặc định: `'default'`)
  - `interactive?: boolean` (Mặc định: `false`)
  - `padding?: 'none' | 'sm' | 'md' | 'lg'` (Mặc định: `'md'`)
  - Kế thừa `React.HTMLAttributes<HTMLDivElement>`

### 1.3. `Badge`
- **File:** `src/components/ui/Badge.tsx`
- **Mục đích:** Nhãn hiển thị cấp độ khó (Dễ/Trung bình/Khó), trạng thái nộp bài (Passed/Failed), số lượng XP, streak.
- **Props & Types:**
  - `variant?: 'mint' | 'lavender' | 'sky' | 'peach' | 'yellow' | 'neutral' | 'danger'` (Mặc định: `'neutral'`)
  - `size?: 'sm' | 'md'` (Mặc định: `'md'`)
  - `icon?: React.ReactNode`
  - `children: React.ReactNode`

### 1.4. `Modal`
- **File:** `src/components/ui/Modal.tsx`
- **Mục đích:** Hộp thoại toàn màn hình với nền mờ backdrop blur, khóa cuộn trang body, bấm phím `Esc` để đóng.
- **Props & Types:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `title?: React.ReactNode`
  - `subtitle?: string`
  - `maxWidth?: string` (Mặc định: `'540px'`)
  - `children: React.ReactNode`

### 1.5. `Input`
- **File:** `src/components/ui/Input.tsx`
- **Mục đích:** Ô nhập văn bản hỗ trợ icon trái/phải, thông báo lỗi (helper text/error).
- **Props & Types:**
  - `label?: string`
  - `error?: string`
  - `leftIcon?: React.ReactNode`
  - `rightIcon?: React.ReactNode`
  - Kế thừa `React.InputHTMLAttributes<HTMLInputElement>`

### 1.6. `Textarea`
- **File:** `src/components/ui/Textarea.tsx`
- **Mục đích:** Ô nhập nội dung nhiều dòng, dùng trong khung chat AI hoặc phản hồi bài tập.
- **Props & Types:**
  - `label?: string`
  - `error?: string`
  - Kế thừa `React.TextareaHTMLAttributes<HTMLTextAreaElement>`

### 1.7. `Tabs`
- **File:** `src/components/ui/Tabs.tsx`
- **Mục đích:** Thanh chuyển đổi tab có hiệu ứng chuyển tab êm, dùng cho Terminal (Output / Tests / Errors) và chuyển view trên Mobile.
- **Props & Types:**
  - `tabs: { id: string; label: string; icon?: React.ReactNode; badge?: string | number }[]`
  - `activeTab: string`
  - `onChange: (id: string) => void`

### 1.8. `Toast`
- **File:** `src/components/ui/Toast.tsx`
- **Mục đích:** Thông báo pop-up nổi góc trên màn hình khi sao chép mã nguồn, lưu cài đặt, hoặc gửi bài thành công.

---

## 2. Layout Components (`src/components/layout/`)

### 2.1. `AppShell`
- **File:** `src/components/layout/AppShell.tsx`
- **Mục đích:** Bao bọc tổng thể ứng dụng trên các trang chính (Home, Curriculum, Settings). Tự động điều phối hiển thị giữa `Sidebar` (Desktop) và `MobileNav` (Mobile). Quản lý trạng thái mở của 4 modal dùng chung:
  - `isHelpOpen`: Hướng dẫn & phím tắt
  - `isAISettingsOpen`: Cài đặt AI & API keys
  - `isAuthOpen`: Đăng nhập/Đăng ký
  - `isWeaknessOpen`: Bảng theo dõi điểm yếu kiến thức

### 2.2. `Sidebar`
- **File:** `src/components/layout/Sidebar.tsx`
- **Mục đích:** Cột điều hướng trái cố định kích thước 260px.
- **Các thành phần con:**
  - Brand Logo & Tên nền tảng: `CodeCoBUG` với icon bọ lập trình và badge `Teen Studio`.
  - Main Nav Items: `Tổng quan (Home)`, `Lộ trình Python (Curriculum)`, `Gia sư AI`, `Điểm yếu kiến thức`.
  - Utility Buttons: `Trợ giúp`, `Cài đặt AI`.
  - User Status Footer: Avatar người học, chuỗi ngày học liên tục (streak) và nút Đăng nhập / Đăng xuất.

### 2.3. `MobileNav`
- **File:** `src/components/layout/MobileNav.tsx`
- **Mục đích:** Thanh điều hướng chân trang (Bottom Navigation Bar) xuất hiện khi màn hình < 768px.
- **5 Nút chức năng:** Tổng quan, Lộ trình, Luyện tập, Cài đặt AI, Tài khoản.

---

## 3. Workspace Components (`src/components/workspace/`)

### 3.1. `ExerciseWorkspace`
- **File:** `src/components/workspace/ExerciseWorkspace.tsx`
- **Mục đích:** Trung tâm điều phối giao diện làm bài tập lập trình tương tác.
- **Cấu trúc bố cục:**
  - **Header:** Nút quay lại lộ trình, Tiêu đề bài tập, Badge độ khó, Nút mở cài đặt AI, Trợ giúp, Profile.
  - **Thân chính (3 cột):**
    - Cột 1: `ProblemStatement` (Đề bài, ví dụ mẫu, gợi ý).
    - Cột 2: `CodeEditor` (Soạn thảo mã nguồn Monaco) + `TerminalOutput` (Bảng điều khiển đầu ra phía dưới).
    - Cột 3: `AITutorPanel` (Cửa sổ chat gia sư AI chuyên biệt theo bài học).

### 3.2. `ProblemStatement`
- **File:** `src/components/workspace/ProblemStatement.tsx`
- **Mục đích:** Hiển thị chi tiết bài học lý thuyết hoặc bài tập lập trình.
- **Nội dung hiển thị:**
  - Mục tiêu học tập & điểm kinh nghiệm (XP).
  - Yêu cầu đầu vào (Input format), Yêu cầu đầu ra (Output format).
  - Bảng ví dụ minh họa (Test Cases: Input -> Expected Output).
  - Hệ thống gợi ý nhiều cấp độ (Hint 1 -> Hint 2 -> Code minh họa) với nút bấm mở dần để kích thích tư duy.

### 3.3. `CodeEditor`
- **File:** `src/components/workspace/CodeEditor.tsx`
- **Mục đích:** Tích hợp Microsoft Monaco Editor (nhân của VS Code).
- **Tính năng nổi bật:**
  - Tự động highlight cú pháp Python chuẩn PEP8.
  - Phím tắt: `Ctrl+Enter` / `Cmd+Enter` để Chạy thử nhanh bằng Pyodide WebAssembly.
  - Thanh công cụ phía trên gồm: Chọn kích cỡ chữ editor, Nút Reset Code về mẫu ban đầu, Nút Chạy Thử (`Play`), Nút Nộp Bài (`Send`).

### 3.4. `TerminalOutput`
- **File:** `src/components/workspace/TerminalOutput.tsx`
- **Mục đích:** Hiển thị kết quả thực thi code trực tiếp trong trình duyệt qua Pyodide mà không cần server backend.
- **3 Tab chức năng:**
  1. `Kết quả chạy (Stdout)`: Hiển thị toàn bộ dữ liệu in ra màn hình từ hàm `print()`.
  2. `Chấm bài (Test Cases)`: Hiển thị trạng thái so khớp Pass/Fail cho từng ca kiểm thử.
  3. `Lỗi thực thi (Errors)`: Hiển thị traceback lỗi Python với định dạng màu sắc dễ đọc cho lứa tuổi học sinh.

---

## 4. AI Tutor Components (`src/components/ai/`)

### 4.1. `AITutorPanel`
- **File:** `src/components/ai/AITutorPanel.tsx`
- **Mục đích:** Khung hội thoại tương tác với gia sư AI theo phương pháp Socratic (dẫn dắt câu hỏi thay vì giải bài hộ).
- **Tính năng:**
  - 3 Nút gợi ý nhanh một chạm: "Giải thích đề bài", "Gợi ý bước tiếp theo", "Kiểm tra mã hiện tại của tôi".
  - Hiển thị thông báo trạng thái kết nối với model (Gemini/OpenAI) và phím tắt mở nhanh Modal cài đặt API key nếu chưa thiết lập.
  - Danh sách tin nhắn phân biệt rõ avatar User và avatar AI Robot.

### 4.2. `AITutorModal`
- **File:** `src/components/ai/AITutorModal.tsx`
- **Mục đích:** Bọc `AITutorPanel` vào trong một Modal toàn màn hình khi người học cần không gian trò chuyện lớn hơn hoặc khi học trên máy tính bảng/điện thoại.

### 4.3. `FormattedAIResponse`
- **File:** `src/components/ai/FormattedAIResponse.tsx`
- **Mục đích:** Bóc tách Markdown từ câu trả lời của AI: tách biệt giữa văn bản hướng dẫn và các đoạn mã Python mẫu, tích hợp nút "Sao chép mã" với icon phản hồi tức thì.

---

## 5. Dashboard & Curriculum Components (`src/components/dashboard/`, `src/components/curriculum/`)

### 5.1. `LearningDashboard`
- **File:** `src/components/dashboard/LearningDashboard.tsx`
- **Mục đích:** Trung tâm điều khiển tiến độ người học.
- **Các khối giao diện:**
  - Banner chào mừng cá nhân hóa kèm chỉ số Streak (Số ngày học liên tiếp) rực rỡ sắc vàng pastel.
  - 4 Thẻ thống kê: Tổng bài hoàn thành, Tổng điểm XP, Thời gian luyện tập, Tỷ lệ chính xác.
  - Thẻ "Tiếp tục học" (Resume): Trỏ trực tiếp tới bài học chưa hoàn thành gần nhất.
  - Danh sách 12 chương trình học với thanh tiến trình phần trăm (%) trực quan.

### 5.2. `CurriculumBrowser`
- **File:** `src/components/curriculum/CurriculumBrowser.tsx`
- **Mục đích:** Danh mục bài học chi tiết phân cấp (Chương -> Bài học -> Bài tập).
- **Tính năng giao diện:**
  - Ô tìm kiếm từ khóa bài học theo thời gian thực.
  - Bộ lọc độ khó (Tất cả, Cơ bản, Trung bình, Nâng cao).
  - Thẻ chương mở rộng (Accordion) liệt kê danh sách từng bài với icon trạng thái (Khóa, Chưa học, Đã hoàn thành).

---

## 6. Modal Nghiệp Vụ (`src/components/auth/`, `src/components/settings/`, `src/components/mastery/`, `src/components/common/`)

### 6.1. `AISettingsModal`
- **File:** `src/components/settings/AISettingsModal.tsx`
- **Mục đích:** Cấu hình Bring-Your-Own-Key (BYOK) cho người học:
  - Chọn Provider (Google Gemini, OpenAI, Anthropic, Custom).
  - Chọn Model (`gemini-3.8-flash`, `gemini-3.5-flash-lite`, `gemini-4-argon`, `gpt-4o-mini`,...).
  - Nhập và ẩn/hiện API Key (hỗ trợ cả tiền tố mới `AQ.` và cũ `AIza`).
  - Nút "Kiểm tra kết nối" (Test Connection) gọi thẳng API backend để kiểm thử thực tế.

### 6.2. `AuthModal`
- **File:** `src/components/auth/AuthModal.tsx`
- **Mục đích:** Đăng nhập, đăng ký tài khoản, phục hồi tiến độ học tập qua Email hoặc tài khoản khách (Guest Demo Mode).

### 6.3. `WeaknessTrackerModal`
- **File:** `src/components/mastery/WeaknessTrackerModal.tsx`
- **Mục đích:** Bảng phân tích lỗ hổng kiến thức của học sinh dựa trên lịch sử lỗi chạy code (Syntax Error, Name Error, Type Error, Indentation Error) và đưa ra bài tập ôn luyện tương ứng.

### 6.4. `HelpModal`
- **File:** `src/components/common/HelpModal.tsx`
- **Mục đích:** Sổ tay hướng dẫn thao tác trong phòng lab: danh sách phím tắt, quy trình nộp bài tự động, quy tắc tương tác với AI Tutor.

