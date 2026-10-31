const assert = require('assert');

// Test 1: Import all learning path modules
const {
  DIAGNOSTIC_QUESTIONS,
} = require('../src/lib/learning-path/diagnosticQuestions');
const {
  PATH_STAGE_DEFINITIONS,
  buildPathStages,
} = require('../src/lib/learning-path/stageDefinitions');
const {
  PathRecommendationEngine,
} = require('../src/lib/learning-path/recommendationEngine');

console.log('=== TEST 1: Diagnostic Questions Integrity ===');
assert(Array.isArray(DIAGNOSTIC_QUESTIONS), 'DIAGNOSTIC_QUESTIONS should be an array');
assert(DIAGNOSTIC_QUESTIONS.length >= 8, 'Should have at least 8 questions');
DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
  assert(q.id, `Question ${idx} must have id`);
  assert(q.question, `Question ${idx} must have text`);
  assert(Array.isArray(q.options) && q.options.length >= 2, `Question ${idx} must have options`);
  assert(q.correctOptionId, `Question ${idx} must specify correctOptionId`);
  const hasValidCorrect = q.options.some((opt) => opt.id === q.correctOptionId);
  assert(hasValidCorrect, `Question ${idx} correctOptionId must exist in options`);
});
console.log(`✓ Passed: ${DIAGNOSTIC_QUESTIONS.length} diagnostic questions verified.`);

console.log('=== TEST 2: Diagnostic Evaluation for Absolute Beginner ===');
const beginnerAnswers = {
  'diag-q1-print': 'a', // wrong
  'diag-q2-types': 'a', // wrong
  'diag-q3-arithmetic': 'a', // wrong
};
const beginnerResult = PathRecommendationEngine.evaluateDiagnostic(beginnerAnswers);
assert.strictEqual(beginnerResult.assessedLevel, 'beginner');
assert.strictEqual(beginnerResult.skippedStages.length, 0, 'Beginner cannot skip any stage');
console.log('✓ Passed: Beginner correctly evaluated without skipped stages.');

console.log('=== TEST 3: Diagnostic Evaluation for Advanced Learner ===');
const perfectAnswers = {};
DIAGNOSTIC_QUESTIONS.forEach((q) => {
  perfectAnswers[q.id] = q.correctOptionId;
});
const advancedResult = PathRecommendationEngine.evaluateDiagnostic(perfectAnswers);
assert.strictEqual(advancedResult.score, 100);
assert.strictEqual(advancedResult.assessedLevel, 'advanced');
assert(advancedResult.skippedStages.includes(1), 'Should skip stage 1');
assert(advancedResult.skippedStages.includes(2), 'Should skip stage 2');
assert(advancedResult.skippedStages.includes(3), 'Should skip stage 3');
console.log(`✓ Passed: Advanced student gets 100% and skips stages: ${advancedResult.skippedStages.join(', ')}`);

console.log('=== TEST 4: Stage Definitions and Prerequisites ===');
assert.strictEqual(PATH_STAGE_DEFINITIONS.length, 4, 'Should have 4 stages');
const stages = buildPathStages([], [1]); // Stage 1 skipped
assert.strictEqual(stages[0].status, 'mastered', 'Skipped stage 1 should have status mastered');
assert.strictEqual(stages[0].skipped, true);
assert.strictEqual(stages[0].progressPercentage, 100);
console.log('✓ Passed: Stage building handles skipped and prerequisite logic.');

console.log('=== TEST 5: Deterministic Recommendation Engine ===');
// Case A: Review item in queue has highest priority
const mockReviewQueue = [
  {
    id: 'rev-001',
    userId: 'test-user',
    exerciseSlug: 'in-loi-chao-codecobug',
    exerciseTitle: 'In lời chào CodeCoBUG',
    targetSkillCode: 'python_syntax_intro',
    targetSkillName: 'Cú pháp',
    reason: 'failed_submission',
    reasonDescription: 'Test case 2 failed',
    priority: 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];
const nextExerciseReview = PathRecommendationEngine.recommendNextExercise(
  stages,
  [],
  mockReviewQueue,
  'start_from_scratch',
  null
);
assert(nextExerciseReview !== null);
assert.strictEqual(nextExerciseReview.slug, 'in-loi-chao-codecobug');
assert.strictEqual(nextExerciseReview.isReview, true);
console.log('✓ Passed: Priority 1 review queue takes precedence in recommendation.');

// Case B: Sequential progression when no review items exist
const nextNormal = PathRecommendationEngine.recommendNextExercise(
  stages,
  [],
  [],
  'start_from_scratch',
  null
);
assert(nextNormal !== null);
assert(nextNormal.slug.length > 0);
console.log(`✓ Passed: Sequential next exercise found: "${nextNormal.title}" (${nextNormal.slug})`);

console.log('\nALL LEARNING PATH LOGIC TESTS PASSED SUCCESSFULLY!');

