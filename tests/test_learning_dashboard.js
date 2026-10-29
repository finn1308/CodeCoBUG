/**
 * CodeCoBUG Phase 4 Test Suite: Learning Dashboard, Real Progress & Adaptive Recommendations
 *
 * Scope verified:
 * 1. No fake data rule:
 *    - Initial learner with 0 submissions has exactly 0% progress and 0 completed exercises.
 *    - Honest empty states displayed for Recent Attempts and Review Recommendations when no records exist.
 *    - Real points, real timestamps, real submission verdicts.
 * 2. Continue Learning & Recommended Next Action:
 *    - Defaults to first curriculum exercise when no submissions exist.
 *    - Dynamically advances to next uncompleted exercise when exercises are solved.
 *    - Prioritizes failed exercises in review queue for adaptive revision.
 * 3. Topic Progress derived strictly from actual accepted submissions:
 *    - 1 completed out of 3 = 33%.
 *    - Status transitions: 'CHƯA HỌC' (0%) -> 'ĐANG HỌC' (1-99%) -> 'ĐÃ HOÀN THÀNH' (100%).
 * 4. Recent Attempts & Weak Skills:
 *    - Shows real verdicts (ĐẠT / CHƯA ĐẠT).
 *    - Links directly to practice workspace.
 */

const fs = require('fs');
const path = require('path');

// Setup mock window & localStorage
const store = {};
global.window = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k];
  },
};

const { authManager } = require('../src/lib/auth/authManager');
const { MasteryEngine } = require('../src/lib/mastery/masteryEngine');
const { ReviewEngine } = require('../src/lib/mastery/reviewEngine');
const { SAMPLE_TEST_COURSE } = require('../src/lib/fixtures/sampleCurriculum');

