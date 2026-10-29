/**
 * CodeCoBUG Phase 7 Test Suite: Weakness Tracking, Mastery Engine, Adaptive Review & Exercise Variation
 *
 * Acceptance Criteria verified:
 * 1. Progress derives from persisted evidence (SavedSubmissionRecord).
 * 2. Recurring weaknesses are identifiable and categorized.
 * 3. Review recommendations are actionable and automatically prioritized.
 * 4. Mastery rules are configurable and documented.
 * 5. Re-assessment mechanism updates review items and mastery upon passing.
 * 6. Exercise generation includes quality and duplication checks.
 */

// Mock window and localStorage for multi-tenant review queue storage testing
const store = {};
global.window = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => {
    store[key] = String(val);
  },
  removeItem: (key) => {
    delete store[key];
  },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k];
  },
};

const { ErrorClassifier } = require('../src/lib/mastery/errorClassifier');
const { MasteryEngine, DEFAULT_MASTERY_POLICY } = require('../src/lib/mastery/masteryEngine');
const { ReviewEngine } = require('../src/lib/mastery/reviewEngine');
const { ExerciseVariationEngine } = require('../src/lib/mastery/exerciseVariation');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
    passCount++;
  } else {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
    failCount++;
  }
}

async function runTestSuite() {
  console.log('\n=============================================================');
  console.log('🧪 RUNNING PHASE 7 TEST SUITE: WEAKNESS TRACKING & MASTERY');
  console.log('=============================================================\n');

  // -------------------------------------------------------------
  // TEST GROUP 1: Structured Error Classification
  // -------------------------------------------------------------
  console.log('--- Test Group 1: ErrorClassifier Diagnostics ---');

  const errSyntax = ErrorClassifier.classify(
    'File "solution.py", line 1\n    print("Hello world"\n                       ^\nSyntaxError: was never closed'
  );
  assert(errSyntax.category === 'syntax_slip', 'Classifies SyntaxError / unclosed parenthesis as syntax_slip');
  assert(errSyntax.severity === 'medium', 'SyntaxError has medium severity');

  const errName = ErrorClassifier.classify(
    'NameError: name "nput" is not defined. Did you mean: "input"?'
  );
  assert(errName.category === 'name_error', 'Classifies NameError as name_error');

  const errType = ErrorClassifier.classify(
    'TypeError: can only concatenate str (not "int") to str'
  );
  assert(errType.category === 'type_mismatch', 'Classifies TypeError as type_mismatch');

  const errRule = ErrorClassifier.classify(
    'RuleViolationError: Vi phạm ràng buộc đề bài: Phát hiện biến cấm [temp]'
  );
  assert(errRule.category === 'constraint_violation', 'Classifies forbidden variable usage as constraint_violation');
  assert(errRule.severity === 'high', 'Rule violation has high severity');

  const errZeroDiv = ErrorClassifier.classify(
    'ZeroDivisionError: division by zero'
  );
  assert(errZeroDiv.category === 'zero_division', 'Classifies ZeroDivisionError as zero_division');

  const errIndex = ErrorClassifier.classify(
    'IndexError: list index out of range'
  );
  assert(errIndex.category === 'index_out_of_bounds', 'Classifies IndexError as index_out_of_bounds');

  const errTimeout = ErrorClassifier.classify('', 'timeout');
  assert(errTimeout.category === 'timeout_loop', 'Classifies timeout verdict as timeout_loop');

  const errFormatting = ErrorClassifier.classify(
    '',
    'wrong_answer',
    'Xin chao CodeCoBUG!',
    'Xin chao CodeCoBUG!  \n'
  );
  assert(errFormatting.category === 'output_formatting', 'Classifies whitespace-only mismatch as output_formatting');

  const errLogic = ErrorClassifier.classify(
    '',
    'wrong_answer',
    '10 20',
    '20 20'
  );
  assert(errLogic.category === 'logic_boundary', 'Classifies value difference as logic_boundary');


  // -------------------------------------------------------------
  // TEST GROUP 2: Mastery Calculation from Persisted Evidence
  // -------------------------------------------------------------
  console.log('\n--- Test Group 2: MasteryEngine Computation ---');

  // Case A: No submissions yet -> All skills untested
  const emptyReport = MasteryEngine.computeMastery([]);
  assert(emptyReport.totalSubmissionsAnalyzed === 0, 'Zero submissions analyzed for new learner');
  assert(emptyReport.overallMasteryPercentage === 0, 'Overall mastery is 0% with no attempts');
  assert(emptyReport.untestedCount > 0, 'Untested skills count matches full taxonomy');
  assert(emptyReport.recurringWeaknesses.length === 0, 'No weaknesses logged when untested');

  // Case B: Single Failed Submission on 'in-loi-chao-codecobug'
  const subFail1 = {
    id: 'sub-1',
    exerciseSlug: 'in-loi-chao-codecobug',
    submittedAt: '2026-10-29T08:00:00Z',
    verdict: 'runtime_error',
    score: 0,
    testsPassed: 0,
    totalTests: 3,
    errorDetails: 'NameError: name "prnt" is not defined',
  };

  const reportAfterFail = MasteryEngine.computeMastery([subFail1]);
  const printSkillFail = reportAfterFail.skills.find((s) => s.skillCode === 'python_print_syntax');
  assert(printSkillFail !== undefined, 'Skill python_print_syntax exists in report');
  assert(printSkillFail.status === 'weak', 'Single failure marks skill as weak');
  assert(printSkillFail.masteryScore === 0, 'Mastery score remains 0 or clamped at 0 on failure');
  assert(printSkillFail.recurringErrors.length === 1, 'Recurring error is recorded');
  assert(printSkillFail.recurringErrors[0].category === 'name_error', 'Recurring error category is name_error');

  // Case C: Subsequent Success -> Score recovery
  const subPass1 = {
    id: 'sub-2',
    exerciseSlug: 'in-loi-chao-codecobug',
    submittedAt: '2026-10-29T08:05:00Z',
    verdict: 'accepted',
    score: 100,
    testsPassed: 3,
    totalTests: 3,
  };

  const reportAfterPass = MasteryEngine.computeMastery([subFail1, subPass1]);
  const printSkillRecovered = reportAfterPass.skills.find((s) => s.skillCode === 'python_print_syntax');
  assert(printSkillRecovered.status === 'in_progress', 'Passing marks previously weak skill as in_progress');
  assert(printSkillRecovered.masteryScore === DEFAULT_MASTERY_POLICY.basePointsPerSuccess, 'Awarded base points (35%) on success');
  assert(printSkillRecovered.consecutiveSuccesses === 1, 'Streak counter is 1');

  // Case D: Streak Successes reaching Mastery Threshold (>= 80%)
  const subPass2 = {
    id: 'sub-3',
    exerciseSlug: 'in-loi-chao-codecobug',
    submittedAt: '2026-10-29T08:10:00Z',
    verdict: 'accepted',
    score: 100,
    testsPassed: 3,
    totalTests: 3,
  };
  const subPass3 = {
    id: 'sub-4',
    exerciseSlug: 'in-loi-chao-codecobug',
    submittedAt: '2026-10-29T08:15:00Z',
    verdict: 'accepted',
    score: 100,
    testsPassed: 3,
    totalTests: 3,
  };

  const reportMastered = MasteryEngine.computeMastery([subFail1, subPass1, subPass2, subPass3]);
  const printSkillMastered = reportMastered.skills.find((s) => s.skillCode === 'python_print_syntax');
  assert(printSkillMastered.masteryScore >= DEFAULT_MASTERY_POLICY.masteryThreshold, 'Mastery score exceeds 80% with streak bonuses');
  assert(printSkillMastered.status === 'mastered', 'Skill status transitions to mastered');
  assert(reportMastered.masteredCount >= 1, 'Mastered count increments in overall report');

  // Case E: Configurable Mastery Policy
  const customPolicy = {
    masteryThreshold: 90,
    basePointsPerSuccess: 20,
    consecutiveBonus: 5,
    penaltyPerFailure: 10,
    minimumAttemptsRequired: 2,
  };
  const reportCustom = MasteryEngine.computeMastery([subFail1, subPass1, subPass2, subPass3], customPolicy);
  const printCustom = reportCustom.skills.find((s) => s.skillCode === 'python_print_syntax');
  assert(printCustom.masteryScore < 90, 'Custom 90% threshold correctly keeps skill in_progress');
  assert(printCustom.status === 'in_progress', 'Adheres to custom policy configuration');


  // -------------------------------------------------------------
  // TEST GROUP 3: Review Queue Scheduling & Re-assessment
  // -------------------------------------------------------------
  console.log('\n--- Test Group 3: ReviewEngine & Automated Re-assessment ---');

  const userIdA = 'usr_learner_a';
  const userIdB = 'usr_learner_b';

  // 1. Learner A fails 'swap-two-variables'
  const failSwap = {
    id: 'sub-swap-fail',
    exerciseSlug: 'swap-two-variables',
    submittedAt: '2026-10-29T08:20:00Z',
    verdict: 'wrong_answer',
    score: 0,
    testsPassed: 1,
    totalTests: 3,
    errorDetails: 'RuleViolationError: Biến cấm temp được phát hiện',
  };

  const queueA = ReviewEngine.syncReviewQueue(userIdA, [failSwap]);
  assert(queueA.length >= 1, 'Review queue item created for failed submission');
  const swapReviewItem = queueA.find((q) => q.exerciseSlug === 'swap-two-variables');
  assert(swapReviewItem !== undefined, 'Swap exercise is in review queue');
  assert(swapReviewItem.priority === 1, 'Failed submission generates Priority 1 review item');
  assert(swapReviewItem.status === 'pending', 'Initial status of review item is pending');
  assert(swapReviewItem.reason === 'failed_submission', 'Reason is failed_submission');

  // 2. Pending reviews retrieval
  const pendingA = ReviewEngine.getPendingReviews(userIdA);
  assert(pendingA.length >= 1, 'getPendingReviews returns pending items');
  assert(pendingA[0].exerciseSlug === 'swap-two-variables', 'Top priority pending review is failed exercise');

  // 3. Multi-tenant isolation: Learner B should have an empty queue
  const pendingB = ReviewEngine.getPendingReviews(userIdB);
  assert(pendingB.length === 0, 'Learner B queue is isolated and empty');

  // 4. Re-assessment: Learner A re-attempts and passes 'swap-two-variables'
  const passSwap = {
    id: 'sub-swap-pass',
    exerciseSlug: 'swap-two-variables',
    submittedAt: '2026-10-29T08:30:00Z',
    verdict: 'accepted',
    score: 100,
    testsPassed: 3,
    totalTests: 3,
  };

  const reAssessedQueue = ReviewEngine.syncReviewQueue(userIdA, [failSwap, passSwap]);
  const completedItem = reAssessedQueue.find((q) => q.exerciseSlug === 'swap-two-variables');
  assert(completedItem.status === 'completed', 'Re-assessment automatically transitions item to completed upon passing');
  assert(Boolean(completedItem.completedAt), 'completedAt timestamp is recorded');

  const pendingAfterPass = ReviewEngine.getPendingReviews(userIdA);
  assert(pendingAfterPass.length === 0, 'No more pending reviews after passing the review exercise');
  const completedReviews = ReviewEngine.getCompletedReviews(userIdA);
  assert(completedReviews.length >= 1, 'Completed item moves to audit history');


  // -------------------------------------------------------------
  // TEST GROUP 4: Exercise Variation, Quality & Duplication Checks
  // -------------------------------------------------------------
  console.log('\n--- Test Group 4: ExerciseVariationEngine Quality & Duplication ---');

  const existingPool = [
    {
      title: 'In lời chào CodeCoBUG',
      slug: 'in-loi-chao-codecobug',
      description: 'Viết chương trình Python in ra dòng chữ chính xác: Xin chao CodeCoBUG!',
    },
    {
      title: 'Nhập tên và tuổi',
      slug: 'nhap-ten-va-tuoi',
      description: 'Nhập vào tên và năm sinh từ bàn phím bằng hàm input(), sau đó tính tuổi hiện tại và in ra màn hình.',
    },
  ];

  // 1. Candidate with poor quality (title too short, no examples)
  const badCandidate = {
    title: 'In',
    description: 'Ngan',
    starterCode: '',
    examples: [],
  };
  const badResult = ExerciseVariationEngine.validate(badCandidate, existingPool);
  assert(!badResult.isValid, 'Rejects invalid exercise candidate');
  assert(badResult.qualityIssues.length >= 2, 'Flags multiple quality issues for short title/desc and missing examples');

  // 2. Candidate that is a duplicate of existing exercise (>75% similarity)
  const duplicateCandidate = {
    title: 'In lời chào CodeCoBUG',
    description: 'Viết chương trình Python in ra đúng dòng chữ chính xác: Xin chao CodeCoBUG!',
    starterCode: '# viet code',
    examples: [{ inputData: '', expectedOutput: 'Xin chao CodeCoBUG!' }],
  };
  const dupResult = ExerciseVariationEngine.validate(duplicateCandidate, existingPool);
  assert(!dupResult.isValid, 'Duplicate candidate is marked invalid');
  assert(dupResult.isDuplicate === true, 'Duplicate flag is true');
  assert(dupResult.duplicateOf === 'In lời chào CodeCoBUG', 'Identifies the exact duplicated exercise');
  assert(dupResult.maxSimilarity >= 0.75, 'Similarity is >= 75% threshold');

  // 3. High quality novel exercise candidate
  const novelCandidate = {
    title: 'Tính tiền điện sinh hoạt theo bậc thang',
    description: 'Nhập vào số kWh điện tiêu thụ trong tháng (số nguyên dương) và tính tổng tiền điện phải trả theo biểu giá quy định.',
    starterCode: '# Tinh tien dien\nkwh = int(input())\n',
    examples: [
      { inputData: '50', expectedOutput: '83900' },
      { inputData: '100', expectedOutput: '173400' },
    ],
  };
  const validResult = ExerciseVariationEngine.validate(novelCandidate, existingPool, 30);
  assert(validResult.isValid === true, 'Novel exercise passes all quality and duplication checks');
  assert(validResult.isDuplicate === false, 'isDuplicate is false for novel exercise');
  assert(validResult.recommendedDifficulty === 'very_easy', 'Adapts difficulty to very_easy for learner with 30% mastery');

  const advancedResult = ExerciseVariationEngine.validate(novelCandidate, existingPool, 85);
  assert(advancedResult.recommendedDifficulty === 'medium', 'Adapts difficulty to medium for learner with 85% mastery');

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('=============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Unhandled test suite error:', err);
  process.exit(1);
});
