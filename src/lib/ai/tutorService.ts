import { AIProviderAdapter, AIProviderConfig, AIMessage } from './providerAdapter';

export type AITutorAction =
  | 'explain_error'
  | 'get_hint'
  | 'analyze_weakness'
  | 'generate_exercise'
  | 'recommend_exercises'
  | 'chat';

export interface ExerciseContext {
  title: string;
  slug: string;
  difficulty?: string;
  description: string;
  constraints?: string[];
  starterCode?: string;
  chapterTitle?: string;
  chapterIndex?: number;
  lessonTitle?: string;
  learningObjectives?: string[];
  lessonTheorySnippet?: string;
}

export interface SubmissionData {
  submittedCode: string;
  verdict?: string;
  score?: number;
  totalPoints?: number;
  errorMessage?: string;
  cleanTraceback?: string;
  failedTestInfo?: {
    orderIndex: number;
    inputData?: string;
    expectedOutput?: string;
    actualOutput?: string;
    errorMessage?: string;
  };
  overallWeaknesses?: Array<{
    category: string;
    title: string;
    count: number;
  }>;
}

export interface AITutorRequest {
  config: AIProviderConfig;
  action: AITutorAction;
  exerciseContext: ExerciseContext;
  submissionData?: SubmissionData;
  userPrompt?: string;
  hintLevel?: 1 | 2 | 3;
}

export interface AIGeneratedExercise {
  title: string;
  slug: string;
  difficulty: 'very_easy' | 'easy' | 'medium' | 'hard';
  description: string;
  starterCode: string;
  examples: Array<{
    inputData: string;
    expectedOutput: string;
    explanation?: string;
  }>;
  validationStatus: 'unverified' | 'verified';
}

export class AITutorService {
  /**
   * Educational System Prompt enforcing pedagogical guidance and Judge Verdict Integrity
   */
  private static readonly SYSTEM_PROMPT = `
Bạn là AI Gia Sư chuyên gia của nền tảng học lập trình CodeCoBUG (Python 3).
Mục tiêu của bạn là đồng hành sư phạm, giúp học viên tự tư duy và hiểu sâu bản chất lỗi, không làm bài hộ.

QUY TẮC CỐT LÕI BẮT BUỘC TUÂN THỦ:
1. TÔN TRỌNG PHÁN QUYẾT CỦA BỘ CHẤM (JUDGE VERDICT INTEGRITY):
   - Bạn KHÔNG BAO GIỜ được tự ý tuyên bố mã nguồn là đúng khi hệ thống tự động (Judge Engine) báo lỗi hoặc có test case thất bại.
   - Khi bài nộp bị chấm Wrong Answer hoặc Runtime Error, bạn phải phân tích vì sao kết quả thực tế không khớp với yêu cầu và hướng dẫn học viên sửa chữa.
2. NGUYÊN TẮC SƯ PHẠM (PEDAGOGICAL HINTING):
   - Ưu tiên giải thích nguyên nhân gốc rễ và đưa ra gợi ý nâng bậc (graduated hints: Mức 1 Khái niệm -> Mức 2 Thuật toán -> Mức 3 Cú pháp chi tiết).
   - KHÔNG đưa ra toàn bộ lời giải hoàn chỉnh ngay lập tức để học viên copy-paste, trừ khi học viên yêu cầu tột bậc sau nhiều lần gợi ý.
3. PHÂN BIỆT RÕ RÀNG DỮ KIỆN VÀ GIẢ THUYẾT:
   - Phân biệt rõ giữa dữ kiện chắc chắn (dựa trên thông báo traceback, dòng code thực tế, test case thất bại) và giả thuyết (suy đoán khi chưa có đủ thông tin, cần nêu rõ: "Khả năng cao là...", "Có thể bạn đang nhầm lẫn giữa...", "Nếu bạn dự định...").
4. THÍCH ỨNG THEO TRÌNH ĐỘ HỌC VIÊN:
   - Luôn giải thích code theo trình độ hiện tại của bài tập và học viên (Beginner: dùng hình ảnh trực quan, câu từ dễ hiểu, chỉ ra khái niệm cơ bản; Intermediate/Advanced: sử dụng thuật ngữ kỹ thuật chính xác, chuẩn PEP 8 và phân tích độ phức tạp).
5. BÁM SÁT NGỮ CẢNH BÀI HỌC VÀ LÝ THUYẾT:
   - Dựa trên nội dung bài học, mục tiêu bài học và lý thuyết hiện tại để hướng dẫn; không dùng các thư viện hoặc cú pháp quá xa lạ ngoài phạm vi bài học khi chưa cần thiết.
6. NGÔN NGỮ & ĐỊNH DẠNG:
   - Trả lời bằng tiếng Việt thân thiện, súc tích, chuyên môn chính xác.
   - Trích dẫn rõ ràng dòng code lỗi, kiểu lỗi (SyntaxError, TypeError, IndexError, v.v.).
`.trim();

