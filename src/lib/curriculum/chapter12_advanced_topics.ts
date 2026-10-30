import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_12_ADVANCED_TOPICS: Topic = {
  id: 'topic-12-mo-rong-va-he-sinh-thai',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-12-mo-rong-va-he-sinh-thai',
  title: 'Chủ đề 12: Mở rộng sau nền tảng (Generators, Virtualenv & Hệ sinh thái)',
  summary: 'Bước đệm vững chắc vươn ra thế giới ứng dụng thực tế: Bộ sinh Generator với yield, quản lý gói phụ thuộc với pip & virtualenv, và tổng quan định hướng phát triển AI, Data Science và Web Backend.',
  orderIndex: 12,
  category: 'Mở rộng & Ứng dụng',
  isPublished: true,
  isLocked: false,
  accentColor: 'sky',
  lessons: [
    {
      id: 'lesson-12-01-generators-yield',
      topicId: 'topic-12-mo-rong-va-he-sinh-thai',
      slug: 'generators-va-tu-khoa-yield',
      title: 'Bài 01: Bộ sinh dữ liệu Generators và từ khóa yield',
      theoryContent: `Khi xử lý các tập dữ liệu khổng lồ (hàng triệu dòng), việc nạp toàn bộ danh sách vào bộ nhớ RAM bằng \`list\` sẽ gây tràn bộ nhớ (Out of Memory).

**Generators** là giải pháp tối ưu:
- Thay vì trả về toàn bộ danh sách một lần bằng \`return\`, generator sử dụng từ khóa **\`yield\`** để "tạm dừng" và trả về từng phần tử một tại thời điểm cần (Lazy Evaluation).
- Hàm generator trả về một đối tượng iterator có thể duyệt qua bằng vòng lặp \`for\` hoặc hàm \`next()\`.

Ví dụ:
\`\`\`python
def dem_so(n):
    for i in range(1, n + 1):
        yield i

for so in dem_so(3):
    print(so) # 1, 2, 3
\`\`\``,
      learningObjectives: [
        'Hiểu cơ chế tính toán lười (Lazy Evaluation) và tối ưu hóa bộ nhớ.',
        'Phân biệt giữa hàm thông thường dùng return và hàm generator dùng yield.',
        'Định nghĩa và duyệt qua các phần tử của generator bằng vòng lặp for.',
      ],
      prerequisites: [
        'Đã thành thạo hàm, vòng lặp for và danh sách.',
      ],
      codeExamples: [
        {
          title: 'Generator sinh số chẵn',
          code: 'def sinh_chan(limit):\n    n = 2\n    while n <= limit:\n        yield n\n        n += 2\n\nfor x in sinh_chan(6):\n    print(x, end=" ")',
          expectedOutput: '2 4 6 ',
          explanation: 'Mỗi lần lặp qua sinh_chan, giá trị n kế tiếp được sinh ra mà không tốn bộ nhớ lưu trữ cả mảng.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'In trực tiếp generator: print(sinh_chan(10))',
          explanation: 'Sẽ chỉ in ra <generator object sinh_chan at 0x...>. Generator cần được duyệt qua bằng for hoặc ép kiểu list() để xem giá trị.',
          fix: 'Duyệt bằng for x in gen: print(x) hoặc list(gen).',
        },
      ],
      guidedPracticeTask: {
        title: 'Generator đếm lùi',
        instructions: 'Viết generator dem_lui(n) yield từ n về 1.',
        hint: 'while n >= 1: yield n; n -= 1',
      },
      recap: [
        'yield trả về giá trị và lưu lại trạng thái thực thi hiện tại.',
        'Generators giúp tiết kiệm bộ nhớ tối đa cho dữ liệu lớn.',
        'Được kích hoạt từng bước thông qua vòng lặp for hoặc next().',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Iterators',
          url: 'https://www.w3schools.com/python/python_iterators.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-12-01',
          lessonId: 'lesson-12-01-generators-yield',
          topicId: 'topic-12-mo-rong-va-he-sinh-thai',
          slug: 'sinh-so-chinh-phuong-generator',
          title: 'Bộ sinh số chính phương với Generator',
          difficulty: 'easy',
          points: 15,
          description: 'Hãy định nghĩa một hàm generator `sinh_chinh_phuong(n)` nhận vào số nguyên dương `n`, lần lượt `yield` ra các số chính phương $i^2$ với $i$ chạy từ $1$ đến $n$.\n\nNhập vào số nguyên dương `n`. Gọi generator và dùng vòng lặp `for` để in mỗi số chính phương trên một dòng riêng biệt.',
          starterCode: 'def sinh_chinh_phuong(n):\n    # Sử dụng yield để sinh các số chính phương từ 1^2 đến n^2\n    pass\n\nn = int(input())\nfor so in sinh_chinh_phuong(n):\n    print(so)\n',
          expectedLearningOutcome: 'Sử dụng từ khóa yield để xây dựng generator function hiệu quả.',
          skillTags: ['python_advanced', 'generators', 'yield_keyword'],
          hints: [
            'def sinh_chinh_phuong(n):\n    for i in range(1, n + 1):\n        yield i * i',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-12-01-samp-1',
              exerciseId: 'ex-12-01',
              inputData: '4',
              expectedOutput: '1\n4\n9\n16',
              explanation: '1^2, 2^2, 3^2, 4^2.',
              orderIndex: 1,
            },
            {
              id: 'ex-12-01-samp-2',
              exerciseId: 'ex-12-01',
              inputData: '2',
              expectedOutput: '1\n4',
              explanation: '1 và 4.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-12-02-pip-va-moi-truong-ao',
      topicId: 'topic-12-mo-rong-va-he-sinh-thai',
      slug: 'pip-va-quan-ly-moi-truong-ao-venv',
      title: 'Bài 02: Quản lý gói phụ thuộc với pip & Môi trường ảo (venv)',
      theoryContent: `Khi phát triển dự án thực tế, chúng ta thường sử dụng hàng trăm thư viện bên ngoài (Third-party packages) như Requests, FastAPI, Pandas từ kho lưu trữ **PyPI (Python Package Index)**.

**1. Trình quản lý gói \`pip\`**:
- Cài đặt gói: \`pip install ten_goi\`
- Gỡ bỏ: \`pip uninstall ten_goi\`
- Tệp khóa phiên bản: \`requirements.txt\` (ví dụ: \`requests==2.31.0\`)
- Cài đặt từ file: \`pip install -r requirements.txt\`

**2. Môi trường ảo (Virtual Environment - venv)**:
Môi trường ảo giúp cô lập các thư viện của từng dự án riêng biệt, tránh xung đột phiên bản (Dependency Hell):
- Khởi tạo môi trường ảo: \`python -m venv .venv\`
- Kích hoạt trên macOS/Linux: \`source .venv/bin/activate\`
- Kích hoạt trên Windows: \`.venv\\Scripts\\activate\``,
      learningObjectives: [
        'Hiểu vai trò của pip và PyPI trong hệ sinh thái Python.',
        'Biết cách đọc và phân tích tệp đặc tả phụ thuộc requirements.txt.',
        'Hiểu mục đích tạo môi trường ảo venv để cô lập phiên bản thư viện.',
      ],
      prerequisites: [
        'Đã học cú pháp chuỗi ký tự và thao tác danh sách.',
      ],
      codeExamples: [
        {
          title: 'Phân tích dòng requirements.txt',
          code: 'line = "fastapi==0.110.0"\npkg, ver = line.split("==")\nprint(f"Goi: {pkg}, Phien ban: {ver}")',
          expectedOutput: 'Goi: fastapi, Phien ban: 0.110.0',
          explanation: 'Tách tên gói và phiên bản qua ký tự phân cách ==.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Cài đặt mọi gói thư viện vào môi trường hệ thống toàn cục (Global python)',
          explanation: 'Sẽ dẫn đến xung đột phiên bản khi hai dự án khác nhau yêu cầu hai phiên bản thư viện không tương thích.',
          fix: 'Luôn tạo và kích hoạt môi trường ảo riêng cho từng dự án phần mềm.',
        },
      ],
      guidedPracticeTask: {
        title: 'Tách tên package',
        instructions: 'Dòng "numpy>=1.24.0" tách tên bằng split(">=")[0].',
        hint: 'pkg = line.split(">=")[0]',
      },
      recap: [
        'pip là công cụ tải và cài đặt thư viện từ PyPI.',
        'requirements.txt ghi lại danh sách thư viện và phiên bản chính xác.',
        'venv cô lập môi trường của từng dự án độc lập.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python PIP',
          url: 'https://www.w3schools.com/python/python_pip.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-12-02',
          lessonId: 'lesson-12-02-pip-va-moi-truong-ao',
          topicId: 'topic-12-mo-rong-va-he-sinh-thai',
          slug: 'phan-tich-requirements-txt',
          title: 'Phân tích tệp cấu hình requirements.txt',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một số nguyên `n` (số dòng khai báo thư viện). Trong `n` dòng tiếp theo, mỗi dòng có định dạng: `<ten_goi>==<phien_ban>`.\n\nHãy phân tích và in ra thông tin của từng gói theo định dạng:\n`Goi: <ten_goi> (v<phien_ban>)`',
          starterCode: 'n = int(input())\n# Đọc n dòng và phân tích gói requirements.txt\n',
          expectedLearningOutcome: 'Xử lý chuỗi cấu hình tệp requirements.txt và trích xuất phiên bản thư viện.',
          skillTags: ['python_packaging', 'string_manipulation', 'requirements_txt'],
          hints: [
            'for _ in range(n):\n    line = input()\n    pkg, ver = line.split("==")\n    print(f"Goi: {pkg} (v{ver})")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-12-02-samp-1',
              exerciseId: 'ex-12-02',
              inputData: '2\nfastapi==0.110.0\nuvicorn==0.28.0',
              expectedOutput: 'Goi: fastapi (v0.110.0)\nGoi: uvicorn (v0.28.0)',
              explanation: 'Phân tách tên gói và phiên bản chuẩn xác.',
              orderIndex: 1,
            },
            {
              id: 'ex-12-02-samp-2',
              exerciseId: 'ex-12-02',
              inputData: '1\npandas==2.2.1',
              expectedOutput: 'Goi: pandas (v2.2.1)',
              explanation: 'In chuẩn mẫu.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-12-03-he-sinh-thai-va-dinh-huong',
      topicId: 'topic-12-mo-rong-va-he-sinh-thai',
      slug: 'tong-quan-he-sinh-thai-va-dinh-huong-tuong-lai',
      title: 'Bài 03: Hệ sinh thái Python & Định hướng tương lai (AI, Data, Web)',
      theoryContent: `Chúc mừng bạn đã hoàn thành lộ trình nền tảng Python! Python là một trong những ngôn ngữ lập trình phổ biến và được săn đón nhiều nhất hành tinh nhờ hệ sinh thái cực kỳ mạnh mẽ:

1. **Trí tuệ nhân tạo & Khoa học dữ liệu (Data Science & AI)**:
   - \`NumPy\`: Tính toán đại số tuyến tính và mảng nhiều chiều với tốc độ C tối ưu.
   - \`Pandas\`: Xử lý bảng dữ liệu dạng DataFrame lớn.
   - \`PyTorch / TensorFlow / scikit-learn\`: Xây dựng các mô hình học máy (Machine Learning) và Deep Learning.
2. **Phát triển Web Backend**:
   - \`FastAPI\`: Xây dựng REST API siêu nhanh, chuẩn OpenAPI tự động.
   - \`Django\`: Khung web "Pin có sẵn" đầy đủ cho các ứng dụng doanh nghiệp lớn.
3. **Tự động hóa & DevOps (Automation)**:
   - Tự động hóa quy trình, cào dữ liệu Web (\`Playwright\`, \`BeautifulSoup\`), quản lý hạ tầng đám mây.

**Tư duy thuật toán**:
Sau khóa học này, bạn hãy tiếp tục thực hành cấu trúc dữ liệu và giải thuật (LeetCode, Codeforces) và bắt tay vào xây dựng các dự án thực tế!`,
      learningObjectives: [
        'Nắm bắt bức tranh tổng thể các lĩnh vực ứng dụng của Python trong công nghiệp.',
        'Hiểu các chỉ số thống kê cơ bản thường gặp trong phân tích dữ liệu (Mean, Median).',
        'Có định hướng học tập chuyên sâu theo lộ trình mong muốn.',
      ],
      prerequisites: [
        'Đã hoàn thành toàn bộ các bài học trong giáo trình Python cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Tính trung bình cộng số liệu',
          code: 'data = [10, 20, 30, 40]\ntrung_binh = sum(data) / len(data)\nprint("Mean:", trung_binh)',
          expectedOutput: 'Mean: 25.0',
          explanation: 'Tổng các phần tử chia cho số lượng phần tử.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Tính trung vị (median) của mảng chưa được sắp xếp',
          explanation: 'Trung vị là phần tử nằm chính giữa của danh sách ĐÃ ĐƯỢC SẮP XẾP. Nếu không sắp xếp trước sẽ cho kết quả sai.',
          fix: 'Luôn gọi data.sort() hoặc sorted(data) trước khi tìm vị trí giữa.',
        },
      ],
      guidedPracticeTask: {
        title: 'Tìm số lớn nhất và nhỏ nhất',
        instructions: 'Dùng min(lst) và max(lst) để trích xuất cực trị.',
        hint: 'print(min(lst), max(lst))',
      },
      recap: [
        'Python là ngôn ngữ số 1 cho AI và Khoa học dữ liệu.',
        'Các thư viện NumPy, Pandas, FastAPI là kỹ năng tiếp nối thiết yếu.',
        'Thực hành dự án thực tế là con đường ngắn nhất để trở thành chuyên gia.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Tutorial',
          url: 'https://www.w3schools.com/python/',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-12-03',
          lessonId: 'lesson-12-03-he-sinh-thai-va-dinh-huong',
          topicId: 'topic-12-mo-rong-va-he-sinh-thai',
          slug: 'tinh-thong-ke-mang-so-lieu',
          title: 'Tính toán thống kê: Trung bình cộng và Trung vị',
          difficulty: 'medium',
          points: 20,
          description: 'Nhập vào một danh sách các số nguyên cách nhau bởi dấu cách.\n\nHãy tính toán và in ra 2 chỉ số thống kê cơ bản:\n1. Dòng 1: **Trung bình cộng (Mean)** = Tổng / Số lượng, định dạng làm tròn 2 chữ số thập phân (`Mean: <gia_tri>`).\n2. Dòng 2: **Trung vị (Median)** của dãy số sau khi đã sắp xếp tăng dần (`Median: <gia_tri>`):\n   - Nếu số lượng phần tử $k$ là số lẻ: Trung vị là phần tử ở chính giữa (chỉ số $k // 2$).\n   - Nếu số lượng phần tử $k$ là số chẵn: Trung vị là trung bình cộng của 2 phần tử ở giữa (chỉ số $k//2 - 1$ và $k//2$). In kết quả làm tròn 2 chữ số thập phân.',
          starterCode: 'nums = [int(x) for x in input().split()]\n# Tính Mean và Median của danh sách nums\n',
          expectedLearningOutcome: 'Áp dụng các kỹ thuật tổng hợp mảng để giải quyết bài toán thống kê dữ liệu.',
          skillTags: ['python_data_analysis', 'statistics', 'math_mean_median'],
          hints: [
            'nums.sort()\nk = len(nums)\nmean = sum(nums) / k\nif k % 2 == 1:\n    median = float(nums[k // 2])\nelse:\n    median = (nums[k // 2 - 1] + nums[k // 2]) / 2.0\nprint(f"Mean: {mean:.2f}")\nprint(f"Median: {median:.2f}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-12-03-samp-1',
              exerciseId: 'ex-12-03',
              inputData: '5 2 9 1 7',
              expectedOutput: 'Mean: 4.80\nMedian: 5.00',
              explanation: 'Dãy sắp xếp: [1, 2, 5, 7, 9]. Mean = 24/5 = 4.80. Median = 5.00.',
              orderIndex: 1,
            },
            {
              id: 'ex-12-03-samp-2',
              exerciseId: 'ex-12-03',
              inputData: '10 20 30 40',
              expectedOutput: 'Mean: 25.00\nMedian: 25.00',
              explanation: 'Số lượng chẵn (4 phần tử): Median = (20 + 30) / 2 = 25.00.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};
