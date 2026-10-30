import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_04_STRINGS: Topic = {
  id: 'topic-04-chuoi',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-04-chuoi',
  title: 'Chủ đề 04: Xử lý chuỗi ký tự (Strings)',
  summary: 'Làm chủ kiểu dữ liệu chuỗi trong Python: Kỹ thuật chỉ mục (indexing), cắt lát (slicing), các phương thức xử lý văn bản chuyên nghiệp và định dạng chuỗi f-string.',
  orderIndex: 4,
  category: 'Chuỗi & Văn bản',
  isPublished: true,
  isLocked: false,
  accentColor: 'peach',
  lessons: [
    {
      id: 'lesson-04-01-indexing-slicing',
      topicId: 'topic-04-chuoi',
      slug: 'indexing-va-slicing-chuoi',
      title: 'Bài 01: Chỉ mục (Indexing) & Cắt lát chuỗi (Slicing)',
      theoryContent: `Trong Python, chuỗi ký tự (\`str\`) là một chuỗi các ký tự bất biến (immutable) được đánh số thứ tự chỉ mục:
1. **Chỉ mục dương (từ trái qua phải)**: Bắt đầu từ \`0\` cho ký tự đầu tiên, \`1\` cho ký tự thứ hai...
2. **Chỉ mục âm (từ phải qua trái)**: \`-1\` là ký tự cuối cùng, \`-2\` là ký tự kế cuối...
3. **Độ dài chuỗi**: Dùng hàm \`len(s)\` để lấy số lượng ký tự.

**Kỹ thuật cắt lát (Slicing) cú pháp: \`s[start:stop:step]\`**:
- \`start\`: Chỉ mục bắt đầu (bao gồm).
- \`stop\`: Chỉ mục kết thúc (**không bao gồm**).
- \`step\`: Bước nhảy (mặc định là 1).
- Mẹo kinh điển: \`s[::-1]\` dùng để đảo ngược toàn bộ chuỗi!`,
      learningObjectives: [
        'Truy cập từng ký tự bằng chỉ mục dương và chỉ mục âm.',
        'Sử dụng slicing s[start:stop] để trích xuất chuỗi con.',
        'Đảo ngược chuỗi bằng bước nhảy âm s[::-1].',
      ],
      prerequisites: [
        'Đã học biến và kiểu dữ liệu str.',
      ],
      codeExamples: [
        {
          title: 'Truy cập ký tự và cắt chuỗi',
          code: 's = "CodeCoBUG"\nprint("Ky tu dau:", s[0])\nprint("Ky tu cuoi:", s[-1])\nprint("4 ky tu dau:", s[0:4])\nprint("Dao nguoc:", s[::-1])',
          expectedOutput: 'Ky tu dau: C\nKy tu cuoi: G\n4 ky tu dau: Code\nDao nguoc: GUBcoEdoC',
          explanation: 's[0:4] lấy các vị trí 0, 1, 2, 3 (tức "Code").',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Chỉ mục vượt quá giới hạn: s = "Hi"; print(s[5])',
          explanation: 'Gây lỗi IndexError: string index out of range.',
          fix: 'Kiểm tra độ dài bằng len(s) trước khi truy cập chỉ mục.',
        },
        {
          mistake: 'Gán trực tiếp ký tự mới: s[0] = "X"',
          explanation: 'Chuỗi trong Python là bất biến (immutable), không thể sửa từng ký tự tại chỗ.',
          fix: 'Tạo chuỗi mới: s = "X" + s[1:]',
        },
      ],
      guidedPracticeTask: {
        title: 'Cắt 3 ký tự đầu và 3 ký tự cuối',
        instructions: 'Nhập một chuỗi có ít nhất 6 ký tự. In ra 3 ký tự đầu và 3 ký tự cuối.',
        hint: 'dau = s[:3]; cuoi = s[-3:]',
      },
      recap: [
        'Chỉ mục bắt đầu từ 0; chỉ mục -1 là ký tự cuối.',
        's[start:end] lấy từ start đến end - 1.',
        's[::-1] đảo ngược chuỗi.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Slicing Strings',
          url: 'https://www.w3schools.com/python/python_strings_slicing.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-04-01',
          lessonId: 'lesson-04-01-indexing-slicing',
          topicId: 'topic-04-chuoi',
          slug: 'lay-ky-tu-dau-va-cuoi',
          title: 'Lấy ký tự đầu và ký tự cuối',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào một chuỗi `s` từ bàn phím (độ dài >= 2). Hãy in ra hai dòng:\n- Dòng 1: Ký tự đầu tiên `s[0]`\n- Dòng 2: Ký tự cuối cùng `s[-1]`',
          starterCode: 's = input()\n# In ký tự đầu và cuối\n',
          expectedLearningOutcome: 'Sử dụng chỉ mục dương 0 và chỉ mục âm -1.',
          skillTags: ['python_strings', 'string_indexing'],
          hints: ['print(s[0])\nprint(s[-1])'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-04-01-samp-1',
              exerciseId: 'ex-04-01',
              inputData: 'Python',
              expectedOutput: 'P\nn',
              explanation: 'Đầu là "P", cuối là "n".',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-04-02',
          lessonId: 'lesson-04-01-indexing-slicing',
          topicId: 'topic-04-chuoi',
          slug: 'dao-nguoc-chuoi-ky-tu',
          title: 'Đảo ngược chuỗi ký tự',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một chuỗi `s`. Hãy sử dụng kỹ thuật slicing `s[::-1]` để đảo ngược chuỗi và in kết quả ra màn hình.\n\nVí dụ input: `hello` -> Output: `olleh`.',
          starterCode: 's = input()\n# Đảo ngược chuỗi và in kết quả\n',
          expectedLearningOutcome: 'Nắm vững bước nhảy âm trong slicing để đảo ngược chuỗi.',
          skillTags: ['python_strings', 'string_slicing'],
          hints: ['print(s[::-1])'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-04-02-samp-1',
              exerciseId: 'ex-04-02',
              inputData: 'hello',
              expectedOutput: 'olleh',
              explanation: 'Đảo ngược các ký tự.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-04-02-phuong-thuc-chuoi',
      topicId: 'topic-04-chuoi',
      slug: 'cac-phuong-thuc-chuoi-pho-bien',
      title: 'Bài 02: Các phương thức xử lý chuỗi phổ biến',
      theoryContent: `Python tích hợp sẵn rất nhiều phương thức mạnh mẽ dành cho chuỗi:
- **\`s.upper()\`**: Chuyển toàn bộ thành chữ in hoa.
- **\`s.lower()\`**: Chuyển toàn bộ thành chữ in thường.
- **\`s.strip()\`**: Cắt bỏ khoảng trắng thừa ở hai đầu chuỗi.
- **\`s.replace(old, new)\`**: Thay thế tất cả chuỗi con \`old\` bằng \`new\`.
- **\`s.count(sub)\`**: Đếm số lần xuất hiện của \`sub\` trong chuỗi.
- **\`s.find(sub)\`**: Tìm vị trí đầu tiên của \`sub\` (trả về \`-1\` nếu không thấy).
- **\`s.split(sep)\`**: Tách chuỗi thành danh sách các từ.
- **\`sep.join(list)\`**: Nối các phần tử trong danh sách thành một chuỗi duy nhất.`,
      learningObjectives: [
        'Biết cách chuyển đổi hoa/thường để so sánh không phân biệt hoa thường.',
        'Làm sạch dữ liệu nhập vào bằng .strip().',
        'Thay thế nội dung bằng .replace() và tách/nối từ bằng .split() và .join().',
      ],
      prerequisites: [
        'Đã hiểu khái niệm chuỗi ký tự.',
      ],
      codeExamples: [
        {
          title: 'Chuẩn hóa văn bản',
          code: 'msg = "  Xin Chao The Gioi  "\nclean = msg.strip().lower()\nprint("Lam sach:", clean)\nprint("Thay the:", clean.replace("the gioi", "Python"))',
          expectedOutput: 'Lam sach: xin chao the gioi\nThay the: xin chao Python',
          explanation: 'strip() bỏ khoảng trắng 2 đầu, lower() đưa về chữ thường, replace() đổi từ.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Tưởng các phương thức sửa đổi chuỗi gốc: s = "abc"; s.upper()',
          explanation: 'Vì chuỗi là bất biến, s.upper() trả về chuỗi mới mà không làm thay đổi biến s.',
          fix: 'Gán lại vào biến: s = s.upper()',
        },
      ],
      guidedPracticeTask: {
        title: 'Đếm số lượng chữ cái "a"',
        instructions: 'Nhập một câu văn và in ra số lượng chữ "a" (cả hoa lẫn thường) xuất hiện trong câu.',
        hint: 'cau = input().lower(); print(cau.count("a"))',
      },
      recap: [
        'upper() và lower() đổi kiểu chữ hoa/thường.',
        'strip() dọn sạch khoảng trắng ở hai đầu.',
        'replace(a, b) thay thế nội dung, count() đếm số lần xuất hiện.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python String Methods',
          url: 'https://www.w3schools.com/python/python_strings_methods.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-04-03',
          lessonId: 'lesson-04-02-phuong-thuc-chuoi',
          topicId: 'topic-04-chuoi',
          slug: 'chuan-hoa-in-hoa-va-in-thuong',
          title: 'In hoa và in thường',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào một chuỗi `s`. Hãy in ra 2 dòng:\n- Dòng 1: Toàn bộ chữ IN HOA bằng `s.upper()`\n- Dòng 2: Toàn bộ chữ in thường bằng `s.lower()`',
          starterCode: 's = input()\n# In hoa và in thường\n',
          expectedLearningOutcome: 'Thực hành các phương thức chuyển đổi kiểu chữ.',
          skillTags: ['python_strings', 'string_methods'],
          hints: ['print(s.upper())\nprint(s.lower())'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-04-03-samp-1',
              exerciseId: 'ex-04-03',
              inputData: 'Python Mastery',
              expectedOutput: 'PYTHON MASTERY\npython mastery',
              explanation: 'Dòng 1 in hoa, dòng 2 in thường.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-04-04',
          lessonId: 'lesson-04-02-phuong-thuc-chuoi',
          topicId: 'topic-04-chuoi',
          slug: 'thay-the-tu-trong-cau',
          title: 'Thay thế từ trong câu',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một câu văn trên dòng 1, từ cần thay thế trên dòng 2, và từ mới trên dòng 3. Hãy sử dụng phương thức `s.replace(old, new)` để thay thế và in câu sau khi đổi ra màn hình.',
          starterCode: 'cau = input()\ntu_cu = input()\ntu_moi = input()\n# Thay thế và in kết quả\n',
          expectedLearningOutcome: 'Sử dụng phương thức replace để xử lý văn bản động.',
          skillTags: ['python_strings', 'string_replace'],
          hints: ['print(cau.replace(tu_cu, tu_moi))'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-04-04-samp-1',
              exerciseId: 'ex-04-04',
              inputData: 'Toi thich hoc Pascal\nPascal\nPython',
              expectedOutput: 'Toi thich hoc Python',
              explanation: 'Đổi "Pascal" thành "Python".',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-04-03-dinh-dang-chuoi',
      topicId: 'topic-04-chuoi',
      slug: 'dinh-dang-chuoi-fstring',
      title: 'Bài 03: Định dạng chuỗi nâng cao (f-strings)',
      theoryContent: `Kể từ Python 3.6, **f-strings (Formatted String Literals)** là cách định dạng chuỗi được ưa chuộng nhất nhờ tốc độ nhanh, cú pháp trực quan và dễ bảo trì.
Cú pháp: Đặt chữ \`f\` hoặc \`F\` ngay trước dấu ngoặc kép, và đặt biểu thức hoặc biến bên trong cặp ngoặc nhọn \`{bien}\`.

**Các định dạng nâng cao với f-string**:
1. Làm tròn số thực: \`f"{pi:.2f}"\` -> \`"3.14"\` (làm tròn 2 chữ số thập phân).
2. Thêm số 0 ở đầu (padding): \`f"{so:04d}"\` -> \`"0042"\` (độ rộng 4 ký tự, bù số 0).
3. Căn lề trái/phải: \`f"{ten:>10}"\` (căn phải 10 ký tự), \`f"{ten:<10}"\` (căn trái 10 ký tự).`,
      learningObjectives: [
        'Hiểu và làm chủ cú pháp f-strings.',
        'Định dạng số thực với số chữ số thập phân mong muốn ({x:.2f}).',
        'Căn chỉnh độ rộng văn bản chuyên nghiệp.',
      ],
      prerequisites: [
        'Đã học biến và kiểu dữ liệu.',
      ],
      codeExamples: [
        {
          title: 'Định dạng số thực và căn lề',
          code: 'gia_tien = 150000.5\nma_don = 7\nprint(f"Ma don: {ma_don:03d}")\nprint(f"Gia: {gia_tien:,.2f} VND")',
          expectedOutput: 'Ma don: 007\nGia: 150,000.50 VND',
          explanation: ':03d thêm số 0, :,.2f thêm dấu phẩy ngăn cách hàng nghìn và 2 chữ số thập phân.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên chữ f ở đầu: "{ten} la hoc vien"',
          explanation: 'Nếu thiếu chữ f, Python chỉ hiểu đây là chuỗi bình thường chứa ký tự {ten}.',
          fix: 'Luôn thêm tiền tố f: f"{ten} la hoc vien"',
        },
      ],
      guidedPracticeTask: {
        title: 'In hóa đơn tinh gọn',
        instructions: 'Nhập tên mặt hàng và đơn giá (float). In ra hóa đơn với đơn giá định dạng 2 chữ số thập phân.',
        hint: 'print(f"Mon hang: {ten} | Don gia: {gia:.2f}")',
      },
      recap: [
        'f-strings là chuẩn hiện đại và nhanh nhất để định dạng chuỗi.',
        '{x:.nf} làm tròn n chữ số thập phân.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python String Formatting',
          url: 'https://www.w3schools.com/python/python_string_formatting.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-04-05',
          lessonId: 'lesson-04-03-dinh-dang-chuoi',
          topicId: 'topic-04-chuoi',
          slug: 'dinh-dang-so-thap-phan-fstring',
          title: 'Định dạng số thập phân với f-string',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào bán kính hình tròn `r` (số thực). Hãy tính diện tích hình tròn theo công thức `dien_tich = 3.14159 * r * r` và in ra kết quả định dạng đúng 2 chữ số thập phân bằng cú pháp f-string:\n`Dien tich: {dien_tich:.2f}`',
          starterCode: 'r = float(input())\n# Tính diện tích và in theo f-string\n',
          expectedLearningOutcome: 'Làm chủ cú pháp f-string {dien_tich:.2f}.',
          skillTags: ['python_strings', 'f_strings', 'float_formatting'],
          hints: [
            'dt = 3.14159 * r * r',
            'print(f"Dien tich: {dt:.2f}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-04-05-samp-1',
              exerciseId: 'ex-04-05',
              inputData: '5.0',
              expectedOutput: 'Dien tich: 78.54',
              explanation: '3.14159 * 25 = 78.53975 làm tròn 2 chữ số là 78.54',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-04-04-kiem-tra-palindrome',
      topicId: 'topic-04-chuoi',
      slug: 'bai-toan-chuoi-palindrome',
      title: 'Bài 04: Bài toán chuỗi đối xứng (Palindrome)',
      theoryContent: `**Chuỗi đối xứng (Palindrome)** là chuỗi mà khi đọc từ trái sang phải hay từ phải sang trái đều hoàn toàn giống nhau.
Ví dụ: \`"radar"\`, \`"level"\`, \`"madam"\`, \`"12321"\` là các chuỗi đối xứng.

Trong Python, nhờ kỹ thuật slicing đảo ngược \`s[::-1]\`, việc kiểm tra một chuỗi có phải là palindrome hay không trở nên vô cùng ngắn gọn và thanh lịch:
\`is_palindrome = (s == s[::-1])\`

Nếu bài toán yêu cầu không phân biệt chữ hoa chữ thường, ta chỉ việc đưa chuỗi về dạng chữ thường trước:
\`clean_s = s.lower()\`
\`is_palindrome = (clean_s == clean_s[::-1])\``,
      learningObjectives: [
        'Hiểu khái niệm chuỗi đối xứng (Palindrome).',
        'Ứng dụng slicing đảo chuỗi để giải quyết bài toán thuật toán kinh điển.',
      ],
      prerequisites: [
        'Đã học slicing và toán tử so sánh ==.',
      ],
      codeExamples: [
        {
          title: 'Kiểm tra chuỗi đối xứng',
          code: 'w = "radar"\nprint(f"\'{w}\' la palindrome:", w == w[::-1])',
          expectedOutput: "'radar' la palindrome: True",
          explanation: '"radar" đọc ngược lại vẫn là "radar".',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên xử lý chữ hoa/thường: "Madam" so với "madam"',
          explanation: '"Madam" đảo ngược thành "madaM" sẽ bị so sánh False nếu không dùng .lower().',
          fix: 'Dùng s.lower() == s.lower()[::-1] khi cần bỏ qua chữ hoa thường.',
        },
      ],
      guidedPracticeTask: {
        title: 'Kiểm tra số đối xứng',
        instructions: 'Nhập một số nguyên dưới dạng chuỗi và kiểm tra xem số đó có đối xứng hay không.',
        hint: 'num_str = input(); print(num_str == num_str[::-1])',
      },
      recap: [
        'Chuỗi đối xứng khi s == s[::-1].',
        'Kỹ thuật này áp dụng được cho cả chuỗi chữ lẫn chuỗi số.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Strings Tutorial',
          url: 'https://www.w3schools.com/python/python_strings.asp',
        },
      ],
      orderIndex: 4,
      isPublished: true,
      exercises: [
        {
          id: 'ex-04-06',
          lessonId: 'lesson-04-04-kiem-tra-palindrome',
          topicId: 'topic-04-chuoi',
          slug: 'kiem-tra-chuoi-doi-xung',
          title: 'Kiểm tra chuỗi đối xứng (Palindrome)',
          difficulty: 'medium',
          points: 20,
          description: 'Nhập vào một từ hoặc chuỗi `s` (chỉ gồm các chữ cái viết liền). Hãy kiểm tra xem chuỗi đó có phải là chuỗi đối xứng (Palindrome) hay không (không phân biệt chữ hoa chữ thường). In ra `True` nếu đúng là đối xứng, ngược lại in `False`.',
          starterCode: 's = input()\n# Kiểm tra chuỗi đối xứng không phân biệt hoa thường\n',
          expectedLearningOutcome: 'Kết hợp .lower() và slicing [::-1] để giải quyết bài toán chuỗi đối xứng.',
          skillTags: ['python_strings', 'palindrome', 'algorithms'],
          hints: [
            's_clean = s.lower()',
            'print(s_clean == s_clean[::-1])',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-04-06-samp-1',
              exerciseId: 'ex-04-06',
              inputData: 'Madam',
              expectedOutput: 'True',
              explanation: '"Madam" chuyển sang thường là "madam", đối xứng qua tâm.',
              orderIndex: 1,
            },
            {
              id: 'ex-04-06-samp-2',
              exerciseId: 'ex-04-06',
              inputData: 'Python',
              expectedOutput: 'False',
              explanation: '"Python" không phải là chuỗi đối xứng.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};

