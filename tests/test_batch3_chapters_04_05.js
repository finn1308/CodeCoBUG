/**
 * CodeCoBUG Batch 3 Verification Suite: Chapter 04 (Strings) & Chapter 05 (Data Structures)
 */

const { CHAPTER_04_STRINGS, CHAPTER_05_DATA_STRUCTURES } = require('../src/lib/curriculum');
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
console.log('🧵 RUNNING BATCH 3: CHAPTER 04 & 05 CURRICULUM VERIFICATION');
console.log('=============================================================\n');

// Group 1: Structure & Pedagogical Completeness
console.log('--- Test Group 1: Chapter 04 & 05 Pedagogical Completeness ---');
const chapters = [CHAPTER_04_STRINGS, CHAPTER_05_DATA_STRUCTURES];

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
const BATCH_3_SOLUTIONS = {
  // Chapter 04: Strings
  'lay-ky-tu-dau-va-cuoi': 's = input()\nprint(s[0])\nprint(s[-1])\n',
  'dao-nguoc-chuoi-ky-tu': 's = input()\nprint(s[::-1])\n',
  'chuan-hoa-in-hoa-va-in-thuong': 's = input()\nprint(s.upper())\nprint(s.lower())\n',
  'thay-the-tu-trong-cau': 'cau = input()\ntu_cu = input()\ntu_moi = input()\nprint(cau.replace(tu_cu, tu_moi))\n',
  'dinh-dang-so-thap-phan-fstring': 'r = float(input())\ndt = 3.14159 * r * r\nprint(f"Dien tich: {dt:.2f}")\n',
  'kiem-tra-chuoi-doi-xung': 's = input()\nclean = s.lower()\nprint(clean == clean[::-1])\n',

  // Chapter 05: Data Structures
  'them-va-sap-xep-danh-sach': 'a = [12, 5, 8, 19, 3]\nx = int(input())\na.append(x)\na.sort()\nprint(a)\n',
  'tim-phan-tu-lon-nhat-nho-nhat': 'nums = list(map(int, input().split()))\nprint(f"Min: {min(nums)}")\nprint(f"Max: {max(nums)}")\n',
  'loc-phan-tu-trung-lap': 'nums = list(map(int, input().split()))\nprint(sorted(list(set(nums))))\n',
  'tra-cuu-tu-dien-don-gia': 'bang_gia = {"tao": 30000, "cam": 25000, "xoai": 40000, "chuoi": 15000}\nten_qua = input()\ngia = bang_gia.get(ten_qua)\nif gia:\n    print(f"Gia: {gia} VND")\nelse:\n    print("Khong co trong bang gia")\n',
  'loc-so-chan-list-comprehension': 'nums = list(map(int, input().split()))\nprint([x for x in nums if x % 2 == 0])\n',
};

async function verifyBatch3() {
  const allBatch3Exercises = chapters.flatMap((c) => c.lessons.flatMap((l) => l.exercises));
  assert(allBatch3Exercises.length === 11, `Batch 3 has exactly 11 exercises (actual: ${allBatch3Exercises.length})`);

  for (const ex of allBatch3Exercises) {
    const testConfig = getServerExerciseTests(ex.slug);
    assert(testConfig !== null, `Server test configuration exists for ${ex.slug}`);
    assert(testConfig.testCases.length >= 3, `Exercise ${ex.slug} has >= 3 test cases (${testConfig.testCases.length})`);
    assert(testConfig.testCases.some((t) => t.isHidden), `Exercise ${ex.slug} has hidden test cases`);

    const solution = BATCH_3_SOLUTIONS[ex.slug];
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
  console.log(`🏁 BATCH 3 VERIFICATION: ${passCount} PASSED, 0 FAILED`);
  console.log('=============================================================\n');
}

verifyBatch3().catch((err) => {
  console.error('Unhandled verification error in Batch 3:', err);
  process.exit(1);
});
