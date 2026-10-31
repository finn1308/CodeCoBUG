/**
 * CodeCoBUG Test Suite: Project-Based Learning (PBL) Integration
 * Tests the 3 major Python Crash Course projects:
 * 1. Alien Invasion (Pygame) - 8 Checkpoints
 * 2. Data Visualization (Matplotlib, Plotly, APIs) - 8 Checkpoints
 * 3. Web Applications (Django Full-Stack) - 10 Checkpoints
 * 
 * Verifies:
 * - Pedagogical completeness, objectives, and prerequisites
 * - Checkpoint exercise models, starter code, reference solutions
 * - Deterministic Judge Engine grading with public & secret test cases
 * - Checkpoint progress persistence and multi-tenant isolation
 * - Route availability & registry resolution
 */

import assert from 'assert';
import {
  ALL_PROJECTS,
  PROJECT_ALIEN_INVASION,
  PROJECT_DATA_VISUALIZATION,
  PROJECT_WEB_APPLICATIONS,
  getProjectBySlug,
  getCheckpointBySlug,
  getCheckpointByExerciseSlug,
  convertCheckpointToExercise,
} from '../src/lib/projects/projectRegistry';
import { PROJECT_SERVER_TESTS, getProjectExerciseTests } from '../src/lib/projects/projectTestCases';
import { getServerExerciseTests } from '../src/lib/judge/testCasesRepository';
import { getExerciseFromRegistry, getAllExercisesFromRegistry } from '../src/lib/curriculum/curriculumRegistry';
import { evaluateSubmission } from '../src/lib/judge/runner';
import { authManager } from '../src/lib/auth/authManager';

