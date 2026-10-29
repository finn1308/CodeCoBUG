/**
 * CodeCoBUG Phase 5 Test Suite: Authentication, Persistence & RLS Multi-tenant Isolation
 *
 * Acceptance Criteria verified:
 * 1. Sign-up, sign-in, sign-out, and session handling work.
 * 2. Data persists after reload (drafts, submissions, profile points).
 * 3. User-owned records are properly isolated (Multi-tenant Tenant Isolation).
 * 4. Database policies (RLS) are verified on all exposed tables.
 * 5. Hidden test cases protected from ordinary learner access.
 * 6. No secret server credentials reach client-side components.
 */

const fs = require('fs');
const path = require('path');

// Setup mock window & localStorage for complete fidelity with browser execution
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

// Import compiled or transpile authManager
// We can use tsx or require the typescript file via tsx
const { authManager } = require('../src/lib/auth/authManager');

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

async function runTestSuite() {
  console.log('\n=============================================================');
  console.log('🧪 RUNNING PHASE 5 TEST SUITE: AUTH, PERSISTENCE & RLS');
  console.log('=============================================================\n');

  // TEST 1: Default Guest/Learner Session
  console.log('--- Test Group 1: Session Lifecycle & Sign Up ---');
  const initialUser = authManager.getCurrentUser();
  assert(initialUser !== null, 'Initial learner session is seeded automatically for instant onboarding');
  assert(initialUser.role === 'learner', 'Default user has learner role');

  // TEST 2: Sign Up User A (Alice)
  const alice = await authManager.signUp('alice@test.com', 'password123', 'Alice Nguyen');
  assert(alice.email === 'alice@test.com', 'Alice account created with correct email');
  assert(alice.displayName === 'Alice Nguyen', 'Alice display name set');
  assert(alice.points === 0, 'Alice initial points start at 0');
  assert(authManager.getCurrentUser().id === alice.id, 'Alice is now active user in session');

  // TEST 3: Duplicate Email Prevention
  let duplicatePrevented = false;
  try {
    await authManager.signUp('alice@test.com', 'diffpass', 'Alice Clone');
  } catch (err) {
    duplicatePrevented = true;
  }
  assert(duplicatePrevented, 'Duplicate email registration is strictly prevented');

  // TEST 4: Sign Out & Sign In
  console.log('\n--- Test Group 2: Sign Out & Credential Verification ---');
  await authManager.signOut();
  assert(authManager.getCurrentUser() === null, 'Sign out clears active session');

  let badLoginFailed = false;
  try {
    await authManager.signIn('alice@test.com', 'wrongpassword');
  } catch {
    badLoginFailed = true;
  }
  assert(badLoginFailed, 'Sign in with incorrect password fails cleanly');

  const reLoginAlice = await authManager.signIn('alice@test.com', 'password123');
  assert(reLoginAlice.id === alice.id, 'Sign in with correct credentials restores Alice session');

  // TEST 5: Code Draft Persistence
  console.log('\n--- Test Group 3: Code Draft Persistence Across Reloads ---');
  const aliceCode = 'a, b = b, a\nprint(a, b)';
  authManager.saveDraft('swap-two-variables', aliceCode);
  const retrievedDraft = authManager.getDraft('swap-two-variables');
  assert(retrievedDraft === aliceCode, 'Code draft saved and retrieved for active exercise');

  // TEST 6: Simulated Page Reload
  authManager.reloadSession();
  const reloadedUser = authManager.getCurrentUser();
  assert(reloadedUser.id === alice.id, 'Session persists after simulated browser reload');
  assert(authManager.getDraft('swap-two-variables') === aliceCode, 'Code draft persists after browser reload');

  // TEST 7: Submission Persistence & Point Accumulation
  console.log('\n--- Test Group 4: Submission Persistence & Scoring ---');
  const submission1 = await authManager.saveSubmission({
    exerciseSlug: 'swap-two-variables',
    submittedCode: aliceCode,
    verdict: 'accepted',
    score: 100,
    totalPoints: 100,
    passedTestsCount: 4,
    totalTestsCount: 4,
    executionTimeMs: 42,
  });

  assert(submission1.userId === alice.id, 'Submission is strictly attributed to Alice user ID');
  assert(submission1.verdict === 'accepted', 'Submission verdict recorded correctly');
  assert(authManager.getCurrentUser().points === 100, 'User awarded 100 points for accepted submission');

  // Duplicate submission on same exercise should not double award points
  await authManager.saveSubmission({
    exerciseSlug: 'swap-two-variables',
    submittedCode: aliceCode,
    verdict: 'accepted',
    score: 100,
    totalPoints: 100,
    passedTestsCount: 4,
    totalTestsCount: 4,
    executionTimeMs: 38,
  });
  assert(authManager.getCurrentUser().points === 100, 'Duplicate accepted submission does not artificially double count points');

  const aliceSubmissions = authManager.getSubmissionsForExercise('swap-two-variables');
  assert(aliceSubmissions.length === 2, 'Alice has 2 saved submissions for swap-two-variables');

  // TEST 8: Multi-Tenant Data Isolation (Tenant B cannot access Tenant A data)
  console.log('\n--- Test Group 5: Strict Multi-Tenant Data Isolation ---');
  const bob = await authManager.signUp('bob@test.com', 'password456', 'Bob Tran');
  assert(authManager.getCurrentUser().id === bob.id, 'Bob is now the active user');
  assert(bob.points === 0, 'Bob starts with 0 points');

  // Bob must NOT see Alice's code draft
  const bobDraft = authManager.getDraft('swap-two-variables');
  assert(bobDraft === null, 'Bob has NO access to Alice code draft (Tenant Isolation verified)');

  // Bob must NOT see Alice's submissions
  const bobSubmissions = authManager.getSubmissionsForExercise('swap-two-variables');
  assert(bobSubmissions.length === 0, 'Bob cannot see Alice submissions (Strict isolation verified)');

  // Bob saves his own code draft
  const bobCode = '# Bob solution\nprint("Hello")';
  authManager.saveDraft('swap-two-variables', bobCode);
  assert(authManager.getDraft('swap-two-variables') === bobCode, 'Bob draft saved under Bob tenant scope');

  // Switch back to Alice
  await authManager.signIn('alice@test.com', 'password123');
  assert(authManager.getCurrentUser().id === alice.id, 'Switched back to Alice');
  assert(authManager.getDraft('swap-two-variables') === aliceCode, 'Alice draft remains untouched and intact');
  assert(authManager.getSubmissionsForExercise('swap-two-variables').length === 2, 'Alice still sees her 2 submissions');

  // TEST 9: Database Schema and RLS Policies Verification
  console.log('\n--- Test Group 6: Database Schema & RLS Policy Verification ---');
  const schemaPath = path.resolve(__dirname, '../supabase/migrations/001_initial_schema.sql');
  const rlsPath = path.resolve(__dirname, '../supabase/migrations/002_rls_policies.sql');

  assert(fs.existsSync(schemaPath), '001_initial_schema.sql exists in migrations directory');
  assert(fs.existsSync(rlsPath), '002_rls_policies.sql exists in migrations directory');

  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const rlsContent = fs.readFileSync(rlsPath, 'utf8');

  // Verify all 12 core tables are created
  const requiredTables = [
    'profiles', 'courses', 'topics', 'lessons', 'exercises',
    'examples', 'test_cases', 'submissions', 'test_results',
    'skills', 'skill_mastery', 'ai_settings'
  ];

  for (const tbl of requiredTables) {
    const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${tbl}`, 'i');
    assert(tableRegex.test(schemaContent), `Schema includes table public.${tbl}`);
  }

  // Verify RLS is enabled on all required tables
  for (const tbl of requiredTables) {
    const rlsRegex = new RegExp(`ALTER TABLE public\\.${tbl} ENABLE ROW LEVEL SECURITY;`, 'i');
    assert(rlsRegex.test(rlsContent), `RLS enabled on public.${tbl}`);
  }

  // TEST 10: RLS Security Policies for Sensitive Entities
  console.log('\n--- Test Group 7: RLS Security Shield & Hidden Test Protection ---');
  // Check test_cases policy: ordinary users cannot query hidden tests
  const testCasesHiddenPolicy = /CREATE POLICY "Learners can only view public test cases"[\s\S]*?ON public\.test_cases[\s\S]*?USING \(is_hidden = false\);/i;
  assert(testCasesHiddenPolicy.test(rlsContent), 'RLS policy on test_cases enforces is_hidden = false for ordinary queries');

  // Check submissions policy: users only see own submissions
  const submissionsOwnerPolicy = /CREATE POLICY "Users can view own submissions only"[\s\S]*?ON public\.submissions[\s\S]*?USING \(auth\.uid\(\) = user_id\);/i;
  assert(submissionsOwnerPolicy.test(rlsContent), 'RLS policy enforces auth.uid() = user_id on submissions');

  // Check AI credentials policy: users only manage own AI credentials
  const aiSettingsPolicy = /CREATE POLICY "Users can only view and manage own AI credentials"[\s\S]*?ON public\.ai_settings[\s\S]*?USING \(auth\.uid\(\) = user_id\);/i;
  assert(aiSettingsPolicy.test(rlsContent), 'RLS policy enforces auth.uid() = user_id on ai_settings (BYOK Shield)');

  // TEST 11: Client Bundle Credential Leak Shield
  console.log('\n--- Test Group 8: Secret Credential Leak Protection ---');
  const clientDir = path.resolve(__dirname, '../src');

  function findFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        findFiles(fullPath, fileList);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const allSourceFiles = findFiles(clientDir);
  let secretLeakedInClient = false;
  let leakedFile = '';

  for (const file of allSourceFiles) {
    // Only src/lib/supabase/admin.ts is allowed to reference SUPABASE_SERVICE_ROLE_KEY
    if (file.endsWith('admin.ts')) continue;

    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      secretLeakedInClient = true;
      leakedFile = file;
      break;
    }
  }

  assert(!secretLeakedInClient, `No client file references SUPABASE_SERVICE_ROLE_KEY (checked ${allSourceFiles.length} files)`);
  if (secretLeakedInClient) {
    console.error(`Leak detected in: ${leakedFile}`);
  }

  // Summary
  console.log('\n=============================================================');
  console.log(`🏁 PHASE 5 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('=============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test Suite encountered fatal error:', err);
  process.exit(1);
});
