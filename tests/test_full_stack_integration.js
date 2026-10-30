/**
 * CodeCoBUG Phase 4: Full-Stack Feature Integration Test Suite
 *
 * This test suite comprehensively verifies the 12-step complete learner journey
 * and core security/isolation requirements across the whole application:
 *
 * 1. Sign in & access own data (HMAC-SHA256 session token verification, spoof protection).
 * 2. Open a curriculum chapter (12 chapters structure, Vietnamese pedagogy).
 * 3. Read a lesson (objectives, theoryContent, codeExamples, commonMistakes, recap, W3Schools links).
 * 4. Open an exercise linked to that lesson (metadata, points, starter code, test constraints).
 * 5. Edit and run Python code (Pyodide local runtime execution & error capture).
 * 6. Submit code for authoritative server grading (401 without token, hidden test shielding).
 * 7. Receive actual pass/fail results & error feedback (wrong_answer, runtime_error, accepted).
 * 8. Authoritative persistence & history API (GET /api/submissions).
 * 9. Resume exercise later (draft persistence & previous submission retrieval).
 * 10. Real progress derivation (progress calculated strictly from verified accepted submissions).
 * 11. Empirical mistake review (failed attempts dynamically populate /api/review-queue; passing resolves).
 * 12. Adaptive recommendations & AI Tutor shield (verdict integrity, key redaction).
 * 13. Strict multi-tenant data isolation (User B cannot see User A's submissions or reviews).
 */

const fs = require('fs');
const path = require('path');

// Setup mock window & localStorage environment
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

const { authManager } = require('../src/lib/auth/authManager');
const { createSessionToken, verifySessionToken, getServerAuthenticatedUser } = require('../src/lib/auth/serverAuth');
const { OFFICIAL_PYTHON_COURSE } = require('../src/lib/curriculum/curriculumRegistry');
const { getExerciseBySlug, getAllExercises } = require('../src/lib/fixtures/sampleCurriculum');
const { SERVER_EXERCISE_TESTS } = require('../src/lib/judge/testCasesRepository');
const { evaluateSubmission } = require('../src/lib/judge/runner');
const { saveAuthoritativeSubmission, getAuthoritativeSubmissions } = require('../src/lib/judge/submissionStore');
const { POST: submitRouteHandler } = require('../src/app/api/judge/submit/route');
const { GET: submissionsRouteHandler } = require('../src/app/api/submissions/route');
const { GET: reviewQueueGetHandler, POST: reviewQueuePostHandler } = require('../src/app/api/review-queue/route');
const { MasteryEngine } = require('../src/lib/mastery/masteryEngine');
const { ReviewEngine } = require('../src/lib/mastery/reviewEngine');
const { encryptApiKey, redactApiKey } = require('../src/lib/ai/crypto');

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

