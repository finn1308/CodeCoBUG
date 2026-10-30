/**
 * CodeCoBUG Batch 2 Verification Suite: Chapter 02 & Chapter 03
 *
 * Verifies:
 * 1. Syllabus & Schema Compliance (Section A, B, C):
 *    - Chapter 02 (Variables & Types) has 4 lessons & 8 exercises.
 *    - Chapter 03 (Arithmetic & Operators) has 4 lessons & 6 exercises.
 *    - Every lesson has structured objectives, prerequisites, theory, examples,
 *      common mistakes with fixes, guided task, recap, and W3Schools links.
 * 2. Exercise Models & Deterministic Judge Evaluation:
 *    - Every exercise has at least 3 test cases in testCasesRepository (public + hidden).
 *    - Solution codes are validated against the real Judge Engine (100% pass rate).
 * 3. Route Lookup & Navigation:
 *    - getExerciseBySlug resolves all Chapter 02 & 03 exercises.
 */

const { CHAPTER_02_VARIABLES, CHAPTER_03_OPERATORS } = require('../src/lib/curriculum');
const { getExerciseBySlug } = require('../src/lib/fixtures/sampleCurriculum');
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
console.log('⚡ RUNNING BATCH 2: CHAPTER 02 & 03 CURRICULUM VERIFICATION');
console.log('=============================================================\n');

// Group 1: Structure & Pedagogical Completeness
console.log('--- Test Group 1: Chapter 02 & 03 Pedagogical Completeness ---');
const chapters = [CHAPTER_02_VARIABLES, CHAPTER_03_OPERATORS];

chapters.forEach((chap) => {
  assert(chap.lessons.length === 4, `Chapter "${chap.title}" has 4 structured lessons`);
  chap.lessons.forEach((lesson, lIdx) => {
    assert(lesson.learningObjectives && lesson.learningObjectives.length >= 2, `${chap.slug} - Lesson ${lIdx + 1} (${lesson.slug}) has >= 2 objectives`);
    assert(lesson.prerequisites && lesson.prerequisites.length >= 1, `${lesson.slug} has prerequisites`);
    assert(lesson.theoryContent && lesson.theoryContent.length > 50, `${lesson.slug} has rich Vietnamese explanation`);
    assert(lesson.codeExamples && lesson.codeExamples.length >= 1, `${lesson.slug} has runnable examples with output`);
    assert(lesson.commonMistakes && lesson.commonMistakes.length >= 1, `${lesson.slug} has common mistakes & fixes`);
    assert(lesson.guidedPracticeTask && lesson.guidedPracticeTask.instructions, `${lesson.slug} has guided practice task`);
    assert(lesson.recap && lesson.recap.length >= 2, `${lesson.slug} has recap points`);
    assert(lesson.referenceLinks && lesson.referenceLinks.some((l) => l.url.includes('w3schools.com')), `${lesson.slug} links to W3Schools`);
  });
});

// Group 2: Reference Solutions & Real Judge Evaluation
console.log('\n--- Test Group 2: Real Judge Evaluation on All Exercises ---');
const BATCH_2_SOLUTIONS = {
  // Chapter 02
  'khai-bao-va-xuat-bien': 'ngon_ngu = "Python"\nnam_ra_doi = 1991\nprint(f"Ngon ngu: {ngon_ngu}")\nprint(f"Nam ra doi: {nam_ra_doi}")\n',
  'cap-nhat-gia-tri-bien': 'diem_so = 50\ndiem_cong = int(input())\ndiem_so = diem_so + diem_cong\nprint(f"Diem tong: {diem_so}")\n',
  'in-kieu-du-lieu': 'pi = 3.14159\nprint(type(pi))\n',
  'thong-tin-hoc-vien': 'ho_ten = "Le Anh"\ntuoi = 16\ndiem_tb = 8.75\nda_tot_nghiep = False\nprint(f"Ho ten: {ho_ten}")\nprint(f"Tuoi: {tuoi}")\nprint(f"Diem TB: {diem_tb}")\nprint(f"Tot nghiep: {da_tot_nghiep}")\n',
  'tinh-tong-hai-so-nguyen': 'a = int(input())\nb = int(input())\nprint(a + b)\n',
  'chuyen-doi-nhiet-do-c-sang-f': 'c = float(input())\nf = c * 1.8 + 32\nprint(round(f, 1))\n',
  'gan-ba-bien-cung-gia-tri': 'a = b = c = "Python"\nprint(f"a: {a}")\nprint(f"b: {b}")\nprint(f"c: {c}")\n',
  'tong-hai-so-cung-dong': 'a, b = map(int, input().split())\nprint(a + b)\n',

  // Chapter 03
  'phep-chia-lay-nguyen-va-du': 'a = int(input())\nb = int(input())\nprint(f"Phan nguyen: {a // b}")\nprint(f"Phan du: {a % b}")\n',
  'tinh-luy-thua-a-mu-b': 'a = int(input())\nb = int(input())\nprint(a ** b)\n',
  'kiem-tra-so-chan': 'n = int(input())\nprint(n % 2 == 0)\n',
  'kiem-tra-trong-khoang': 'x = int(input())\nprint(10 <= x <= 100)\n',
  'tinh-trung-binh-cong-ba-mon': 'toan = float(input())\nvan = float(input())\nanh = float(input())\ndtb = (toan + van + anh) / 3\nprint(round(dtb, 2))\n',
  'kiem-tra-tu-khoa-trong-chuoi': 'van_ban = input()\nprint("Python" in van_ban)\n',
};

async function verifyBatch2() {
  const allBatch2Exercises = chapters.flatMap((c) => c.lessons.flatMap((l) => l.exercises));
  assert(allBatch2Exercises.length === 14, `Batch 2 has exactly 14 exercises (actual: ${allBatch2Exercises.length})`);

  for (const ex of allBatch2Exercises) {
    const testConfig = getServerExerciseTests(ex.slug);
    assert(testConfig !== null, `Server test configuration exists for ${ex.slug}`);
    assert(testConfig.testCases.length >= 3, `Exercise ${ex.slug} has >= 3 test cases (${testConfig.testCases.length})`);
    assert(testConfig.testCases.some((t) => t.isHidden), `Exercise ${ex.slug} has hidden test cases`);

    const solution = BATCH_2_SOLUTIONS[ex.slug];
    assert(solution !== undefined, `Reference solution defined for ${ex.slug}`);

    const report = await evaluateSubmission(testConfig, solution, ex.points);
    assert(report.verdict === 'accepted', `Judge verdict for ${ex.slug} is accepted (got ${report.verdict})`);
    assert(report.score === ex.points, `Judge score for ${ex.slug} is ${ex.points}`);
    assert(report.passedTestsCount === report.totalTestsCount, `Passed all ${report.totalTestsCount} tests for ${ex.slug}`);

    // Route lookup check
    const match = getExerciseBySlug(ex.slug);
    assert(match !== null, `getExerciseBySlug resolves ${ex.slug}`);
    assert(match.exercise.id === ex.id, `Resolved exercise ID matches ${ex.id}`);
  }

  console.log('\n=============================================================');
  console.log(`🏁 BATCH 2 VERIFICATION: ${passCount} PASSED, 0 FAILED`);
  console.log('=============================================================\n');
}

verifyBatch2().catch((err) => {
  console.error('Unhandled verification error in Batch 2:', err);
  process.exit(1);
});

