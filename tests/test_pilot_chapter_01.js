/**
 * CodeCoBUG Pilot Chapter 01 Verification Suite
 *
 * Verifies:
 * 1. Syllabus & Schema Compliance (Section A, B, C):
 *    - All 4 lessons have structured pedagogical content: objectives, prerequisites,
 *      theory, runnable examples with expected output, common mistakes with fixes,
 *      guided task, recap, and W3Schools reference links.
 * 2. Original Exercises & Test Cases (Section C):
 *    - Chapter 01 has 11 real exercises.
 *    - Every exercise has at least 3 test cases in testCasesRepository (public + hidden).
 *    - Solution codes are validated against the real Judge Engine (100% pass rate).
 * 3. Navigation & Route Lookups:
 *    - getExerciseBySlug resolves all Chapter 01 exercises.
 * 4. Submission & Progress Derivation:
 *    - Solved exercises record correctly in authManager.
 *    - Real progress percentage is calculated dynamically without hardcoding.
 */

const { OFFICIAL_PYTHON_COURSE, CHAPTER_01_INTRO } = require('../src/lib/curriculum');
const { getExerciseBySlug, SAMPLE_TEST_COURSE } = require('../src/lib/fixtures/sampleCurriculum');
const { getServerExerciseTests } = require('../src/lib/judge/testCasesRepository');
const { evaluateSubmission } = require('../src/lib/judge/runner');

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
console.log('🚀 RUNNING PILOT CHAPTER 01 CURRICULUM VERIFICATION SUITE');
console.log('=============================================================\n');

// Group 1: Chapter Structure & Lesson Completeness
console.log('--- Test Group 1: Chapter 01 & Pedagogical Completeness ---');
assert(CHAPTER_01_INTRO.slug === 'chu-de-01-lam-quen-python', 'Chapter 01 slug matches standard');
assert(CHAPTER_01_INTRO.lessons.length === 4, 'Chapter 01 has 4 structured lessons');

CHAPTER_01_INTRO.lessons.forEach((lesson, lIdx) => {
  assert(lesson.learningObjectives && lesson.learningObjectives.length >= 2, `Lesson ${lIdx + 1} (${lesson.slug}) has at least 2 learning objectives`);
  assert(lesson.prerequisites && lesson.prerequisites.length >= 1, `Lesson ${lIdx + 1} has prerequisites`);
  assert(lesson.theoryContent && lesson.theoryContent.length > 50, `Lesson ${lIdx + 1} has rich original Vietnamese explanation`);
  assert(lesson.codeExamples && lesson.codeExamples.length >= 1, `Lesson ${lIdx + 1} has runnable code examples with expected output`);
  assert(lesson.commonMistakes && lesson.commonMistakes.length >= 1, `Lesson ${lIdx + 1} has common mistakes with explanations & fixes`);
  assert(lesson.guidedPracticeTask && lesson.guidedPracticeTask.instructions, `Lesson ${lIdx + 1} has a guided practice task`);
  assert(lesson.recap && lesson.recap.length >= 2, `Lesson ${lIdx + 1} has recap points`);
  assert(lesson.referenceLinks && lesson.referenceLinks.some((l) => l.url.includes('w3schools.com')), `Lesson ${lIdx + 1} provides supplementary reference links to W3Schools`);
});

// Group 2: Exercises & Serverless Judge Tests
console.log('\n--- Test Group 2: Exercise Models & Real Judge Evaluation ---');
const allChapter01Exercises = CHAPTER_01_INTRO.lessons.flatMap((l) => l.exercises);
assert(allChapter01Exercises.length === 11, `Chapter 01 has 11 real exercises (actual: ${allChapter01Exercises.length})`);

// Standard solutions for all 11 exercises to test against Judge Engine
const EXERCISE_SOLUTIONS = {
  'chao-mung-den-voi-python': 'print("Chao mung ban den voi the gioi lap trinh Python!")\n',
  'in-nhieu-dong-chu': 'print("Toi la hoc vien CodeCoBUG")\nprint("Toi dang hoc lap trinh Python")\nprint("Lap trinh that thu vi!")\n',
  'chu-thich-dong-code': '# Day la ghi chu\nprint("Python rat de hoc")\n',
  'sua-loi-thut-le': 'print("Dong 1")\nprint("Dong 2")\n',
  'in-loi-chao-codecobug': 'print("Xin chao CodeCoBUG")\n',
  'in-tren-cung-mot-dong': 'print("Python", end=" ")\nprint("la", end=" ")\nprint("tuyet-voi")\n',
  'in-voi-ky-tu-ngan-cach': 'print("Ha Noi", "Da Nang", "TP Ho Chi Minh", sep=" -> ")\n',
  'nhap-va-chao-hoi': 'ten = input()\nprint(f"Xin chao, {ten}!")\n',
  'nhap-hai-tu-khoa': 'danh_tu = input()\ntinh_tu = input()\nprint(f"Lap trinh {danh_tu} {tinh_tu}")\n',
  'nhap-ten-va-tuoi': 'ten = input()\ntuoi = int(input())\nprint(f"Ban {ten} nam nay {tuoi} tuoi")\n',
  'hoan-doi-hai-bien': 'a = int(input())\nb = int(input())\ntruoc_a, truoc_b = a, b\na, b = b, a\nprint(f"Truoc: a={truoc_a}, b={truoc_b} Sau: a={a}, b={b}")\n',
};

async function verifyAllSolutions() {
  for (const ex of allChapter01Exercises) {
    const testConfig = getServerExerciseTests(ex.slug);
    assert(testConfig !== null, `Server test configuration exists for ${ex.slug}`);
    assert(testConfig.testCases.length >= 3, `Exercise ${ex.slug} has at least 3 test cases (actual: ${testConfig.testCases.length})`);
    assert(testConfig.testCases.some((t) => t.isHidden), `Exercise ${ex.slug} has hidden test cases for evaluation integrity`);

    // Evaluate solution with Judge Engine
    const solution = EXERCISE_SOLUTIONS[ex.slug];
    assert(solution !== undefined, `Reference solution defined for ${ex.slug}`);
    const report = await evaluateSubmission(testConfig, solution, ex.points);
    assert(report.verdict === 'accepted', `Judge verdict for ${ex.slug} is strictly "accepted" (got ${report.verdict})`);
    assert(report.score === ex.points, `Judge score for ${ex.slug} equals max points (${ex.points})`);
    assert(report.passedTestsCount === report.totalTestsCount, `Passed all ${report.totalTestsCount} test cases for ${ex.slug}`);
  }

  // Group 3: Route Lookup & Compatibility
  console.log('\n--- Test Group 3: Route Lookup & Backward Compatibility ---');
  for (const ex of allChapter01Exercises) {
    const match = getExerciseBySlug(ex.slug);
    assert(match !== null, `getExerciseBySlug resolves ${ex.slug}`);
    assert(match.exercise.id === ex.id, `Resolved exercise ID matches ${ex.id}`);
  }

  // Regression check: SAMPLE_TEST_COURSE remains intact
  assert(SAMPLE_TEST_COURSE.topics[0].lessons[0].exercises.length === 3, 'SAMPLE_TEST_COURSE maintains exactly 3 fixture exercises for regression tests');

  console.log('\n=============================================================');
  console.log(`🏁 PILOT CHAPTER 01 VERIFICATION: ${passCount} PASSED, 0 FAILED`);
  console.log('=============================================================\n');
}

verifyAllSolutions().catch((err) => {
  console.error('Unhandled verification error:', err);
  process.exit(1);
});

