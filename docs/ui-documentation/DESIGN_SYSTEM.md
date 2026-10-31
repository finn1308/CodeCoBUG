# CodeCoBUG Design System — Teen Pastel Studio

> **Phiên bản:** CodeCoBUG Teen Pastel Studio v1.0  
> **Nguồn trích xuất chính thức:** `src/app/globals.css`, `src/components/ui/*.tsx`, `src/components/layout/*.tsx`  
> **Nguyên tắc cốt lõi:** Hiện đại, tươi sáng, gam màu pastel mềm mại nhưng đạt tỷ lệ tương phản chuẩn cho người học lập trình, góc bo tròn mềm mại (`12px` - `24px`), đổ bóng dịu và viền mờ thay vì đường nét thô cứng.

---

## 1. Bảng Màu Chi Tiết (Color Palette)

Toàn bộ màu sắc được định nghĩa dưới dạng CSS Custom Properties (`:root`) trong `src/app/globals.css`:

### 1.1. Bảng màu Pastel Cốt Lõi (Core Pastel Tokens)
| Token Variable | Mã Hex | Màu Chữ Tương Ứng | Tên Gọi / Mục Đích Sử Dụng |
|---|---|---|---|
| `--pastel-mint` | `#BFE8D0` | `--pastel-mint-text` (`#1F4F36`) | Màu thương hiệu chính, trạng thái thành công, bài hoàn thành |
| `--pastel-mint-light` | `#F3FBF5` | `#1F4F36` | Nền trang tổng thể, nền thẻ bài học nhẹ nhàng |
| `--pastel-lavender` | `#DCCBFF` | `--pastel-lavender-text` (`#4B2882`) | Điểm nhấn học tập, AI Tutor, huy hiệu nâng cao |
| `--pastel-lavender-light`| `#FAF7FF` | `#4B2882` | Nền bong bóng chat AI, thẻ trợ giúp |
| `--pastel-sky` | `#C7E3FF` | `--pastel-sky-text` (`#154370`) | Thông tin, trạng thái chạy thử (Run Code), liên kết |
| `--pastel-sky-light` | `#F3F8FF` | `#154370` | Nền thông báo thông tin |
| `--pastel-peach` | `#FFCDBD` | `--pastel-peach-text` (`#6B2D1B`) | Điểm nhấn chú ý, mức độ khó cao, cảnh báo |
| `--pastel-peach-light` | `#FFF7F5` | `#6B2D1B` | Nền cảnh báo nhẹ |
| `--pastel-yellow` | `#FFF0B8` | `--pastel-yellow-text` (`#5C4500`) | Vệt học tập (Streak), điểm kinh nghiệm (XP), mẹo giải nhanh |
| `--pastel-yellow-light`| `#FFFDF4` | `#5C4500` | Nền highlight mẹo hoặc gợi ý |

### 1.2. Màu Nền (Background Tokens)
| Token Variable | Giá Trị | Mục Đích Sử Dụng |
|---|---|---|
| `--bg-main` | `#F7F9FC` | Màu nền canvas tổng thể cho toàn ứng dụng |
| `--bg-surface` | `#FFFFFF` | Nền thẻ (Card), Modal, thanh bên (Sidebar), Header |
| `--bg-surface-elevated` | `#FFFFFF` | Nền các phần tử nổi bật hơn (Popovers, Toasts, Dropdowns) |
| `--bg-secondary` | `#F1F4F9` | Nền khu vực phụ, nền ô nhập liệu, thanh công cụ |
| `--bg-tertiary` | `#E8EDF4` | Nền khi hover, nền badge xám trung tính, track thanh cuộn |
| `--bg-code` | `#1E1E2E` | Nền khối mã nguồn Dark Theme (Catppuccin/Monaco Editor) |
| `--bg-terminal` | `#181825` | Nền cửa sổ giả lập terminal & Pyodide output |

### 1.3. Màu Chữ & Văn Bản (Text Tokens)
| Token Variable | Giá Trị | Tương Phản / Mục Đích |
|---|---|---|
| `--text-primary` | `#1E293B` | Văn bản chính, tiêu đề H1-H6, nội dung đề bài (độ tương phản cao) |
| `--text-secondary` | `#475569` | Văn bản bổ trợ, chú thích, metadata, nhãn form |
| `--text-muted` | `#64748B` | Placeholder, phím tắt, thông tin phụ không bắt buộc |
| `--text-inverted` | `#FFFFFF` | Văn bản màu trắng khi nằm trên nền tối hoặc nút nổi bật |

### 1.4. Màu Viền (Border Tokens)
| Token Variable | Giá Trị | Mục Đích |
|---|---|---|
| `--border-subtle` | `rgba(226, 232, 240, 0.8)` | Đường viền siêu nhẹ cho thẻ nội dung |
| `--border-default` | `#CBD5E1` | Đường viền chuẩn của thẻ, ô input |
| `--border-focused` | `#93C5FD` | Viền xanh sáng khi trường nhập liệu được focus |

