# CodeCoBUG UI Source Index

> **Bản quyền & Phạm vi:** Tài liệu này là chỉ mục tra cứu toàn bộ mã nguồn liên quan đến giao diện (UI) của CodeCoBUG. Được tạo theo cơ chế **READ-ONLY**, không làm thay đổi source code gốc.
> **Thời điểm kiểm kê:** 30/10/2026.

---

## 1. Bảng Tra Cứu Toàn Bộ Mã Nguồn UI

| Page/Component | Source File | Styles File | Dependencies / Imports | Notes & Mô Tả Vai Trò |
|---|---|---|---|---|
| **Root Layout** | `src/app/layout.tsx` | `src/app/globals.css` | `next`, `React` | Layout gốc bao bọc thẻ `<html>` và `<body>`, nạp `globals.css` và thiết lập metadata tiếng Việt. |
| **Home Page (Dashboard)** | `src/app/page.tsx` | Inline CSS, `globals.css` | `AppShell`, `LearningDashboard` | Trang chủ hiển thị lộ trình học tập, tổng quan tiến độ, vệt học tập (streak) và danh mục bài học. |
| **Curriculum Page** | `src/app/curriculum/page.tsx` | Inline CSS, `globals.css` | `AppShell`, `CurriculumBrowser` | Trang danh mục lộ trình chi tiết 12 chương (120 bài học) với bộ lọc, tìm kiếm và phân loại cấp độ. |
| **Exercise Workspace Page** | `src/app/exercises/[exerciseSlug]/page.tsx` | Inline CSS, `globals.css` | `ExerciseWorkspace`, `curriculumRegistry`, `next/navigation` | Trang bài tập coding tương tác trực tiếp với URL động theo `slug`, nạp bài tập từ registry. |
| **404 Not Found Page** | `src/app/not-found.tsx` | Inline CSS, `globals.css` | `lucide-react` (`Compass`, `Home`, `BookOpen`, `ArrowLeft`), `next/link` | Trang báo lỗi 404 thân thiện phong cách pastel với gợi ý quay về Dashboard hoặc Lộ trình. |
| **AppShell Layout** | `src/components/layout/AppShell.tsx` | Inline CSS, `globals.css` | `Sidebar`, `MobileNav`, `HelpModal`, `AISettingsModal`, `AuthModal`, `WeaknessTrackerModal` | Khung giao diện trung tâm hỗ trợ responsive: Sidebar trên Desktop, MobileNav ở đáy màn hình di động, quản lý modal toàn cục. |
| **Sidebar Navigation** | `src/components/layout/Sidebar.tsx` | Inline CSS, `globals.css` | `lucide-react` (`Code2`, `BookOpen`, `Sparkles`, `Target`, `Settings`, `HelpCircle`, `LogIn`, `LogOut`, `User`), `next/link`, `authManager` | Thanh điều hướng trái cố định cho Desktop (width 260px) với branding, menu, phím tắt modal và trạng thái người dùng. |
| **Mobile Navigation** | `src/components/layout/MobileNav.tsx` | Inline CSS, `globals.css` | `lucide-react` (`Home`, `BookOpen`, `Sparkles`, `Target`, `Settings`, `User`), `next/link`, `authManager` | Thanh điều hướng đáy cố định cho màn hình nhỏ (< 768px) với 5 mục điều hướng chính. |
| **Learning Dashboard** | `src/components/dashboard/LearningDashboard.tsx` | Inline CSS, `globals.css` | `Card`, `Badge`, `Button`, `curriculumRegistry`, `lucide-react` (`Flame`, `CheckCircle2`, `BookOpen`, `Sparkles`, `ArrowRight`, `Clock`, `Target`, `Play`, `RotateCcw`) | Dashboard tổng quan tiến độ học tập, thống kê bài đã nộp, vệt học tập, bài học tiếp theo và danh sách chương. |
| **Curriculum Browser** | `src/components/curriculum/CurriculumBrowser.tsx` | Inline CSS, `globals.css` | `Card`, `Badge`, `Button`, `Input`, `curriculumRegistry`, `lucide-react` (`Search`, `BookOpen`, `Code2`, `ChevronRight`, `Filter`, `Sparkles`, `Flame`, `Trophy`, `Star`) | Trình duyệt chương trình học với tìm kiếm tức thì, lọc theo độ khó (Dễ/Trung bình/Khó) và thống kê số bài. |
| **Exercise Workspace** | `src/components/workspace/ExerciseWorkspace.tsx` | Inline CSS, `globals.css` | `ProblemStatement`, `CodeEditor`, `TerminalOutput`, `AITutorPanel`, `AITutorModal`, `HelpModal`, `AISettingsModal`, `AuthModal`, `usePyodide`, `submissionStore` | Phòng thí nghiệm coding tích hợp: 3 cột (Đề bài, Code Editor, AI Tutor) và Terminal đầu ra bên dưới. |
| **Problem Statement** | `src/components/workspace/ProblemStatement.tsx` | Inline CSS, `globals.css` | `Card`, `Badge`, `Button`, `lucide-react` (`BookOpen`, `Clock`, `ChevronLeft`, `Lightbulb`, `CheckCircle2`, `Tag`, `HelpCircle`, `AlertCircle`) | Hiển thị mô tả bài tập, yêu cầu đầu vào/đầu ra, ví dụ mẫu (Test Cases) và hệ thống gợi ý nhiều cấp độ. |
| **Code Editor** | `src/components/workspace/CodeEditor.tsx` | Monaco CSS, `globals.css` | `@monaco-editor/react`, `lucide-react` (`Play`, `RotateCcw`, `Send`, `Sparkles`, `CheckCircle2`, `Copy`, `Check`) | Trình soạn thảo mã nguồn Monaco tích hợp phím tắt Ctrl+Enter/Cmd+Enter, nút chạy thử, nộp bài, reset code. |
| **Terminal Output** | `src/components/workspace/TerminalOutput.tsx` | Inline CSS, `globals.css` | `Tabs`, `Badge`, `Button`, `lucide-react` (`Terminal`, `CheckCircle2`, `XCircle`, `Clock`, `AlertTriangle`, `Trash2`, `Play`) | Màn hình đầu ra Pyodide gồm 3 tab: Standard Output, Test Case Results (chấm tự động), Execution Errors. |
| **AI Tutor Panel** | `src/components/ai/AITutorPanel.tsx` | Inline CSS, `globals.css` | `FormattedAIResponse`, `Card`, `Badge`, `Button`, `Textarea`, `lucide-react` (`Sparkles`, `Send`, `Key`, `RefreshCw`, `AlertCircle`, `Bot`, `User`, `Lightbulb`, `HelpCircle`) | Khung chat AI gia sư cá nhân Socratic, tích hợp phím gợi ý nhanh (Giải thích đề, Gợi ý bước tiếp, Tìm lỗi sai). |
| **AI Tutor Modal** | `src/components/ai/AITutorModal.tsx` | Inline CSS, `globals.css` | `Modal`, `AITutorPanel`, `lucide-react` (`Sparkles`) | Modal mở rộng gia sư AI toàn màn hình trên các thiết bị di động hoặc khi người dùng phóng to. |
| **Formatted AI Response** | `src/components/ai/FormattedAIResponse.tsx` | Inline CSS, `globals.css` | `lucide-react` (`Copy`, `Check`) | Trình render câu trả lời AI với tô màu khối code Python, định dạng in đậm, danh sách và nút copy mã một chạm. |
| **Auth Modal** | `src/components/auth/AuthModal.tsx` | Inline CSS, `globals.css` | `Modal`, `Input`, `Button`, `authManager`, `lucide-react` (`Lock`, `Mail`, `User`, `AlertCircle`, `CheckCircle2`) | Modal xác thực người dùng (Đăng nhập, Đăng ký, Quên mật khẩu) tích hợp local storage & Supabase Auth. |
| **AI Settings Modal** | `src/components/settings/AISettingsModal.tsx` | Inline CSS, `globals.css` | `Modal`, `Button`, `Badge`, `lucide-react` (`Key`, `Shield`, `Sparkles`, `Check`, `AlertCircle`, `Eye`, `EyeOff`, `Trash2`) | Modal cấu hình BYOK (Gemini, OpenAI, Anthropic), lựa chọn model (3.8 Flash, 3.5 Lite, 4 Argon...), test connection. |
| **Weakness Tracker Modal** | `src/components/mastery/WeaknessTrackerModal.tsx` | Inline CSS, `globals.css` | `Modal`, `Badge`, `Button`, `masteryEngine`, `reviewEngine`, `lucide-react` (`Target`, `AlertTriangle`, `CheckCircle2`, `Clock`, `BookOpen`, `TrendingUp`, `RotateCcw`) | Modal theo dõi điểm yếu và lỗ hổng kiến thức phân loại theo Taxonomy (Syntax, Type, Logic, Runtime, Indentation). |
| **Help Modal** | `src/components/common/HelpModal.tsx` | Inline CSS, `globals.css` | `Modal`, `Badge`, `Button`, `lucide-react` (`Keyboard`, `Lightbulb`, `Play`, `Send`, `HelpCircle`, `Sparkles`) | Hướng dẫn sử dụng phòng lab, phím tắt trình soạn thảo và phương pháp tương tác với gia sư AI. |
| **Top Header (Standalone)** | `src/components/common/Header.tsx` | Inline CSS, `globals.css` | `Button`, `Badge`, `lucide-react` (`Flame`, `User`, `Settings`, `HelpCircle`, `BookOpen`) | Thanh header độc lập dự phòng khi không dùng AppShell layout. |
| **Button (UI Primitive)** | `src/components/ui/Button.tsx` | Inline CSS, `globals.css` | `React`, `lucide-react` (`Loader2`) | Nút tương tác với các biến thể `primary`, `secondary`, `outline`, `ghost`, `danger`, kèm kích thước `sm`, `md`, `lg` và loading state. |
| **Card (UI Primitive)** | `src/components/ui/Card.tsx` | Inline CSS, `globals.css` | `React` | Thẻ nội dung cơ bản bo góc pastel (`16px`/`20px`), viền mềm, hiệu ứng hover nhấc nhẹ. |
| **Badge (UI Primitive)** | `src/components/ui/Badge.tsx` | Inline CSS, `globals.css` | `React` | Nhãn trạng thái với các biến thể màu pastel: `mint`, `lavender`, `sky`, `peach`, `yellow`, `danger`, `neutral`. |
| **Modal (UI Primitive)** | `src/components/ui/Modal.tsx` | Inline CSS, `globals.css` | `React`, `lucide-react` (`X`) | Hộp thoại bật lên toàn màn hình với backdrop mờ (backdrop-blur), phím Esc đóng và animation xuất hiện mượt. |
| **Input (UI Primitive)** | `src/components/ui/Input.tsx` | Inline CSS, `globals.css` | `React` | Trường nhập liệu văn bản bo tròn, viền focus pastel và thông báo lỗi tích hợp. |
| **Textarea (UI Primitive)** | `src/components/ui/Textarea.tsx` | Inline CSS, `globals.css` | `React` | Khung nhập văn bản nhiều dòng cho chat và ghi chú code. |
| **Tabs (UI Primitive)** | `src/components/ui/Tabs.tsx` | Inline CSS, `globals.css` | `React` | Bộ chuyển đổi tab thanh lịch cho Terminal và các khối nội dung đa màn hình. |
| **Toast (UI Primitive)** | `src/components/ui/Toast.tsx` | Inline CSS, `globals.css` | `React`, `lucide-react` (`CheckCircle2`, `AlertCircle`, `Info`, `X`) | Thông báo nổi góc màn hình hỗ trợ tự động biến mất và phân loại (success, error, info). |
| **Global Theme Stylesheet** | `src/app/globals.css` | `globals.css` | Pure CSS3 Variables & Utility Classes | Hệ thống design token toàn diện: bảng màu Teen Pastel Studio, font, shadow, spacing scale, utility animations. |

---

## 2. Thư Mục Bản Sao Tham Chiếu (`docs/ui-documentation/source-reference/`)

Tất cả 31 files source code liên quan đến giao diện đã được sao lưu nguyên văn phục vụ cho việc tra cứu và đối chiếu:
- `source-reference/routes/` (4 files)
- `source-reference/layouts/` (4 files)
- `source-reference/styles/` (1 file: `globals.css`)
- `source-reference/components/` (22 files trong các thư mục con `ui/`, `workspace/`, `ai/`, `auth/`, `common/`, `curriculum/`, `dashboard/`, `mastery/`, `settings/`)

