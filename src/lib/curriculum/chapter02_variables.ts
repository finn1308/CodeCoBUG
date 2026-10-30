import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_02_VARIABLES: Topic = {
  id: 'topic-02-bien-va-kieu-du-lieu',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-02-bien-va-kieu-du-lieu',
  title: 'Chủ đề 02: Biến và kiểu dữ liệu',
  summary: 'Làm chủ khái niệm biến nhớ, các kiểu dữ liệu nguyên thủy (int, float, str, bool), kỹ thuật ép kiểu và kiểm tra kiểu dữ liệu trong Python.',
  orderIndex: 2,
  category: 'Cơ sở dữ liệu & Biến',
  isPublished: true,
  isLocked: false,
  accentColor: 'sky',
  lessons: [
    {
      id: 'lesson-02-01-khai-bao-bien',
      topicId: 'topic-02-bien-va-kieu-du-lieu',
      slug: 'khai-bao-bien-va-quy-tac-dat-ten',
      title: 'Bài 01: Khai báo biến & Quy tắc đặt tên (PEP 8)',
      theoryContent: `Trong Python, **biến (Variable)** là tên gọi đại diện cho một vùng ô nhớ lưu trữ giá trị dữ liệu. Không giống như C++ hay Java đòi hỏi khai báo kiểu tường minh (như \`int x = 5;\`), Python là ngôn ngữ có kiểu dữ liệu động (dynamically typed) — biến được tự động tạo ra ngay khi bạn gán giá trị cho nó bằng dấu bằng \`=\`.

**Quy tắc đặt tên biến chuẩn trong Python (PEP 8)**:
1. Tên biến chỉ được chứa chữ cái (a-z, A-Z), chữ số (0-9) và dấu gạch dưới \`_\`.
2. Tên biến **KHÔNG ĐƯỢC** bắt đầu bằng chữ số (ví dụ: \`1diem\` là sai, phải là \`diem_1\`).
3. Python phân biệt chữ hoa và chữ thường: \`tuoi\`, \`Tuoi\` và \`TUOI\` là 3 biến hoàn toàn khác nhau.
4. Không được đặt tên biến trùng với các từ khóa dành riêng của Python (như \`if\`, \`for\`, \`class\`, \`import\`, \`def\`, \`print\`).
5. Phong cách khuyến nghị: sử dụng chữ thường nối nhau bởi dấu gạch dưới (snake_case), ví dụ: \`so_luong\`, \`ho_va_ten\`.`,
      learningObjectives: [
        'Hiểu cơ chế cấp phát biến tự động trong Python.',
        'Tuân thủ quy tắc đặt tên hợp lệ và chuẩn phong cách snake_case.',
        'Biết cách cập nhật và gán lại giá trị mới cho biến.',
      ],
      prerequisites: [
        'Đã hoàn thành Chủ đề 01: Làm quen với Python.',
      ],
      codeExamples: [
        {
          title: 'Khai báo và in giá trị của biến',
          code: 'ten_khoa_hoc = "Python Co Ban"\nso_bai_hoc = 12\nprint(ten_khoa_hoc)\nprint(so_bai_hoc)',
          expectedOutput: 'Python Co Ban\n12',
          explanation: 'Tạo hai biến ten_khoa_hoc và so_bai_hoc rồi xuất giá trị ra màn hình.',
        },
        {
          title: 'Cập nhật giá trị mới cho biến',
          code: 'diem = 8\nprint("Ban dau:", diem)\ndiem = 10\nprint("Sau khi cong:", diem)',
          expectedOutput: 'Ban dau: 8\nSau khi cong: 10',
          explanation: 'Biến có thể thay đổi giá trị linh hoạt trong suốt vòng đời chương trình.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Đặt tên biến có dấu cách: ho va ten = "An"',
          explanation: 'Tên biến không được chứa dấu cách.',
          fix: 'Dùng dấu gạch dưới thay thế: ho_va_ten = "An"',
        },
        {
          mistake: 'Bắt đầu bằng chữ số: 2ban = "Bao & Chau"',
          explanation: 'Cú pháp Python báo lỗi SyntaxError: invalid decimal literal.',
          fix: 'Đổi chữ số ra phía sau: hai_ban = "Bao & Chau" hoặc ban_2 = ...',
        },
      ],
      guidedPracticeTask: {
        title: 'Thực hành tạo biến thông tin sản phẩm',
        instructions: 'Khai báo 3 biến: ten_san_pham, gia_tien, so_luong và in ra theo từng dòng.',
        hint: 'Gán chuỗi vào ngoặc kép và gán số nguyên không cần ngoặc kép.',
      },
      recap: [
        'Biến được tạo tự động khi gán giá trị bằng toán tử =.',
        'Quy ước đặt tên biến chuẩn trong Python là snake_case.',
        'Tên biến phân biệt chữ hoa/thường và không bắt đầu bằng số.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Variables',
          url: 'https://www.w3schools.com/python/python_variables.asp',
        },
        {
          title: 'W3Schools Python Variable Names',
          url: 'https://www.w3schools.com/python/python_variables_names.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-02-01',
          lessonId: 'lesson-02-01-khai-bao-bien',
          topicId: 'topic-02-bien-va-kieu-du-lieu',
          slug: 'khai-bao-va-xuat-bien',
          title: 'Khai báo và in biến',
          difficulty: 'very_easy',
          points: 10,
          description: 'Hãy khai báo biến `ngon_ngu = "Python"` và biến `nam_ra_doi = 1991`. Sau đó in ra 2 dòng:\n`Ngon ngu: Python`\n`Nam ra doi: 1991`',
          starterCode: '# Khai báo biến và in ra màn hình\n',
          expectedLearningOutcome: 'Biết cách khai báo biến chuỗi và biến số nguyên rồi in ra màn hình kèm nhãn.',
          skillTags: ['python_variables', 'python_print_syntax'],
          hints: [
            'Dùng f-string: print(f"Ngon ngu: {ngon_ngu}")',
            'In năm ra đời ở dòng tiếp theo: print(f"Nam ra doi: {nam_ra_doi}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-02-01-samp-1',
              exerciseId: 'ex-02-01',
              inputData: '',
              expectedOutput: 'Ngon ngu: Python\nNam ra doi: 1991',
              explanation: 'In giá trị của 2 biến theo định dạng mẫu.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-02-02',
          lessonId: 'lesson-02-01-khai-bao-bien',
          topicId: 'topic-02-bien-va-kieu-du-lieu',
          slug: 'cap-nhat-gia-tri-bien',
          title: 'Cập nhật giá trị biến',
          difficulty: 'easy',
          points: 15,
          description: 'Chương trình đọc vào một số nguyên từ bàn phím đại diện cho điểm cộng. Khai báo biến `diem_so = 50`. Hãy cộng thêm số điểm vừa đọc vào `diem_so` và in ra kết quả cuối cùng theo định dạng: `Diem tong: {diem_so}`.',
          starterCode: 'diem_so = 50\ndiem_cong = int(input())\n# Cập nhật điểm và in kết quả\n',
          expectedLearningOutcome: 'Hiểu cách lấy giá trị hiện tại của biến, cộng thêm và ghi đè lại vào chính biến đó.',
          skillTags: ['python_variables', 'variable_reassignment'],
          hints: [
            'diem_so = diem_so + diem_cong',
            'In ra với print(f"Diem tong: {diem_so}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-02-02-samp-1',
              exerciseId: 'ex-02-02',
              inputData: '25',
              expectedOutput: 'Diem tong: 75',
              explanation: '50 + 25 = 75',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-02-02-kieu-du-lieu-co-ban',
      topicId: 'topic-02-bien-va-kieu-du-lieu',
      slug: 'cac-kieu-du-lieu-co-ban',
      title: 'Bài 02: Các kiểu dữ liệu cơ bản (int, float, str, bool)',
      theoryContent: `Trong Python có 4 kiểu dữ liệu cơ bản thường gặp nhất:
1. **\`int\` (Integer)**: Số nguyên dương, âm hoặc bằng 0, không có phần thập phân (ví dụ: \`42\`, \`-7\`, \`0\`).
2. **\`float\` (Floating point)**: Số thực có chứa dấu phẩy thập phân (trong lập trình dùng dấu chấm \`.\`, ví dụ: \`3.14\`, \`-0.5\`, \`2.0\`).
3. **\`str\` (String)**: Chuỗi ký tự đặt trong dấu ngoặc kép \`"..."\` hoặc ngoặc đơn \`'...'\\ (ví dụ: \`"Ha Noi"\`, \`'CodeCoBUG'\`).
4. **\`bool\` (Boolean)**: Kiểu logic chỉ mang 1 trong 2 giá trị: \`True\` (Đúng) hoặc \`False\` (Sai). Chú ý phải viết hoa chữ cái đầu!

Bạn có thể dùng hàm **\`type(bien)\`** để kiểm tra kiểu dữ liệu thực tế của bất kỳ giá trị nào trong lúc chạy.`,
      learningObjectives: [
        'Phân biệt rõ ràng 4 kiểu dữ liệu: int, float, str, bool.',
        'Sử dụng hàm type() để xác định kiểu dữ liệu của biến.',
        'Hiểu tầm quan trọng của kiểu dữ liệu khi thực hiện các phép toán.',
      ],
      prerequisites: [
        'Đã biết cách khai báo biến.',
      ],
      codeExamples: [
        {
          title: 'Kiểm tra kiểu dữ liệu với type()',
          code: 'x = 10\ny = 3.14\nz = "Chao"\nt = True\nprint(type(x))\nprint(type(y))\nprint(type(z))\nprint(type(t))',
          expectedOutput: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
          explanation: 'Hàm type() trả về lớp kiểu dữ liệu tương ứng.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Viết thường giá trị boolean: x = true',
          explanation: 'Python báo lỗi NameError: name "true" is not defined vì chỉ nhận diện True và False.',
          fix: 'Viết hoa chữ cái đầu: x = True',
        },
      ],
      guidedPracticeTask: {
        title: 'Xác định kiểu dữ liệu',
        instructions: 'Đoán kiểu dữ liệu của giá trị "123.45" (chú ý có dấu ngoặc kép) và dùng type() để kiểm chứng.',
        hint: 'Bất kỳ giá trị nào nằm trong ngoặc kép đều là chuỗi str.',
      },
      recap: [
        'int là số nguyên, float là số thực có dấu chấm.',
        'str là chuỗi ký tự, bool gồm True hoặc False.',
        'type(x) dùng để kiểm tra kiểu của x.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Data Types',
          url: 'https://www.w3schools.com/python/python_datatypes.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-02-03',
          lessonId: 'lesson-02-02-kieu-du-lieu-co-ban',
          topicId: 'topic-02-bien-va-kieu-du-lieu',
          slug: 'in-kieu-du-lieu',
          title: 'In kiểu dữ liệu của biến',
          difficulty: 'very_easy',
          points: 10,
          description: 'Khai báo biến `pi = 3.14159`. Hãy in ra màn hình kiểu dữ liệu của biến `pi` bằng cách sử dụng hàm `type()`. Kết quả in ra dạng: `<class \'float\'>`.',
          starterCode: 'pi = 3.14159\n# In kiểu dữ liệu của biến pi\n',
          expectedLearningOutcome: 'Biết cách sử dụng hàm type() kết hợp với print() để xem kiểu thực tế.',
          skillTags: ['python_data_types', 'type_inspection'],
          hints: ['print(type(pi))'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-02-03-samp-1',
              exerciseId: 'ex-02-03',
              inputData: '',
              expectedOutput: "<class 'float'>",
              explanation: 'Kiểu của số thực 3.14159 là float.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-02-04',
          lessonId: 'lesson-02-02-kieu-du-lieu-co-ban',
          topicId: 'topic-02-bien-va-kieu-du-lieu',
          slug: 'thong-tin-hoc-vien',
          title: 'Thông tin học viên đa kiểu dữ liệu',
          difficulty: 'easy',
          points: 15,
          description: 'Khai báo 4 biến đại diện cho hồ sơ học viên:\n- `ho_ten = "Le Anh"` (str)\n- `tuoi = 16` (int)\n- `diem_tb = 8.75` (float)\n- `da_tot_nghiep = False` (bool)\n\nHãy in ra 4 dòng thông tin theo mẫu:\n`Ho ten: Le Anh`\n`Tuoi: 16`\n`Diem TB: 8.75`\n`Tot nghiep: False`',
          starterCode: '# Khai báo 4 biến và in ra màn hình\n',
          expectedLearningOutcome: 'Thực hành tạo và xuất biến thuộc đầy đủ 4 kiểu dữ liệu cơ bản.',
          skillTags: ['python_data_types', 'multiline_output'],
          hints: [
            'Dùng f-string hoặc in kết hợp chuỗi: print(f"Ho ten: {ho_ten}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-02-04-samp-1',
              exerciseId: 'ex-02-04',
              inputData: '',
              expectedOutput: 'Ho ten: Le Anh\nTuoi: 16\nDiem TB: 8.75\nTot nghiep: False',
              explanation: 'In đủ 4 dòng thông tin theo đúng định dạng.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-02-03-ep-kieu-du-lieu',
      topicId: 'topic-02-bien-va-kieu-du-lieu',
      slug: 'kiem-tra-va-ep-kieu-du-lieu',
      title: 'Bài 03: Ép kiểu dữ liệu (Type Casting)',
      theoryContent: `**Ép kiểu (Type Casting)** là kỹ thuật chuyển đổi giá trị từ kiểu dữ liệu này sang kiểu dữ liệu khác. Đây là kỹ năng cực kỳ quan trọng vì hàm \`input()\` luôn trả về chuỗi (\`str\`), do đó nếu muốn tính toán số học, ta bắt buộc phải ép sang \`int\` hoặc \`float\`.

Các hàm ép kiểu tiêu biểu:
- **\`int(x)\`**: Chuyển số thực hoặc chuỗi số nguyên thành số nguyên (ví dụ: \`int("42")\` -> \`42\`, \`int(7.9)\` -> \`7\` cắt bỏ phần thập phân).
- **\`float(x)\`**: Chuyển số nguyên hoặc chuỗi số thành số thực (ví dụ: \`float("3.5")\` -> \`3.5\`, \`float(5)\` -> \`5.0\`).
- **\`str(x)\`**: Chuyển bất kỳ giá trị nào thành chuỗi văn bản (ví dụ: \`str(100)\` -> \`"100"\`).
- **\`bool(x)\`**: Chuyển thành True/False. Quy tắc: số \`0\`, chuỗi rỗng \`""\` sẽ thành \`False\`; các giá trị khác \`0\` hoặc chuỗi có ký tự sẽ thành \`True\`.`,
      learningObjectives: [
        'Sử dụng thành thạo các hàm int(), float(), str(), bool().',
        'Giải quyết triệt để vấn đề cộng chuỗi ngoài ý muốn khi nhập số từ input().',
        'Hiểu quy tắc ép kiểu số thực sang số nguyên (cắt cụt phần thập phân).',
      ],
      prerequisites: [
        'Đã hiểu về 4 kiểu dữ liệu cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Sự khác biệt giữa cộng chuỗi và cộng số',
          code: 'a = "10"\nb = "20"\nprint("Khi chua ep kieu:", a + b)\nprint("Sau khi ep kieu:", int(a) + int(b))',
          expectedOutput: 'Khi chua ep kieu: 1020\nSau khi ep kieu: 30',
          explanation: '"10" + "20" là nối 2 chuỗi thành "1020". Sau khi ép sang int, 10 + 20 là phép cộng số học ra 30.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Ép chuỗi số thực sang int trực tiếp: int("3.14")',
          explanation: 'Python sẽ báo ValueError vì int() chỉ phân tích được chuỗi chứa số nguyên thuần túy.',
          fix: 'Cần ép sang float trước: int(float("3.14")) hoặc float("3.14")',
        },
      ],
      guidedPracticeTask: {
        title: 'Tính tổng 2 số thực',
        instructions: 'Đọc vào 2 dòng chứa số thực và in ra tổng của chúng.',
        hint: 'Dùng float(input()) cho cả 2 dòng.',
      },
      recap: [
        'int() chuyển về số nguyên, float() chuyển về số thực.',
        'str() chuyển về chuỗi, bool() kiểm tra giá trị chân lý.',
        'Muốn tính toán từ input(), luôn nhớ bọc int(input()) hoặc float(input()).',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Casting',
          url: 'https://www.w3schools.com/python/python_casting.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-02-05',
          lessonId: 'lesson-02-03-ep-kieu-du-lieu',
          topicId: 'topic-02-bien-va-kieu-du-lieu',
          slug: 'tinh-tong-hai-so-nguyen',
          title: 'Tính tổng hai số nguyên',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào hai số nguyên `a` và `b` trên hai dòng riêng biệt. Hãy tính và in ra tổng của hai số đó.\n\nVí dụ input:\n`15`\n`25`\nOutput:\n`40`',
          starterCode: '# Nhập 2 số nguyên và in ra tổng\n',
          expectedLearningOutcome: 'Biết cách dùng int(input()) để nhận số nguyên từ bàn phím và tính tổng.',
          skillTags: ['python_type_casting', 'arithmetic_addition'],
          hints: [
            'a = int(input())',
            'b = int(input())',
            'print(a + b)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-02-05-samp-1',
              exerciseId: 'ex-02-05',
              inputData: '15\n25',
              expectedOutput: '40',
              explanation: '15 + 25 = 40',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-02-06',
          lessonId: 'lesson-02-03-ep-kieu-du-lieu',
          topicId: 'topic-02-bien-va-kieu-du-lieu',
          slug: 'chuyen-doi-nhiet-do-c-sang-f',
          title: 'Chuyển đổi nhiệt độ C sang F',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào nhiệt độ theo thang đo Celsius (số thực `float`). Công thức đổi sang Fahrenheit là: `F = C * 1.8 + 32`.\nHãy tính và in ra nhiệt độ Fahrenheit tương ứng (làm tròn 1 chữ số thập phân bằng hàm `round(F, 1)`).\n\nVí dụ: Input `25.0` -> Output `77.0`.',
          starterCode: '# Nhập nhiệt độ C và đổi sang F\nc = float(input())\n',
          expectedLearningOutcome: 'Thực hành ép kiểu số thực float và áp dụng công thức toán học.',
          skillTags: ['python_type_casting', 'float_math'],
          hints: [
            'f = c * 1.8 + 32',
            'print(round(f, 1))',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-02-06-samp-1',
              exerciseId: 'ex-02-06',
              inputData: '25.0',
              expectedOutput: '77.0',
              explanation: '25.0 * 1.8 + 32 = 77.0',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-02-04-gan-nhieu-bien',
      topicId: 'topic-02-bien-va-kieu-du-lieu',
      slug: 'gan-nhieu-bien-va-nhap-xuat',
      title: 'Bài 04: Gán nhiều biến & Nhập xuất đồng thời',
      theoryContent: `Một trong những nét đẹp độc đáo của Python là cú pháp **Gán nhiều biến trên cùng một dòng (Multiple Assignment / Unpacking)**.

1. **Gán nhiều giá trị cho nhiều biến**:
   \`x, y, z = "Cam", "Chuoi", "Tao"\`
   Python sẽ tự động gán lần lượt theo đúng thứ tự.
2. **Gán một giá trị cho nhiều biến**:
   \`a = b = c = 0\`
   Cả ba biến \`a\`, \`b\`, \`c\` đều trỏ tới giá trị 0.
3. **Đọc nhiều giá trị trên 1 dòng với \`input().split()\`**:
   Khi đề bài cho các giá trị nằm trên cùng một dòng cách nhau bằng khoảng trắng, ta dùng:
   \`a, b = input().split()\`
   Nếu là số nguyên: \`a, b = map(int, input().split())\``,
      learningObjectives: [
        'Sử dụng cú pháp gán đồng thời x, y = a, b.',
        'Kỹ thuật hoán vị giá trị hai biến a, b = b, a mà không cần biến phụ.',
        'Đọc nhiều số trên cùng 1 dòng bằng input().split() và map(int, ...).',
      ],
      prerequisites: [
        'Đã học bài ép kiểu dữ liệu.',
      ],
      codeExamples: [
        {
          title: 'Hoán đổi hai biến phong cách Pythonic',
          code: 'a = 5\nb = 10\na, b = b, a\nprint("a =", a, "b =", b)',
          expectedOutput: 'a = 10 b = 5',
          explanation: 'a nhận giá trị của b và b nhận giá trị của a đồng thời.',
        },
        {
          title: 'Đọc 2 số trên cùng 1 dòng',
          code: 'x, y = map(int, input().split())\nprint("Tich:", x * y)',
          expectedOutput: 'Tich: 20 (với input "4 5")',
          explanation: 'input().split() tách chuỗi theo khoảng trắng, map(int, ...) biến đổi từng phần tử sang số nguyên.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Số lượng biến không khớp số giá trị: x, y = 1, 2, 3',
          explanation: 'Python sẽ báo ValueError: too many values to unpack (expected 2).',
          fix: 'Số lượng biến ở vế trái phải bằng đúng số lượng giá trị ở vế phải.',
        },
      ],
      guidedPracticeTask: {
        title: 'Nhập tọa độ 2D',
        instructions: 'Nhập hai số x và y trên cùng 1 dòng cách nhau bởi dấu cách và in ra tọa độ (x, y).',
        hint: 'x, y = map(int, input().split()); print(f"({x}, {y})")',
      },
      recap: [
        'x, y = a, b gán đồng thời nhiều biến.',
        'a, b = b, a hoán đổi giá trị tức thì không cần biến tạm.',
        'map(int, input().split()) đọc nhiều số trên cùng 1 dòng.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Assign Multiple Values',
          url: 'https://www.w3schools.com/python/python_variables_multiple.asp',
        },
      ],
      orderIndex: 4,
      isPublished: true,
      exercises: [
        {
          id: 'ex-02-07',
          lessonId: 'lesson-02-04-gan-nhieu-bien',
          topicId: 'topic-02-bien-va-kieu-du-lieu',
          slug: 'gan-ba-bien-cung-gia-tri',
          title: 'Gán cùng một giá trị cho ba biến',
          difficulty: 'very_easy',
          points: 10,
          description: 'Sử dụng cú pháp gán liên tiếp `a = b = c = ...` để gán giá trị chuỗi `"Python"` cho cả 3 biến `a`, `b`, `c`. Sau đó in ra 3 dòng:\n`a: Python`\n`b: Python`\n`c: Python`',
          starterCode: '# Gán liên tiếp a = b = c và in kết quả\n',
          expectedLearningOutcome: 'Nắm được kỹ thuật gán một giá trị cho nhiều biến cùng lúc.',
          skillTags: ['python_variables', 'multiple_assignment'],
          hints: ['a = b = c = "Python"'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-02-07-samp-1',
              exerciseId: 'ex-02-07',
              inputData: '',
              expectedOutput: 'a: Python\nb: Python\nc: Python',
              explanation: 'Cả 3 biến mang cùng giá trị "Python".',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-02-08',
          lessonId: 'lesson-02-04-gan-nhieu-bien',
          topicId: 'topic-02-bien-va-kieu-du-lieu',
          slug: 'tong-hai-so-cung-dong',
          title: 'Đọc và tính tổng 2 số trên cùng một dòng',
          difficulty: 'easy',
          points: 15,
          description: 'Chương trình nhận vào hai số nguyên `a` và `b` nằm trên **CÙNG MỘT DÒNG** cách nhau bằng một dấu cách (ví dụ: `10 20`). Hãy sử dụng `map(int, input().split())` để đọc và in ra tổng `a + b`.',
          starterCode: '# Đọc 2 số trên cùng 1 dòng và in tổng\n',
          expectedLearningOutcome: 'Làm chủ kỹ thuật đọc nhiều số trên cùng 1 dòng bằng input().split() và map.',
          skillTags: ['python_input_split', 'map_function'],
          hints: [
            'a, b = map(int, input().split())',
            'print(a + b)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-02-08-samp-1',
              exerciseId: 'ex-02-08',
              inputData: '10 20',
              expectedOutput: '30',
              explanation: '10 + 20 = 30',
              orderIndex: 1,
            },
            {
              id: 'ex-02-08-samp-2',
              exerciseId: 'ex-02-08',
              inputData: '-5 15',
              expectedOutput: '10',
              explanation: '-5 + 15 = 10',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};