  /**
   * Process Tutor Request and Generate Pedagogical Response
   */
  public static async processRequest(request: AITutorRequest): Promise<{
    success: boolean;
    text: string;
    generatedExercise?: AIGeneratedExercise;
    error?: string;
  }> {
    const { config, action, exerciseContext, submissionData, userPrompt, hintLevel = 1 } = request;

    let userInstruction = '';

    if (action === 'explain_error') {
      userInstruction = this.buildExplainErrorPrompt(exerciseContext, submissionData);
    } else if (action === 'get_hint') {
      userInstruction = this.buildHintPrompt(exerciseContext, submissionData, hintLevel);
    } else if (action === 'analyze_weakness') {
      userInstruction = this.buildWeaknessAnalysisPrompt(exerciseContext, submissionData);
    } else if (action === 'recommend_exercises') {
      userInstruction = this.buildRecommendExercisesPrompt(exerciseContext, submissionData);
    } else if (action === 'generate_exercise') {
      return await this.handleGenerateExercise(config, exerciseContext, userPrompt || '');
    } else {
      // General Freeform Chat
      userInstruction = this.buildGeneralChatPrompt(exerciseContext, submissionData, userPrompt || '');
    }

    const messages: AIMessage[] = [
      { role: 'system', content: this.SYSTEM_PROMPT },
      { role: 'user', content: userInstruction },
    ];

    const response = await AIProviderAdapter.generateCompletion({
      config,
      messages,
      maxTokens: 1500,
    });

    if (!response.success) {
      return {
        success: false,
        text: '',
        error: response.error,
      };
    }

    return {
      success: true,
      text: response.content,
    };
  }

  /**
   * Action 1: Explain Syntax / Runtime Error or Failed Test
   */
  private static buildExplainErrorPrompt(
    exercise: ExerciseContext,
    submission?: SubmissionData
  ): string {
    const code = submission?.submittedCode || '(chưa có mã nguồn)';
    const err = submission?.cleanTraceback || submission?.errorMessage || 'Không có traceback cụ thể.';
    const failedTest = submission?.failedTestInfo;

    return `
[YÊU CẦU: GIẢI THÍCH LỖI MÃ NGUỒN]
Chương/Chủ đề: ${exercise.chapterTitle || 'Khóa học Python CodeCoBUG'}
Bài học: ${exercise.lessonTitle || exercise.title}
${exercise.learningObjectives && exercise.learningObjectives.length > 0 ? `Mục tiêu bài học: ${exercise.learningObjectives.join('; ')}\n` : ''}${exercise.lessonTheorySnippet ? `Tóm tắt lý thuyết liên quan: ${exercise.lessonTheorySnippet}\n` : ''}Đề bài: "${exercise.title}" (Độ khó: ${exercise.difficulty || 'Cơ bản'})
Mô tả đề bài: ${exercise.description}

Mã nguồn học viên đang viết:
\`\`\`python
${code}
\`\`\`

Thông báo lỗi thực tế ghi nhận từ hệ thống:
${err}

${
  failedTest
    ? `Thông tin test case không đạt:
- Test #${failedTest.orderIndex}
- Input: ${failedTest.inputData || '(trống)'}
- Kết quả mong đợi: ${failedTest.expectedOutput || '(trống)'}
- Kết quả thực tế của học viên: ${failedTest.actualOutput || '(trống)'}
${failedTest.errorMessage ? `- Ghi chú lỗi: ${failedTest.errorMessage}` : ''}`
    : ''
}

Hãy giải thích cho học viên:
1. Lỗi này là loại lỗi gì trong Python?
2. Lỗi xuất hiện ở dòng nào hoặc do logic nào gây ra?
3. Nguyên nhân vì sao Python lại báo lỗi này?
4. Một gợi ý nhỏ để học viên tự sửa lỗi mà không copy mã nguồn có sẵn.
`.trim();
  }

