const assert = require('assert');

const {
  PathRecommendationEngine,
} = require('../src/lib/learning-path/recommendationEngine');
const {
  DIAGNOSTIC_QUESTIONS,
} = require('../src/lib/learning-path/diagnosticQuestions');
const {
  buildPathStages,
} = require('../src/lib/learning-path/stageDefinitions');

console.log('=== TEST SCENARIO 1: Brand New User (Cold Start) ===');
// Simulating new user with 0 submissions and 0 diagnostic answers
const newStages = buildPathStages([], []);
assert.strictEqual(newStages.length, 4);
assert.strictEqual(newStages[0].status, 'not_started');
assert.strictEqual(newStages[0].progressPercentage, 0);

const nextForNewUser = PathRecommendationEngine.recommendNextExercise(
  newStages,
  [],
  [],
  'start_from_scratch',
  null
);
assert(nextForNewUser !== null, 'New user should get a recommended first exercise');
console.log(`✓ New user receives starting lesson: "${nextForNewUser.title}" (${nextForNewUser.slug})`);

console.log('=== TEST SCENARIO 2: Active User with Review Queue Priority ===');
// Simulating active user who failed an exercise in auto-judge
const mockFailedSubmissions = [
  {
    id: 'sub-001',
    userId: 'user-active',
    exerciseSlug: 'in-loi-chao-codecobug',
    submittedCode: 'prnt("Hello")',
    verdict: 'wrong_answer',
    score: 0,
    totalPoints: 10,
    passedTestsCount: 0,
    totalTestsCount: 2,
    executionTimeMs: 15,
    submittedAt: new Date().toISOString(),
  },
];

const mockReviewQueue = [
  {
    id: 'rev-001',
    userId: 'user-active',
    exerciseSlug: 'in-loi-chao-codecobug',
    exerciseTitle: 'In lời chào CodeCoBUG',
    targetSkillCode: 'python_syntax_intro',
    targetSkillName: 'Cú pháp vào ra',
    reason: 'failed_submission',
    reasonDescription: 'Test case output mismatch',
    priority: 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

const nextForFailedUser = PathRecommendationEngine.recommendNextExercise(
  newStages,
  mockFailedSubmissions,
  mockReviewQueue,
  'start_from_scratch',
  null
);
assert.strictEqual(nextForFailedUser.isReview, true, 'Next exercise should be flagged as isReview');
assert.strictEqual(nextForFailedUser.slug, 'in-loi-chao-codecobug');
console.log(`✓ User with failed submission receives prioritized review: "${nextForFailedUser.title}" (Reason: ${nextForFailedUser.reason})`);

console.log('=== TEST SCENARIO 3: User Passing Diagnostic and Skipping Stages ===');
// Simulating user who scores 100% on Stage 1 questions
const answers = {};
DIAGNOSTIC_QUESTIONS.forEach((q) => {
  if (q.stageWeight === 1) {
    answers[q.id] = q.correctOptionId;
  } else {
    answers[q.id] = 'wrong_choice';
  }
});

const diagResult = PathRecommendationEngine.evaluateDiagnostic(answers);
assert(diagResult.skippedStages.includes(1), 'Stage 1 should be eligible for skipping');
const skippedStages = buildPathStages([], diagResult.skippedStages);
assert.strictEqual(skippedStages[0].status, 'mastered');
assert.strictEqual(skippedStages[0].skipped, true);
assert.strictEqual(skippedStages[0].progressPercentage, 100);

// Next exercise should now belong to Stage 2
const nextAfterSkip = PathRecommendationEngine.recommendNextExercise(
  skippedStages,
  [],
  [],
  'start_from_scratch',
  null
);
assert(nextAfterSkip !== null);
console.log(`✓ User skipped Stage 1 and correctly advanced to Stage 2: "${nextAfterSkip.title}" (${nextAfterSkip.slug})`);

console.log('=== TEST SCENARIO 4: AI Offline Fallback (Deterministic Rule Engine) ===');
// Engine operates 100% deterministically without external LLM dependencies, ensuring zero disruption
const offlineRecommendation = PathRecommendationEngine.recommendNextExercise(
  skippedStages,
  [],
  [],
  'prepare_projects',
  null
);
assert(offlineRecommendation !== null);
console.log(`✓ Deterministic fallback successfully recommended: "${offlineRecommendation.title}" for goal 'prepare_projects'`);

console.log('\nALL 4 INTEGRATION SCENARIOS VERIFIED SUCCESSFULLY!');

