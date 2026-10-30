/**
 * CodeCoBUG Full 12-Chapter Curriculum Audit & Verification Suite
 * Verifies all 12 chapters, lessons, pedagogical components,
 * exercise registry, test cases repository, and regression fixtures.
 */

const { OFFICIAL_PYTHON_COURSE, getAllExercisesFromRegistry } = require('../src/lib/curriculum');
const { getExerciseBySlug, SAMPLE_TEST_COURSE } = require('../src/lib/fixtures/sampleCurriculum');
const { getServerExerciseTests } = require('../src/lib/judge/testCasesRepository');

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
console.log('🎓 CODECOBUG COMPLETE 12-CHAPTER CURRICULUM AUDIT');
console.log('=============================================================\n');

// 1. Course structure
console.log('--- Step 1: Course Structure & Sequence ---');
assert(OFFICIAL_PYTHON_COURSE.topics.length === 12, `Course has exactly 12 chapters (actual: ${OFFICIAL_PYTHON_COURSE.topics.length})`);

OFFICIAL_PYTHON_COURSE.topics.forEach((topic, idx) => {
  assert(topic.orderIndex === idx + 1, `Chapter ${idx + 1} orderIndex is ${idx + 1}`);
  assert(topic.title.length > 5, `Chapter ${idx + 1} has title "${topic.title}"`);
  assert(topic.summary.length > 20, `Chapter ${idx + 1} has comprehensive summary`);
  assert(topic.lessons.length >= 3, `Chapter ${idx + 1} has >= 3 lessons (actual: ${topic.lessons.length})`);
});

// 2. Pedagogical Completeness across all lessons
console.log('\n--- Step 2: 10-Part Pedagogical Standard Across All Lessons ---');
let totalLessons = 0;
OFFICIAL_PYTHON_COURSE.topics.forEach((topic) => {
  topic.lessons.forEach((lesson) => {
    totalLessons++;
    assert(lesson.learningObjectives && lesson.learningObjectives.length >= 2, `[${lesson.slug}] has >= 2 objectives`);
    assert(lesson.prerequisites && lesson.prerequisites.length >= 1, `[${lesson.slug}] has prerequisites`);
    assert(lesson.theoryContent && lesson.theoryContent.length > 50, `[${lesson.slug}] has rich theory content`);
    assert(lesson.codeExamples && lesson.codeExamples.length >= 1, `[${lesson.slug}] has runnable code examples`);
    assert(lesson.commonMistakes && lesson.commonMistakes.length >= 1, `[${lesson.slug}] has common mistakes & fixes`);
    assert(lesson.guidedPracticeTask && lesson.guidedPracticeTask.instructions, `[${lesson.slug}] has guided practice task`);
    assert(lesson.recap && lesson.recap.length >= 2, `[${lesson.slug}] has recap points`);
    assert(lesson.referenceLinks && lesson.referenceLinks.some((l) => l.url.includes('w3schools.com')), `[${lesson.slug}] has W3Schools reference links`);
  });
});
console.log(`Total verified lessons: ${totalLessons}`);

// 3. Exercises and Test Cases Repository
console.log('\n--- Step 3: Exercise Integrity & Test Cases Repository ---');
const allExercises = getAllExercisesFromRegistry();
console.log(`Total exercises registered: ${allExercises.length}`);
assert(allExercises.length >= 40, `Curriculum has >= 40 exercises (actual: ${allExercises.length})`);

allExercises.forEach(({ exercise: ex, topic }) => {
  assert(ex.id && ex.id.startsWith('ex-'), `Exercise ID ${ex.id} is stable`);
  assert(ex.slug && ex.slug.length > 3, `Exercise slug "${ex.slug}" is valid`);
  assert(ex.title && ex.title.length > 3, `Exercise "${ex.slug}" has title`);
  assert(ex.description && ex.description.length > 20, `Exercise "${ex.slug}" has statement & description`);
  assert(ex.starterCode && ex.starterCode.length > 5, `Exercise "${ex.slug}" has starter code`);
  assert(ex.hints && ex.hints.length >= 1, `Exercise "${ex.slug}" has hints`);
  assert(ex.skillTags && ex.skillTags.length >= 1, `Exercise "${ex.slug}" has skill tags`);
  assert(ex.points > 0, `Exercise "${ex.slug}" has positive points`);
  assert(ex.examples && ex.examples.length >= 1, `Exercise "${ex.slug}" has public examples in curriculum`);

  // Server test config
  const serverTests = getServerExerciseTests(ex.slug);
  assert(serverTests !== null, `Server test configuration exists for "${ex.slug}"`);
  assert(serverTests.testCases.length >= 3, `"${ex.slug}" has >= 3 test cases (actual: ${serverTests.testCases.length})`);
  assert(serverTests.testCases.some((t) => !t.isHidden), `"${ex.slug}" has public tests`);
  assert(serverTests.testCases.some((t) => t.isHidden), `"${ex.slug}" has hidden tests`);

  // Resolution via getExerciseBySlug
  const resolved = getExerciseBySlug(ex.slug);
  assert(resolved !== null, `getExerciseBySlug resolves "${ex.slug}"`);
  assert(resolved.exercise.id === ex.id, `Resolved exercise ID matches ${ex.id}`);
});

// 4. Regression Guard for Test Fixtures
console.log('\n--- Step 4: Regression Guard on Fixtures ---');
assert(SAMPLE_TEST_COURSE.topics[0].lessons[0].exercises.length === 3, 'SAMPLE_TEST_COURSE maintains exactly 3 test fixtures');
['in-loi-chao-codecobug', 'nhap-ten-va-tuoi', 'hoan-doi-hai-bien'].forEach((fixtureSlug) => {
  const match = getExerciseBySlug(fixtureSlug);
  assert(match !== null, `Fixture "${fixtureSlug}" is properly resolved`);
  const tests = getServerExerciseTests(fixtureSlug);
  assert(tests !== null && tests.testCases.length >= 4, `Fixture "${fixtureSlug}" has >= 4 server tests (actual: ${tests.testCases.length})`);
});

console.log(`\n=============================================================`);
console.log(`🏆 COMPLETE 12-CHAPTER AUDIT PASSED: ${passCount} ASSERTIONS VERIFIED!`);
console.log(`=============================================================\n`);
