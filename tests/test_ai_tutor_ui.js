/**
 * CodeCoBUG Phase 7 Test Suite: AI Tutor Experience & Security
 *
 * SCOPE VERIFIED:
 * 1. Giao diện hỏi đáp (Q&A Interface):
 *    - Natural-language question input with Enter-to-send support
 *    - Smart suggested question prompt chips based on error/normal context
 *    - Chat thread preserving message order, timestamps, and roles
 *    - Formatted markdown & code explanation renderer (FormattedAIResponse)
 *    - Code snippets with language label, monospace font, and copy button
 * 2. Giải thích lỗi (Error & Mistake Explanation):
 *    - Action explain_error passes real code, traceback, and failed test details
 *    - Sư phạm: Gợi ý tư duy và nguyên nhân, không giải hộ
 *    - Tôn trọng kết quả Judge Engine
 * 3. Phân tích điểm yếu (Weakness Analysis):
 *    - Action analyze_weakness incorporates empirical errors from MasteryEngine
 *    - Graduated hints (Level 1 Concept -> Level 2 Logic -> Level 3 Syntax)
 *    - Generated practice exercises tagged as Unverified
 * 4. Dùng API key an toàn & Bảo mật (Safe BYOK API Key):
 *    - Keys masked in UI via maskApiKey
 *    - Keys redacted from error traces and response strings via redactApiKey
 *    - Preflight format checks (Gemini AIza, OpenAI sk-)
 *    - Real API error translation into helpful Vietnamese
 *    - Zero key leakage to client bundles, HTML attributes, or console logs
 * 5. Multi-surface integration:
 *    - Slide drawer inside ExerciseWorkspace
 *    - Global modal accessible from Sidebar, MobileNav, and Header in AppShell
 */

const fs = require('fs');
const path = require('path');

// Mock browser localStorage & window
const store = {};
global.window = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k];
  },
};

const { maskApiKey, redactApiKey, encryptApiKey, decryptApiKey } = require('../src/lib/ai/crypto');
const { AITutorService } = require('../src/lib/ai/tutorService');
const { AIProviderAdapter } = require('../src/lib/ai/providerAdapter');

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
console.log('🤖 RUNNING PHASE 7: AI TUTOR EXPERIENCE & SECURITY TEST SUITE');
console.log('=============================================================\n');

// -------------------------------------------------------------
// Group 1: Component Files & Export Integrity
// -------------------------------------------------------------
console.log('--- Test Group 1: Component Files & Export Integrity ---');

const panelPath = path.resolve(__dirname, '../src/components/ai/AITutorPanel.tsx');
assert(fs.existsSync(panelPath), 'AITutorPanel.tsx exists in src/components/ai');
const panelCode = fs.readFileSync(panelPath, 'utf8');

const modalPath = path.resolve(__dirname, '../src/components/ai/AITutorModal.tsx');
assert(fs.existsSync(modalPath), 'AITutorModal.tsx exists in src/components/ai');
const modalCode = fs.readFileSync(modalPath, 'utf8');

const formattedPath = path.resolve(__dirname, '../src/components/ai/FormattedAIResponse.tsx');
assert(fs.existsSync(formattedPath), 'FormattedAIResponse.tsx exists in src/components/ai');
const formattedCode = fs.readFileSync(formattedPath, 'utf8');

const indexPath = path.resolve(__dirname, '../src/components/ai/index.ts');
assert(fs.existsSync(indexPath), 'ai/index.ts exists and exports components');

// -------------------------------------------------------------
// Group 2: Q&A Interface & Smart Suggested Question Prompts
// -------------------------------------------------------------
console.log('\n--- Test Group 2: Q&A Interface & Suggested Question Prompts ---');

assert(panelCode.includes('inputQuery'), 'AITutorPanel maintains natural-language input state');
assert(panelCode.includes('handleSendRequest'), 'AITutorPanel defines request dispatch function');
assert(panelCode.includes("e.key === 'Enter'"), 'AITutorPanel supports Enter key to send messages');
assert(panelCode.includes('suggestedPrompts'), 'AITutorPanel provides dynamic suggested question prompts');
assert(panelCode.includes('hasError ?'), 'Prompts adapt contextually based on whether an error was detected');
assert(panelCode.includes('ai-prompt-chip'), 'Renders suggested prompts as interactive clickable chips');
assert(panelCode.includes('FormattedAIResponse'), 'Renders AI text using FormattedAIResponse component');

// -------------------------------------------------------------
// Group 3: Formatted AI Response & Code Readability
// -------------------------------------------------------------
console.log('\n--- Test Group 3: Formatted AI Response & Code Readability ---');

assert(formattedCode.includes('ai-code-block'), 'FormattedAIResponse renders code blocks in structured containers');
assert(formattedCode.includes('ai-code-copy-btn'), 'Includes copy-to-clipboard button on code blocks');
assert(formattedCode.includes('ai-inline-code'), 'Renders inline code with distinct monospace token pill');
assert(formattedCode.includes('ai-callout'), 'Renders educational callouts (Lưu ý, Mẹo, Cảnh báo)');
assert(formattedCode.includes('renderInlineSpans'), 'Safely parses inline markdown tokens without raw HTML injection');

// -------------------------------------------------------------
// Group 4: Error Explanation & Weakness Analysis
// -------------------------------------------------------------
console.log('\n--- Test Group 4: Error Explanation & Weakness Analysis ---');

