import { ExamDefinition } from '../types/exam';

export const OFFICIAL_EXAMS: ExamDefinition[] = [
  // 1. Bài kiểm tra đầu vào theo chủ đề (Chương 1 - 4: Khởi động)
  {
    id: 'exam-diag-fundamentals',
    slug: 'kiem-tra-dau-vao-nen-tang',
    title: 'Khảo sát Nền tảng: Cú pháp, Biến & Xử lý Chuỗi',
    description: 'Đánh giá năng lực sử dụng lệnh print, nhập xuất dữ liệu, khai báo biến, các phép toán số học và cắt chuỗi (Chương 01 - 04).',
    type: 'topic_diagnostic',
    durationMinutes: 15,
    passingScore: 70,
    targetChapterSlugs: [
      'chu-de-01-lam-quen-python',
      'chu-de-02-bien-va-kieu-du-lieu',
      'chu-de-03-so-hoc-va-toan-tu',
      'chu-de-04-chuoi',
    ],
    questionIds: [
      'eq-ch01-01',
      'eq-ch01-02',
      'eq-ch02-01',
      'eq-ch02-02',
      'eq-ch03-01',
      'eq-ch04-01',
    ],
    totalPoints: 60,
  },

  // 2. Bài kiểm tra cuối chương: Cấu trúc dữ liệu & Rẽ nhánh (Chương 5 - 6)
  {
    id: 'exam-chapter-control-data',
    slug: 'kiem-tra-cau-truc-du-lieu-va-re-nhanh',
    title: 'Kiểm tra Chuyên đề: Danh sách, Từ điển & Điều kiện if-elif',
    description: 'Đánh giá chuyên sâu kỹ năng thao tác List, Dictionary, phương thức .get() và phân nhánh logic điều kiện (Chương 05 - 06).',
    type: 'chapter_end',
    durationMinutes: 20,
    passingScore: 70,
    targetChapterSlugs: [
      'chu-de-05-cau-truc-du-lieu',
      'chu-de-06-cau-truc-dieu-kien',
    ],
    questionIds: [
      'eq-ch05-01',
      'eq-ch05-02',
      'eq-ch06-01',
    ],
    totalPoints: 30,
  },

  // 3. Bài thi Tổng hợp Toàn diện (Toàn bộ 12 chương: Mock Exam chuẩn bị Dự án)
  {
    id: 'exam-comprehensive-mock',
    slug: 'thi-thu-tong-hop-toan-dien-python',
    title: 'Bài Thi Thử Tổng Hợp Toàn Diện (Full Python Mock Exam)',
    description: 'Mô phỏng kỳ thi đánh giá năng lực lập trình toàn diện 12 chương từ cú pháp, cấu trúc dữ liệu, vòng lặp, hàm đến OOP và Comprehension.',
    type: 'comprehensive',
    durationMinutes: 30,
    passingScore: 75,
    targetChapterSlugs: [
      'chu-de-01-lam-quen-python',
      'chu-de-02-bien-va-kieu-du-lieu',
      'chu-de-03-so-hoc-va-toan-tu',
      'chu-de-04-chuoi',
      'chu-de-05-cau-truc-du-lieu',
      'chu-de-06-cau-truc-dieu-kien',
      'chu-de-07-vong-lap',
      'chu-de-08-ham-functions',
      'chu-de-09-xu-ly-loi-va-module',
      'chu-de-10-file-va-du-lieu',
      'chu-de-11-huong-doi-tuong-oop',
      'chu-de-12-mo-rong-va-he-sinh-thai',
    ],
    questionIds: [
      'eq-ch01-01',
      'eq-ch01-02',
      'eq-ch02-01',
      'eq-ch02-02',
      'eq-ch03-01',
      'eq-ch04-01',
      'eq-ch05-01',
      'eq-ch05-02',
      'eq-ch06-01',
      'eq-ch07-01',
      'eq-ch08-01',
      'eq-ch09-01',
      'eq-ch10-01',
      'eq-ch11-01',
      'eq-ch12-01',
    ],
    totalPoints: 150,
  },
];

export function getExamBySlug(slug: string): ExamDefinition | undefined {
  return OFFICIAL_EXAMS.find((e) => e.slug === slug);
}

export function getExamById(id: string): ExamDefinition | undefined {
  return OFFICIAL_EXAMS.find((e) => e.id === id);
}
