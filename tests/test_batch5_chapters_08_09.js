/**
 * CodeCoBUG Batch 5 Verification Suite: Chapter 08 (Functions) & Chapter 09 (Errors & Modules)
 */

const { CHAPTER_08_FUNCTIONS, CHAPTER_09_ERRORS_MODULES } = require('../src/lib/curriculum');
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
console.log('📦 RUNNING BATCH 5: CHAPTER 08 & 09 CURRICULUM VERIFICATION');
console.log('=============================================================\n');

// Group 1: Structure & Pedagogical Completeness
console.log('--- Test Group 1: Chapter 08 & 09 Pedagogical Completeness ---');
const chapters = [CHAPTER_08_FUNCTIONS, CHAPTER_09_ERRORS_MODULES];

chapters.forEach((chap) => {
  assert(chap.lessons.length >= 3, `Chapter "${chap.title}" has >= 3 structured lessons (actual: ${chap.lessons.length})`);
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
const BATCH_5_SOLUTIONS = {
  // Chapter 08: Functions
  'tinh-dien-tich-hinh-chu-nhat-ham': 'def tinh_dien_tich(dai, rong):\n    return dai * rong\n\nd = float(input())\nr = float(input())\nprint(tinh_dien_tich(d, r))\n',
  'ham-tinh-tong-nhieu-so': 'def tong_so(*args):\n    return sum(args)\n\nnums = [int(x) for x in input().split()]\nprint(tong_so(*nums))\n',
  'sap-xep-theo-tuoi-lambda': 'n = int(input())\nhoc_sinh = []\nfor _ in range(n):\n    parts = input().split()\n    hoc_sinh.append((parts[0], int(parts[1])))\nprint(sorted(hoc_sinh, key=lambda item: item[1]))\n',
  'tinh-giai-thua-de-quy': 'def giai_thua(n):\n    if n <= 1:\n        return 1\n    return n * giai_thua(n - 1)\n\nn = int(input())\nprint(giai_thua(n))\n',

  // Chapter 09: Errors & Modules
  'phep-chia-an-toan-try-except': 'a = int(input())\nb = int(input())\ntry:\n    kq = a / b\n    print(f"{kq:.2f}")\nexcept ZeroDivisionError:\n    print("Loi chia cho 0")\n',
  'kiem-tra-tuoi-hop-le-raise': 'def kiem_tra_tuoi(tuoi):\n    if tuoi < 0 or tuoi > 120:\n        raise ValueError("Tuoi khong hop le")\n    return "Hop le"\n\nt = int(input())\ntry:\n    print(kiem_tra_tuoi(t))\nexcept ValueError as e:\n    print(e)\n',
  'tinh-toan-voi-module-math': 'import math\nx = float(input())\nn = int(input())\nprint(f"{math.sqrt(x):.2f}")\nprint(math.factorial(n))\n',
};

async function runBatch5Tests() {
  const allBatch5Exercises = chapters.flatMap((c) => c.lessons.flatMap((l) => l.exercises));
  assert(allBatch5Exercises.length === 7, `Batch 5 has exactly 7 exercises (actual: ${allBatch5Exercises.length})`);

  for (const ex of allBatch5Exercises) {
    console.log(`\nTesting exercise [${ex.slug}]...`);
    const match = getExerciseBySlug(ex.slug);
    assert(match !== null, `getExerciseBySlug resolves ${ex.slug}`);
    assert(match.exercise.id === ex.id, `Resolved exercise ID matches ${ex.id}`);

    const serverTests = getServerExerciseTests(ex.slug);
    assert(serverTests !== null, `Authoritative server test suite exists for "${ex.slug}"`);
    assert(serverTests.testCases.length >= 3, `Exercise has at least 3 test cases (actual: ${serverTests.testCases.length})`);

    const hasPublic = serverTests.testCases.some((t) => !t.isHidden);
    const hasHidden = serverTests.testCases.some((t) => t.isHidden);
    assert(hasPublic, `Has public example test cases`);
    assert(hasHidden, `Has hidden grading test cases`);

    const solutionCode = BATCH_5_SOLUTIONS[ex.slug];
    assert(solutionCode !== undefined, `Reference solution defined for ${ex.slug}`);

    // Run real judge evaluation
    const report = await evaluateSubmission(serverTests, solutionCode, ex.points);
    assert(report.verdict === 'accepted', `Submission verdict is accepted (got: ${report.verdict})`);
    assert(report.score === ex.points, `Score matches full points ${ex.points} (got: ${report.score})`);
    assert(report.passedTestsCount === report.totalTestsCount, `All ${report.totalTestsCount} tests passed`);
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 BATCH 5 SUITE COMPLETE: ALL ${passCount} ASSERTIONS PASSED!`);
  console.log(`=============================================================\n`);
}

runBatch5Tests().catch((err) => {
  console.error('Fatal error during Batch 5 test:', err);
  process.exit(1);
});

