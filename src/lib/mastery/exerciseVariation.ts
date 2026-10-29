/**
 * CodeCoBUG Exercise Quality & Duplication Inspection Engine
 * Enforces quality checks, variation of difficulty, and duplicate detection
 * to prevent generating nearly identical exercises.
 */

export interface ExerciseCandidate {
  title: string;
  slug?: string;
  difficulty?: string;
  description: string;
  starterCode: string;
  examples: Array<{
    inputData: string;
    expectedOutput: string;
    explanation?: string;
  }>;
}

export interface ExistingExercise {
  title: string;
  slug: string;
  description: string;
  starterCode?: string;
}

export interface QualityValidationResult {
  isValid: boolean;
  isDuplicate: boolean;
  maxSimilarity: number;
  duplicateOf?: string;
  qualityIssues: string[];
  recommendedDifficulty: 'very_easy' | 'easy' | 'medium' | 'hard';
}

export class ExerciseVariationEngine {
  private static readonly DUPLICATION_THRESHOLD = 0.75; // 75% similarity threshold

  /**
   * Validate quality and check for duplicates against existing curriculum
   */
  public static validate(
    candidate: ExerciseCandidate,
    existingPool: ExistingExercise[],
    learnerMasteryScore = 50
  ): QualityValidationResult {
    const qualityIssues: string[] = [];

    // 1. Quality Checks
    if (!candidate.title || candidate.title.trim().length < 5) {
      qualityIssues.push('Tiêu đề bài tập quá ngắn hoặc bị bỏ trống (yêu cầu tối thiểu 5 ký tự).');
    }

    if (!candidate.description || candidate.description.trim().length < 20) {
      qualityIssues.push('Mô tả yêu cầu bài tập quá ngắn (yêu cầu tối thiểu 20 ký tự).');
    }

    if (!Array.isArray(candidate.examples) || candidate.examples.length === 0) {
      qualityIssues.push('Bài tập phải có ít nhất 1 bộ dữ liệu ví dụ (examples) rõ ràng.');
    } else {
      for (const ex of candidate.examples) {
        if (typeof ex.expectedOutput !== 'string') {
          qualityIssues.push('Dữ liệu kết quả mong đợi (expectedOutput) không hợp lệ.');
          break;
        }
      }
    }

    // 2. Duplication Checks (Jaccard similarity on normalized token n-grams)
    let maxSimilarity = 0;
    let duplicateOf: string | undefined = undefined;

    for (const existing of existingPool) {
      const descSim = this.computeJaccardSimilarity(candidate.description, existing.description);
      const titleSim = this.computeJaccardSimilarity(candidate.title, existing.title);
      const combinedSim = descSim * 0.7 + titleSim * 0.3;

      if (combinedSim > maxSimilarity) {
        maxSimilarity = combinedSim;
        duplicateOf = existing.title;
      }
    }

    const isDuplicate = maxSimilarity >= this.DUPLICATION_THRESHOLD;
    if (isDuplicate) {
      qualityIssues.push(
        `Bài tập có độ tương đồng quá cao (${Math.round(maxSimilarity * 100)}%) với bài đã có: "${duplicateOf}". Cần thay đổi dữ kiện hoặc tình huống áp dụng.`
      );
    }

    // 3. Adaptive Difficulty Recommendation
    let recommendedDifficulty: QualityValidationResult['recommendedDifficulty'] = 'easy';
    if (learnerMasteryScore < 40) {
      recommendedDifficulty = 'very_easy';
    } else if (learnerMasteryScore >= 80) {
      recommendedDifficulty = 'medium';
    }

    return {
      isValid: qualityIssues.length === 0,
      isDuplicate,
      maxSimilarity: Math.round(maxSimilarity * 100) / 100,
      duplicateOf: isDuplicate ? duplicateOf : undefined,
      qualityIssues,
      recommendedDifficulty,
    };
  }

  /**
   * Jaccard Similarity on 2-gram word tokens
   */
  public static computeJaccardSimilarity(textA: string, textB: string): number {
    const tokensA = this.tokenize(textA);
    const tokensB = this.tokenize(textB);

    if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
    if (tokensA.size === 0 || tokensB.size === 0) return 0.0;

    let intersectionCount = 0;
    for (const token of tokensA) {
      if (tokensB.has(token)) {
        intersectionCount++;
      }
    }

    const unionCount = tokensA.size + tokensB.size - intersectionCount;
    return unionCount === 0 ? 0 : intersectionCount / unionCount;
  }

  private static tokenize(text: string): Set<string> {
    const clean = (text || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = clean.split(' ').filter((w) => w.length > 1);
    const set = new Set<string>();

    for (const w of words) set.add(w);

    // Add bigrams for structural context
    for (let i = 0; i < words.length - 1; i++) {
      set.add(`${words[i]}_${words[i + 1]}`);
    }

    return set;
  }
}
