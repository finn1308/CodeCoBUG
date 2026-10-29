import { Course, Topic } from '../types/curriculum';

/**
 * TECHNICAL TEST FIXTURES
 * WARNING: These sample data fixtures are strictly for testing the UI, Monaco Editor,
 * and execution pipelines during development.
 * DO NOT treat as authoritative production curriculum. Real curriculum will be supplied by user.
 */
export const SAMPLE_TEST_COURSE: Course = {
  id: 'course-test-fixture-01',
  slug: 'python-co-ban',
  title: 'Giáo trình Python Cơ bản (Mẫu Kiểm thử)',
  description: 'Môi trường kiểm thử giao diện và động cơ chấm bài CodeCoBUG.',
  orderIndex: 1,
  isPublished: true,
  topics: [
    {
      id: 'topic-fixture-01',
      courseId: 'course-test-fixture-01',
      slug: 'chu-de-01-lam-quen-python',
      title: 'Chủ đề 01: Làm quen Python & I/O',
      summary: 'Làm quen môi trường, lệnh print(), input() và xuất dữ liệu có định dạng.',
      orderIndex: 1,
      isPublished: true,
      lessons: [
        {
          id: 'lesson-fixture-01',
          topicId: 'topic-fixture-01',
          slug: 'bai-01-in-loi-chao',
          title: 'Bài 01: In lời chào đầu tiên',
          theoryContent: 'Hàm `print()` trong Python dùng để xuất dữ liệu ra màn hình terminal.',
          orderIndex: 1,
          isPublished: true,
          exercises: [
            {
              id: 'ex-fixture-01',
              lessonId: 'lesson-fixture-01',
              topicId: 'topic-fixture-01',
              slug: 'in-loi-chao-codecobug',
              title: 'In lời chào CodeCoBUG',
              difficulty: 'very_easy',
              points: 10,
              description: 'Viết chương trình Python in ra dòng chữ chính xác: `Xin chao CodeCoBUG` ra màn hình.',
              starterCode: '# Viết code của bạn ở đây\nprint("Xin chao CodeCoBUG")\n',
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
                  explanation: 'Chương trình không nhận input, in trực tiếp chuỗi ra terminal.',
                  orderIndex: 1,
                },
                {
                  id: 'ex-sample-01-2',
                  exerciseId: 'ex-fixture-01',
                  inputData: '',
                  expectedOutput: 'Xin chao CodeCoBUG',
                  explanation: 'Kiểm tra độ chính xác của khoảng trắng giữa các từ.',
                  orderIndex: 2,
                },
                {
                  id: 'ex-sample-01-3',
                  exerciseId: 'ex-fixture-01',
                  inputData: '',
                  expectedOutput: 'Xin chao CodeCoBUG',
                  explanation: 'Kiểm tra không in thừa ký tự lạ hoặc dòng trống không cần thiết.',
                  orderIndex: 3,
                },
              ],
              testCases: [
                {
                  id: 'tc-01-1',
                  exerciseId: 'ex-fixture-01',
                  inputData: '',
                  expectedOutput: 'Xin chao CodeCoBUG',
                  isHidden: false,
                  comparisonMode: 'normalized_lines',
                  weight: 1,
                  orderIndex: 1,
                },
                {
                  id: 'tc-01-2',
                  exerciseId: 'ex-fixture-01',
                  inputData: '',
                  expectedOutput: 'Xin chao CodeCoBUG',
                  isHidden: false,
                  comparisonMode: 'normalized_lines',
                  weight: 1,
                  orderIndex: 2,
                },
                {
                  id: 'tc-01-3',
                  exerciseId: 'ex-fixture-01',
                  inputData: '',
                  expectedOutput: 'Xin chao CodeCoBUG',
                  isHidden: false,
                  comparisonMode: 'normalized_lines',
                  weight: 1,
                  orderIndex: 3,
                },
              ],
            },
            {
              id: 'ex-fixture-02',
              lessonId: 'lesson-fixture-01',
              topicId: 'topic-fixture-01',
              slug: 'nhap-ten-va-tuoi',
              title: 'Nhập tên và tuổi',
              difficulty: 'easy',
              points: 15,
              description: 'Nhập vào tên (chuỗi) từ dòng thứ nhất và tuổi (số nguyên) từ dòng thứ hai. In ra màn hình theo định dạng: `Ban {ten} nam nay {tuoi} tuoi`.',
              starterCode: '# Nhập dữ liệu và in ra kết quả\nten = input()\ntuoi = int(input())\nprint(f"Ban {ten} nam nay {tuoi} tuoi")\n',
              completionCriteria: {
                requiredTests: 'all',
              },
              orderIndex: 2,
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
                {
                  id: 'ex-sample-02-2',
                  exerciseId: 'ex-fixture-02',
                  inputData: 'Nguyen Van A\n15',
                  expectedOutput: 'Ban Nguyen Van A nam nay 15 tuoi',
                  explanation: 'Trường hợp tên có nhiều từ chứa khoảng trắng.',
                  orderIndex: 2,
                },
                {
                  id: 'ex-sample-02-3',
                  exerciseId: 'ex-fixture-02',
                  inputData: 'Alice\n1',
                  expectedOutput: 'Ban Alice nam nay 1 tuoi',
                  explanation: 'Trường hợp giá trị tuổi nhỏ nhất.',
                  orderIndex: 3,
                },
              ],
            },
            {
              id: 'ex-fixture-03',
              lessonId: 'lesson-fixture-01',
              topicId: 'topic-fixture-01',
              slug: 'hoan-doi-hai-bien',
              title: 'Hoán đổi hai biến',
              difficulty: 'medium',
              points: 20,
              description: 'Nhập vào 2 số nguyên a và b trên 2 dòng riêng biệt. Hãy hoán đổi giá trị của 2 biến bằng cú pháp Pythonic (`a, b = b, a`) và in ra `Truoc: a={a}, b={b} Sau: a={b}, b={a}`.',
              starterCode: 'a = int(input())\nb = int(input())\n# Thực hiện hoán đổi giá trị\n\n',
              completionCriteria: {
                requiredTests: 'all',
                forbiddenTokens: ['temp', 'tmp'],
              },
              orderIndex: 3,
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
                {
                  id: 'ex-sample-03-2',
                  exerciseId: 'ex-fixture-03',
                  inputData: '-3\n7',
                  expectedOutput: 'Truoc: a=-3, b=7 Sau: a=7, b=-3',
                  explanation: 'Trường hợp có số âm.',
                  orderIndex: 2,
                },
                {
                  id: 'ex-sample-03-3',
                  exerciseId: 'ex-fixture-03',
                  inputData: '0\n0',
                  expectedOutput: 'Truoc: a=0, b=0 Sau: a=0, b=0',
                  explanation: 'Trường hợp biên hai giá trị bằng nhau.',
                  orderIndex: 3,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export function getExerciseBySlug(slug: string) {
  for (const topic of SAMPLE_TEST_COURSE.topics) {
    for (const lesson of topic.lessons) {
      const match = lesson.exercises.find((ex) => ex.slug === slug);
      if (match) {
        return { exercise: match, lesson, topic };
      }
    }
  }
  return null;
}

export function getAllExercises() {
  const list = [];
  for (const topic of SAMPLE_TEST_COURSE.topics) {
    for (const lesson of topic.lessons) {
      for (const ex of lesson.exercises) {
        list.push({ exercise: ex, lesson, topic });
      }
    }
  }
  return list;
}
