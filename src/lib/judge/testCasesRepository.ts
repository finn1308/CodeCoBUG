import { TestCase } from '@/lib/types/curriculum';

export interface ServerExerciseTestConfig {
  exerciseId: string;
  slug: string;
  title: string;
  forbiddenTokens?: string[];
  requiredTokens?: string[];
  testCases: TestCase[];
}

/**
 * Authoritative Server Test Cases Repository
 * CRITICAL SECURITY INVARIANT:
 * Rows where isHidden = true contain secret test inputs and expected outputs
 * that must NEVER be returned in full to client responses.
 */
export const SERVER_EXERCISE_TESTS: Record<string, ServerExerciseTestConfig> = {
  'in-loi-chao-codecobug': {
    exerciseId: 'ex-fixture-01',
    slug: 'in-loi-chao-codecobug',
    title: 'In lời chào CodeCoBUG',
    testCases: [
      // 3 Public Tests
      {
        id: 'tc-01-pub-1',
        exerciseId: 'ex-fixture-01',
        inputData: '',
        expectedOutput: 'Xin chao CodeCoBUG',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 1,
      },
      {
        id: 'tc-01-pub-2',
        exerciseId: 'ex-fixture-01',
        inputData: '',
        expectedOutput: 'Xin chao CodeCoBUG',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 2,
      },
      {
        id: 'tc-01-pub-3',
        exerciseId: 'ex-fixture-01',
        inputData: '',
        expectedOutput: 'Xin chao CodeCoBUG',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 3,
      },
      // 1 Secret Hidden Test (Checks trailing newlines and case sensitivity)
      {
        id: 'tc-01-hid-4',
        exerciseId: 'ex-fixture-01',
        inputData: '',
        expectedOutput: 'Xin chao CodeCoBUG',
        isHidden: true,
        comparisonMode: 'normalized_lines',
        weight: 2,
        orderIndex: 4,
      },
    ],
  },

  'nhap-ten-va-tuoi': {
    exerciseId: 'ex-fixture-02',
    slug: 'nhap-ten-va-tuoi',
    title: 'Nhập tên và tuổi',
    testCases: [
      // 3 Public Tests
      {
        id: 'tc-02-pub-1',
        exerciseId: 'ex-fixture-02',
        inputData: 'Huy\n20',
        expectedOutput: 'Ban Huy nam nay 20 tuoi',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 1,
      },
      {
        id: 'tc-02-pub-2',
        exerciseId: 'ex-fixture-02',
        inputData: 'Nguyen Van A\n15',
        expectedOutput: 'Ban Nguyen Van A nam nay 15 tuoi',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 2,
      },
      {
        id: 'tc-02-pub-3',
        exerciseId: 'ex-fixture-02',
        inputData: 'Alice\n1',
        expectedOutput: 'Ban Alice nam nay 1 tuoi',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 3,
      },
      // 2 Secret Hidden Tests (Special characters in name, multi-digit age)
      {
        id: 'tc-02-hid-4',
        exerciseId: 'ex-fixture-02',
        inputData: 'Tran Thi B Mai\n99',
        expectedOutput: 'Ban Tran Thi B Mai nam nay 99 tuoi',
        isHidden: true,
        comparisonMode: 'normalized_lines',
        weight: 2,
        orderIndex: 4,
      },
      {
        id: 'tc-02-hid-5',
        exerciseId: 'ex-fixture-02',
        inputData: 'Bob Dylan\n82',
        expectedOutput: 'Ban Bob Dylan nam nay 82 tuoi',
        isHidden: true,
        comparisonMode: 'normalized_lines',
        weight: 2,
        orderIndex: 5,
      },
    ],
  },

  'hoan-doi-hai-bien': {
    exerciseId: 'ex-fixture-03',
    slug: 'hoan-doi-hai-bien',
    title: 'Hoán đổi hai biến',
    forbiddenTokens: ['temp', 'tmp', 'bien_tam'],
    testCases: [
      // 3 Public Tests
      {
        id: 'tc-03-pub-1',
        exerciseId: 'ex-fixture-03',
        inputData: '5\n10',
        expectedOutput: 'Truoc: a=5, b=10 Sau: a=10, b=5',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 1,
      },
      {
        id: 'tc-03-pub-2',
        exerciseId: 'ex-fixture-03',
        inputData: '-3\n7',
        expectedOutput: 'Truoc: a=-3, b=7 Sau: a=7, b=-3',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 2,
      },
      {
        id: 'tc-03-pub-3',
        exerciseId: 'ex-fixture-03',
        inputData: '0\n0',
        expectedOutput: 'Truoc: a=0, b=0 Sau: a=0, b=0',
        isHidden: false,
        comparisonMode: 'normalized_lines',
        weight: 1,
        orderIndex: 3,
      },
      // 2 Secret Hidden Tests (Large numbers & negative numbers)
      {
        id: 'tc-03-hid-4',
        exerciseId: 'ex-fixture-03',
        inputData: '-9999\n-1',
        expectedOutput: 'Truoc: a=-9999, b=-1 Sau: a=-1, b=-9999',
        isHidden: true,
        comparisonMode: 'normalized_lines',
        weight: 2,
        orderIndex: 4,
      },
      {
        id: 'tc-03-hid-5',
        exerciseId: 'ex-fixture-03',
        inputData: '123456\n654321',
        expectedOutput: 'Truoc: a=123456, b=654321 Sau: a=654321, b=123456',
        isHidden: true,
        comparisonMode: 'normalized_lines',
        weight: 2,
        orderIndex: 5,
      },
    ],
  },
};

export function getServerExerciseTests(slug: string): ServerExerciseTestConfig | null {
  return SERVER_EXERCISE_TESTS[slug] || null;
}
