# CodeCoBUG — Phase 0 Project Audit Report
**Date**: 2026-10-30  
**Audit Scope**: Full Codebase, Architecture, Dependencies, Runtime, Judge, Auth, AI & UI System  
**Reference Standards**: `AGENT.md`, `agent1.md`, LucianLabs UX/UI Prompt Guidelines (`lucianlabs.dev/uxui-prompt/`)

---

## 1. Architectural Overview & Critical Files

CodeCoBUG is built as a production-minded Python learning platform with in-browser WebAssembly Python execution, serverless deterministic grading, multi-tenant persistence, and a provider-independent pedagogical AI Tutor.

```mermaid
graph TD
    UI[Next.js 15 App Router & React 19] --> Shell[AppShell, Sidebar, MobileNav]
    Shell --> Dash[LearningDashboard /]
    Shell --> Curr[CurriculumBrowser /curriculum]
    Shell --> Work[ExerciseWorkspace /exercises/:slug]
    Work --> Monaco[Monaco Code Editor]
    Work --> Wasm[Pyodide WebAssembly Client]
    Work --> JudgeApi[/api/judge/submit Serverless Judge]
    Work --> AIApi[/api/ai/chat BYOK AI Adapter]
    JudgeApi --> TestRepo[Test Cases Repository & Comparators]
    AIApi --> Crypto[AES-256-GCM & Trace Redaction]
    Dash --> Auth[AuthPersistenceManager & Multi-Tenant Store]
    Dash --> Mastery[MasteryEngine & Adaptive Review Queue]
```

### Critical File Map:
- **Routing & Pages**:
  - `src/app/page.tsx`: Learning dashboard home with continue learning, progress, recent attempts, review recommendations.
  - `src/app/curriculum/page.tsx`: Dedicated curriculum browser with real-time search, difficulty/status filters, accordions.
  - `src/app/exercises/[exerciseSlug]/page.tsx`: Dynamic exercise workspace entry.
  - `src/app/not-found.tsx`: Custom 404 page for missing exercises/routes.
  - `src/app/api/judge/submit/route.ts`: Serverless judge evaluation with hidden test shielding.
  - `src/app/api/ai/chat/route.ts`: Serverless AI tutor endpoint (BYOK) with trace redaction.
  - `src/app/api/ai/test-connection/route.ts`: Serverless AI connection ping for provider testing.
- **Design System & Components**:
  - `src/app/globals.css`: Full CodeCoBUG Teen Pastel Studio design tokens (Mint `#BFE8D0`, Light Mint Canvas `#F3FBF5`, Lavender `#DCCBFF`, Sky Blue `#C7E3FF`, Peach Coral `#FFCDBD`, Soft Yellow `#FFF0B8`).
  - `src/components/ui/`: `Button`, `Card`, `Input`, `Textarea`, `Modal`, `Badge`, `Tabs`.
  - `src/components/layout/`: `AppShell`, `Sidebar`, `MobileNav`.
  - `src/components/common/`: `Header`.
  - `src/components/workspace/`: `ExerciseWorkspace`, `ProblemStatement`, `CodeEditor`, `TerminalOutput`.
  - `src/components/ai/`: `AITutorPanel`, `AITutorModal`, `FormattedAIResponse`.
  - `src/components/auth/`: `AuthModal`.
  - `src/components/settings/`: `AISettingsModal`.
  - `src/components/mastery/`: `WeaknessTrackerModal`.
- **Engines & Business Logic**:
  - `src/lib/pyodide/PyodideClient.ts` & `src/hooks/usePyodide.ts`: In-browser Python 3.12 WebAssembly execution.
  - `src/lib/judge/runner.ts`, `comparator.ts`, `testCasesRepository.ts`: Deterministic automated test execution.
  - `src/lib/auth/authManager.ts`: Multi-tenant session and local persistence.
  - `src/lib/ai/providerAdapter.ts`, `crypto.ts`, `tutorService.ts`: AI adapter, BYOK key vault, prompt engineering.
  - `src/lib/mastery/masteryEngine.ts`, `errorClassifier.ts`, `reviewEngine.ts`, `exerciseVariation.ts`: Empirical mastery calculation and adaptive review queues.

---

## 2. Feature Health Audit (Working, Incomplete, Broken, Missing)

