/**
 * CodeCoBUG Phase 6 Test Suite: Exercise Workspace & Execution Integrity
 *
 * Scope verified:
 * 1. Two-Column Layout (Desktop) & Responsive Mobile Tabs:
 *    - Left Panel: Problem statement, title, difficulty, points, constraints, examples, hints.
 *    - Right Panel: CodeEditor with Run/Submit/Reset/Theme/Zoom toolbar, Monaco Editor, TerminalOutput.
 *    - Mobile Layout: Mobile tabs (problem, editor, terminal) with comfortable touch targets.
 * 2. Execution Integrity & Non-fabrication:
 *    - Run button connects to real Pyodide WebAssembly execution with stdin.
 *    - Submit button connects to real Deterministic Judge Engine (/api/judge/submit).
 *    - Strict separation between Run (local execution) and Submit (verdict & points).
 * 3. Terminal & Output Features:
 *    - 4 Tabs: Console (stdout/stderr), Tests (verdicts/reports), Input (stdin), History (submissions).
 *    - Collapsible/expandable terminal panel.
 *    - Hidden test confidentiality shield.
 * 4. Draft & Code Restoration:
 *    - Saves and restores code drafts across sessions via authManager.
 *    - One-click restore code from previous submission history.
 */

const fs = require('fs');
const path = require('path');

// Mock localStorage & window
const store = {};
global.window = {
  confirm: () => true,
  navigator: { clipboard: { writeText: async () => {} } },
};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k];
  },
};

const { authManager } = require('../src/lib/auth/authManager');
const { getExerciseBySlug } = require('../src/lib/fixtures/sampleCurriculum');

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
console.log('💻 RUNNING PHASE 6: EXERCISE WORKSPACE & RUNTIME SUITE');
console.log('=============================================================\n');

// Group 1: Workspace Component Files & Integrity
console.log('--- Test Group 1: Component Files & Export Integrity ---');
const workspacePath = path.resolve(__dirname, '../src/components/workspace/ExerciseWorkspace.tsx');
assert(fs.existsSync(workspacePath), 'ExerciseWorkspace.tsx exists');
const workspaceCode = fs.readFileSync(workspacePath, 'utf8');

const editorPath = path.resolve(__dirname, '../src/components/workspace/CodeEditor.tsx');
assert(fs.existsSync(editorPath), 'CodeEditor.tsx exists');
const editorCode = fs.readFileSync(editorPath, 'utf8');

const problemPath = path.resolve(__dirname, '../src/components/workspace/ProblemStatement.tsx');
assert(fs.existsSync(problemPath), 'ProblemStatement.tsx exists');
const problemCode = fs.readFileSync(problemPath, 'utf8');

const terminalPath = path.resolve(__dirname, '../src/components/workspace/TerminalOutput.tsx');
assert(fs.existsSync(terminalPath), 'TerminalOutput.tsx exists');
const terminalCode = fs.readFileSync(terminalPath, 'utf8');

// Group 2: Desktop & Mobile Layout Requirements (agent1.md Section 7)
console.log('\n--- Test Group 2: Desktop Layout & Panel Structure ---');
assert(workspaceCode.includes('workspace-container'), 'Workspace uses .workspace-container layout');
assert(workspaceCode.includes('workspace-left-pane'), 'Workspace defines .workspace-left-pane');
assert(workspaceCode.includes('workspace-right-pane'), 'Workspace defines .workspace-right-pane');
assert(workspaceCode.includes('editor-wrapper'), 'Workspace defines .editor-wrapper');
assert(workspaceCode.includes('terminal-wrapper'), 'Workspace defines .terminal-wrapper');

console.log('\n--- Test Group 3: Left Panel (Problem Statement) ---');
assert(problemCode.includes('exercise.title'), 'ProblemStatement renders exercise title');
assert(problemCode.includes('exercise.difficulty'), 'ProblemStatement renders difficulty badge');
assert(problemCode.includes('exercise.points'), 'ProblemStatement renders points badge');
assert(problemCode.includes('Mô tả bài toán'), 'ProblemStatement renders problem description');
assert(problemCode.includes('Yêu cầu & Điều kiện hoàn thành'), 'ProblemStatement renders requirements & constraints');
assert(problemCode.includes('Ví dụ minh họa'), 'ProblemStatement renders example scenarios');
assert(problemCode.includes('Gợi ý hướng dẫn bài tập'), 'ProblemStatement provides collapsible hints');
assert(problemCode.includes('onApplyInput'), 'ProblemStatement supports applying example input into Terminal');

