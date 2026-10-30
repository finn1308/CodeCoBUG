import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_05_DATA_STRUCTURES: Topic = {
  id: 'topic-05-cau-truc-du-lieu',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-05-cau-truc-du-lieu',
  title: 'Chủ đề 05: Cấu trúc dữ liệu (Lists, Tuples, Sets, Dictionaries)',
  summary: 'Khám phá 4 cấu trúc dữ liệu cốt lõi trong Python: Danh sách linh hoạt (List), Bộ dữ liệu bất biến (Tuple), Tập hợp phần tử duy nhất (Set) và Bảng tra cứu Ánh xạ Khóa - Giá trị (Dictionary).',
  orderIndex: 5,
  category: 'Cấu trúc dữ liệu & Thuật toán',
  isPublished: true,
  isLocked: false,
  accentColor: 'yellow',
  lessons: [
    {
      id: 'lesson-05-01-danh-sach-list',
      topicId: 'topic-05-cau-truc-du-lieu',
      slug: 'danh-sach-list-co-ban',
      title: 'Bài 01: Danh sách linh hoạt (List)',
      theoryContent: `**List** là cấu trúc dữ liệu dạng mảng động phổ biến nhất trong Python, dùng để lưu trữ một tập hợp các phần tử có thứ tự và có thể thay đổi (mutable).
List được khai báo bằng cặp ngoặc vuông \`[]\`, các phần tử cách nhau bởi dấu phẩy.

**Các thao tác cốt lõi trên List**:
- Thêm phần tử vào cuối: \`a.append(x)\`
- Chèn phần tử vào vị trí bất kỳ: \`a.insert(index, x)\`
- Xóa và lấy phần tử cuối ra: \`a.pop()\`
- Xóa phần tử theo giá trị: \`a.remove(value)\`
- Sắp xếp tăng dần tại chỗ: \`a.sort()\`
- Đảo ngược danh sách tại chỗ: \`a.reverse()\`
- Chiều dài danh sách: \`len(a)\``,
      learningObjectives: [
        'Khai báo và khởi tạo danh sách List trong Python.',
        'Sử dụng .append(), .pop(), .sort() để quản lý phần tử.',
        'Truy cập phần tử theo chỉ mục tương tự như chuỗi ký tự.',
      ],
      prerequisites: [
        'Đã hiểu khái niệm chỉ mục (indexing) từ bài Chuỗi.',
      ],
      codeExamples: [
        {
          title: 'Thao tác thêm và sắp xếp danh sách',
          code: 'nums = [5, 2, 9, 1]\nnums.append(7)\nnums.sort()\nprint("Danh sach sau sap xep:", nums)',
          expectedOutput: 'Danh sach sau sap xep: [1, 2, 5, 7, 9]',
          explanation: 'nums.append(7) thêm 7 vào cuối, nums.sort() sắp xếp tăng dần.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Gán kết quả của .sort(): a = [3, 1]; a = a.sort()',
          explanation: '.sort() sắp xếp tại chỗ và trả về None. Khi gán a = a.sort(), biến a sẽ trở thành None!',
          fix: 'Chỉ cần gọi a.sort() mà không gán lại, hoặc dùng hàm b = sorted(a).',
        },
      ],
      guidedPracticeTask: {
        title: 'Thêm và in phần tử lớn nhất',
        instructions: 'Tạo một danh sách số nguyên, sắp xếp và in ra phần tử nhỏ nhất và lớn nhất.',
        hint: 'nums.sort(); print("Min:", nums[0], "Max:", nums[-1])',
      },
      recap: [
        'List dùng ngoặc vuông [], có thứ tự và có thể thay đổi.',
        'append() thêm vào cuối, sort() sắp xếp tăng dần tại chỗ.',
        'Chỉ mục bắt đầu từ 0 đến len(list) - 1.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Lists',
          url: 'https://www.w3schools.com/python/python_lists.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-05-01',
          lessonId: 'lesson-05-01-danh-sach-list',
          topicId: 'topic-05-cau-truc-du-lieu',
          slug: 'them-va-sap-xep-danh-sach',
          title: 'Thêm phần tử và sắp xếp danh sách',
          difficulty: 'easy',
          points: 15,
          description: 'Cho danh sách ban đầu: `a = [12, 5, 8, 19, 3]`. Đọc vào một số nguyên `x` từ bàn phím. Hãy thêm `x` vào cuối danh sách bằng `a.append(x)`, sau đó sắp xếp danh sách tăng dần bằng `a.sort()` và in danh sách ra màn hình.',
          starterCode: 'a = [12, 5, 8, 19, 3]\nx = int(input())\n# Thêm x, sắp xếp và in danh sách\n',
          expectedLearningOutcome: 'Biết cách sử dụng append và sort trên đối tượng List.',
          skillTags: ['python_lists', 'list_methods', 'sorting'],
          hints: [
            'a.append(x)',
            'a.sort()',
            'print(a)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-05-01-samp-1',
              exerciseId: 'ex-05-01',
              inputData: '7',
              expectedOutput: '[3, 5, 7, 8, 12, 19]',
              explanation: 'Thêm 7 vào danh sách và sắp xếp tăng dần.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-05-02',
          lessonId: 'lesson-05-01-danh-sach-list',
          topicId: 'topic-05-cau-truc-du-lieu',
          slug: 'tim-phan-tu-lon-nhat-nho-nhat',
          title: 'Tìm số lớn nhất và nhỏ nhất trong danh sách',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một danh sách các số nguyên trên cùng một dòng cách nhau bởi dấu cách (dùng `nums = list(map(int, input().split()))`). Hãy tìm và in ra hai dòng:\n- Dòng 1: `Min: {so_nho_nhat}`\n- Dòng 2: `Max: {so_lon_nhat}`\nbằng cách dùng hai hàm có sẵn `min()` và `max()`.',
          starterCode: 'nums = list(map(int, input().split()))\n# Tìm và in min, max\n',
          expectedLearningOutcome: 'Sử dụng hàm min() và max() trên danh sách số nguyên.',
          skillTags: ['python_lists', 'min_max_builtins'],
          hints: [
            'print(f"Min: {min(nums)}")',
            'print(f"Max: {max(nums)}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-05-02-samp-1',
              exerciseId: 'ex-05-02',
              inputData: '15 4 82 9 31',
              expectedOutput: 'Min: 4\nMax: 82',
              explanation: 'Số nhỏ nhất là 4, số lớn nhất là 82.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-05-02-tuple-va-set',
      topicId: 'topic-05-cau-truc-du-lieu',
      slug: 'tuple-va-set',
      title: 'Bài 02: Bộ dữ liệu (Tuple) & Tập hợp duy nhất (Set)',
      theoryContent: `**1. Tuple (Bộ dữ liệu bất biến)**:
Khai báo bằng dấu ngoặc đơn \`()\` (ví dụ: \`toa_do = (10, 20)\`).
- Điểm khác biệt mấu chốt so với List: **Tuple là bất biến (immutable)** — một khi đã tạo thì không thể thêm, sửa, hay xóa phần tử.
- Tuple an toàn hơn để lưu trữ các hằng số cấu hình hoặc tọa độ, và tốc độ truy xuất nhanh hơn List.

**2. Set (Tập hợp các phần tử duy nhất)**:
Khai báo bằng dấu ngoặc nhọn \`{}\` hoặc \`set()\` (ví dụ: \`s = {1, 2, 2, 3}\` sẽ tự động lọc thành \`{1, 2, 3}\`).
- **Không chứa phần tử trùng lặp**: Tuyệt chiêu lọc trùng một danh sách là ép kiểu: \`list(set(danh_sach))\`.
- **Không có thứ tự**: Không thể truy cập phần tử qua chỉ mục như \`s[0]\`.
- Hỗ trợ các phép toán tập hợp: Hợp (\`s1 | s2\`), Giao (\`s1 & s2\`), Hiệu (\`s1 - s2\`).`,
      learningObjectives: [
        'Hiểu tính bất biến của Tuple và khi nào nên dùng Tuple thay vì List.',
        'Sử dụng Set để loại bỏ các phần tử trùng lặp trong 1 dòng lệnh.',
        'Thực hiện các phép toán giao và hợp trên tập hợp.',
      ],
      prerequisites: [
        'Đã học List.',
      ],
      codeExamples: [
        {
          title: 'Lọc trùng lặp bằng Set',
          code: 'raw = [1, 2, 2, 3, 4, 4, 4, 5]\nunique = sorted(list(set(raw)))\nprint("Danh sach duy nhat:", unique)',
          expectedOutput: 'Danh sach duy nhat: [1, 2, 3, 4, 5]',
          explanation: 'set(raw) tự động loại bỏ các số 2 và 4 bị lặp lại.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Tạo set rỗng bằng s = {}',
          explanation: 'Dấu {} rỗng trong Python được hiểu là một Dictionary rỗng, không phải Set!',
          fix: 'Tạo set rỗng bằng hàm: s = set()',
        },
      ],
      guidedPracticeTask: {
        title: 'Giao của 2 tập hợp',
        instructions: 'Tìm các phần tử chung giữa 2 danh sách số bằng toán tử & của Set.',
        hint: 'chung = set(list1) & set(list2)',
      },
      recap: [
        'Tuple dùng (), bất biến, bảo vệ dữ liệu không bị sửa đổi.',
        'Set dùng {}, không trùng lặp, không có chỉ mục.',
        'list(set(a)) là mẹo phổ biến nhất để lọc phần tử duy nhất.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Tuples',
          url: 'https://www.w3schools.com/python/python_tuples.asp',
        },
        {
          title: 'W3Schools Python Sets',
          url: 'https://www.w3schools.com/python/python_sets.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-05-03',
          lessonId: 'lesson-05-02-tuple-va-set',
          topicId: 'topic-05-cau-truc-du-lieu',
          slug: 'loc-phan-tu-trung-lap',
          title: 'Lọc phần tử trùng lặp với Set',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào một danh sách số nguyên trên một dòng có thể chứa nhiều giá trị lặp lại (ví dụ: `3 1 2 3 4 1 5`). Hãy sử dụng `set()` để loại bỏ các phần tử trùng lặp, sau đó sắp xếp tăng dần và in ra danh sách các phần tử duy nhất.',
          starterCode: 'nums = list(map(int, input().split()))\n# Lọc trùng lặp, sắp xếp và in kết quả\n',
          expectedLearningOutcome: 'Biết cách kết hợp set() và sorted() để xử lý danh sách không trùng lặp.',
          skillTags: ['python_sets', 'deduplication', 'sorting'],
          hints: [
            'unique_sorted = sorted(list(set(nums)))',
            'print(unique_sorted)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-05-03-samp-1',
              exerciseId: 'ex-05-03',
              inputData: '3 1 2 3 4 1 5',
              expectedOutput: '[1, 2, 3, 4, 5]',
              explanation: 'Lọc bỏ số 1 và 3 bị lặp, sắp xếp thành [1, 2, 3, 4, 5].',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-05-03-tu-dien-dictionary',
      topicId: 'topic-05-cau-truc-du-lieu',
      slug: 'tu-dien-dictionary-co-ban',
      title: 'Bài 03: Từ điển tra cứu (Dictionary)',
      theoryContent: `**Dictionary (Từ điển / Dict)** là cấu trúc dữ liệu lưu trữ dưới dạng cặp **Khóa - Giá trị (Key - Value)** cực kỳ mạnh mẽ trong Python.
Cú pháp: Khai báo bằng dấu ngoặc nhọn \`{key: value, ...}\`.

**Đặc điểm quan trọng**:
1. **Khóa (Key)**: Phải là duy nhất và thuộc kiểu bất biến (thường là chuỗi \`str\` hoặc số \`int\`).
2. **Giá trị (Value)**: Có thể thuộc bất kỳ kiểu dữ liệu nào (số, chuỗi, list, hoặc thậm chí một dict khác).
3. **Truy cập an toàn**: Dùng \`d.get(key, default_value)\` để tránh bị lỗi \`KeyError\` khi khóa không tồn tại.
4. **Các phương thức trích xuất**:
   - \`d.keys()\` : Lấy danh sách các khóa.
   - \`d.values()\` : Lấy danh sách các giá trị.
   - \`d.items()\` : Lấy danh sách các cặp (khóa, giá trị).`,
      learningObjectives: [
        'Khai báo Dictionary và gán các cặp key-value.',
        'Truy cập và cập nhật giá trị theo key.',
        'Sử dụng phương thức an toàn .get() để tránh lỗi văng chương trình.',
      ],
      prerequisites: [
        'Đã học các kiểu dữ liệu cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Quản lý thông tin bằng Dictionary',
          code: 'student = {"ten": "Minh", "tuoi": 15, "diem": 9.0}\nstudent["diem"] = 9.5\nstudent["lop"] = "10A1"\nprint("Ten:", student.get("ten"))\nprint("Diem moi:", student["diem"])',
          expectedOutput: 'Ten: Minh\nDiem moi: 9.5',
          explanation: 'Thêm mới hoặc cập nhật giá trị bằng cú pháp dict[key] = value.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Truy cập key không tồn tại: print(d["khong_co"])',
          explanation: 'Python sẽ quăng lỗi KeyError: "khong_co".',
          fix: 'Dùng d.get("khong_co", "Khong tim thay")',
        },
      ],
      guidedPracticeTask: {
        title: 'Tra cứu giá tiền sản phẩm',
        instructions: 'Tạo từ điển menu giá món ăn. Nhập tên món từ bàn phím và in ra giá tiền tương ứng.',
        hint: 'menu = {"banh_mi": 20000, "pho": 45000}; print(menu.get(mon, "Khong co"))',
      },
      recap: [
        'Dictionary lưu dữ liệu dạng {key: value}.',
        'Key là duy nhất, truy cập tức thời với độ phức tạp O(1).',
        'Dùng .get(key) để truy cập an toàn.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Dictionaries',
          url: 'https://www.w3schools.com/python/python_dictionaries.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-05-04',
          lessonId: 'lesson-05-03-tu-dien-dictionary',
          topicId: 'topic-05-cau-truc-du-lieu',
          slug: 'tra-cuu-tu-dien-don-gia',
          title: 'Tra cứu đơn giá sản phẩm',
          difficulty: 'easy',
          points: 15,
          description: 'Cho bảng giá hoa quả được lưu trong từ điển sau:\n`bang_gia = {"tao": 30000, "cam": 25000, "xoai": 40000, "chuoi": 15000}`\n\nNhập vào tên một loại quả từ bàn phím. Hãy sử dụng phương thức `bang_gia.get(ten_qua, 0)` để lấy đơn giá. Nếu quả có trong bảng giá, in ra: `Gia: {gia} VND`, nếu không có in ra: `Khong co trong bang gia`.',
          starterCode: 'bang_gia = {"tao": 30000, "cam": 25000, "xoai": 40000, "chuoi": 15000}\nten_qua = input()\n# Tra cứu và in giá\n',
          expectedLearningOutcome: 'Biết cách sử dụng Dictionary để làm bài toán tra cứu thông tin.',
          skillTags: ['python_dictionaries', 'dict_lookup'],
          hints: [
            'gia = bang_gia.get(ten_qua)',
            'if gia:\n    print(f"Gia: {gia} VND")\nelse:\n    print("Khong co trong bang gia")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-05-04-samp-1',
              exerciseId: 'ex-05-04',
              inputData: 'cam',
              expectedOutput: 'Gia: 25000 VND',
              explanation: 'Cam có giá 25000 VND.',
              orderIndex: 1,
            },
            {
              id: 'ex-05-04-samp-2',
              exerciseId: 'ex-05-04',
              inputData: 'dua_hau',
              expectedOutput: 'Khong co trong bang gia',
              explanation: 'Dưa hấu không có trong từ điển.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-05-04-list-comprehension',
      topicId: 'topic-05-cau-truc-du-lieu',
      slug: 'list-comprehension-co-ban',
      title: 'Bài 04: Biểu thức khởi tạo danh sách (List Comprehension)',
      theoryContent: `**List Comprehension** là cú pháp thanh lịch, ngắn gọn và tốc độ cao đặc trưng của Python, cho phép tạo một danh sách mới dựa trên một tập hợp có sẵn chỉ bằng 1 dòng lệnh duy nhất.

Cú pháp cơ bản:
\`[bieu_thuc for phan_tu in tap_hop]\`

Cú pháp kết hợp bộ lọc \`if\`:
\`[bieu_thuc for phan_tu in tap_hop if dieu_kien]\`

Ví dụ so sánh:
- Cách truyền thống:
  \`\`\`python
  squares = []
  for x in range(1, 6):
      squares.append(x * x)
  \`\`\`
- Cách dùng List Comprehension:
  \`\`\`python
  squares = [x * x for x in range(1, 6)]
  \`\`\``,
      learningObjectives: [
        'Hiểu cú pháp và lợi ích tốc độ của List Comprehension.',
        'Chuyển đổi các vòng lặp tạo danh sách truyền thống thành 1 dòng code ngắn gọn.',
        'Kết hợp mệnh đề if để lọc phần tử chẵn, lẻ hoặc theo điều kiện tùy ý.',
      ],
      prerequisites: [
        'Đã hiểu cấu trúc List.',
      ],
      codeExamples: [
        {
          title: 'Lọc các số chẵn trong danh sách',
          code: 'nums = [1, 2, 3, 4, 5, 6, 7, 8]\nchans = [x for x in nums if x % 2 == 0]\nprint("Cac so chan:", chans)',
          expectedOutput: 'Cac so chan: [2, 4, 6, 8]',
          explanation: 'Chỉ những số chia hết cho 2 mới được đưa vào danh sách chans.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Lạm dụng biểu thức lồng nhau quá phức tạp',
          explanation: 'Viết list comprehension quá dài gây khó đọc và vi phạm nguyên lý Zen of Python ("Readability counts").',
          fix: 'Nếu biểu thức phức tạp, hãy tách thành vòng for bình thường.',
        },
      ],
      guidedPracticeTask: {
        title: 'Bình phương các số dương',
        instructions: 'Cho danh sách số gồm cả số âm và dương. Tạo danh sách mới chỉ chứa bình phương của các số dương.',
        hint: '[x * x for x in nums if x > 0]',
      },
      recap: [
        'List Comprehension giúp tạo danh sách nhanh gọn trong 1 dòng.',
        'Cú pháp: [x for x in data if cond].',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python List Comprehension',
          url: 'https://www.w3schools.com/python/python_lists_comprehension.asp',
        },
      ],
      orderIndex: 4,
      isPublished: true,
      exercises: [
        {
          id: 'ex-05-05',
          lessonId: 'lesson-05-04-list-comprehension',
          topicId: 'topic-05-cau-truc-du-lieu',
          slug: 'loc-so-chan-list-comprehension',
          title: 'Lọc số chẵn bằng List Comprehension',
          difficulty: 'medium',
          points: 20,
          description: 'Nhập vào một danh sách các số nguyên trên cùng một dòng cách nhau bởi dấu cách. Hãy sử dụng **List Comprehension** để lọc ra danh sách chỉ chứa các số chẵn (chia hết cho 2) và in danh sách kết quả ra màn hình.',
          starterCode: 'nums = list(map(int, input().split()))\n# Dùng list comprehension để lọc số chẵn\n',
          expectedLearningOutcome: 'Áp dụng cú pháp [x for x in nums if x % 2 == 0] để giải bài toán lọc dữ liệu.',
          skillTags: ['python_lists', 'list_comprehension'],
          hints: [
            'chans = [x for x in nums if x % 2 == 0]',
            'print(chans)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-05-05-samp-1',
              exerciseId: 'ex-05-05',
              inputData: '1 2 3 4 5 6 7 8',
              expectedOutput: '[2, 4, 6, 8]',
              explanation: 'Chỉ các số 2, 4, 6, 8 là số chẵn.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
  ],
};
