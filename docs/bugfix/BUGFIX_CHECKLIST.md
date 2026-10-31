# CODECOBUG — BUGFIX EXECUTION CHECKLIST

**Document Version:** 1.0.0  
**Phase:** Phase 1 (Audit Complete) $\to$ Phase 2 (Execution Ready)  
**Date:** 2026-10-31  
**Lead Engineer:** Senior Full-Stack Engineer, QA & Security Specialist  

---

## Phase 1: Comprehensive Repository Audit (COMPLETED)

### Static Diagnostics & Build Baseline
- [x] Run `node -v` (Confirmed v26.7.0) and `npm -v` (Confirmed 11.19.0).
- [x] Run `npm run type-check` (`tsc --noEmit`) $\to$ 0 errors.
- [x] Run `npm run lint` (`next lint`) $\to$ 0 errors, 0 warnings (deprecation note logged).
- [x] Run `npm run build` (`next build`) $\to$ 70/70 static pages generated in 938ms.
- [x] Execute all 34 regression test suites (`npm test`) $\to$ 3,645/3,645 assertions passed (100%).
- [x] Perform live HTTP status probe against Next.js production daemon on port 3001.

### Curriculum & System Asset Audit
- [x] Audit all 12 Chapters and 44 Lessons for 10-section pedagogical standard compliance.
- [x] Verify zero broken prerequisites and zero circular dependencies across lesson graph.
- [x] Audit all 87 Exercises (61 Fundamentals + 26 PBL Checkpoints) for starter code, hints, and points.
- [x] Audit all server-side test configurations ($\ge 3$ test cases, public + hidden tests per exercise).

### Deliverables Generated
- [x] `docs/bugfix/BUG_INVENTORY.md` — Complete catalog of 7 confirmed defects.
- [x] `docs/bugfix/ROOT_CAUSE_ANALYSIS.md` — 5-Whys root cause analysis across 6 architectural dimensions.
- [x] `docs/bugfix/TEST_BASELINE.md` — Detailed empirical diagnostic audit report.
- [x] `docs/bugfix/REPAIR_PLAN.md` — Staged remediation roadmap with rollback strategies.
- [x] `docs/bugfix/BUGFIX_CHECKLIST.md` — Granular execution and verification checklist.

---

## Phase 2: Staged Defect Remediation (COMPLETED & VERIFIED)