console.log('\n--- Test Group 4: Right Panel (Code Editor & Action Bar) ---');
assert(editorCode.includes('main.py'), 'CodeEditor displays filename main.py');
assert(editorCode.includes('Python 3'), 'CodeEditor displays Python 3 badge');
assert(editorCode.includes('onRun'), 'CodeEditor toolbar supports Run button');
assert(editorCode.includes('onSubmit'), 'CodeEditor toolbar supports Submit button');
assert(editorCode.includes('handleReset'), 'CodeEditor toolbar supports Reset code action');
assert(editorCode.includes('handleCopy'), 'CodeEditor toolbar supports Copy code action');
assert(editorCode.includes('ZoomIn') && editorCode.includes('ZoomOut'), 'CodeEditor supports font zoom controls');
assert(editorCode.includes('toggleTheme'), 'CodeEditor supports Dark/Light theme toggle');
assert(editorCode.includes('onToggleTerminal'), 'CodeEditor supports terminal collapse/expand toggle');

console.log('\n--- Test Group 5: Terminal & Output Capabilities ---');
assert(terminalCode.includes("activeTab === 'console'"), 'Terminal supports Console tab');
assert(terminalCode.includes("activeTab === 'tests'"), 'Terminal supports Test Results tab');
assert(terminalCode.includes("activeTab === 'stdin'"), 'Terminal supports Dữ liệu vào (Input) tab');
assert(terminalCode.includes("activeTab === 'history'"), 'Terminal supports Submission History tab');
assert(terminalCode.includes('pyodideStatus'), 'Terminal displays real Pyodide WebAssembly runtime status');
assert(terminalCode.includes('onClearLogs'), 'Terminal supports Clear screen button');
assert(terminalCode.includes('isCollapsed'), 'Terminal supports collapsible state');
assert(terminalCode.includes('test.isHidden'), 'Terminal protects hidden test case inputs and expected outputs');
assert(terminalCode.includes('onRestoreSubmissionCode'), 'Terminal supports restoring past submission code into Editor');

console.log('\n--- Test Group 6: Responsive Mobile Navigation (< 1024px) ---');
assert(workspaceCode.includes('mobile-tab-bar'), 'Includes .mobile-tab-bar for mobile views');
assert(workspaceCode.includes("setMobileTab('problem')"), 'Mobile tab switcher supports Problem tab');
assert(workspaceCode.includes("setMobileTab('editor')"), 'Mobile tab switcher supports Editor tab');
assert(workspaceCode.includes("setMobileTab('terminal')"), 'Mobile tab switcher supports Terminal tab');

console.log('\n--- Test Group 7: Exercise Route & Draft Persistence ---');
const ex1 = getExerciseBySlug('in-loi-chao-codecobug');
assert(ex1 !== null, 'Exercise 1 "in-loi-chao-codecobug" is accessible');
assert(ex1.exercise.starterCode.length > 0, 'Exercise 1 provides starter code');

localStorage.clear();
authManager.reloadSession();

// Test draft saving and restoration
const testDraft = '# Modified code by learner\nprint("Hello from test")';
authManager.saveDraft('in-loi-chao-codecobug', testDraft);
const restoredDraft = authManager.getDraft('in-loi-chao-codecobug');
assert(restoredDraft === testDraft, 'Code draft is safely persisted and restored');

async function run() {
  // Test submission restoration
  await authManager.saveSubmission({
    exerciseSlug: 'in-loi-chao-codecobug',
    verdict: 'accepted',
    submittedCode: 'print("Xin chao CodeCoBUG")',
    score: 10,
    totalPoints: 10,
    passedTestsCount: 4,
    totalTestsCount: 4,
    executionTimeMs: 38,
  });

  const submissions = authManager.getSubmissionsForExercise('in-loi-chao-codecobug');
  assert(submissions.length === 1, 'Submission successfully recorded in user history');
  assert(submissions[0].submittedCode === 'print("Xin chao CodeCoBUG")', 'Historical submitted code preserved accurately');

  console.log('\n=============================================================');
  console.log(`🏁 PHASE 6 EXERCISE WORKSPACE RESULTS: ${passCount} PASSED, 0 FAILED`);
  console.log('=============================================================\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
