/**
 * CodeCoBUG Output Comparison Engine
 * Supports exact match, normalized lines (whitespace/line ending stripping),
 * and floating point tolerance.
 */

export type ComparisonMode = 'exact' | 'normalized_lines' | 'float_tolerance';

export interface ComparisonResult {
  isMatch: boolean;
  actualCleaned: string;
  expectedCleaned: string;
  differenceReason?: string;
}

// Normalize line endings (\r\n -> \n) and trailing line whitespace
export function normalizeLines(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

// Normalize exact match: standardizes line endings but preserves internal whitespace
export function normalizeExact(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trimEnd();
}

// Compare two numbers with epsilon tolerance (1e-6)
export function compareWithFloatTolerance(actual: string, expected: string, epsilon = 1e-6): boolean {
  const normActual = normalizeLines(actual);
  const normExpected = normalizeLines(expected);

  if (normActual === normExpected) return true;

  const actualTokens = normActual.split(/\s+/);
  const expectedTokens = normExpected.split(/\s+/);

  if (actualTokens.length !== expectedTokens.length) return false;

  for (let i = 0; i < actualTokens.length; i++) {
    const act = actualTokens[i];
    const exp = expectedTokens[i];

    if (act === exp) continue;

    const numAct = parseFloat(act);
    const numExp = parseFloat(exp);

    if (isNaN(numAct) || isNaN(numExp)) {
      return false;
    }

    if (Math.abs(numAct - numExp) > epsilon) {
      return false;
    }
  }

  return true;
}

export function compareOutputs(
  actual: string,
  expected: string,
  mode: ComparisonMode = 'normalized_lines'
): ComparisonResult {
  const actualStr = actual || '';
  const expectedStr = expected || '';

  if (mode === 'exact') {
    const act = normalizeExact(actualStr);
    const exp = normalizeExact(expectedStr);
    const isMatch = act === exp;
    return {
      isMatch,
      actualCleaned: act,
      expectedCleaned: exp,
      differenceReason: isMatch ? undefined : 'Đầu ra không khớp chính xác từng ký tự (Exact match mismatch)',
    };
  }

  if (mode === 'float_tolerance') {
    const isMatch = compareWithFloatTolerance(actualStr, expectedStr);
    return {
      isMatch,
      actualCleaned: normalizeLines(actualStr),
      expectedCleaned: normalizeLines(expectedStr),
      differenceReason: isMatch ? undefined : 'Giá trị số học vượt quá ngưỡng sai số cho phép (1e-6)',
    };
  }

  // Default: normalized_lines
  const act = normalizeLines(actualStr);
  const exp = normalizeLines(expectedStr);
  const isMatch = act === exp;

  return {
    isMatch,
    actualCleaned: act,
    expectedCleaned: exp,
    differenceReason: isMatch ? undefined : 'Kết quả đầu ra không khớp với đáp án mẫu',
  };
}
