import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_03_OPERATORS: Topic = {
  id: 'topic-03-so-hoc-va-toan-tu',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-03-so-hoc-va-toan-tu',
  title: 'Chủ đề 03: Số học và toán tử',
  summary: 'Khám phá toàn bộ hệ thống toán tử trong Python: Toán tử số học nâng cao (//, %, **), toán tử so sánh, toán tử logic (and, or, not), thứ tự ưu tiên và toán tử thành viên in / not in.',
  orderIndex: 3,
  category: 'Toán tử & Biểu thức',
  isPublished: true,
  isLocked: false,
  accentColor: 'lavender',
  lessons: [
    {
      id: 'lesson-03-01-toan-tu-so-hoc',
      topicId: 'topic-03-so-hoc-va-toan-tu',
      slug: 'toan-tu-so-hoc-va-chia-du',
      title: 'Bài 01: Các phép toán số học & Chia lấy dư',
      theoryContent: `Python cung cấp 7 toán tử số học cơ bản:
1. \`+\` : Phép cộng (\`5 + 3 = 8\`)
2. \`-\` : Phép trừ (\`5 - 3 = 2\`)
3. \`*\` : Phép nhân (\`5 * 3 = 15\`)
4. \`/\` : Phép chia thực — **Luôn luôn trả về số thực float** (\`6 / 3 = 2.0\`)
5. \`//\` : **Chia lấy phần nguyên** (Floor division) — Bỏ qua phần thập phân (\`7 // 3 = 2\`, \`8 // 3 = 2\`)
6. \`%\` : **Chia lấy phần dư** (Modulus) — Trả về số dư của phép chia (\`7 % 3 = 1\`, \`8 % 2 = 0\`). Rất hữu ích để kiểm tra số chẵn/lẻ!
7. \`**\` : **Lũy thừa** (Exponentiation) — Tính số mũ (\`2 ** 3 = 8\`, \`5 ** 2 = 25\`).`,
      learningObjectives: [
        'Phân biệt rõ ràng giữa chia thực (/), chia lấy nguyên (//) và chia lấy dư (%).',
        'Ứng dụng toán tử % để kiểm tra tính chẵn lẻ hoặc chia hết.',
        'Sử dụng toán tử lũy thừa ** thay cho các vòng lặp tính số mũ.',
      ],
      prerequisites: [
        'Đã học bài ép kiểu int() và float().',
      ],
      codeExamples: [
        {
          title: 'So sánh ba phép chia trong Python',
          code: 'a = 17\nb = 5\nprint("Chia thuc (/):", a / b)\nprint("Chia lay nguyen (//):", a // b)\nprint("Chia lay du (%):", a % b)',
          expectedOutput: 'Chia thuc (/): 3.4\nChia lay nguyen (//): 3\nChia lay du (%): 2',
          explanation: '17 chia 5 bằng 3 dư 2 (3 * 5 + 2 = 17).',
        },
        {
          title: 'Tính lũy thừa với **',
          code: 'print("2 mu 10 la:", 2 ** 10)',
          expectedOutput: '2 mu 10 la: 1024',
          explanation: 'Toán tử ** tính 2^10 = 1024 nhanh chóng.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Tưởng nhầm dấu ^ là lũy thừa: 2 ^ 3',
          explanation: 'Trong Python, dấu ^ là toán tử XOR thao tác trên bit, không phải số mũ (2 ^ 3 ra 1).',
          fix: 'Luôn dùng hai dấu sao ** để tính lũy thừa: 2 ** 3 ra 8.',
        },
        {
          mistake: 'Chia cho số 0: 10 / 0 hoặc 10 % 0',
          explanation: 'Gây lỗi ZeroDivisionError: division by zero.',
          fix: 'Luôn đảm bảo số chia khác 0 trước khi thực hiện phép chia.',
        },
      ],
      guidedPracticeTask: {
        title: 'Tách chữ số hàng chục và hàng đơn vị',
        instructions: 'Nhập vào một số nguyên có 2 chữ số (ví dụ: 47). Dùng // và % để tách chữ số hàng chục và hàng đơn vị.',
        hint: 'hang_chuc = n // 10, hang_don_vi = n % 10.',
      },
      recap: [
        '/ cho kết quả float, // cho phần nguyên, % cho phần dư.',
        '** là phép tính số mũ trong Python.',
        'n % 2 == 0 chứng tỏ n là số chẵn.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Operators',
          url: 'https://www.w3schools.com/python/python_operators.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-03-01',
          lessonId: 'lesson-03-01-toan-tu-so-hoc',
          topicId: 'topic-03-so-hoc-va-toan-tu',
          slug: 'phep-chia-lay-nguyen-va-du',
          title: 'Chia lấy nguyên và lấy dư',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào hai số nguyên `a` và `b` trên hai dòng (với `b > 0`). Hãy in ra hai dòng:\n- Dòng 1: Phần nguyên của phép chia `a // b` theo mẫu: `Phan nguyen: {kq}`\n- Dòng 2: Phần dư của phép chia `a % b` theo mẫu: `Phan du: {kq}`',
          starterCode: 'a = int(input())\nb = int(input())\n# Tính phần nguyên và phần dư\n',
          expectedLearningOutcome: 'Sử dụng thành thạo hai toán tử // và %.',
          skillTags: ['python_arithmetic', 'floor_division', 'modulus'],
          hints: [
            'print(f"Phan nguyen: {a // b}")',
            'print(f"Phan du: {a % b}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-03-01-samp-1',
              exerciseId: 'ex-03-01',
              inputData: '17\n5',
              expectedOutput: 'Phan nguyen: 3\nPhan du: 2',
              explanation: '17 // 5 = 3 và 17 % 5 = 2.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-03-02',
          lessonId: 'lesson-03-01-toan-tu-so-hoc',
          topicId: 'topic-03-so-hoc-va-toan-tu',
          slug: 'tinh-luy-thua-a-mu-b',
          title: 'Tính lũy thừa a mũ b',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào hai số nguyên `a` (cơ số) và `b` (số mũ) trên hai dòng. Hãy sử dụng toán tử `**` để tính `a` mũ `b` và in kết quả ra màn hình.\n\nVí dụ input:\n`3`\n`4`\nOutput:\n`81` (vì 3^4 = 81).',
          starterCode: 'a = int(input())\nb = int(input())\n# Tính và in a ** b\n',
          expectedLearningOutcome: 'Áp dụng toán tử ** để tính lũy thừa.',
          skillTags: ['python_arithmetic', 'exponentiation'],
          hints: ['print(a ** b)'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-03-02-samp-1',
              exerciseId: 'ex-03-02',
              inputData: '3\n4',
              expectedOutput: '81',
              explanation: '3 ** 4 = 81',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-03-02-so-sanh-va-logic',
      topicId: 'topic-03-so-hoc-va-toan-tu',
      slug: 'toan-tu-so-sanh-va-logic',
      title: 'Bài 02: Toán tử so sánh & Toán tử logic (and, or, not)',
      theoryContent: `**1. Toán tử so sánh (Comparison Operators)**: Luôn trả về giá trị kiểu \`bool\` (\`True\` hoặc \`False\`):
- \`==\` : So sánh bằng (\`5 == 5\` -> \`True\`)
- \`!=\` : So sánh khác / không bằng (\`5 != 3\` -> \`True\`)
- \`>\` : Lớn hơn, \`<\` : Nhỏ hơn
- \`>=\` : Lớn hơn hoặc bằng, \`<=\` : Nhỏ hơn hoặc bằng

**2. Toán tử logic (Logical Operators)**: Kết hợp các mệnh đề điều kiện:
- **\`and\`**: Trả về \`True\` nếu **TẤT CẢ** các điều kiện đều đúng.
- **\`or\`**: Trả về \`True\` nếu có **ÍT NHẤT MỘT** điều kiện đúng.
- **\`not\`**: Đảo ngược giá trị logic (\`not True\` -> \`False\`, \`not False\` -> \`True\`).

**Đặc sản Python**: Cho phép viết biểu thức so sánh kép liên tục dạng toán học: \`10 <= x <= 20\` thay vì bắt buộc viết \`x >= 10 and x <= 20\`!`,
      learningObjectives: [
        'Phân biệt dấu gán (=) và dấu so sánh bằng (==).',
        'Vận dụng thành thạo 3 toán tử logic: and, or, not.',
        'Sử dụng cú pháp so sánh chuỗi liên hoàn trong Python (Chained comparisons).',
      ],
      prerequisites: [
        'Đã hiểu kiểu dữ liệu boolean (True, False).',
      ],
      codeExamples: [
        {
          title: 'Kiểm tra độ tuổi hợp lệ',
          code: 'tuoi = 15\nco_ve = True\ncho_phep = (tuoi >= 14) and co_ve\nprint("Duoc vao xem phim:", cho_phep)',
          expectedOutput: 'Duoc vao xem phim: True',
          explanation: 'Cả hai điều kiện đều True nên kết quả phép and là True.',
        },
        {
          title: 'So sánh kép kiểu Python',
          code: 'diem = 8.5\nprint("Dat loai gioi:", 8.0 <= diem <= 10.0)',
          expectedOutput: 'Dat loai gioi: True',
          explanation: '8.0 <= 8.5 <= 10.0 là biểu thức hợp lệ trong Python.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Dùng dấu gán thay cho so sánh: if a = 5',
          explanation: 'Dấu = là phép gán giá trị, phép so sánh phải dùng hai dấu bằng ==.',
          fix: 'Luôn dùng == khi muốn so sánh bằng.',
        },
      ],
      guidedPracticeTask: {
        title: 'Kiểm tra số chẵn dương',
        instructions: 'Nhập một số nguyên n. In ra True nếu n là số dương và là số chẵn, ngược lại in False.',
        hint: 'print(n > 0 and n % 2 == 0)',
      },
      recap: [
        'Toán tử so sánh trả về True hoặc False.',
        'and đòi hỏi mọi vế đúng, or chỉ cần 1 vế đúng, not đảo ngược.',
        'Python hỗ trợ cú pháp so sánh kép liên hoàn (a < x < b).',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Logical Operators',
          url: 'https://www.w3schools.com/python/gloss_python_logical_operators.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-03-03',
          lessonId: 'lesson-03-02-so-sanh-va-logic',
          topicId: 'topic-03-so-hoc-va-toan-tu',
          slug: 'kiem-tra-so-chan',
          title: 'Kiểm tra tính chẵn lẻ',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào một số nguyên `n`. Hãy in ra màn hình `True` nếu `n` là số chẵn, hoặc `False` nếu `n` là số lẻ bằng cách so sánh phần dư của `n % 2` với `0`.',
          starterCode: 'n = int(input())\n# In ra True nếu chẵn, False nếu lẻ\n',
          expectedLearningOutcome: 'Biết cách kết hợp toán tử % và toán tử so sánh ==.',
          skillTags: ['python_comparison', 'modulus', 'boolean_logic'],
          hints: ['print(n % 2 == 0)'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-03-03-samp-1',
              exerciseId: 'ex-03-03',
              inputData: '8',
              expectedOutput: 'True',
              explanation: '8 chia 2 dư 0, kết quả là True.',
              orderIndex: 1,
            },
            {
              id: 'ex-03-03-samp-2',
              exerciseId: 'ex-03-03',
              inputData: '7',
              expectedOutput: 'False',
              explanation: '7 chia 2 dư 1, kết quả là False.',
              orderIndex: 2,
            },
          ],
        },
        {
          id: 'ex-03-04',
          lessonId: 'lesson-03-02-so-sanh-va-logic',
          topicId: 'topic-03-so-hoc-va-toan-tu',
          slug: 'kiem-tra-trong-khoang',
          title: 'Kiểm tra giá trị trong khoảng',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một số nguyên `x`. Hãy kiểm tra xem `x` có nằm trong đoạn từ `10` đến `100` (bao gồm cả 10 và 100) hay không. In ra `True` nếu thuộc khoảng, ngược lại in `False`.',
          starterCode: 'x = int(input())\n# Kiểm tra 10 <= x <= 100\n',
          expectedLearningOutcome: 'Thực hành biểu thức so sánh kép liên hoàn trong Python.',
          skillTags: ['python_comparison', 'chained_comparison'],
          hints: ['print(10 <= x <= 100)'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-03-04-samp-1',
              exerciseId: 'ex-03-04',
              inputData: '45',
              expectedOutput: 'True',
              explanation: '10 <= 45 <= 100 là True.',
              orderIndex: 1,
            },
            {
              id: 'ex-03-04-samp-2',
              exerciseId: 'ex-03-04',
              inputData: '5',
              expectedOutput: 'False',
              explanation: '5 nhỏ hơn 10 nên là False.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-03-03-toan-tu-gan-thu-tu',
      topicId: 'topic-03-so-hoc-va-toan-tu',
      slug: 'toan-tu-gan-va-thu-tu-tinh-toan',
      title: 'Bài 03: Toán tử gán rút gọn & Thứ tự thực hiện phép tính (PEMDAS)',
      theoryContent: `**1. Toán tử gán rút gọn (Augmented Assignment)**:
Thay vì viết \`x = x + 5\`, ta có thể viết ngắn gọn hơn là \`x += 5\`.
Tương tự:
- \`x -= 3\` tương đương \`x = x - 3\`
- \`x *= 2\` tương đương \`x = x * 2\`
- \`x //= 2\` tương đương \`x = x // 2\`
- \`x %= 10\` tương đương \`x = x % 10\`
- \`x **= 2\` tương đương \`x = x ** 2\`

**2. Thứ tự ưu tiên thực hiện phép tính (PEMDAS)**:
Khi một biểu thức có nhiều phép toán, Python thực hiện theo thứ tự ưu tiên từ cao xuống thấp:
1. **P (Parentheses)**: Cặp ngoặc đơn \`()\` luôn được tính trước tiên.
2. **E (Exponents)**: Lũy thừa \`**\`.
3. **MD (Multiplication & Division)**: Nhân, chia, chia nguyên, chia dư (\`*\`, \`/\`, \`//\`, \`%\`) có cùng cấp ưu tiên, tính từ trái sang phải.
4. **AS (Addition & Subtraction)**: Cộng và trừ (\`+\`, \`-\`) tính sau cùng từ trái sang phải.`,
      learningObjectives: [
        'Viết mã nguồn ngắn gọn hơn với các toán tử gán rút gọn (+=, -=, *=, //=).',
        'Nắm vững quy tắc thứ tự ưu tiên PEMDAS để tránh sai sót kết quả tính toán.',
        'Sử dụng ngoặc đơn () một cách chủ động để làm rõ nghĩa biểu thức.',
      ],
      prerequisites: [
        'Đã học các phép toán số học.',
      ],
      codeExamples: [
        {
          title: 'Sử dụng toán tử gán rút gọn',
          code: 'so_tien = 100\nso_tien += 50\nso_tien -= 20\nprint("So tien con lai:", so_tien)',
          expectedOutput: 'So tien con lai: 130',
          explanation: '100 + 50 = 150, sau đó 150 - 20 = 130.',
        },
        {
          title: 'Ảnh hưởng của cặp ngoặc đơn',
          code: 'kq1 = 2 + 3 * 4\nkq2 = (2 + 3) * 4\nprint("Khong ngoac:", kq1)\nprint("Co ngoac:", kq2)',
          expectedOutput: 'Khong ngoac: 14\nCo ngoac: 20',
          explanation: 'kq1 nhân trước cộng sau (3*4 + 2 = 14). kq2 ngoặc tính trước (5 * 4 = 20).',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên ngoặc khi tính trung bình: (a + b) / 2 viết thành a + b / 2',
          explanation: 'a + b / 2 sẽ chia b cho 2 trước rồi mới cộng với a, dẫn đến sai logic.',
          fix: 'Bọc tổng trong ngoặc: (a + b) / 2',
        },
      ],
      guidedPracticeTask: {
        title: 'Tính chu vi hình chữ nhật',
        instructions: 'Nhập chiều dài d và chiều rộng r. Tính chu vi theo công thức (d + r) * 2.',
        hint: 'd = int(input()); r = int(input()); print((d + r) * 2)',
      },
      recap: [
        'x += n tăng giá trị x lên n đơn vị.',
        'Quy tắc PEMDAS: Ngoặc -> Mũ -> Nhân/Chia -> Cộng/Trừ.',
        'Khi nghi ngờ về thứ tự, hãy dùng ngoặc đơn () để bảo đảm an toàn.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Assignment Operators',
          url: 'https://www.w3schools.com/python/gloss_python_assignment_operators.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-03-05',
          lessonId: 'lesson-03-03-toan-tu-gan-thu-tu',
          topicId: 'topic-03-so-hoc-va-toan-tu',
          slug: 'tinh-trung-binh-cong-ba-mon',
          title: 'Tính trung bình cộng 3 môn học',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào điểm số của 3 môn học: Toán, Văn, Anh trên 3 dòng riêng biệt (các số thực `float`). Hãy tính điểm trung bình cộng theo công thức `(toan + van + anh) / 3` và in ra kết quả làm tròn 2 chữ số thập phân bằng `round(dtb, 2)`.',
          starterCode: 'toan = float(input())\nvan = float(input())\nanh = float(input())\n# Tính điểm trung bình và in kết quả\n',
          expectedLearningOutcome: 'Ứng dụng cặp ngoặc đơn để bảo đảm thứ tự phép tính trong bài toán thực tế.',
          skillTags: ['python_arithmetic', 'operator_precedence', 'float_rounding'],
          hints: [
            'dtb = (toan + van + anh) / 3',
            'print(round(dtb, 2))',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-03-05-samp-1',
              exerciseId: 'ex-03-05',
              inputData: '8.0\n7.5\n9.0',
              expectedOutput: '8.17',
              explanation: '(8.0 + 7.5 + 9.0) / 3 = 8.1666... làm tròn 2 chữ số là 8.17',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-03-04-membership-identity',
      topicId: 'topic-03-so-hoc-va-toan-tu',
      slug: 'membership-va-identity',
      title: 'Bài 04: Toán tử thành viên (in, not in) & Định danh (is, is not)',
      theoryContent: `**1. Toán tử thành viên (Membership Operators)**:
Kiểm tra xem một giá trị hoặc một chuỗi con có nằm bên trong một tập hợp dữ liệu (chuỗi, danh sách, tuple) hay không:
- **\`in\`**: Trả về \`True\` nếu phần tử xuất hiện trong tập hợp.
  Ví dụ: \`"py" in "python"\` -> \`True\`.
- **\`not in\`**: Trả về \`True\` nếu phần tử **KHÔNG** xuất hiện trong tập hợp.
  Ví dụ: \`"java" not in "python"\` -> \`True\`.

**2. Toán tử định danh (Identity Operators)**:
So sánh xem hai biến có trỏ đến **cùng một ô nhớ trong bộ nhớ RAM** hay không:
- **\`is\`**: \`True\` nếu hai biến trỏ cùng một đối tượng ô nhớ.
- **\`is not\`**: \`True\` nếu hai biến trỏ khác đối tượng ô nhớ.
*Lưu ý*: Khác với \`==\` so sánh về mặt giá trị, \`is\` so sánh về mặt địa chỉ ô nhớ. Thường dùng nhất để kiểm tra biến có mang giá trị đặc biệt \`None\` hay không (\`x is None\`).`,
      learningObjectives: [
        'Kiểm tra sự tồn tại của ký tự/từ khóa trong chuỗi bằng in và not in.',
        'Phân biệt sự khác nhau giữa so sánh giá trị (==) và so sánh định danh (is).',
        'Kiểm tra an toàn giá trị rỗng None bằng cú pháp x is None.',
      ],
      prerequisites: [
        'Đã hiểu toán tử so sánh.',
      ],
      codeExamples: [
        {
          title: 'Kiểm tra ký tự trong từ khóa',
          code: 'chuoi = "CodeCoBUG"\nprint("Co chu BUG:", "BUG" in chuoi)\nprint("Co chu Java:", "Java" in chuoi)',
          expectedOutput: 'Co chu BUG: True\nCo chu Java: False',
          explanation: '"BUG" có nằm trong "CodeCoBUG", còn "Java" thì không.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Dùng == để so sánh với None: if x == None',
          explanation: 'Dù chạy được, nhưng chuẩn PEP 8 khuyến nghị luôn dùng is None.',
          fix: 'Dùng if x is None hoặc if x is not None.',
        },
      ],
      guidedPracticeTask: {
        title: 'Phát hiện từ cấm',
        instructions: 'Nhập một câu bình luận. In ra True nếu trong câu có chứa từ "spam", ngược lại in False.',
        hint: 'print("spam" in input().lower())',
      },
      recap: [
        'in và not in kiểm tra sự tồn tại của phần tử trong tập hợp hoặc chuỗi con.',
        '== so sánh nội dung giá trị, is so sánh địa chỉ bộ nhớ.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Membership Operators',
          url: 'https://www.w3schools.com/python/gloss_python_membership_operators.asp',
        },
      ],
      orderIndex: 4,
      isPublished: true,
      exercises: [
        {
          id: 'ex-03-06',
          lessonId: 'lesson-03-04-membership-identity',
          topicId: 'topic-03-so-hoc-va-toan-tu',
          slug: 'kiem-tra-tu-khoa-trong-chuoi',
          title: 'Kiểm tra từ khóa trong văn bản',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một dòng văn bản từ bàn phím. Hãy sử dụng toán tử `in` để kiểm tra xem từ khóa `"Python"` có xuất hiện trong đoạn văn bản đó hay không (phân biệt hoa thường). In ra `True` nếu có, ngược lại in `False`.',
          starterCode: 'van_ban = input()\n# Kiểm tra từ khóa "Python" có trong van_ban không\n',
          expectedLearningOutcome: 'Ứng dụng toán tử in để tìm kiếm sự tồn tại của từ khóa trong văn bản.',
          skillTags: ['python_membership', 'string_search'],
          hints: ['print("Python" in van_ban)'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-03-06-samp-1',
              exerciseId: 'ex-03-06',
              inputData: 'Hoc lap trinh Python rat vui',
              expectedOutput: 'True',
              explanation: 'Có chứa từ "Python".',
              orderIndex: 1,
            },
            {
              id: 'ex-03-06-samp-2',
              exerciseId: 'ex-03-06',
              inputData: 'Hoc lap trinh C++',
              expectedOutput: 'False',
              explanation: 'Không chứa từ "Python".',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};

