import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_06_CONDITIONALS: Topic = {
  id: 'topic-06-cau-truc-dieu-kien',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-06-cau-truc-dieu-kien',
  title: 'Chủ đề 06: Cấu trúc điều kiện (if, elif, else)',
  summary: 'Rèn luyện tư duy rẽ nhánh và ra quyết định trong lập trình: Cú pháp if-elif-else, điều kiện kết hợp logic, điều kiện lồng nhau và các bài toán phân loại thực tế.',
  orderIndex: 6,
  category: 'Cấu trúc điều khiển',
  isPublished: true,
  isLocked: false,
  accentColor: 'mint',
  lessons: [
    {
      id: 'lesson-06-01-if-else-co-ban',
      topicId: 'topic-06-cau-truc-dieu-kien',
      slug: 'cau-lenh-if-else-co-ban',
      title: 'Bài 01: Câu lệnh rẽ nhánh if và else',
      theoryContent: `Trong cuộc sống cũng như trong lập trình, chúng ta thường xuyên phải ra quyết định dựa trên điều kiện: "NẾU trời mưa THÌ mang ô, NGƯỢC LẠI THÌ đi dạo".
Trong Python, cú pháp rẽ nhánh rất tự nhiên:
\`\`\`python
if dieu_kien:
    # Khối lệnh chạy khi điều kiện True
else:
    # Khối lệnh chạy khi điều kiện False
\`\`\`

**LƯU Ý CỰC KỲ QUAN TRỌNG**:
1. Phải có **dấu hai chấm \`:\`** ở cuối dòng \`if\` và \`else\`.
2. Toàn bộ các câu lệnh bên trong khối PHẢI ĐƯỢC **thụt lề (Indentation)** 4 khoảng trắng.`,
      learningObjectives: [
        'Hiểu luồng rẽ nhánh nhị phân (Đúng / Sai).',
        'Viết đúng cú pháp có dấu hai chấm và thụt lề.',
        'Áp dụng giải quyết các bài toán kiểm tra điều kiện cơ bản.',
      ],
      prerequisites: [
        'Đã học toán tử so sánh (==, !=, >, <, >=, <=).',
      ],
      codeExamples: [
        {
          title: 'Kiểm tra điểm thi đạt hay trượt',
          code: 'diem = 7.0\nif diem >= 5.0:\n    print("Ket qua: DAT")\nelse:\n    print("Ket qua: CHUA DAT")',
          expectedOutput: 'Ket qua: DAT',
          explanation: 'Vì 7.0 >= 5.0 là True nên nhánh if được thực thi.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên dấu hai chấm: if x > 0',
          explanation: 'Gây lỗi SyntaxError: expected ":".',
          fix: 'Luôn kết thúc dòng if và else bằng dấu hai chấm: if x > 0:',
        },
        {
          mistake: 'Quên thụt lề khối lệnh bên trong if',
          explanation: 'Gây lỗi IndentationError: expected an indented block.',
          fix: 'Thụt lề 4 khoảng trắng cho mọi lệnh thuộc nhánh if hoặc else.',
        },
      ],
      guidedPracticeTask: {
        title: 'Kiểm tra tuổi lái xe',
        instructions: 'Nhập tuổi của một người. Nếu từ 18 trở lên in "Du tuoi lai xe", ngược lại in "Chua du tuoi".',
        hint: 'if tuoi >= 18: print(...) else: print(...)',
      },
      recap: [
        'if kiểm tra biểu thức điều kiện boolean.',
        'else chứa khối lệnh khi điều kiện không thỏa mãn.',
        'Dấu : và thụt lề là bắt buộc trong Python.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python If ... Else',
          url: 'https://www.w3schools.com/python/python_conditions.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-06-01',
          lessonId: 'lesson-06-01-if-else-co-ban',
          topicId: 'topic-06-cau-truc-dieu-kien',
          slug: 'kiem-tra-am-duong',
          title: 'Kiểm tra số âm hay số dương',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào một số nguyên `n` (khác 0). Sử dụng cấu trúc `if - else` để kiểm tra:\n- Nếu `n > 0`, in ra: `So duong`\n- Nếu `n < 0`, in ra: `So am`',
          starterCode: 'n = int(input())\n# Kiểm tra âm dương và in kết quả\n',
          expectedLearningOutcome: 'Viết câu lệnh if - else cơ bản có thụt lề chuẩn.',
          skillTags: ['python_conditionals', 'if_else'],
          hints: [
            'if n > 0:\n    print("So duong")\nelse:\n    print("So am")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-06-01-samp-1',
              exerciseId: 'ex-06-01',
              inputData: '42',
              expectedOutput: 'So duong',
              explanation: '42 lớn hơn 0.',
              orderIndex: 1,
            },
            {
              id: 'ex-06-01-samp-2',
              exerciseId: 'ex-06-01',
              inputData: '-15',
              expectedOutput: 'So am',
              explanation: '-15 nhỏ hơn 0.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-06-02-nhieu-nhanh-elif',
      topicId: 'topic-06-cau-truc-dieu-kien',
      slug: 'nhieu-nhanh-elif',
      title: 'Bài 02: Phân nhánh đa luồng với elif',
      theoryContent: `Khi bài toán có nhiều hơn 2 trường hợp lựa chọn (ví dụ: số dương, số âm hoặc số 0; hoặc xếp loại học lực Giỏi, Khá, Trung bình, Yếu), ta sử dụng từ khóa **\`elif\`** (viết tắt của "else if").

Cú pháp:
\`\`\`python
if dieu_kien_1:
    # Lệnh khi điều kiện 1 đúng
elif dieu_kien_2:
    # Lệnh khi điều kiện 2 đúng
elif dieu_kien_3:
    # Lệnh khi điều kiện 3 đúng
else:
    # Lệnh khi tất cả các điều kiện trên đều sai
\`\`\`
Python sẽ kiểm tra từ trên xuống dưới: ngay khi gặp điều kiện nào đúng, khối lệnh đó được chạy và toàn bộ các nhánh còn lại sẽ được bỏ qua.`,
      learningObjectives: [
        'Sử dụng elif để phân chia nhiều trường hợp loại trừ lẫn nhau.',
        'Hiểu cơ chế dừng ngay sau nhánh thỏa mãn đầu tiên (short-circuit logic).',
      ],
      prerequisites: [
        'Đã học if - else.',
      ],
      codeExamples: [
        {
          title: 'Phân loại số nguyên',
          code: 'n = 0\nif n > 0:\n    print("Duong")\nelif n < 0:\n    print("Am")\nelse:\n    print("Khong")',
          expectedOutput: 'Khong',
          explanation: 'Vì n = 0 nên rơi vào nhánh else.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Dùng nhiều if độc lập thay vì elif',
          explanation: 'Nếu viết nhiều if liên tiếp, Python sẽ kiểm tra tất cả các if thay vì loại trừ nhau, có thể gây in thừa nhiều kết quả.',
          fix: 'Dùng chuỗi if - elif - else khi các trường hợp loại trừ nhau.',
        },
      ],
      guidedPracticeTask: {
        title: 'Xếp loại điểm số',
        instructions: 'Nhập điểm dtb (float). Nếu >= 8.0 in "Gioi", nếu >= 6.5 in "Kha", nếu >= 5.0 in "Trung binh", còn lại in "Yeu".',
        hint: 'Sắp xếp điều kiện từ cao xuống thấp.',
      },
      recap: [
        'elif là viết tắt của else if, dùng khi có >= 3 trường hợp.',
        'Chỉ có 1 nhánh duy nhất được thực thi.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Elif',
          url: 'https://www.w3schools.com/python/gloss_python_elif.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-06-02',
          lessonId: 'lesson-06-02-nhieu-nhanh-elif',
          topicId: 'topic-06-cau-truc-dieu-kien',
          slug: 'xep-loai-hoc-luc',
          title: 'Xếp loại học lực học sinh',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào điểm trung bình `dtb` (số thực từ `0.0` đến `10.0`). Hãy xếp loại học lực theo thang điểm sau và in kết quả ra màn hình:\n- `dtb >= 8.5`: In `Xuat sac`\n- `dtb >= 8.0`: In `Gioi`\n- `dtb >= 6.5`: In `Kha`\n- `dtb >= 5.0`: In `Trung binh`\n- Còn lại (`dtb < 5.0`): In `Yeu`',
          starterCode: 'dtb = float(input())\n# Xếp loại học lực với if - elif - else\n',
          expectedLearningOutcome: 'Làm chủ chuỗi if - elif - else kiểm tra điều kiện từ cao xuống thấp.',
          skillTags: ['python_conditionals', 'elif_ladder', 'grading_system'],
          hints: [
            'if dtb >= 8.5:\n    print("Xuat sac")\nelif dtb >= 8.0:\n    print("Gioi")...',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-06-02-samp-1',
              exerciseId: 'ex-06-02',
              inputData: '8.7',
              expectedOutput: 'Xuat sac',
              explanation: '8.7 >= 8.5.',
              orderIndex: 1,
            },
            {
              id: 'ex-06-02-samp-2',
              exerciseId: 'ex-06-02',
              inputData: '7.2',
              expectedOutput: 'Kha',
              explanation: '7.2 >= 6.5.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-06-03-dieu-kien-phuc-hop',
      topicId: 'topic-06-cau-truc-dieu-kien',
      slug: 'dieu-kien-phuc-hop-va-nam-nhuan',
      title: 'Bài 03: Điều kiện phức hợp & Bài toán kiểm tra năm nhuận',
      theoryContent: `Trong thực tế, điều kiện quyết định thường kết hợp nhiều yếu tố logic phức tạp thông qua các toán tử \`and\`, \`or\`, \`not\`.

**Bài toán kinh điển: Kiểm tra Năm Nhuận (Leap Year)**:
Quy tắc lịch Gregory để một năm dương lịch là năm nhuận:
1. Năm đó chia hết cho \`400\` (ví dụ: năm 2000 là năm nhuận).
2. HOẶC năm đó chia hết cho \`4\` NHƯNG KHÔNG chia hết cho \`100\` (ví dụ: năm 2024 là năm nhuận, còn năm 1900 thì không).

Cú pháp biểu diễn điều kiện một dòng trong Python:
\`is_leap = (nam % 400 == 0) or (nam % 4 == 0 and nam % 100 != 0)\``,
      learningObjectives: [
        'Kết hợp linh hoạt các toán tử and, or trong câu lệnh if.',
        'Hiểu và giải quyết bài toán thuật toán kiểm tra năm nhuận chuẩn quốc tế.',
      ],
      prerequisites: [
        'Đã học toán tử logic and, or.',
      ],
      codeExamples: [
        {
          title: 'Kiểm tra năm nhuận',
          code: 'nam = 2024\nif (nam % 400 == 0) or (nam % 4 == 0 and nam % 100 != 0):\n    print(f"{nam} la nam nhuan")\nelse:\n    print(f"{nam} khong phai nam nhuan")',
          expectedOutput: '2024 la nam nhuan',
          explanation: '2024 chia hết cho 4 và không chia hết cho 100.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Chỉ kiểm tra chia hết cho 4: if nam % 4 == 0',
          explanation: 'Sai quy tắc lịch vì năm 1900 chia hết cho 4 nhưng lại không phải năm nhuận.',
          fix: 'Phải kết hợp cả điều kiện không chia hết cho 100 hoặc chia hết cho 400.',
        },
      ],
      guidedPracticeTask: {
        title: 'Kiểm tra tam giác hợp lệ',
        instructions: 'Nhập 3 cạnh a, b, c. Kiểm tra a + b > c and a + c > b and b + c > a.',
        hint: 'Điều kiện bất đẳng thức tam giác.',
      },
      recap: [
        'and đòi hỏi tất cả đúng, or chỉ cần một vế đúng.',
        'Năm nhuận: (n % 400 == 0) or (n % 4 == 0 and n % 100 != 0).',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Conditions',
          url: 'https://www.w3schools.com/python/python_conditions.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-06-03',
          lessonId: 'lesson-06-03-dieu-kien-phuc-hop',
          topicId: 'topic-06-cau-truc-dieu-kien',
          slug: 'kiem-tra-nam-nhuan',
          title: 'Kiểm tra năm nhuận',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một số nguyên dương `nam` đại diện cho năm dương lịch. Hãy kiểm tra xem đó có phải là năm nhuận hay không:\n- Nếu là năm nhuận, in ra: `Nam nhuan`\n- Nếu không phải, in ra: `Nam thuong`',
          starterCode: 'nam = int(input())\n# Kiểm tra năm nhuận\n',
          expectedLearningOutcome: 'Xây dựng biểu thức logic kết hợp and và or chính xác.',
          skillTags: ['python_conditionals', 'boolean_logic', 'leap_year'],
          hints: [
            'if (nam % 400 == 0) or (nam % 4 == 0 and nam % 100 != 0):\n    print("Nam nhuan")\nelse:\n    print("Nam thuong")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-06-03-samp-1',
              exerciseId: 'ex-06-03',
              inputData: '2024',
              expectedOutput: 'Nam nhuan',
              explanation: '2024 là năm nhuận.',
              orderIndex: 1,
            },
            {
              id: 'ex-06-03-samp-2',
              exerciseId: 'ex-06-03',
              inputData: '1900',
              expectedOutput: 'Nam thuong',
              explanation: '1900 chia hết cho 100 nhưng không chia hết cho 400.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};