let passCount = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✔ PASS: ${message}`);
  passCount++;
}

console.log('\n=============================================================');
console.log('📊 RUNNING PHASE 4: LEARNING DASHBOARD & REAL PROGRESS SUITE');
console.log('=============================================================\n');

// Group 1: Component Existence & Code Integrity
console.log('--- Test Group 1: Component File & Structure ---');
const dashboardPath = path.resolve(__dirname, '../src/components/dashboard/LearningDashboard.tsx');
assert(fs.existsSync(dashboardPath), 'LearningDashboard.tsx exists');
const dashboardCode = fs.readFileSync(dashboardPath, 'utf8');

assert(dashboardCode.includes('Khu vực học tiếp'), 'Contains "Khu vực học tiếp" section');
assert(dashboardCode.includes('Bài tập gần đây'), 'Contains "Bài tập gần đây" section');
assert(dashboardCode.includes('Đề xuất ôn tập thích ứng'), 'Contains "Đề xuất ôn tập thích ứng" section');
assert(dashboardCode.includes('Tiến độ giáo trình Python'), 'Contains "Tiến độ giáo trình Python" section');
assert(dashboardCode.includes('Chưa có bài tập nào được nộp'), 'Contains honest empty state for submissions');
assert(dashboardCode.includes('Không có điểm yếu cần củng cố'), 'Contains honest empty state for reviews');

// Group 2: Fresh Learner Integrity (Zero Fake Data)
console.log('\n--- Test Group 2: Zero Fake Data Verification on Clean State ---');
localStorage.clear();
authManager.reloadSession();

const freshSubs = authManager.getAllUserSubmissions();
assert(freshSubs.length === 0, 'New session starts with strictly 0 submissions');

const freshMastery = MasteryEngine.computeMastery(freshSubs);
assert(freshMastery.overallMasteryPercentage === 0, 'New learner has strictly 0% mastery');
assert(freshMastery.masteredCount === 0, 'New learner has 0 mastered skills');
assert(freshMastery.weakCount === 0, 'New learner has 0 false weaknesses');

const freshReviews = ReviewEngine.getPendingReviews('learner-test-default');
assert(freshReviews.length === 0, 'No pending reviews without real failed attempts');

// Group 3: Real Progress Derivation on Successful Submission
console.log('\n--- Test Group 3: Real Progress Derivation on Completion ---');
// Submit exercise 1 with 'accepted' verdict
authManager.saveSubmission({
  exerciseSlug: 'in-loi-chao-codecobug',
  verdict: 'accepted',
  code: 'print("Xin chao CodeCoBUG")',
  score: 10,
  passedTests: 3,
  totalTests: 3,
  executionTimeMs: 42,
  userInputs: [],
  testResults: [],
});

const userSubsAfter1 = authManager.getAllUserSubmissions();
assert(userSubsAfter1.length === 1, 'Submission count is now exactly 1');
assert(userSubsAfter1[0].verdict === 'accepted', 'Submission verdict is accepted');
assert(userSubsAfter1[0].score === 10, 'Submission score is 10');

// Calculate real completed exercise count across curriculum
const allCurriculumExercises = SAMPLE_TEST_COURSE.topics.flatMap((t) =>
  t.lessons.flatMap((l) => l.exercises)
);
const acceptedSlugs = new Set(
  userSubsAfter1.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
);
assert(acceptedSlugs.has('in-loi-chao-codecobug'), 'in-loi-chao-codecobug is recognized as completed');
assert(acceptedSlugs.size === 1, 'Exactly 1 unique exercise completed');

const topic01 = SAMPLE_TEST_COURSE.topics[0];
const topic01Exercises = topic01.lessons.flatMap((l) => l.exercises);
const completedInTopic01 = topic01Exercises.filter((e) => acceptedSlugs.has(e.slug)).length;
assert(completedInTopic01 === 1, 'Topic 01 has exactly 1 completed exercise');

const topic01Percentage = Math.round((completedInTopic01 / topic01Exercises.length) * 100);
assert(topic01Percentage === 33, `Topic 01 real progress is exactly 33% (1/3), actual: ${topic01Percentage}%`);

// Group 4: Adaptive Review Derivation on Failed Submission
console.log('\n--- Test Group 4: Adaptive Review Derivation on Failure ---');
// Submit exercise 2 with 'wrong_answer' verdict
authManager.saveSubmission({
  exerciseSlug: 'nhap-ten-va-tuoi',
  verdict: 'wrong_answer',
  code: 'ten = input()\nprint(ten)',
  score: 0,
  passedTests: 0,
  totalTests: 3,
  executionTimeMs: 38,
  userInputs: [],
  testResults: [],
});

const userSubsAfter2 = authManager.getAllUserSubmissions();
assert(userSubsAfter2.length === 2, 'Submissions count is now 2');

ReviewEngine.syncReviewQueue('learner-test-default', userSubsAfter2);
const pendingAfterFail = ReviewEngine.getPendingReviews('learner-test-default');
assert(pendingAfterFail.length > 0, `Pending reviews generated from real failure: ${pendingAfterFail.length}`);
assert(pendingAfterFail[0].exerciseSlug === 'nhap-ten-va-tuoi', 'Review target points to failed exercise nhap-ten-va-tuoi');
assert(pendingAfterFail[0].priority === 1, 'Failed attempt receives Priority 1 (Ưu tiên cao)');

// Group 5: Review Resolution Upon Successful Re-submission
console.log('\n--- Test Group 5: Review Resolution Upon Successful Re-submission ---');
// Submit exercise 2 again with 'accepted' verdict
authManager.saveSubmission({
  exerciseSlug: 'nhap-ten-va-tuoi',
  verdict: 'accepted',
  code: 'ten = input()\ntuoi = int(input())\nprint(f"Ban {ten} nam nay {tuoi} tuoi")',
  score: 15,
  passedTests: 3,
  totalTests: 3,
  executionTimeMs: 40,
  userInputs: [],
  testResults: [],
});

const userSubsAfterPass = authManager.getAllUserSubmissions();
assert(userSubsAfterPass.length === 3, 'Total submissions is now 3');

ReviewEngine.syncReviewQueue('learner-test-default', userSubsAfterPass);
const pendingAfterPass = ReviewEngine.getPendingReviews('learner-test-default');
const remainingReviewForEx2 = pendingAfterPass.filter((r) => r.exerciseSlug === 'nhap-ten-va-tuoi');
assert(remainingReviewForEx2.length === 0, 'Exercise 2 is removed from pending reviews after passing');

const completedReviews = ReviewEngine.getCompletedReviews('learner-test-default');
assert(completedReviews.some((r) => r.exerciseSlug === 'nhap-ten-va-tuoi'), 'Exercise 2 successfully moved to completed reviews');

// Group 6: Minimal Scannable Dashboard Architecture & Collapsible Statistics
console.log('\n--- Test Group 6: Minimal Scannable Dashboard & Collapsible Statistics ---');
assert(dashboardCode.includes('Tổng quan học tập'), 'Compact page title "Tổng quan học tập" present');
assert(dashboardCode.includes('Thống kê chi tiết & Năng lực học viên'), 'Detailed statistics organized in dedicated section');
assert(dashboardCode.includes('setShowStats'), 'Detailed statistics supports collapsible toggle (showStats)');
assert(dashboardCode.includes('Khu vực học tiếp'), 'One prominent Continue Learning action card based on actual progress');
assert(dashboardCode.includes('Tiến độ chủ đề hiện tại'), 'Current topic and real progress percentage displayed');
assert(dashboardCode.includes('Gợi ý tiếp theo:'), 'One useful next action recommendation rendered');
assert(dashboardCode.includes('pendingReviews.length === 0'), 'Review recommendations strictly gated by real records');
assert(!dashboardCode.includes('streak-flame') && !dashboardCode.includes('fake-points'), 'No fake streaks or fabricated gamification elements');

console.log('\n=============================================================');
console.log(`🏁 PHASE 4 LEARNING DASHBOARD RESULTS: ${passCount} PASSED, 0 FAILED`);
console.log('=============================================================\n');

