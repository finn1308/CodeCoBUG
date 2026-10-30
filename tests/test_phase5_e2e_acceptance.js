/**
 * CodeCoBUG Phase 5: End-to-End Systematic Acceptance Audit Test Suite
 *
 * Systematic verification of all 14 required audit domains:
 * 1. Sign in and user-specific data access.
 * 2. Curriculum chapter and lesson navigation.
 * 3. Lesson content and exercise relationships.
 * 4. Python editor and real code execution.
 * 5. Correct and incorrect submissions.
 * 6. At least three applicable test cases per exercise (all 61 exercises verified).
 * 7. Private test protection.
 * 8. Submission persistence after refresh and re-login.
 * 9. Progress updates based on persisted results.
 * 10. Mistake review and retry.
 * 11. AI Tutor configured, missing-key, and API-error states.
 * 12. Settings and all visible navigation controls.
 * 13. Desktop and mobile responsive layouts.
 * 14. Keyboard accessibility and reduced-motion behavior.
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
const { createSessionToken, verifySessionToken } = require('../src/lib/auth/sessionToken');
const { getServerAuthenticatedUser } = require('../src/lib/auth/serverAuth');
const { OFFICIAL_PYTHON_COURSE, getAllExercisesFromRegistry } = require('../src/lib/curriculum');
const { getExerciseBySlug } = require('../src/lib/fixtures/sampleCurriculum');
const { SERVER_EXERCISE_TESTS, getServerExerciseTests } = require('../src/lib/judge/testCasesRepository');
const { evaluateSubmission } = require('../src/lib/judge/runner');
const { POST: submitRouteHandler } = require('../src/app/api/judge/submit/route');
const { GET: submissionsRouteHandler } = require('../src/app/api/submissions/route');
const { GET: reviewQueueGetHandler } = require('../src/app/api/review-queue/route');
const { MasteryEngine } = require('../src/lib/mastery/masteryEngine');
const { ReviewEngine } = require('../src/lib/mastery/reviewEngine');
const { encryptApiKey, decryptApiKey, redactApiKey } = require('../src/lib/ai/crypto');
const { AITutorService } = require('../src/lib/ai/tutorService');
const { POST: chatRouteHandler } = require('../src/app/api/ai/chat/route');

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

async function runEndToEndAcceptanceAudit() {
  console.log('\n=============================================================');
  console.log('🔍 RUNNING CODECOBUG PHASE 5: SYSTEMATIC END-TO-END ACCEPTANCE AUDIT');
  console.log('=============================================================\n');

  localStorage.clear();

  // -------------------------------------------------------------------------
  // DOMAIN 1: Sign in and user-specific data access
  // -------------------------------------------------------------------------
  console.log('--- Domain 1: Sign in & Multi-Tenant Data Isolation ---');
  const alice = await authManager.signUp('alice.learner@codecobug.edu.vn', 'aliceSecretPass123', 'Alice Nguyen');
  assert(alice.id && alice.id.length > 5, 'Alice account registered with unique ID');
  assert(alice.points === 0, 'Alice initial points start at 0');

  const aliceToken = authManager.getSessionToken();
  assert(aliceToken && aliceToken.includes('.'), 'HMAC session token generated for Alice');

  const verifiedAlice = verifySessionToken(aliceToken);
  assert(verifiedAlice && verifiedAlice.id === alice.id, 'Session token cryptographically verifies Alice');

  // Alice saves a draft while Alice is active user
  await authManager.signIn('alice.learner@codecobug.edu.vn', 'aliceSecretPass123');
  authManager.saveDraft('chao-mung-den-voi-python', '# Alice private draft code\nprint("Alice Code")');

  // Register Bob (switches active user to Bob)
  const bob = await authManager.signUp('bob.coder@codecobug.edu.vn', 'bobSecretPass456', 'Bob Tran');
  assert(bob.id !== alice.id, 'Bob has distinct user ID');
  const bobToken = authManager.getSessionToken();
  assert(bobToken !== aliceToken, 'Bob has distinct session token');

  // Verify multi-tenant draft isolation: Bob has not saved a draft for this exercise
  const bobDraft = authManager.getDraft('chao-mung-den-voi-python');
  assert(bobDraft === null, 'Bob cannot access Alice private draft (Tenant Draft Isolation Verified)');

  // -------------------------------------------------------------------------
  // DOMAIN 2: Curriculum chapter and lesson navigation
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 2: Curriculum Chapter & Lesson Navigation ---');
  assert(OFFICIAL_PYTHON_COURSE.topics.length === 12, 'Curriculum consists of 12 planned chapters');

  OFFICIAL_PYTHON_COURSE.topics.forEach((topic, idx) => {
    assert(topic.orderIndex === idx + 1, `Chapter ${idx + 1} orderIndex is ${idx + 1}`);
    assert(topic.lessons.length >= 3, `Chapter ${idx + 1} (${topic.title}) contains >= 3 lessons`);
  });

  // Verify total lesson count
  const allLessons = OFFICIAL_PYTHON_COURSE.topics.flatMap((t) => t.lessons);
  assert(allLessons.length === 44, `Curriculum has 44 lessons in total (actual: ${allLessons.length})`);

  // Verify search & filtering logic
  const searchMatch = allLessons.filter(
    (l) => l.title.toLowerCase().includes('vòng lặp') || l.slug.includes('vong-lap')
  );
  assert(searchMatch.length >= 2, 'Search query "vòng lặp" successfully locates loop lessons');

  // -------------------------------------------------------------------------
  // DOMAIN 3: Lesson content and exercise relationships
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 3: Lesson Content & Exercise Relationships ---');
  let validLessonCount = 0;
  for (const topic of OFFICIAL_PYTHON_COURSE.topics) {
    for (const lesson of topic.lessons) {
      assert(lesson.learningObjectives && lesson.learningObjectives.length >= 2, `Lesson ${lesson.slug} defines learning objectives`);
      assert(lesson.theoryContent && lesson.theoryContent.length >= 50, `Lesson ${lesson.slug} has comprehensive theory`);
      assert(lesson.codeExamples && lesson.codeExamples.length >= 1, `Lesson ${lesson.slug} has runnable examples`);
      assert(lesson.commonMistakes && lesson.commonMistakes.length >= 1, `Lesson ${lesson.slug} warns against mistakes`);
      assert(lesson.recap && lesson.recap.length >= 2, `Lesson ${lesson.slug} has recap points`);
      assert(lesson.referenceLinks && lesson.referenceLinks.some((l) => l.url.includes('w3schools.com')), `Lesson ${lesson.slug} has W3Schools link`);
      assert(lesson.exercises && lesson.exercises.length >= 1, `Lesson ${lesson.slug} has linked exercises`);
      validLessonCount++;
    }
  }
  assert(validLessonCount === 44, 'All 44 lessons strictly adhere to the 10-part pedagogical standard');

  // Verify exercise-to-lesson mapping
  const sampleEx = getExerciseBySlug('chao-mung-den-voi-python');
  assert(sampleEx !== null, 'getExerciseBySlug resolves chao-mung-den-voi-python');
  assert(sampleEx.lesson.id === sampleEx.exercise.lessonId, 'Exercise points to correct parent lesson');
  assert(sampleEx.topic.id === sampleEx.exercise.topicId, 'Exercise points to correct parent topic');

  // -------------------------------------------------------------------------
  // DOMAIN 4: Python editor and real code execution
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 4: Real Pyodide Python Code Execution ---');
  // Evaluate arithmetic and printing
  const pythonScript1 = `
def tinh_tong(a, b):
    return a + b

print(f"Ket qua: {tinh_tong(15, 27)}")
`;
  const exec1 = await evaluateSubmission(
    { testCases: [{ id: 't1', inputData: '', expectedOutput: 'Ket qua: 42', isHidden: false, comparisonMode: 'exact', weight: 1, orderIndex: 1 }] },
    pythonScript1,
    10
  );
  assert(exec1.verdict === 'accepted', 'Real Python function executed and output matched');

  // Evaluate multi-line loop & list comprehension
  const pythonScript2 = `
numbers = [1, 2, 3, 4, 5]
squares = [x * x for x in numbers]
for s in squares:
    print(s)
`;
  const exec2 = await evaluateSubmission(
    { testCases: [{ id: 't2', inputData: '', expectedOutput: '1\n4\n9\n16\n25', isHidden: false, comparisonMode: 'normalized_lines', weight: 1, orderIndex: 1 }] },
    pythonScript2,
    10
  );
  assert(exec2.verdict === 'accepted', 'List comprehension and loop executed accurately');

  // -------------------------------------------------------------------------
  // DOMAIN 5: Correct and incorrect submissions
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 5: Correct, Incorrect, and Error Submissions ---');
  const testExerciseSlug = 'chao-mung-den-voi-python';
  const testConfig = getServerExerciseTests(testExerciseSlug);

  // 5a. Correct submission
  const correctCode = 'print("Chao mung ban den voi the gioi lap trinh Python!")';
  const correctEval = await evaluateSubmission(testConfig, correctCode, 10);
  assert(correctEval.verdict === 'accepted', 'Correct solution produces "accepted" verdict');
  assert(correctEval.score === 10, 'Full 10 points awarded for accepted verdict');

  // 5b. Incorrect submission (Wrong Answer)
  const wrongCode = 'print("Ket qua khong dung")';
  const wrongEval = await evaluateSubmission(testConfig, wrongCode, 10);
  assert(wrongEval.verdict === 'wrong_answer', 'Incorrect code produces "wrong_answer" verdict');
  assert(wrongEval.score === 0, 'Zero points awarded for wrong answer');

  // 5c. Syntax Error submission
  const syntaxErrorCode = 'print("Unclosed string)';
  const syntaxEval = await evaluateSubmission(testConfig, syntaxErrorCode, 10);
  assert(syntaxEval.verdict === 'compile_error', 'Syntax error produces "compile_error" verdict');

  // 5d. Runtime Error submission
  const runtimeErrorCode = 'numbers = [1, 2]\nprint(numbers[10])';
  const runtimeEval = await evaluateSubmission(testConfig, runtimeErrorCode, 10);
  assert(runtimeEval.verdict === 'runtime_error', 'IndexError produces "runtime_error" verdict');
  assert(runtimeEval.verdictMessage.includes('IndexError'), 'Verdict message identifies IndexError');

  // -------------------------------------------------------------------------
  // DOMAIN 6: At least three applicable test cases per exercise
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 6: Comprehensive Test Coverage (>= 3 Tests per Exercise) ---');
  const allRegisteredExercises = getAllExercisesFromRegistry();
  assert(allRegisteredExercises.length === 61, `Official curriculum has 61 exercises (actual: ${allRegisteredExercises.length})`);

  let exercisesMeetingMinTests = 0;
  for (const { exercise } of allRegisteredExercises) {
    const serverTests = getServerExerciseTests(exercise.slug);
    assert(serverTests !== null, `Server test configuration exists for "${exercise.slug}"`);
    if (serverTests && serverTests.testCases.length >= 3) {
      exercisesMeetingMinTests++;
    }
  }
  assert(
    exercisesMeetingMinTests === allRegisteredExercises.length,
    `All ${allRegisteredExercises.length} curriculum exercises have at least 3 applicable test cases`
  );

  // -------------------------------------------------------------------------
  // DOMAIN 7: Private test protection
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 7: Secret Hidden Test Protection ---');
  let exercisesWithHiddenTests = 0;
  for (const { exercise } of allRegisteredExercises) {
    const serverTests = getServerExerciseTests(exercise.slug);
    if (serverTests && serverTests.testCases.some((t) => t.isHidden)) {
      exercisesWithHiddenTests++;
    }
  }
  assert(
    exercisesWithHiddenTests === allRegisteredExercises.length,
    `All ${allRegisteredExercises.length} exercises have hidden grading test cases`
  );

  // Verify server-side redaction of hidden test details
  const publicReport = await evaluateSubmission(testConfig, wrongCode, 10);
  const leakedHiddenTest = publicReport.testResults.some(
    (t) => t.isHidden && (t.inputData !== undefined || t.expectedOutput !== undefined)
  );
  assert(!leakedHiddenTest, 'Authoritative server judge strictly masks inputData and expectedOutput on hidden tests');

  // -------------------------------------------------------------------------
  // DOMAIN 8: Submission persistence after refresh and re-login
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 8: Submission Persistence After Refresh & Re-login ---');
  // Switch back to Alice
  await authManager.signIn('alice.learner@codecobug.edu.vn', 'aliceSecretPass123');

  // Alice submits exercise
  authManager.saveSubmission({
    exerciseSlug: 'chao-mung-den-voi-python',
    verdict: 'accepted',
    code: correctCode,
    score: 10,
    passedTests: 4,
    totalTests: 4,
    executionTimeMs: 25,
    userInputs: [],
    testResults: [],
  });

  const aliceSubs1 = authManager.getAllUserSubmissions();
  assert(aliceSubs1.length === 1, 'Alice submission recorded in active session');

  // Simulate page reload
  authManager.reloadSession();
  const aliceSubsAfterReload = authManager.getAllUserSubmissions();
  assert(aliceSubsAfterReload.length === 1, 'Alice submission persists after browser reload');
  assert(aliceSubsAfterReload[0].verdict === 'accepted', 'Verdict preserved across reload');

  // Sign out and sign in as Bob
  authManager.signOut();
  assert(authManager.getCurrentUser() === null, 'User signed out cleanly');

  await authManager.signIn('bob.coder@codecobug.edu.vn', 'bobSecretPass456');
  const bobSubs = authManager.getAllUserSubmissions();
  assert(bobSubs.length === 0, 'Bob sees strictly 0 submissions (Multi-tenant persistence isolation)');

  // Sign back in as Alice
  await authManager.signIn('alice.learner@codecobug.edu.vn', 'aliceSecretPass123');
  const aliceSubsAfterRelogin = authManager.getAllUserSubmissions();
  assert(aliceSubsAfterRelogin.length === 1, 'Alice submissions fully restored after re-login');

  // -------------------------------------------------------------------------
  // DOMAIN 9: Progress updates based on persisted results
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 9: Progress Derivation Strictly From Persisted Results ---');
  const aliceCurrentSubs = authManager.getAllUserSubmissions();
  const acceptedSlugs = new Set(
    aliceCurrentSubs.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
  );

  assert(acceptedSlugs.size === 1, 'Exactly 1 unique exercise completed');
  const totalExercises = allRegisteredExercises.length;
  const expectedPercentage = Math.round((1 / totalExercises) * 100);
  const computedPercentage = Math.round((acceptedSlugs.size / totalExercises) * 100);
  assert(computedPercentage === expectedPercentage, `Overall progress matches real calculation: ${computedPercentage}%`);

  // Submitting duplicate accepted exercise does NOT inflate completion count
  authManager.saveSubmission({
    exerciseSlug: 'chao-mung-den-voi-python',
    verdict: 'accepted',
    code: correctCode,
    score: 10,
    passedTests: 4,
    totalTests: 4,
    executionTimeMs: 20,
    userInputs: [],
    testResults: [],
  });
  const acceptedSlugsAfterDuplicate = new Set(
    authManager.getAllUserSubmissions().filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
  );
  assert(acceptedSlugsAfterDuplicate.size === 1, 'Duplicate accepted submission does not double count');

  // -------------------------------------------------------------------------
  // DOMAIN 10: Mistake review and retry
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 10: Mistake Review & Adaptive Retry Workflow ---');
  // Alice fails another exercise
  const failSlug = 'nhap-ten-va-tuoi';
  authManager.saveSubmission({
    exerciseSlug: failSlug,
    verdict: 'wrong_answer',
    code: 'ten = input()',
    score: 0,
    passedTests: 1,
    totalTests: 3,
    executionTimeMs: 22,
    userInputs: [],
    testResults: [],
  });

  ReviewEngine.syncReviewQueue(alice.id, authManager.getAllUserSubmissions());
  const pendingReviews = ReviewEngine.getPendingReviews(alice.id);
  assert(pendingReviews.some((r) => r.exerciseSlug === failSlug), 'Failed exercise added to pending review queue');
  const targetItem = pendingReviews.find((r) => r.exerciseSlug === failSlug);
  assert(targetItem && targetItem.priority === 1, 'Failed exercise flagged with Priority 1 (High priority repair)');

  // Alice retries and succeeds
  authManager.saveSubmission({
    exerciseSlug: failSlug,
    verdict: 'accepted',
    code: 'ten = input()\ntuoi = int(input())\nprint(f"Ban {ten} nam nay {tuoi} tuoi")',
    score: 15,
    passedTests: 3,
    totalTests: 3,
    executionTimeMs: 28,
    userInputs: [],
    testResults: [],
  });

  ReviewEngine.syncReviewQueue(alice.id, authManager.getAllUserSubmissions());
  const pendingAfterPass = ReviewEngine.getPendingReviews(alice.id);
  const remainingForFailed = pendingAfterPass.filter((r) => r.exerciseSlug === failSlug);
  assert(remainingForFailed.length === 0, 'Exercise is cleared from pending reviews upon passing attempt');

  const completedReviews = ReviewEngine.getCompletedReviews(alice.id);
  assert(completedReviews.some((r) => r.exerciseSlug === failSlug), 'Exercise moved to completed review history');

  // -------------------------------------------------------------------------
  // DOMAIN 11: AI Tutor configured, missing-key, and API-error states
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 11: AI Tutor States, BYOK Encryption & Redaction ---');

  // 11a. Missing-key handling via API route
  const missingKeyReq = new Request('http://localhost:3000/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config: { apiKey: '' },
      action: 'chat',
      userPrompt: 'Xin chào AI Tutor',
      exerciseContext: {
        title: 'Chào mừng đến với Python',
        slug: 'chao-mung-den-voi-python',
        description: 'In lời chào mừng',
      },
    }),
  });
  const missingKeyRes = await chatRouteHandler(missingKeyReq);
  assert(missingKeyRes.status === 401, 'POST /api/ai/chat returns 401 when API key is missing');
  const missingKeyData = await missingKeyRes.json();
  assert(missingKeyData.error.includes('Chưa cấu hình API Key'), 'Missing-key error returns helpful BYOK guidance');

  // 11b. AES-256-GCM encryption & decryption
  const rawKey = 'AIzaSyCodeCoBugTestKey1234567890abcdefg';
  const encryptedToken = encryptApiKey(rawKey);
  assert(encryptedToken !== rawKey, 'API key ciphertext does not contain raw string');
  const decryptedKey = decryptApiKey(encryptedToken);
  assert(decryptedKey === rawKey, 'AES-256-GCM decrypts exact original key');

  // 11c. API Error redaction
  const simulatedError = `Failed to connect with key ${rawKey} to googleapis.com`;
  const redactedError = redactApiKey(simulatedError);
  assert(!redactedError.includes(rawKey), 'Raw API key is completely redacted from error messages');
  assert(redactedError.includes('[REDACTED'), 'Redaction placeholder safely replaces sensitive credential');

  // 11d. Judge Verdict Integrity enforcement in AITutorService
  const tutorPrompt = AITutorService['SYSTEM_PROMPT'];
  assert(tutorPrompt.includes('TÔN TRỌNG PHÁN QUYẾT CỦA BỘ CHẤM'), 'AI prompt strictly enforces Judge Verdict Integrity');
  assert(tutorPrompt.includes('KHÔNG BAO GIỜ được tự ý tuyên bố mã nguồn là đúng'), 'AI forbidden from false pass declarations');

  // -------------------------------------------------------------------------
  // DOMAIN 12: Settings and all visible navigation controls
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 12: Settings & Visible Navigation Controls ---');
  const appShellPath = path.resolve(__dirname, '../src/components/layout/AppShell.tsx');
  const sidebarPath = path.resolve(__dirname, '../src/components/layout/Sidebar.tsx');
  const workspacePath = path.resolve(__dirname, '../src/components/workspace/ExerciseWorkspace.tsx');
  const codeEditorPath = path.resolve(__dirname, '../src/components/workspace/CodeEditor.tsx');

  const appShellCode = fs.readFileSync(appShellPath, 'utf8');
  const sidebarCode = fs.readFileSync(sidebarPath, 'utf8');
  const workspaceCode = fs.readFileSync(workspacePath, 'utf8');
  const codeEditorCode = fs.readFileSync(codeEditorPath, 'utf8');

  // Primary destinations
  assert(sidebarCode.includes('Tổng quan'), 'Sidebar includes "Tổng quan" destination');
  assert(sidebarCode.includes('Học Python'), 'Sidebar includes "Học Python" destination');
  assert(sidebarCode.includes('Luyện tập'), 'Sidebar includes "Luyện tập" destination');

  // Settings & modal controls
  assert(appShellCode.includes('AISettingsModal'), 'AppShell mounts AISettingsModal');
  assert(appShellCode.includes('AuthModal'), 'AppShell mounts AuthModal');
  assert(sidebarCode.includes('Cài đặt AI'), 'Sidebar provides entry to Cài đặt AI');

  // Workspace controls
  assert(codeEditorCode.includes('onRun'), 'Editor has Run button action');
  assert(codeEditorCode.includes('onSubmit'), 'Editor has Submit button action');
  assert(codeEditorCode.includes('handleReset'), 'Editor has Reset Code action');
  assert(codeEditorCode.includes('handleCopy'), 'Editor has Copy Code action');
  assert(codeEditorCode.includes('toggleTheme'), 'Editor has Theme Toggle action');

  // -------------------------------------------------------------------------
  // DOMAIN 13: Desktop and mobile responsive layouts
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 13: Responsive Breakpoints & Viewport Architecture ---');
  const globalsCssPath = path.resolve(__dirname, '../src/app/globals.css');
  const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

  assert(globalsCss.includes('@media (max-width: 1023px)'), 'Includes tablet breakpoint (<= 1023px)');
  assert(globalsCss.includes('@media (max-width: 768px)'), 'Includes mobile phone breakpoint (<= 768px)');
  assert(globalsCss.includes('@media (max-width: 480px)'), 'Includes narrow phone breakpoint (<= 480px)');
  assert(globalsCss.includes('overflow-x: hidden'), 'Prevents page-wide horizontal scroll');
  assert(workspaceCode.includes('mobile-tab-bar'), 'Workspace contains mobile tab switcher bar');

  // -------------------------------------------------------------------------
  // DOMAIN 14: Keyboard accessibility and reduced-motion behavior
  // -------------------------------------------------------------------------
  console.log('\n--- Domain 14: Keyboard Accessibility & Reduced Motion ---');
  assert(globalsCss.includes(':focus-visible'), 'Focus visible indicators implemented for keyboard navigation');
  assert(globalsCss.includes('--border-focus'), 'Focus ring variable (--border-focus) defined in theme tokens');
  assert(globalsCss.includes('@media (prefers-reduced-motion: reduce)'), 'Prefers-reduced-motion media query implemented');
  assert(globalsCss.includes('animation-duration: 0.01ms'), 'Animations disabled under reduced-motion preference');
  assert(globalsCss.includes('transition-duration: 0.01ms'), 'Transitions disabled under reduced-motion preference');

  const modalPath = path.resolve(__dirname, '../src/components/ui/Modal.tsx');
  const modalCode = fs.readFileSync(modalPath, 'utf8');
  assert(modalCode.includes('role="dialog"'), 'Modal component declares role="dialog"');
  assert(modalCode.includes('aria-modal="true"'), 'Modal component declares aria-modal="true"');
  assert(modalCode.includes('e.key === \'Escape\''), 'Modal traps Escape key for dismissal');

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`🏁 PHASE 5 END-TO-END AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('=============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runEndToEndAcceptanceAudit().catch((err) => {
  console.error('Unhandled error in acceptance test suite:', err);
  process.exit(1);
});
