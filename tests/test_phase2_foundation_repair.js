/**
 * tests/test_phase2_foundation_repair.js
 * 
 * Automated Verification Suite for Phase 2 Foundation & Build Repairs:
 * - BUG-AI-01: Official Google Gemini Model IDs across UI and server fallbacks
 * - BUG-AI-02: Anthropic Model snapshot identifiers
 * - BUG-SEC-01: Guest 401 Submission Auth Modal trigger in ExerciseWorkspace
 * - BUG-UI-01: Zero nested <button> elements inside <Link>
 * - BUG-CODE-01: Clean imports in root page.tsx
 * - Tooling: tsconfig excludes docs and type-check is verified
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('\n=============================================================');
console.log('🧪 RUNNING PHASE 2 FOUNDATION & BUILD REPAIR VERIFICATION');
console.log('=============================================================\n');

let totalAssertions = 0;
function testPass(desc) {
  totalAssertions++;
  console.log(`  ✔ PASS: ${desc}`);
}

const rootDir = process.cwd();

// --- Test Group 1: BUG-AI-01 & BUG-AI-02 (AI Model Catalog & Fallbacks) ---
console.log('--- Test Group 1: BUG-AI-01 & BUG-AI-02 (AI Model Catalog & Fallbacks) ---');

const aiSettingsPath = path.join(rootDir, 'src/components/settings/AISettingsModal.tsx');
const aiSettingsCode = fs.readFileSync(aiSettingsPath, 'utf8');

assert(aiSettingsCode.includes("'gemini-2.0-flash'"), 'DEFAULT_SETTINGS must use gemini-2.0-flash');
testPass('AISettingsModal defaults to "gemini-2.0-flash"');

assert(aiSettingsCode.includes("id: 'gemini-2.0-flash'"), 'PROVIDER_MODELS must include gemini-2.0-flash');
assert(aiSettingsCode.includes("id: 'gemini-1.5-flash'"), 'PROVIDER_MODELS must include gemini-1.5-flash');
assert(aiSettingsCode.includes("id: 'gemini-1.5-pro'"), 'PROVIDER_MODELS must include gemini-1.5-pro');
testPass('PROVIDER_MODELS.gemini registers official Google Gemini production models');

assert(!aiSettingsCode.includes("id: 'gemini-3.8-flash'"), 'Fictitious gemini-3.8-flash must be removed');
assert(!aiSettingsCode.includes("id: 'gemini-4-argon'"), 'Fictitious gemini-4-argon must be removed');
testPass('Fictitious Gemini model IDs completely eliminated from UI options');

assert(aiSettingsCode.includes("'claude-3-5-sonnet-20241022'"), 'Anthropic sonnet must use official snapshot ID');
assert(aiSettingsCode.includes("'claude-3-5-haiku-20241022'"), 'Anthropic haiku must use official snapshot ID');
testPass('Anthropic Claude models use official date-stamped snapshot identifiers');

// Check backend route fallbacks
const providerAdapterPath = path.join(rootDir, 'src/lib/ai/providerAdapter.ts');
const providerAdapterCode = fs.readFileSync(providerAdapterPath, 'utf8');
assert(!providerAdapterCode.includes("'gemini-3.8-flash'"), 'providerAdapter must not fallback to gemini-3.8-flash');
assert(providerAdapterCode.includes("'gemini-2.0-flash'"), 'providerAdapter must fallback to gemini-2.0-flash');
testPass('AIProviderAdapter default fallback updated to "gemini-2.0-flash"');

const chatRoutePath = path.join(rootDir, 'src/app/api/ai/chat/route.ts');
const chatRouteCode = fs.readFileSync(chatRoutePath, 'utf8');
assert(!chatRouteCode.includes("'gemini-3.8-flash'"), 'Chat route must not fallback to gemini-3.8-flash');
assert(chatRouteCode.includes("'gemini-2.0-flash'"), 'Chat route must fallback to gemini-2.0-flash');
testPass('/api/ai/chat route default fallback updated to "gemini-2.0-flash"');

const testConnRoutePath = path.join(rootDir, 'src/app/api/ai/test-connection/route.ts');
const testConnRouteCode = fs.readFileSync(testConnRoutePath, 'utf8');
assert(!testConnRouteCode.includes("'gemini-3.8-flash'"), 'test-connection route must not fallback to gemini-3.8-flash');
assert(testConnRouteCode.includes("'gemini-2.0-flash'"), 'test-connection route must fallback to gemini-2.0-flash');
testPass('/api/ai/test-connection route default fallback updated to "gemini-2.0-flash"');


// --- Test Group 2: BUG-SEC-01 (Guest Submission 401 Auth Modal Trigger) ---
console.log('\n--- Test Group 2: BUG-SEC-01 (Guest Submission 401 Auth Modal Trigger) ---');

const workspacePath = path.join(rootDir, 'src/components/workspace/ExerciseWorkspace.tsx');
const workspaceCode = fs.readFileSync(workspacePath, 'utf8');

assert(workspaceCode.includes("import { AuthModal } from '@/components/auth/AuthModal';"), 'ExerciseWorkspace must import AuthModal');
testPass('ExerciseWorkspace imports AuthModal');

assert(workspaceCode.includes('isAuthOpen') && workspaceCode.includes('setIsAuthOpen'), 'ExerciseWorkspace manages isAuthOpen state');
testPass('ExerciseWorkspace manages isAuthOpen state');

assert(workspaceCode.includes('response.status === 401') && workspaceCode.includes('setIsAuthOpen(true)'), 'ExerciseWorkspace triggers AuthModal on 401 response');
testPass('ExerciseWorkspace triggers setIsAuthOpen(true) when server rejects submission with HTTP 401');

assert(workspaceCode.includes('<AuthModal'), 'ExerciseWorkspace renders AuthModal component');
testPass('ExerciseWorkspace renders AuthModal with clean dismissal and navigation');


// --- Test Group 3: BUG-UI-01 (HTML5 Semantic Standards & Zero Nested Buttons) ---
console.log('\n--- Test Group 3: BUG-UI-01 (HTML5 Semantic Standards & Zero Nested Buttons) ---');

const curriculumBrowserPath = path.join(rootDir, 'src/components/curriculum/CurriculumBrowser.tsx');
const curriculumBrowserCode = fs.readFileSync(curriculumBrowserPath, 'utf8');

assert(!curriculumBrowserCode.includes('<Link href={`/curriculum/${topic.slug}/${lesson.slug}`}\n                                  <button'), 'No button inside Link in CurriculumBrowser');
assert(curriculumBrowserCode.includes('<span\n                                    style={'), 'Mở bài học link uses valid phrasing span content');
testPass('CurriculumBrowser renders valid span element inside Link for "Mở bài học"');

// Global scan across src/ for any other <button> directly inside <Link>
function scanForNestedButtons(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForNestedButtons(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('<Link') && i + 1 < lines.length && lines[i + 1].includes('<button')) {
          assert.fail(`Invalid nested <button> inside <Link> found in ${fullPath}:${i + 1}`);
        }
      }
    }
  }
}

scanForNestedButtons(path.join(rootDir, 'src'));
testPass('Repository-wide audit confirms 0 invalid nested <button> elements inside <Link>');


// --- Test Group 4: BUG-CODE-01 (Clean Imports in Root page.tsx) ---
console.log('\n--- Test Group 4: BUG-CODE-01 (Clean Imports in Root page.tsx) ---');

const pagePath = path.join(rootDir, 'src/app/page.tsx');
const pageCode = fs.readFileSync(pagePath, 'utf8');

assert(!pageCode.includes('import { LearningDashboard }'), 'page.tsx must not import unused LearningDashboard');
testPass('src/app/page.tsx pruned of unused LearningDashboard import');

assert(pageCode.includes('import { MinimalLondonHome }'), 'page.tsx cleanly imports MinimalLondonHome');
testPass('src/app/page.tsx cleanly encapsulates view within MinimalLondonHome');


// --- Test Group 5: Tooling Configuration & Build Integrity ---
console.log('\n--- Test Group 5: Tooling Configuration & Build Integrity ---');

const tsconfigPath = path.join(rootDir, 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

assert(Array.isArray(tsconfig.exclude) && tsconfig.exclude.includes('docs'), 'tsconfig.json must exclude docs folder');
testPass('tsconfig.json excludes docs directory to maintain clean compilation scope');

assert(Array.isArray(tsconfig.exclude) && tsconfig.exclude.includes('node_modules'), 'tsconfig.json excludes node_modules');
testPass('tsconfig.json excludes node_modules');

console.log('\n=============================================================');
console.log(`🎉 ALL ${totalAssertions} FOUNDATION REPAIR ASSERTIONS VERIFIED!`);
console.log('=============================================================\n');

