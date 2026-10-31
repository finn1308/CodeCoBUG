import { loadPyodide, type PyodideInterface } from 'pyodide';
import { compareOutputs } from './comparator';
import { ServerExerciseTestConfig } from './testCasesRepository';
import { Verdict } from '@/lib/types/runtime';

export interface EvaluatedTestResult {
  testCaseId: string;
  orderIndex: number;
  isPassed: boolean;
  isHidden: boolean;
  inputData?: string;
  expectedOutput?: string;
  actualOutput?: string;
  errorMessage?: string;
  executionTimeMs: number;
}

export interface SubmissionEvaluationReport {
  exerciseSlug: string;
  verdict: Verdict;
  verdictMessage: string;
  passedTestsCount: number;
  totalTestsCount: number;
  score: number;
  totalPoints: number;
  totalExecutionTimeMs: number;
  testResults: EvaluatedTestResult[];
  submittedAt: string;
}

import path from 'path';

let cachedPyodide: PyodideInterface | null = null;

async function getJudgePyodideInstance(): Promise<PyodideInterface> {
  if (cachedPyodide) return cachedPyodide;
  const pyodideDir = path.join(process.cwd(), 'node_modules', 'pyodide');
  cachedPyodide = await loadPyodide({
    indexURL: pyodideDir,
    packageCacheDir: pyodideDir,
  });
  return cachedPyodide;
}

// Check forbidden tokens (like temp/tmp variables)
function checkForbiddenTokens(code: string, forbiddenTokens: string[]): string | null {
  // Strip comments and string literals
  const strippedCode = code
    .replace(/#.*$/gm, '')
    .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '');

  for (const token of forbiddenTokens) {
    const regex = new RegExp(`\\b${token}\\b`, 'i');
    if (regex.test(strippedCode)) {
      return `Quy tắc bài tập bị vi phạm: Không được sử dụng biến tạm "${token}".`;
    }
  }
  return null;
}

