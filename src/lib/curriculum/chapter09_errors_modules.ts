import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_09_ERRORS_MODULES: Topic = {
  id: 'topic-09-xu-ly-loi-va-module',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-09-xu-ly-loi-va-module',
  title: 'Chủ đề 09: Xử lý ngoại lệ và Tổ chức chương trình (Exceptions & Modules)',
  summary: 'Xây dựng phần mềm ổn định và có cấu trúc: Bắt và xử lý ngoại lệ với try-except-finally, chủ động ném lỗi với raise, tổ chức mã nguồn theo module và khai thác thư viện chuẩn math, random, datetime.',
  orderIndex: 9,
  category: 'Cấu trúc chương trình',
  isPublished: true,
  isLocked: false,
  accentColor: 'peach',
  lessons: [
    {
      id: 'lesson-09-01-try-except-finally',
      topicId: 'topic-09-xu-ly-loi-va-module',
      slug: 'xu-ly-ngoai-le-try-except',
      title: 'Bài 01: Xử lý ngoại lệ với try, except và finally',
      theoryContent: `Khi viết chương trình, lỗi có thể xảy ra ngoài ý muốn trong quá trình thực thi (Runtime Error) ví dụ: chia cho số 0 (\`ZeroDivisionError\`), nhập chữ thay vì số (\`ValueError\`), hoặc truy cập phần tử ngoài danh sách (\`IndexError\`).

Để chương trình không bị sập (crash) đột ngột, Python cung cấp cấu trúc xử lý ngoại lệ:
\`\`\`python
try:
    # Đoạn mã có nguy cơ phát sinh lỗi
    a = int(input())
    b = int(input())
    print(a / b)
except ZeroDivisionError:
    print("Khong the chia cho 0!")
except ValueError:
    print("Vui long nhap so nguyen hop le!")
finally:
    print("Hoan tat kiem tra.") # Luon luon chay du co loi hay khong
\`\`\``,
      learningObjectives: [
        'Nhận biết các loại ngoại lệ phổ biến trong Python (ValueError, ZeroDivisionError, IndexError).',
        'Bảo vệ chương trình bằng cấu trúc try - except an toàn.',
        'Sử dụng khối finally để dọn dẹp tài nguyên hoặc thực thi các thao tác bắt buộc.',
      ],
      prerequisites: [
        'Đã học cú pháp hàm và câu lệnh điều kiện.',
      ],
      codeExamples: [
        {
          title: 'Bắt lỗi chia cho số 0',
          code: 'try:\n    kq = 10 / 0\nexcept ZeroDivisionError:\n    print("Loi: Mau so bang 0")\nfinally:\n    print("Xong")',
          expectedOutput: 'Loi: Mau so bang 0\nXong',
          explanation: 'Nhánh except ZeroDivisionError bắt lỗi chia cho 0 và khối finally luôn chạy.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Dùng except trống: except:',
          explanation: 'Bắt mọi lỗi một cách mù quáng, che giấu cả các lỗi nghiêm trọng như KeyboardInterrupt hoặc cú pháp sai.',
          fix: 'Luôn chỉ định rõ loại ngoại lệ cụ thể cần bắt: except ValueError, except ZeroDivisionError.',
        },
      ],
      guidedPracticeTask: {
        title: 'Chuyển đổi chuỗi thành số an toàn',
        instructions: 'Dùng try-except để chuyển chuỗi s thành số nguyên, nếu lỗi in "Khong phai so".',
        hint: 'try: int(s) except ValueError: print(...)',
      },
      recap: [
        'try chứa code nghi vấn có lỗi.',
        'except bắt và xử lý khi lỗi xảy ra.',
        'finally luôn chạy bất kể thành công hay có ngoại lệ.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Try Except',
          url: 'https://www.w3schools.com/python/python_try_except.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-09-01',
          lessonId: 'lesson-09-01-try-except-finally',
          topicId: 'topic-09-xu-ly-loi-va-module',
          slug: 'phep-chia-an-toan-try-except',
          title: 'Phép chia an toàn với try - except',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào hai số nguyên `a` (dòng 1) và `b` (dòng 2). Sử dụng khối `try - except` để thực hiện phép chia `a / b`:\n- Nếu phép tính thành công, in ra thương dưới dạng số thực làm tròn 2 chữ số thập phân (ví dụ: `2.50` hoặc `3.33`).\n- Nếu `b == 0` phát sinh lỗi `ZeroDivisionError`, in ra thông báo: `Loi chia cho 0`',
          starterCode: 'a = int(input())\nb = int(input())\n# Dùng try-except để chia a cho b an toàn\n',
          expectedLearningOutcome: 'Sử dụng cấu trúc try - except để bắt lỗi ZeroDivisionError.',
          skillTags: ['python_exceptions', 'try_except', 'zero_division'],
          hints: [
            'try:\n    kq = a / b\n    print(f"{kq:.2f}")\nexcept ZeroDivisionError:\n    print("Loi chia cho 0")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-09-01-samp-1',
              exerciseId: 'ex-09-01',
              inputData: '10\n4',
              expectedOutput: '2.50',
              explanation: '10 / 4 = 2.50.',
              orderIndex: 1,
            },
            {
              id: 'ex-09-01-samp-2',
              exerciseId: 'ex-09-01',
              inputData: '5\n0',
              expectedOutput: 'Loi chia cho 0',
              explanation: 'Mẫu số bằng 0 gây ra ZeroDivisionError.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-09-02-chu-dong-nem-loi-raise',
      topicId: 'topic-09-xu-ly-loi-va-module',
      slug: 'chu-dong-nem-loi-raise',
      title: 'Bài 02: Chủ động kiểm soát với từ khóa raise',
      theoryContent: `Trong nhiều trường hợp nghiệp vụ, dữ liệu không vi phạm cú pháp của Python nhưng lại không hợp lệ theo quy tắc của bài toán (ví dụ: tuổi âm, số lượng mua hàng âm). Khi đó, lập trình viên có thể chủ động **ném ra một ngoại lệ** bằng từ khóa **\`raise\`**.

Cú pháp:
\`\`\`python
def rut_tien(so_du, so_tien):
    if so_tien <= 0:
        raise ValueError("So tien rut phai lon hon 0")
    if so_tien > so_du:
        raise ValueError("So du khong du")
    return so_du - so_tien
\`\`\`

Khi hàm \`rut_tien\` được gọi, nơi gọi hàm có thể dùng \`try - except ValueError as e\` để bắt và in ra thông điệp \`str(e)\`.`,
      learningObjectives: [
        'Hiểu cách dùng từ khóa raise để bảo vệ tính toàn vẹn của dữ liệu.',
        'Bắt thông điệp ngoại lệ bằng cú pháp except ExceptionType as e.',
      ],
      prerequisites: [
        'Đã học câu lệnh try - except và định nghĩa hàm.',
      ],
      codeExamples: [
        {
          title: 'Kiểm tra số âm với raise',
          code: 'def kiem_tra_duong(x):\n    if x < 0:\n        raise ValueError("So khong duoc am")\n    return x\n\ntry:\n    kiem_tra_duong(-5)\nexcept ValueError as e:\n    print("Bat duoc loi:", e)',
          expectedOutput: 'Bat duoc loi: So khong duoc am',
          explanation: 'Hàm chủ động ném ValueError khi nhận x < 0.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên khởi tạo đối tượng ngoại lệ: raise ValueError',
          explanation: 'Mặc dù cú pháp này hợp lệ, nhưng không truyền thông điệp mô tả lỗi cụ thể làm khó khăn cho việc gỡ lỗi.',
          fix: 'Luôn cung cấp chuỗi mô tả lỗi rõ ràng: raise ValueError("Thong diep loi chi tiet").',
        },
      ],
      guidedPracticeTask: {
        title: 'Xác thực mật khẩu',
        instructions: 'Nếu độ dài mật khẩu < 6, ném ValueError("Mat khau qua ngan").',
        hint: 'if len(mk) < 6: raise ValueError(...)',
      },
      recap: [
        'raise dùng để chủ động kích hoạt một ngoại lệ.',
        'as e cho phép truy cập thông điệp giải thích lỗi.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Raise Exception',
          url: 'https://www.w3schools.com/python/python_try_except.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-09-02',
          lessonId: 'lesson-09-02-chu-dong-nem-loi-raise',
          topicId: 'topic-09-xu-ly-loi-va-module',
          slug: 'kiem-tra-tuoi-hop-le-raise',
          title: 'Kiểm tra độ tuổi hợp lệ với raise ValueError',
          difficulty: 'medium',
          points: 20,
          description: 'Viết một hàm `kiem_tra_tuoi(tuoi)` nhận vào một số nguyên `tuoi`:\n- Nếu `tuoi < 0` hoặc `tuoi > 120`, hàm chủ động ném ra ngoại lệ `ValueError("Tuoi khong hop le")`.\n- Ngược lại, trả về chuỗi `Hop le`.\n\nTrong phần thân chính, nhập vào một số nguyên `tuoi`. Sử dụng khối `try - except ValueError as e` để gọi hàm. Nếu bắt được ngoại lệ thì in ra nội dung của lỗi `str(e)`, ngược lại in ra kết quả trả về của hàm.',
          starterCode: 'def kiem_tra_tuoi(tuoi):\n    # Chủ động raise ValueError nếu tuổi không hợp lệ\n    pass\n\nt = int(input())\ntry:\n    # Gọi hàm kiem_tra_tuoi và in kết quả\n    pass\nexcept ValueError as e:\n    print(e)\n',
          expectedLearningOutcome: 'Ném ngoại lệ với raise và bắt đối tượng ngoại lệ với except as e.',
          skillTags: ['python_exceptions', 'raise_keyword', 'input_validation'],
          hints: [
            'def kiem_tra_tuoi(tuoi):\n    if tuoi < 0 or tuoi > 120:\n        raise ValueError("Tuoi khong hop le")\n    return "Hop le"\n\ntry:\n    print(kiem_tra_tuoi(t))\nexcept ValueError as e:\n    print(e)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-09-02-samp-1',
              exerciseId: 'ex-09-02',
              inputData: '25',
              expectedOutput: 'Hop le',
              explanation: '25 nằm trong khoảng [0, 120].',
              orderIndex: 1,
            },
            {
              id: 'ex-09-02-samp-2',
              exerciseId: 'ex-09-02',
              inputData: '-5',
              expectedOutput: 'Tuoi khong hop le',
              explanation: 'Tuổi âm bị ném ra ValueError.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-09-03-modules-math-random-datetime',
      topicId: 'topic-09-xu-ly-loi-va-module',
      slug: 'modules-math-random-datetime',
      title: 'Bài 03: Khai thác thư viện chuẩn Python (math, random, datetime)',
      theoryContent: `Python được gọi là ngôn ngữ "Batteries Included" (Đi kèm pin sẵn) vì sở hữu kho thư viện chuẩn (Standard Library) phong phú và mạnh mẽ.

**1. Cú pháp nạp module**:
- \`import math\`: Nạp toàn bộ module, gọi hàm qua tiền tố \`math.sqrt(16)\`.
- \`from math import sqrt, pi\`: Nạp đích danh hàm, gọi trực tiếp \`sqrt(16)\`.

**2. Các module phổ biến**:
- \`math\`: Toán học nâng cao (\`math.sqrt()\`, \`math.factorial()\`, \`math.ceil()\`, \`math.floor()\`, hằng số \`math.pi\`).
- \`random\`: Sinh số ngẫu nhiên (\`random.randint(a, b)\`, \`random.choice(lst)\`).
- \`datetime\`: Làm việc với thời gian ngày tháng (\`datetime.date.today()\`).`,
      learningObjectives: [
        'Hiểu cơ chế import và from ... import.',
        'Sử dụng module math để tính toán các phép toán nâng cao (căn bậc 2, giai thừa, hàm tròn).',
      ],
      prerequisites: [
        'Đã học kiến thức cơ bản về số học và hàm.',
      ],
      codeExamples: [
        {
          title: 'Sử dụng module math',
          code: 'import math\n\nprint("Pi:", round(math.pi, 2))\nprint("Can bac hai cua 25:", math.sqrt(25))\nprint("Giai thua cua 4:", math.factorial(4))',
          expectedOutput: 'Pi: 3.14\nCan bac hai cua 25: 5.0\nGiai thua cua 4: 24',
          explanation: 'Các hàm chuẩn của math cho kết quả chính xác cao.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Trùng tên file với tên module thư viện chuẩn (vd: math.py)',
          explanation: 'Khi chạy import math, Python sẽ nạp nhầm file của bạn thay vì thư viện chuẩn, gây lỗi AttributeError.',
          fix: 'Không bao giờ đặt tên file trùng với tên module chuẩn (như math.py, random.py, test.py).',
        },
      ],
      guidedPracticeTask: {
        title: 'Tính diện tích hình tròn với math.pi',
        instructions: 'Dùng math.pi * r * r để tính diện tích hình tròn bán kính r.',
        hint: 'import math; dt = math.pi * r * r',
      },
      recap: [
        'import mang các module có sẵn vào chương trình.',
        'math cung cấp các hàm toán học tối ưu viết bằng C.',
        'Hạn chế dùng from module import * để tránh xung đột tên gọi.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Modules',
          url: 'https://www.w3schools.com/python/python_modules.asp',
        },
        {
          title: 'W3Schools Python Math',
          url: 'https://www.w3schools.com/python/python_math.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-09-03',
          lessonId: 'lesson-09-03-modules-math-random-datetime',
          topicId: 'topic-09-xu-ly-loi-va-module',
          slug: 'tinh-toan-voi-module-math',
          title: 'Tính căn bậc hai và giai thừa với module math',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào một số thực dương `x` (dòng 1) và một số nguyên không âm `n` (dòng 2).\n\nSử dụng thư viện chuẩn `math`:\n- Tính căn bậc hai của `x` bằng `math.sqrt()` và in ra màn hình làm tròn 2 chữ số thập phân (dòng 1).\n- Tính giai thừa `n!` bằng `math.factorial()` và in ra kết quả số nguyên (dòng 2).',
          starterCode: 'import math\n\nx = float(input())\nn = int(input())\n# Dùng math.sqrt và math.factorial để in kết quả\n',
          expectedLearningOutcome: 'Nạp và sử dụng các hàm toán học tiêu chuẩn từ module math.',
          skillTags: ['python_modules', 'math_library', 'standard_library'],
          hints: [
            'import math\nprint(f"{math.sqrt(x):.2f}")\nprint(math.factorial(n))',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-09-03-samp-1',
              exerciseId: 'ex-09-03',
              inputData: '9.0\n5',
              expectedOutput: '3.00\n120',
              explanation: 'sqrt(9) = 3.00 và 5! = 120.',
              orderIndex: 1,
            },
            {
              id: 'ex-09-03-samp-2',
              exerciseId: 'ex-09-03',
              inputData: '2.0\n0',
              expectedOutput: '1.41\n1',
              explanation: 'sqrt(2) = 1.41 và 0! = 1.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};

