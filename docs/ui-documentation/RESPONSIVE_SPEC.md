# CodeCoBUG Responsive Specification

> **Tài liệu kiểm kê thiết kế đáp ứng (Responsive Behavior):** Ghi lại cơ chế thích ứng giao diện từ màn hình máy tính để bàn (Desktop), máy tính bảng (Tablet) đến điện thoại di động (Mobile).

---

## 1. Hệ Thống Điểm Ngắt (Breakpoints)

Dự án áp dụng CSS Media Queries trực tiếp trong `src/app/globals.css` và style logic trong từng component:

- **Desktop (Lớn):** `min-width: 1200px` (Trải nghiệm IDE 3 cột tối ưu nhất).
- **Desktop (Tiêu chuẩn):** `1024px - 1199px` (Sidebar mở rộng 260px, IDE co giãn linh hoạt).
- **Tablet (Máy tính bảng):** `768px - 1023px` (Sidebar thu gọn, Workspace chuyển bố cục 2 cột).
- **Mobile (Điện thoại thông minh):** `< 768px` (Ẩn Sidebar, kích hoạt Mobile Bottom Navigation, Workspace chuyển dạng Tabs).

---

## 2. Bảng Ma Trận Thay Đổi Bố Cục Theo Thiết Bị

| Khu Vực / Component | Màn Hình Desktop (>1024px) | Màn Hình Tablet (768px - 1024px) | Màn Hình Mobile (<768px) |
|---|---|---|---|
| **Điều Hướng Chính** | `Sidebar` cố định bên trái (Rộng `260px`), chiếm 100% chiều cao màn hình. | `Sidebar` chuyển sang dạng biểu tượng thu nhỏ hoặc ẩn. | `Sidebar` ẩn hoàn toàn (`display: none`). Thay thế bằng `MobileNav` gắn cố định ở chân màn hình (`z-index: 100`). |
| **Khoảng Đệm Trang (AppShell)** | `margin-left: 260px; padding: 32px;` | `margin-left: 0; padding: 20px;` | `margin-left: 0; padding: 16px; padding-bottom: 80px;` (đệm tránh bị MobileNav che khuất). |
| **Trang Dashboard** | Lưới 4 thẻ thống kê nằm trên 1 hàng ngang. Danh mục 12 chương chia thành lưới 3 cột. | Lưới thống kê chia 2x2. Danh mục chương chia lưới 2 cột. | Lưới thống kê cuộn dọc hoặc chia 2 cột nhỏ. Danh mục chương xếp chồng 1 cột duy nhất. |
| **Trang Lộ Trình (Curriculum)** | Thanh tìm kiếm và bộ lọc độ khó nằm song song trên cùng một hàng ngang. | Thanh tìm kiếm nằm trên, bộ lọc nằm dưới. | Bộ lọc độ khó hỗ trợ cuộn ngang ngón tay (`overflow-x: auto; white-space: nowrap;`). |
| **Workspace: Bố Cục Cột** | **3 Cột song song:**<br>- Cột 1: Đề bài (`360px`)<br>- Cột 2: Monaco Editor + Terminal (`flex: 1`)<br>- Cột 3: AI Tutor (`380px`) | **2 Cột:**<br>- Cột 1: Đề bài (`320px`)<br>- Cột 2: Editor + Terminal (`flex: 1`)<br>- AI Tutor: Mở qua nút dạng Modal popup. | **1 Cột theo Tab:**<br>Thanh chuyển đổi tab ở đỉnh:<br>- `Tab 1: Đề bài`<br>- `Tab 2: Code & Terminal`<br>- `Tab 3: Gia sư AI` |
| **Monaco Editor** | Kích thước linh hoạt, chiều cao tối thiểu `420px`. | Chiều cao co giãn `350px`. | Chiều cao cố định `300px`, ẩn bớt minimap để tiết kiệm diện tích. |
| **Terminal Output** | Nằm bên dưới Monaco Editor, có thể co giãn độ cao, hiển thị 3 tab. | Nằm bên dưới Monaco Editor, tab có icon thu gọn. | Xếp sau editor trong Tab Code, có nút bật/tắt toàn màn hình. |
| **Hộp Thoại Modal** | Chiều rộng tối đa `540px - 640px`, căn giữa màn hình với đệm viền `24px`. | Chiều rộng `90%`, căn giữa màn hình. | Chiều rộng `100%`, bo góc trên (`border-radius: 24px 24px 0 0`), mở từ đáy lên (Bottom Sheet style) để tiện thao tác ngón tay. |
| **Typography & Nút Bấm** | Cỡ chữ chuẩn `16px`, nút bấm kích thước `md` (chiều cao `40px`). | Cỡ chữ chuẩn `15px`, nút bấm `md`. | Cỡ chữ tối thiểu `16px` cho các ô input (chống tự động zoom trên iOS Safari), chiều cao nút bấm tăng lên tối thiểu `44px` theo chuẩn Touch Target. |

---

## 3. Khả Năng Xử Lý Tràn (Overflow) & Cuộn (Scroll Behavior)

1. **Cuộn độc lập từng cột trong Workspace:**  
   Trên desktop, cả 3 cột (Đề bài, Editor/Terminal, AI Tutor) đều có thuộc tính `overflow-y: auto` riêng biệt. Người học có thể cuộn đọc đề bài dài mà không làm trôi vị trí soạn thảo mã nguồn.
2. **Khóa cuộn trang khi Modal mở:**  
   Component `Modal.tsx` tự động gắn `document.body.style.overflow = 'hidden'` khi hiển thị để ngăn hiện tượng cuộn kép (double scroll) trên thiết bị di động.