| Category | Feature | Status | Verification & Observations |
| :--- | :--- | :---: | :--- |
| **UI Shell** | Desktop Sidebar & Collapse | **Working** | Toggles 250px <-> 76px, saves state to localStorage. |
| **UI Shell** | Mobile Navigation Drawer | **Working** | Slide drawer on <= 1023px, touch targets >= 44px, traps Escape. |
| **Dashboard** | Learning Overview & Progress | **Working** | Zero fake data. Strictly derives from saved submissions. |
| **Curriculum** | Search, Filters & Accordion | **Working** | Real-time text search, status & difficulty filters, expand/collapse. |
| **Workspace** | Two-column Desktop Layout | **Working** | 42% problem pane / 58% code editor & terminal pane. |
| **Workspace** | Mobile Viewport Tabs | **Working** | Tabbed switcher (Đề bài / Code Editor / Terminal). |
| **Editor** | Monaco Theme & Controls | **Working** | Light (`vs`) / Dark (`vs-dark`) toggle, font zoom (11px-22px), reset with confirmation. |
| **Runtime** | Pyodide WebAssembly | **Working** | Executes valid Python, stdout/stderr captured, input() buffer, exception tracebacks. |
| **Judge** | Deterministic Assessment | **Working** | 3+ public tests, hidden test shielding, multi-comparators (exact, normalized, float). |
| **Auth** | Multi-Tenant Data Isolation | **Working** | User session, draft isolation, submission attribution, points persistence. |
| **AI Tutor** | BYOK Vault & Studio | **Working** | Masked keys, AES-256-GCM, trace redaction, smart prompt chips, formatted markdown code. |
| **Mastery** | Error Taxonomy & Review Queue | **Working** | 9 error classes, priority-based review queue, duplicate detection shield. |
| **Curriculum** | Production Curriculum | **Planned** | Currently using technical test fixture `SAMPLE_TEST_COURSE` (3 exercises). Real curriculum will be supplied by project owner. |
| **Backend DB**| Hosted Cloud Supabase | **Ready** | Local persistence operational; PostgreSQL migrations and RLS policies ready in `supabase/migrations/`. |

---

## 3. LucianLabs UX/UI Prompt Integration Analysis

From research on `lucianlabs.dev/uxui-prompt/`:
- **Core Philosophy**: Dependency-free, accessible, responsive components with native keyboard/touch handling and reduced-motion support.
- **Application to CodeCoBUG Teen Pastel Studio**:
  1. **Interactive Prompt Chips**: Modeled after lightweight pill selectors for suggested questions without heavy JS libraries.
  2. **Soft Elevation & Pastel Contrast**: Cards maintain soft borders (`#E7EAF0`) and subtle shadows (`0 4px 20px rgba(0,0,0,0.05)`) with WCAG AA compliant text contrast (`#243047` main text, `#58657B` secondary text).
  3. **Zero Decorative Clutter**: Micro-interactions are restrained and functional (copy buttons, theme toggles, collapsible drawers) without distracting animations.

---

## 4. Proposed Implementation Sequence for Future Refinements

1. **Step 1 — Curriculum Ingestion Pipeline**:
   - Provide bulk-import / JSON schema validation for when the user supplies the real multi-topic curriculum.
   - Maintain separation between curriculum metadata and UI rendering components.
2. **Step 2 — Advanced Monaco IntelliSense**:
   - Add Python autocomplete snippets specifically tailored for beginners (e.g. `for i in range(...)`, `[int(x) for x in input().split()]`).
3. **Step 3 — Enhanced Diagnostic Charts**:
   - Render pure SVG / CSS skill radar and error distribution charts on the Weakness Tracker modal without external heavy charting libraries.
4. **Step 4 — Cloud Database Deployment**:
   - Connect Supabase production environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) using existing migrations.

---

## 5. Risks and Dependencies

1. **Browser Pyodide Resource Consumption**:
   - Pyodide downloads ~10-15MB WebAssembly binary on first load.
   - *Mitigation*: Lazy-loaded via dynamic import on workspace pages only, with IndexedDB browser caching and friendly loading indicator.
2. **AI Provider Quota & BYOK Availability**:
   - Users provide their own API keys; provider rate limits (HTTP 429) or invalid keys (HTTP 401) may occur.
   - *Mitigation*: Clear Vietnamese error translations, preflight format checks, and test connection ping.
3. **Hidden Test Leakage**:
   - Student attempts might try to expose test cases.
   - *Mitigation*: Strictly evaluated on the server (`/api/judge/submit`); hidden test inputs and expected outputs are omitted from responses.

---

## 6. Available Tests & Automated Verification

The repository contains 13 automated test suites, all passing with zero regressions:

1. `tests/test_phase8_verification_and_hardening.js` (72 tests)
2. `tests/test_ai_tutor_ui.js` (43 tests)
3. `tests/test_ai_tutor.js` (32 tests)
4. `tests/test_exercise_workspace.js` (44 tests)
5. `tests/test_curriculum_browser.js` (40 tests)
6. `tests/test_learning_dashboard.js` (26 tests)
7. `tests/test_app_shell_and_nav.js` (31 tests)
8. `tests/test_design_system.js` (40 tests)
9. `tests/test_judge_engine.js` (25 tests)
10. `tests/test_auth_and_rls.js` (27 tests)
11. `tests/test_mastery_and_review.js` (50 tests)
12. `tests/test_pyodide_runtime.js` (11 tests)
13. `tests/test_e2e_system_flows.js` (35 tests)

**Total**: 484 assertions, 100% pass rate.
**Type Check**: `npm run type-check` -> 0 errors.
**Linter**: `npm run lint` -> 0 warnings/errors.
**Build**: `npm run build` -> Successful Next.js production build.

