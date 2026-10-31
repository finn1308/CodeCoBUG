# CodeCoBUG UI Findings & Technical Observations

> **Tài liệu kiểm kê các điểm cần lưu ý trên giao diện:** Báo cáo ghi nhận khách quan theo nguyên tắc **CHỈ GHI NHẬN - TUYỆT ĐỐI KHÔNG SỬA ĐỔI SOURCE CODE**.

---

## Bảng Phân Loại Vấn Đề Giao Diện Đã Phát Hiện

| Mức Độ | Mã Vấn Đề | Vị Trí File Source | Mô Tả Thực Tế Trong Source Code | Ảnh Hưởng Có Thể Có | Đề Xuất Xử Lý Cho Tương Lai |
|---|---|---|---|---|---|
| **MEDIUM** | `FINDING-UI-01` | `src/components/layout/AppShell.tsx` (Dòng 48-60) | Thuộc tính `margin-left: 260px` của nội dung chính đang được áp dụng bằng inline-style cứng thay vì class có media query, phụ thuộc vào state `window.innerWidth`. | Khi người dùng xoay ngang màn hình iPad hoặc thay đổi kích thước cửa sổ trình duyệt nhanh, giao diện có thể bị giật nhẹ 1 khung hình trước khi resize event kịp cập nhật state. | Trong đợt cải tiến sau, nên chuyển quy tắc responsive này hoàn toàn sang lớp CSS Media Query thuần (`@media (min-width: 768px) { margin-left: 260px; }`). |
| **LOW** | `FINDING-UI-02` | `src/components/workspace/CodeEditor.tsx` | Cấu hình Monaco Editor đang tắt thanh cuộn ngang `scrollbar.horizontal: 'hidden'` để giao diện gọn gàng. | Đối với những dòng code Python hoặc chuỗi văn bản quá dài mà chưa bật tính năng tự động xuống dòng (`wordWrap: 'on'`), học sinh có thể bị khuất phần đuôi dòng code. | Đề xuất bật mặc định `wordWrap: 'on'` trong options của Monaco Editor ở phiên bản sau. |
| **LOW** | `FINDING-UI-03` | `src/components/curriculum/CurriculumBrowser.tsx` | Bộ lọc độ khó hiện tại đang dựa trên văn bản cố định (`Dễ`, `Trung bình`, `Khó`) trong khi một số bài học nâng cao gắn tag `Thử thách`. | Các bài học có gắn tag đặc thù có thể rơi vào nhóm không hiển thị khi chọn lọc strictly theo 3 cấp độ cơ bản. | Chuẩn hóa taxonomy cấp độ bài học trong file `curriculumRegistry.ts` đồng bộ với UI filter. |
| **NEEDS VERIFICATION** | `FINDING-UI-04` | `src/components/ai/FormattedAIResponse.tsx` | Khối bóc tách Markdown sử dụng regex nội bộ để bắt các thẻ ````python ... ````. | Nếu gia sư AI trả về code block không kèm tên ngôn ngữ (chỉ có ```` ... ````) thì giao diện vẫn render khối code nhưng chưa được tô màu cú pháp Python chuyên biệt. | Tích hợp thư viện `prismjs` hoặc `highlight.js` nhẹ để highlight dự phòng cho mọi đoạn code không có nhãn. |
| **LOW** | `FINDING-UI-05` | `src/components/ui/Modal.tsx` | Nút đóng `X` ở góc trên bên phải có kích thước `padding: 6px`. | Trên một số dòng máy điện thoại có màn hình nhỏ với độ phân giải cao, diện tích chạm (hitbox) của nút đóng có thể hơi nhỏ đối với ngón tay trẻ em. | Tăng vùng đệm chạm tối thiểu lên `44x44px` theo chuẩn tiếp cận thiết bị cảm ứng di động. |