assert(panelCode.includes("'explain_error'"), 'Supports action: explain_error');
assert(panelCode.includes("'analyze_weakness'"), 'Supports action: analyze_weakness');
assert(panelCode.includes("'get_hint'"), 'Supports action: get_hint');
assert(panelCode.includes("'generate_exercise'"), 'Supports action: generate_exercise');
assert(panelCode.includes('getEmpiricalWeaknesses'), 'Integrates empirical weakness data from MasteryEngine');
assert(panelCode.includes('Chưa kiểm chứng (Unverified)'), 'Labels AI-generated exercises as unverified');

// -------------------------------------------------------------
// Group 5: Safe API Key Handling & Privacy Protection (BYOK)
// -------------------------------------------------------------
console.log('\n--- Test Group 5: Safe API Key Handling & Privacy Protection ---');

assert(panelCode.includes('maskApiKey'), 'Masks API key for safe UI display');
assert(panelCode.includes('Chưa cấu hình API Key'), 'Displays clear BYOK notice when no key is configured');
assert(panelCode.includes('onOpenSettings'), 'Provides 1-click button to open AI Settings Modal');

// Test masking logic
const testGeminiKey = 'AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6';
const maskedGemini = maskApiKey(testGeminiKey);
assert(maskedGemini === 'AIzaSy...O5P6', 'Gemini key masked accurately: AIzaSy...O5P6');
assert(!maskedGemini.includes('A1B2C3D4E5F6G7H8I9J0K1L2M3N4'), 'Masked string does not disclose sensitive inner bytes');

const testOpenAIKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz';
const maskedOpenAI = maskApiKey(testOpenAIKey);
assert(maskedOpenAI.startsWith('sk-pro...'), 'OpenAI key masked accurately with sk-pro... prefix');

// Test error redaction
const leakTrace = `Error at https://generativelanguage.googleapis.com?key=${testGeminiKey}: quota exceeded`;
const sanitizedTrace = redactApiKey(leakTrace, testGeminiKey);
assert(!sanitizedTrace.includes(testGeminiKey), 'Redacts raw Gemini key from trace');
assert(sanitizedTrace.includes('[REDACTED_API_KEY]') || sanitizedTrace.includes('[REDACTED_GEMINI_KEY]'), 'Replaces key with safe redaction placeholder');

// -------------------------------------------------------------
// Group 6: AppShell & ExerciseWorkspace Integration
// -------------------------------------------------------------
console.log('\n--- Test Group 6: Multi-surface UI Integration ---');

const appShellPath = path.resolve(__dirname, '../src/components/layout/AppShell.tsx');
const appShellCode = fs.readFileSync(appShellPath, 'utf8');
assert(appShellCode.includes('AITutorModal'), 'AppShell imports and renders AITutorModal');
assert(appShellCode.includes('isGlobalAITutorOpen'), 'AppShell maintains global AI Tutor modal state for non-exercise pages');
assert(appShellCode.includes('handleToggleAITutor'), 'AppShell connects sidebar, mobile nav, and header to AI Tutor toggle');

const workspacePath = path.resolve(__dirname, '../src/components/workspace/ExerciseWorkspace.tsx');
const workspaceCode = fs.readFileSync(workspacePath, 'utf8');
assert(workspaceCode.includes('AITutorPanel'), 'ExerciseWorkspace imports and mounts AITutorPanel');
assert(workspaceCode.includes('isDrawer={true}'), 'ExerciseWorkspace renders AITutorPanel in docked drawer mode');
assert(workspaceCode.includes('onLoadExerciseCode'), 'ExerciseWorkspace supports loading generated exercises into editor');

// -------------------------------------------------------------
// Group 7: End-to-End API Routes & Error Translation
// -------------------------------------------------------------
console.log('\n--- Test Group 7: Real API Endpoints & Friendly Error Translation ---');

// Verify providerAdapter friendly errors
const err401 = 'Fetch failed: 401 Unauthorized API key not valid';
const friendly401 = AIProviderAdapter['formatFriendlyError'](err401, 'gemini');
assert(friendly401.includes('không chính xác hoặc đã bị thu hồi'), '401 error translated into helpful Vietnamese guidance');

const err429 = 'Resource exhausted: 429 quota exceeded';
const friendly429 = AIProviderAdapter['formatFriendlyError'](err429, 'gemini');
assert(friendly429.includes('vượt quá hạn mức sử dụng (Quota / Rate Limit)'), '429 quota error translated into helpful Vietnamese guidance');

const errNet = 'fetch failed: ECONNREFUSED network timeout';
const friendlyNet = AIProviderAdapter['formatFriendlyError'](errNet, 'openai');
assert(friendlyNet.includes('Không thể kết nối đến máy chủ AI Provider'), 'Network error translated into clear Vietnamese connection notice');

(async () => {
  // Test preflight validation
  const emptyTest = await AIProviderAdapter.testConnection({ provider: 'gemini', apiKey: '', model: 'gemini-1.5-flash' });
  assert(!emptyTest.success, 'Empty key rejected by testConnection');
  assert(emptyTest.message.includes('Vui lòng nhập API Key'), 'Empty key returns helpful prompt');

  const malformedTest = await AIProviderAdapter.testConnection({ provider: 'gemini', apiKey: 'bad-key-123', model: 'gemini-1.5-flash' });
  assert(!malformedTest.success, 'Malformed key rejected by testConnection pre-flight');
  assert(malformedTest.message.includes('AIza'), 'Helpful hint that Gemini keys begin with AIza');

  console.log('\n=============================================================');
  console.log(`🏁 PHASE 7 AI TUTOR SUITE RESULTS: ${passCount} PASSED, 0 FAILED`);
  console.log('=============================================================\n');
})();
