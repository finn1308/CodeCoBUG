/**
 * CodeCoBUG Skills Taxonomy & Exercise Mapping
 * Defines standard Python core skills, categories, and relationships with curriculum exercises.
 */

export interface SkillDefinition {
  code: string;
  name: string;
  category: 'io_basics' | 'data_types' | 'variables' | 'operators' | 'control_flow';
  description: string;
}

export const SKILLS_TAXONOMY: Record<string, SkillDefinition> = {
  python_print_syntax: {
    code: 'python_print_syntax',
    name: 'Cú pháp print() & Xuất dữ liệu',
    category: 'io_basics',
    description: 'Sử dụng hàm print() cơ bản, xuất chuỗi ký tự, ký tự xuống dòng và khoảng trắng.',
  },
  output_formatting: {
    code: 'output_formatting',
    name: 'Định dạng đầu ra chuẩn xác',
    category: 'io_basics',
    description: 'Khớp chính xác cấu trúc đầu ra mẫu, không thừa/thiếu khoảng trắng hoặc ký tự đặc biệt.',
  },
  input_reading: {
    code: 'input_reading',
    name: 'Đọc dữ liệu với input()',
    category: 'io_basics',
    description: 'Đọc dữ liệu từng dòng từ standard input (sys.stdin) bằng hàm input().',
  },
  type_casting_int: {
    code: 'type_casting_int',
    name: 'Ép kiểu số nguyên int()',
    category: 'data_types',
    description: 'Chuyển đổi chuỗi nhận được từ input() sang số nguyên int để tính toán.',
  },
  fstring_formatting: {
    code: 'fstring_formatting',
    name: 'Định dạng chuỗi f-string',
    category: 'data_types',
    description: 'Chèn biến và biểu thức trực tiếp vào chuỗi bằng f"..." trong Python 3.',
  },
  variables_assignment: {
    code: 'variables_assignment',
    name: 'Khai báo và gán giá trị biến',
    category: 'variables',
    description: 'Đặt tên biến hợp lệ, khởi tạo biến và cập nhật giá trị biến.',
  },
  multiple_assignment: {
    code: 'multiple_assignment',
    name: 'Hoán đổi đa biến (Tuple Unpacking)',
    category: 'variables',
    description: 'Sử dụng cú pháp Pythonic a, b = b, a để hoán đổi giá trị mà không dùng biến tạm.',
  },
  constraint_satisfaction: {
    code: 'constraint_satisfaction',
    name: 'Tuân thủ ràng buộc đề bài',
    category: 'control_flow',
    description: 'Giải quyết bài toán mà không vi phạm các từ khóa hoặc hàm bị cấm trong đề.',
  },
};

/**
 * Mapping between exercise slug and related tested skills with weights
 */
export const EXERCISE_SKILLS_MAP: Record<string, string[]> = {
  'in-loi-chao-codecobug': ['python_print_syntax', 'output_formatting'],
  'nhap-ten-va-tuoi': ['input_reading', 'type_casting_int', 'fstring_formatting', 'output_formatting'],
  'hoan-doi-hai-bien': ['variables_assignment', 'multiple_assignment', 'constraint_satisfaction'],
  'swap-two-variables': ['variables_assignment', 'multiple_assignment', 'constraint_satisfaction'],
};

/**
 * Get all skill codes tested by an exercise
 */
export function getSkillsForExercise(exerciseSlug: string): SkillDefinition[] {
  const codes = EXERCISE_SKILLS_MAP[exerciseSlug] || ['python_print_syntax'];
  return codes.map((c) => SKILLS_TAXONOMY[c]).filter(Boolean);
}
