/**
 * CodeCoBUG Structured Error Classification Engine
 * Analyzes Python tracebacks, compiler outputs, and judge failures to categorize learner mistakes.
 */

export type ErrorCategory =
  | 'syntax_slip'
  | 'type_mismatch'
  | 'name_error'
  | 'zero_division'
  | 'index_out_of_bounds'
  | 'constraint_violation'
  | 'output_formatting'
  | 'logic_boundary'
  | 'timeout_loop'
  | 'unknown_error';

export interface ClassifiedError {
  category: ErrorCategory;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestedRemedy: string;
  rawSignal: string;
}

export class ErrorClassifier {
  /**
   * Classify error from traceback, message, and judge verdict
   */
  public static classify(
    tracebackOrError?: string,
    verdict?: string,
    expectedOutput?: string,
    actualOutput?: string
  ): ClassifiedError {
    const raw = (tracebackOrError || '').trim();
    const rawLower = raw.toLowerCase();

    // 1. Constraint & Rule Violations (Forbidden Tokens)
    if (
      rawLower.includes('ruleviolationerror') ||
      rawLower.includes('từ khóa cấm') ||
      rawLower.includes('forbidden token')
    ) {
      return {
        category: 'constraint_violation',
        title: 'Vi phạm ràng buộc đề bài',
        description: 'Mã nguồn sử dụng biến tạm hoặc cú pháp không được phép theo yêu cầu đề bài.',
        severity: 'high',
        suggestedRemedy: 'Sử dụng cú pháp hoán đổi trực tiếp a, b = b, a; không khai báo biến trung gian.',
        rawSignal: raw,
      };
    }

    // 2. Syntax & Indentation Errors
    if (
      rawLower.includes('syntaxerror') ||
      rawLower.includes('indentationerror') ||
      rawLower.includes('invalid syntax') ||
      rawLower.includes('was never closed')
    ) {
      return {
        category: 'syntax_slip',
        title: 'Lỗi cú pháp Python (SyntaxError)',
        description: 'Thiếu dấu đóng mở ngoặc, dấu hai chấm hoặc thụt đầu dòng (indentation) không hợp lệ.',
        severity: 'medium',
        suggestedRemedy: 'Kiểm tra cặp dấu ngoặc tròn () và đảm bảo các dòng lệnh cùng cấp thụt lề bằng nhau.',
        rawSignal: raw,
      };
    }

    // 3. Name Errors (Undefined Variables)
    if (rawLower.includes('nameerror') || rawLower.includes('is not defined')) {
      return {
        category: 'name_error',
        title: 'Tên biến chưa được định nghĩa (NameError)',
        description: 'Sử dụng một biến hoặc hàm mà chưa được khởi tạo giá trị trước đó hoặc gõ sai chính tả.',
        severity: 'medium',
        suggestedRemedy: 'Kiểm tra lại chính tả tên biến và đảm bảo đã gán giá trị cho biến trước khi sử dụng.',
        rawSignal: raw,
      };
    }

    // 4. Type & Value Errors (Type Casting, int() conversion)
    if (
      rawLower.includes('typeerror') ||
      rawLower.includes('valueerror') ||
      rawLower.includes('invalid literal for int()') ||
      rawLower.includes('can only concatenate str')
    ) {
      return {
        category: 'type_mismatch',
        title: 'Sai lệch kiểu dữ liệu (TypeError / ValueError)',
        description: 'Thực hiện phép toán hoặc nối chuỗi giữa các kiểu dữ liệu không tương thích (ví dụ: chuỗi và số nguyên).',
        severity: 'high',
        suggestedRemedy: 'Sử dụng int(input()) để chuyển đổi đầu vào dạng chuỗi thành số nguyên trước khi tính toán.',
        rawSignal: raw,
      };
    }

    // 5. Zero Division
    if (rawLower.includes('zerodivisionerror') || rawLower.includes('division by zero')) {
      return {
        category: 'zero_division',
        title: 'Lỗi chia cho số không (ZeroDivisionError)',
        description: 'Thực hiện phép chia hoặc phép lấy dư (%) cho số 0.',
        severity: 'high',
        suggestedRemedy: 'Kiểm tra giá trị của mẫu số trước khi thực hiện phép chia.',
        rawSignal: raw,
      };
    }

    // 6. Index Out of Range
    if (rawLower.includes('indexerror') || rawLower.includes('list index out of range')) {
      return {
        category: 'index_out_of_bounds',
        title: 'Chỉ số vượt quá phạm vi (IndexError)',
        description: 'Truy cập vào phần tử mảng hoặc chuỗi tại vị trí không tồn tại.',
        severity: 'high',
        suggestedRemedy: 'Kiểm tra độ dài chuỗi hoặc danh sách bằng len() trước khi truy cập chỉ số.',
        rawSignal: raw,
      };
    }

    // 7. Time Limit Exceeded / Infinite Loop
    if (
      rawLower.includes('timelimitexceeded') ||
      rawLower.includes('timeout') ||
      verdict === 'time_limit_exceeded' ||
      verdict === 'timeout'
    ) {
      return {
        category: 'timeout_loop',
        title: 'Vòng lặp chạy quá thời gian (TimeLimitExceeded)',
        description: 'Chương trình chạy vượt quá giới hạn 5000ms do vòng lặp while/for không có điểm dừng.',
        severity: 'high',
        suggestedRemedy: 'Đảm bảo biến điều kiện lặp được cập nhật liên tục để vòng lặp có thể kết thúc.',
        rawSignal: raw,
      };
    }

    // 8. Output Formatting vs Logic Boundary (Wrong Answer)
    if (verdict === 'wrong_answer' || rawLower.includes('wrong answer')) {
      if (expectedOutput && actualOutput) {
        const expTrim = expectedOutput.trim().replace(/\r\n/g, '\n');
        const actTrim = actualOutput.trim().replace(/\r\n/g, '\n');

        // Check if discrepancy is merely whitespace or letter casing
        if (expTrim.toLowerCase() === actTrim.toLowerCase() || expTrim.replace(/\s+/g, '') === actTrim.replace(/\s+/g, '')) {
          return {
            category: 'output_formatting',
            title: 'Lỗi định dạng đầu ra (Formatting)',
            description: 'Kết quả tính toán đúng nhưng sai khoảng trắng, chữ hoa/thường hoặc thiếu/thừa dấu xuống dòng.',
            severity: 'low',
            suggestedRemedy: 'Kiểm tra kỹ từng khoảng trắng và định dạng in f-string so với ví dụ mẫu của đề bài.',
            rawSignal: `Expected: "${expectedOutput}", Actual: "${actualOutput}"`,
          };
        }
      }

      return {
        category: 'logic_boundary',
        title: 'Sai lệch giá trị kết quả (Wrong Answer)',
        description: 'Giá trị tính toán của bài làm không khớp với kết quả kiểm thử mẫu hoặc test ẩn.',
        severity: 'medium',
        suggestedRemedy: 'Đọc lại kỹ điều kiện đề bài và thử tự chạy từng bước với giấy nháp cho các trường hợp biên.',
        rawSignal: raw || 'Wrong Answer',
      };
    }

    // Default Fallback
    return {
      category: 'unknown_error',
      title: 'Lỗi thực thi cần kiểm tra',
      description: 'Chương trình chưa thỏa mãn điều kiện hoàn thành bài tập.',
      severity: 'low',
      suggestedRemedy: 'Đọc kỹ thông báo lỗi trong tab Terminal hoặc nộp bài lại để xem chi tiết.',
      rawSignal: raw || verdict || 'Unknown',
    };
  }
}
