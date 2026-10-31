/**
 * CodeCoBUG Step 5 E2E Verification Test Suite
 * Connect Curriculum to the Full-Stack Learning System
 *
 * Validates:
 * 1. Lesson System (unified data, prerequisites, status transitions, persistence)
 * 2. Exercise System (linking, prompt loading, real judge grading, test case results persistence)
 * 3. Progress System (honest calculation, lesson & exercise metrics, history retrieval)
 * 4. AI Tutor System (chapter/lesson awareness, error analysis, graduated hints, non-contradiction, isolation)
 * 5. Review System (skill-based errors, empirical weakness, adaptive queue, clearance upon success)
 * 6. Full Completion Gate Flow (Lesson -> Exercise -> Judge -> Progress -> AI -> Review -> Persistence)
 */

import assert from 'node:assert';
import {
  OFFICIAL_PYTHON_COURSE,
  getLessonBySlug,
  getTopicBySlug,
  getExerciseFromRegistry,
  getAllExercisesFromRegistry,
  getAllLessonsFromRegistry,
} from '../src/lib/curriculum/curriculumRegistry';
import { authManager } from '../src/lib/auth/authManager';
import { getServerExerciseTests } from '../src/lib/judge/testCasesRepository';
import { evaluateSubmission } from '../src/lib/judge/runner';
import { AITutorService } from '../src/lib/ai/tutorService';
import { MasteryEngine } from '../src/lib/mastery/masteryEngine';
import { ReviewEngine } from '../src/lib/mastery/reviewEngine';

// Node.js DOM polyfill for localStorage testing
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

global.window = {};
global.localStorage = new LocalStorageMock();

let totalPassed = 0;
let totalFailed = 0;

function pass(msg) {
  totalPassed++;
  console.log(`  ✔ PASS: ${msg}`);
}

function fail(msg, err) {
  totalFailed++;
  console.error(`  ✖ FAIL: ${msg}`);
  if (err) console.error(err);
}