### Stage 1: P1 Functional Fixes — Google Gemini Model Catalog (`BUG-AI-01`)
- [x] Update `DEFAULT_SETTINGS.model` in `AISettingsModal.tsx` to `'gemini-2.0-flash'`.
- [x] Replace fictitious model IDs in `PROVIDER_MODELS.gemini` with official production IDs (`gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
- [x] Update default fallback string in `src/lib/ai/providerAdapter.ts` (line 81) to `'gemini-2.0-flash'`.
- [x] Update default fallback string in `src/app/api/ai/chat/route.ts` (line 49) to `'gemini-2.0-flash'`.
- [x] Update default fallback string in `src/app/api/ai/test-connection/route.ts` (line 28) to `'gemini-2.0-flash'`.
- [x] Verify backward compatibility: ensure existing user settings with legacy model names smoothly migrate.

### Stage 2: P2 Usability & Flow Fixes — Anthropic IDs & 401 Auth Bridge (`BUG-AI-02`, `BUG-SEC-01`)
- [x] Update `PROVIDER_MODELS.anthropic` in `AISettingsModal.tsx` with dated snapshot IDs (`claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`).
- [x] In `ExerciseWorkspace.tsx`, connect 401 response handling to trigger authentication modal directly.
- [x] Ensure student code draft in Monaco Editor is preserved during the login transition.
- [x] Add inline clickable authentication prompt in Terminal output upon 401 error.

### Stage 3: P3 Polish & HTML Validation (`BUG-UI-01`, `BUG-CODE-01`)
- [x] In `CurriculumBrowser.tsx` (lines 832–853), replace nested `<button>` inside `<Link>` with a styled `<span>` or direct link button class.
- [x] In `src/app/page.tsx` (line 4), remove unused `import { LearningDashboard }` (encapsulated in `MinimalLondonHome`).
- [x] Verify zero DOM nesting warnings in browser console during curriculum navigation.

### Stage 4: Tooling & Performance Optimization (`BUG-PERF-01`, `BUG-UX-01`)
- [x] Exclude `docs/` from `tsconfig.json` to keep TypeScript compilation scope clean.
- [x] Document ESLint Flat Config (`eslint.config.mjs`) migration codemod for Next.js 16 readiness.
- [x] Document prefetch hints on curriculum cards for Pyodide WebAssembly assets.

### Stage 5: Verification & Full Regression Testing
- [x] Author automated verification test script: `tests/test_phase2_foundation_repair.js`.
- [x] Run `npm run type-check` (Passed with 0 errors).
- [x] Run `npm run lint` (Passed with 0 errors).
- [x] Run `npm run build` (Production build generated 70/70 pages in 979ms).
- [x] Run `npm test` (All 35 regression suites passed 100% with over 3,700 assertions).
- [x] Verify live application on port 3001 using curl probe (all routes returned 200 OK, APIs 401/400).
- [x] Update defect inventory and repair checklist.

---

## Phase 3: UI, Routing and Interaction Repair (COMPLETED & VERIFIED)

### Routing & SSG Pre-rendering Architecture (`BUG-UI-02`)
- [x] Implement `generateStaticParams()` in `src/app/exercises/[exerciseSlug]/page.tsx` for all 87 authoring exercises.
- [x] Verify production build statically prerenders 157/157 static pages (0 dynamic fallback overhead).
- [x] Verify HTTP 200 OK across core routes and all project checkpoint exercises.

### IME Composition Protection for Vietnamese / East Asian Telex (`BUG-INT-01`)
- [x] In `src/components/navigation/CommandCenter.tsx`, guard `Enter` key with `!e.isComposing`.
- [x] In `src/components/ai/AITutorPanel.tsx`, guard `Enter` key with `!e.nativeEvent.isComposing` and add `e.preventDefault()`.
- [x] Verify typing Vietnamese accents (e.g., "Toán tử", "Lỗi") does not trigger accidental premature form submissions.

### Interactive Controls & State Bridges (`BUG-UI-03`, `BUG-UI-04`, `BUG-INT-02`)
- [x] In `src/components/projects/ProjectDetail.tsx`, add interactive copy button for terminal setup commands with tactile "Đã sao chép" feedback.
- [x] In `src/components/workspace/TerminalOutput.tsx`, render interactive `[Đăng nhập hoặc Đăng ký ngay]` button directly beneath 401 unauthenticated error lines.
- [x] In `src/components/layout/AppShell.tsx`, install global custom event listeners for `codecobug:open-auth`, `codecobug:open-settings`, and `codecobug:open-command-center`.
- [x] In `src/components/common/Header.tsx`, synchronize `initialTab={internalTrackerTab}` so opening tracker from standalone header defaults cleanly to `'queue'`.

### Modal & Drawer Keyboard Accessibility & Layouts
- [x] Verify Escape key traps across `Modal.tsx`, `CommandCenter.tsx`, `MobileNav.tsx`.
- [x] Verify backdrop click-outside dismissal across all modals and drawers.
- [x] Verify body background scrolling lock (`overflow: hidden`) and clean restoration on unmount.
- [x] Verify responsive mobile layouts (390px) and desktop layouts (1440px).

### Phase 3 Verification & Regression
- [x] Author automated verification test: `tests/test_phase3_ui_interaction_repair.js` (21 assertions passed).
- [x] Run `npm run type-check` (0 errors).
- [x] Run `npm run lint` (0 warnings, 0 errors).
- [x] Run `npm run build` (157/157 static pages compiled in 1369ms).
- [x] Run `npm test` (36/36 test suites passed, 100% success rate).
- [x] Update bug inventory and checklist.

---

## Phase 4: Backend & Data Integrity Repair (COMPLETED & VERIFIED)

### API Payload Parsing & Validation (`BUG-BE-01`)
- [x] Catch JSON parse errors gracefully with `.catch(() => null)` in `/api/judge/submit`.
- [x] Return HTTP 400 Bad Request on malformed, empty, or non-object payloads.
- [x] Enforce 100KB payload limit returning HTTP 413 Payload Too Large on oversized submissions.
- [x] Sanitize server internal errors: log detailed trace on server, return clean status message to client.

### Server-Side Persistence & Multi-Tenant Boundaries (`BUG-BE-02`, `BUG-BE-03`, `BUG-BE-04`)
- [x] Implement Node.js in-memory review queue fallback (`serverReviewQueueStore`) in `ReviewEngine`.
- [x] Auto-sync authoritative review queue recommendations immediately following code submission evaluation.
- [x] Support case-insensitive Bearer token prefixes (`/^bearer\s+/i`) in `serverAuth.ts`.
- [x] Safely guard cookie URI decoding with try/catch to avoid unhandled `URIError`.
- [x] Connect `getExerciseFromRegistry` and `getAllExercisesFromRegistry` to `submissionStore.ts` for slug resolution.
- [x] Enforce strict multi-tenant data isolation: User A cannot query User B's submissions or review queue.

### Verification & Automated Testing
- [x] Author comprehensive integration test: `tests/test_phase4_backend_data_integrity.js` (20/20 passed, 100%).
- [x] Run `npm run type-check` (0 errors).
- [x] Run `npm run lint` (0 errors, 0 warnings).
- [x] Run `npm run build` (157/157 static pages compiled cleanly).
- [x] Run full regression test suite (`npm test`, all 37 test suites passed, 0 failed).
- [x] Restart production server daemon on port 3001 and verify live endpoints.

---

## Phase 5: Python Learning System Verification (COMPLETED & VERIFIED)
- [x] Verify lesson loading & navigation across all 12 chapters and 44 lessons.
- [x] Verify exercises referencing correct lessons without broken references.
- [x] Verify code draft persistence via isolated `authManager.saveDraft` and `getDraft`.
- [x] Verify Pyodide WebAssembly execution with stdout/stderr capture and watchdog timeout.
- [x] Verify Run action separation: running code does not award points or mark exercises completed.
- [x] Verify Submit action invokes real judging pipeline with public and hidden test cases.
- [x] Verify distinguishing 5 verdict statuses: `accepted`, `wrong_answer`, `compile_error`, `runtime_error`, `time_limit_exceeded`.
- [x] Verify hidden test cases protection: inputData and expectedOutput strictly withheld from learner reports.
- [x] Verify AI Tutor BYOK key protection, graduated hints, and judge verdict non-contradiction invariant.
- [x] Author and pass dedicated acceptance test: `tests/test_phase5_python_learning_system_workflow.js` (9/9 passed, 100%).
- [x] Run `tests/test_phase5_python_learning_workspace.js` (60/60 passed, 100%).
- [x] Run `tests/test_phase5_e2e_acceptance.js` (491/491 passed, 100%).

---

## Phase 6: Full Regression, Acceptance & Handover (COMPLETED & VERIFIED)
- [x] Static type check: `npm run type-check` (`tsc --noEmit`) $\to$ 0 errors.
- [x] Lint verification: `npm run lint` (`next lint`) $\to$ 0 errors, 0 warnings.
- [x] Production build: `npm run build` $\to$ 157/157 static pages compiled in 901ms.
- [x] Full regression test suite: `npm test` $\to$ 38/38 suites passed, 3,750+ assertions, 0 failed.
- [x] All 14 confirmed defect dossiers re-tested and verified resolved.
- [x] Multi-tenant isolation, anti-spoofing and session cryptography verified.
- [x] Responsive layout verified (mobile, tablet, desktop).
- [x] Zero user changes overwritten; zero secrets exposed; zero user data deleted.
- [x] Create comprehensive `docs/bugfix/FINAL_QA_REPORT.md`.
- [x] Update `AGENT.md` with verified bugfix status and operational guide.

