/**
 * CodeCoBUG Batch 7 Verification Suite: Chapter 12 (Advanced Topics, Virtualenv & Ecosystem)
 */

const { CHAPTER_12_ADVANCED_TOPICS } = require('../src/lib/curriculum');
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
console.log('🚀 RUNNING BATCH 7: CHAPTER 12 CURRICULUM VERIFICATION');
console.log('=============================================================\n');

// Group 1: Structure & Pedagogical Completeness
console.log('--- Test Group 1: Chapter 12 Pedagogical Completeness ---');
const chap = CHAPTER_12_ADVANCED_TOPICS;

assert(chap.lessons.length === 3, `Chapter "${chap.title}" has 3 structured lessons (actual: ${chap.lessons.length})`);
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

// Group 2: Reference Solutions & Real Judge Evaluation
console.log('\n--- Test Group 2: Real Judge Evaluation on All Exercises ---');
const BATCH_7_SOLUTIONS = {
  'sinh-so-chinh-phuong-generator': 'def sinh_chinh_phuong(n):\n    for i in range(1, n + 1):\n        yield i * i\n\nn = int(input())\nfor so in sinh_chinh_phuong(n):\n    print(so)\n',
  'phan-tich-requirements-txt': 'n = int(input())\nfor _ in range(n):\n    line = input()\n    pkg, ver = line.split("==")\n    print(f"Goi: {pkg} (v{ver})")\n',
  'tinh-thong-ke-mang-so-lieu': 'nums = [int(x) for x in input().split()]\nnums.sort()\nk = len(nums)\nmean = sum(nums) / k\nif k % 2 == 1:\n    median = float(nums[k // 2])\nelse:\n    median = (nums[k // 2 - 1] + nums[k // 2]) / 2.0\nprint(f"Mean: {mean:.2f}")\nprint(f"Median: {median:.2f}")\n',
};

async function runBatch7Tests() {
  const allBatch7Exercises = chap.lessons.flatMap((l) => l.exercises);
  assert(allBatch7Exercises.length === 3, `Batch 7 has exactly 3 exercises (actual: ${allBatch7Exercises.length})`);

  for (const ex of allBatch7Exercises) {
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

    const solutionCode = BATCH_7_SOLUTIONS[ex.slug];
    assert(solutionCode !== undefined, `Reference solution defined for ${ex.slug}`);

    // Run real judge evaluation
    const report = await evaluateSubmission(serverTests, solutionCode, ex.points);
    assert(report.verdict === 'accepted', `Submission verdict is accepted (got: ${report.verdict})`);
    assert(report.score === ex.points, `Score matches full points ${ex.points} (got: ${report.score})`);
    assert(report.passedTestsCount === report.totalTestsCount, `All ${report.totalTestsCount} tests passed`);
  }

  console.log(`\n=============================================================`);
  console.log(`🎉 BATCH 7 SUITE COMPLETE: ALL ${passCount} ASSERTIONS PASSED!`);
  console.log(`=============================================================\n`);
}

runBatch7Tests().catch((err) => {
  console.error('Fatal error during Batch 7 test:', err);
  process.exit(1);
});

