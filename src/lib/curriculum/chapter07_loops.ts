import { Topic } from '@/lib/types/curriculum';

export const CHAPTER_07_LOOPS: Topic = {
  id: 'topic-07-vong-lap',
  courseId: 'course-codecobug-python-mastery',
  slug: 'chu-de-07-vong-lap',
  title: 'Chủ đề 07: Vòng lặp trong Python (for và while)',
  summary: 'Làm chủ kỹ thuật lặp lại tự động: Vòng lặp for với hàm range, vòng lặp while có điều kiện dừng, điều khiển luồng lặp với break/continue và kỹ thuật tích lũy tính toán.',
  orderIndex: 7,
  category: 'Cấu trúc điều khiển',
  isPublished: true,
  isLocked: false,
  accentColor: 'sky',
  lessons: [
    {
      id: 'lesson-07-01-vong-lap-for-range',
      topicId: 'topic-07-vong-lap',
      slug: 'vong-lap-for-va-ham-range',
      title: 'Bài 01: Vòng lặp for và hàm range()',
      theoryContent: `Vòng lặp \`for\` trong Python được sử dụng để lặp qua một chuỗi các phần tử (như danh sách, chuỗi, hoặc dãy số do hàm \`range()\` sinh ra).

**Hàm \`range()\`**:
1. \`range(n)\`: Sinh các số từ \`0\` đến \`n - 1\` (tổng cộng n số).
2. \`range(start, stop)\`: Sinh các số từ \`start\` đến \`stop - 1\`.
3. \`range(start, stop, step)\`: Sinh các số từ \`start\` đến \`stop - 1\` với bước nhảy \`step\` (có thể là số âm để đếm lùi).

Cú pháp:
\`\`\`python
for i in range(5):
    print(i) # In ra: 0, 1, 2, 3, 4
\`\`\``,
      learningObjectives: [
        'Hiểu cơ chế duyệt phần tử tuần tự của vòng lặp for.',
        'Sử dụng thành thạo 3 cách gọi của hàm range(n), range(a, b), range(a, b, step).',
        'Áp dụng vòng lặp for để sinh dãy số và in ấn theo yêu cầu.',
      ],
      prerequisites: [
        'Đã học cú pháp cơ bản và thụt lề trong Python.',
      ],
      codeExamples: [
        {
          title: 'Duyệt dãy số với bước nhảy',
          code: 'for i in range(1, 10, 2):\n    print(i, end=" ")',
          expectedOutput: '1 3 5 7 9 ',
          explanation: 'Bắt đầu từ 1, tăng mỗi lần 2 đơn vị và dừng trước 10.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nghĩ rằng range(1, 5) sẽ bao gồm cả số 5',
          explanation: 'range(a, b) luôn dừng ở b - 1 (nửa khoảng đóng mở [a, b)).',
          fix: 'Nếu muốn lặp đến 5, phải viết range(1, 6).',
        },
      ],
      guidedPracticeTask: {
        title: 'In bảng số từ 1 đến 10',
        instructions: 'Dùng for và range(1, 11) để in các số từ 1 đến 10.',
        hint: 'for i in range(1, 11): print(i)',
      },
      recap: [
        'for i in range(n) lặp lại chính xác n lần.',
        'Tham số stop luôn không được tính vào dãy.',
        'step có thể là số dương (tăng) hoặc số âm (giảm).',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python For Loops',
          url: 'https://www.w3schools.com/python/python_for_loops.asp',
        },
      ],
      orderIndex: 1,
      isPublished: true,
      exercises: [
        {
          id: 'ex-07-01',
          lessonId: 'lesson-07-01-vong-lap-for-range',
          topicId: 'topic-07-vong-lap',
          slug: 'in-day-so-chan',
          title: 'In các số chẵn từ 2 đến N',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào một số nguyên dương `n` (`n >= 2`). Sử dụng vòng lặp `for` và hàm `range` để in tất cả các số chẵn trong đoạn từ `2` đến `n`. Mỗi số in trên một dòng riêng biệt.',
          starterCode: 'n = int(input())\n# Dùng vòng lặp for in các số chẵn từ 2 đến n\n',
          expectedLearningOutcome: 'Sử dụng vòng lặp for với bước nhảy range(2, n + 1, 2).',
          skillTags: ['python_loops', 'for_loop', 'range_function'],
          hints: [
            'Dùng range(2, n + 1, 2) để duyệt trực tiếp qua các số chẵn.',
            'for i in range(2, n + 1, 2):\n    print(i)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-07-01-samp-1',
              exerciseId: 'ex-07-01',
              inputData: '6',
              expectedOutput: '2\n4\n6',
              explanation: 'Các số chẵn từ 2 đến 6 là 2, 4, 6.',
              orderIndex: 1,
            },
            {
              id: 'ex-07-01-samp-2',
              exerciseId: 'ex-07-01',
              inputData: '9',
              expectedOutput: '2\n4\n6\n8',
              explanation: 'Các số chẵn từ 2 đến 9 là 2, 4, 6, 8.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-07-02-vong-lap-while',
      topicId: 'topic-07-vong-lap',
      slug: 'vong-lap-while',
      title: 'Bài 02: Vòng lặp while với điều kiện dừng',
      theoryContent: `Vòng lặp \`while\` được sử dụng khi chúng ta muốn lặp lại một khối lệnh **chừng nào điều kiện logic vẫn còn đúng (\`True\`)**.

Cú pháp:
\`\`\`python
while dieu_kien:
    # Khối lệnh được thực thi
    # Cần có lệnh thay đổi biến điều kiện để tránh lặp vô tận!
\`\`\`

**LỖI LẶP VÔ TẬN (Infinite Loop)**:
Nếu điều kiện lặp luôn luôn \`True\` và không bao giờ chuyển thành \`False\`, chương trình sẽ chạy mãi mãi làm treo máy tính. Luôn đảm bảo trong thân \`while\` có thao tác biến đổi biến đếm!`,
      learningObjectives: [
        'Hiểu bản chất của vòng lặp while dựa trên kiểm tra điều kiện.',
        'Nhận diện và tránh lỗi vòng lặp vô tận (infinite loop).',
        'Xây dựng biến đếm và điều kiện dừng chuẩn xác.',
      ],
      prerequisites: [
        'Đã học biểu thức so sánh và logic boolean.',
      ],
      codeExamples: [
        {
          title: 'Đếm tăng dần từ 1 đến 3',
          code: 'count = 1\nwhile count <= 3:\n    print(count)\n    count += 1',
          expectedOutput: '1\n2\n3',
          explanation: 'Sau mỗi lần in, biến count tăng lên 1 cho đến khi count = 4 thì dừng.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Quên tăng biến đếm trong thân while: count += 1',
          explanation: 'Dẫn đến vòng lặp vô tận, máy chủ chấm thi sẽ báo Time Limit Exceeded (Hết giờ).',
          fix: 'Luôn kiểm tra dòng lệnh cập nhật biến kiểm soát vòng lặp.',
        },
      ],
      guidedPracticeTask: {
        title: 'Chia đôi liên tục',
        instructions: 'Nhập số n, chừng nào n > 1 thì chia nguyên n cho 2 và in ra.',
        hint: 'while n > 1: n //= 2; print(n)',
      },
      recap: [
        'while kiểm tra điều kiện trước mỗi vòng lặp.',
        'Thích hợp khi số lần lặp chưa biết trước.',
        'Bắt buộc phải cập nhật biến điều kiện để thoát vòng lặp.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python While Loops',
          url: 'https://www.w3schools.com/python/python_while_loops.asp',
        },
      ],
      orderIndex: 2,
      isPublished: true,
      exercises: [
        {
          id: 'ex-07-02',
          lessonId: 'lesson-07-02-vong-lap-while',
          topicId: 'topic-07-vong-lap',
          slug: 'dem-nguoc-countdown',
          title: 'Đếm ngược Countdown với while',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào một số nguyên dương `n`. Dùng vòng lặp `while` để in các số đếm ngược từ `n` về `1` (mỗi số trên 1 dòng). Sau khi kết thúc vòng lặp, in ra dòng chữ `Xong!`.',
          starterCode: 'n = int(input())\n# Đếm ngược từ n về 1 bằng while, sau đó in Xong!\n',
          expectedLearningOutcome: 'Sử dụng vòng lặp while với bước giảm biến đếm.',
          skillTags: ['python_loops', 'while_loop', 'counter_decrement'],
          hints: [
            'while n >= 1:\n    print(n)\n    n -= 1\nprint("Xong!")',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-07-02-samp-1',
              exerciseId: 'ex-07-02',
              inputData: '3',
              expectedOutput: '3\n2\n1\nXong!',
              explanation: 'Đếm 3, 2, 1 rồi in Xong!',
              orderIndex: 1,
            },
            {
              id: 'ex-07-02-samp-2',
              exerciseId: 'ex-07-02',
              inputData: '1',
              expectedOutput: '1\nXong!',
              explanation: 'Đếm 1 rồi in Xong!',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-07-03-break-continue',
      topicId: 'topic-07-vong-lap',
      slug: 'lenh-break-va-continue',
      title: 'Bài 03: Điều khiển luồng lặp với break và continue',
      theoryContent: `Trong khi chạy vòng lặp (\`for\` hoặc \`while\`), chúng ta có thể chủ động thay đổi hành vi lặp bằng 2 từ khóa:
1. **\`break\`**: Lập tức **kết thúc và thoát khỏi** vòng lặp hiện tại, chuyển sang câu lệnh kế tiếp bên ngoài vòng lặp.
2. **\`continue\`**: Bỏ qua phần còn lại của **lần lặp hiện tại** và lập tức chuyển sang lần lặp kế tiếp.

Ví dụ minh họa:
\`\`\`python
# Dùng continue để bỏ qua số chẵn
for i in range(1, 6):
    if i % 2 == 0:
        continue
    print(i) # Chỉ in: 1, 3, 5

# Dùng break để dừng khi gặp số 3
for i in range(1, 6):
    if i == 3:
        break
    print(i) # Chỉ in: 1, 2
\`\`\``,
      learningObjectives: [
        'Phân biệt rõ ràng chức năng của break (thoát hẳn) và continue (bỏ qua lượt này).',
        'Ứng dụng break để dừng tìm kiếm sớm khi đã có kết quả.',
        'Ứng dụng continue để lọc dữ liệu không cần xử lý.',
      ],
      prerequisites: [
        'Đã học for và while.',
      ],
      codeExamples: [
        {
          title: 'Tìm số đầu tiên chia hết cho 7',
          code: 'for i in range(10, 30):\n    if i % 7 == 0:\n        print("Tim thay:", i)\n        break',
          expectedOutput: 'Tim thay: 14',
          explanation: 'Gặp 14 là số đầu tiên chia hết cho 7 thì break dừng ngay.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Nhầm lẫn giữa break và continue',
          explanation: 'break thoát khỏi toàn bộ vòng lặp, còn continue chỉ bỏ qua vòng lặp con hiện tại.',
          fix: 'Xác định rõ muốn ngắt toàn bộ hay chỉ muốn nhảy cóc sang bước tiếp theo.',
        },
      ],
      guidedPracticeTask: {
        title: 'Bỏ qua số cấm',
        instructions: 'Duyệt các số từ 1 đến 5, nếu gặp 3 thì continue không in.',
        hint: 'if i == 3: continue; print(i)',
      },
      recap: [
        'break ngắt hoàn toàn vòng lặp.',
        'continue nhảy sang vòng lặp tiếp theo.',
        'Cả hai đều giúp tối ưu thời gian thực thi chương trình.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Python Break & Continue',
          url: 'https://www.w3schools.com/python/python_while_loops.asp',
        },
      ],
      orderIndex: 3,
      isPublished: true,
      exercises: [
        {
          id: 'ex-07-03',
          lessonId: 'lesson-07-03-break-continue',
          topicId: 'topic-07-vong-lap',
          slug: 'tim-so-chia-het-dau-tien',
          title: 'Tìm số nguyên đầu tiên chia hết cho K',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào hai số nguyên `start` và `k` (`k > 0`). Hãy duyệt từ `start` tăng dần và tìm số nguyên **đầu tiên** lớn hơn hoặc bằng `start` mà chia hết cho `k`. In số đó ra màn hình và kết thúc (sử dụng lệnh `break`).',
          starterCode: 'start = int(input())\nk = int(input())\n# Dùng vòng lặp và lệnh break để tìm số đầu tiên >= start chia hết cho k\n',
          expectedLearningOutcome: 'Làm chủ lệnh break để thoát vòng lặp ngay khi tìm thấy mục tiêu.',
          skillTags: ['python_loops', 'break_statement', 'search_algorithm'],
          hints: [
            'cur = start\nwhile True:\n    if cur % k == 0:\n        print(cur)\n        break\n    cur += 1',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-07-03-samp-1',
              exerciseId: 'ex-07-03',
              inputData: '10\n7',
              expectedOutput: '14',
              explanation: 'Số >= 10 đầu tiên chia hết cho 7 là 14.',
              orderIndex: 1,
            },
            {
              id: 'ex-07-03-samp-2',
              exerciseId: 'ex-07-03',
              inputData: '25\n5',
              expectedOutput: '25',
              explanation: '25 chia hết cho 5.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'lesson-07-04-vong-lap-long-nhau-va-tich-luy',
      topicId: 'topic-07-vong-lap',
      slug: 'vong-lap-long-nhau-va-tich-luy',
      title: 'Bài 04: Kỹ thuật biến tích lũy & Vòng lặp lồng nhau',
      theoryContent: `**1. Kỹ thuật biến tích lũy (Accumulator Pattern)**:
Thường dùng để tính tổng, tích, đếm số lượng:
- Khởi tạo biến tích lũy trước vòng lặp (\`tong = 0\`, \`tich = 1\`, \`dem = 0\`).
- Trong mỗi lượt lặp, cập nhật biến: \`tong += gia_tri\`.

**2. Vòng lặp lồng nhau (Nested Loops)**:
Là việc đặt một vòng lặp bên trong một vòng lặp khác. Rất hữu ích khi vẽ hình, duyệt bảng 2 chiều ma trận:
\`\`\`python
for i in range(3):
    for j in range(2):
        print(f"({i},{j})", end=" ")
    print() # Xuống dòng khi hết một hàng
\`\`\``,
      learningObjectives: [
        'Nắm vững kỹ thuật khởi tạo và cộng dồn biến tích lũy.',
        'Hiểu quy tắc chạy của vòng lặp bên trong và vòng lặp bên ngoài.',
        'Ứng dụng in ma trận và vẽ hình học cơ bản bằng dấu ký tự.',
      ],
      prerequisites: [
        'Đã thành thạo vòng lặp for cơ bản.',
      ],
      codeExamples: [
        {
          title: 'Tính tổng từ 1 đến 5',
          code: 'tong = 0\nfor i in range(1, 6):\n    tong += i\nprint("Tong:", tong)',
          expectedOutput: 'Tong: 15',
          explanation: '1 + 2 + 3 + 4 + 5 = 15.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Khởi tạo lại biến tích lũy bên trong thân vòng lặp',
          explanation: 'Mỗi lần lặp biến lại bị reset về 0, làm mất dữ liệu tích lũy.',
          fix: 'Luôn đặt biến tích lũy bên ngoài (phía trên) vòng lặp.',
        },
      ],
      guidedPracticeTask: {
        title: 'Tính giai thừa n!',
        instructions: 'Khởi tạo tich = 1. Duyệt for i in range(1, n+1): tich *= i.',
        hint: 'tich = 1; for i in range(1, n+1): tich *= i',
      },
      recap: [
        'Biến tích lũy phải được khởi tạo trước khi lặp.',
        'Vòng lặp lồng nhau: vòng ngoài chạy 1 bước thì vòng trong chạy toàn bộ các bước.',
      ],
      referenceLinks: [
        {
          title: 'W3Schools Nested Loops',
          url: 'https://www.w3schools.com/python/python_for_loops.asp',
        },
      ],
      orderIndex: 4,
      isPublished: true,
      exercises: [
        {
          id: 'ex-07-04',
          lessonId: 'lesson-07-04-vong-lap-long-nhau-va-tich-luy',
          topicId: 'topic-07-vong-lap',
          slug: 'tinh-tong-day-so-tu-1-den-n',
          title: 'Tính tổng dãy số từ 1 đến N',
          difficulty: 'very_easy',
          points: 10,
          description: 'Nhập vào một số nguyên dương `n`. Hãy sử dụng vòng lặp và kỹ thuật biến tích lũy để tính tổng `S = 1 + 2 + 3 + ... + n` và in kết quả ra màn hình.',
          starterCode: 'n = int(input())\n# Dùng vòng lặp tính tổng từ 1 đến n\n',
          expectedLearningOutcome: 'Áp dụng kỹ thuật biến tích lũy tong += i qua vòng lặp for.',
          skillTags: ['python_loops', 'accumulator_pattern', 'math_sum'],
          hints: [
            'tong = 0\nfor i in range(1, n + 1):\n    tong += i\nprint(tong)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 1,
          isPublished: true,
          examples: [
            {
              id: 'ex-07-04-samp-1',
              exerciseId: 'ex-07-04',
              inputData: '5',
              expectedOutput: '15',
              explanation: '1 + 2 + 3 + 4 + 5 = 15.',
              orderIndex: 1,
            },
            {
              id: 'ex-07-04-samp-2',
              exerciseId: 'ex-07-04',
              inputData: '10',
              expectedOutput: '55',
              explanation: '1 + 2 + ... + 10 = 55.',
              orderIndex: 2,
            },
          ],
        },
        {
          id: 'ex-07-05',
          lessonId: 'lesson-07-04-vong-lap-long-nhau-va-tich-luy',
          topicId: 'topic-07-vong-lap',
          slug: 've-hinh-chu-nhat-sao',
          title: 'Vẽ hình chữ nhật dấu sao',
          difficulty: 'easy',
          points: 15,
          description: 'Nhập vào 2 số nguyên dương: số hàng `rows` trên dòng 1, và số cột `cols` trên dòng 2. Hãy in ra hình chữ nhật gồm các ký tự `*` có kích thước tương ứng.',
          starterCode: 'rows = int(input())\ncols = int(input())\n# In hình chữ nhật dấu sao kích thước rows x cols\n',
          expectedLearningOutcome: 'Sử dụng vòng lặp lồng nhau hoặc nhân bản chuỗi ký tự để in lưới 2 chiều.',
          skillTags: ['python_loops', 'nested_loops', 'string_formatting'],
          hints: [
            'for r in range(rows):\n    print("*" * cols)',
          ],
          completionCriteria: {
            requiredTests: 'all',
          },
          orderIndex: 2,
          isPublished: true,
          examples: [
            {
              id: 'ex-07-05-samp-1',
              exerciseId: 'ex-07-05',
              inputData: '3\n4',
              expectedOutput: '****\n****\n****',
              explanation: '3 hàng, mỗi hàng 4 dấu sao.',
              orderIndex: 1,
            },
            {
              id: 'ex-07-05-samp-2',
              exerciseId: 'ex-07-05',
              inputData: '2\n2',
              expectedOutput: '**\n**',
              explanation: '2 hàng, mỗi hàng 2 dấu sao.',
              orderIndex: 2,
            },
          ],
        },
      ],
    },
  ],
};
