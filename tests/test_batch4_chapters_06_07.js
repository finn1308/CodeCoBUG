/**
 * CodeCoBUG Batch 4 Verification Suite: Chapter 06 (Conditionals) & Chapter 07 (Loops)
 */

const { CHAPTER_06_CONDITIONALS, CHAPTER_07_LOOPS } = require('../src/lib/curriculum');
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
console.log('🔄 RUNNING BATCH 4: CHAPTER 06 & 07 CURRICULUM VERIFICATION');
console.log('=============================================================\n');

// Group 1: Structure & Pedagogical Completeness
console.log('--- Test Group 1: Chapter 06 & 07 Pedagogical Completeness ---');
const chapters = [CHAPTER_06_CONDITIONALS, CHAPTER_07_LOOPS];

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
const BATCH_4_SOLUTIONS = {
  // Chapter 06: Conditionals
  'kiem-tra-am-duong': 'n = int(input())\nif n > 0:\n    print("So duong")\nelse:\n    print("So am")\n',
  'xep-loai-hoc-luc': 'dtb = float(input())\nif dtb >= 8.5:\n    print("Xuat sac")\nelif dtb >= 8.0:\n    print("Gioi")\nelif dtb >= 6.5:\n    print("Kha")\nelif dtb >= 5.0:\n    print("Trung binh")\nelse:\n    print("Yeu")\n',
  'kiem-tra-nam-nhuan': 'nam = int(input())\nif (nam % 400 == 0) or (nam % 4 == 0 and nam % 100 != 0):\n    print("Nam nhuan")\nelse:\n    print("Nam thuong")\n',

  // Chapter 07: Loops
  'in-day-so-chan': 'n = int(input())\nfor i in range(2, n + 1, 2):\n    print(i)\n',
  'dem-nguoc-countdown': 'n = int(input())\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("Xong!")\n',
  'tim-so-chia-het-dau-tien': 'start = int(input())\nk = int(input())\ncur = start\nwhile True:\n    if cur % k == 0:\n        print(cur)\n        break\n    cur += 1\n',
  'tinh-tong-day-so-tu-1-den-n': 'n = int(input())\ntong = 0\nfor i in range(1, n + 1):\n    tong += i\nprint(tong)\n',
  've-hinh-chu-nhat-sao': 'rows = int(input())\ncols = int(input())\nfor r in range(rows):\n    print("*" * cols)\n',
};

async function runBatch4Tests() {
  const allBatch4Exercises = chapters.flatMap((c) => c.lessons.flatMap((l) => l.exercises));
  assert(allBatch4Exercises.length === 8, `Batch 4 has exactly 8 exercises (actual: ${allBatch4Exercises.length})`);

  for (const ex of allBatch4Exercises) {
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

    const solutionCode = BATCH_4_SOLUTIONS[ex.slug];
    assert(solutionCode !== undefined, `Reference solution defined for ${ex.slug}`);

    // Run real judge evaluation
    const report = await evaluateSubmission(serverTests, solutionCode, ex.points);
    assert(report.verdict === 'accepted', `Submission verdict is accepted (got: ${report.verdict})`);
    assert(report.score === ex.points, `Score matches full points ${ex.points} (got: ${report.score})`);
    assert(report.passedTestsCount === report.totalTestsCount, `All ${report.totalTestsCount} tests passed`);
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 BATCH 4 SUITE COMPLETE: ALL ${passCount} ASSERTIONS PASSED!`);
  console.log(`=============================================================\n`);
}

runBatch4Tests().catch((err) => {
  console.error('Fatal error during Batch 4 test:', err);
  process.exit(1);
});