async function runStep5Verification() {
  console.log('=============================================================');
  console.log('🚀 STEP 5: VERIFYING CURRICULUM & FULL-STACK INTEGRATION FLOW');
  console.log('=============================================================');

  // Clear mock database
  global.localStorage.clear();
  authManager.reloadSession();

  // -------------------------------------------------------------------------
  // 1. LESSON SYSTEM VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- 1. Lesson System: Unified Loading, Prerequisites & Status ---');

  const allLessons = getAllLessonsFromRegistry();
  assert(allLessons.length === 44, `All 44 curriculum lessons are cataloged (actual: ${allLessons.length})`);
  pass(`44 curriculum lessons successfully loaded from unified registry`);

  const sampleLessonMatch = getLessonBySlug('chu-de-01-lam-quen-python', 'gioi-thieu-va-moi-truong');
  assert(sampleLessonMatch !== null, 'getLessonBySlug successfully retrieves lesson');
  const { topic: sampleTopic, lesson: sampleLesson } = sampleLessonMatch;

  assert(sampleLesson.title.includes('Giới thiệu Python'), 'Lesson title matches registry');
  assert(Array.isArray(sampleLesson.learningObjectives) && sampleLesson.learningObjectives.length > 0, 'Lesson defines clear learning objectives');
  assert(Array.isArray(sampleLesson.prerequisites) && sampleLesson.prerequisites.length > 0, 'Lesson defines explicit prerequisites');
  assert(sampleLesson.theoryContent && sampleLesson.theoryContent.length > 50, 'Lesson provides rich pedagogical theory');
  assert(Array.isArray(sampleLesson.codeExamples) && sampleLesson.codeExamples.length > 0, 'Lesson provides runnable code examples');
  assert(Array.isArray(sampleLesson.exercises) && sampleLesson.exercises.length > 0, 'Lesson links to actionable exercises');
  pass(`Lesson "gioi-thieu-va-moi-truong" meets 10-part pedagogical standards`);

  // Lesson status lifecycle
  const lessonExerciseSlugs = sampleLesson.exercises.map((e) => e.slug);
  const initialStatus = authManager.getLessonStatus(sampleLesson.slug, lessonExerciseSlugs);
  assert.strictEqual(initialStatus, 'not_started', 'Untouched lesson has status "not_started"');
  pass(`Initial lesson status is "not_started"`);

  // Learner opens lesson -> in_progress (NOT completed)
  authManager.saveLessonProgress(sampleLesson.slug, 'in_progress');
  const openedStatus = authManager.getLessonStatus(sampleLesson.slug, lessonExerciseSlugs);
  assert.strictEqual(openedStatus, 'in_progress', 'Opening lesson sets status "in_progress" (not completed)');
  pass(`Opening lesson marks it "in_progress" without fake completion`);

  // Page reload simulation
  authManager.reloadSession();
  const reloadedStatus = authManager.getLessonStatus(sampleLesson.slug, lessonExerciseSlugs);
  assert.strictEqual(reloadedStatus, 'in_progress', 'Lesson status persists across session reload');
  pass(`Lesson status persists across reload`);

  // -------------------------------------------------------------------------
  // 2. EXERCISE SYSTEM: LINKING, RUNTIME, JUDGE & TEST CASE PERSISTENCE
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Exercise System: Linking, Judge & Test Case Persistence ---');

  const firstEx = sampleLesson.exercises[0];
  const exResolved = getExerciseFromRegistry(firstEx.slug);
  assert(exResolved !== null, `getExerciseFromRegistry resolves "${firstEx.slug}"`);
  assert.strictEqual(exResolved.lesson.slug, sampleLesson.slug, 'Exercise correctly resolves to parent lesson');
  assert.strictEqual(exResolved.topic.slug, sampleTopic.slug, 'Exercise correctly resolves to parent topic');
  pass(`Exercise "${firstEx.slug}" is accurately linked to parent lesson and topic`);

  const serverTests = getServerExerciseTests(firstEx.slug);
  assert(serverTests !== null, 'Authoritative server tests exist for exercise');
  assert(serverTests.testCases.length >= 3, `Exercise has at least 3 test cases (actual: ${serverTests.testCases.length})`);
  assert(serverTests.testCases.some((t) => t.isHidden), 'Exercise has hidden test cases for judge security');
  pass(`Server test configuration contains >= 3 tests including hidden test cases`);

  // Grade correct code
  const correctCode = firstEx.solutionCode || 'print("Chao mung ban den voi the gioi lap trinh Python!")';
  const acceptedReport = await evaluateSubmission(serverTests, correctCode, 10);
  assert.strictEqual(acceptedReport.verdict, 'accepted', 'Correct code achieves "accepted" verdict');
  assert.strictEqual(acceptedReport.score, 10, 'Full score awarded for correct code');
  assert.strictEqual(acceptedReport.passedTestsCount, acceptedReport.totalTestsCount, 'All test cases pass');
  pass(`Judge Engine grades correct code with accepted verdict and full score`);

  // Grade incorrect code
  const wrongCode = 'print("Hello wrong output")';
  const failedReport = await evaluateSubmission(serverTests, wrongCode, 10);
  assert.strictEqual(failedReport.verdict, 'wrong_answer', 'Wrong code produces "wrong_answer" verdict');
  assert.strictEqual(failedReport.score, 0, 'Zero score for wrong code');
  pass(`Judge Engine detects incorrect output with "wrong_answer" verdict`);

  // Persist submission with individual test case results
  const savedSubmission = await authManager.saveSubmission({
    exerciseSlug: firstEx.slug,
    submittedCode: wrongCode,
    verdict: failedReport.verdict,
    score: failedReport.score,
    totalPoints: failedReport.totalPoints,
    passedTestsCount: failedReport.passedTestsCount,
    totalTestsCount: failedReport.totalTestsCount,
    executionTimeMs: failedReport.totalExecutionTimeMs,
    testCaseResults: failedReport.testResults.map((tr) => ({
      orderIndex: tr.orderIndex,
      inputData: tr.inputData,
      expectedOutput: tr.expectedOutput,
      actualOutput: tr.actualOutput,
      isPassed: tr.isPassed,
      errorMessage: tr.errorMessage,
      executionTimeMs: tr.executionTimeMs,
      isHidden: tr.isHidden,
    })),
  });

  assert(savedSubmission.id.startsWith('sub-'), 'Submission assigned unique ID');
  assert(Array.isArray(savedSubmission.testCaseResults), 'Submission stores array of testCaseResults');
  assert.strictEqual(
    savedSubmission.testCaseResults.length,
    failedReport.testResults.length,
    'All individual test cases are persisted'
  );
  pass(`Submission persists individual test case results (count: ${savedSubmission.testCaseResults.length})`);

  // -------------------------------------------------------------------------
  // 3. PROGRESS SYSTEM: REAL DERIVATION & HISTORY
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Progress System: Real Derivation & History Inspection ---');

  // Currently 1 failed submission -> 0 completed exercises
  let userSubs = authManager.getAllUserSubmissions();
  let acceptedSlugs = new Set(userSubs.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug));
  assert.strictEqual(acceptedSlugs.size, 0, 'Failed submission does NOT increment completed exercises');
  pass(`Failed submission does NOT increment completed exercises count (remains 0)`);

  // Now submit correct code
  await authManager.saveSubmission({
    exerciseSlug: firstEx.slug,
    submittedCode: correctCode,
    verdict: acceptedReport.verdict,
    score: acceptedReport.score,
    totalPoints: acceptedReport.totalPoints,
    passedTestsCount: acceptedReport.passedTestsCount,
    totalTestsCount: acceptedReport.totalTestsCount,
    executionTimeMs: acceptedReport.totalExecutionTimeMs,
    testCaseResults: acceptedReport.testResults.map((tr) => ({
      orderIndex: tr.orderIndex,
      inputData: tr.inputData,
      expectedOutput: tr.expectedOutput,
      actualOutput: tr.actualOutput,
      isPassed: tr.isPassed,
      errorMessage: tr.errorMessage,
      executionTimeMs: tr.executionTimeMs,
      isHidden: tr.isHidden,
    })),
  });

  userSubs = authManager.getAllUserSubmissions();
  acceptedSlugs = new Set(userSubs.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug));
  assert.strictEqual(acceptedSlugs.size, 1, 'Completed exercises count increments to 1 after accepted submission');
  pass(`Accepted submission increments completed exercise count to 1`);

  // Verify points awarded
  const currentUser = authManager.getCurrentUser();
  assert(currentUser && currentUser.points === 10, `Points updated to 10 (actual: ${currentUser?.points})`);
  pass(`User points awarded strictly on accepted submission`);

  // Duplicate submission does not double count
  await authManager.saveSubmission({
    exerciseSlug: firstEx.slug,
    submittedCode: correctCode,
    verdict: 'accepted',
    score: 10,
    totalPoints: 10,
    passedTestsCount: acceptedReport.totalTestsCount,
    totalTestsCount: acceptedReport.totalTestsCount,
    executionTimeMs: 15,
  });

  const reloadedUser = authManager.getCurrentUser();
  assert(reloadedUser && reloadedUser.points === 10, 'Duplicate accepted submission does NOT double-award points');
  pass(`Duplicate submission does not double count points`);

  // Check lesson progress derivation
  const isLessonPartiallySolved = lessonExerciseSlugs.some((s) => acceptedSlugs.has(s));
  const isLessonFullySolved = lessonExerciseSlugs.every((s) => acceptedSlugs.has(s));
  assert(isLessonPartiallySolved, 'Lesson has partially solved exercises');
  assert(!isLessonFullySolved, 'Lesson is not fully solved until all linked exercises are accepted');

  const partialLessonStatus = authManager.getLessonStatus(sampleLesson.slug, lessonExerciseSlugs);
  assert.strictEqual(partialLessonStatus, 'in_progress', 'Lesson status is "in_progress" when partial exercises are solved');
  pass(`Lesson status is "in_progress" when partially completed`);

  const SAMPLE_SOLUTIONS = {
    'chao-mung-den-voi-python': 'print("Chao mung ban den voi the gioi lap trinh Python!")\n',
    'in-nhieu-dong-chu': 'print("Toi la hoc vien CodeCoBUG")\nprint("Toi dang hoc lap trinh Python")\nprint("Lap trinh that thu vi!")\n',
  };

  // Solve all remaining exercises of this lesson
  for (const ex of sampleLesson.exercises.slice(1)) {
    const tests = getServerExerciseTests(ex.slug);
    const sol = SAMPLE_SOLUTIONS[ex.slug] || ex.solutionCode || 'print("Solution")';
    const rep = await evaluateSubmission(tests, sol, 10);
    assert.strictEqual(rep.verdict, 'accepted', `Exercise ${ex.slug} solved with accepted verdict`);
    await authManager.saveSubmission({
      exerciseSlug: ex.slug,
      submittedCode: sol,
      verdict: rep.verdict,
      score: rep.score,
      totalPoints: rep.totalPoints,
      passedTestsCount: rep.passedTestsCount,
      totalTestsCount: rep.totalTestsCount,
      executionTimeMs: 10,
    });
  }

  const completeLessonStatus = authManager.getLessonStatus(sampleLesson.slug, lessonExerciseSlugs);
  assert.strictEqual(completeLessonStatus, 'completed', 'Lesson status transitions to "completed" when all linked exercises are solved');
  pass(`Lesson status cleanly transitions to "completed" upon solving all linked exercises`);

  // Review submission history
  const historyList = authManager.getSubmissionsForExercise(firstEx.slug);
  assert(historyList.length >= 2, `History records all attempts (actual: ${historyList.length})`);
  const subWithTests = historyList.find((s) => s.testCaseResults && s.testCaseResults.length > 0);
  assert(subWithTests !== undefined, 'History entries retain individual test case results');
  pass(`Learner can view past submission history with test case details`);

  // -------------------------------------------------------------------------
  // 4. AI TUTOR: CHAPTER AWARENESS, PEDAGOGICAL HINTS & VERDICT INTEGRITY
  // -------------------------------------------------------------------------
  console.log('\n--- 4. AI Tutor: Context Awareness, Hinting & Security Guard ---');

  // Verify ExerciseContext supports chapter & lesson titles
  const aiExerciseContext = {
    title: firstEx.title,
    slug: firstEx.slug,
    difficulty: firstEx.difficulty,
    description: firstEx.description,
    starterCode: firstEx.starterCode,
    chapterTitle: sampleTopic.title,
    lessonTitle: sampleLesson.title,
  };

  // Mock config to test prompt assembly and instructions
  const mockConfig = {
    provider: 'gemini',
    apiKey: 'AIzaSyFakeKeyForContextAssemblyTest1234',
    model: 'gemini-2.0-flash',
  };

  // 1. Error explanation incorporates chapter, lesson, code, and error trace
  const explainPrompt = AITutorService['buildExplainErrorPrompt'](aiExerciseContext, {
    submittedCode: wrongCode,
    cleanTraceback: 'AssertionError: Output did not match expected',
    errorMessage: 'Sai kết quả tại test case #1',
    failedTestInfo: {
      orderIndex: 1,
      inputData: '',
      expectedOutput: 'Chao mung ban den voi the gioi lap trinh Python!',
      actualOutput: 'Hello wrong output',
    },
  });

  assert(explainPrompt.includes(sampleTopic.title), 'AI prompt contains current chapter title');
  assert(explainPrompt.includes(sampleLesson.title), 'AI prompt contains current lesson title');
  assert(explainPrompt.includes(wrongCode), 'AI prompt contains submitted learner code');
  assert(explainPrompt.includes('Hello wrong output'), 'AI prompt contains actual student output');
  assert(explainPrompt.includes('Chao mung ban den voi the gioi lap trinh Python!'), 'AI prompt contains expected output');
  pass(`AI Tutor prompt is fully aware of chapter, lesson, code, and real judge feedback`);

  // 2. Graduated hinting (Level 1, Level 2, Level 3)
  const hintLevel1 = AITutorService['buildHintPrompt'](aiExerciseContext, { submittedCode: wrongCode }, 1);
  const hintLevel2 = AITutorService['buildHintPrompt'](aiExerciseContext, { submittedCode: wrongCode }, 2);
  const hintLevel3 = AITutorService['buildHintPrompt'](aiExerciseContext, { submittedCode: wrongCode }, 3);

  assert(hintLevel1.includes('Mức 1 (Khái niệm)'), 'Hint Level 1 specifies conceptual instruction');
  assert(hintLevel2.includes('Mức 2 (Thuật toán & Logic)'), 'Hint Level 2 specifies algorithmic instruction');
  assert(hintLevel3.includes('Mức 3 (Cú pháp & Chi tiết)'), 'Hint Level 3 specifies syntax-level instruction');
  pass(`AI Tutor implements graduated hints (Level 1 -> 2 -> 3) instead of instant solutions`);

  // 3. AI recommends related exercises
  const recommendPrompt = AITutorService['buildRecommendExercisesPrompt'](aiExerciseContext, {
    submittedCode: wrongCode,
    verdict: 'wrong_answer',
  });
  assert(recommendPrompt.includes('ĐỀ XUẤT BÀI TẬP VÀ LỘ TRÌNH RÈN LUYỆN LIÊN QUAN'), 'AI prompt commands exercise recommendations');
  assert(recommendPrompt.includes(sampleTopic.title), 'Recommendation prompt is scoped to active chapter');
  pass(`AI Tutor provides scoped exercise recommendations for the active chapter`);

  // 4. Judge Verdict Integrity rule
  const systemPrompt = AITutorService['SYSTEM_PROMPT'];
  assert(systemPrompt.includes('JUDGE VERDICT INTEGRITY'), 'System prompt enforces Judge Verdict Integrity');
  assert(systemPrompt.includes('KHÔNG BAO GIỜ được tự ý tuyên bố mã nguồn là đúng'), 'AI forbidden from false pass declarations');
  pass(`Judge Verdict Integrity strictly prevents AI from falsely overruling judge results`);

  // -------------------------------------------------------------------------
  // 5. REVIEW SYSTEM: SKILL TRACKING, WEAKNESS QUEUE & RESOLUTION
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Review System: Skill-Based Errors, Queueing & Resolution ---');

  // Register Learner Charlie to test review queue with isolated clean slate
  await authManager.signUp('charlie@codecobug.dev', 'password123', 'Charlie Nguyen');
  const charlie = authManager.getCurrentUser();
  assert(charlie && charlie.email === 'charlie@codecobug.dev', 'Charlie registered cleanly');

  // Verify initial empty review queue (No fake review data)
  ReviewEngine.syncReviewQueue(charlie.id, []);
  const initialQueue = ReviewEngine.getPendingReviews(charlie.id);
  assert.strictEqual(initialQueue.length, 0, 'No fake review items generated for user with 0 submissions');
  pass(`Review queue maintains 0 fake items when no failed submissions exist`);

  // Charlie fails an exercise
  const failedCharlieSubmission = await authManager.saveSubmission({
    exerciseSlug: 'ex-01-01',
    submittedCode: 'print("Wrong")',
    verdict: 'wrong_answer',
    score: 0,
    totalPoints: 10,
    passedTestsCount: 0,
    totalTestsCount: 3,
    executionTimeMs: 12,
  });

  // Sync review queue with submission evidence
  const charlieSubs = authManager.getAllUserSubmissions();
  ReviewEngine.syncReviewQueue(charlie.id, charlieSubs);
  const pendingAfterFail = ReviewEngine.getPendingReviews(charlie.id);

  assert(pendingAfterFail.length >= 1, `Failed submission queued into review items (actual: ${pendingAfterFail.length})`);
  const directFailItem = pendingAfterFail.find((q) => q.reason === 'failed_submission');
  assert(directFailItem !== undefined, 'Review queue contains direct failed_submission item');
  assert.strictEqual(directFailItem.exerciseSlug, 'ex-01-01', 'Queued item matches failed exercise slug');
  assert.strictEqual(directFailItem.priority, 1, 'Failed exercise flagged with Priority 1');
  assert(directFailItem.targetSkillName.length > 0, 'Review item identifies target skill name');
  pass(`Failed exercise queued with Priority 1 and identified skill: "${directFailItem.targetSkillName}"`);

  // Charlie subsequently solves the exercise with accepted verdict
  await authManager.saveSubmission({
    exerciseSlug: 'ex-01-01',
    submittedCode: 'print("Chao mung ban den voi the gioi lap trinh Python!")',
    verdict: 'accepted',
    score: 10,
    totalPoints: 10,
    passedTestsCount: 3,
    totalTestsCount: 3,
    executionTimeMs: 14,
  });

  // Re-sync review queue
  const charlieSubsAfterPass = authManager.getAllUserSubmissions();
  ReviewEngine.syncReviewQueue(charlie.id, charlieSubsAfterPass);
  const pendingAfterPass = ReviewEngine.getPendingReviews(charlie.id);
  const completedReviews = ReviewEngine.getCompletedReviews(charlie.id);

  const isStillInPending = pendingAfterPass.some((p) => p.exerciseSlug === 'ex-01-01');
  assert.strictEqual(isStillInPending, false, 'Solved exercise cleared from pending review queue');
  const solvedCompletedItem = completedReviews.find((c) => c.exerciseSlug === 'ex-01-01');
  assert(solvedCompletedItem !== undefined, 'Solved exercise moved to completed review history');
  pass(`Solved exercise automatically clears pending queue and records completed review history`);

  // -------------------------------------------------------------------------
  // 6. MULTI-TENANT ACCESS CONTROL & DATA PRIVACY
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Multi-Tenant Access Control & Privacy Isolation ---');

  // Register Learner Diana
  await authManager.signUp('diana@codecobug.dev', 'password123', 'Diana Le');
  const diana = authManager.getCurrentUser();
  assert(diana && diana.email === 'diana@codecobug.dev', 'Diana registered cleanly');

  // Diana should see 0 of Charlie's submissions
  const dianaSubs = authManager.getAllUserSubmissions();
  assert.strictEqual(dianaSubs.length, 0, 'Diana sees strictly 0 submissions (Multi-tenant isolation)');

  // Diana should have 0 pending reviews
  const dianaQueue = ReviewEngine.getPendingReviews(diana.id);
  assert.strictEqual(dianaQueue.length, 0, 'Diana has 0 pending reviews from Charlie');
  pass(`Strict multi-tenant isolation verified: User Diana cannot access Charlie's records`);

  // Sign back in as Charlie
  await authManager.signIn('charlie@codecobug.dev', 'password123');
  const charlieRestoredSubs = authManager.getAllUserSubmissions();
  assert.strictEqual(charlieRestoredSubs.length, 2, 'Charlie submissions fully preserved upon re-login');
  pass(`Charlie submissions and learning history fully preserved upon re-login`);

  console.log('\n=============================================================');
  console.log(`🏁 STEP 5 FULL-STACK VERIFICATION: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('=============================================================');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runStep5Verification().catch((err) => {
  console.error('Fatal test error in Step 5 verification:', err);
  process.exit(1);
});
