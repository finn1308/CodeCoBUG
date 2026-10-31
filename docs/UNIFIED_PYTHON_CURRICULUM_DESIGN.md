# THIẾT KẾ GIÁO TRÌNH PYTHON HỢP NHẤT: CODECOBUG UNIFIED CURRICULUM SPECIFICATION
*(Tích hợp toàn diện W3Schools & Python Crash Course 3rd Edition)*

*Tài liệu thiết kế kiến trúc sư phạm, phân bổ chủ đề, phân cấp độ khó, cơ chế khóa/mở theo tiến độ và đặc tả chi tiết từng bài học cho nền tảng CodeCoBUG.*  
*Ngày ban hành: 30/10/2026 — Trạng thái: THIẾT KẾ CHUẨN MỰC (BLUEPRINT APPROVED)*

---

## MỤC LỤC
1. [Kiến trúc tổng thể & Nguyên tắc sư phạm](#1-kiến-trúc-tổng-thể--nguyên-tắc-sư-phạm)
2. [Phân bổ các chủ đề W3Schools bổ sung](#2-phân-bổ-các-chủ-đề-w3schools-bổ-sung)
3. [Phân cấp độ khó & Cây điều kiện tiên quyết](#3-phân-cấp-độ-khó--cây-điều-kiện-tiên-quyết)
4. [Cơ chế khóa/mở bài học và dự án theo tiến độ](#4-cơ-chế-khóamở-bài-học-và-dự-án-theo-tiến-độ)
5. [Khả năng tương thích Database & Data Model](#5-khả-năng-tương-thích-database--data-model)
6. [Đặc tả chi tiết Part I: Nền tảng Python (Chương 01 - 11)](#6-đặc-tả-chi-tiết-part-i-nền-tảng-python-chương-01---11)
7. [Đặc tả chi tiết Part II: Học tập qua Dự án (Dự án 1, 2, 3)](#7-đặc-tả-chi-tiết-part-ii-học-tập-qua-dự-án-dự-án-1-2-3)
8. [Bảng kiểm tra tiêu chuẩn hoàn thành (Completion Gate)](#8-bảng-kiểm-tra-tiêu-chuẩn-hoàn-thành-completion-gate)

---

## 1. KIẾN TRÚC TỔNG THỂ & NGUYÊN TẮC SƯ PHẠM

Nhằm loại bỏ hoàn toàn sự phân mảnh kiến thức và tránh việc học viên phải học hai chương trình song song, CodeCoBUG thiết lập **Duy nhất một lộ trình Python chuẩn hóa (ONE Unified Curriculum)**:

```
                            GIÁO TRÌNH CODECOBUG CHUẨN HÓA
                                          │
            ┌─────────────────────────────┴─────────────────────────────┐
            ▼                                                           ▼
     PHẦN I: NỀN TẢNG PYTHON                                PHẦN II: HỌC TẬP QUA DỰ ÁN
     (Python Fundamentals)                                  (Project-Based Learning)
     Chương 01 ──► Chương 11                                3 Dự án thực chiến lớn
     • Cú pháp, I/O, Biến, Cấu trúc dữ liệu                • Dự án 1: Alien Invasion Game (Pygame)
     • Vòng lặp, Rẽ nhánh, Hàm, Đệ quy                     • Dự án 2: Data Visualization (Matplotlib/APIs)
     • Hướng đối tượng OOP, Files, JSON/CSV                • Dự án 3: Web App with Django Full-stack
     • Kiểm thử tự động với Pytest (TDD)
```

### Nguyên tắc thiết kế sư phạm:
1. **Thực chứng trước, lý thuyết sau (Hands-on First)**: Mỗi bài học đều có đoạn mã chạy được ngay trong trình duyệt qua WebAssembly Pyodide, xuất kết quả trực quan trước khi đào sâu cú pháp.
2. **Không sao chép nguyên văn (Zero Copyright Infringement)**: Tôn trọng bản quyền của Eric Matthes (No Starch Press) và W3Schools. 100% nội dung giải thích, ví dụ minh họa và đề bài được sáng tác độc quyền bằng tiếng Việt gần gũi.
3. **Mỗi bài học là một chu trình học tập khép kín**:
   $$\text{Mục tiêu} \longrightarrow \text{Mô hình trực quan} \longrightarrow \text{Lý thuyết} \longrightarrow \text{Ví dụ thực thi} \longrightarrow \text{Cảnh báo lỗi} \longrightarrow \text{Thực hành có dẫn dắt} \longrightarrow \text{Bài tập độc lập} \longrightarrow \text{Thử thách mini}$$
4. **Không nhồi nhét chủ đề**: Đặt từng khái niệm vào đúng vị trí nhận thức tự nhiên của người học (ví dụ: *Tuples* học ngay sau *Lists* để so sánh tính đột biến; *Sets* học cùng *Dictionaries* do chia sẻ cấu trúc băm Hash Table).

---

## 2. PHÂN BỔ CÁC CHỦ ĐỀ W3SCHOOLS BỔ SUNG

Để đảm bảo không bỏ sót bất kỳ kiến thức quan trọng nào từ W3Schools mà PCC 3E lướt qua hoặc chưa có, các chủ đề bổ sung được định vị chiến lược như sau:

| Chủ đề W3Schools bổ sung | Vị trí phân bổ tối ưu trong Giáo trình hợp nhất | Lý do sư phạm |
| :--- | :--- | :--- |
| **Casting & Numbers** | Chương 02: Biến và Các kiểu dữ liệu | Giúp người học làm quen ngay với việc chuyển đổi giữa chuỗi và số khi dùng `int(input())` hoặc `float()`. |
| **Operators (Toán tử số học, so sánh, logic, gán)** | Chương 02 & Chương 03: Biến, Số học & Cấu trúc điều kiện | Cần thiết để xây dựng biểu thức logic trước khi bước vào câu lệnh rẽ nhánh `if`. |
| **Toán tử thành viên (`in`, `not in`) & Định danh (`is`)** | Chương 03 & Chương 05: Lists & If Statements | Ứng dụng ngay để kiểm tra sự tồn tại của phần tử trong danh sách và kiểm tra giá trị `None`. |
| **Tuples (Bộ dữ liệu bất biến, packing/unpacking)** | Chương 04: Làm việc với Lists & Cấu trúc dữ liệu cố định | Đặt ngay sau List để làm nổi bật sự khác biệt giữa *Mutable* (có thể thay đổi) và *Immutable* (bất biến). |
| **Sets (Tập hợp duy nhất & Các phép toán tập hợp)** | Chương 06: Dictionaries & Sets (Cấu trúc bảng băm) | Cả Set và Dictionary đều sử dụng Hash Map (tốc độ tìm kiếm $O(1)$) và không cho phép phần tử trùng lặp. |
| **Hàm ẩn danh (Lambda Functions) & Scope (LEGB)** | Chương 08: Hàm trong Python (Functions) | Giúp học viên nắm vững quy tắc phạm vi biến (Local, Enclosing, Global, Built-in) và cú pháp viết hàm ngắn gọn. |
| **Đệ quy (Recursion)** | Chương 08: Hàm trong Python (Bài nâng cao) | Rèn luyện tư duy thuật toán chia để trị (Divide and Conquer), tính giai thừa và dãy số Fibonacci. |
| **Modules chuẩn (`math`, `random`, `datetime`)** | Chương 08 (Module hóa) & Chương 10 | Giúp học viên không phải tự viết lại các hàm toán học và tính toán thời gian, chuẩn bị cho trực quan hóa dữ liệu. |
| **Biểu thức chính quy (Regular Expressions - `re`)** | Chương 10: Tệp tin, Dữ liệu cấu trúc & Phân tích chuỗi | Công cụ phân tích và làm sạch dữ liệu mạnh mẽ trước khi đọc/ghi file CSV hoặc gọi REST API. |
| **PIP & Môi trường ảo (`venv`)** | Chương 11: Kiểm thử mã nguồn với Pytest | Học viên cần biết dùng `pip install pytest` và tạo môi trường ảo độc lập trước khi tự chạy test hoặc làm dự án. |

---

## 3. PHÂN CẤP ĐỘ KHÓ & CÂY ĐIỀU KIỆN TIÊN QUYẾT

Toàn bộ giáo trình được phân thành 3 cấp độ năng lực rõ ràng:

### 3.1. Phân loại 3 cấp độ (Curriculum Taxonomy)
1. **Beginner (Nhập môn - Cấp độ 1)**:
   - *Phạm vi*: Chương 01 đến Chương 05.
   - *Mục tiêu*: Làm chủ cú pháp cơ bản, hiểu dòng chảy tuần tự của chương trình, tương tác vào/ra (I/O), khai báo biến, các kiểu dữ liệu nguyên thủy, thao tác với chuỗi và danh sách (Lists), cắt lát (Slicing) và bộ dữ liệu bất biến (Tuples).
2. **Intermediate (Trung cấp - Cấp độ 2)**:
   - *Phạm vi*: Chương 06 đến Chương 10.
   - *Mục tiêu*: Kiểm soát luồng điều khiển phức tạp (câu lệnh điều kiện đa nhánh, vòng lặp `while` kết hợp cờ hiệu `flag`), cấu trúc dữ liệu bảng băm (Dictionaries & Sets), trừu tượng hóa logic với hàm (Functions, `*args`, `**kwargs`, đệ quy), lập trình hướng đối tượng (OOP: Class, Object, Kế thừa, Composition), thao tác tệp tin hiện đại (`pathlib`), xử lý dữ liệu cấu trúc (JSON, CSV) và xử lý ngoại lệ an toàn (`try-except`).
3. **Advanced (Nâng cao - Cấp độ 3)**:
   - *Phạm vi*: Chương 11 và Toàn bộ Phần II (Dự án 1, 2, 3).
   - *Mục tiêu*: Tư duy kiểm thử tự động Test-Driven Development (TDD) với `pytest`, xây dựng ứng dụng đồ họa tương tác thời gian thực với Pygame, trực quan hóa và khai phá dữ liệu khoa học với Matplotlib/Plotly/APIs, và phát triển ứng dụng Web Full-stack chuẩn công nghiệp với Django.

---

## 4. CƠ CHẾ KHÓA/MỞ BÀI HỌC VÀ DỰ ÁN THEO TIẾN ĐỘ

Để đảm bảo học viên tiếp thu kiến thức một cách vững chắc, không bị "ngợp" hoặc nản lòng do học nhảy cóc, hệ thống áp dụng cơ chế khóa/mở 2 tầng dựa trên dữ liệu thực chứng:

### 4.1. Cơ chế mở khóa Bài học tuần tự (Sequential Lesson Gating)
```typescript
interface LessonUnlockPolicy {
  canUnlockLesson(userId: string, targetLessonId: string): boolean;
}
```
- **Quy tắc**:
  1. Bài học đầu tiên của khóa học (`lesson-01-01`) luôn ở trạng thái **Mở sẵn (Unlocked)** cho mọi người dùng mới.
  2. Một bài học chỉ được chuyển trạng thái từ `Locked` sang `Available` khi:
     - Toàn bộ các bài học nằm trong danh sách `prerequisites` của nó đã đạt trạng thái `Completed`.
     - Học viên đã nộp và đạt kết quả `accepted` ít nhất 1 bài tập thực hành độc lập trong bài học liền trước.
  3. Giao diện hiển thị biểu tượng ổ khóa xám kèm tooltip giải thích rõ: *"Bạn cần hoàn thành bài học [Tên bài tiên quyết] để mở khóa bài học này."*

### 4.2. Cơ chế mở khóa Dự án thực chiến (Project Readiness Gating)
```typescript
interface ProjectReadinessGating {
  minMasteryThreshold: 75; // Yêu cầu tối thiểu 75%
  requiredSkillCategories: string[];
  canUnlockProject(userId: string, projectId: string): {
    isUnlocked: boolean;
    currentMastery: number;
    missingSkills: string[];
    recommendedReviews: string[];
  };
}
```
- **Điều kiện mở khóa cho từng dự án**:
  - **Dự án 1 (Alien Invasion Game)**:
    - Bắt buộc hoàn thành Chương 01 đến Chương 09.
    - Điểm thành thạo kỹ năng Hướng đối tượng (OOP) và Vòng lặp/Điều kiện $\ge 75\%$.
  - **Dự án 2 (Data Visualization)**:
    - Bắt buộc hoàn thành Chương 01 đến Chương 10.
    - Điểm thành thạo kỹ năng Tệp tin/Dữ liệu (File I/O, JSON, CSV) và Danh sách/Từ điển $\ge 75\%$.
  - **Dự án 3 (Web Applications with Django)**:
    - Bắt buộc hoàn thành trọn vẹn Phần I (Chương 01 đến Chương 11).
    - Điểm thành thạo tổng hợp $\ge 80\%$, bao gồm cả kỹ năng viết Unit Test với `pytest`.
- **Hỗ trợ thích ứng khi chưa đủ điều kiện**:
  - Hệ thống không chỉ đơn thuần báo khóa mà tự động đưa ra các bài tập đề xuất ôn tập từ `ReviewEngine` để người học lấp đầy lỗ hổng kiến thức trước khi tiếp tục.

---

## 5. KHẢ NĂNG TƯƠNG THÍCH DATABASE & DATA MODEL

Thiết kế giáo trình hợp nhất tương thích 100% với cấu trúc cơ sở dữ liệu PostgreSQL hiện có trong `supabase/migrations/` (Migration 001, 002, 003, 004):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             POSTGRESQL SCHEMA                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  courses (id, slug, title, description, order_index, is_published)          │
│     │                                                                       │
│     └──► topics (id, course_id, slug, title, summary, category,             │
│            │     order_index, accent_color, is_locked, level, prerequisites)│
│            │                                                                │
│            └──► lessons (id, topic_id, slug, title, theory_content,         │
│                   │      learning_objectives [JSONB], prerequisites [JSONB],│
│                   │      examples [JSONB], common_mistakes [JSONB],         │
│                   │      guided_task [JSONB], visual_explanation,           │
│                   │      mini_challenge [JSONB], recap [JSONB],             │
│                   │      reference_links [JSONB], level, order_index)       │
│                   │                                                         │
│                   └──► exercises (id, lesson_id, topic_id, slug, title,     │
│                          description, starter_code, solution_code,          │
│                          difficulty, points, completion_criteria [JSONB],   │
│                          skill_tags [JSONB], hints [JSONB], order_index)    │
│                             │                                               │
│                             ├──► examples (id, input_data, expected_output) │
│                             └──► test_cases (id, input_data, expected_output│
│                                              is_hidden, comparison_mode)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

- Toàn bộ các trường dữ liệu nâng cao (`learning_objectives`, `prerequisites`, `common_mistakes`, `guided_task`, `mini_challenge`) đều được lưu trữ dưới dạng `JSONB`, cho phép mở rộng linh hoạt mà không cần thay đổi cấu trúc bảng hay gây downtime.
- Đảm bảo tương thích ngược 100% với các test suite hiện hữu (`npm test`, `test_curriculum_full_12_chapters.js`).

---

## 6. ĐẶC TẢ CHI TIẾT PART I: NỀN TẢNG PYTHON (CHƯƠNG 01 - 11)

Mỗi bài học dưới đây đều được chuẩn hóa theo quy chuẩn sư phạm 12 thành phần bắt buộc.

---

### CHƯƠNG 01: BẮT ĐẦU VỚI PYTHON & NHẬP XUẤT CƠ BẢN (GETTING STARTED)
- **Mã định danh**: `topic-01-getting-started`
- **Cấp độ**: `Beginner`
- **Màu đại diện**: `mint` (`#BFE8D0`)
- **Tóm tắt**: Khám phá thế giới Python, môi trường thực thi, cú pháp thụt lề, chú thích và làm chủ hai lệnh vào/ra cốt lõi `print()` và `input()`.
- **Nguồn đối chiếu**: PCC 3E Chapter 1 + W3Schools (Intro, Syntax, Comments, User Input).

#### Bài 01.1: Giới thiệu Python & Triết lý lập trình
- **Slug**: `gioi-thieu-python-va-triet-ly-lap-trinh`
- **Cấp độ**: `Beginner` | **Tiên quyết**: Không có.
- **Mục tiêu học tập**:
  1. Hiểu Python là gì và vì sao Python trở thành ngôn ngữ hàng đầu cho AI, Web và Tự động hóa.
  2. Nắm được cách máy tính thực thi mã Python từng dòng thông qua trình thông dịch (Interpreter).
  3. Đọc và cảm nhận triết lý "The Zen of Python" (Đẹp đẽ tốt hơn xấu xí, Đơn giản tốt hơn phức tạp).
- **Mô hình trực quan (Visual Model)**: Sơ đồ dòng chảy mã nguồn `script.py` $\rightarrow$ `Python Bytecode (.pyc)` $\rightarrow$ `Python Virtual Machine (PVM)` $\rightarrow$ Màn hình Console.
- **Ví dụ mã nguồn & Output**:
  ```python
  # In lời chào đầu tiên và khám phá triết lý Python
  print("Chao mung ban den voi the gioi Python!")
  import this  # The Zen of Python
  ```
  *Expected Output*: Dòng chữ chào mừng kèm bài thơ 19 nguyên tắc vàng của Tim Peters.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Quên dấu ngoặc tròn `print "Xin chao"` (Cú pháp Python 2 cũ).
  - *Khắc phục*: Trong Python 3, `print()` luôn là một hàm và bắt buộc phải có cặp ngoặc tròn bao quanh tham số.
- **Thực hành có dẫn dắt**: Viết câu lệnh in ra tên và lời nhắn nhủ dành cho chính bạn khi bắt đầu học lập trình.
- **Bài tập độc lập**:
  - Bài 1 (`ex-01-01`): In dòng chữ `Hello CodeCoBUG!` chuẩn xác ra màn hình terminal. *(Độ khó: Very Easy - 10 điểm)*.
- **Thử thách Mini**: In ra một bức tranh nghệ thuật chữ (ASCII Art) hình chú rùa hoặc kim tự tháp bằng 4 lệnh `print()`.
- **Tóm tắt & Bài tiếp theo**: Python là ngôn ngữ thông dịch, rõ ràng và thanh lịch. Bài tiếp theo sẽ học về thụt lề và ghi chú.

#### Bài 01.2: Cú pháp thụt lề (Indentation) & Chú thích (Comments)
- **Slug**: `cu-phap-thut-le-va-chu-thich`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `gioi-thieu-python-va-triet-ly-lap-trinh`.
- **Mục tiêu học tập**:
  1. Hiểu quy tắc thụt lề bằng 4 khoảng trắng (Indentation) để xác định khối mã lệnh thay cho cặp ngoặc nhọn `{}`.
  2. Biết cách viết chú thích đơn dòng (`#`) và chú thích nhiều dòng (Docstrings `"""`).
  3. Nhận biết và sửa lỗi `IndentationError`.
- **Mô hình trực quan**: Hình ảnh các khối gạch Lego: Các dòng thẳng hàng cùng nằm trong một khối lệnh; dòng lùi vào 4 ô thuộc về khối con bên trong.
- **Ví dụ mã nguồn & Output**:
  ```python
  # Đây là dòng ghi chú giải thích thuật toán
  print("Dong lenh goc")
  if True:
      print("Dong lenh duoc thut le dung 4 khoang trang")
  ```
  *Expected Output*: Hai dòng chữ in tuần tự, không phát sinh lỗi.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Trộn lẫn phím `Tab` và khoảng trắng `Space`, hoặc thụt lề vô cớ ở dòng lệnh thông thường gây `IndentationError: unexpected indent`.
  - *Khắc phục*: Thiết lập trình soạn thảo tự động chuyển 1 phím Tab thành 4 dấu cách và tuân thủ chuẩn PEP 8.
- **Thực hành có dẫn dắt**: Sửa một đoạn code bị lỗi lệch hàng để chương trình chạy thông suốt.
- **Bài tập độc lập**:
  - Bài 1 (`ex-01-02`): Viết đoạn mã có sử dụng ghi chú mô tả bản thân và in kết quả. *(Độ khó: Very Easy - 10 điểm)*.
- **Thử thách Mini**: Đọc một đoạn mã bí mật được che giấu trong chú thích docstring và viết lệnh in ra nội dung đó.
- **Tóm tắt & Bài tiếp theo**: Thụt lề là linh hồn của cú pháp Python. Tiếp theo ta sẽ học xuất dữ liệu nâng cao với `print()`.

#### Bài 01.3: Xuất dữ liệu nâng cao với print() (Tham số sep và end)
- **Slug**: `xuat-du-lieu-nang-cao-print`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `cu-phap-thut-le-va-chu-thich`.
- **Mục tiêu học tập**:
  1. Sử dụng tham số `sep` để tùy biến ký tự ngăn cách giữa các giá trị in.
  2. Sử dụng tham số `end` để kiểm soát ký tự kết thúc dòng (mặc định xuống dòng `\n`).
  3. In chuỗi nhiều dòng bằng ký tự thoát `\n` và `\t`.
- **Mô hình trực quan**: Băng chuyền in ấn: Tham số `sep` chèn con dấu vào giữa các thùng hàng, tham số `end` quyết định sau khi xong chuyến hàng có hạ cần gạt xuống dòng hay không.
- **Ví dụ mã nguồn & Output**:
  ```python
  print("Python", "Crash", "Course", sep="-")
  print("Dang tai", end="...")
  print("Hoan tat!")
  ```
  *Expected Output*:
  ```
  Python-Crash-Course
  Dang tai...Hoan tat!
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Viết nhầm `sep = "-"` thành một chuỗi tham số in bình thường hoặc quên đóng dấu ngoặc kép.
  - *Khắc phục*: Nhớ rằng `sep` và `end` là các tham số từ khóa (keyword arguments) đặt ở cuối danh sách in.
- **Thực hành có dẫn dắt**: In dãy ngày tháng năm định dạng `DD/MM/YYYY` chỉ bằng một lệnh `print()` duy nhất dùng `sep="/"`.
- **Bài tập độc lập**:
  - Bài 1 (`ex-01-03`): In các từ ngăn cách bằng dấu gạch ngang. *(Độ khó: Very Easy - 10 điểm)*.
  - Bài 2 (`ex-01-04`): In tiến trình loading không xuống dòng. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: In một bảng điểm 3 cột thẳng hàng tăm tắp bằng cách kết hợp `\t` và `end=""`.
- **Tóm tắt & Bài tiếp theo**: Làm chủ việc in dữ liệu là bước đầu của giao tiếp người - máy. Tiếp theo ta sẽ học nhận dữ liệu từ bàn phím với `input()`.

#### Bài 01.4: Nhập dữ liệu từ bàn phím với hàm input()
- **Slug**: `nhap-du-lieu-tu-ban-phim-input`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `xuat-du-lieu-nang-cao-print`.
- **Mục tiêu học tập**:
  1. Sử dụng hàm `input()` để tạm dừng chương trình và chờ người dùng nhập văn bản.
  2. Hiểu bản chất: Dữ liệu do `input()` thu nhận **luôn luôn ở dạng chuỗi ký tự (string)**.
  3. Kết hợp `input()` với `print()` để tạo chương trình đối thoại tương tác đầu tiên.
- **Mô hình trực quan**: Hộp thư đầu vào: Mọi thứ người dùng ném vào hộp thư (dù là chữ hay số `100`) đều được bọc trong phong bì dán nhãn "Văn bản" (`str`).
- **Ví dụ mã nguồn & Output**:
  ```python
  ten = input("Nhap ten cua ban: ")
  print("Xin chao,", ten)
  ```
  *Input*: `Nam` $\rightarrow$ *Expected Output*: `Xin chao, Nam`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Nghĩ rằng nhập số thì biến sẽ là số: `tuoi = input()` rồi lấy `tuoi + 1` gây ra lỗi `TypeError: can only concatenate str to str`.
  - *Khắc phục*: Phải ghi nhớ ép kiểu số (sẽ học kỹ ở Chương 02). Ở bài này, tạm thời chỉ xử lý dữ liệu ở dạng chuỗi.
- **Thực hành có dẫn dắt**: Viết chương trình hỏi quê quán của người dùng và in câu chào mừng nồng nhiệt.
- **Bài tập độc lập**:
  - Bài 1 (`ex-01-05`): Nhập tên và in lời chào cá nhân hóa. *(Độ khó: Very Easy - 10 điểm)*.
  - Bài 2 (`ex-01-06`): Nhập 2 dòng văn bản và in ghép lại. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết bot phỏng vấn ngắn hỏi 3 câu liên tiếp và tóm tắt thành một đoạn hồ sơ ngắn.
- **Tóm tắt & Bài tiếp theo**: Chúc mừng bạn đã hoàn thành Chương 01! Bạn đã biết cách cho chương trình giao tiếp. Sang Chương 02, ta sẽ tìm hiểu cách lưu trữ thông tin vào Biến và khám phá các Kiểu dữ liệu.

---

### CHƯƠNG 02: BIẾN VÀ CÁC KIỂU DỮ LIỆU CƠ BẢN (VARIABLES & DATA TYPES)
- **Mã định danh**: `topic-02-variables-and-types`
- **Cấp độ**: `Beginner`
- **Màu đại diện**: `sky` (`#C7E3FF`)
- **Tóm tắt**: Khái niệm biến như một nhãn dán ô nhớ, các kiểu dữ liệu nguyên thủy (int, float, str, bool), ép kiểu dữ liệu (casting), quy tắc đặt tên chuẩn PEP 8 và các phương thức chuỗi mới (`removeprefix`, `removesuffix`).
- **Nguồn đối chiếu**: PCC 3E Chapter 2 + W3Schools (Variables, Data Types, Numbers, Casting, Strings).

#### Bài 02.1: Khai báo biến & Quy tắc đặt tên chuẩn PEP 8
- **Slug**: `khai-bao-bien-va-quy-tac-pep8`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `nhap-du-lieu-tu-ban-phim-input`.
- **Mục tiêu học tập**:
  1. Hiểu biến trong Python là một nhãn tham chiếu đến đối tượng trong bộ nhớ RAM, không cần khai báo kiểu trước (Dynamic Typing).
  2. Nắm chắc quy tắc đặt tên biến: Chỉ chứa chữ cái, chữ số và gạch dưới `_`, không bắt đầu bằng số, phân biệt hoa thường (`age` $\neq$ `Age`).
  3. Áp dụng chuẩn PEP 8: Đặt tên biến dạng `snake_case` có ý nghĩa rõ ràng, tránh đặt tên 1 chữ cái khó hiểu (`x`, `y`).
- **Mô hình trực quan**: Chiếc hộp có dán nhãn: Nhãn `user_name` dán vào chiếc hộp đựng giá trị `"Alice"`. Khi gán `user_name = "Bob"`, chiếc nhãn được bóc ra và dán sang chiếc hộp mới.
- **Ví dụ mã nguồn & Output**:
  ```python
  student_name = "Nguyen Van An"
  student_age = 16
  print("Hoc vien:", student_name, "- Tuoi:", student_age)
  ```
  *Expected Output*: `Hoc vien: Nguyen Van An - Tuoi: 16`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Đặt tên biến trùng với từ khóa hệ thống (`for`, `class`, `if`) hoặc dùng dấu gạch ngang `student-name`.
  - *Khắc phục*: Dùng gạch dưới `_` để nối các từ và kiểm tra danh sách `keyword.kwlist`.
- **Thực hành có dẫn dắt**: Tạo 3 biến mô tả một cuốn sách yêu thích (tên sách, tác giả, năm xuất bản) và in ra màn hình.
- **Bài tập độc lập**:
  - Bài 1 (`ex-02-01`): Khai báo và hoán đổi giá trị biến cơ bản. *(Độ khó: Very Easy - 10 điểm)*.
- **Thử thách Mini**: Viết chương trình cập nhật điểm số trò chơi qua từng màn: điểm ban đầu 0, qua ải 1 cộng 50, qua ải 2 nhân đôi điểm.
- **Tóm tắt & Bài tiếp theo**: Đặt tên biến chuẩn giúp code trong sáng và dễ bảo trì. Bài tiếp theo sẽ đi sâu vào các kiểu dữ liệu số và logic.

#### Bài 02.2: Các kiểu dữ liệu số (int, float) & Giá trị logic (bool)
- **Slug**: `kieu-du-lieu-so-va-logic-bool`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `khai-bao-bien-va-quy-tac-pep8`.
- **Mục tiêu học tập**:
  1. Phân biệt số nguyên (`int`), số thực (`float`), và tính năng viết số lớn bằng dấu gạch dưới trực quan (`1_000_000` trong Python 3).
  2. Hiểu kiểu luận lý `bool` chỉ nhận hai giá trị duy nhất: `True` hoặc `False`.
  3. Nhận biết hằng số (Constants): Quy ước viết hoa toàn bộ (`PI = 3.14159`) để nhắc nhở không thay đổi giá trị.
- **Mô hình trực quan**: Công tắc đèn: Kiểu `bool` giống công tắc 2 trạng thái Bật (`True`) hoặc Tắt (`False`). Số nguyên là các bậc thang rời rạc, số thực là thước đo liên tục có vạch milimet.
- **Ví dụ mã nguồn & Output**:
  ```python
  so_du_tai_khoan = 1_500_000  # 1.5 trieu dong
  lai_suat = 0.065             # 6.5%
  tai_khoan_hoat_dong = True
  print("So du:", so_du_tai_khoan, "VND")
  print("Trang thai:", tai_khoan_hoat_dong)
  ```
  *Expected Output*:
  ```
  So du: 1500000 VND
  Trang thai: True
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Viết `true` hoặc `false` chữ thường khiến Python báo lỗi `NameError: name 'true' is not defined`.
  - *Khắc phục*: Luôn viết hoa chữ cái đầu: `True` và `False`.
- **Thực hành có dẫn dắt**: Tính chu vi hình tròn với bán kính $r = 5$ và hằng số `PI = 3.14`.
- **Bài tập độc lập**:
  - Bài 1 (`ex-02-02`): Tính tiền tiết kiệm sau 1 năm có kỳ hạn. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết biểu thức kiểm tra xem một số nguyên có phải là số dương chẵn hay không (trả về `True`/`False`).
- **Tóm tắt & Bài tiếp theo**: Số và Logic là nền tảng của mọi phép toán. Tiếp theo ta sẽ học cách chuyển đổi qua lại giữa các kiểu dữ liệu (Type Casting).

#### Bài 02.3: Ép kiểu dữ liệu (Type Casting) & Kiểm tra kiểu dữ liệu
- **Slug**: `ep-kieu-du-lieu-casting`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `kieu-du-lieu-so-va-logic-bool`.
- **Mục tiêu học tập**:
  1. Sử dụng các hàm ép kiểu `int()`, `float()`, `str()`, `bool()`.
  2. Sử dụng hàm `type()` để kiểm tra kiểu dữ liệu của bất kỳ đối tượng nào.
  3. Xử lý triệt để bài toán nhập số từ bàn phím qua `int(input())`.
- **Mô hình trực quan**: Khuôn đúc bột: Chuỗi `"123"` là hạt cát thô; khi đưa qua khuôn `int()`, nó được nén thành viên gạch số nguyên `123` có thể dùng để xây nhà (cộng trừ nhân chia).
- **Ví dụ mã nguồn & Output**:
  ```python
  nam_sinh = input("Nhap nam sinh: ") # Nhap vao chuoi "2008"
  tuoi = 2026 - int(nam_sinh)         # Ep kieu sang so nguyen
  print("Tuoi cua ban la:", tuoi)
  ```
  *Input*: `2008` $\rightarrow$ *Expected Output*: `Tuoi cua ban la: 18`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Cố gắng ép kiểu một chuỗi chứa chữ cái sang số `int("abc")` gây ra ngoại lệ `ValueError: invalid literal for int()`.
  - *Khắc phục*: Luôn đảm bảo chuỗi chỉ chứa ký tự số trước khi ép kiểu.
- **Thực hành có dẫn dắt**: Nhập vào điểm kiểm tra Toán và Văn của học sinh và tính điểm trung bình (cần ép kiểu `float`).
- **Bài tập độc lập**:
  - Bài 1 (`ex-02-03`): Tính tổng hai số nhập từ bàn phím. *(Độ khó: Very Easy - 10 điểm)*.
  - Bài 2 (`ex-02-04`): Tính chỉ số khối cơ thể BMI từ chiều cao và cân nặng. *(Độ khó: Easy - 15 điểm)*.
- **Thử thách Mini**: Nhập vào một số giây bất kỳ và quy đổi ra số phút và số giây còn dư.
- **Tóm tắt & Bài tiếp theo**: Ép kiểu giúp chương trình xử lý đúng phép toán. Tiếp theo ta sẽ khám phá sức mạnh của kiểu dữ liệu Chuỗi (Strings) và các phương thức chuỗi mới.

#### Bài 02.4: Xử lý chuỗi (Strings), f-strings & Phương thức removeprefix/removesuffix
- **Slug**: `xu-ly-chuoi-f-strings-va-removeprefix`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `ep-kieu-du-lieu-casting`.
- **Mục tiêu học tập**:
  1. Thay đổi hoa thường với `title()`, `upper()`, `lower()`.
  2. Cắt bỏ khoảng trắng thừa với `strip()`, `lstrip()`, `rstrip()`.
  3. Sử dụng định dạng chuỗi hiện đại **f-strings** (`f"Ket qua: {x}"`).
  4. Nắm vững hai phương thức cắt đầu/đuôi mới trong Python 3.9+: `removeprefix()` và `removesuffix()`.
- **Mô hình trực quan**: Kéo cắt chuỗi: `strip()` cắt khoảng trắng ở hai đầu rìa, còn `removeprefix("https://")` cắt bỏ tiền tố web chính xác như lưỡi dao chuyên dụng mà không làm hỏng thân chuỗi.
- **Ví dụ mã nguồn & Output**:
  ```python
  url = "https://codecobug.dev/python"
  ten_mien = url.removeprefix("https://").removesuffix("/python")
  print(f"Ten mien sach: {ten_mien.upper()}")
  ```
  *Expected Output*: `Ten mien sach: CODECOBUG.DEV`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Quên chữ cái `f` trước dấu ngoặc kép khi dùng f-string: `"Tong la: {a + b}"` sẽ in ra nguyên văn dòng chữ `{a + b}`.
  - *Khắc phục*: Luôn đặt tiền tố `f` ngay sát trước dấu mở ngoặc kép `f"..."`.
- **Thực hành có dẫn dắt**: Chuẩn hóa họ tên người dùng (viết hoa chữ cái đầu mỗi từ và loại bỏ khoảng trắng dư thừa ở đầu và cuối).
- **Bài tập độc lập**:
  - Bài 1 (`ex-02-05`): Chuẩn hóa tên tệp bằng cách bỏ đuôi `.py` với `removesuffix`. *(Độ khó: Easy - 10 điểm)*.
  - Bài 2 (`ex-02-06`): Tạo tin nhắn thiệp mừng cá nhân hóa bằng f-string. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết bộ lọc làm sạch số điện thoại: Bỏ tiền tố `+84`, bỏ khoảng trắng và in ra dạng số di động nội địa chuẩn `09...`.
- **Tóm tắt & Bài tiếp theo**: Chuỗi là dạng dữ liệu phổ biến nhất trên Internet. Sang Chương 03, ta sẽ học cấu trúc dữ liệu cơ bản đầu tiên: Danh sách (Lists).

---

### CHƯƠNG 03: DANH SÁCH & TOÁN TỬ CƠ BẢN (INTRODUCING LISTS)
- **Mã định danh**: `topic-03-introducing-lists`
- **Cấp độ**: `Beginner`
- **Màu đại diện**: `lavender` (`#DCCBFF`)
- **Tóm tắt**: Khái niệm danh sách trong Python, chỉ mục thuận $0, 1, 2...$ và chỉ mục nghịch âm $-1, -2$, các thao tác thêm, sửa, xóa phần tử (`append`, `insert`, `del`, `pop`, `remove`), cùng toán tử số học và toán tử thành viên `in`.
- **Nguồn đối chiếu**: PCC 3E Chapter 3 + W3Schools (Lists, Operators).

#### Bài 03.1: Danh sách là gì? Chỉ mục thuận và Chỉ mục âm (-1)
- **Slug**: `danh-sach-chi-muc-thuan-va-chi-muc-am`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `xu-ly-chuoi-f-strings-va-removeprefix`.
- **Mục tiêu học tập**:
  1. Định nghĩa danh sách bằng cặp ngoặc vuông `[]` chứa các phần tử ngăn cách bởi dấu phẩy.
  2. Truy cập phần tử bằng chỉ mục thuận (bắt đầu từ số `0`).
  3. Truy cập phần tử cuối cùng cực nhanh bằng chỉ mục âm `-1`, kế cuối là `-2`.
- **Mô hình trực quan**: Hàng ghế rạp chiếu phim: Đếm từ bên trái sang phải: $0, 1, 2, 3$; đếm từ bên phải sang trái (ngồi ở hàng ghế cuối): $-1, -2, -3$.
- **Ví dụ mã nguồn & Output**:
  ```python
  xe_hoi = ["VinFast", "Tesla", "Toyota", "BMW"]
  print("Chiec dau tien:", xe_hoi[0])
  print("Chiec cuoi cung:", xe_hoi[-1])
  ```
  *Expected Output*:
  ```
  Chiec dau tien: VinFast
  Chiec cuoi cung: BMW
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Lỗi kinh điển `IndexError: list index out of range` khi truy cập chỉ mục bằng độ dài danh sách (danh sách có 4 phần tử thì chỉ mục lớn nhất chỉ là 3).
  - *Khắc phục*: Luôn nhớ chỉ mục cuối cùng là `len(list) - 1` hoặc đơn giản dùng `list[-1]`.
- **Thực hành có dẫn dắt**: Tạo danh sách 4 người bạn thân nhất và in ra câu chúc mừng người bạn ngồi ở vị trí đầu tiên và cuối cùng.
- **Bài tập độc lập**:
  - Bài 1 (`ex-03-01`): Lấy phần tử đầu tiên và cuối cùng của danh sách. *(Độ khó: Very Easy - 10 điểm)*.
- **Thử thách Mini**: Đổi chỗ phần tử đầu tiên và phần tử cuối cùng của danh sách mà không dùng biến tạm.
- **Tóm tắt & Bài tiếp theo**: Chỉ mục giúp ta chọn đúng dữ liệu. Tiếp theo ta sẽ học cách thay đổi, thêm mới và xóa phần tử trong danh sách.

#### Bài 03.2: Thêm, Sửa và Xóa phần tử trong Danh sách (append, insert, pop, remove)
- **Slug**: `thao-tac-them-sua-xoa-danh-sach`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `danh-sach-chi-muc-thuan-va-chi-muc-am`.
- **Mục tiêu học tập**:
  1. Thay đổi giá trị phần tử qua phép gán chỉ mục: `list[0] = new_val`.
  2. Thêm phần tử vào cuối với `append()` hoặc chèn vào vị trí bất kỳ với `insert(index, val)`.
  3. Xóa phần tử theo vị trí với `del` hoặc `pop()` (lấy phần tử ra để sử dụng tiếp).
  4. Xóa phần tử theo giá trị với `remove(value)`.
- **Mô hình trực quan**: Ngăn kéo đựng hồ sơ: `append()` xếp thêm 1 bộ hồ sơ vào ngăn kéo cuối cùng; `pop()` rút 1 tập hồ sơ ra đưa cho sếp xem; `remove("Hop dong A")` đi tìm tập hồ sơ có tên đó rồi tiêu hủy.
- **Ví dụ mã nguồn & Output**:
  ```python
  danh_sach = ["Com", "Pho", "Bun"]
  danh_sach.append("Banh mi")
  mon_vua_an = danh_sach.pop(1) # Lay "Pho" ra khoi danh sach
  print("Danh sach con lai:", danh_sach)
  print("Mon vua an:", mon_vua_an)
  ```
  *Expected Output*:
  ```
  Danh sach con lai: ['Com', 'Bun', 'Banh mi']
  Mon vua an: Pho
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Gọi `remove("Pizza")` khi trong danh sách không hề có chữ `"Pizza"`, dẫn tới lỗi `ValueError: list.remove(x): x not in list`.
  - *Khắc phục*: Dùng toán tử `if "Pizza" in danh_sach:` trước khi gọi `remove()`.
- **Thực hành có dẫn dắt**: Xây dựng danh sách giỏ hàng siêu thị: thêm 2 món, xóa 1 món đã đổi ý, và thanh toán món ở đỉnh giỏ hàng.
- **Bài tập độc lập**:
  - Bài 1 (`ex-03-02`): Quản lý hàng đợi khách hàng với `append` và `pop(0)`. *(Độ khó: Easy - 15 điểm)*.
  - Bài 2 (`ex-03-03`): Xóa phần tử lỗi khỏi danh sách điểm số. *(Độ khó: Easy - 15 điểm)*.
- **Thử thách Mini**: Xây dựng thuật toán ngăn xếp (Stack) LIFO: Nhập vào các lệnh, đẩy vào và rút ra phần tử theo đúng quy tắc.
- **Tóm tắt & Bài tiếp theo**: Bạn đã biết cách làm chủ danh sách linh hoạt. Bài tiếp theo sẽ học cách sắp xếp danh sách và đo lường độ dài.

#### Bài 03.3: Sắp xếp danh sách (sort, sorted, reverse) & Hàm len()
- **Slug**: `sap-xep-danh-sach-sort-va-sorted`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `thao-tac-them-sua-xoa-danh-sach`.
- **Mục tiêu học tập**:
  1. Phân biệt sắp xếp vĩnh viễn với phương thức `list.sort()` và sắp xếp tạm thời với hàm `sorted(list)`.
  2. Sắp xếp giảm dần với tham số `reverse=True`.
  3. Đảo ngược danh sách với `list.reverse()`.
  4. Đếm số lượng phần tử với hàm `len()`.
- **Mô hình trực quan**: Sắp xếp kệ sách: `list.sort()` nhấc các cuốn sách ra sắp lại theo thứ tự chữ cái vĩnh viễn trên kệ; `sorted(list)` chụp một bức ảnh kệ sách đã sắp xếp gọn gàng để xem tạm mà không xáo trộn kệ sách thật.
- **Ví dụ mã nguồn & Output**:
  ```python
  diem_so = [8.5, 9.0, 7.0, 10.0]
  print("Danh sach sap xep tam thoi:", sorted(diem_so))
  print("Danh sach goc van giu nguyen:", diem_so)
  diem_so.sort(reverse=True)
  print("Danh sach goc da sap giam dan:", diem_so)
  ```
  *Expected Output*:
  ```
  Danh sach sap xep tam thoi: [7.0, 8.5, 9.0, 10.0]
  Danh sach goc van giu nguyen: [8.5, 9.0, 7.0, 10.0]
  Danh sach goc da sap giam dan: [10.0, 9.0, 8.5, 7.0]
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Gán kết quả của hàm sort: `moi = diem_so.sort()`. Lúc này `moi` sẽ mang giá trị `None` vì phương thức `.sort()` thực hiện tại chỗ (in-place) và không trả về giá trị!
  - *Khắc phục*: Dùng `.sort()` độc lập, hoặc dùng `moi = sorted(diem_so)` nếu muốn tạo biến danh sách mới.
- **Thực hành có dẫn dắt**: Nhập danh sách điểm và in ra điểm cao nhất và điểm thấp nhất sau khi sắp xếp.
- **Bài tập độc lập**:
  - Bài 1 (`ex-03-04`): Sắp xếp danh sách tên học sinh theo bảng chữ cái. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Tìm giá trị lớn thứ hai (Second Maximum) trong một danh sách số nguyên bất kỳ.
- **Tóm tắt & Bài tiếp theo**: Kết thúc Chương 03! Sang Chương 04, ta sẽ học cách tự động hóa công việc với Danh sách bằng Vòng lặp For và làm quen với Bộ dữ liệu Tuple.

---

### CHƯƠNG 04: LÀM VIỆC VỚI DANH SÁCH & BỘ DỮ LIỆU TUPLE (WORKING WITH LISTS)
- **Mã định danh**: `topic-04-working-with-lists`
- **Cấp độ**: `Beginner`
- **Màu đại diện**: `peach` (`#FFCDBD`)
- **Tóm tắt**: Vòng lặp duyệt qua danh sách, tạo danh sách số với `range()`, các hàm thống kê (`min`, `max`, `sum`), biểu thức khởi tạo danh sách nhanh (List Comprehensions), kỹ thuật cắt lát (Slicing) và bộ dữ liệu bất biến Tuple từ W3Schools.
- **Nguồn đối chiếu**: PCC 3E Chapter 4 + W3Schools (Lists, For Loops, Tuples).

#### Bài 04.1: Duyệt danh sách với vòng lặp for & Hàm range()
- **Slug**: `duyet-danh-sach-vong-lap-for-va-range`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `sap-xep-danh-sach-sort-va-sorted`.
- **Mục tiêu học tập**:
  1. Sử dụng cú pháp `for item in my_list:` để thực hiện hành động trên từng phần tử.
  2. Hiểu nguyên tắc thụt lề trong khối lặp và biến lặp tự động cập nhật giá trị.
  3. Tạo dãy số nguyên liên tiếp với hàm `range(start, stop, step)`.
- **Mô hình trực quan**: Băng chuyền đóng gói: Từng món đồ chơi trong thùng lần lượt trượt qua bàn làm việc; cánh tay robot `for` dán nhãn lên từng món cho đến khi thùng rỗng.
- **Ví dụ mã nguồn & Output**:
  ```python
  danh_sach_lop = ["An", "Binh", "Chau"]
  for hoc_sinh in danh_sach_lop:
      print(f"Chao mung {hoc_sinh} den voi lop hoc!")
  print("Diem danh hoan tat.")
  ```
  *Expected Output*: In 3 câu chào cho 3 học sinh và dòng kết thúc ở ngoài vòng lặp.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Thụt lề nhầm dòng lệnh tổng kết vào bên trong vòng lặp khiến dòng đó bị in lặp đi lặp lại nhiều lần.
  - *Khắc phục*: Kéo các dòng lệnh chỉ cần chạy một lần sau khi kết thúc lặp thẳng hàng với từ khóa `for`.
- **Thực hành có dẫn dắt**: Dùng `range(1, 11)` để in ra bảng cửu chương 5.
- **Bài tập độc lập**:
  - Bài 1 (`ex-04-01`): Tính tổng các số chẵn từ 1 đến $N$ bằng `range`. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Tạo danh sách chứa 10 số chính phương đầu tiên ($1, 4, 9, 16...$) bằng vòng lặp for.
- **Tóm tắt & Bài tiếp theo**: Vòng lặp giải phóng con người khỏi công việc lặp lại. Tiếp theo ta sẽ học cách viết code ngắn gọn hơn gấp 5 lần với List Comprehension.

#### Bài 04.2: Biểu thức khởi tạo danh sách (List Comprehensions) & Thống kê
- **Slug**: `list-comprehensions-va-thong-ke`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `duyet-danh-sach-vong-lap-for-va-range`.
- **Mục tiêu học tập**:
  1. Sử dụng các hàm thống kê tích hợp: `min()`, `max()`, `sum()`.
  2. Viết biểu thức List Comprehension: `[expression for item in iterable if condition]`.
  3. Nâng cao tư duy viết mã Python chuẩn mực (Pythonic code).
- **Mô hình trực quan**: Máy đóng gói viên nén tự động: Thay vì mở hộp, nhặt từng hạt rồi đóng nắp (3 dòng code), máy nén thực hiện toàn bộ thao tác trong đúng một dòng ngoặc vuông `[...]`.
- **Ví dụ mã nguồn & Output**:
  ```python
  # Cach truyen thong: 3 dong
  # Cach Pythonic: 1 dong duy nhat
  so_chinh_phuong = [x**2 for x in range(1, 6)]
  print("Danh sach:", so_chinh_phuong)
  print("Tong:", sum(so_chinh_phuong))
  ```
  *Expected Output*:
  ```
  Danh sach: [1, 4, 9, 16, 25]
  Tong: 55
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Viết quá nhiều biểu thức lồng ghép phức tạp trong 1 dòng List Comprehension làm giảm tính dễ đọc.
  - *Khắc phục*: Áp dụng Zen of Python: "Đọc hiểu quan trọng hơn viết ngắn". Chỉ dùng List Comprehension cho các phép biến đổi đơn giản.
- **Thực hành có dẫn dắt**: Tạo danh sách chứa độ dài của từng từ trong một câu văn bản.
- **Bài tập độc lập**:
  - Bài 1 (`ex-04-02`): Lọc và bình phương các số lẻ trong danh sách bằng List Comprehension. *(Độ khó: Easy - 15 điểm)*.
- **Thử thách Mini**: Đếm số lượng từ có độ dài lớn hơn 5 ký tự trong một đoạn văn bản bằng cách kết hợp `sum()` và comprehension.
- **Tóm tắt & Bài tiếp theo**: List Comprehension là vũ khí lợi hại của lập trình viên Python. Tiếp theo ta sẽ học kỹ thuật cắt lát (Slicing) danh sách.

#### Bài 04.3: Cắt lát danh sách (Slicing) & Sao chép danh sách an toàn
- **Slug**: `cat-lat-slicing-va-sao-chep-danh-sach`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `list-comprehensions-va-thong-ke`.
- **Mục tiêu học tập**:
  1. Trích xuất một phần danh sách với cú pháp `list[start:stop:step]`.
  2. Bỏ qua `start` (mặc định từ đầu) hoặc `stop` (mặc định đến hết).
  3. Phân biệt phép gán tham chiếu `b = a` (cùng trỏ một vùng nhớ) và phép sao chép nông độc lập `b = a[:]` hoặc `b = a.copy()`.
- **Mô hình trực quan**: Bản sao hợp đồng: `b = a` là hai người cùng cầm một bản hợp đồng gốc (người A sửa, người B thấy sửa ngay). `b = a[:]` là photocopy hợp đồng ra một bản mới riêng biệt (người B sửa không ảnh hưởng đến người A).
- **Ví dụ mã nguồn & Output**:
  ```python
  mon_an = ["Pho", "Bun", "Mien", "Chao", "Com"]
  ba_mon_dau = mon_an[:3]
  mon_sao_chep = mon_an[:] # Tao ban sao doc lap
  mon_sao_chep.append("Banh cuon")
  print("Ba mon dau:", ba_mon_dau)
  print("Danh sach goc van an toan:", len(mon_an))
  ```
  *Expected Output*:
  ```
  Ba mon dau: ['Pho', 'Bun', 'Mien']
  Danh sach goc van an toan: 5
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Nghĩ rằng `b = a` tạo danh sách mới, sau đó sửa `b` thì `a` cũng bị thay đổi theo ngoài ý muốn (Hiện tượng Aliasing bug).
  - *Khắc phục*: Luôn dùng `a[:]` hoặc `a.copy()` khi muốn nhân bản danh sách.
- **Thực hành có dẫn dắt**: Lấy ra 3 phần tử nằm ở giữa một danh sách có 7 phần tử.
- **Bài tập độc lập**:
  - Bài 1 (`ex-04-03`): Đảo ngược danh sách bằng bước nhảy âm `[::-1]`. *(Độ khó: Easy - 10 điểm)*.
  - Bài 2 (`ex-04-04`): Cắt lát lấy các phần tử ở vị trí chỉ mục chẵn. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết hàm kiểm tra chuỗi đối xứng (Palindrome) chỉ bằng một biểu thức so sánh cắt lát chuỗi `s == s[::-1]`.
- **Tóm tắt & Bài tiếp theo**: Cắt lát giúp lấy đúng phần dữ liệu cần thiết. Tiếp theo ta sẽ học về Bộ dữ liệu Tuple - người anh em bất biến của List.

#### Bài 04.4: Bộ dữ liệu bất biến (Tuples) & Kỹ thuật đóng/mở gói (Unpacking)
- **Slug**: `bo-du-lieu-bat-bien-tuples-va-unpacking`
- **Cấp độ**: `Beginner` | **Tiên quyết**: `cat-lat-slicing-va-sao-chep-danh-sach`.
- **Mục tiêu học tập**:
  1. Định nghĩa Tuple bằng cặp ngoặc đơn `()` chứa dữ liệu cố định không thể chỉnh sửa (*Immutable*).
  2. Hiểu tại sao cần Tuple: Bảo vệ dữ liệu nhạy cảm (tọa độ GPS, kích thước màn hình), tối ưu bộ nhớ và tốc độ xử lý nhanh hơn List.
  3. Kỹ thuật mở gói Tuple (*Tuple Unpacking*): `width, height = dimensions`.
- **Mô hình trực quan**: Hòn đá khắc bia mộ vs Bảng trắng: Danh sách là bảng trắng viết bút dạ xóa được; Tuple là dòng chữ khắc lên đá cẩm thạch vĩnh viễn không thể tẩy xóa hay chèn thêm chữ.
- **Ví dụ mã nguồn & Output**:
  ```python
  do_phan_giai = (1920, 1080)
  chieu_rong, chieu_cao = do_phan_giai # Unpacking
  print(f"Man hinh: {chieu_rong} x {chieu_cao} pixels")
  # do_phan_giai[0] = 1280  --> Se bao loi TypeError!
  ```
  *Expected Output*: `Man hinh: 1920 x 1080 pixels`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Tạo tuple có 1 phần tử nhưng quên dấu phẩy: `t = (5)` sẽ thành số nguyên `int`, phải viết là `t = (5,)`.
  - *Khắc phục*: Luôn thêm dấu phẩy sau phần tử duy nhất trong tuple 1 phần tử.
- **Thực hành có dẫn dắt**: Lưu trữ tọa độ 3D $(x, y, z)$ của một nhân vật game vào tuple và giải nén in ra từng trục.
- **Bài tập độc lập**:
  - Bài 1 (`ex-04-05`): Hoán đổi 2 biến bằng cú pháp tuple packing/unpacking `a, b = b, a` không dùng biến tạm. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết chương trình lưu thông tin ngày tháng năm sinh vào tuple và in ra chuỗi định dạng tiếng Việt.
- **Tóm tắt & Bài tiếp theo**: Hoàn thành Chương 04! Bạn đã nắm chắc List và Tuple. Sang Chương 05, chúng ta sẽ học cách đưa ra quyết định với Câu lệnh điều kiện `if`.

---

### CHƯƠNG 05: CÂU LỆNH ĐIỀU KIỆN (IF STATEMENTS)
- **Mã định danh**: `topic-05-if-statements`
- **Cấp độ**: `Intermediate`
- **Màu đại diện**: `yellow` (`#FFF0B8`)
- **Tóm tắt**: Kiểm tra điều kiện logic, so sánh số và chuỗi, toán tử kết hợp `and`/`or`/`not`, cấu trúc rẽ nhánh `if`, `if-else`, chuỗi `if-elif-else`, và kỹ thuật kiểm tra danh sách rỗng.
- **Nguồn đối chiếu**: PCC 3E Chapter 5 + W3Schools (If...Else, Booleans, Operators).

#### Bài 05.1: Kiểm tra điều kiện & Toán tử so sánh/logic
- **Slug**: `kiem-tra-dieu-kien-va-toan-tu-logic`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `bo-du-lieu-bat-bien-tuples-va-unpacking`.
- **Mục tiêu học tập**:
  1. Sử dụng các toán tử so sánh: bằng (`==`), khác (`!=`), lớn hơn/nhỏ hơn (`>`, `<`, `>=`, `<=`).
  2. Kết hợp nhiều điều kiện bằng toán tử logic `and` (cả 2 cùng đúng), `or` (chỉ cần 1 điều kiện đúng) và `not` (phủ định).
  3. Kiểm tra sự tồn tại trong danh sách bằng toán tử `in` và `not in`.
- **Mô hình trực quan**: Trạm kiểm soát vé tàu: Cần (Có vé tàu hợp lệ) AND (Có căn cước công dân) mới được qua cổng; nếu (Là trẻ em dưới 6 tuổi) OR (Là người cao tuổi) thì được miễn vé.
- **Ví dụ mã nguồn & Output**:
  ```python
  tuoi = 18
  co_bang_lai = True
  duoc_lai_xe = (tuoi >= 18) and co_bang_lai
  print("Du dieu kien lai xe:", duoc_lai_xe)
  ```
  *Expected Output*: `Du dieu kien lai xe: True`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Nhầm lẫn tai hại giữa toán tử gán `=` và toán tử so sánh bằng `==` trong biểu thức điều kiện.
  - *Khắc phục*: Nhớ rằng 1 dấu `=` là cất đồ vào hộp, 2 dấu `==` là so sánh hai bên có bằng nhau hay không.
- **Thực hành có dẫn dắt**: Viết biểu thức kiểm tra xem nhiệt độ ngoài trời có nằm trong khoảng lý tưởng từ $20^\circ\text{C}$ đến $28^\circ\text{C}$ hay không (cú pháp chuỗi: `20 <= temp <= 28`).
- **Bài tập độc lập**:
  - Bài 1 (`ex-05-01`): Kiểm tra quyền đăng nhập dựa trên tên người dùng và mật khẩu. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết biểu thức xác định một năm có phải là năm nhuận hay không (chia hết cho 400 hoặc chia hết cho 4 nhưng không chia hết cho 100).
- **Tóm tắt & Bài tiếp theo**: Biểu thức logic là trái tim của câu lệnh rẽ nhánh. Tiếp theo ta sẽ học cách điều khiển dòng chảy chương trình với `if`, `elif` và `else`.

#### Bài 05.2: Cấu trúc rẽ nhánh if, if-else và if-elif-else
- **Slug**: `cau-truc-re-nhanh-if-elif-else`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `kiem-tra-dieu-kien-va-toan-tu-logic`.
- **Mục tiêu học tập**:
  1. Xây dựng nhánh rẽ đơn với `if`, hai nhánh đối lập với `if-else`.
  2. Phân loại nhiều mức độ với chuỗi `if-elif-else`.
  3. Hiểu cơ chế dừng sớm: Khi một nhánh `elif` đã thỏa mãn, toàn bộ các nhánh phía sau sẽ được bỏ qua.
- **Mô hình trực quan**: Đường ray xe lửa có cần gạt chuyển ray: Con tàu chạy đến ngã ba; nếu cần gạt 1 mở thì chạy vào ga A; nếu không thì kiểm tra cần gạt 2; nếu không có cần nào mở thì đi thẳng vào ga mặc định (`else`).
- **Ví dụ mã nguồn & Output**:
  ```python
  diem_thi = 8.5
  if diem_thi >= 9.0:
      xep_loai = "Xuat sac"
  elif diem_thi >= 8.0:
      xep_loai = "Gioi"
  elif diem_thi >= 6.5:
      xep_loai = "Kha"
  else:
      xep_loai = "Trung binh"
  print(f"Xep loai hoc tap: {xep_loai}")
  ```
  *Expected Output*: `Xep loai hoc tap: Gioi`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Sắp xếp sai thứ tự điều kiện: Đặt `diem_thi >= 6.5` lên đầu tiên, khiến điểm 9.0 cũng bị rơi vào loại "Khá" do dừng sớm.
  - *Khắc phục*: Luôn sắp xếp điều kiện từ nghiêm ngặt nhất đến rộng nhất (từ cao xuống thấp).
- **Thực hành có dẫn dắt**: Viết chương trình tính giá vé xem phim theo độ tuổi (Dưới 6 tuổi miễn phí, 6-17 tuổi 50k, trên 17 tuổi 80k).
- **Bài tập độc lập**:
  - Bài 1 (`ex-05-02`): Tính cước taxi dựa trên số km di chuyển (giá mở cửa, giá km tiếp theo). *(Độ khó: Easy - 15 điểm)*.
- **Thử thách Mini**: Tính thuế thu nhập cá nhân theo biểu lũy tiến từng phần đơn giản.
- **Tóm tắt & Bài tiếp theo**: Rẽ nhánh giúp chương trình có trí thông minh nhân tạo sơ khai. Tiếp theo ta sẽ học cách kết hợp `if` với Danh sách để kiểm tra dữ liệu thực tế.

#### Bài 05.3: Kết hợp câu lệnh if với Danh sách (Xử lý danh sách rỗng)
- **Slug**: `ket-hop-if-voi-danh-sach-va-danh-sach-rong`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `cau-truc-re-nhanh-if-elif-else`.
- **Mục tiêu học tập**:
  1. Kiểm tra danh sách có rỗng hay không bằng quy tắc chân trị (Truthy/Falsy): `if my_list:`.
  2. Duyệt danh sách và kiểm tra điều kiện đặc biệt cho từng phần tử (ví dụ: hết hàng, nguyên liệu đặc biệt).
  3. So sánh đối chiếu giữa hai danh sách (danh sách yêu cầu vs danh sách có sẵn).
- **Mô hình trực quan**: Giỏ đi chợ: Nhìn vào giỏ hàng; nếu giỏ trống (`not cart`) thì thông báo "Bạn chưa chọn món nào"; nếu có hàng thì duyệt từng món kiểm tra xem có món nào hết hạn không.
- **Ví dụ mã nguồn & Output**:
  ```python
  yeu_cau = ["nam", "pho mai", "ot chuong"]
  nguyen_lieu_het = ["nam"]
  
  if yeu_cau: # Kiem tra danh sach khong rong
      for item in yeu_cau:
          if item in nguyen_lieu_het:
              print(f"Xin loi, quan da het mon {item}!")
          else:
              print(f"Them mon {item} vao banh.")
  else:
      print("Ban chua chon nguyen lieu nao.")
  ```
  *Expected Output*:
  ```
  Xin loi, quan da het mon nam!
  Them mon pho mai vao banh.
  Them mon ot chuong vao banh.
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Viết `if len(my_list) > 0:` dài dòng và không chuẩn Pythonic.
  - *Khắc phục*: Dùng trực tiếp `if my_list:` vì danh sách rỗng tự động mang chân trị `False`.
- **Thực hành có dẫn dắt**: Viết hệ thống kiểm tra danh sách tài khoản quản trị viên: nếu tài khoản là `admin` thì in lời chào đặc biệt, người khác in lời chào thông thường.
- **Bài tập độc lập**:
  - Bài 1 (`ex-05-03`): Kiểm tra danh sách học sinh vắng thi và đưa ra cảnh báo. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: So khớp danh sách số trúng thưởng xổ số với danh sách vé người chơi mua và đếm số lượng vé trúng giải.
- **Tóm tắt & Bài tiếp theo**: Bạn đã hoàn thành Chương 05! Sang Chương 06, chúng ta sẽ bước vào thế giới của cấu trúc dữ liệu Từ điển (Dictionaries) và Tập hợp (Sets).

---

### CHƯƠNG 06: TỪ ĐIỂN VÀ TẬP HỢP (DICTIONARIES & SETS)
- **Mã định danh**: `topic-06-dictionaries-and-sets`
- **Cấp độ**: `Intermediate`
- **Màu đại diện**: `mint` (`#BFE8D0`)
- **Tóm tắt**: Cấu trúc cặp Khóa - Giá trị (Key-Value), thêm/sửa/xóa, phương thức an toàn `dict.get()`, duyệt qua khóa/giá trị/cặp mục, kỹ thuật lồng ghép dữ liệu phức tạp (*Nesting*) của PCC3E, và kiểu dữ liệu Tập hợp duy nhất (*Sets*) cùng các phép toán tập hợp của W3Schools.
- **Nguồn đối chiếu**: PCC 3E Chapter 6 + W3Schools (Dictionaries, Sets).

#### Bài 06.1: Từ điển tra cứu cơ bản (Khóa & Giá trị, phương thức get)
- **Slug**: `tu-dien-co-ban-va-phuong-thuc-get`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `ket-hop-if-voi-danh-sach-va-danh-sach-rong`.
- **Mục tiêu học tập**:
  1. Định nghĩa từ điển bằng cặp ngoặc nhọn `{}` chứa các cặp `key: value`.
  2. Truy cập, thêm mới, sửa đổi và xóa (`del`) phần tử trong từ điển.
  3. Sử dụng phương thức `dict.get(key, default_value)` để lấy dữ liệu an toàn mà không bao giờ bị sập chương trình vì lỗi `KeyError`.
- **Mô hình trực quan**: Danh bạ điện thoại: Nhìn vào tên người (`Key`), tra cứu được ngay số điện thoại (`Value`) với tốc độ chớp mắt $O(1)$. Khóa phải là duy nhất, giá trị có thể trùng nhau.
- **Ví dụ mã nguồn & Output**:
  ```python
  hoc_sinh = {"ten": "Minh", "tuoi": 15, "lop": "10A1"}
  # Lay diem so an toan, neu chua co thi tra ve 0
  diem = hoc_sinh.get("diem_toan", 0)
  print(f"Hoc vien {hoc_sinh['ten']} - Diem: {diem}")
  ```
  *Expected Output*: `Hoc vien Minh - Diem: 0`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Dùng khóa không cố định (như List) làm Key dẫn tới `TypeError: unhashable type: 'list'`.
  - *Khắc phục*: Khóa của từ điển bắt buộc phải là kiểu bất biến (Immutable) như chuỗi, số hoặc tuple.
- **Thực hành có dẫn dắt**: Tạo từ điển lưu từ điển Anh - Việt cho 5 từ vựng công nghệ và viết chức năng tra cứu.
- **Bài tập độc lập**:
  - Bài 1 (`ex-06-01`): Quản lý kho hàng sản phẩm (tên sản phẩm, số lượng tồn kho). *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Đếm tần suất xuất hiện của từng từ trong một đoạn văn ngắn bằng từ điển.
- **Tóm tắt & Bài tiếp theo**: Từ điển giúp lưu trữ thực thể có ngữ nghĩa rõ ràng. Tiếp theo ta sẽ học cách duyệt qua từ điển và kỹ thuật lồng ghép dữ liệu phức tạp.

#### Bài 06.2: Duyệt từ điển & Kỹ thuật lồng ghép dữ liệu nâng cao (Nesting)
- **Slug**: `duyet-tu-dien-va-ky-thuat-long-ghep-nesting`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `tu-dien-co-ban-va-phuong-thuc-get`.
- **Mục tiêu học tập**:
  1. Duyệt qua toàn bộ từ điển bằng `items()`, `keys()`, `values()`.
  2. Kỹ thuật lồng ghép (*Nesting*): Danh sách chứa các từ điển (Danh sách người dùng hệ thống).
  3. Từ điển chứa danh sách (Một người sở hữu danh sách nhiều sở thích).
  4. Từ điển chứa từ điển con (Hồ sơ nhân viên chứa thông tin liên lạc và địa chỉ).
- **Mô hình trực quan**: Tủ hồ sơ nhiều ngăn: Ngăn kéo lớn là một danh sách; bên trong chứa nhiều bìa hồ sơ (`Dictionary`); trong mỗi bìa lại có danh sách điểm số và bìa hồ sơ con về gia đình.
- **Ví dụ mã nguồn & Output**:
  ```python
  nguoi_dung = {
      "user1": {"ten": "Hoa", "ky_nang": ["Python", "SQL"]},
      "user2": {"ten": "Tuan", "ky_nang": ["Git", "Linux"]}
  }
  for uid, info in nguoi_dung.items():
      print(f"{info['ten']} co ky nang: {', '.join(info['ky_nang'])}")
  ```
  *Expected Output*:
  ```
  Hoa co ky nang: Python, SQL
  Tuan co ky nang: Git, Linux
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Lồng quá nhiều tầng (4-5 tầng) khiến câu lệnh truy xuất dài dòng `data['a']['b'][0]['c']` rất khó đọc và dễ lỗi.
  - *Khắc phục*: Tách các biến trung gian hoặc sử dụng lớp đối tượng (OOP) khi cấu trúc dữ liệu trở nên quá phức tạp.
- **Thực hành có dẫn dắt**: Quản lý một danh sách gồm 3 chiếc bánh pizza, mỗi chiếc có kích thước và danh sách topping riêng.
- **Bài tập độc lập**:
  - Bài 1 (`ex-06-02`): Lọc ra danh sách những nhân viên có kỹ năng `"Python"`. *(Độ khó: Medium - 15 điểm)*.
- **Thử thách Mini**: Viết hàm làm phẳng (Flatten) một từ điển 2 tầng thành từ điển 1 tầng với khóa ghép dạng `"cha_con"`.
- **Tóm tắt & Bài tiếp theo**: Kỹ thuật Nesting là nền móng để làm việc với dữ liệu JSON sau này. Tiếp theo ta sẽ tìm hiểu về Tập hợp (Sets).

#### Bài 06.3: Tập hợp duy nhất (Sets) & Các phép toán tập hợp đại số
- **Slug**: `tap-hop-sets-va-phep-toan-dai-so`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `duyet-tu-dien-va-ky-thuat-long-ghep-nesting`.
- **Mục tiêu học tập**:
  1. Hiểu bản chất của `set`: Tập hợp các phần tử **không trùng lặp** và **không có thứ tự**.
  2. Loại bỏ các phần tử trùng lặp trong một danh sách chỉ bằng hàm `list(set(my_list))`.
  3. Thực hiện các phép toán tập hợp: Hợp (`union` / `|`), Giao (`intersection` / `&`), Hiệu (`difference` / `-`), và Hiệu đối xứng (`^`).
- **Mô hình trực quan**: Sơ đồ Venn hai hình tròn lồng nhau: Phần giao nhau là sở thích chung của hai bạn, phần hợp là toàn bộ sở thích của cả hai nhóm.
- **Ví dụ mã nguồn & Output**:
  ```python
  lop_toan = {"An", "Binh", "Chau"}
  lop_ly = {"Binh", "Dung", "Chau"}
  hoc_ca_hai_mon = lop_toan & lop_ly # Giao
  chi_hoc_toan = lop_toan - lop_ly   # Hieu
  print("Hoc ca hai mon:", hoc_ca_hai_mon)
  print("Chi hoc toan:", chi_hoc_toan)
  ```
  *Expected Output*:
  ```
  Hoc ca hai mon: {'Binh', 'Chau'}
  Chi hoc toan: {'An'}
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Tạo set rỗng bằng `s = {}` (Python sẽ hiểu nhầm là từ điển rỗng!).
  - *Khắc phục*: Luôn tạo set rỗng bằng hàm khởi tạo `s = set()`.
- **Thực hành có dẫn dắt**: Cho hai danh sách email đăng ký hội thảo; tìm ra danh sách email duy nhất không bị gửi thư hai lần.
- **Bài tập độc lập**:
  - Bài 1 (`ex-06-03`): Tìm các số xuất hiện ở cả hai danh sách đầu vào. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Kiểm tra xem một chuỗi có phải là Panagram (chứa đầy đủ 26 chữ cái tiếng Anh) hay không bằng `set`.
- **Tóm tắt & Bài tiếp theo**: Bạn đã hoàn thành Chương 06! Sang Chương 07, chúng ta sẽ học cách nhận dữ liệu liên tục và điều khiển luồng lặp với Vòng lặp While và Cờ hiệu.

---

### CHƯƠNG 07: VÒNG LẶP WHILE & BIẾN CỜ HIỆU (USER INPUT & WHILE LOOPS)
- **Mã định danh**: `topic-07-while-loops-and-flags`
- **Cấp độ**: `Intermediate`
- **Màu đại diện**: `sky` (`#C7E3FF`)
- **Tóm tắt**: Vòng lặp `while`, điều kiện dừng, kỹ thuật sử dụng cờ hiệu (*Flag variable*), thoát vòng lặp với `break`, bỏ qua bước lặp với `continue`, phòng chống vòng lặp vô tận, và kỹ thuật dùng `while` di chuyển phần tử giữa các danh sách hoặc loại bỏ phần tử lặp.
- **Nguồn đối chiếu**: PCC 3E Chapter 7 + W3Schools (While Loops).

#### Bài 07.1: Vòng lặp While & Phòng chống vòng lặp vô tận
- **Slug**: `vong-lap-while-va-dieu-kien-dung`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `tap-hop-sets-va-phep-toan-dai-so`.
- **Mục tiêu học tập**:
  1. Hiểu nguyên lý: `while` lặp lại khối mã chừng nào biểu thức điều kiện còn mang giá trị `True`.
  2. Luôn có bước cập nhật biến đếm (Increment) để tiến dần tới điều kiện dừng.
  3. Nhận biết và xử lý tình trạng vòng lặp vô tận (Infinite Loop) gây treo chương trình.
- **Mô hình trực quan**: Đồng hồ đếm ngược bom nổ: Cứ mỗi giây đếm lùi `count -= 1`; khi `count == 0` chuông reo và vòng lặp dừng ngay lập tức.
- **Ví dụ mã nguồn & Output**:
  ```python
  dem = 3
  while dem > 0:
      print(f"Dem nguoc: {dem}")
      dem -= 1
  print("Phat hoa!")
  ```
  *Expected Output*:
  ```
  Dem nguoc: 3
  Dem nguoc: 2
  Dem nguoc: 1
  Phat hoa!
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Quên dòng `dem -= 1`, khiến `dem` mãi mãi bằng 3, dẫn tới vòng lặp chạy mãi mãi nuốt sạch CPU.
  - *Khắc phục*: Luôn kiểm tra kỹ biến điều kiện có được thay đổi ở cuối mỗi vòng lặp hay không trước khi bấm Run.
- **Thực hành có dẫn dắt**: Viết chương trình in ra dãy số lũy thừa của 2 nhỏ hơn 1000 ($1, 2, 4, 8, 16...$).
- **Bài tập độc lập**:
  - Bài 1 (`ex-07-01`): Đếm số chữ số của một số nguyên dương bằng vòng lặp while chia nguyên cho 10. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết trò chơi đoán số may mắn từ 1 đến 100: Người chơi đoán liên tục cho đến khi đúng, máy gợi ý "Lớn hơn" hoặc "Nhỏ hơn".
- **Tóm tắt & Bài tiếp theo**: Vòng lặp while kiểm soát số lần lặp chưa biết trước. Tiếp theo ta sẽ học kỹ thuật biến cờ hiệu (Flag) và các lệnh `break`, `continue`.

#### Bài 07.2: Kỹ thuật cờ hiệu (Flag Pattern) & Lệnh break/continue
- **Slug**: `ky-thuat-co-hieu-flag-va-break-continue`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `vong-lap-while-va-dieu-kien-dung`.
- **Mục tiêu học tập**:
  1. Sử dụng biến Boolean làm cờ hiệu (*Flag*) để quản lý trạng thái trò chơi hoặc chương trình nhiều điều kiện dừng phức tạp.
  2. Dùng lệnh `break` để thoát ngay lập tức khỏi vòng lặp khi gặp tình huống khẩn cấp.
  3. Dùng lệnh `continue` để bỏ qua các câu lệnh còn lại trong vòng lặp hiện tại và nhảy sang lần lặp kế tiếp.
- **Mô hình trực quan**: Trọng tài thổi còi: Trò chơi tiếp tục chừng nào lá cờ `game_active = True`. Khi trọng tài giơ cờ báo lỗi (`game_active = False`), toàn bộ vận động viên dừng thi đấu.
- **Ví dụ mã nguồn & Output**:
  ```python
  prompt = "Nhap mon an (hoac 'thoat' de ket thuc): "
  dang_chay = True
  while dang_chay:
      mon = input(prompt)
      if mon == 'thoat':
          dang_chay = False
      elif mon == '':
          continue # Bo qua dong trong
      else:
          print(f"Da them mon {mon} vao hoa don.")
  ```
  *Expected Output*: Tiếp nhận món liên tục và dừng lại khi gõ chữ 'thoat'.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Lạm dụng quá nhiều lệnh `break` khiến luồng chương trình nhảy lung tung, khó kiểm soát điểm dừng.
  - *Khắc phục*: Ưu tiên sử dụng biến cờ hiệu rõ nghĩa để chương trình kết thúc một cách tự nhiên.
- **Thực hành có dẫn dắt**: Viết chương trình nhập điểm kiểm tra: chỉ nhận điểm từ 0 đến 10, nếu nhập ngoài khoảng thì dùng `continue` yêu cầu nhập lại.
- **Bài tập độc lập**:
  - Bài 1 (`ex-07-02`): Tính tổng các số người dùng nhập vào cho đến khi nhập số 0 thì dừng. *(Độ khó: Easy - 15 điểm)*.
- **Thử thách Mini**: Viết menu điều khiển bảng chọn gồm 4 chức năng: 1. Thêm mới, 2. Xem danh sách, 3. Xóa, 4. Thoát chương trình.
- **Tóm tắt & Bài tiếp theo**: Cờ hiệu là mẫu thiết kế (design pattern) kinh điển trong Game Loop. Tiếp theo ta sẽ học cách dùng while để xử lý danh sách và từ điển.

#### Bài 07.3: Xử lý Danh sách & Từ điển với While (Moving & Removing)
- **Slug**: `xu-ly-danh-sach-tu-dien-voi-while`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `ky-thuat-co-hieu-flag-va-break-continue`.
- **Mục tiêu học tập**:
  1. Di chuyển các phần tử từ danh sách này sang danh sách khác (Xử lý hàng đợi xác nhận tài khoản).
  2. Xóa sạch toàn bộ các phần tử có giá trị cụ thể trong danh sách bằng `while` (khác với `remove()` chỉ xóa phần tử đầu tiên tìm thấy).
  3. Thu thập dữ liệu từ bàn phím để xây dựng từ điển người dùng động.
- **Mô hình trực quan**: Hộp thư duyệt bài: Lấy từng lá thư trong hộp "Chờ duyệt" (`pop()`), kiểm tra tính hợp lệ rồi bỏ vào hộp "Đã phê duyệt" (`append()`) cho đến khi hộp chờ duyệt hoàn toàn trống.
- **Ví dụ mã nguồn & Output**:
  ```python
  cho_xac_nhan = ["user_a", "user_b", "user_c"]
  da_xac_nhan = []
  
  while cho_xac_nhan:
      user_hien_tai = cho_xac_nhan.pop()
      print(f"Dang kich hoat: {user_hien_tai}")
      da_xac_nhan.append(user_hien_tai)
      
  print("Hoan tat toan bo:", da_xac_nhan)
  ```
  *Expected Output*: Lần lượt kích hoạt và chuyển toàn bộ sang danh sách đã xác nhận.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Sửa đổi danh sách (thêm/xóa) ngay trong khi đang duyệt bằng vòng lặp `for item in my_list:`. Điều này khiến Python bị nhảy cóc phần tử!
  - *Khắc phục*: Khi cần thêm/xóa phần tử trong lúc lặp, bắt buộc phải dùng vòng lặp `while` hoặc lặp trên bản sao `my_list[:]`.
- **Thực hành có dẫn dắt**: Xóa toàn bộ từ tục tĩu hoặc từ cấm xuất hiện nhiều lần trong một đoạn văn bản.
- **Bài tập độc lập**:
  - Bài 1 (`ex-07-03`): Xóa sạch tất cả các số 0 trong danh sách dữ liệu cảm biến. *(Độ khó: Easy - 15 điểm)*.
- **Thử thách Mini**: Viết chương trình khảo sát địa điểm du lịch yêu thích: thu thập tên người và nơi muốn đến vào từ điển, sau đó in báo cáo tổng kết.
- **Tóm tắt & Bài tiếp theo**: Chúc mừng bạn đã hoàn thành Chương 07! Sang Chương 08, chúng ta sẽ bước vào giai đoạn trừu tượng hóa tư duy với Hàm trong Python (Functions).

---

### CHƯƠNG 08: HÀM TRONG PYTHON & MODULE HÓA (FUNCTIONS & MODULES)
- **Mã định danh**: `topic-08-functions-and-modules`
- **Cấp độ**: `Intermediate`
- **Màu đại diện**: `lavender` (`#DCCBFF`)
- **Tóm tắt**: Định nghĩa hàm `def`, tham số vị trí vs từ khóa, giá trị mặc định, giá trị trả về `return`, bảo vệ danh sách chống đột biến, đối số biến thiên vô định `*args` và `**kwargs`, hàm ẩn danh `lambda`, tư duy đệ quy, và kỹ thuật tách module độc lập.
- **Nguồn đối chiếu**: PCC 3E Chapter 8 + W3Schools (Functions, Lambda, Scope, Modules).

#### Bài 08.1: Định nghĩa hàm với def & Giá trị trả về (return)
- **Slug**: `dinh-nghia-ham-def-va-gia-tri-tra-ve`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `xu-ly-danh-sach-tu-dien-voi-while`.
- **Mục tiêu học tập**:
  1. Hiểu nguyên lý DRY (*Don't Repeat Yourself*): Gom các đoạn code lặp lại thành một hàm có tên gọi.
  2. Phân biệt tham số hình thức (Parameter) và đối số thực tế (Argument).
  3. Sử dụng từ khóa `return` để gửi kết quả tính toán về nơi gọi hàm (khác với việc chỉ `print` ra màn hình).
- **Mô hình trực quan**: Máy xay sinh tố: Đưa vào quả xoài và đường (Arguments); máy thực hiện chu trình xay (Function body); cuối cùng rót ra cốc sinh tố thơm ngon (`return`). Nơi gọi có thể uống cốc sinh tố đó hoặc cất vào tủ lạnh (gán vào biến).
- **Ví dụ mã nguồn & Output**:
  ```python
  def tinh_dien_tich_hcn(dai, rong):
      """Ham tinh dien tich hinh chu nhat."""
      return dai * rong

  ket_qua = tinh_dien_tich_hcn(10, 5)
  print(f"Dien tich: {ket_qua} m2")
  ```
  *Expected Output*: `Dien tich: 50 m2`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Quên lệnh `return` khiến hàm mặc định trả về `None`. Khi lấy kết quả tính tiếp thì báo lỗi `TypeError: unsupported operand type for NoneType`.
  - *Khắc phục*: Luôn kiểm tra hàm có trả về dữ liệu hay không bằng lệnh `return`.
- **Thực hành có dẫn dắt**: Viết hàm kiểm tra một số có phải số nguyên tố hay không (trả về `True`/`False`).
- **Bài tập độc lập**:
  - Bài 1 (`ex-08-01`): Viết hàm chuyển đổi nhiệt độ từ độ C sang độ F. *(Độ khó: Very Easy - 10 điểm)*.
  - Bài 2 (`ex-08-02`): Viết hàm định dạng họ tên chuẩn hóa. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết hàm giải phương trình bậc hai $ax^2 + bx + c = 0$ trả về nghiệm dưới dạng tuple.
- **Tóm tắt & Bài tiếp theo**: Hàm giúp mã nguồn module hóa và tái sử dụng. Tiếp theo ta sẽ học cách truyền tham số nâng cao và xử lý đối số biến thiên.

#### Bài 08.2: Tham số nâng cao (*args, **kwargs) & Chống đột biến danh sách
- **Slug**: `tham-so-nang-cao-args-kwargs-va-mutability`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `dinh-nghia-ham-def-va-gia-tri-tra-ve`.
- **Mục tiêu học tập**:
  1. Sử dụng tham số có giá trị mặc định (Default Parameters).
  2. Tiếp nhận số lượng đối số vị trí tùy biến với `*args` (được đóng gói thành một Tuple).
  3. Tiếp nhận số lượng đối số từ khóa tùy biến với `**kwargs` (được đóng gói thành một Dictionary).
  4. Hiểu tính chất đột biến dữ liệu: Truyền danh sách vào hàm có thể làm thay đổi danh sách gốc; biết cách truyền bản sao `my_func(my_list[:])` để bảo vệ dữ liệu.
- **Mô hình trực quan**: Chiếc túi hút chân không (`*args` gom mọi đồ vật lẻ tẻ vào một bọc) và Hộp quà dán nhãn (`**kwargs` gom mọi thông tin có tên thuộc tính vào từ điển).
- **Ví dụ mã nguồn & Output**:
  ```python
  def tao_ho_so_hoc_vien(ten, lop="10A", *so_thich, **thong_tin_them):
      ho_so = {"ten": ten, "lop": lop, "so_thich": so_thich}
      for k, v in thong_tin_them.items():
          ho_so[k] = v
      return ho_so

  hs = tao_ho_so_hoc_vien("Nam", "11B", "Bong da", "Code", diem=9.5, que="Ha Noi")
  print(hs)
  ```
  *Expected Output*: In ra hồ sơ tổng hợp chứa cả tuple sở thích và các trường thông tin bổ sung.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Đặt tham số mặc định đứng trước tham số không mặc định: `def f(a=1, b):` gây lỗi cú pháp `SyntaxError: non-default argument follows default argument`.
  - *Khắc phục*: Luôn xếp tham số bắt buộc lên trước, tham số mặc định ở giữa, sau đó mới đến `*args` và cuối cùng là `**kwargs`.
- **Thực hành có dẫn dắt**: Viết hàm tính tổng của một số lượng số bất kỳ truyền vào: `tinh_tong(1, 2, 3, 4, 5)`.
- **Bài tập độc lập**:
  - Bài 1 (`ex-08-03`): Xây dựng hàm nhận danh sách sản phẩm và giảm giá 10% trên bản sao độc lập. *(Độ khó: Medium - 15 điểm)*.
- **Thử thách Mini**: Viết hàm `make_pizza(size, *toppings)` in ra tóm tắt chiếc pizza chuẩn bị làm với danh sách nguyên liệu tùy biến.
- **Tóm tắt & Bài tiếp theo**: `*args` và `**kwargs` giúp hàm cực kỳ linh hoạt. Tiếp theo ta sẽ học về Phạm vi biến (Scope), Hàm ẩn danh (Lambda) và Đệ quy.

#### Bài 08.3: Phạm vi biến (Scope LEGB), Hàm Lambda & Tư duy Đệ quy
- **Slug**: `pham-vi-bien-lambda-va-de-quy`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `tham-so-nang-cao-args-kwargs-va-mutability`.
- **Mục tiêu học tập**:
  1. Nắm chắc quy tắc tìm kiếm biến **LEGB** (Local $\rightarrow$ Enclosing $\rightarrow$ Global $\rightarrow$ Built-in).
  2. Viết hàm ẩn danh ngắn gọn trong 1 dòng với `lambda` kết hợp các hàm `map()`, `filter()`, `sorted()`.
  3. Hiểu bản chất Đệ quy (Recursion): Hàm gọi lại chính nó, điều kiện dừng (Base case) và bước đệ quy (Recursive step).
- **Mô hình trực quan**: Búp bê Nga Matryoshka: Mỗi con búp bê mở ra lại chứa một con búp bê nhỏ hơn bên trong (bước đệ quy); cho đến khi gặp con búp bê nhỏ nhất nguyên khối không thể mở được nữa (điều kiện dừng - Base case), chuỗi mở sẽ kết thúc và gom kết quả lại.
- **Ví dụ mã nguồn & Output**:
  ```python
  # Lambda sap xep theo diem so giam dan
  sinh_vien = [("An", 8.0), ("Binh", 9.5), ("Chau", 7.0)]
  sinh_vien.sort(key=lambda sv: sv[1], reverse=True)
  print("Xep hang:", sinh_vien)

  # De quy tinh giai thua N!
  def giai_thua(n):
      if n <= 1: return 1 # Base case
      return n * giai_thua(n - 1)
  print("5! =", giai_thua(5))
  ```
  *Expected Output*:
  ```
  Xep hang: [('Binh', 9.5), ('An', 8.0), ('Chau', 7.0)]
  5! = 120
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Viết hàm đệ quy nhưng quên điều kiện dừng, dẫn tới lỗi sập ngăn xếp `RecursionError: maximum recursion depth exceeded`.
  - *Khắc phục*: Luôn luôn viết điều kiện dừng `if base_case: return value` ngay dòng đầu tiên của hàm đệ quy.
- **Thực hành có dẫn dắt**: Dùng `lambda` lọc ra các số dương từ một danh sách chứa cả số âm và số dương.
- **Bài tập độc lập**:
  - Bài 1 (`ex-08-04`): Tính số hạng thứ $N$ của dãy số Fibonacci bằng đệ quy có tối ưu hóa. *(Độ khó: Medium - 15 điểm)*.
- **Thử thách Mini**: Viết hàm đệ quy tính tổng các chữ số của một số nguyên lớn (ví dụ: `1234` $\rightarrow$ $1+2+3+4=10$).
- **Tóm tắt & Bài tiếp theo**: Lambda và Đệ quy nâng tầm tư duy giải thuật. Tiếp theo ta sẽ học cách tổ chức mã nguồn thành các Module độc lập.

#### Bài 08.4: Tổ chức chương trình vào Module & Thư viện chuẩn Python
- **Slug**: `to-chuc-module-va-thu-vien-chuan`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `pham-vi-bien-lambda-va-de-quy`.
- **Mục tiêu học tập**:
  1. Hiểu module là một tệp `.py` chứa các hàm và lớp có thể tái sử dụng.
  2. Các cú pháp import: `import module_name`, `from module import func`, `import module as alias`.
  3. Sử dụng các module hữu ích trong thư viện chuẩn: `math` (tính căn bậc hai, hàm lượng giác), `random` (chọn ngẫu nhiên), `datetime` (xử lý thời gian thực).
- **Mô hình trực quan**: Hộp đồ nghề sửa xe: Thay vì mang cả nhà kho, bạn chỉ cần mở hộp đồ nghề (`import math`) và lấy ra chiếc cờ-lê phù hợp (`math.sqrt`) để vặn ốc.
- **Ví dụ mã nguồn & Output**:
  ```python
  import math
  import random
  
  can_bac_hai = math.isqrt(16)
  quan_bai = random.choice(["At co", "K bich", "Q tep", "J ro"])
  print(f"Can bac hai cua 16: {can_bac_hai}")
  print(f"La bai ngau nhien rut duoc: {quan_bai}")
  ```
  *Expected Output*: In ra số 4 và một lá bài ngẫu nhiên.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Đặt tên tệp tin của mình trùng với tên thư viện chuẩn: ví dụ đặt tên file là `math.py` hoặc `random.py`. Khi viết `import math` Python sẽ tự import file của bạn và báo lỗi `AttributeError`!
  - *Khắc phục*: Tuyệt đối không đặt tên file trùng với tên thư viện hệ thống.
- **Thực hành có dẫn dắt**: Tạo một file giả lập module toán học riêng và gọi các hàm tính diện tích hình tròn, tam giác.
- **Bài tập độc lập**:
  - Bài 1 (`ex-08-05`): Viết hàm mô phỏng tung xúc xắc 6 mặt 100 lần và đếm số lần ra mặt 6. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết chương trình tính chính xác số ngày bạn đã sống trên đời dựa vào module `datetime`.
- **Tóm tắt & Bài tiếp theo**: Hoàn thành Chương 08! Bạn đã làm chủ hoàn toàn về Hàm và Module. Sang Chương 09, chúng ta sẽ bước lên một nấc thang kiến trúc mới: Lập trình hướng đối tượng (OOP).

---

### CHƯƠNG 09: LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG (CLASSES & OOP)
- **Mã định danh**: `topic-09-classes-and-oop`
- **Cấp độ**: `Intermediate`
- **Màu đại diện**: `mint` (`#BFE8D0`)
- **Tóm tắt**: Lớp (Class) và Đối tượng (Object), hàm khởi tạo `__init__`, biến `self`, thuộc tính và phương thức, tính kế thừa (*Inheritance*), hàm `super()`, kỹ thuật Composition (đối tượng lồng đối tượng), và các phương thức đặc biệt Dunder Methods (`__str__`, `__len__`, `__repr__`).
- **Nguồn đối chiếu**: PCC 3E Chapter 9 + W3Schools (Classes/Objects, Inheritance, Polymorphism).

#### Bài 09.1: Khái niệm Lớp (Class), Đối tượng (Object) & Phương thức __init__
- **Slug**: `lop-va-doi-tuong-phuong-thuc-init`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `to-chuc-module-va-thu-vien-chuan`.
- **Mục tiêu học tập**:
  1. Hiểu Lớp là bản thiết kế (Blueprint), Đối tượng là thực thể sống cụ thể được tạo ra từ bản thiết kế đó.
  2. Nắm chắc ý nghĩa của phương thức khởi tạo `__init__()` và tham số đại diện bản thân `self`.
  3. Khai báo thuộc tính và xây dựng các phương thức hành vi cho đối tượng.
- **Mô hình trực quan**: Bản vẽ thiết kế ngôi nhà vs Ngôi nhà thực tế: Bản vẽ thiết kế (`Class`) chỉ có 1 bản duy nhất trên giấy; từ bản vẽ đó các bác thợ xây có thể xây ra 100 ngôi nhà thực tế (`Instances`), mỗi ngôi nhà có thể sơn màu khác nhau và có chủ nhân khác nhau.
- **Ví dụ mã nguồn & Output**:
  ```python
  class Dog:
      """Mo hinh hoa loai cho cung."""
      def __init__(self, name, age):
          self.name = name # Thuoc tinh
          self.age = age
          
      def sit(self):
          """Phuong thuc hanh dong."""
          print(f"{self.name} dang ngoi xuong ngoan ngoan.")

  my_dog = Dog("Milu", 3)
  print(f"Chu cho cua toi ten la {my_dog.name}, {my_dog.age} tuoi.")
  my_dog.sit()
  ```
  *Expected Output*:
  ```
  Chu cho cua toi ten la Milu, 3 tuoi.
  Milu dang ngoi xuong ngoan ngoan.
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Quên tham số `self` ở dòng định nghĩa phương thức: `def sit():` khiến khi gọi `my_dog.sit()` Python báo lỗi `TypeError: sit() takes 0 positional arguments but 1 was given`.
  - *Khắc phục*: Mọi phương thức thông thường của một lớp bắt buộc phải có `self` là tham số đầu tiên.
- **Thực hành có dẫn dắt**: Xây dựng lớp `Student` quản lý mã sinh viên, họ tên và điểm trung bình, có phương thức in học bạ.
- **Bài tập độc lập**:
  - Bài 1 (`ex-09-01`): Xây dựng lớp `Rectangle` tính chu vi và diện tích hình chữ nhật. *(Độ khó: Easy - 10 điểm)*.
  - Bài 2 (`ex-09-02`): Xây dựng lớp `BankAccount` với các phương thức nạp tiền, rút tiền có kiểm tra số dư. *(Độ khó: Easy - 15 điểm)*.
- **Thử thách Mini**: Xây dựng lớp `Hero` trong game nhập vai: có lượng máu HP, sức tấn công và phương thức chiến đấu với quái vật.
- **Tóm tắt & Bài tiếp theo**: Lớp giúp đóng gói dữ liệu và hành vi thành một khối thống nhất. Tiếp theo ta sẽ học cách mở rộng lớp thông qua Kế thừa (Inheritance).

#### Bài 09.2: Kế thừa (Inheritance), super() & Ghi đè phương thức (Override)
- **Slug**: `ke-thua-inheritance-super-va-override`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `lop-va-doi-tuong-phuong-thuc-init`.
- **Mục tiêu học tập**:
  1. Hiểu nguyên lý Kế thừa: Lớp con (Child Class) kế thừa toàn bộ thuộc tính và phương thức của Lớp cha (Parent Class).
  2. Sử dụng hàm `super().__init__()` để gọi phương thức khởi tạo của lớp cha.
  3. Mở rộng thuộc tính mới cho lớp con và kỹ thuật ghi đè phương thức (*Method Overriding*) khi hành vi của lớp con khác lớp cha.
- **Mô hình trực quan**: Cây gia phả: Chiếc xe hơi nói chung (`Car`) có động cơ và bánh xe; Chiếc xe điện (`ElectricCar`) kế thừa toàn bộ khung gầm xe hơi nhưng thay động cơ xăng bằng bộ pin điện dung lượng lớn.
- **Ví dụ mã nguồn & Output**:
  ```python
  class Car:
      def __init__(self, make, model):
          self.make = make
          self.model = model
      def get_descriptive_name(self):
          return f"{self.make} {self.model}"

  class ElectricCar(Car):
      def __init__(self, make, model, battery_size=75):
          super().__init__(make, model) # Goi ham khoi tao lop cha
          self.battery_size = battery_size # Thuoc tinh rieng
      def describe_battery(self):
          print(f"Chiec xe nay co bo pin dung luong {self.battery_size} kWh.")

  tesla = ElectricCar("Tesla", "Model 3")
  print(tesla.get_descriptive_name())
  tesla.describe_battery()
  ```
  *Expected Output*:
  ```
  Tesla Model 3
  Chiec xe nay co bo pin dung luong 75 kWh.
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Quên gọi `super().__init__()` trong lớp con khiến các thuộc tính của lớp cha không được khởi tạo, dẫn đến lỗi `AttributeError`.
  - *Khắc phục*: Luôn gọi `super().__init__()` ngay dòng đầu tiên của `__init__` lớp con.
- **Thực hành có dẫn dắt**: Xây dựng lớp cha `Employee` và lớp con `Manager` có thêm thuộc tính danh sách nhân viên cấp dưới.
- **Bài tập độc lập**:
  - Bài 1 (`ex-09-03`): Xây dựng hệ thống lớp đa hình tính diện tích các loại hình học (`Shape` $\rightarrow$ `Circle`, `Square`). *(Độ khó: Medium - 15 điểm)*.
- **Thử thách Mini**: Xây dựng lớp `Admin` kế thừa từ `User`, có thêm thuộc tính danh sách đặc quyền và phương thức `show_privileges()`.
- **Tóm tắt & Bài tiếp theo**: Kế thừa giúp tái sử dụng mã nguồn đỉnh cao. Tiếp theo ta sẽ học kỹ thuật Composition và các phương thức đặc biệt Dunder Methods.

#### Bài 09.3: Kỹ thuật Composition & Phương thức đặc biệt (Dunder Methods)
- **Slug**: `composition-va-dunder-methods`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `ke-thua-inheritance-super-va-override`.
- **Mục tiêu học tập**:
  1. Hiểu nguyên lý Composition (*Has-A relationship*): Tách một nhóm thuộc tính/hành vi phức tạp thành một lớp riêng và đưa thực thể đó làm thuộc tính của lớp khác (ví dụ: Xe điện *có một* Bộ pin `Battery`).
  2. Nắm chắc các phương thức đặc biệt Dunder (*Double Underscore*): `__str__()` (hiển thị chuỗi cho người dùng), `__repr__()` (hiển thị cho lập trình viên debug), `__len__()` (tính độ dài khi gọi `len(obj)`), và `__add__()` (nạp chồng toán tử cộng `+`).
- **Mô hình trực quan**: Chiếc điện thoại thông minh: Thay vì cố nhồi nhét mọi thứ vào 1 con chip, chiếc điện thoại được cấu thành từ Module Camera, Module Màn hình và Module Pin độc lập kết hợp lại với nhau.
- **Ví dụ mã nguồn & Output**:
  ```python
  class Book:
      def __init__(self, title, author, pages):
          self.title = title
          self.author = author
          self.pages = pages
      def __str__(self):
          return f"'{self.title}' cua tac gia {self.author}"
      def __len__(self):
          return self.pages

  sach = Book("Dac Nhan Tam", "Dale Carnegie", 320)
  print(sach)           # Tu dong goi __str__
  print("So trang:", len(sach)) # Tu dong goi __len__
  ```
  *Expected Output*:
  ```
  'Dac Nhan Tam' cua tac gia Dale Carnegie
  So trang: 320
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Phương thức `__str__` không trả về chuỗi string mà dùng lệnh `print()` hoặc trả về số nguyên, gây lỗi `TypeError: __str__ returned non-string`.
  - *Khắc phục*: Phương thức `__str__` bắt buộc phải kết thúc bằng `return "chuoi_ky_tu"`.
- **Thực hành có dẫn dắt**: Tạo lớp `Battery` riêng biệt cho xe điện và tích hợp phương thức nâng cấp dung lượng pin.
- **Bài tập độc lập**:
  - Bài 1 (`ex-09-04`): Xây dựng lớp `Vector2D` nạp chồng toán tử cộng `__add__` để cộng 2 vector tọa độ. *(Độ khó: Medium - 15 điểm)*.
- **Thử thách Mini**: Xây dựng lớp `Playlist` chứa danh sách bài hát, hỗ trợ toán tử `len(playlist)` và in danh sách bài hát khi gọi `print(playlist)`.
- **Tóm tắt & Bài tiếp theo**: Chúc mừng bạn đã hoàn thành Chương 09! Bạn đã sẵn sàng mọi kiến thức OOP cần thiết cho Dự án Game Alien Invasion. Sang Chương 10, chúng ta sẽ học cách lưu trữ dữ liệu bền vững vào Tệp tin và làm việc với ngoại lệ.

---

### CHƯƠNG 10: TỆP TIN, DỮ LIỆU CẤU TRÚC & NGOẠI LỆ (FILES & EXCEPTIONS)
- **Mã định danh**: `topic-10-files-data-and-exceptions`
- **Cấp độ**: `Intermediate`
- **Màu đại diện**: `sky` (`#C7E3FF`)
- **Tóm tắt**: Thao tác tệp hiện đại với module `pathlib.Path` của Python 3.11+, cú pháp an toàn `with open()`, xử lý tệp dữ liệu JSON và CSV, phân tích chuỗi nâng cao với Regular Expressions (`re`), và kỹ thuật xử lý ngoại lệ thực chiến `try-except-else-finally`.
- **Nguồn đối chiếu**: PCC 3E Chapter 10 + W3Schools (File Handling, JSON, RegEx, Try...Except).

#### Bài 10.1: Đọc và Ghi tệp tin hiện đại với pathlib & with open()
- **Slug**: `thao-tac-tep-tin-pathlib-va-open`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `composition-va-dunder-methods`.
- **Mục tiêu học tập**:
  1. Thao tác tệp hướng đối tượng hiện đại bằng module `from pathlib import Path` (`read_text()`, `write_text()`).
  2. Sử dụng Context Manager `with open(filename, mode, encoding='utf-8')` để tự động đóng tệp khi xong việc.
  3. Đọc tệp theo từng dòng với `splitlines()` hoặc vòng lặp `for line in file:` để tiết kiệm bộ nhớ khi đọc tệp lớn.
- **Mô hình trực quan**: Chiếc két sắt tài liệu: `with open(...)` là người trợ lý tự động mở khóa két sắt; ngay khi bạn làm việc xong và bước ra khỏi phòng (hết khối thụt lề), két sắt tự động đóng sập và khóa chốt an toàn, không bao giờ bị rò rỉ tài nguyên.
- **Ví dụ mã nguồn & Output**:
  ```python
  from pathlib import Path
  
  duong_dan = Path("nhat_ky.txt")
  duong_dan.write_text("Hom nay toi bat dau hoc Python nang cao!\n", encoding="utf-8")
  noi_dung = duong_dan.read_text(encoding="utf-8")
  print("Noi dung tep:")
  print(noi_dung.strip())
  ```
  *Expected Output*:
  ```
  Noi dung tep:
  Hom nay toi bat dau hoc Python nang cao!
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Không chỉ định `encoding='utf-8'`, khiến khi đọc hoặc ghi tiếng Việt có dấu bị lỗi font mã hóa loằng ngoằng trên Windows.
  - *Khắc phục*: Luôn luôn truyền tham số `encoding='utf-8'` khi mở tệp văn bản.
- **Thực hành có dẫn dắt**: Đọc một tệp danh sách điểm số và tính điểm trung bình của cả lớp.
- **Bài tập độc lập**:
  - Bài 1 (`ex-10-01`): Ghi danh sách học sinh vào tệp và đọc ngược trở lại. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Đếm số lần xuất hiện của một từ khóa trong một tệp văn bản dài 1000 dòng.
- **Tóm tắt & Bài tiếp theo**: Tệp tin giúp lưu dữ liệu vĩnh viễn trên ổ cứng. Tiếp theo ta sẽ học cách xử lý các định dạng dữ liệu chuẩn quốc tế: JSON và CSV.

#### Bài 10.2: Xử lý dữ liệu cấu trúc (JSON, CSV) & Biểu thức chính quy (RegEx)
- **Slug**: `du-lieu-cau-truc-json-csv-va-regex`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `thao-tac-tep-tin-pathlib-va-open`.
- **Mục tiêu học tập**:
  1. Sử dụng module `json`: `dumps()` / `loads()` để mã hóa/giải mã đối tượng Python sang định dạng trao đổi web chuẩn JSON.
  2. Sử dụng module `csv`: `csv.reader` và `csv.writer` để đọc ghi dữ liệu dạng bảng tính.
  3. Làm quen với module `re` (Regular Expressions): Kiểm tra định dạng email, số điện thoại hoặc trích xuất mẫu ký tự phức tạp.
- **Mô hình trực quan**: Chiếc thùng hàng container chuẩn hóa quốc tế: Dữ liệu JSON và CSV là ngôn ngữ chung giữa mọi hệ thống phần mềm (Python, JavaScript, Mobile app, Database) đều có thể hiểu và bốc dỡ hàng hóa dễ dàng.
- **Ví dụ mã nguồn & Output**:
  ```python
  import json
  
  du_lieu_nguoi_dung = {"ten": "Linh", "cap_do": 5, "diem": 1250}
  chuoi_json = json.dumps(du_lieu_nguoi_dung, ensure_ascii=False)
  print("Chuoi JSON chuan trao doi:", chuoi_json)
  khoi_phuc = json.loads(chuoi_json)
  print("Khoi phuc thanh cong ten:", khoi_phuc["ten"])
  ```
  *Expected Output*:
  ```
  Chuoi JSON chuan trao doi: {"ten": "Linh", "cap_do": 5, "diem": 1250}
  Khoi phuc thanh cong ten: Linh
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Chuỗi JSON dùng dấu nháy đơn `'{"ten": "An"}'` (JSON chuẩn quốc tế bắt buộc các khóa và chuỗi phải bọc trong dấu nháy kép `"`).
  - *Khắc phục*: Luôn dùng nháy kép cho JSON hoặc dùng `json.dumps()` để tự động chuẩn hóa.
- **Thực hành có dẫn dắt**: Lưu trạng thái người chơi trong game (tên, vũ khí, máu) ra tệp `save_game.json` và tải lại khi khởi động game.
- **Bài tập độc lập**:
  - Bài 1 (`ex-10-02`): Đọc tệp CSV chứa danh sách điểm và xuất ra danh sách học sinh giỏi định dạng JSON. *(Độ khó: Medium - 15 điểm)*.
- **Thử thách Mini**: Dùng module `re` viết bộ lọc kiểm tra xem một chuỗi có phải là địa chỉ Gmail hợp lệ hay không.
- **Tóm tắt & Bài tiếp theo**: JSON và CSV là cầu nối trực tiếp đến Dự án 2 (Data Visualization). Tiếp theo ta sẽ học cách bảo vệ chương trình không bị sập bằng Xử lý ngoại lệ (Exceptions).

#### Bài 10.3: Xử lý ngoại lệ an toàn (try-except-else-finally) & raise
- **Slug**: `xu-ly-ngoai-le-try-except-else-finally`
- **Cấp độ**: `Intermediate` | **Tiên quyết**: `du-lieu-cau-truc-json-csv-va-regex`.
- **Mục tiêu học tập**:
  1. Hiểu ngoại lệ (Exception) là lỗi xảy ra trong thời gian chạy (Runtime) làm gián đoạn chương trình.
  2. Bắt lỗi chính xác với khối `try-except`: `FileNotFoundError`, `ZeroDivisionError`, `ValueError`, `KeyError`.
  3. Khối `else` (chạy khi không có lỗi) và khối `finally` (luôn luôn chạy dù có lỗi hay không).
  4. Chủ động ném ngoại lệ với từ khóa `raise` khi dữ liệu đầu vào vi phạm quy tắc nghiệp vụ.
- **Mô hình trực quan**: Túi khí ô tô: Khi xảy ra va chạm nguy hiểm (lỗi sập), túi khí `except` bung ra đỡ người lái xe an toàn, đưa xe vào lề đường thay vì gây tai nạn thảm khốc làm sập toàn bộ hệ thống.
- **Ví dụ mã nguồn & Output**:
  ```python
  def chia_tien(tong_tien, so_nguoi):
      try:
          if so_nguoi < 0:
              raise ValueError("So nguoi khong the am!")
          ket_qua = tong_tien / so_nguoi
      except ZeroDivisionError:
          print("Loi: So nguoi phai lon hon 0!")
      except ValueError as e:
          print(f"Loi nghiep vu: {e}")
      else:
          print(f"Moi nguoi can dong: {ket_qua} VND")
      finally:
          print("Giao dich hoan tat.")

  chia_tien(100_000, 0)
  ```
  *Expected Output*:
  ```
  Loi: So nguoi phai lon hon 0!
  Giao dich hoan tat.
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Bắt ngoại lệ chung chung `except:` mà không chỉ rõ tên lỗi, làm che giấu cả các lỗi gõ sai chính tả cú pháp.
  - *Khắc phục*: Luôn chỉ rõ tên ngoại lệ cụ thể muốn bắt: `except (FileNotFoundError, ValueError):`.
- **Thực hành có dẫn dắt**: Viết hàm đọc tệp an toàn: nếu tệp không tồn tại thì tự động tạo mới tệp với nội dung mặc định mà không báo lỗi.
- **Bài tập độc lập**:
  - Bài 1 (`ex-10-03`): Bắt lỗi nhập liệu tuổi người dùng với `try-except ValueError`. *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Viết chương trình máy tính bỏ túi xử lý đầy đủ các trường hợp chia cho 0, căn bậc hai số âm và nhập chữ cái.
- **Tóm tắt & Bài tiếp theo**: Xử lý ngoại lệ biến code của bạn thành phần mềm thương mại bền bỉ. Tiếp theo ta sẽ bước vào chương cuối cùng của Phần I: Tự động hóa kiểm thử với Pytest.

---

### CHƯƠNG 11: KIỂM THỬ MÃ NGUỒN VỚI PYTEST (TESTING YOUR CODE - TDD)
- **Mã định danh**: `topic-11-testing-with-pytest`
- **Cấp độ**: `Advanced`
- **Màu đại diện**: `peach` (`#FFCDBD`)
- **Tóm tắt**: Tầm quan trọng của Unit Testing, cài đặt `pytest`, viết hàm kiểm thử với câu lệnh khẳng định `assert`, xử lý khi test thất bại, kiểm thử hàm, kiểm thử lớp đối tượng, và sử dụng Fixtures (`@pytest.fixture`) để chuẩn bị môi trường test chuyên nghiệp.
- **Nguồn đối chiếu**: PCC 3E Chapter 11 (Điểm bổ sung mới hoàn toàn mà W3Schools không có).

#### Bài 11.1: Nhập môn Kiểm thử tự động (Unit Test) & Cú pháp assert
- **Slug**: `nhap-mon-kiem-thu-unit-test-va-assert`
- **Cấp độ**: `Advanced` | **Tiên quyết**: `xu-ly-ngoai-le-try-except-else-finally`.
- **Mục tiêu học tập**:
  1. Hiểu sự khác biệt giữa kiểm thử thủ công ("chạy bằng cơm") và kiểm thử tự động (viết code để kiểm tra code).
  2. Nắm chắc câu lệnh khẳng định `assert condition, "Thông báo lỗi"`: Nếu điều kiện đúng thì lướt qua trong im lặng; nếu sai thì ném ra `AssertionError`.
  3. Tư duy phát triển hướng kiểm thử Test-Driven Development (TDD): Viết test trước, viết code vừa đủ để test pass, rồi refactor.
- **Mô hình trực quan**: Thước đo kiểm chuẩn chất lượng trong nhà máy: Từng linh kiện chạy qua máy quét `assert`; nếu kích thước lệch chuẩn 1 milimet, còi báo động reo lên ngay lập tức để cách ly sản phẩm lỗi trước khi chuyển sang công đoạn sau.
- **Ví dụ mã nguồn & Output**:
  ```python
  def cong(a, b):
      return a + b

  # Ham kiem thu tu dong
  def test_cong():
      assert cong(2, 3) == 5, "Phep cong so nguyen duong bi sai!"
      assert cong(-1, 1) == 0, "Phep cong so am bi sai!"
      assert cong(0, 0) == 0, "Phep cong so khong bi sai!"
      print("Toan bo 3 ca kiem thu da vuot qua thanh cong!")

  test_cong()
  ```
  *Expected Output*: `Toan bo 3 ca kiem thu da vuot qua thanh cong!`.
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Viết hàm kiểm thử nhưng không có câu lệnh `assert`, khiến dù code nghiệp vụ trả về sai thì test vẫn âm thầm báo pass.
  - *Khắc phục*: Mọi hàm kiểm thử bắt buộc phải có ít nhất một câu lệnh `assert` kiểm tra giá trị trả về mong đợi.
- **Thực hành có dẫn dắt**: Viết hàm chuẩn hóa tên thành phố `format_city_country(city, country)` và viết bộ 3 câu lệnh assert kiểm tra các trường hợp.
- **Bài tập độc lập**:
  - Bài 1 (`ex-11-01`): Viết hàm kiểm tra số chẵn và bộ test case tự động bao phủ các ca biên (số 0, số âm). *(Độ khó: Easy - 10 điểm)*.
- **Thử thách Mini**: Áp dụng TDD: Viết test case kiểm tra hàm tính cước taxi trước, sau đó mới viết phần thân hàm sao cho vượt qua toàn bộ test.
- **Tóm tắt & Bài tiếp theo**: `assert` là nền móng của kiểm thử. Tiếp theo ta sẽ làm quen với framework kiểm thử tiêu chuẩn hàng đầu thế giới: `pytest`.

#### Bài 11.2: Framework Pytest & Kỹ thuật tổ chức tệp test
- **Slug**: `framework-pytest-va-to-chuc-kiem-thu`
- **Cấp độ**: `Advanced` | **Tiên quyết**: `nhap-mon-kiem-thu-unit-test-va-assert`.
- **Mục tiêu học tập**:
  1. Cài đặt và kích hoạt thư viện `pytest`.
  2. Quy ước đặt tên tệp và tên hàm kiểm thử trong pytest: Tệp bắt đầu bằng `test_*.py` và hàm kiểm thử bắt đầu bằng `def test_*()`.
  3. Đọc hiểu báo cáo kết quả của pytest: Dấu chấm xanh `.` (Pass), chữ `F` đỏ (Fail) kèm phân tích so sánh chi tiết giữa Actual và Expected.
- **Mô hình trực quan**: Bảng đèn tín hiệu kiểm định: Lệnh `pytest` quét toàn bộ thư mục dự án; 50 hàm kiểm thử tự động chạy trong 0.05 giây; 50 bóng đèn xanh bật sáng báo hiệu hệ thống an toàn sẵn sàng bàn giao khách hàng.
- **Ví dụ mã nguồn & Output**:
  ```python
  # File: name_function.py
  def get_formatted_name(first, last, middle=''):
      if middle:
          return f"{first} {middle} {last}".title()
      return f"{first} {last}".title()

  # File: test_name_function.py
  def test_first_last_name():
      name = get_formatted_name("nguyen", "an")
      assert name == "Nguyen An"

  def test_first_middle_last_name():
      name = get_formatted_name("nguyen", "an", "van")
      assert name == "Nguyen Van An"
  ```
  *Báo cáo pytest*:
  ```
  test_name_function.py ..                                       [100%]
  ============================== 2 passed in 0.02s ===============================
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Đặt tên hàm kiểm thử không có tiền tố `test_` (ví dụ `def check_name():`) khiến pytest bỏ qua không chạy hàm đó.
  - *Khắc phục*: Luôn đặt tên hàm kiểm thử bắt đầu bằng `test_`.
- **Thực hành có dẫn dắt**: Tạo một hàm tính tiền tip nhà hàng và viết tệp `test_tip.py` kiểm tra các mức 10%, 15%, 20%.
- **Bài tập độc lập**:
  - Bài 1 (`ex-11-02`): Viết bộ kiểm thử pytest cho hàm xác thực mật khẩu an toàn. *(Độ khó: Medium - 15 điểm)*.
- **Thử thách Mini**: Sửa lỗi một hàm nghiệp vụ bị hỏng bằng cách đọc báo cáo Traceback chi tiết do pytest cung cấp.
- **Tóm tắt & Bài tiếp theo**: Pytest giúp tự động hóa việc kiểm tra. Tiếp theo ta sẽ học cách kiểm thử Lớp đối tượng và sử dụng Fixtures.

#### Bài 11.3: Kiểm thử Lớp đối tượng (Testing a Class) & Pytest Fixtures
- **Slug**: `kiem-thu-lop-va-pytest-fixtures`
- **Cấp độ**: `Advanced` | **Tiên quyết**: `framework-pytest-va-to-chuc-kiem-thu`.
- **Mục tiêu học tập**:
  1. Kiểm thử hành vi của đối tượng: Khởi tạo đối tượng, gọi phương thức và kiểm tra thuộc tính sau thay đổi.
  2. Hiểu sự trùng lặp khi mỗi hàm test đều phải tự khởi tạo lại một đối tượng mẫu.
  3. Sử dụng decorator `@pytest.fixture` để chuẩn bị dữ liệu kiểm thử tái sử dụng cho nhiều hàm test.
- **Mô hình trực quan**: Phòng thí nghiệm chuẩn bị sẵn: Trước mỗi bài thí nghiệm, kỹ thuật viên `@pytest.fixture` mang vào một ống nghiệm sạch tinh khiết chứa sẵn dung dịch mẫu; bạn chỉ việc tiến hành thí nghiệm mà không cần rửa ống nghiệm lại từ đầu.
- **Ví dụ mã nguồn & Output**:
  ```python
  import pytest

  class AnonymousSurvey:
      def __init__(self, question):
          self.question = question
          self.responses = []
      def store_response(self, new_response):
          self.responses.append(new_response)

  @pytest.fixture
  def survey_mau():
      """Tao mot khao sat mau dung chung cho toan bo test."""
      return AnonymousSurvey("Ban thich ngon ngu lap trinh nao nhat?")

  def test_store_single_response(survey_mau):
      survey_mau.store_response("Python")
      assert "Python" in survey_mau.responses

  def test_store_three_responses(survey_mau):
      for r in ["Python", "Rust", "Go"]:
          survey_mau.store_response(r)
      assert len(survey_mau.responses) == 3
  ```
  *Báo cáo pytest*:
  ```
  test_survey.py ..                                              [100%]
  ============================== 2 passed in 0.01s ===============================
  ```
- **Lỗi thường gặp & Cách khắc phục**:
  - *Lỗi*: Thay đổi dữ liệu trong một fixture khiến hàm test sau bị phụ thuộc vào dữ liệu của hàm test trước.
  - *Khắc phục*: Pytest mặc định tạo một bản sao fixture mới tinh cho mỗi hàm test chạy độc lập, đảm bảo tính cô lập tuyệt đối.
- **Thực hành có dẫn dắt**: Viết fixture cho một tài khoản ngân hàng có sẵn 1.000.000 VND và kiểm thử các phương thức nạp/rút.
- **Bài tập độc lập**:
  - Bài 1 (`ex-11-03`): Viết bộ kiểm thử hoàn chỉnh cho lớp `ShoppingCart` (Giỏ hàng siêu thị) sử dụng fixture. *(Độ khó: Medium - 20 điểm)*.
- **Thử thách Mini**: Viết fixture giả lập một cơ sở dữ liệu học sinh trong bộ nhớ và kiểm thử chức năng tìm kiếm học sinh theo tên.
- **Tóm tắt & Chuyển giao Phần II**: XUẤT SẮC! Bạn đã chính thức tốt nghiệp **Phần I: Nền tảng Python**! Bạn đã sở hữu trọn vẹn tư duy lập trình cấu trúc, hướng đối tượng, xử lý dữ liệu và kiểm thử tự động. Cánh cửa **Phần II: Học tập qua Dự án thực chiến** đã chính thức mở ra đón chào bạn!

---

## 7. ĐẶC TẢ CHI TIẾT PART II: HỌC TẬP QUA DỰ ÁN (PROJECT-BASED LEARNING)

Phần II đưa học viên vào vai trò của một kỹ sư phần mềm thực thụ thông qua 3 dự án đồ sộ kế thừa trực tiếp từ Python Crash Course 3E.

---

### DỰ ÁN 1: GAME BẮN TÀU ALIEN INVASION (PYGAME)
- **Mã định danh**: `project-01-alien-invasion`
- **Cấp độ**: `Advanced`
- **Màu đại diện**: `mint` (`#BFE8D0`)
- **Tóm tắt**: Xây dựng trò chơi điện tử 2D hoàn chỉnh: Tạo cửa sổ đồ họa, vòng lặp game loop 60 FPS, điều khiển phi thuyền di chuyển mượt mà theo bàn phím, bắn tia laser, xây dựng hạm đội quái vật không gian theo lưới ma trận, phát hiện va chạm hitbox, quản lý mạng sống, nút Play và hệ thống tăng độ khó theo cấp độ.
- **Nguồn đối chiếu**: PCC 3E Chapters 12, 13, 14.
- **Tiên quyết bắt buộc**: Hoàn thành Chương 01 đến Chương 09 (Đặc biệt là Chương 07 While Loop và Chương 09 OOP). Điểm thành thạo $\ge 75\%$.

#### Cấu trúc các Chặng kiểm tra (Project Milestones):
1. **Chặng 1.1: Khởi tạo Cửa sổ Game, Cài đặt FPS & Lớp Phi thuyền (`Ship`)**:
   - Khởi tạo thư viện Pygame, cài đặt độ phân giải $1200 \times 800$, quản lý nhịp khung hình bằng `pygame.time.Clock()`.
   - Tạo lớp `Ship`: Tải hình ảnh con tàu `ship.bmp`, lấy thuộc tính hình chữ nhật `rect`, định vị con tàu tại vị trí chính giữa đáy màn hình `rect.midbottom`.
2. **Chặng 1.2: Vòng lặp sự kiện (Event Loop) & Cơ chế di chuyển mượt mà**:
   - Bắt các sự kiện `pygame.KEYDOWN` và `pygame.KEYUP` của phím mũi tên Trái/Phải.
   - Sử dụng biến cờ di chuyển `moving_right` và `moving_left` kết hợp tọa độ số thực `self.x` để tàu di chuyển êm ái mà không bị giật lag khi giữ phím. Giới hạn không cho tàu chạy ra ngoài mép màn hình.
3. **Chặng 1.3: Vũ khí Laser & Quản lý đạn bằng Sprite Groups**:
   - Tạo lớp `Bullet` kế thừa từ `pygame.sprite.Sprite`.
   - Bắn tia laser khi người chơi nhấn phím Space, lưu trữ đạn trong nhóm `pygame.sprite.Group()`.
   - Tự động xóa các viên đạn bay ra khỏi đỉnh màn hình (`bullet.y <= 0`) để giải phóng bộ nhớ RAM.
4. **Chặng 1.4: Xây dựng Hạm đội Quái vật ngoài hành tinh (Alien Fleet)**:
   - Tạo lớp `Alien`, tính toán số lượng quái vật vừa vặn trên màn hình theo trục ngang và trục dọc.
   - Dùng vòng lặp lồng nhau sinh ra toàn bộ hạm đội quái vật di chuyển đồng bộ từ trái sang phải; khi chạm mép màn hình, cả hạm đội hạ thấp một khoảng và đảo chiều di chuyển.
5. **Chặng 1.5: Xử lý va chạm (Hitbox Collision) & Trạng thái Game Over**:
   - Sử dụng `pygame.sprite.groupcollide(bullets, aliens, True, True)` để hủy diệt quái vật khi trúng đạn; tái tạo hạm đội mới khi toàn bộ quái vật bị tiêu diệt.
   - Bắt va chạm giữa tàu và quái vật (`pygame.sprite.spritecollideany`), hoặc khi quái vật chạm đáy màn hình: Giảm 1 mạng tàu (`ships_left -= 1`), tạm dừng 0.5 giây và thiết lập lại vị trí tàu. Nếu hết 3 mạng, chuyển trạng thái `game_active = False`.
6. **Chặng 1.6: Giao diện người dùng: Nút Play, Tính điểm & Tăng cấp độ**:
   - Tạo lớp `Button` vẽ nút Play chính giữa màn hình khi game chưa bắt đầu hoặc kết thúc.
   - Tạo lớp `Scoreboard` hiển thị điểm số hiện tại, điểm kỷ lục (High Score), cấp độ hiện tại và vẽ số lượng phi thuyền còn lại ở góc màn hình.
   - Tăng tốc độ bay của tàu, đạn và quái vật mỗi khi người chơi thăng cấp.

---

### DỰ ÁN 2: TRỰC QUAN HÓA DỮ LIỆU KHOA HỌC (DATA VISUALIZATION)
- **Mã định danh**: `project-02-data-visualization`
- **Cấp độ**: `Advanced`
- **Màu đại diện**: `sky` (`#C7E3FF`)
- **Tóm tắt**: Khai phá và chuyển hóa dữ liệu số thành biểu đồ trực quan tương tác: Vẽ đồ thị đường và phân tán với Matplotlib, mô phỏng bước đi ngẫu nhiên Random Walk, vẽ biểu đồ xác suất xúc xắc với Plotly Express, phân tích tệp dữ liệu thời tiết thực tế CSV, vẽ bản đồ nhiệt động đất toàn cầu GeoJSON, và kết nối REST API GitHub/Hacker News để theo dõi các dự án công nghệ.
- **Nguồn đối chiếu**: PCC 3E Chapters 15, 16, 17.
- **Tiên quyết bắt buộc**: Hoàn thành Chương 01 đến Chương 10 (Đặc biệt là Chương 10 Files, JSON, CSV và Ngoại lệ). Điểm thành thạo $\ge 75\%$.

#### Cấu trúc các Chặng kiểm tra (Project Milestones):
1. **Chặng 2.1: Vẽ đồ thị cơ bản với Matplotlib & Tùy biến Style**:
   - Vẽ đồ thị đường bình phương với `plt.subplots()`, đặt tiêu đề, nhãn trục X/Y, chỉnh cỡ chữ, độ dày nét vẽ.
   - Vẽ biểu đồ phân tán điểm (Scatter Plot) với 1000 điểm dữ liệu, áp dụng bảng màu chuyển sắc gradient (Colormap `Blues`).
2. **Chặng 2.2: Mô phỏng Bước đi ngẫu nhiên (Random Walk Simulation)**:
   - Xây dựng lớp `RandomWalk` sử dụng module `random.choice` mô phỏng chuyển động Brown của các phân tử hạt trong vật lý.
   - Trực quan hóa 50.000 điểm bước đi, tô màu gradient từ điểm bắt đầu đến điểm kết thúc, ẩn các trục tọa độ để tạo tác phẩm nghệ thuật toán học.
3. **Chặng 2.3: Phân tích Xác suất Thống kê với Plotly Express**:
   - Tạo lớp `Die` mô phỏng con xúc xắc. Tung 2 xúc xắc 1000 lần và phân tích tần suất xuất hiện của các tổng điểm từ 2 đến 12.
   - Xuất biểu đồ cột tương tác (Interactive Bar Chart) bằng `px.bar()`, tùy biến nhãn trục và bảng màu hiển thị trực tiếp trên trình duyệt.
4. **Chặng 2.4: Phân tích Tệp dữ liệu thời tiết CSV thực tế (Death Valley & Sitka)**:
   - Đọc tệp dữ liệu bảng tính CSV nhiệt độ trạm khí tượng bằng module `csv`.
   - Trích xuất tiêu đề cột, lọc dữ liệu ngày tháng với module `datetime`.
   - Áp dụng khối `try-except ValueError` để xử lý các ngày bị khuyết thiếu dữ liệu đo đạc, vẽ biểu đồ biên độ nhiệt cao nhất/thấp nhất và tô màu vùng chênh lệch.
5. **Chặng 2.5: Bản đồ nhiệt Động đất toàn cầu với GeoJSON**:
   - Đọc tệp dữ liệu JSON trận động đất toàn cầu trong 30 ngày từ Cục Khảo sát Địa chất Hoa Kỳ (USGS).
   - Trích xuất kinh độ, vĩ độ, độ lớn Richter (`mag`) và địa danh.
   - Hiển thị dữ liệu lên bản đồ địa cầu tương tác với `px.scatter_geo()`, kích thước vòng tròn tỷ lệ thuận với độ lớn cơn địa chấn.
6. **Chặng 2.6: Khai thác Web REST API với Requests & Trực quan hóa GitHub**:
   - Sử dụng thư viện `requests` gửi truy vấn `GET` tới GitHub Search API: tìm kiếm các dự án Python có nhiều sao nhất.
   - Bắt mã trạng thái HTTP 200, phân tích chuỗi JSON trả về, trích xuất tên dự án, số sao và đường dẫn URL.
   - Vẽ biểu đồ cột tương tác Plotly: Rê chuột hiển thị mô tả dự án và nhấp chuột mở thẳng trang GitHub của dự án đó.

---

### DỰ ÁN 3: ỨNG DỤNG WEB FULL-STACK VỚI DJANGO (WEB APPLICATIONS)
- **Mã định danh**: `project-03-django-web-app`
- **Cấp độ**: `Advanced`
- **Màu đại diện**: `lavender` (`#DCCBFF`)
- **Tóm tắt**: Xây dựng ứng dụng web quản lý nhật ký học tập "Learning Log" từ số 0 đến triển khai thực tế: Thiết lập môi trường ảo, khởi tạo dự án Django 4.1, thiết kế cơ sở dữ liệu với Django Models, tạo quan hệ khóa ngoại (ForeignKey), chạy migrations, quản trị qua Django Admin; Xây dựng URLs, Views và HTML Templates kế thừa; Tạo Forms nhập liệu; Tích hợp hệ thống đăng ký/đăng nhập người dùng; Bảo mật phân quyền dữ liệu cá nhân; Trang trí giao diện với Bootstrap 5 và triển khai lên máy chủ đám mây.
- **Nguồn đối chiếu**: PCC 3E Chapters 18, 19, 20.
- **Tiên quyết bắt buộc**: Hoàn thành toàn bộ Phần I (Chương 01 đến Chương 11, bao gồm cả Unit Testing). Điểm thành thạo $\ge 80\%$.

#### Cấu trúc các Chặng kiểm tra (Project Milestones):
1. **Chặng 3.1: Khởi tạo Dự án Django & Mô hình hóa dữ liệu (Models)**:
   - Tạo môi trường ảo `.venv`, cài đặt `django`, khởi tạo dự án `ll_project` và ứng dụng con `learning_logs`.
   - Định nghĩa Model `Topic` (Chủ đề học) và Model `Entry` (Bài viết ghi chép) với quan hệ khóa ngoại `models.ForeignKey(Topic, on_delete=models.CASCADE)`.
   - Chạy lệnh `makemigrations` và `migrate` để sinh bảng trong database; đăng ký các Model vào trang quản trị `admin.site.register`.
2. **Chặng 3.2: Kiến trúc MVT (Model - View - Template) & Kế thừa giao diện**:
   - Xây dựng quy trình xử lý yêu cầu web: `urls.py` phân luồng URL $\rightarrow$ `views.py` truy vấn dữ liệu từ Model $\rightarrow$ nạp vào Template HTML.
   - Tạo trang chủ `index.html`, trang danh sách chủ đề `topics.html` và trang chi tiết `topic.html`.
   - Áp dụng kỹ thuật kế thừa giao diện Django Template: Tạo `base.html` chứa khung bố cục chung và nhúng các khối nội dung con bằng `{% block content %}`.
3. **Chặng 3.3: Xử lý Biểu mẫu dữ liệu với Django Forms**:
   - Tạo tệp `forms.py` chứa lớp `TopicForm` và `EntryForm` kế thừa từ `forms.ModelForm`.
   - Xử lý hai nhánh phương thức HTTP trong View: Nhánh `GET` hiển thị form trống cho người dùng nhập; Nhánh `POST` nhận dữ liệu, kiểm tra tính hợp lệ `form.is_valid()`, lưu vào cơ sở dữ liệu `form.save()` và chuyển hướng người dùng bằng `redirect`.
   - Chống tấn công giả mạo yêu cầu chéo trang bằng thẻ CSRF token bắt buộc `{% csrf_token %}`.
4. **Chặng 3.4: Hệ thống Xác thực & Quản lý tài khoản (Authentication)**:
   - Tạo ứng dụng con `accounts`, cấu hình URL xác thực mặc định của Django (`django.contrib.auth.urls`) cho trang Đăng nhập (`login.html`) và Đăng xuất.
   - Xây dựng biểu mẫu đăng ký tài khoản thành viên mới bằng lớp `UserCreationForm`.
   - Hiển thị tên người dùng đang đăng nhập trên thanh điều hướng và hiển thị nút Đăng nhập/Đăng xuất tương ứng.
5. **Chặng 3.5: Bảo mật Quyền sở hữu dữ liệu (Data Isolation & Security)**:
   - Bổ sung trường khóa ngoại `owner = models.ForeignKey(User, on_delete=models.CASCADE)` vào Model `Topic` để gắn chủ đề với người tạo.
   - Bảo vệ các trang nhạy cảm bằng decorator `@login_required`: Người chưa đăng nhập cố tình truy cập sẽ tự động bị chuyển hướng về trang login.
   - Ngăn chặn người dùng xem trộm hoặc sửa bài viết của người khác: Kiểm tra `if topic.owner != request.user: raise Http404`.
6. **Chặng 3.6: Làm đẹp giao diện với Bootstrap 5 & Triển khai lên Đám mây**:
   - Tích hợp framework CSS Bootstrap 5 vào `base.html`, xây dựng thanh điều hướng Navbar responsive, bo tròn các thẻ Card, tạo thông báo phản hồi (Alert messages).
   - Chuẩn bị tệp `requirements.txt` và các tệp cấu hình triển khai YAML.
   - Triển khai ứng dụng lên dịch vụ đám mây (Platform.sh / Render) với cơ sở dữ liệu PostgreSQL thực tế, cấu hình bảo mật `DEBUG = False` và biến môi trường bí mật.

---

## 8. BẢNG KIỂM TRA TIÊU CHUẨN HOÀN THÀNH (COMPLETION GATE)

Đối chiếu đầy đủ các tiêu chí nghiệm thu của **STEP 2**:

| Tiêu chuẩn nghiệm thu | Trạng thái | Minh chứng chi tiết trong bản thiết kế |
| :--- | :---: | :--- |
| **1. Không có chủ đề trùng lặp** | `VERIFIED` | Giáo trình duy nhất 1 luồng chuẩn. Tuples đặt sau List; Sets đặt cùng Dictionaries; Cast/Operators đặt tại Biến & Rẽ nhánh; không có bài học nào bị dạy lặp lại. |
| **2. Không có bài học thiếu prerequisite** | `VERIFIED` | Toàn bộ 11 chương nền tảng và 3 dự án lớn đều được định danh cây phụ thuộc DAG rõ ràng từ căn bản đến nâng cao. |
| **3. Có mapping chi tiết W3Schools & PCC3E** | `VERIFIED` | Từng bài học đều ghi rõ nguồn đối chiếu: Nền tảng thực hành theo PCC3E + Kiến thức mở rộng tra cứu theo W3Schools. |
| **4. Có phân cấp độ khó chuẩn mực** | `VERIFIED` | Phân bổ rõ 3 cấp độ nhận thức: Beginner (Ch 01–05), Intermediate (Ch 06–10), Advanced (Ch 11 & Dự án). |
| **5. Cấu trúc Database tương thích 100%** | `VERIFIED` | Tương thích tuyệt đối với các bảng `courses`, `topics`, `lessons`, `exercises` và cấu trúc `JSONB` trong migration `001` đến `004`. |
| **6. Lộ trình hoàn chỉnh từ số 0 đến Dự án** | `VERIFIED` | Người học đi từng bước vững chắc từ `print("Hello World")` đến phát triển Game Pygame, Trực quan hóa dữ liệu và Web Full-stack Django. |
| **7. Đầy đủ 12 thành phần bắt buộc mỗi bài học** | `VERIFIED` | Mọi bài học đều có Learning Objectives, Prerequisites, Giải thích tiếng Việt, Ví dụ thực thi, Output, Visual Model, Common Mistakes, Guided Task, Independent Exercises, Mini Challenge, Summary và Related Lessons. |

---
*Bản thiết kế này đã sẵn sàng để chuyển giao sang các bước tiếp theo để triển khai nội dung bài học và test cases lên hệ thống CodeCoBUG!*