export async function evaluateSubmission(
  testConfig: ServerExerciseTestConfig,
  submittedCode: string,
  totalPoints = 10
): Promise<SubmissionEvaluationReport> {
  const startTime = Date.now();
  const testResults: EvaluatedTestResult[] = [];

  // Check forbidden tokens
  if (testConfig.forbiddenTokens && testConfig.forbiddenTokens.length > 0) {
    const forbiddenViolation = checkForbiddenTokens(submittedCode, testConfig.forbiddenTokens);
    if (forbiddenViolation) {
      return {
        exerciseSlug: testConfig.slug,
        verdict: 'wrong_answer',
        verdictMessage: forbiddenViolation,
        passedTestsCount: 0,
        totalTestsCount: testConfig.testCases.length,
        score: 0,
        totalPoints,
        totalExecutionTimeMs: Date.now() - startTime,
        testResults: testConfig.testCases.map((tc) => ({
          testCaseId: tc.id,
          orderIndex: tc.orderIndex,
          isPassed: false,
          isHidden: tc.isHidden,
          inputData: tc.isHidden ? undefined : tc.inputData,
          expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
          errorMessage: forbiddenViolation,
          executionTimeMs: 0,
        })),
        submittedAt: new Date().toISOString(),
      };
    }
  }

  const pyodide = await getJudgePyodideInstance();
  let passedCount = 0;
  let overallVerdict: Verdict = 'accepted';
  let firstErrorMessage = '';

  for (const testCase of testConfig.testCases) {
    const testStart = Date.now();
    let actualOutput = '';
    let errorMessage: string | undefined = undefined;
    let isPassed = false;

    // Redirect stdout
    pyodide.setStdout({
      batched: (str: string) => {
        actualOutput += str + '\n';
      },
    });

    // Setup stdin
    const inputLines = testCase.inputData.length > 0 ? testCase.inputData.split(/\r?\n/) : [];
    let lineIdx = 0;
    pyodide.setStdin({
      stdin: () => {
        if (lineIdx < inputLines.length) {
          return inputLines[lineIdx++];
        }
        return '';
      },
    });

    try {
      const scope = pyodide.toPy({});
      await pyodide.runPythonAsync(submittedCode, { globals: scope });
      const elapsed = Date.now() - testStart;

      // Compare actual vs expected
      const comp = compareOutputs(actualOutput, testCase.expectedOutput, testCase.comparisonMode);
      isPassed = comp.isMatch;

      if (!isPassed) {
        errorMessage = comp.differenceReason || 'Kết quả đầu ra không khớp';
        if (overallVerdict === 'accepted') {
          overallVerdict = 'wrong_answer';
          firstErrorMessage = `Sai kết quả tại test case #${testCase.orderIndex}`;
        }
      } else {
        passedCount++;
      }

      testResults.push({
        testCaseId: testCase.id,
        orderIndex: testCase.orderIndex,
        isPassed,
        isHidden: testCase.isHidden,
        // CRITICAL SECURITY: Never leak hidden inputs or expected outputs to client!
        inputData: testCase.isHidden ? undefined : testCase.inputData,
        expectedOutput: testCase.isHidden ? undefined : testCase.expectedOutput,
        actualOutput: testCase.isHidden ? undefined : actualOutput.trim(),
        errorMessage: testCase.isHidden && !isPassed ? 'Test ẩn chưa đạt kết quả mong đợi.' : errorMessage,
        executionTimeMs: elapsed,
      });
    } catch (err) {
      const elapsed = Date.now() - testStart;
      const rawError = err instanceof Error ? err.message : String(err);
      
      let errorLabel = 'RuntimeError';
      if (rawError.includes('SyntaxError') || rawError.includes('IndentationError') || rawError.includes('TabError')) {
        errorLabel = 'SyntaxError';
      } else if (rawError.includes('ZeroDivisionError')) {
        errorLabel = 'ZeroDivisionError';
      } else if (rawError.includes('NameError')) {
        errorLabel = 'NameError';
      } else if (rawError.includes('TypeError')) {
        errorLabel = 'TypeError';
      }

      if (overallVerdict === 'accepted' || overallVerdict === 'wrong_answer') {
        overallVerdict = errorLabel === 'SyntaxError' ? 'compile_error' : 'runtime_error';
        firstErrorMessage = `${errorLabel}: ${rawError.split('\n').pop() || rawError}`;
      }

      testResults.push({
        testCaseId: testCase.id,
        orderIndex: testCase.orderIndex,
        isPassed: false,
        isHidden: testCase.isHidden,
        inputData: testCase.isHidden ? undefined : testCase.inputData,
        expectedOutput: testCase.isHidden ? undefined : testCase.expectedOutput,
        errorMessage: testCase.isHidden
          ? `${errorLabel} trong quá trình thực thi trên bộ test ẩn.`
          : `${errorLabel}: ${rawError.split('\n').pop() || 'Lỗi thực thi'}`,
        executionTimeMs: elapsed,
      });
    }
  }

  const totalTests = testConfig.testCases.length;
  const isAllPassed = passedCount === totalTests;

  if (isAllPassed) {
    overallVerdict = 'accepted';
  }

  const score = isAllPassed ? totalPoints : Math.floor((passedCount / totalTests) * totalPoints);

  const verdictMessages: Record<Verdict, string> = {
    accepted: `Chúc mừng! Bài làm đạt 100% tất cả các bộ kiểm thử (${passedCount}/${totalTests} test case đạt).`,
    wrong_answer: firstErrorMessage || `Chưa đạt: Vượt qua ${passedCount}/${totalTests} test case.`,
    runtime_error: firstErrorMessage || 'Lỗi thời gian chạy (Runtime Error).',
    compile_error: firstErrorMessage || 'Lỗi cú pháp (SyntaxError).',
    time_limit_exceeded: 'Vượt quá thời gian cho phép (Time Limit Exceeded).',
    pending: 'Đang xếp hàng chấm...',
    evaluating: 'Đang chấm...',
  };

  return {
    exerciseSlug: testConfig.slug,
    verdict: overallVerdict,
    verdictMessage: verdictMessages[overallVerdict],
    passedTestsCount: passedCount,
    totalTestsCount: totalTests,
    score,
    totalPoints,
    totalExecutionTimeMs: Date.now() - startTime,
    testResults,
    submittedAt: new Date().toISOString(),
  };
}