// Setup mock window & localStorage for Node.js test environment
const storageStore = {};
if (typeof global.window === 'undefined') {
  global.window = {};
}
if (typeof global.localStorage === 'undefined') {
  global.localStorage = {
    getItem: (key) => storageStore[key] || null,
    setItem: (key, val) => {
      storageStore[key] = String(val);
    },
    removeItem: (key) => {
      delete storageStore[key];
    },
    clear: () => {
      for (const k of Object.keys(storageStore)) delete storageStore[k];
    },
  };
}

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    console.log(`  ✔ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

async function itAsync(desc, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✔ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

async function runSuite() {
  console.log('\n=============================================================');
  console.log('🚀 RUNNING STEP 4 TEST SUITE: PROJECT-BASED LEARNING (PBL)');
  console.log('=============================================================\n');

  // --- Test Group 1: 3 Projects Architecture & Metadata ---
  console.log('--- Test Group 1: 3 Projects Architecture & Metadata ---');

  it('ALL_PROJECTS contains exactly 3 major projects', () => {
    assert.strictEqual(ALL_PROJECTS.length, 3);
  });

  it('Project 1: Alien Invasion has 8 checkpoints', () => {
    assert.strictEqual(PROJECT_ALIEN_INVASION.slug, 'du-an-01-alien-invasion');
    assert.strictEqual(PROJECT_ALIEN_INVASION.checkpoints.length, 8);
    assert.strictEqual(PROJECT_ALIEN_INVASION.category, 'game');
    assert.strictEqual(PROJECT_ALIEN_INVASION.accentColor, 'mint');
    assert.ok(PROJECT_ALIEN_INVASION.prerequisites.length >= 2);
    assert.ok(PROJECT_ALIEN_INVASION.learningObjectives.length >= 3);
  });

  it('Project 2: Data Visualization has 8 checkpoints', () => {
    assert.strictEqual(PROJECT_DATA_VISUALIZATION.slug, 'du-an-02-data-visualization');
    assert.strictEqual(PROJECT_DATA_VISUALIZATION.checkpoints.length, 8);
    assert.strictEqual(PROJECT_DATA_VISUALIZATION.category, 'data');
    assert.strictEqual(PROJECT_DATA_VISUALIZATION.accentColor, 'sky');
    assert.ok(PROJECT_DATA_VISUALIZATION.prerequisites.length >= 2);
    assert.ok(PROJECT_DATA_VISUALIZATION.learningObjectives.length >= 3);
  });

  it('Project 3: Web Applications has 10 checkpoints', () => {
    assert.strictEqual(PROJECT_WEB_APPLICATIONS.slug, 'du-an-03-django-web-app');
    assert.strictEqual(PROJECT_WEB_APPLICATIONS.checkpoints.length, 10);
    assert.strictEqual(PROJECT_WEB_APPLICATIONS.category, 'web');
    assert.strictEqual(PROJECT_WEB_APPLICATIONS.accentColor, 'lavender');
    assert.ok(PROJECT_WEB_APPLICATIONS.prerequisites.length >= 2);
    assert.ok(PROJECT_WEB_APPLICATIONS.learningObjectives.length >= 3);
  });

  it('Each project has clear Local Execution Guide with install and run commands', () => {
    for (const project of ALL_PROJECTS) {
      assert.ok(project.localExecutionGuide, `${project.slug} must have localExecutionGuide`);
      assert.ok(project.localExecutionGuide.installCommands.length >= 2, `${project.slug} must have installCommands`);
      assert.ok(project.localExecutionGuide.runCommand, `${project.slug} must have runCommand`);
      assert.ok(project.localExecutionGuide.folderStructure, `${project.slug} must have folderStructure`);
    }
  });

  it('Each project has Runtime Environment Notice regarding browser vs local server', () => {
    for (const project of ALL_PROJECTS) {
      assert.ok(project.runtimeNotice && project.runtimeNotice.length > 50, `${project.slug} must have runtimeNotice`);
    }
  });

  // --- Test Group 2: Checkpoint Pedagogical Completeness (26 Checkpoints) ---
  console.log('\n--- Test Group 2: Checkpoint Pedagogical Completeness (26 Checkpoints) ---');

  let totalCheckpoints = 0;
  for (const project of ALL_PROJECTS) {
    for (const chk of project.checkpoints) {
      totalCheckpoints++;
      it(`Checkpoint [${chk.slug}] has complete pedagogical fields`, () => {
        assert.ok(chk.id, 'id is required');
        assert.ok(chk.title, 'title is required');
        assert.ok(chk.description, 'description is required');
        assert.ok(Array.isArray(chk.learningObjectives) && chk.learningObjectives.length >= 2, 'learningObjectives >= 2');
        assert.ok(chk.theoryContent && chk.theoryContent.length > 50, 'rich theoryContent');
        assert.ok(chk.starterCode, 'starterCode is required');
        assert.ok(chk.solutionCode, 'solutionCode is required');
        assert.ok(chk.exerciseSlug, 'exerciseSlug is required');
        assert.ok(Array.isArray(chk.hints) && chk.hints.length >= 1, 'hints >= 1');
      });
    }
  }

  it(`Total checkpoints across all 3 projects equals 26 (actual: ${totalCheckpoints})`, () => {
    assert.strictEqual(totalCheckpoints, 26);
  });

  // --- Test Group 3: Server Test Suites & Test Case Quality ---
  console.log('\n--- Test Group 3: Server Test Suites & Test Case Quality ---');

  for (const project of ALL_PROJECTS) {
    for (const chk of project.checkpoints) {
      it(`Server test config exists for [${chk.exerciseSlug}] with >= 3 test cases and hidden tests`, () => {
        const testConfig = getServerExerciseTests(chk.exerciseSlug);
        assert.ok(testConfig, `Test config missing for ${chk.exerciseSlug}`);
        assert.ok(testConfig.testCases.length >= 3, `${chk.exerciseSlug} must have >= 3 test cases`);
        const hasPublic = testConfig.testCases.some((tc) => !tc.isHidden);
        const hasHidden = testConfig.testCases.some((tc) => tc.isHidden);
        assert.ok(hasPublic, `${chk.exerciseSlug} must have public tests`);
        assert.ok(hasHidden, `${chk.exerciseSlug} must have hidden secret tests`);
      });
    }
  }

  // --- Test Group 4: Real Judge Evaluation on All 26 Reference Solutions ---
  console.log('\n--- Test Group 4: Real Judge Evaluation on All 26 Reference Solutions ---');

  for (const project of ALL_PROJECTS) {
    for (const chk of project.checkpoints) {
      await itAsync(`Judge Engine evaluates [${chk.exerciseSlug}] reference solution as accepted`, async () => {
        const testConfig = getServerExerciseTests(chk.exerciseSlug);
        assert.ok(testConfig, `Missing test config for ${chk.exerciseSlug}`);
        const report = await evaluateSubmission(testConfig, chk.solutionCode, 20);
        assert.strictEqual(
          report.verdict,
          'accepted',
          `Expected accepted verdict for ${chk.exerciseSlug}, got ${report.verdict}: ${report.verdictMessage}`
        );
        assert.strictEqual(report.passedTestsCount, report.totalTestsCount);
        assert.strictEqual(report.score, 20);
      });
    }
  }

  // --- Test Group 5: Checkpoint Progress Persistence & Multi-Tenant Isolation ---
  console.log('\n--- Test Group 5: Checkpoint Progress Persistence & Multi-Tenant Isolation ---');

  it('authManager saves and queries project checkpoint completion', () => {
    authManager.reloadSession();
    const projectId = 'project-alien-invasion';
    const chkSlug1 = 'khoi-tao-pygame-va-cai-dat-cua-so';
    const chkSlug2 = 'cau-truc-game-loop-va-clock';

    authManager.saveProjectCheckpoint(projectId, chkSlug1, true);
    assert.strictEqual(authManager.isCheckpointCompleted(projectId, chkSlug1), true);
    assert.strictEqual(authManager.isCheckpointCompleted(projectId, chkSlug2), false);

    const progress1 = authManager.getProjectProgress(projectId, 8);
    assert.strictEqual(progress1.completedCount, 1);
    assert.strictEqual(progress1.percentage, 13); // round(1/8*100) = 13
    assert.strictEqual(progress1.isCompleted, false);

    authManager.saveProjectCheckpoint(projectId, chkSlug2, true);
    assert.strictEqual(authManager.isCheckpointCompleted(projectId, chkSlug2), true);
    const progress2 = authManager.getProjectProgress(projectId, 8);
    assert.strictEqual(progress2.completedCount, 2);
    assert.strictEqual(progress2.percentage, 25);
  });

  it('Multi-tenant data isolation: Checkpoint progress is strictly scoped to the active user', async () => {
    const projectId = 'project-django-web-app';
    const chkSlug = 'gioi-thieu-django-va-khoi-tao-du-an';

    // Sign in as User A
    const userA = await authManager.signUp('pbl_user_a@codecobug.dev', 'pass123', 'User A');
    authManager.saveProjectCheckpoint(projectId, chkSlug, true);
    assert.strictEqual(authManager.isCheckpointCompleted(projectId, chkSlug), true);

    // Sign in as User B
    const userB = await authManager.signUp('pbl_user_b@codecobug.dev', 'pass123', 'User B');
    // User B should NOT have User A's completed checkpoint!
    assert.strictEqual(authManager.isCheckpointCompleted(projectId, chkSlug), false);
    const progressB = authManager.getProjectProgress(projectId, 10);
    assert.strictEqual(progressB.completedCount, 0);
    assert.strictEqual(progressB.percentage, 0);

    // Switch back to User A
    await authManager.signIn('pbl_user_a@codecobug.dev', 'pass123');
    assert.strictEqual(authManager.isCheckpointCompleted(projectId, chkSlug), true);
  });

  // --- Test Group 6: Registry & Route Lookup Integration ---
  console.log('\n--- Test Group 6: Registry & Route Lookup Integration ---');

  it('getExerciseFromRegistry resolves PBL checkpoint exercises', () => {
    const res = getExerciseFromRegistry('ex-ai-01-cai-dat-game-settings');
    assert.ok(res, 'Must resolve ex-ai-01-cai-dat-game-settings');
    assert.strictEqual(res.exercise.slug, 'ex-ai-01-cai-dat-game-settings');
    assert.strictEqual(res.topic.id, 'project-alien-invasion');
    assert.ok(res.exercise.hints && res.exercise.hints.length >= 1);
  });

  it('getAllExercisesFromRegistry includes all 26 PBL checkpoint exercises', () => {
    const all = getAllExercisesFromRegistry();
    const pblExercises = all.filter((item) =>
      item.exercise.slug.startsWith('ex-ai-') ||
      item.exercise.slug.startsWith('ex-dv-') ||
      item.exercise.slug.startsWith('ex-web-')
    );
    assert.strictEqual(pblExercises.length, 26);
  });

  console.log('\n=============================================================');
  console.log(`🏁 STEP 4 PBL VERIFICATION: ${passed} PASSED, 0 FAILED`);
  console.log('=============================================================\n');
}

runSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
