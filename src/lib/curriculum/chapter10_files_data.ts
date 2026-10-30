import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_10_FILES_DATA: Topic = {
  id: 'topic-10-file-va-du-lieu',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-10-file-va-du-lieu',
  title: 'Chủ đề 10: Thao tác File & Định dạng dữ liệu (Files, JSON & CSV)',
  summary: 'Lưu trữ và trao đổi dữ liệu bền vững: Đọc ghi file văn bản với context manager with, phân tích và xuất dữ liệu JSON, xử lý tệp bảng tính CSV.',
  orderIndex: 10,
  category: 'Xử lý dữ liệu',
  isPublished: true,
  isLocked: false,
  accentColor: 'mint',
  lessons: [
    {
      id: 'lesson-10-01-doc-ghi-file-with',
      topicId: 'topic-10-file-va-du-lieu',
      slug: 'doc-ghi-file-va-context-manager-with',
      title: 'Bài 01: Đọc, ghi file và Context Manager with',
      theoryContent: `Trong các bài học trước, dữ liệu nhập từ bàn phím sẽ mất đi ngay khi chương trình kết thúc. Để lưu trữ dữ liệu vĩnh viễn trên ổ đĩa, chúng ta làm việc với **Tệp tin (File)**.

**1. Các chế độ mở file (Mode)**:
- \`"r"\` (Read): Mở để đọc (mặc định). Báo lỗi nếu file không tồn tại.
- \`"w"\` (Write): Mở để ghi mới. Nếu file đã có, nội dung cũ sẽ bị xóa trắng. Nếu chưa có, tạo file mới.
- \`"a"\` (Append): Mở để ghi nối tiếp vào cuối file mà không xóa nội dung cũ.

**2. Cú pháp chuẩn với Context Manager \`with\`**:
Sử dụng câu lệnh \`with\` là chuẩn mực trong Python vì nó đảm bảo file **luôn được đóng tự động** ngay cả khi xảy ra lỗi:
\`\`\`python
# Ghi dữ liệu vào file
with open("thong_tin.txt", "w", encoding="utf-8") as f:
    f.write("Xin chào Python!\\n")

# Đọc dữ liệu từ file
with open("thong_tin.txt", "r", encoding="utf-8") as f:
    noi_dung = f.read()
    print(noi_dung)
\`\`\``,
      learningObjectives: [
        'Phân biệt các chế độ mở file r, w, a.',
        'Sử dụng cú pháp with open(...) as f để đảm bảo an toàn tài nguyên.',
        'Đọc và ghi file văn bản thuần túy.',
      ],
      prerequisites: [
        'Đã học chuỗi ký tự và khối lệnh thụt lề.',
      ],
      codeExamples: [
        {
          title: 'Đọc và ghi file với context manager',
          code: 'with open("demo.txt", "w") as f:\n    f.write("CodeCoBUG")\nwith open("demo.txt", "r") as f:\n    print(f.read())',
          expectedOutput: 'CodeCoBUG',
          explanation: 'File demo.txt được tạo, ghi nội dung và sau đó được đọc lại hoàn toàn tự động.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Mở file bằng f = open(...) nhưng quên f.close()',
          explanation: 'Gây rò rỉ tài nguyên hệ điều hành hoặc dữ liệu chưa kịp ghi xuống đĩa.',
          fix: 'Luôn sử dụng cú pháp with open(...) as f.',
        },
      ],
      guidedPracticeTask: {
        title: 'Ghi nhật ký vào file',
        instructions: 'Dùng with open("log.txt", "a") để ghi thêm một dòng log vào cuối file.',
        hint: 'with open("log.txt", "a") as f: f.write("Log line\\n")',
      },
      recap: [
        'with open tự động đóng file an toàn.',
        'Chế độ w ghi đè, chế độ a ghi tiếp.',
        'Nên chỉ định rõ encoding="utf-8" khi xử lý tiếng Việt.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python File Handling',
          url: 'https://www.w3schools.com/python/python_file_handling.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-10-01',
          lessonId: 'lesson-10-01-doc-ghi-file-with',
          topicId: 'topic-10-file-va-du-lieu',
          slug: 'ghi-va-doc-file-text',
          title: 'Ghi và đọc dữ liệu từ file văn bản',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một dòng văn bản `s` từ bàn phím.\n\nHãy thực hiện các bước sau:\n1. Sử dụng `with open("output.txt", "w") as f:` để ghi chuỗi `s` vào tệp tin `output.txt`.\n2. Sau đó, mở lại tệp tin `output.txt` ở chế độ đọc (`"r"`), đọc toàn bộ nội dung trong tệp, chuyển toàn bộ thành chữ in hoa và in ra màn hình.',
          starterCode: 's = input()\n# 1. Ghi s vào file output.txt\n# 2. Mở file output.txt đọc và in hoa nội dung\n',
          expectedLearningOutcome: 'Sử dụng thành thạo with open để ghi và đọc file trong Python.',
          skillTags: ['python_files', 'file_io', 'context_manager'],
          hints: [
            'with open("output.txt", "w") as f:\n    f.write(s)\nwith open("output.txt", "r") as f:\n    print(f.read().upper())',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-10-01-samp-1',
              exerciseId: 'ex-10-01',
              inputData: 'hello python',
              expectedOutput: 'HELLO PYTHON',
              explanation: 'Ghi "hello python" vào file rồi đọc ra in hoa.',
              orderIndex: 1,
            },
            {
              id: 'ex-10-01-samp-2',
              exerciseId: 'ex-10-01',
              inputData: 'codecobug platform',
              expectedOutput: 'CODECOBUG PLATFORM',
              explanation: 'Ghi và đọc file chuẩn xác.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-10-02-xu-ly-json',
      topicId: 'topic-10-file-va-du-lieu',
      slug: 'xu-ly-dinh-dang-json',
      title: 'Bài 02: Xử lý định dạng trao đổi dữ liệu JSON',
      theoryContent: `**JSON (JavaScript Object Notation)** là định dạng trao đổi dữ liệu phổ biến nhất trên Internet hiện nay, được sử dụng trong hầu hết các REST API và Web Services.

Python tích hợp sẵn module \`json\` với các phương thức cốt lõi:
- **\`json.loads(chuoi_json)\`**: Chuyển đổi một chuỗi JSON thành Dictionary/List trong Python.
- **\`json.dumps(du_lieu_python)\`**: Chuyển đổi Dictionary/List trong Python thành chuỗi JSON.
- **\`json.load(file_object)\`**: Đọc trực tiếp từ file JSON.
- **\`json.dump(du_lieu_python, file_object)\`**: Ghi trực tiếp vào file JSON.

Ví dụ:
\`\`\`python
import json

chuoi = '{"ten": "Nam", "tuoi": 18}'
data = json.loads(chuoi)
print(data["ten"]) # Nam
print(type(data))  # <class 'dict'>
\`\`\``,
      learningObjectives: [
        'Hiểu cấu trúc định dạng JSON và sự tương đồng với Dictionary của Python.',
        'Sử dụng json.loads để phân tích chuỗi JSON thành Python dictionary.',
        'Truy xuất các trường dữ liệu an toàn từ đối tượng JSON.',
      ],
      prerequisites: [
        'Đã học Dictionary trong Python và import module.',
      ],
      codeExamples: [
        {
          title: 'Phân tích chuỗi JSON',
          code: 'import json\ns = \'{"khoa_hoc": "Python", "bai_hoc": 12}\'\nd = json.loads(s)\nprint(d["khoa_hoc"], d["bai_hoc"])',
          expectedOutput: 'Python 12',
          explanation: 'json.loads chuyển chuỗi JSON thành dict để truy cập bằng key.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Dùng dấu nháy đơn trong chuỗi JSON: {\'key\': \'value\'}',
          explanation: 'Chuẩn JSON bắt buộc phải sử dụng dấu nháy kép " cho chuỗi và tên thuộc tính. Dùng nháy đơn sẽ gây lỗi json.decoder.JSONDecodeError.',
          fix: 'Luôn đảm bảo chuỗi JSON sử dụng dấu ngoặc kép hợp chuẩn.',
        },
      ],
      guidedPracticeTask: {
        title: 'Xuất Python Dict thành chuỗi JSON',
        instructions: 'Dùng json.dumps({"status": "ok"}) để tạo chuỗi JSON.',
        hint: 'import json; print(json.dumps({"status": "ok"}))',
      },
      recap: [
        'json.loads phân tích string thành dict.',
        'json.dumps đóng gói dict thành string.',
        'JSON là cầu nối giao tiếp tiêu chuẩn giữa các hệ thống.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python JSON',
          url: 'https://www.w3schools.com/python/python_json.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-10-02',
          lessonId: 'lesson-10-02-xu-ly-json',
          topicId: 'topic-10-file-va-du-lieu',
          slug: 'trich-xuat-thong-tin-json',
          title: 'Trích xuất thông tin sinh viên từ chuỗi JSON',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một dòng chứa chuỗi JSON hợp lệ biểu diễn thông tin sinh viên với cấu trúc: `{"ten": "...", "tuoi": ..., "diem": ...}`.\n\nHãy sử dụng thư viện `json` để giải mã chuỗi và in ra màn hình thông tin theo định dạng:\n`Sinh vien: <ten> - Tuoi: <tuoi> - Diem: <diem>`',
          starterCode: 'import json\n\ns = input()\n# Giải mã chuỗi JSON và in thông tin\n',
          expectedLearningOutcome: 'Sử dụng json.loads để phân tích chuỗi JSON và truy xuất các trường dữ liệu.',
          skillTags: ['python_json', 'json_loads', 'data_serialization'],
          hints: [
            'import json\ndata = json.loads(s)\nprint(f"Sinh vien: {data[\'ten\']} - Tuoi: {data[\'tuoi\']} - Diem: {data[\'diem\']}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-10-02-samp-1',
              exerciseId: 'ex-10-02',
              inputData: '{"ten": "Nguyen Van A", "tuoi": 20, "diem": 8.5}',
              expectedOutput: 'Sinh vien: Nguyen Van A - Tuoi: 20 - Diem: 8.5',
              explanation: 'Giải mã JSON thành dict và truy xuất ten, tuoi, diem.',
              orderIndex: 1,
            },
            {
              id: 'ex-10-02-samp-2',
              exerciseId: 'ex-10-02',
              inputData: '{"ten": "Tran Thi B", "tuoi": 19, "diem": 9.0}',
              expectedOutput: 'Sinh vien: Tran Thi B - Tuoi: 19 - Diem: 9.0',
              explanation: 'Truy xuất đúng các thuộc tính từ JSON object.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-10-03-du-lieu-csv',
      topicId: 'topic-10-file-va-du-lieu',
      slug: 'xu-ly-du-lieu-csv',
      title: 'Bài 03: Xử lý dữ liệu bảng tính CSV',
      theoryContent: `**CSV (Comma-Separated Values)** là định dạng tệp đơn giản để lưu trữ dữ liệu dạng bảng (hàng và cột). Mỗi dòng trong file tương ứng với một hàng dữ liệu, các cột được phân tách bởi dấu phẩy \`,\`.

Trong Python, bạn có thể xử lý CSV đơn giản bằng cách tách chuỗi:
\`\`\`python
dong = "Cam,10,25000"
cac_cot = dong.split(",")
ten = cac_cot[0]
so_luong = int(cac_cot[1])
don_gia = int(cac_cot[2])
thanh_tien = so_luong * don_gia
\`\`\`
Hoặc sử dụng thư viện tích hợp \`csv\` (\`csv.reader\`, \`csv.DictReader\`) khi dữ liệu có dấu phẩy nằm bên trong dấu ngoặc kép.`,
      learningObjectives: [
        'Hiểu cấu trúc dữ liệu bảng tính CSV.',
        'Phân tách và chuyển đổi kiểu dữ liệu các cột trong tệp CSV.',
        'Tính toán tổng hợp dữ liệu thống kê từ các bản ghi bảng tính.',
      ],
      prerequisites: [
        'Đã học chuỗi ký tự, danh sách và vòng lặp for.',
      ],
      codeExamples: [
        {
          title: 'Tính tổng tiền một dòng CSV',
          code: 'line = "But bi,5,4000"\nname, qty, price = line.split(",")\ntotal = int(qty) * int(price)\nprint(f"{name}: {total} VND")',
          expectedOutput: 'But bi: 20000 VND',
          explanation: 'Tách dòng thành các trường và nhân số lượng với đơn giá.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên ép kiểu số khi đọc dữ liệu từ CSV: int(qty)',
          explanation: 'Mọi dữ liệu đọc từ CSV đều ở dạng chuỗi (str). Nếu không ép kiểu, phép nhân "5" * 4000 sẽ gây sai lệch hoặc lỗi.',
          fix: 'Luôn ép kiểu các cột số sang int hoặc float trước khi tính toán.',
        },
      ],
      guidedPracticeTask: {
        title: 'Tách dòng CSV họ và tên',
        instructions: 'Dòng "Nguyen,An,10" tách thành họ, tên, điểm.',
        hint: 'ho, ten, diem = s.split(",")',
      },
      recap: [
        'CSV phân tách dữ liệu bảng bằng dấu phẩy.',
        'split(",") là cách đơn giản và trực quan để trích xuất các cột.',
        'Bắt buộc phải ép kiểu số khi tính toán.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Read CSV',
          url: 'https://www.w3schools.com/python/python_file_handling.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-10-03',
          lessonId: 'lesson-10-03-du-lieu-csv',
          topicId: 'topic-10-file-va-du-lieu',
          slug: 'tinh-tong-tien-don-hang-csv',
          title: 'Tính tổng giá trị đơn hàng từ dữ liệu CSV',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một số nguyên `n` (số mặt hàng trong đơn). Trong `n` dòng tiếp theo, mỗi dòng là một bản ghi CSV gồm 3 trường: `TenHang,SoLuong,DonGia` (phân tách bởi dấu phẩy).\n\nHãy tính tổng tiền của toàn bộ đơn hàng (tổng của `SoLuong * DonGia` cho tất cả các mặt hàng) và in ra theo định dạng: `Tong don hang: <tong_tien> VND`',
          starterCode: 'n = int(input())\ntong_tien = 0\n# Đọc n dòng CSV và tính tổng tiền\n',
          expectedLearningOutcome: 'Phân tích dữ liệu dạng CSV và tính toán tổng hợp.',
          skillTags: ['python_csv', 'string_split', 'data_processing'],
          hints: [
            'for _ in range(n):\n    parts = input().split(",")\n    qty = int(parts[1])\n    price = int(parts[2])\n    tong_tien += qty * price\nprint(f"Tong don hang: {tong_tien} VND")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-10-03-samp-1',
              exerciseId: 'ex-10-03',
              inputData: '2\nVo viet,5,10000\nBut chi,3,5000',
              expectedOutput: 'Tong don hang: 65000 VND',
              explanation: '5 * 10000 + 3 * 5000 = 65000.',
              orderIndex: 1,
            },
            {
              id: 'ex-10-03-samp-2',
              exerciseId: 'ex-10-03',
              inputData: '1\nBalo,1,250000',
              expectedOutput: 'Tong don hang: 250000 VND',
              explanation: '1 * 250000 = 250000.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};
