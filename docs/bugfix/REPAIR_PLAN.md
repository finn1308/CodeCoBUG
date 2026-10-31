# CODECOBUG — SYSTEMIC REPAIR PLAN & EXECUTION ROADMAP

**Document Version:** 2.0.0  
**Target Phase:** Phase 6 — Full Regression & Acceptance Verification  
**Date:** 2026-10-31  
**Author:** Senior Full-Stack Engineer, QA & Security Specialist  
**Status:** All Repair Stages Executed & Verified (100% Complete)  

---

## 1. Remediation Philosophy & Safety Guardrails

The repair strategy adheres strictly to professional software engineering best practices:
1. **Zero Unintended Breakage:** Changes must surgically target the defect without perturbing existing stable functionality or user customizations.
2. **Deterministic Verification:** Every fix must be paired with an automated assertion test to prove resolution and prevent regressions.
3. **Strict Secret Hygiene:** No API keys, credentials, or sensitive data will ever be logged or persisted in code.
4. **Staged Execution:** Fixes are prioritized and executed stage-by-stage from highest severity (P1) down to polish and tooling (P3).

---

## 2. Staged Repair Execution Sequence

```
┌────────────────────────────────────────────────────────┐
│ STAGE 1: Critical AI Provider Fix (BUG-AI-01)          │
│ P1: Update Gemini model IDs in UI & Server Defaults    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ STAGE 2: Compatibility & Auth Bridge (BUG-AI-02, SEC-01)│
│ P2: Anthropic version snapshots & 401 Auth Trigger     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ STAGE 3: HTML Semantics & Code Hygiene (UI-01, CODE-01)│
│ P3: Eliminate nested <button> & prune unused imports   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ STAGE 4: Performance & Tooling (PERF-01, UX-01)        │
│ P3: ESLint Next.js 16 readiness & Wasm prefetch note   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ STAGE 5: Comprehensive Regression & Verification Suite │
│ Execute new verification test + npm test + build       │
└────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Stage Specifications

---

### Stage 1: Google Gemini Model Catalog Remediation (`BUG-AI-01`)
- **Severity:** P1 (High / Functional)
- **Target Files:**
  - `src/components/settings/AISettingsModal.tsx`
  - `src/lib/ai/providerAdapter.ts`
  - `src/app/api/ai/chat/route.ts`
  - `src/app/api/ai/test-connection/route.ts`
- **Scope of Modification:**
  1. In `AISettingsModal.tsx`:
     - Update `DEFAULT_SETTINGS.model` from `'gemini-3.8-flash'` to `'gemini-2.0-flash'`.
     - Update `PROVIDER_MODELS.gemini` array to official v1beta production models:
       - `{ id: 'gemini-2.0-flash', name: 'Google Gemini 2.0 Flash (Khuyên dùng - Nhanh & Mới nhất)' }`
       - `{ id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash (Siêu tốc & Tiết kiệm)' }`
       - `{ id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro (Suy luận sâu & Code chuyên sâu)' }`
  2. In `src/lib/ai/providerAdapter.ts` (line 81):
     - Replace fallback `config.model || 'gemini-3.8-flash'` with `config.model || 'gemini-2.0-flash'`.
  3. In `src/app/api/ai/chat/route.ts` (line 49):
     - Replace fallback `'gemini-3.8-flash'` with `'gemini-2.0-flash'`.
  4. In `src/app/api/ai/test-connection/route.ts` (line 28):
     - Replace fallback `'gemini-3.8-flash'` with `'gemini-2.0-flash'`.
- **Blast Radius:** Isolated to AI Tutor and AI Settings configuration. Zero impact on curriculum, Pyodide runtime, or Judge Engine.
- **Rollback Procedure:** Revert the 4 files to their previous commits using git checkout.

---

### Stage 2: Anthropic Model Compatibility & Guest Auth Bridge (`BUG-AI-02`, `BUG-SEC-01`)
- **Severity:** P2 (Medium / Usability & Flow)
- **Target Files:**
  - `src/components/settings/AISettingsModal.tsx`
  - `src/components/workspace/ExerciseWorkspace.tsx`
- **Scope of Modification:**
  1. In `AISettingsModal.tsx`:
     - Update `PROVIDER_MODELS.anthropic` array:
       - `{ id: 'claude-3-5-sonnet-20241022', name: 'Anthropic Claude 3.5 Sonnet' }`
       - `{ id: 'claude-3-5-haiku-20241022', name: 'Anthropic Claude 3.5 Haiku' }`
  2. In `ExerciseWorkspace.tsx`:
     - Add `isAuthModalOpen` state or dispatch an event (`window.dispatchEvent(new CustomEvent('codecobug:open-auth'))`).
     - When `handleSubmit()` catches an HTTP 401 response from `/api/judge/submit`, automatically trigger the authentication modal and present a friendly notification:
       `"Bạn cần đăng nhập để chấm bài và lưu tiến độ. Bấm vào đây để đăng nhập mà không mất code đã viết."`
- **Blast Radius:** Only affects submission failure handling and Anthropic options.
- **Rollback Procedure:** Revert `ExerciseWorkspace.tsx` and `AISettingsModal.tsx`.

---

### Stage 3: HTML5 Semantic Validation & Code Cleanliness (`BUG-UI-01`, `BUG-CODE-01`)
- **Severity:** P3 (Low / Accessibility & Hygiene)
- **Target Files:**
  - `src/components/curriculum/CurriculumBrowser.tsx`
  - `src/app/page.tsx`
- **Scope of Modification:**
  1. In `CurriculumBrowser.tsx` (lines 832–853):
     - Replace the `<button type="button">` nested inside `<Link>` with a styled `<span>` with `display: inline-flex` (or apply button classes directly to `<Link>`).
     - Eliminates invalid DOM nesting warning: `<button>` inside `<a>`.
  2. In `src/app/page.tsx` (line 4):
     - Prune unused import `import { LearningDashboard } from '@/components/dashboard/LearningDashboard';`.
- **Blast Radius:** Purely markup and lint hygiene. Zero functional risk.
- **Rollback Procedure:** Single line git revert.

---

### Stage 4: Tooling & Performance Enhancements (`BUG-PERF-01`, `BUG-UX-01`)
- **Severity:** P3 (Low / Future-Proofing & Performance)
- **Target Files:**
  - `package.json`
  - `src/components/curriculum/CurriculumBrowser.tsx`
- **Scope of Modification:**
  1. Document ESLint Flat Config (`eslint.config.mjs`) upgrade path for Next.js 16 readiness.
  2. Add prefetch link hints for Pyodide assets when browsing curriculum cards.
- **Blast Radius:** Build configuration and asset preloading.

---

### Stage 5: Verification & Regression Test Suite
- **Action:**
  1. Create a dedicated verification test file: `tests/test_phase1_bugfix_verification.js`.
  2. Assertions to verify:
     - All Gemini model strings across modal and backend are legitimate official identifiers (`gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
     - Anthropic model strings include valid snapshot date formats.
     - Zero nested `<button>` tags inside `<Link>` in `CurriculumBrowser.tsx`.
     - Zero unused imports in `src/app/page.tsx`.
     - 401 response in `ExerciseWorkspace.tsx` correctly invokes auth modal trigger.
  3. Run full verification pipeline:
     - `npm run type-check`
     - `npm run lint`
     - `npm run build`
     - `npm test` (All 34 test suites + verification test)

---

## 4. Risk Assessment & Mitigation Matrix

| Potential Risk | Likelihood | Impact | Preventive Mitigation |
| :--- | :--- | :--- | :--- |
| Breaking user's existing saved AI settings in localStorage | Low | Medium | Ensure fallback code handles legacy strings gracefully by auto-migrating legacy `gemini-3.8-flash` to `gemini-2.0-flash`. |
| Breaking existing test assertions in `test_ai_tutor.js` | Low | High | Pre-check `test_ai_tutor.js` to ensure assertions test regex/cryptography rather than hardcoded `gemini-3.8-flash`. |
| Loss of unsaved code during 401 Auth flow | Low | Critical | Code in Monaco editor is preserved in React state and localStorage draft regardless of auth state. |