### 1.5. Màu Ngữ Nghĩa (Semantic Tokens)
| Token Variable | Giá Trị | Ứng Dụng |
|---|---|---|
| `--semantic-success` | `#10B981` | Trạng thái Pass Test Case, hoàn thành mục tiêu |
| `--semantic-warning` | `#F59E0B` | Cảnh báo thời gian chạy (Timeout), lỗ hổng kiến thức |
| `--semantic-danger` | `#EF4444` | Trạng thái Lỗi cú pháp, Failed Test Case, nút xóa dữ liệu |
| `--semantic-info` | `#3B82F6` | Hướng dẫn thao tác, thông báo hệ thống |

---

## 2. Hệ Thống Kiểu Chữ (Typography)

### 2.1. Font Families
- **Văn bản chung (`--font-sans`):**  
  `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Mã nguồn & Terminal (`--font-mono`):**  
  `'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace`

### 2.2. Kích Thước Chữ (Font Sizes) & Độ Đậm (Weights)
- `--font-size-xs`: `0.75rem` (12px) - Chú thích nhỏ, badge, phím tắt
- `--font-size-sm`: `0.875rem` (14px) - Văn bản phụ, nội dung bảng, mô tả
- `--font-size-base`: `1rem` (16px) - Văn bản thân bài viết, nội dung bài tập
- `--font-size-lg`: `1.125rem` (18px) - Tiêu đề phụ, thẻ chương học
- `--font-size-xl`: `1.25rem` (20px) - Tiêu đề đề bài, tiêu đề modal
- `--font-size-2xl`: `1.5rem` (24px) - Tiêu đề trang, số đếm thống kê
- `--font-size-3xl`: `1.875rem` (30px) - Banner chào mừng trên Dashboard
- **Độ đậm:** `400` (Regular), `500` (Medium), `600` (Semi-bold), `700` (Bold)

---

## 3. Hệ Thống Khoảng Cách & Bo Góc (Spacing & Radii)

### 3.1. Thang Khoảng Cách (Spacing Scale)
- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-5`: `20px`
- `--space-6`: `24px`
- `--space-8`: `32px`
- `--space-10`: `40px`
- `--space-12`: `48px`

### 3.2. Bán Kính Bo Góc (Border Radii)
- `--radius-sm`: `6px` - Phím tắt (kbd), nhãn con
- `--radius-md`: `10px` - Ô nhập liệu nhỏ, badge, thanh cuộn
- `--radius-lg`: `14px` - Nút bấm (Button), Input form, dropdowns
- `--radius-xl`: `20px` - Thẻ bài học (Card), bảng điều khiển
- `--radius-2xl`: `24px` - Modal hộp thoại chính, khung Workspace
- `--radius-full`: `9999px` - Nút tròn, avatar, chip vệt học tập (Streak)

---

## 4. Hệ Thống Đổ Bóng (Shadows) & Phân Tầng (Z-Index)

### 4.1. Đổ bóng (Shadows)
- `--shadow-xs`: `0 1px 2px rgba(0, 0, 0, 0.04)`
- `--shadow-sm`: `0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)`
- `--shadow-md`: `0 6px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03)`
- `--shadow-lg`: `0 12px 28px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)`
- `--shadow-pastel-mint`: `0 8px 24px rgba(191, 232, 208, 0.45)`
- `--shadow-pastel-lavender`: `0 8px 24px rgba(220, 203, 255, 0.45)`

### 4.2. Phân Tầng Z-Index (`z-index`)
- `--z-base`: `0`
- `--z-elevated`: `10`
- `--z-sticky`: `100` (Thanh điều hướng Sidebar, MobileNav)
- `--z-modal-backdrop`: `900`
- `--z-modal`: `1000` (Hộp thoại Modal, Trình cài đặt AI)
- `--z-toast`: `1100` (Thông báo Toast nổi trên cùng)

---

## 5. Điểm Ngắt Màn Hình (Responsive Breakpoints)

- **Mobile:** `< 768px` (Sidebar ẩn, hiển thị MobileNav dưới đáy, Workspace chuyển sang layout 1 cột theo tab)
- **Tablet:** `768px - 1024px` (Sidebar thu nhỏ hoặc hiển thị gọn, Workspace 2 cột: Đề bài/Editor và Terminal)
- **Desktop:** `> 1024px` (Layout 3 cột đầy đủ: Problem Statement 360px, Editor linh hoạt, AI Tutor Panel 380px)

---

## 6. Hiệu Ứng Chuyển Động & Animation

- `--transition-fast`: `150ms cubic-bezier(0.4, 0, 0.2, 1)`
- `--transition-base`: `250ms cubic-bezier(0.4, 0, 0.2, 1)`
- `--transition-slow`: `350ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Keyframe Animations:**
  - `@keyframes pulse-gentle`: Nhịp thở pastel cho icon AI đang suy nghĩ
  - `@keyframes fadeIn`: Làm mượt khi mở modal hoặc chuyển tab
  - `@keyframes slideUp`: Trượt nhẹ khi MobileNav xuất hiện