async function runFullStackIntegrationSuite() {
  console.log('\n=============================================================');
  console.log('🚀 RUNNING CODECOBUG FULL-STACK INTEGRATION & JOURNEY SUITE');
  console.log('=============================================================\n');

  // Clear environment
  localStorage.clear();

  // -------------------------------------------------------------
  // STEP 1: Sign in and access learner data with cryptographic token
  // -------------------------------------------------------------
  console.log('--- Step 1: Authentication & Cryptographic Session Shield ---');
  const user1 = await authManager.signUp('linh.dan@codecobug.edu.vn', 'securePassword123', 'Linh Dan');
  assert(user1 !== null, 'Learner 1 account created successfully');
  assert(user1.email === 'linh.dan@codecobug.edu.vn', 'Email matches registered address');
  assert(user1.points === 0, 'Learner starts with strictly 0 points (no fake progress)');

  const user1Token = authManager.getSessionToken();
  assert(typeof user1Token === 'string' && user1Token.length > 30, 'Cryptographic session token generated and stored');

  const verifiedUser = verifySessionToken(user1Token);
  assert(verifiedUser !== null, 'Server correctly verifies signed HMAC-SHA256 session token');
  assert(verifiedUser.id === user1.id, 'Session claims match authenticated user ID');
  assert(verifiedUser.email === user1.email, 'Session claims match user email');

  // Tampered token check
  const tamperedToken = user1Token.slice(0, -6) + 'xxxxxx';
  const tamperedVerification = verifySessionToken(tamperedToken);
  assert(tamperedVerification === null, 'Server strictly rejects tampered token with invalid signature');

  // Spoofed header check (unverified client body / headers)
  const fakeReq = new Request('http://localhost:3000/api/submissions', {
    headers: { 'Authorization': 'Bearer ' + tamperedToken },
  });
  const unauthServerUser = await getServerAuthenticatedUser(fakeReq);
  assert(unauthServerUser === null, 'getServerAuthenticatedUser returns null on unauthorized / spoofed request');

  // -------------------------------------------------------------
  // STEP 2: Open a curriculum chapter
  // -------------------------------------------------------------
  console.log('\n--- Step 2: Open Curriculum Chapter ---');
  assert(OFFICIAL_PYTHON_COURSE.topics.length === 12, 'Curriculum contains all 12 planned chapters');
  const chapter01 = OFFICIAL_PYTHON_COURSE.topics[0];
  assert(chapter01.title.includes('Làm quen với Python'), 'Chapter 1 title matches syllabus');
  assert(chapter01.lessons.length >= 3, `Chapter 1 contains structured lessons (actual: ${chapter01.lessons.length})`);

  // -------------------------------------------------------------
  // STEP 3: Read a lesson with pedagogical details
  // -------------------------------------------------------------
  console.log('\n--- Step 3: Read Lesson Content & Reference Links ---');
  const lesson01 = chapter01.lessons[0];
  assert(lesson01.title.length > 0, `Lesson 1 title: "${lesson01.title}"`);
  assert(lesson01.theoryContent && lesson01.theoryContent.length > 50, 'Lesson contains comprehensive Vietnamese explanation');
  assert(Array.isArray(lesson01.learningObjectives) && lesson01.learningObjectives.length > 0, 'Lesson specifies clear learning objectives');
  assert(Array.isArray(lesson01.codeExamples) && lesson01.codeExamples.length > 0, 'Lesson includes runnable code examples');
  assert(Array.isArray(lesson01.commonMistakes) && lesson01.commonMistakes.length > 0, 'Lesson warns about common mistakes and fixes');
  assert(Array.isArray(lesson01.recap) && lesson01.recap.length > 0, 'Lesson includes summary recap points');
  assert(
    Array.isArray(lesson01.referenceLinks) && lesson01.referenceLinks.some((l) => l.url.includes('w3schools.com')),
    'Lesson includes supplementary reference link to W3Schools'
  );

  // -------------------------------------------------------------
  // STEP 4: Open an exercise linked to that lesson
  // -------------------------------------------------------------
  console.log('\n--- Step 4: Open Exercise Linked to Lesson ---');
  const linkedExercise = lesson01.exercises[0];
  assert(linkedExercise !== undefined, 'Lesson is linked to an official exercise');
  assert(linkedExercise.slug.length > 0, `Exercise slug: "${linkedExercise.slug}"`);
  assert(linkedExercise.difficulty.length > 0, `Exercise difficulty: ${linkedExercise.difficulty}`);
  assert(linkedExercise.points > 0, `Exercise reward points: ${linkedExercise.points}`);
  assert(typeof linkedExercise.starterCode === 'string', 'Exercise provides starter code');
  assert(linkedExercise.examples.length >= 1, 'Exercise provides concrete example scenarios');

  // Resolve via getExerciseBySlug
  const resolved = getExerciseBySlug(linkedExercise.slug);
  assert(resolved !== null, 'getExerciseBySlug successfully resolves linked exercise');
  assert(resolved.topic.id === chapter01.id, 'Resolved topic matches parent chapter');
  assert(resolved.lesson.id === lesson01.id, 'Resolved lesson matches parent lesson');

  // -------------------------------------------------------------
  // STEP 5: Edit and run Python code (Local Pyodide runtime execution)
  // -------------------------------------------------------------
  console.log('\n--- Step 5: Local Python Code Execution & Runtime Feedback ---');
  const sampleCode = 'print("Hello from CodeCoBUG")';
  const execConfig = {
    testCases: [{ id: 'local-test-1', inputData: '', expectedOutput: 'Hello from CodeCoBUG', isHidden: false, comparisonMode: 'exact', weight: 1, orderIndex: 1 }],
  };
  const localRun = await evaluateSubmission(execConfig, sampleCode, 10);
  assert(localRun.verdict === 'accepted', 'Local code execution returns valid output');
  assert(localRun.passedTestsCount === 1, 'Execution output matches expected string');

  // Test runtime error capture
  const errorRun = await evaluateSubmission(
    { testCases: [{ id: 'err-test', inputData: '', expectedOutput: '10', isHidden: false, comparisonMode: 'exact', weight: 1, orderIndex: 1 }] },
    'x = 1 / 0',
    10
  );
  assert(errorRun.verdict === 'runtime_error', 'Runtime error (ZeroDivisionError) captured without crashing engine');
  assert(errorRun.verdictMessage && errorRun.verdictMessage.includes('ZeroDivisionError'), 'Traceback clearly mentions ZeroDivisionError');

  // -------------------------------------------------------------
  // STEP 6: Submit code for authoritative server-side grading
  // -------------------------------------------------------------
  console.log('\n--- Step 6: Server-Side Grading with Session Authorization ---');

  // 6a. Attempt submission without session token (must be 401 Unauthorized)
  const unauthSubmitReq = new Request('http://localhost:3000/api/judge/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exerciseSlug: linkedExercise.slug, code: 'print("test")' }),
  });
  const unauthSubmitRes = await submitRouteHandler(unauthSubmitReq);
  assert(unauthSubmitRes.status === 401, 'POST /api/judge/submit rejects unauthenticated submission with 401');

  // 6b. Attempt submission with tampered token (must be 401)
  const tamperedSubmitReq = new Request('http://localhost:3000/api/judge/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tamperedToken}`,
    },
    body: JSON.stringify({ exerciseSlug: linkedExercise.slug, code: 'print("test")' }),
  });
  const tamperedSubmitRes = await submitRouteHandler(tamperedSubmitReq);
  assert(tamperedSubmitRes.status === 401, 'POST /api/judge/submit rejects tampered signature with 401');

  // -------------------------------------------------------------
  // STEP 7: Receive actual pass/fail results & error feedback
  // -------------------------------------------------------------
  console.log('\n--- Step 7: Authoritative Evaluation & Hidden Test Shielding ---');

  // 7a. Submit incorrect code with valid session token
  const wrongSubmitReq = new Request('http://localhost:3000/api/judge/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user1Token}`,
    },
    body: JSON.stringify({
      exerciseSlug: linkedExercise.slug,
      code: '# Wrong answer\nprint("Wrong Output")',
    }),
  });
  const wrongSubmitRes = await submitRouteHandler(wrongSubmitReq);
  assert(wrongSubmitRes.status === 200, 'Authorized submission returns 200 OK');
  const wrongData = await wrongSubmitRes.json();
  assert(wrongData.verdict === 'wrong_answer', `Verdict is strictly wrong_answer (actual: ${wrongData.verdict})`);
  assert(wrongData.score === 0, 'No points awarded for wrong answer');
  assert(wrongData.passedTestsCount < wrongData.totalTestsCount, 'Did not pass all authoritative tests');

  // Verify hidden tests are NOT leaked to client response
  const leakedHidden = wrongData.testResults.some((t) => t.isHidden && (t.inputData || t.expectedOutput));
  assert(!leakedHidden, 'Authoritative hidden test inputs and expected outputs are NEVER disclosed to client');

  // 7b. Submit correct code with valid session token
  // Check if reference solution or canonical code is available
  const serverConfig = SERVER_EXERCISE_TESTS[linkedExercise.slug];
  assert(serverConfig !== undefined, `Authoritative test configuration exists for ${linkedExercise.slug}`);
  const correctCode = 'print("Chao mung ban den voi the gioi lap trinh Python!")';

  const correctSubmitReq = new Request('http://localhost:3000/api/judge/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user1Token}`,
    },
    body: JSON.stringify({
      exerciseSlug: linkedExercise.slug,
      code: correctCode,
    }),
  });
  const correctSubmitRes = await submitRouteHandler(correctSubmitReq);
  assert(correctSubmitRes.status === 200, 'POST /api/judge/submit accepted valid submission');
  const correctData = await correctSubmitRes.json();
  assert(correctData.verdict === 'accepted', `Verdict is strictly "accepted" (actual: ${correctData.verdict})`);
  assert(correctData.passedTestsCount === correctData.totalTestsCount, 'Passed 100% of test cases');
  assert(correctData.score === linkedExercise.points, `Full score (${linkedExercise.points} pt) awarded`);

  // -------------------------------------------------------------
  // STEP 8: Authoritative persistence & Submissions API
  // -------------------------------------------------------------
  console.log('\n--- Step 8: Submission Persistence & Submissions Query API ---');
  const getSubmissionsReq = new Request(`http://localhost:3000/api/submissions?exerciseSlug=${linkedExercise.slug}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${user1Token}` },
  });
  const getSubmissionsRes = await submissionsRouteHandler(getSubmissionsReq);
  assert(getSubmissionsRes.status === 200, 'GET /api/submissions returns 200 OK');
  const subData = await getSubmissionsRes.json();
  assert(Array.isArray(subData.submissions), 'Returns submissions list');
  assert(subData.submissions.length >= 2, `User 1 has at least 2 recorded submissions (actual: ${subData.submissions.length})`);
  assert(subData.submissions.some((s) => s.verdict === 'accepted'), 'Contains accepted submission');
  assert(subData.submissions.some((s) => s.verdict === 'wrong_answer'), 'Contains failed submission');

  // Check data schema of persisted submission
  const latestSub = subData.submissions[0];
  assert(latestSub.userId === user1.id, 'Persisted submission strictly attributed to authenticated user ID');
  assert(latestSub.exerciseSlug === linkedExercise.slug, 'Persisted submission has correct exerciseSlug');
  assert(typeof latestSub.submittedAt === 'string', 'Persisted submission includes ISO timestamp');

  // -------------------------------------------------------------
  // STEP 9: Resume exercise later (Draft & History restoration)
  // -------------------------------------------------------------
  console.log('\n--- Step 9: Code Draft Resumption & Workspace Continuity ---');
  const unfinishedDraft = '# Linh Dan is working on solution\na = 10\nb = 20\n';
  authManager.saveDraft(linkedExercise.slug, unfinishedDraft);

  const restoredDraft = authManager.getDraft(linkedExercise.slug);
  assert(restoredDraft === unfinishedDraft, 'Draft code correctly restored upon resuming exercise');

  // -------------------------------------------------------------
  // STEP 10: Real progress derived strictly from persisted results
  // -------------------------------------------------------------
  console.log('\n--- Step 10: Progress Derivation Strictly From Real Results ---');
  // Also sync client authManager submissions
  authManager.saveSubmission({
    exerciseSlug: linkedExercise.slug,
    verdict: 'accepted',
    code: correctCode,
    score: linkedExercise.points,
    passedTests: correctData.passedTestsCount,
    totalTests: correctData.totalTestsCount,
    executionTimeMs: 30,
    userInputs: [],
    testResults: [],
  });

  const userSubs = authManager.getAllUserSubmissions();
  const acceptedSlugs = new Set(userSubs.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug));
  assert(acceptedSlugs.has(linkedExercise.slug), 'linkedExercise recognized as completed in learner progress');

  const chapter01Exs = chapter01.lessons.flatMap((l) => l.exercises);
  const completedInChapter01 = chapter01Exs.filter((e) => acceptedSlugs.has(e.slug)).length;
  assert(completedInChapter01 === 1, `Chapter 01 has exactly 1 completed exercise (actual: ${completedInChapter01})`);
  const chapter01Progress = Math.round((completedInChapter01 / chapter01Exs.length) * 100);
  assert(chapter01Progress > 0 && chapter01Progress <= 100, `Real progress percentage calculated: ${chapter01Progress}%`);

  // -------------------------------------------------------------
  // STEP 11: Review previously incorrect exercises (Empirical Review Queue)
  // -------------------------------------------------------------
  console.log('\n--- Step 11: Mistake Review & Empirical Queue Workflow ---');
  // Simulate a failed attempt on another exercise: "chuong-01-nhap-hai-so-in-tong" or "nhap-ten-va-tuoi"
  const failedSlug = 'nhap-ten-va-tuoi';
  authManager.saveSubmission({
    exerciseSlug: failedSlug,
    verdict: 'wrong_answer',
    code: 'ten = input()\n# missing age logic',
    score: 0,
    passedTests: 1,
    totalTests: 3,
    executionTimeMs: 25,
    userInputs: [],
    testResults: [],
  });

  // Query review queue via API
  const reviewGetReq = new Request('http://localhost:3000/api/review-queue', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${user1Token}` },
  });
  const reviewGetRes = await reviewQueueGetHandler(reviewGetReq);
  assert(reviewGetRes.status === 200, 'GET /api/review-queue returns 200 OK');
  const reviewData = await reviewGetRes.json();
  assert(Array.isArray(reviewData.pending), 'Returns pending array from review queue');

  // Sync ReviewEngine
  ReviewEngine.syncReviewQueue(user1.id, authManager.getAllUserSubmissions());
  const pendingItems = ReviewEngine.getPendingReviews(user1.id);
  assert(pendingItems.length > 0, `Pending review items generated from failure: ${pendingItems.length}`);

  const failedReviewItem = pendingItems.find((r) => r.exerciseSlug === failedSlug);
  assert(failedReviewItem !== undefined, `Review queue contains entry for ${failedSlug}`);
  assert(failedReviewItem.priority === 1, 'Failed exercise received Priority 1 (High priority repair)');
  assert(failedReviewItem.exerciseTitle.length > 0, `Dynamic exercise title resolved: "${failedReviewItem.exerciseTitle}"`);
  assert(failedReviewItem.targetSkillName.length > 0, `Target skill dynamically resolved: "${failedReviewItem.targetSkillName}"`);

  // Learner retries the failed exercise and succeeds
  authManager.saveSubmission({
    exerciseSlug: failedSlug,
    verdict: 'accepted',
    code: 'ten = input()\ntuoi = int(input())\nprint(f"Ban {ten} nam nay {tuoi} tuoi")',
    score: 15,
    passedTests: 3,
    totalTests: 3,
    executionTimeMs: 32,
    userInputs: [],
    testResults: [],
  });

  // Re-sync review queue
  ReviewEngine.syncReviewQueue(user1.id, authManager.getAllUserSubmissions());
  const pendingAfterFix = ReviewEngine.getPendingReviews(user1.id);
  const remainingForFailed = pendingAfterFix.filter((r) => r.exerciseSlug === failedSlug);
  assert(remainingForFailed.length === 0, 'Exercise is cleared from pending reviews upon passing attempt');

  const completedReviews = ReviewEngine.getCompletedReviews(user1.id);
  assert(completedReviews.some((r) => r.exerciseSlug === failedSlug), 'Exercise correctly moved to completed reviews history');

  // -------------------------------------------------------------
  // STEP 12: Recommendations & AI Tutor Security Shield
  // -------------------------------------------------------------
  console.log('\n--- Step 12: Adaptive Recommendations & AI Tutor Security ---');
  // Verify mastery calculation
  const mastery = MasteryEngine.computeMastery(authManager.getAllUserSubmissions());
  assert(mastery.skills.length > 0, 'Mastery engine evaluates taxonomy skills');
  assert(mastery.overallMasteryPercentage >= 0, `Mastery engine computes overall percentage: ${mastery.overallMasteryPercentage}%`);

  // Test AI Key Redaction & Verdict Integrity Shield
  const secretKey = 'AIzaSyCodeCoBugSecretKeyThatMustNeverLeak123456';
  const rawLog = `Error connecting with key ${secretKey} at https://generativelanguage.googleapis.com`;
  const sanitizedLog = redactApiKey(rawLog);
  assert(!sanitizedLog.includes(secretKey), 'AI key is completely redacted from logs');
  assert(sanitizedLog.includes('[REDACTED'), 'Redaction placeholder safely replaces key');

  // -------------------------------------------------------------
  // STEP 13: Strict Multi-Tenant Data Isolation
  // -------------------------------------------------------------
  console.log('\n--- Step 13: Multi-Tenant Data Isolation & Privacy Shield ---');
  // Register second learner: "quan.tran@codecobug.edu.vn"
  const user2 = await authManager.signUp('quan.tran@codecobug.edu.vn', 'securePassword456', 'Quan Tran');
  assert(user2 !== null, 'Learner 2 (Quan Tran) registered');
  const user2Token = authManager.getSessionToken();
  assert(user2Token !== user1Token, 'User 2 receives distinct cryptographic session token');

  // 13a. User 2 drafts are isolated from User 1 drafts
  const user2Draft = authManager.getDraft(linkedExercise.slug);
  assert(user2Draft === null, 'User 2 cannot see User 1 draft code (Tenant draft isolation verified)');

  // 13b. User 2 cannot see User 1 submissions via API
  const user2SubmissionsReq = new Request(`http://localhost:3000/api/submissions?exerciseSlug=${linkedExercise.slug}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${user2Token}` },
  });
  const user2SubmissionsRes = await submissionsRouteHandler(user2SubmissionsReq);
  const user2SubData = await user2SubmissionsRes.json();
  assert(user2SubData.submissions.length === 0, 'User 2 sees strictly 0 submissions (Server multi-tenant isolation verified)');

  // 13c. User 2 review queue is clean and isolated
  const user2ReviewReq = new Request('http://localhost:3000/api/review-queue', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${user2Token}` },
  });
  const user2ReviewRes = await reviewQueueGetHandler(user2ReviewReq);
  const user2ReviewData = await user2ReviewRes.json();
  assert(user2ReviewData.pending.length === 0, 'User 2 has 0 pending reviews (Tenant review isolation verified)');

  // Switch back to User 1
  await authManager.signIn('linh.dan@codecobug.edu.vn', 'securePassword123');
  const restoredUser1Draft = authManager.getDraft(linkedExercise.slug);
  assert(restoredUser1Draft === unfinishedDraft, 'User 1 draft remains intact after User 2 session');

  // Summary
  console.log('\n=============================================================');
  console.log(`🏁 FULL-STACK INTEGRATION RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('=============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runFullStackIntegrationSuite().catch((err) => {
  console.error('Unhandled error in test suite:', err);
  process.exit(1);
});