  /**
   * Action 2: Graduated Hints (Level 1 -> 2 -> 3)
   */
  private static buildHintPrompt(
    exercise: ExerciseContext,
    submission?: SubmissionData,
    level = 1
  ): string {
    const code = submission?.submittedCode || '(chưa có mã nguồn)';

    const levelDescriptions = {
      1: 'Mức 1 (Khái niệm): Chỉ nhắc lại kiến thức nền tảng và ý tưởng tổng quan, chưa chạm vào chi tiết dòng code.',
      2: 'Mức 2 (Thuật toán & Logic): Hướng dẫn từng bước logic học viên cần làm (ví dụ: cần đọc input bằng gì, biến đổi gì, in ra sao).',
      3: 'Mức 3 (Cú pháp & Chi tiết): Chỉ ra chính xác hàm/cú pháp Python cần sử dụng kèm ví dụ minh họa đơn giản tương tự.',
    };

    return `
[YÊU CẦU: GỢI Ý BÀI TẬP BẬC THANG - ${levelDescriptions[level as 1 | 2 | 3]}]
Chương/Chủ đề: ${exercise.chapterTitle || 'Khóa học Python CodeCoBUG'}
Bài học: ${exercise.lessonTitle || exercise.title}
${exercise.learningObjectives && exercise.learningObjectives.length > 0 ? `Mục tiêu bài học: ${exercise.learningObjectives.join('; ')}\n` : ''}${exercise.lessonTheorySnippet ? `Tóm tắt lý thuyết: ${exercise.lessonTheorySnippet}\n` : ''}Đề bài: "${exercise.title}" (Độ khó: ${exercise.difficulty || 'Cơ bản'})
Mô tả yêu cầu: ${exercise.description}

Code hiện tại của học viên:
\`\`\`python
${code}
\`\`\`

Hãy đưa ra gợi ý phù hợp đúng với Mức ${level}. Giữ giọng văn động viên và súc tích.
`.trim();
  }

  /**
   * Action 3: Weakness Analysis
   */
  private static buildWeaknessAnalysisPrompt(
    exercise: ExerciseContext,
    submission?: SubmissionData
  ): string {
    const weaknessesList = submission?.overallWeaknesses && submission.overallWeaknesses.length > 0
      ? submission.overallWeaknesses.map(w => `- ${w.title} (${w.category}): ${w.count} lần`).join('\n')
      : null;

    return `
[YÊU CẦU: PHÂN TÍCH ĐIỂM YẾU VÀ LỖI THƯỜNG GẶP]
Chương/Chủ đề: ${exercise.chapterTitle || 'Khóa học Python CodeCoBUG'}
Bài học: ${exercise.lessonTitle || exercise.title}
Bài tập: "${exercise.title}"
Mã nguồn đã nộp:
\`\`\`python
${submission?.submittedCode || ''}
\`\`\`
Lỗi ghi nhận: ${submission?.errorMessage || submission?.cleanTraceback || 'Sai logic kiểm thử.'}
${weaknessesList ? `\nThống kê các dạng lỗi lặp lại từ lịch sử làm bài:\n${weaknessesList}` : ''}

Hãy chỉ ra thói quen hoặc khái niệm mà học viên có thể đang hiểu nhầm (ví dụ: nhầm lẫn giữa kiểu chuỗi và số nguyên trong input(), quên ép kiểu, nhầm cú pháp gán đa biến, v.v.) và cách rèn luyện để không mắc lại.
`.trim();
  }

