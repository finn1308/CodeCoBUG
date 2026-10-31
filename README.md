# CodeCoBUG — Teen Pastel Studio

Nền tảng học lập trình Python 3 thông minh dành cho học viên và thanh thiếu niên, tích hợp giáo trình toàn diện (kết hợp chuẩn W3Schools và Python Crash Course 3E), trình thông dịch Python WebAssembly (Pyodide), hệ thống chấm bài tự động (Judge Engine), gia sư AI cá nhân (AI Tutor BYOK) và 3 dự án thực chiến lớn (Alien Invasion, Data Visualization, Django Web App).

---

## 🌟 Điểm nổi bật của nền tảng

1. **Giao diện Teen Pastel Studio trực quan**:
   - Tông màu pastel hiện đại: Mint (#BFE8D0), Lavender (#DCCBFF), Sky Blue (#C7E3FF), Peach (#FFCDBD).
   - Thẻ bo góc thân thiện (16–24px), thanh điều hướng tinh gọn 3 điểm đến: **Tổng quan**, **Học Python**, **Luyện tập**.
   - Tương tác mượt mà theo chuẩn LucianLabs UX/UI, hỗ trợ đầy đủ responsive Desktop (1440px) và Mobile (390px), tuân thủ WCAG AA/AAA.

2. **Giáo trình Python Hợp nhất (Unified Curriculum)**:
   - **Phần I: Nền tảng Python (12 Chương, 44 Bài học, 61 Bài tập)**: Đầy đủ từ Biến, Kiểu dữ liệu, Toán tử, Chuỗi, Cấu trúc dữ liệu (Lists, Tuples, Sets, Dictionaries), Cấu trúc điều kiện, Vòng lặp, Hàm, Ngoại lệ, Thao tác File, OOP đến Cấu trúc nâng cao (Lambda, Decorators, Generators, Type Hints).
   - **Phần II: Học qua Dự án Thực chiến (3 Dự án Capstone, 26 Checkpoints)**:
     - **Dự án 1: Alien Invasion** (Pygame, Game loop, Sprites, Va chạm, Tính điểm - 8 Checkpoints).
     - **Dự án 2: Data Visualization** (Matplotlib, Plotly, Phân tích dữ liệu thời tiết CSV, Động đất GeoJSON, GitHub API - 8 Checkpoints).
     - **Dự án 3: Web Applications** (Django 4.1+, Models, Migrations, Forms, Auth, Deployment - 10 Checkpoints).

3. **Trình chạy code Pyodide WebAssembly**:
   - Chạy Python 3 trực tiếp trong trình duyệt, không phụ thuộc vào máy chủ backend.
   - Hỗ trợ nhập xuất bàn phím (`input()` / `print()`) tương tác qua màn hình Terminal mô phỏng.

4. **Hệ thống chấm bài tự động (Automated Judge Engine)**:
   - Toàn bộ 87 bài tập đều có bộ kiểm thử máy chủ chuyên dụng ($\ge 3$ test cases/bài).
   - Bảo mật tuyệt đối test case ẩn (Hidden Tests) để chống gian lận.

5. **AI Gia sư Cá nhân (AI Tutor - Bring Your Own Key)**:
   - Hỗ trợ Google Gemini (`gemini-2.0-flash`, `gemini-1.5-pro`) và OpenAI (`gpt-4o`, `gpt-4o-mini`).
   - Mã hóa khóa API an toàn bằng chuẩn đối xứng AES-256-GCM. Tự động che mờ khóa trên giao diện và lọc khóa khỏi lỗi API.
   - Nguyên tắc sư phạm nghiêm ngặt: Gợi ý nâng bậc (Level 1 $\to$ 2 $\to$ 3) và **tuyệt đối không phủ nhận kết quả của bộ chấm bài**.
   - Đề xuất bài tập bổ trợ thông minh theo ngữ cảnh chương học hiện tại.

6. **Theo dõi tiến độ & Hàng đợi ôn tập thích ứng**:
   - Theo dõi tiến độ độc lập theo cả Bài học và Bài tập. Chỉ đánh dấu hoàn thành bài học khi người học vượt qua 100% bài tập liên kết.
   - Thuật toán Lặp lại ngắt quãng (Spaced Repetition) tự động đưa các bài tập làm sai vào hàng đợi ôn tập ưu tiên.
   - Xem lại toàn bộ lịch sử nộp bài và chi tiết từng test case đã chấm.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.18 trở lên (Khuyến nghị Node.js 20+ hoặc 22+).
- **Trình duyệt**: Google Chrome, Mozilla Firefox, Safari, Microsoft Edge bản mới nhất.

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Trang web sẽ sẵn sàng tại địa chỉ: [http://localhost:3000](http://localhost:3000).

> [!TIP]
> Nếu trình duyệt của bạn hiển thị trang chưa nhận CSS, vui lòng thực hiện **Hard Refresh**:
> - Trên macOS: `Cmd + Shift + R`
> - Trên Windows/Linux: `Ctrl + F5` hoặc `Ctrl + Shift + R`

### 4. Build và Chạy môi trường Production
```bash
npm run build
npm start
```
Hoặc chỉ định cổng tùy chọn:
```bash
npx next start -p 3001
```

---

## 🧪 Kiểm thử & Đảm bảo chất lượng (QA)

CodeCoBUG đi kèm bộ kiểm thử tự động gồm 27 test suites với hơn 3.500 assertions:

```bash
# 1. Kiểm tra an toàn kiểu dữ liệu TypeScript (0 lỗi)
npm run type-check

# 2. Kiểm tra chuẩn mã nguồn ESLint (0 cảnh báo, 0 lỗi)
npm run lint

# 3. Chạy toàn bộ 27 bộ kiểm thử tự động
npm test
```

---

## 📁 Cấu trúc thư mục dự án

```
├── docs/                                  # Tài liệu kiến trúc, đặc tả dữ liệu và báo cáo kiểm thử
│   ├── PCC3E_FINAL_INTEGRATION_REPORT.md  # Báo cáo bàn giao nghiệm thu cuối cùng
│   ├── PYTHON_CURRICULUM_MAPPING.md       # Bảng đối chiếu giáo trình W3Schools + PCC3E
│   ├── CODECOBUG_DATA_MODEL.md            # Sơ đồ quan hệ thực thể & dữ liệu
│   └── CODECOBUG_TEST_REPORT.md           # Báo cáo kết quả 27 bộ kiểm thử tự động
├── src/
│   ├── app/                               # Next.js App Router (70 static routes)
│   │   ├── curriculum/                    # Tuyến đường giáo trình động [chapterSlug]/[lessonSlug]
│   │   ├── exercises/                     # Không gian làm bài thực hành [exerciseSlug]
│   │   ├── projects/                      # Tuyến đường dự án thực chiến [projectSlug]
│   │   └── api/                           # API chấm bài, AI chat, hàng đợi ôn tập
│   ├── components/                        # UI Components theo Teen Pastel Studio
│   │   ├── ai/                            # Bảng điều khiển AI Tutor & Formatted Response
│   │   ├── curriculum/                    # Duyệt giáo trình & Trang chi tiết bài học
│   │   ├── dashboard/                     # Bảng điều khiển học tập & Thống kê tiến độ
│   │   ├── layout/                        # AppShell, Sidebar, Header, MobileNav
│   │   ├── mastery/                       # Quản lý điểm yếu & Lịch sử nộp bài
│   │   ├── projects/                      # Giao diện chặng kiểm tra dự án (PBL)
│   │   └── workspace/                     # Không gian lập trình Monaco & Terminal
│   └── lib/                               # Lõi nghiệp vụ (Domain Logic)
│       ├── ai/                            # AI Tutor Service, Provider Adapter, Crypto AES-256-GCM
│       ├── auth/                          # Auth Manager & Lưu trữ đa người dùng
│       ├── curriculum/                    # Đăng ký giáo trình 12 chương & 44 bài học
│       ├── judge/                         # Judge Engine, Trình so sánh kết quả & Bộ test
│       ├── mastery/                       # Thuật toán tính năng lực & Hàng đợi ôn tập bài sai
│       ├── projects/                      # Dữ liệu 3 dự án Capstone & 26 checkpoints
│       └── runtime/                       # Runtime Pyodide WebAssembly
└── tests/                                 # 27 bộ kiểm thử tự động toàn diện
```

---

## 🔒 Cấu hình nâng cao (Tùy chọn)

1. **AI Tutor (BYOK)**:
   - Học viên có thể cấu hình API Key cá nhân (Google Gemini hoặc OpenAI) ngay trên giao diện web (bấm vào biểu tượng bánh răng **Cài đặt** $\to$ **Cài đặt AI**).
   - Khóa được lưu mã hóa tại trình duyệt học viên bằng AES-256-GCM và không bao giờ lưu trữ lộ trên máy chủ.
2. **Supabase (Tùy chọn cho triển khai nhiều người dùng đồng bộ đám mây)**:
   - Tạo file `.env.local` với các biến môi trường:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```
   - Nếu không có Supabase, website tự động kích hoạt **Chế độ học viên Khách (Guest Mode)** với cơ chế lưu trữ cục bộ đầy đủ tính năng.

---

## 📄 Bản quyền & Trách nhiệm học thuật
Toàn bộ nội dung lý thuyết, bài giảng tiếng Việt và hệ thống bài tập thực hành trên CodeCoBUG được biên soạn mới hoàn toàn, tuân thủ nguyên tắc giáo dục mở và không sao chép nguyên văn các ấn phẩm thương mại có bản quyền. Các liên kết tài liệu tham khảo chính thức (Python Docs, W3Schools) được dẫn chứng minh bạch phục vụ mục đích tra cứu của người học.

# CodeCoBUG
