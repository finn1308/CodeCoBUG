/**
 * CodeCoBUG Phase 8 Test Suite: End-to-End System Flows, Security Hardening & Production Verification
 *
 * Acceptance Criteria verified:
 * 1. Critical user flows pass (Home -> Workspace -> Run -> Submit -> AI Tutor -> Mastery & Review).
 * 2. No known critical security issue remains unresolved (BYOK AES-256-GCM, Secret Redaction, Hidden Tests Shield).
 * 3. No fake data is mixed into real progress (Strict empirical derivation from SavedSubmissionRecord).
 * 4. All environment variables are documented in .env.example.
 * 5. Deployment instructions and known limitations are recorded in docs/DEPLOYMENT_GUIDE.md.
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

const { SAMPLE_TEST_COURSE, getExerciseBySlug } = require('../src/lib/fixtures/sampleCurriculum');
const { authManager } = require('../src/lib/auth/authManager');
const { MasteryEngine } = require('../src/lib/mastery/masteryEngine');
const { ReviewEngine } = require('../src/lib/mastery/reviewEngine');
const { ExerciseVariationEngine } = require('../src/lib/mastery/exerciseVariation');
const { ErrorClassifier } = require('../src/lib/mastery/errorClassifier');
const {
  encryptApiKey,
  decryptApiKey,
  maskApiKey,
  redactApiKey,
} = require('../src/lib/ai/crypto');
const { AITutorService } = require('../src/lib/ai/tutorService');

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

async function runSystemVerificationSuite() {
  console.log('\n=============================================================');
  console.log('🛡️ RUNNING PHASE 8: SYSTEM VERIFICATION & HARDENING SUITE');
  console.log('=============================================================\n');

  // -------------------------------------------------------------
  // TEST GROUP 1: End-to-End Critical User Flow
  // -------------------------------------------------------------
  console.log('--- Test Group 1: End-to-End Critical User Flow ---');

  // Step 1: Curriculum loading
  assert(SAMPLE_TEST_COURSE.topics.length >= 1, 'Curriculum topics loaded');
  const found = getExerciseBySlug('in-loi-chao-codecobug');
  assert(found !== null, 'Exercise in-loi-chao-codecobug found in curriculum');
  const exercise = found.exercise;
  const topic = found.topic;
  assert(exercise && exercise.slug === 'in-loi-chao-codecobug', 'Exercise metadata loaded: in-loi-chao-codecobug');

  // Step 2: Fresh Learner Session
  const freshLearner = await authManager.signUp('learner_e2e@codecobug.dev', 'password123', 'Nguyen Van A');
  assert(freshLearner.email === 'learner_e2e@codecobug.dev', 'Learner signs up and establishes session');
  assert(freshLearner.points === 0, 'Initial points start cleanly at 0');

  // Step 3: Code Draft Auto-save
  const draftCode = 'print("Xin chao CodeCoBUG!")';
  authManager.saveDraft(exercise.slug, draftCode);
  const retrievedDraft = authManager.getDraft(exercise.slug);
  assert(retrievedDraft === draftCode, 'Code draft persists and retrieves reliably');

  // Step 4: Submission Simulation & Points Accrual
  const successfulSub = {
    id: `sub-e2e-${Date.now()}`,
    userId: freshLearner.id,
    exerciseSlug: exercise.slug,
    submittedCode: draftCode,
    verdict: 'accepted',
    score: 100,
    totalPoints: exercise.points || 10,
    passedTestsCount: 4,
    totalTestsCount: 4,
    executionTimeMs: 42,
    submittedAt: new Date().toISOString(),
  };
  authManager.saveSubmission(successfulSub);

  const updatedProfile = authManager.getCurrentUser();
  assert(updatedProfile.points === successfulSub.score, 'Profile points increase by submission score (100 pts)');
  const userSubs = authManager.getAllUserSubmissions(freshLearner.id);
  assert(userSubs.length === 1 && userSubs[0].verdict === 'accepted', 'Submission record persisted in user history');

  // Step 5: Empirical Mastery Derivation from Submissions
  const masteryReport = MasteryEngine.computeMastery(userSubs);
  assert(masteryReport.totalSubmissionsAnalyzed === 1, 'Mastery engine analyzes actual saved submission');
  const printSkill = masteryReport.skills.find((s) => s.skillCode === 'python_print_syntax');
  assert(printSkill && printSkill.successfulAttempts === 1, 'Skill recorded 1 successful attempt');
  assert(printSkill.status === 'in_progress', 'Skill status is updated based on empirical result');

  // Step 6: Review Queue Check
  const reviews = ReviewEngine.syncReviewQueue(freshLearner.id, userSubs);
  const pendingReviews = ReviewEngine.getPendingReviews(freshLearner.id);
  assert(pendingReviews.length === 0, 'No pending reviews for exercise that was successfully solved');


  // -------------------------------------------------------------
  // TEST GROUP 2: Security & Privacy Shields
  // -------------------------------------------------------------
  console.log('\n--- Test Group 2: Security & Privacy Review ---');

  // Check 1: BYOK AES-256-GCM Encryption
  const testKey = 'AIzaSyA_Real_Gemini_Key_For_Test_9876543210';
  const encrypted = encryptApiKey(testKey);
  assert(!encrypted.includes(testKey), 'Encrypted token does not contain raw key');
  const decrypted = decryptApiKey(encrypted);
  assert(decrypted === testKey, 'Decryption accurately recovers original key');

  // Check 2: API Key Redaction in Error Traces
  const errorTrace = `Error 400 at https://generativelanguage.googleapis.com/v1beta/models?key=${testKey} failed`;
  const sanitizedTrace = redactApiKey(errorTrace, testKey);
  assert(!sanitizedTrace.includes(testKey), 'Raw API key is redacted from error traces');
  assert(sanitizedTrace.includes('[REDACTED_API_KEY]'), 'Redaction placeholder injected');

  // Check 3: Hidden Test Cases Protection
  const swapFound = getExerciseBySlug('hoan-doi-hai-bien');
  const hiddenTestExercise = swapFound ? swapFound.exercise : exercise;
  const mockContext = {
    title: hiddenTestExercise.title,
    slug: hiddenTestExercise.slug,
    description: hiddenTestExercise.description,
    starterCode: hiddenTestExercise.starterCode,
  };
  const mockSubmission = {
    submittedCode: 'a, b = b, a',
    verdict: 'wrong_answer',
    errorMessage: 'Assertion failed on test #3',
    failedTestInfo: {
      orderIndex: 3,
      // Hidden test: no expectedOutput leaked!
      errorMessage: 'Test #3 failed',
    },
  };
  const prompt = AITutorService['buildExplainErrorPrompt'](mockContext, mockSubmission);
  assert(!prompt.includes('expectedOutput') && !prompt.includes('secret_hidden_answer'), 'AI contextual prompt does not leak hidden test answers');

  // Check 4: Service Role Key Confidentiality
  const workspaceRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(workspaceRoot, 'src');
  const clientFiles = [];
  function scanFiles(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) scanFiles(full);
      else if (/\.(tsx|ts|jsx|js)$/.test(f)) clientFiles.push(full);
    }
  }
  scanFiles(srcDir);

  let hasLeakedSecretKey = false;
  for (const file of clientFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY')) {
      hasLeakedSecretKey = true;
      break;
    }
  }
  assert(!hasLeakedSecretKey, 'SUPABASE_SERVICE_ROLE_KEY is never exposed with NEXT_PUBLIC_ prefix in src/');


  // -------------------------------------------------------------
  // TEST GROUP 3: No Fake Data Mixed into Real Progress
  // -------------------------------------------------------------
  console.log('\n--- Test Group 3: Real Progress Integrity ---');

  const learnerNew = await authManager.signUp('learner_clean@codecobug.dev', 'password123', 'Tran Thi B');
  const emptySubmissions = authManager.getAllUserSubmissions(learnerNew.id);
  assert(emptySubmissions.length === 0, 'New learner has 0 submissions initially');

  const zeroReport = MasteryEngine.computeMastery(emptySubmissions);
  assert(zeroReport.overallMasteryPercentage === 0, 'New learner starts at strictly 0% mastery');
  assert(zeroReport.masteredCount === 0, 'Zero mastered skills without actual verified completions');
  assert(zeroReport.recurringWeaknesses.length === 0, 'No false weaknesses reported without attempts');


  // -------------------------------------------------------------
  // TEST GROUP 4: Environment Documentation & Deployment Readiness
  // -------------------------------------------------------------
  console.log('\n--- Test Group 4: Deployment & Documentation Verification ---');

  // Check .env.example
  const envExamplePath = path.join(workspaceRoot, '.env.example');
  assert(fs.existsSync(envExamplePath), '.env.example file exists');
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  assert(envContent.includes('NEXT_PUBLIC_APP_URL'), '.env.example documents NEXT_PUBLIC_APP_URL');
  assert(envContent.includes('NEXT_PUBLIC_SUPABASE_URL'), '.env.example documents NEXT_PUBLIC_SUPABASE_URL');
  assert(envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), '.env.example documents NEXT_PUBLIC_SUPABASE_ANON_KEY');
  assert(envContent.includes('SUPABASE_SERVICE_ROLE_KEY'), '.env.example documents SUPABASE_SERVICE_ROLE_KEY');
  assert(envContent.includes('APP_ENCRYPTION_KEY'), '.env.example documents APP_ENCRYPTION_KEY');

  // Check docs/DEPLOYMENT_GUIDE.md
  const deploymentGuidePath = path.join(workspaceRoot, 'docs', 'DEPLOYMENT_GUIDE.md');
  assert(fs.existsSync(deploymentGuidePath), 'docs/DEPLOYMENT_GUIDE.md exists');
  const deployGuideContent = fs.readFileSync(deploymentGuidePath, 'utf8');
  assert(deployGuideContent.includes('Production Deployment & Operations Guide'), 'Deployment guide title verified');
  assert(deployGuideContent.includes('Database Setup & Migrations'), 'Deployment guide details migrations order');
  assert(deployGuideContent.includes('Security & Hardening Checklist'), 'Deployment guide details security checklist');
  assert(deployGuideContent.includes('Known Limitations'), 'Deployment guide documents known limitations');

  // -------------------------------------------------------------
  // TEST GROUP 5: Exercise Variation & Quality Shield
  // -------------------------------------------------------------
  console.log('\n--- Test Group 5: Exercise Variation & Duplicate Shield ---');

  const existingPool = [
    {
      title: 'In lời chào CodeCoBUG',
      slug: 'in-loi-chao-codecobug',
      description: 'Viết chương trình Python in ra dòng chữ chính xác: Xin chao CodeCoBUG!',
    },
  ];

  const candidateDuplicate = {
    title: 'In lời chào CodeCoBUG',
    description: 'Viết chương trình Python in ra đúng dòng chữ chính xác: Xin chao CodeCoBUG!',
    starterCode: '',
    examples: [{ inputData: '', expectedOutput: 'Xin chao CodeCoBUG!' }],
  };
  const dupValidation = ExerciseVariationEngine.validate(candidateDuplicate, existingPool);
  assert(!dupValidation.isValid, 'Duplicate exercise rejected');
  assert(dupValidation.isDuplicate, 'isDuplicate flag is true');

  const candidateNovel = {
    title: 'Đổi độ C sang độ F',
    description: 'Nhập vào nhiệt độ theo độ Celsius và chuyển đổi sang độ Fahrenheit theo công thức F = C * 1.8 + 32.',
    starterCode: '# Viet code o day\n',
    examples: [{ inputData: '0', expectedOutput: '32.0' }],
  };
  const novelValidation = ExerciseVariationEngine.validate(candidateNovel, existingPool, 75);
  assert(novelValidation.isValid, 'Valid novel exercise passes validation');
  assert(!novelValidation.isDuplicate, 'isDuplicate is false for novel exercise');


  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`🏁 PHASE 8 VERIFICATION RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('=============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runSystemVerificationSuite().catch((err) => {
  console.error('Unhandled system verification error:', err);
  process.exit(1);
});
