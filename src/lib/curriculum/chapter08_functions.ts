import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_08_FUNCTIONS: Topic = {
  id: 'topic-08-ham-functions',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-08-ham-functions',
  title: 'Chủ đề 08: Hàm trong Python (Functions)',
  summary: 'Tổ chức mã nguồn sạch sẽ, tái sử dụng và module hóa: Định nghĩa hàm với def, tham số mặc định, *args/**kwargs, hàm ẩn danh lambda và thuật toán đệ quy.',
  orderIndex: 8,
  category: 'Cấu trúc chương trình',
  isPublished: true,
  isLocked: false,
  accentColor: 'lavender',
  lessons: [
    {
      id: 'lesson-08-01-dinh-nghia-ham-return',
      topicId: 'topic-08-ham-functions',
      slug: 'dinh-nghia-ham-va-return',
      title: 'Bài 01: Định nghĩa hàm với def và giá trị trả về return',
      theoryContent: `Trong lập trình, nguyên tắc **DRY (Don't Repeat Yourself - Đừng lặp lại chính mình)** là quy chuẩn hàng đầu. Hàm (Function) cho phép đóng gói một khối mã thực hiện một nhiệm vụ cụ thể để có thể tái sử dụng nhiều lần.

Cú pháp:
\`\`\`python
def ten_ham(tham_so_1, tham_so_2):
    # Thân hàm
    ket_qua = tham_so_1 + tham_so_2
    return ket_qua # Trả về giá trị
\`\`\`

**Phân biệt \`print()\` và \`return\`**:
- \`print()\`: Chỉ hiển thị kết quả ra màn hình (dành cho người xem). Hàm không lưu lại giá trị tính toán.
- \`return\`: Đưa giá trị tính toán trở lại nơi hàm được gọi, cho phép gán kết quả vào biến khác hoặc dùng tiếp trong các phép tính toán sau.`,
      learningObjectives: [
        'Hiểu nguyên lý đóng gói mã nguồn và tái sử dụng với hàm.',
        'Khai báo hàm với từ khóa def, truyền tham số và trả về kết quả bằng return.',
        'Phân biệt rạch ròi giữa in ấn (print) và trả về giá trị (return).',
      ],
      prerequisites: [
        'Đã nắm vững biến, kiểu dữ liệu và cấu trúc điều khiển cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Hàm tính bình phương',
          code: 'def binh_phuong(x):\n    return x * x\n\nkq = binh_phuong(5)\nprint("Ket qua:", kq)',
          expectedOutput: 'Ket qua: 25',
          explanation: 'Hàm nhận x = 5 và trả về 25, gán vào biến kq.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên từ khóa return trong hàm tính toán',
          explanation: 'Nếu không có return, hàm trong Python sẽ tự động trả về giá trị None.',
          fix: 'Luôn dùng return khi muốn hàm cung cấp kết quả tính toán cho bên ngoài.',
        },
      ],
      guidedPracticeTask: {
        title: 'Hàm chào hỏi cá nhân hóa',
        instructions: 'Định nghĩa hàm xin_chao(ten) trả về chuỗi f"Xin chao, {ten}!".',
        hint: 'def xin_chao(ten): return f"Xin chao, {ten}!"',
      },
      recap: [
        'Hàm bắt đầu bằng def, theo sau là tên hàm và cặp ngoặc đơn ().',
        'Lệnh return kết thúc hàm và trả lại kết quả.',
        'Một hàm không có return sẽ trả về None.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Functions',
          url: 'https://www.w3schools.com/python/python_functions.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-08-01',
          lessonId: 'lesson-08-01-dinh-nghia-ham-return',
          topicId: 'topic-08-ham-functions',
          slug: 'tinh-dien-tich-hinh-chu-nhat-ham',
          title: 'Hàm tính diện tích hình chữ nhật',
          difficulty: 'very_easy',
          points: 10,
          description: 'Viết một chương trình Python định nghĩa hàm `tinh_dien_tich(dai, rong)` nhận vào chiều dài và chiều rộng (số thực), trả về diện tích của hình chữ nhật.\n\nSau đó đọc 2 số thực từ bàn phím (mỗi số trên một dòng: chiều dài, rồi chiều rộng), gọi hàm và in diện tích ra màn hình.',
          starterCode: 'def tinh_dien_tich(dai, rong):\n    # Hoàn thành hàm trả về diện tích\n    pass\n\nd = float(input())\nr = float(input())\nprint(tinh_dien_tich(d, r))\n',
          expectedLearningOutcome: 'Định nghĩa hàm chuẩn cú pháp, nhận tham số và trả về kết quả bằng return.',
          skillTags: ['python_functions', 'def_keyword', 'return_statement'],
          hints: [
            'def tinh_dien_tich(dai, rong):\n    return dai * rong',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-08-01-samp-1',
              exerciseId: 'ex-08-01',
              inputData: '5\n4',
              expectedOutput: '20.0',
              explanation: '5.0 * 4.0 = 20.0.',
              orderIndex: 1,
            },
            {
              id: 'ex-08-01-samp-2',
              exerciseId: 'ex-08-01',
              inputData: '3.5\n2.0',
              expectedOutput: '7.0',
              explanation: '3.5 * 2.0 = 7.0.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-08-02-tham-so-mac-dinh-va-args-kwargs',
      topicId: 'topic-08-ham-functions',
      slug: 'tham-so-mac-dinh-va-args-kwargs',
      title: 'Bài 02: Tham số mặc định & Đối số biến thiên (*args, **kwargs)',
      theoryContent: `Python cung cấp cơ chế truyền tham số linh hoạt:
1. **Tham số mặc định (Default Parameters)**: Cho phép gán giá trị mặc định nếu người gọi không truyền đối số tương ứng. (Lưu ý: tham số mặc định phải đặt sau các tham số bắt buộc).
2. **\`*args\` (Arbitrary Positional Arguments)**: Gom toàn bộ các đối số vị trí dư thừa thành một \`tuple\`.
3. **\`**kwargs\` (Arbitrary Keyword Arguments)**: Gom toàn bộ các đối số đặt tên thành một \`dict\`.

Ví dụ minh họa:
\`\`\`python
def tong_tat_ca(*args):
    # args là một tuple chứa tất cả các đối số truyền vào
    return sum(args)

print(tong_tat_ca(1, 2, 3))       # 6
print(tong_tat_ca(10, 20, 30, 40)) # 100
\`\`\``,
      learningObjectives: [
        'Sử dụng tham số mặc định để hàm linh hoạt hơn.',
        'Sử dụng *args để nhận số lượng đối số tùy ý dưới dạng tuple.',
        'Hiểu và phân biệt vị trí khai báo của tham số cố định và tham số tùy chọn.',
      ],
      prerequisites: [
        'Đã học tuple và định nghĩa hàm cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Hàm với tham số mặc định',
          code: 'def chao(ten, loi_chao="Xin chao"):\n    return f"{loi_chao}, {ten}!"\n\nprint(chao("Nam"))\nprint(chao("Hoa", "Hi"))',
          expectedOutput: 'Xin chao, Nam!\nHi, Hoa!',
          explanation: 'Khi không truyền loi_chao, hàm dùng giá trị mặc định "Xin chao".',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Đặt tham số mặc định trước tham số bắt buộc: def fn(a=1, b):',
          explanation: 'Gây lỗi SyntaxError: non-default argument follows default argument.',
          fix: 'Luôn khai báo tham số không mặc định trước, tham số có giá trị mặc định ở sau cùng.',
        },
      ],
      guidedPracticeTask: {
        title: 'Hàm đếm số lượng đối số',
        instructions: 'Viết hàm dem_doi_so(*args) trả về len(args).',
        hint: 'def dem_doi_so(*args): return len(args)',
      },
      recap: [
        'Tham số mặc định giúp gọi hàm ngắn gọn hơn.',
        '*args thu thập các đối số vị trí thành tuple.',
        '**kwargs thu thập các đối số từ khóa thành dict.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Function Arguments',
          url: 'https://www.w3schools.com/python/python_functions.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-08-02',
          lessonId: 'lesson-08-02-tham-so-mac-dinh-va-args-kwargs',
          topicId: 'topic-08-ham-functions',
          slug: 'ham-tinh-tong-nhieu-so',
          title: 'Hàm tính tổng các đối số tùy ý với *args',
          difficulty: 'easy',
          points: 15,
          description: 'Viết hàm `tong_so(*args)` nhận vào số lượng tùy ý các số nguyên hoặc số thực và trả về tổng của tất cả các số đó (nếu không truyền đối số nào, trả về 0).\n\nSau đó đọc một dòng các số nguyên cách nhau bởi dấu cách từ bàn phím, chuyển thành danh sách và truyền vào hàm `tong_so(*danh_sach)` để in ra tổng.',
          starterCode: 'def tong_so(*args):\n    # Sử dụng args để tính tổng\n    pass\n\nnums = [int(x) for x in input().split()]\nprint(tong_so(*nums))\n',
          expectedLearningOutcome: 'Sử dụng toán tử giải nén * và tham số *args trong hàm.',
          skillTags: ['python_functions', 'args_kwargs', 'variable_length_arguments'],
          hints: [
            'def tong_so(*args):\n    return sum(args)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-08-02-samp-1',
              exerciseId: 'ex-08-02',
              inputData: '1 2 3 4 5',
              expectedOutput: '15',
              explanation: '1 + 2 + 3 + 4 + 5 = 15.',
              orderIndex: 1,
            },
            {
              id: 'ex-08-02-samp-2',
              exerciseId: 'ex-08-02',
              inputData: '10 20',
              expectedOutput: '30',
              explanation: '10 + 20 = 30.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-08-03-pham-vi-bien-va-lambda',
      topicId: 'topic-08-ham-functions',
      slug: 'pham-vi-bien-va-lambda',
      title: 'Bài 03: Phạm vi biến & Hàm ẩn danh lambda',
      theoryContent: `**1. Phạm vi biến (Variable Scope)**:
- **Biến cục bộ (Local variable)**: Khai báo bên trong hàm, chỉ tồn tại khi hàm đang chạy và không thể truy cập từ bên ngoài.
- **Biến toàn cục (Global variable)**: Khai báo ở ngoài hàm, mọi hàm đều có thể đọc được. Muốn thay đổi biến toàn cục bên trong hàm phải dùng từ khóa \`global\`.

**2. Hàm ẩn danh (Lambda Functions)**:
Hàm \`lambda\` là hàm ngắn gọn viết trên một dòng không cần tên định danh (\`def\`), rất phổ biến khi truyền làm hàm so sánh trong \`sorted()\`, \`map()\`, \`filter()\`.
Cú pháp: \`lambda tham_so: bieu_thuc\`

Ví dụ:
\`\`\`python
nhan_doi = lambda x: x * 2
print(nhan_doi(5)) # 10

# Sắp xếp danh sách theo phần tử thứ 2
hoc_sinh = [("An", 15), ("Binh", 14), ("Cuong", 16)]
hoc_sinh_sap_xep = sorted(hoc_sinh, key=lambda hs: hs[1])
# Kết quả sắp xếp theo tuổi: Binh (14), An (15), Cuong (16)
\`\`\``,
      learningObjectives: [
        'Phân biệt phạm vi hoạt động của biến toàn cục (global) và biến cục bộ (local).',
        'Viết hàm ẩn danh lambda ngắn gọn trên 1 dòng.',
        'Kết hợp lambda với hàm sorted(..., key=lambda) để tùy biến tiêu chí sắp xếp.',
      ],
      prerequisites: [
        'Đã học danh sách, tuple và hàm cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Sử dụng lambda làm tiêu chí sắp xếp',
          code: 'words = ["python", "c", "javascript", "go"]\nwords.sort(key=lambda s: len(s))\nprint(words)',
          expectedOutput: "['c', 'go', 'python', 'javascript']",
          explanation: 'Danh sách được sắp xếp theo độ dài chuỗi tăng dần.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Cố viết lệnh phức tạp hoặc nhiều dòng trong lambda',
          explanation: 'lambda chỉ chấp nhận một biểu thức tính toán duy nhất, không thể chứa vòng lặp for hay câu lệnh if-else phức tạp nhiều dòng.',
          fix: 'Với logic phức tạp nhiều dòng, hãy định nghĩa hàm bình thường với def.',
        },
      ],
      guidedPracticeTask: {
        title: 'Bình phương danh sách với map và lambda',
        instructions: 'Dùng list(map(lambda x: x*x, [1, 2, 3])) để tính danh sách bình phương.',
        hint: 'map(lambda x: x*x, lst)',
      },
      recap: [
        'Biến trong hàm là local, biến ngoài hàm là global.',
        'lambda là hàm ẩn danh một dòng: lambda x: x + 1.',
        'Thường dùng lambda làm khóa key cho sorted/sort.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Lambda',
          url: 'https://www.w3schools.com/python/python_lambda.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-08-03',
          lessonId: 'lesson-08-03-pham-vi-bien-va-lambda',
          topicId: 'topic-08-ham-functions',
          slug: 'sap-xep-theo-tuoi-lambda',
          title: 'Sắp xếp danh sách học sinh theo tuổi bằng lambda',
          difficulty: 'medium',
          points: 20,
          description: "Nhập vào một số nguyên `n` (số lượng học sinh). Trong `n` dòng tiếp theo, mỗi dòng gồm tên học sinh (chuỗi) và tuổi (số nguyên), cách nhau bởi dấu cách.\n\nHãy lưu thông tin dưới dạng danh sách các tuple `(ten, tuoi)`, sử dụng hàm `sorted()` kết hợp với biểu thức `lambda` làm `key` để sắp xếp danh sách theo thứ tự **tuổi tăng dần**.\nIn danh sách đã sắp xếp ra màn hình theo định dạng: `[(\\'Tên\\', Tuổi), ...]`",
          starterCode: 'n = int(input())\nhoc_sinh = []\nfor _ in range(n):\n    parts = input().split()\n    hoc_sinh.append((parts[0], int(parts[1])))\n\n# Sắp xếp danh sách hoc_sinh theo tuổi tăng dần bằng sorted và lambda\n',
          expectedLearningOutcome: 'Sử dụng hàm lambda làm đối số key trong hàm sorted.',
          skillTags: ['python_functions', 'lambda_expression', 'sorting_key', 'tuples'],
          hints: [
            'ket_qua = sorted(hoc_sinh, key=lambda item: item[1])\nprint(ket_qua)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-08-03-samp-1',
              exerciseId: 'ex-08-03',
              inputData: '3\nAn 16\nBinh 14\nCuong 15',
              expectedOutput: "[('Binh', 14), ('Cuong', 15), ('An', 16)]",
              explanation: 'Tuổi 14 < 15 < 16.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-08-04-de-quy-co-ban',
      topicId: 'topic-08-ham-functions',
      slug: 'de-quy-co-ban',
      title: 'Bài 04: Khái niệm hàm đệ quy (Recursion)',
      theoryContent: `**Đệ quy (Recursion)** là kỹ thuật lập trình trong đó một hàm tự gọi lại chính nó để giải quyết một bài toán con nhỏ hơn của chính bài toán ban đầu.

Mọi hàm đệ quy chuẩn mực đều phải có 2 phần bắt buộc:
1. **Trường hợp cơ sở (Base Case)**: Điều kiện dừng để hàm không gọi lại chính nó nữa (tránh tràn ngăn xếp bộ nhớ - RecursionError / Stack Overflow).
2. **Bước đệ quy (Recursive Step)**: Gọi lại hàm với dữ liệu đầu vào nhỏ dần về phía trường hợp cơ sở.

Ví dụ tính giai thừa $n! = n \\times (n-1)!$ với $0! = 1$:
\`\`\`python
def giai_thua(n):
    if n == 0 or n == 1:
        return 1 # Điều kiện dừng (Base case)
    return n * giai_thua(n - 1) # Bước đệ quy
\`\`\``,
      learningObjectives: [
        'Hiểu bản chất của đệ quy và cấu trúc ngăn xếp gọi hàm (Call Stack).',
        'Xác định chuẩn xác trường hợp cơ sở (Base case) để dừng đệ quy.',
        'Cài đặt thành công bài toán tính giai thừa và số Fibonacci bằng đệ quy.',
      ],
      prerequisites: [
        'Đã học định nghĩa hàm và câu lệnh if-else.',
      ],
      codeExamples: [
        {
          title: 'Hàm đệ quy tính tổng từ 1 đến n',
          code: 'def tong_de_quy(n):\n    if n <= 1:\n        return n\n    return n + tong_de_quy(n - 1)\n\nprint(tong_de_quy(5))',
          expectedOutput: '15',
          explanation: '5 + 4 + 3 + 2 + 1 = 15.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên viết điều kiện dừng (Base Case)',
          explanation: 'Dẫn đến hàm gọi nhau mãi mãi, gây lỗi RecursionError: maximum recursion depth exceeded.',
          fix: 'Luôn viết câu lệnh kiểm tra điều kiện dừng ở ngay đầu thân hàm.',
        },
      ],
      guidedPracticeTask: {
        title: 'Đếm lùi đệ quy',
        instructions: 'Viết hàm dem_lui(n): nếu n == 0 in "Het gio!", ngược lại in n và gọi dem_lui(n-1).',
        hint: 'if n == 0: print("Het gio!") else: print(n); dem_lui(n-1)',
      },
      recap: [
        'Đệ quy là hàm tự gọi chính mình.',
        'Base Case là điều kiện dừng bắt buộc.',
        'Đệ quy giúp giải quyết bài toán chia để trị thanh lịch.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Recursion',
          url: 'https://www.w3schools.com/python/python_functions.asp',
        },
      ],
      orderIndex: 4,
      isPublished: true,
      exercises: [
        {
          id: 'ex-08-04',
          lessonId: 'lesson-08-04-de-quy-co-ban',
          topicId: 'topic-08-ham-functions',
          slug: 'tinh-giai-thua-de-quy',
          title: 'Tính giai thừa N! bằng hàm đệ quy',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một số nguyên không âm `n` (`0 <= n <= 12`). Hãy định nghĩa hàm đệ quy `giai_thua(n)` để tính giá trị `n!` và in kết quả ra màn hình.\n\nBiết rằng: `0! = 1`, `1! = 1`, và `n! = n * (n - 1)!` với `n > 1`.',
          starterCode: 'def giai_thua(n):\n    # Hoàn thành hàm đệ quy tính n!\n    pass\n\nn = int(input())\nprint(giai_thua(n))\n',
          expectedLearningOutcome: 'Cài đặt thuật toán đệ quy có base case và recursive step chuẩn xác.',
          skillTags: ['python_functions', 'recursion', 'math_factorial'],
          hints: [
            'def giai_thua(n):\n    if n <= 1:\n        return 1\n    return n * giai_thua(n - 1)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-08-04-samp-1',
              exerciseId: 'ex-08-04',
              inputData: '5',
              expectedOutput: '120',
              explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.',
              orderIndex: 1,
            },
            {
              id: 'ex-08-04-samp-2',
              exerciseId: 'ex-08-04',
              inputData: '0',
              expectedOutput: '1',
              explanation: '0! = 1 theo quy ước toán học.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};
