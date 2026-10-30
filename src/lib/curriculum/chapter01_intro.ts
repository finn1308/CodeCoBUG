import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_01_INTRO: Topic = {
  id: 'topic-01-lam-quen-python',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-01-lam-quen-python',
  title: 'Chủ đề 01: Làm quen với Python',
  summary: 'Khám phá thế giới Python, cài đặt môi trường, cú pháp thụt lề, ghi chú và các lệnh vào/ra cơ bản print() & input().',
  orderIndex: 1,
  category: 'Nhập môn lập trình',
  isPublished: true,
  isLocked: false,
  accentColor: 'mint',
  lessons: [
    {
      id: 'lesson-01-gioi-thieu',
      topicId: 'topic-01-lam-quen-python',
      slug: 'gioi-thieu-va-moi-truong',
      title: 'Bài 01: Giới thiệu Python & Môi trường thực thi',
      theoryContent: `Python là ngôn ngữ lập trình bậc cao, thông dịch, hướng đối tượng và đa năng do Guido van Rossum tạo ra từ năm 1991. Điểm nổi bật nhất của Python là cú pháp trong sáng, gần gũi với tiếng Anh tự nhiên, giúp người mới bắt đầu tập trung rèn luyện tư duy thuật toán thay vì bị phân tâm bởi các quy tắc ngữ pháp phức tạp.

Trên nền tảng CodeCoBUG, bạn không cần phải cài đặt môi trường phức tạp lên máy tính cá nhân. Trình duyệt của bạn được tích hợp sẵn bộ thông dịch Python 3 chạy trực tiếp qua công nghệ WebAssembly (Pyodide), cho phép bạn viết và thực thi mã nguồn ngay lập tức.`,
      learningObjectives: [
        'Hiểu Python là gì và vì sao Python là ngôn ngữ lý tưởng cho người mới bắt đầu.',
        'Làm quen với giao diện lập trình trực tuyến CodeCoBUG: Editor, Terminal và Output.',
        'Viết và thực thi câu lệnh Python đầu tiên thành công.',
      ],
      prerequisites: [
        'Không yêu cầu kiến thức lập trình trước đó.',
        'Kỹ năng sử dụng bàn phím máy tính cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Câu lệnh in lời chào đầu tiên',
          code: 'print("Chao mung ban den voi the gioi lap trinh Python!")',
          expectedOutput: 'Chao mung ban den voi the gioi lap trinh Python!',
          explanation: 'Hàm print() nhận một chuỗi ký tự đặt trong dấu ngoặc kép và xuất ra màn hình Terminal.',
        },
        {
          title: 'In nhiều dòng liên tiếp',
          code: 'print("Dong 1: Xin chao")\nprint("Dong 2: CodeCoBUG")',
          expectedOutput: 'Dong 1: Xin chao\nDong 2: CodeCoBUG',
          explanation: 'Mỗi lệnh print() mặc định sẽ tự động xuống dòng sau khi hoàn tất việc in.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên đóng ngoặc đơn: print("Xin chao"',
          explanation: 'Mọi hàm trong Python đều yêu cầu cặp ngoặc đơn mở và đóng đầy đủ.',
          fix: 'Luôn kiểm tra cặp ngoặc: print("Xin chao")',
        },
        {
          mistake: 'Viết hoa tên hàm: Print("Xin chao")',
          explanation: 'Python phân biệt chữ hoa và chữ thường (case-sensitive). Tên hàm chuẩn là print viết thường toàn bộ.',
          fix: 'Sửa Print thành print.',
        },
      ],
      guidedPracticeTask: {
        title: 'Nhiệm vụ thực hành có hướng dẫn',
        instructions: 'Hãy viết một chương trình in ra tên bạn và niềm đam mê lập trình của bạn trên 2 dòng riêng biệt.',
        hint: 'Sử dụng 2 câu lệnh print() liên tiếp.',
      },
      recap: [
        'Python là ngôn ngữ thông dịch dễ học, cú pháp ngắn gọn và mạnh mẽ.',
        'Hàm print() dùng để xuất thông tin ra màn hình.',
        'Python phân biệt chữ hoa chữ thường (print khác Print).',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Intro',
          url: 'https://www.w3schools.com/python/python_intro.asp',
        },
        {
          title: 'W3Schools Python Getting Started',
          url: 'https://www.w3schools.com/python/python_getstarted.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-01-01',
          lessonId: 'lesson-01-gioi-thieu',
          topicId: 'topic-01-lam-quen-python',
          slug: 'chao-mung-den-voi-python',
          title: 'Chào mừng đến với Python',
          difficulty: 'very_easy',
          points: 10,
          description: 'Hãy viết câu lệnh Python sử dụng hàm `print()` để in ra chính xác dòng chữ:\n`Chao mung ban den voi the gioi lap trinh Python!` ra màn hình Terminal.',
          starterCode: '# Viết câu lệnh print của bạn ở đây\n',
          expectedLearningOutcome: 'Biết cách sử dụng lệnh print() để in một chuỗi ký tự đơn giản.',
          skillTags: ['python_print_syntax', 'io_basics'],
          hints: [
            'Đặt chuỗi ký tự cần in bên trong cặp dấu ngoặc kép "" của hàm print().',
            'Kiểm tra kỹ chính tả từng từ và dấu chấm than ở cuối câu.',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-01-01-samp-1',
              exerciseId: 'ex-01-01',
              inputData: '',
              expectedOutput: 'Chao mung ban den voi the gioi lap trinh Python!',
              explanation: 'Chương trình không nhận input, xuất chuỗi ký tự trực tiếp.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-01-02',
          lessonId: 'lesson-01-gioi-thieu',
          topicId: 'topic-01-lam-quen-python',
          slug: 'in-nhieu-dong-chu',
          title: 'In thông tin trên nhiều dòng',
          difficulty: 'very_easy',
          points: 10,
          description: 'Sử dụng 3 câu lệnh `print()` để in ra 3 dòng giới thiệu sau:\n\nDong 1: `Toi la hoc vien CodeCoBUG`\nDong 2: `Toi dang hoc lap trinh Python`\nDong 3: `Lap trinh that thu vi!`',
          starterCode: '# Viết 3 dòng lệnh print\n',
          expectedLearningOutcome: 'Nắm được cơ chế tự động xuống dòng của các câu lệnh print() kế tiếp nhau.',
          skillTags: ['python_print_syntax', 'multiline_output'],
          hints: [
            'Mỗi lệnh print() sẽ in một dòng văn bản.',
            'Viết 3 lệnh print() trên 3 dòng mã nguồn riêng biệt.',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-01-02-samp-1',
              exerciseId: 'ex-01-02',
              inputData: '',
              expectedOutput: 'Toi la hoc vien CodeCoBUG\nToi dang hoc lap trinh Python\nLap trinh that thu vi!',
              explanation: 'Ba dòng văn bản được in ra lần lượt từ trên xuống dưới.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-02-cu-phap-chu-thich',
      topicId: 'topic-01-lam-quen-python',
      slug: 'cu-phap-va-chu-thich',
      title: 'Bài 02: Cú pháp cơ bản, Thụt lề & Chú thích (Comments)',
      theoryContent: `Khác với nhiều ngôn ngữ như C, C++ hay Java dùng dấu ngoặc nhọn \`{}\` để phân định khối lệnh, Python sử dụng **khoảng trắng thụt lề (Indentation)**. Điều này giúp mã nguồn Python luôn bắt buộc phải viết gọn gàng và dễ đọc.

Ngoài ra, **chú thích (Comments)** là những dòng ghi chú dành cho con người đọc, bộ thông dịch Python sẽ bỏ qua hoàn toàn khi chạy chương trình. Trong Python:
- Chú thích một dòng bắt đầu bằng ký tự thăng \`#\`.
- Chú thích nhiều dòng có thể dùng nhiều dấu \`#\` hoặc khối chuỗi ba ngoặc kép \`"""\`.`,
      learningObjectives: [
        'Hiểu nguyên tắc thụt lề (Indentation) và tránh lỗi IndentationError.',
        'Sử dụng dấu # để viết chú thích mã nguồn rõ ràng, chuyên nghiệp.',
        'Biết cách tạm thời vô hiệu hóa một đoạn code bằng chú thích để kiểm tra lỗi.',
      ],
      prerequisites: [
        'Đã học Bài 01 và biết cách dùng lệnh print().',
      ],
      codeExamples: [
        {
          title: 'Sử dụng chú thích đơn dòng',
          code: '# Đây là dòng chú thích, Python sẽ không chạy dòng này\nprint("Dong nay se duoc thuc thi")',
          expectedOutput: 'Dong nay se duoc thuc thi',
          explanation: 'Dòng bắt đầu bằng # bị bỏ qua hoàn toàn.',
        },
        {
          title: 'Quy tắc thẳng hàng ở đầu dòng lệnh',
          code: 'print("Lệnh 1 bắt đầu ở đầu dòng")\nprint("Lệnh 2 cũng phải bắt đầu ở cùng cột")',
          expectedOutput: 'Lệnh 1 bắt đầu ở đầu dòng\nLệnh 2 cũng phải bắt đầu ở cùng cột',
          explanation: 'Các lệnh ở cùng một cấp khối mã phải có cùng khoảng cách thụt lề.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Thụt lề vô cớ:   print("Loi")',
          explanation: 'Trong Python, câu lệnh ở cấp ngoài cùng không được có khoảng trắng ở đầu dòng, nếu không sẽ gây lỗi IndentationError: unexpected indent.',
          fix: 'Xóa toàn bộ khoảng trắng ở đầu câu lệnh ngoài cùng.',
        },
        {
          mistake: 'Trộn lẫn Tab và Phím cách (Spaces)',
          explanation: 'Python 3 không cho phép trộn lẫn ký tự tab và dấu cách để thụt lề.',
          fix: 'Quy ước chuẩn thế giới (PEP 8) là luôn dùng 4 phím cách (spaces) cho mỗi cấp thụt lề.',
        },
      ],
      guidedPracticeTask: {
        title: 'Thực hành sửa lỗi thụt lề',
        instructions: 'Nhận diện dòng lệnh bị thụt lề sai và đưa về đầu dòng để chương trình chạy thành công.',
        hint: 'Quan sát thông báo lỗi IndentationError để tìm dòng có khoảng cách thừa.',
      },
      recap: [
        'Thụt lề (Indentation) trong Python là cú pháp bắt buộc, không chỉ mang tính thẩm mỹ.',
        'Ký tự # dùng để bắt đầu một dòng chú thích.',
        'Các lệnh ngoài cùng phải bắt đầu sát lề trái (cột 0).',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Syntax',
          url: 'https://www.w3schools.com/python/python_syntax.asp',
        },
        {
          title: 'W3Schools Python Comments',
          url: 'https://www.w3schools.com/python/python_comments.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-01-03',
          lessonId: 'lesson-02-cu-phap-chu-thich',
          topicId: 'topic-01-lam-quen-python',
          slug: 'chu-thich-dong-code',
          title: 'Ghi chú thích trong Python',
          difficulty: 'very_easy',
          points: 10,
          description: 'Hãy viết một dòng chú thích với nội dung `# Day la ghi chu` và bên dưới in ra dòng chữ:\n`Python rat de hoc`',
          starterCode: '# Thêm chú thích và lệnh print\n',
          expectedLearningOutcome: 'Biết cách kết hợp ghi chú giải thích code và câu lệnh thực thi.',
          skillTags: ['python_comments', 'python_print_syntax'],
          hints: [
            'Dòng 1 bắt đầu bằng dấu #.',
            'Dòng 2 là câu lệnh print("Python rat de hoc").',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-01-03-samp-1',
              exerciseId: 'ex-01-03',
              inputData: '',
              expectedOutput: 'Python rat de hoc',
              explanation: 'Dòng chú thích không xuất hiện trên terminal, chỉ có kết quả từ print() được in ra.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-01-04',
          lessonId: 'lesson-02-cu-phap-chu-thich',
          topicId: 'topic-01-lam-quen-python',
          slug: 'sua-loi-thut-le',
          title: 'Sửa lỗi thụt lề (Indentation)',
          difficulty: 'easy',
          points: 15,
          description: 'Đoạn code trong trình soạn thảo đang bị lỗi `IndentationError: unexpected indent` do dòng thứ hai bị thụt lề thừa khoảng trắng. Hãy sửa lại mã nguồn sao cho hai câu lệnh cùng nằm sát lề trái và in ra:\n`Dong 1`\n`Dong 2`',
          starterCode: 'print("Dong 1")\n  print("Dong 2")\n',
          expectedLearningOutcome: 'Hiểu bản chất của IndentationError và kỹ năng sửa lỗi cú pháp thụt lề.',
          skillTags: ['python_indentation', 'error_debugging'],
          hints: [
            'Xóa 2 khoảng trắng ở trước chữ print của dòng thứ hai.',
            'Cả hai dòng lệnh phải bắt đầu thẳng hàng ở cột đầu tiên.',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-01-04-samp-1',
              exerciseId: 'ex-01-04',
              inputData: '',
              expectedOutput: 'Dong 1\nDong 2',
              explanation: 'Hai dòng được in thẳng hàng không có lỗi cú pháp.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-03-xuat-du-lieu-print',
      topicId: 'topic-01-lam-quen-python',
      slug: 'xuat-du-lieu-print',
      title: 'Bài 03: Xuất dữ liệu nâng cao với print()',
      theoryContent: `Hàm \`print()\` trong Python không chỉ đơn thuần là in một chuỗi đơn lẻ, mà còn hỗ trợ hai tham số rất hữu ích:
1. **Tham số \`sep\` (Separator)**: Quy định ký tự ngăn cách giữa các giá trị khi in nhiều phần tử (mặc định là dấu cách \`" "\`).
   Ví dụ: \`print("A", "B", "C", sep="-")\` sẽ cho ra \`A-B-C\`.
2. **Tham số \`end\` (End of line)**: Quy định ký tự kết thúc sau khi in (mặc định là ký tự xuống dòng \`"\\n"\`).
   Ví dụ: \`print("Xin", end=" ")\` kết hợp với \`print("chao")\` sẽ in cùng trên một dòng: \`Xin chao\`.`,
      learningObjectives: [
        'Sử dụng print() với nhiều đối số cách nhau bằng dấu phẩy.',
        'Điều khiển ký tự ngăn cách thông qua tham số sep.',
        'Điều khiển việc có xuống dòng hay không thông qua tham số end.',
      ],
      prerequisites: [
        'Đã biết cách dùng print() cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Thay đổi ký tự ngăn cách sep',
          code: 'print("09", "10", "2026", sep="/")',
          expectedOutput: '09/10/2026',
          explanation: 'Các giá trị được nối với nhau bằng dấu gạch chéo / thay vì khoảng trắng mặc định.',
        },
        {
          title: 'In không xuống dòng bằng tham số end',
          code: 'print("Python", end=" - ")\nprint("CodeCoBUG")',
          expectedOutput: 'Python - CodeCoBUG',
          explanation: 'Dòng thứ nhất kết thúc bằng " - " thay vì ký tự xuống dòng.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Viết nhầm tên tham số: print("A", "B", separator="-")',
          explanation: 'Tên tham số chuẩn trong Python là sep, không phải separator.',
          fix: 'Sử dụng đúng từ khóa: sep="-"',
        },
      ],
      guidedPracticeTask: {
        title: 'Tùy chỉnh định dạng in',
        instructions: 'Thử in giờ, phút, giây ngăn cách bởi dấu hai chấm (ví dụ: 10:30:45) chỉ bằng 1 câu lệnh print().',
        hint: 'Sử dụng tham số sep=":" trong lệnh print(10, 30, 45, sep=":")',
      },
      recap: [
        'sep quy định ký tự giữa các đối số trong cùng 1 lệnh print.',
        'end quy định ký tự ở cuối câu lệnh print (mặc định là xuống dòng).',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Output Formatting',
          url: 'https://www.w3schools.com/python/ref_func_print.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-fixture-01',
          lessonId: 'lesson-03-xuat-du-lieu-print',
          topicId: 'topic-01-lam-quen-python',
          slug: 'in-loi-chao-codecobug',
          title: 'In lời chào CodeCoBUG',
          difficulty: 'very_easy',
          points: 10,
          description: 'Viết chương trình Python in ra dòng chữ chính xác: `Xin chao CodeCoBUG` ra màn hình.',
          starterCode: '# Viết code của bạn ở đây\nprint("Xin chao CodeCoBUG")\n',
          expectedLearningOutcome: 'In chuẩn chuỗi ký tự không có khoảng trắng thừa.',
          skillTags: ['python_print_syntax'],
          hints: ['Dùng lệnh print("Xin chao CodeCoBUG")'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-sample-01-1',
              exerciseId: 'ex-fixture-01',
              inputData: '',
              expectedOutput: 'Xin chao CodeCoBUG',
              explanation: 'In trực tiếp chuỗi ký tự ra terminal.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-01-06',
          lessonId: 'lesson-03-xuat-du-lieu-print',
          topicId: 'topic-01-lam-quen-python',
          slug: 'in-tren-cung-mot-dong',
          title: 'In dữ liệu trên cùng một dòng',
          difficulty: 'easy',
          points: 15,
          description: 'Hãy sử dụng 3 câu lệnh `print()` để in 3 từ `Python`, `la`, `tuyet-voi` cùng trên một dòng duy nhất, cách nhau bằng đúng 1 khoảng trắng, nhờ sử dụng tham số `end=" "`. Kết quả in ra phải là:\n`Python la tuyet-voi`',
          starterCode: '# Dùng tham số end=" " trong print()\n',
          expectedLearningOutcome: 'Hiểu cách ngăn việc tự động ngắt dòng bằng tham số end.',
          skillTags: ['python_print_syntax', 'print_end_param'],
          hints: [
            'Lệnh thứ nhất: print("Python", end=" ")',
            'Lệnh thứ hai: print("la", end=" ")',
            'Lệnh thứ ba: print("tuyet-voi")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-01-06-samp-1',
              exerciseId: 'ex-01-06',
              inputData: '',
              expectedOutput: 'Python la tuyet-voi',
              explanation: 'Ba lần in nối tiếp nhau trên cùng 1 dòng.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-01-07',
          lessonId: 'lesson-03-xuat-du-lieu-print',
          topicId: 'topic-01-lam-quen-python',
          slug: 'in-voi-ky-tu-ngan-cach',
          title: 'In với ký tự ngăn cách sep',
          difficulty: 'easy',
          points: 15,
          description: 'Hãy dùng một lệnh `print()` duy nhất với tham số `sep=" -> "` để in 3 địa danh: `"Ha Noi"`, `"Da Nang"`, `"TP Ho Chi Minh"` nối nhau bởi mũi tên ` -> `.\nKết quả in mong đợi:\n`Ha Noi -> Da Nang -> TP Ho Chi Minh`',
          starterCode: '# In với tham số sep=" -> "\n',
          expectedLearningOutcome: 'Làm chủ tham số sep để nối các chuỗi với ký tự tùy chỉnh.',
          skillTags: ['python_print_syntax', 'print_sep_param'],
          hints: [
            'Đặt chuỗi " -> " (có khoảng trắng trước và sau mũi tên) làm giá trị cho tham số sep.',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 3,
          isPublished: true,
          examples: [
            {
              id: 'ex-01-07-samp-1',
              exerciseId: 'ex-01-07',
              inputData: '',
              expectedOutput: 'Ha Noi -> Da Nang -> TP Ho Chi Minh',
              explanation: 'Dùng sep=" -> " nối 3 chuỗi trên cùng 1 dòng.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-04-nhap-du-lieu-input',
      topicId: 'topic-01-lam-quen-python',
      slug: 'nhap-du-lieu-input',
      title: 'Bài 04: Nhập dữ liệu từ bàn phím với hàm input()',
      theoryContent: `Để chương trình có tính tương tác, chúng ta cần nhận dữ liệu do người dùng nhập vào từ bàn phím. Trong Python, ta sử dụng hàm \`input()\`.

**LƯU Ý CỐT LÕI**: Hàm \`input()\` luôn luôn trả về dữ liệu ở dạng chuỗi ký tự (\`str\`), ngay cả khi người dùng gõ vào một con số như \`"20"\`!

Khi kiểm thử tự động trên CodeCoBUG:
- Mỗi lần gọi \`input()\`, chương trình sẽ đọc một dòng dữ liệu từ luồng dữ liệu chuẩn (stdin).
- Nếu đề bài yêu cầu nhập 2 giá trị trên 2 dòng, bạn cần gọi \`input()\` 2 lần tương ứng.`,
      learningObjectives: [
        'Biết cách gọi hàm input() để đọc dữ liệu từ bàn phím.',
        'Lưu giá trị nhập vào một biến để tái sử dụng.',
        'Ghép chuỗi đã nhập với các thông báo bằng f-string hoặc dấu phẩy.',
      ],
      prerequisites: [
        'Đã nắm chắc lệnh print().',
      ],
      codeExamples: [
        {
          title: 'Nhập và in lại tên',
          code: 'ten = input()\nprint("Xin chao,", ten)',
          expectedOutput: 'Xin chao, Huy (với input là "Huy")',
          explanation: 'Giá trị người dùng gõ vào được lưu vào biến ten và in ra.',
        },
        {
          title: 'Nhập nhiều dòng liên tiếp',
          code: 'ho = input()\nten = input()\nprint(ho, ten)',
          expectedOutput: 'Nguyen An (với input dòng 1 "Nguyen", dòng 2 "An")',
          explanation: 'Mỗi lệnh input() đọc xong 1 dòng dữ liệu.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Tưởng nhầm input() trả về số: tuoi = input(); tuoi + 1',
          explanation: 'input() luôn trả về chuỗi str, không thể cộng trực tiếp với số nguyên nếu chưa ép kiểu int().',
          fix: 'Với các bài chỉ cần xử lý chuỗi ở Chủ đề 01, ta giữ nguyên dạng chuỗi. Sang Chủ đề 02 sẽ học ép kiểu int(input()).',
        },
      ],
      guidedPracticeTask: {
        title: 'Nhận diện input dòng',
        instructions: 'Viết chương trình đọc 1 dòng là tên quốc gia và in ra "Toi yeu dat nuoc {quoc_gia}".',
        hint: 'quoc_gia = input(); print(f"Toi yeu dat nuoc {quoc_gia}")',
      },
      recap: [
        'input() dùng để đọc 1 dòng dữ liệu từ bàn phím.',
        'Giá trị trả về từ input() luôn là kiểu chuỗi (string).',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python User Input',
          url: 'https://www.w3schools.com/python/python_user_input.asp',
        },
      ],
      orderIndex: 4,
      isPublished: true,
      exercises: [
        {
          id: 'ex-01-08',
          lessonId: 'lesson-04-nhap-du-lieu-input',
          topicId: 'topic-01-lam-quen-python',
          slug: 'nhap-va-chao-hoi',
          title: 'Nhập tên và chào hỏi cá nhân hóa',
          difficulty: 'easy',
          points: 15,
          description: 'Viết chương trình đọc một dòng chứa tên người dùng từ bàn phím bằng hàm `input()`, sau đó in ra lời chào theo định dạng đúng:\n`Xin chao, {ten}!`',
          starterCode: '# Đọc tên và in lời chào\nten = input()\n',
          expectedLearningOutcome: 'Biết cách đọc một dòng văn bản và chèn biến vào chuỗi xuất.',
          skillTags: ['python_input_str', 'python_print_syntax'],
          hints: [
            'Dùng f-string: print(f"Xin chao, {ten}!") hoặc print("Xin chao, " + ten + "!")',
            'Chú ý dấu phẩy sau chữ chao và dấu chấm than ở cuối câu.',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-01-08-samp-1',
              exerciseId: 'ex-01-08',
              inputData: 'An',
              expectedOutput: 'Xin chao, An!',
              explanation: 'Với input là "An", kết quả in ra là "Xin chao, An!"',
              orderIndex: 1,
            },
            {
              id: 'ex-01-08-samp-2',
              exerciseId: 'ex-01-08',
              inputData: 'Bao Ngoc',
              expectedOutput: 'Xin chao, Bao Ngoc!',
              explanation: 'Xử lý tốt tên có khoảng cách.',
              orderIndex: 2,
            },
          ],
        },
        {
          id: 'ex-01-09',
          lessonId: 'lesson-04-nhap-du-lieu-input',
          topicId: 'topic-01-lam-quen-python',
          slug: 'nhap-hai-tu-khoa',
          title: 'Ghép hai từ khóa',
          difficulty: 'easy',
          points: 15,
          description: 'Chương trình nhận vào hai dòng văn bản:\n- Dòng 1: một danh từ (ví dụ: `Python`)\n- Dòng 2: một tính từ (ví dụ: `vi dieu`)\n\nHãy in ra câu hoàn chỉnh có cấu trúc:\n`Lap trinh {danh_tu} {tinh_tu}`',
          starterCode: '# Nhập 2 dòng và ghép câu\ndanh_tu = input()\ntinh_tu = input()\n',
          expectedLearningOutcome: 'Thực hành đọc nhiều dòng input liên tiếp và kết hợp thành văn bản có ý nghĩa.',
          skillTags: ['python_input_str', 'multiline_input'],
          hints: [
            'Gọi input() 2 lần để gán cho 2 biến riêng biệt.',
            'In ra với print(f"Lap trinh {danh_tu} {tinh_tu}")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-01-09-samp-1',
              exerciseId: 'ex-01-09',
              inputData: 'Python\nvi dieu',
              expectedOutput: 'Lap trinh Python vi dieu',
              explanation: 'Ghép danh từ dòng 1 và tính từ dòng 2.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-fixture-02',
          lessonId: 'lesson-04-nhap-du-lieu-input',
          topicId: 'topic-01-lam-quen-python',
          slug: 'nhap-ten-va-tuoi',
          title: 'Nhập tên và tuổi',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào tên (chuỗi) từ dòng thứ nhất và tuổi (số nguyên) từ dòng thứ hai. In ra màn hình theo định dạng: `Ban {ten} nam nay {tuoi} tuoi`.',
          starterCode: '# Nhập dữ liệu và in ra kết quả\nten = input()\ntuoi = int(input())\nprint(f"Ban {ten} nam nay {tuoi} tuoi")\n',
          expectedLearningOutcome: 'Kết hợp nhập chuỗi và nhập số nguyên qua ép kiểu int(input()).',
          skillTags: ['python_input_str', 'python_type_casting'],
          hints: ['Dùng int(input()) để đọc số tuổi.'],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 3,
          isPublished: true,
          examples: [
            {
              id: 'ex-sample-02-1',
              exerciseId: 'ex-fixture-02',
              inputData: 'Huy\n20',
              expectedOutput: 'Ban Huy nam nay 20 tuoi',
              explanation: 'Trường hợp thông thường với tên chữ cái đơn giản.',
              orderIndex: 1,
            },
          ],
        },
        {
          id: 'ex-fixture-03',
          lessonId: 'lesson-04-nhap-du-lieu-input',
          topicId: 'topic-01-lam-quen-python',
          slug: 'hoan-doi-hai-bien',
          title: 'Hoán đổi hai biến',
          difficulty: 'medium',
          points: 20,
          description: 'Nhập vào 2 số nguyên a và b trên 2 dòng riêng biệt. Hãy hoán đổi giá trị của 2 biến bằng cú pháp Pythonic (`a, b = b, a`) và in ra `Truoc: a={a}, b={b} Sau: a={b}, b={a}`.',
          starterCode: 'a = int(input())\nb = int(input())\n# Thực hiện hoán đổi giá trị\n\n',
          expectedLearningOutcome: 'Nắm được kỹ thuật hoán vị giá trị đa biến đặc trưng của Python mà không cần biến tạm.',
          skillTags: ['python_variables', 'multiple_assignment'],
          hints: ['Sử dụng cú pháp a, b = b, a không dùng biến tạm temp.'],
          completionCriteria: {
            requiredTests: 'all',
            forbiddenTokens: ['temp', 'tmp'],
          },
          orderIndex: 4,
          isPublished: true,
          examples: [
            {
              id: 'ex-sample-03-1',
              exerciseId: 'ex-fixture-03',
              inputData: '5\n10',
              expectedOutput: 'Truoc: a=5, b=10 Sau: a=10, b=5',
              explanation: 'Trường hợp hai số nguyên dương.',
              orderIndex: 1,
            },
          ],
        },
      ],
    },
  ],
};
