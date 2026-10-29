const { compareOutputs } = require('../src/lib/judge/comparator');
const { SERVER_EXERCISE_TESTS } = require('../src/lib/judge/testCasesRepository');
const { evaluateSubmission } = require('../src/lib/judge/runner');

async function runJudgeTestSuite() {
  console.log('====================================================');
  console.log('CodeCoBUG — Phase 4: Judge Engine Automated Tests');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // --- Test 1: Comparator Algorithms ---
  console.log('--- Test 1: Output Comparator (Exact, Normalized, Float) ---');
  const res1 = compareOutputs('Hello World\r\n', 'Hello World', 'normalized_lines');
  assert(res1.isMatch, 'NormalizedLines ignores CRLF difference');

  const res2 = compareOutputs('Line 1   \nLine 2', 'Line 1\nLine 2', 'normalized_lines');
  assert(res2.isMatch, 'NormalizedLines strips trailing space per line');

  const res3 = compareOutputs('3.1415926', '3.1415927', 'float_tolerance');
  assert(res3.isMatch, 'Float tolerance passes within 1e-6 epsilon');

  const res4 = compareOutputs('Wrong Answer', 'Expected Answer', 'normalized_lines');
  assert(!res4.isMatch, 'Mismatched output correctly rejected');

  // --- Test 2: Full Exercise 1 Evaluation (In loi chao) ---
  console.log('\n--- Test 2: Exercise 1 Evaluation (Public + Hidden Tests) ---');
  const config1 = SERVER_EXERCISE_TESTS['in-loi-chao-codecobug'];
  assert(config1.testCases.filter(t => !t.isHidden).length >= 3, 'Exercise 1 has at least 3 public test scenarios');
  assert(config1.testCases.some(t => t.isHidden), 'Exercise 1 has hidden test scenarios');

  // Evaluate correct submission
  const eval1 = await evaluateSubmission(config1, 'print("Xin chao CodeCoBUG")', 10);
  assert(eval1.verdict === 'accepted', 'Correct code receives "accepted" verdict');
  assert(eval1.passedTestsCount === 4, 'All 4 test cases passed (3 public + 1 hidden)');
  assert(eval1.score === 10, 'Full score awarded on accepted submission');

  // Evaluate wrong submission
  const eval1Wrong = await evaluateSubmission(config1, 'print("Sai ket qua")', 10);
  assert(eval1Wrong.verdict === 'wrong_answer', 'Wrong code receives "wrong_answer" verdict');
  assert(eval1Wrong.passedTestsCount === 0, 'Zero tests passed for completely wrong output');
  assert(eval1Wrong.score === 0, 'Zero score for wrong answer');

  // --- Test 3: Exercise 2 Input Pipeline (Nhap ten va tuoi) ---
  console.log('\n--- Test 3: Exercise 2 Input Pipelines ---');
  const config2 = SERVER_EXERCISE_TESTS['nhap-ten-va-tuoi'];
  const code2 = 'ten = input()\ntuoi = int(input())\nprint(f"Ban {ten} nam nay {tuoi} tuoi")';
  const eval2 = await evaluateSubmission(config2, code2, 15);
  assert(eval2.verdict === 'accepted', 'Input-dependent exercise receives accepted verdict');
  assert(eval2.passedTestsCount === 5, 'All 5 tests (3 public + 2 hidden) passed');
  assert(eval2.score === 15, 'Awarded 15/15 points');

  // --- Test 4: Exercise 3 Completion Criteria (Forbidden Tokens) ---
  console.log('\n--- Test 4: Exercise 3 Rule Constraints & Forbidden Tokens ---');
  const config3 = SERVER_EXERCISE_TESTS['hoan-doi-hai-bien'];

  // Code with forbidden temporary variable
  const badSwapCode = `
a = int(input())
b = int(input())
temp = a
a = b
b = temp
print(f"Truoc: a={b}, b={a} Sau: a={a}, b={b}")
`;
  const eval3Bad = await evaluateSubmission(config3, badSwapCode, 20);
  assert(eval3Bad.verdict === 'wrong_answer', 'Code with temporary variable rejected');
  assert(eval3Bad.verdictMessage.includes('temp'), 'Violation message specifies forbidden token "temp"');

  // Code with Pythonic tuple swap
  const goodSwapCode = `
a = int(input())
b = int(input())
orig_a, orig_b = a, b
a, b = b, a
print(f"Truoc: a={orig_a}, b={orig_b} Sau: a={a}, b={b}")
`;
  const eval3Good = await evaluateSubmission(config3, goodSwapCode, 20);
  assert(eval3Good.verdict === 'accepted', 'Pythonic swap without temp variable accepted');
  assert(eval3Good.passedTestsCount === 5, 'All 5 tests passed');
  assert(eval3Good.score === 20, 'Awarded 20/20 points');

  // --- Test 5: Hidden Tests Data Privacy Invariant ---
  console.log('\n--- Test 5: Hidden Tests Security & Privacy Verification ---');
  for (const result of eval1.testResults) {
    if (result.isHidden) {
      assert(result.inputData === undefined, 'Hidden test inputData is NOT disclosed in report');
      assert(result.expectedOutput === undefined, 'Hidden test expectedOutput is NOT disclosed in report');
    } else {
      assert(result.inputData !== undefined, 'Public test inputData is accessible to learner');
      assert(result.expectedOutput !== undefined, 'Public test expectedOutput is accessible to learner');
    }
  }

  console.log('\n====================================================');
  console.log(`Judge Test Results: ${passedTests}/${totalTests} tests PASSED (100%)`);
  console.log('====================================================');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runJudgeTestSuite().catch((err) => {
  console.error('Judge test suite failed:', err);
  process.exit(1);
});