  /**
   * Action 4: Generate Exercise from Natural Language Prompt
   */
  private static async handleGenerateExercise(
    config: AIProviderConfig,
    currentExercise: ExerciseContext,
    userPrompt: string
  ): Promise<{
    success: boolean;
    text: string;
    generatedExercise?: AIGeneratedExercise;
    error?: string;
  }> {
    const prompt = `
[YÊU CẦU: TẠO BÀI TẬP PYTHON TỰ LUYỆN]
Yêu cầu của học viên: "${userPrompt || 'Tạo bài tập thực hành tương tự'}"
Chủ đề liên quan: "${currentExercise.title}"

BẠN PHẢI TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON HỢP LỆ THEO SCHEMA SAU (KHÔNG KÈM THEO BẤT KỲ VĂN BẢN NÀO KHÁC):
{
  "title": "Tên bài tập ngắn gọn",
  "slug": "ten-bai-tap-kebab-case",
  "difficulty": "easy",
  "description": "Đề bài chi tiết nêu rõ dữ liệu vào và định dạng dữ liệu ra",
  "starterCode": "# Viết code của bạn ở đây\\n",
  "examples": [
    {
      "inputData": "Dữ liệu vào ví dụ",
      "expectedOutput": "Kết quả ra mong đợi",
      "explanation": "Giải thích ngắn"
    }
  ],
  "validationStatus": "unverified"
}
`.trim();

    const messages: AIMessage[] = [
      { role: 'system', content: 'Bạn là chuyên gia sư phạm tạo bài tập lập trình Python. Luôn trả về định dạng JSON hợp lệ.' },
      { role: 'user', content: prompt },
    ];

    const response = await AIProviderAdapter.generateCompletion({
      config,
      messages,
      maxTokens: 1200,
    });

    if (!response.success) {
      return { success: false, text: '', error: response.error };
    }

    try {
      // Clean potential markdown json fences
      let jsonStr = response.content.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(jsonStr);
      const generated: AIGeneratedExercise = {
        title: parsed.title || 'Bài tập tự luyện Python',
        slug: parsed.slug || `exercise-${Date.now()}`,
        difficulty: parsed.difficulty || 'easy',
        description: parsed.description || '',
        starterCode: parsed.starterCode || '# Viết code tại đây\n',
        examples: Array.isArray(parsed.examples) ? parsed.examples : [],
        validationStatus: 'unverified', // CRITICAL: labeled unverified until tested
      };

      return {
        success: true,
        text: `Đã tạo bài tập tự luyện thành công: **${generated.title}** (Trạng thái: Chưa kiểm chứng / Unverified).`,
        generatedExercise: generated,
      };
    } catch {
      return {
        success: true,
        text: response.content,
      };
    }
  }

  /**
   * Action 5: General Chat Prompt
   */
  private static buildGeneralChatPrompt(
    exercise: ExerciseContext,
    submission?: SubmissionData,
    userPrompt = ''
  ): string {
    return `
[CÂU HỎI HỌC VIÊN]
Chương/Chủ đề: ${exercise.chapterTitle || 'Khóa học Python CodeCoBUG'}
Bài học: ${exercise.lessonTitle || exercise.title}
${exercise.learningObjectives && exercise.learningObjectives.length > 0 ? `Mục tiêu bài học: ${exercise.learningObjectives.join('; ')}\n` : ''}${exercise.lessonTheorySnippet ? `Tóm tắt lý thuyết: ${exercise.lessonTheorySnippet}\n` : ''}Học viên đang làm bài: "${exercise.title}" (Độ khó: ${exercise.difficulty || 'Cơ bản'})
Đề bài: ${exercise.description}

Mã nguồn hiện tại trong Editor:
\`\`\`python
${submission?.submittedCode || '(chưa có)'}
\`\`\`

${submission?.cleanTraceback ? `Lỗi gần nhất trong Terminal: ${submission.cleanTraceback}` : ''}
${submission?.verdict ? `Phán quyết từ Judge: ${submission.verdict.toUpperCase()}` : ''}

Câu hỏi của học viên: "${userPrompt}"

Hãy trả lời học viên ngắn gọn, chính xác và có tính giáo dục.
`.trim();
  }

  /**
   * Action 6: Recommend Related Exercises
   */
  private static buildRecommendExercisesPrompt(
    exercise: ExerciseContext,
    submission?: SubmissionData
  ): string {
    return `
[YÊU CẦU: ĐỀ XUẤT BÀI TẬP VÀ LỘ TRÌNH RÈN LUYỆN LIÊN QUAN]
Chương/Chủ đề: ${exercise.chapterTitle || 'Lộ trình Python CodeCoBUG'}
Bài học: ${exercise.lessonTitle || exercise.title}
Bài tập hiện tại: "${exercise.title}" (Độ khó: ${exercise.difficulty || 'Cơ bản'})

Mã nguồn hiện tại của học viên:
\`\`\`python
${submission?.submittedCode || '(chưa có)'}
\`\`\`
Trạng thái làm bài: ${submission?.verdict || 'Chưa nộp bài'}

Dựa trên chủ đề của chương học này:
1. Đề xuất 2-3 hướng rèn luyện hoặc bài tập liên quan thuộc cùng chủ đề giúp học viên củng cố vững chắc kiến thức.
2. Nêu rõ giá trị sư phạm của từng đề xuất.
3. Đặt 1 câu hỏi đố tư duy nhanh (quick challenge) để học viên tự suy ngẫm.
`.trim();
  }
}
