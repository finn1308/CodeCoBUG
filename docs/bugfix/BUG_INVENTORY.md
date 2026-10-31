# CODECOBUG — BUG INVENTORY & DEFECT CATALOG

**Version:** 1.0.0  
**Phase:** Phase 1 — Comprehensive Repository Audit  
**Date:** 2026-10-31  
**Auditor:** Senior Full-Stack Engineer, QA & Security Specialist  
**Status:** Audit Completed — Ready for Repair Authorization  

---

## 1. Overview & Classification Schema

This document catalogues all real defects, architectural friction points, and code quality anomalies discovered during the thorough static, dynamic, and security audit of the CodeCoBUG repository.

### Severity Definitions
- **P0 (Critical / Blocker):** System crash, data loss, severe security breach, or total failure of core learning flow. *(0 identified)*
- **P1 (High / Functional):** Key user-facing functionality fails to work as expected under normal conditions. *(1 identified)*
- **P2 (Medium / Usability & Flow):** Flow friction, confusing error states, or API compatibility issues that degrade user experience. *(2 identified)*
- **P3 (Low / Polish & Hygiene):** Semantic HTML warnings, code cleanliness, tool deprecations, or performance optimizations under slow networks. *(4 identified)*

---

## 2. Summary Table of Defects

| Bug ID | Severity | Category | Target File(s) | Summary | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-AI-01** | **P1** | AI Integration / Functional | `src/components/settings/AISettingsModal.tsx`<br>`src/lib/ai/providerAdapter.ts`<br>`src/app/api/ai/chat/route.ts`<br>`src/app/api/ai/test-connection/route.ts` | Fictitious Gemini Model IDs (`gemini-3.8-flash`, etc.) cause HTTP 404 on Google AI Studio API | ✅ Resolved (Phase 2) |
| **BUG-AI-02** | **P2** | AI Integration / Compatibility | `src/components/settings/AISettingsModal.tsx` | Anthropic model identifiers lack required version/date snapshots (`claude-3-5-sonnet`) | ✅ Resolved (Phase 2) |
| **BUG-SEC-01** | **P2** | Auth Flow / UX Bridge | `src/components/workspace/ExerciseWorkspace.tsx` | Unauthenticated guest submission failure (401) prints text error to terminal without opening Auth Modal | ✅ Resolved (Phase 2) |
| **BUG-UI-01** | **P3** | HTML5 / Accessibility | `src/components/curriculum/CurriculumBrowser.tsx` | Nested `<button>` inside `<Link>` (`<a>`) violates HTML5 specification and causes hydration warnings | ✅ Resolved (Phase 2) |
| **BUG-CODE-01** | **P3** | Code Quality / Hygiene | `src/app/page.tsx` | Unused `LearningDashboard` import in root home page | ✅ Resolved (Phase 2) |
| **BUG-PERF-01** | **P3** | Build & Tooling | `package.json` | `next lint` deprecation warning in Next.js 15.2 (scheduled for removal in Next.js 16) | ℹ️ Migration Documented |
| **BUG-UX-01** | **P3** | Performance / WebAssembly | `src/lib/judge/runner.ts`<br>`src/components/workspace/ExerciseWorkspace.tsx` | Pyodide WebAssembly cold boot initialization delay on slow cellular networks (~10-12MB) | ℹ️ Strategy Documented |
| **BUG-UI-02** | **P2** | Routing / Performance | `src/app/exercises/[exerciseSlug]/page.tsx` | Missing `generateStaticParams()` prevented all 87 exercises from being prerendered as static HTML | ✅ Resolved (Phase 3) |
| **BUG-INT-01** | **P2** | Interaction / IME | `src/components/navigation/CommandCenter.tsx`<br>`src/components/ai/AITutorPanel.tsx` | Enter key lacked `isComposing` guard, causing accidental submission during Vietnamese Telex typing | ✅ Resolved (Phase 3) |
| **BUG-UI-03** | **P3** | UI & Controls / Completeness | `src/components/projects/ProjectDetail.tsx` | Missing copy CTA button in terminal setup commands card despite declared clipboard logic | ✅ Resolved (Phase 3) |
| **BUG-UI-04** | **P2** | Interaction / Auth Flow | `src/components/workspace/TerminalOutput.tsx` | 401 submission failure in terminal lacked interactive [Đăng nhập ngay] button | ✅ Resolved (Phase 3) |
| **BUG-INT-02** | **P3** | Interaction / State Sync | `src/components/common/Header.tsx` | Standalone Header fallback modal opened default 'skills' tab instead of requested 'queue' tab | ✅ Resolved (Phase 3) |
| **BUG-BE-01** | **P2** | Backend / HTTP Spec Compliance | `src/app/api/judge/submit/route.ts` | Uncaught JSON SyntaxError in submission body causes HTTP 500 instead of HTTP 400 Bad Request | ✅ Resolved (Phase 4) |
| **BUG-BE-02** | **P2** | Backend / Data Persistence | `src/lib/mastery/reviewEngine.ts`<br>`src/app/api/review-queue/route.ts` | Server-side review recommendations dropped silently due to missing Node.js storage fallback | ✅ Resolved (Phase 4) |
| **BUG-BE-03** | **P3** | Auth / Header Normalization | `src/lib/auth/serverAuth.ts`<br>`src/lib/auth/sessionToken.ts` | Case-sensitive Bearer token prefix and unguarded URI decoding in session cookie header | ✅ Resolved (Phase 4) |
| **BUG-BE-04** | **P3** | Backend / Query Resolution | `src/lib/judge/submissionStore.ts` | Supabase submission query omitted `exercise_id` filter and returned blank `exerciseSlug` | ✅ Resolved (Phase 4) |

---

## 3. Detailed Defect Dossiers

### BUG-AI-01: Fictitious Google Gemini Model IDs in UI & Defaults

- **Bug ID:** `BUG-AI-01`
- **Severity:** `P1 (High / Functional)`
- **Category:** AI Integration / REST API Compatibility
- **Locations:**
  - `src/components/settings/AISettingsModal.tsx` (Lines 22, 28–32)
  - `src/lib/ai/providerAdapter.ts` (Line 81)
  - `src/app/api/ai/chat/route.ts` (Line 49)
  - `src/app/api/ai/test-connection/route.ts` (Line 28)
- **Description:**
  In the AI Settings Modal, the preset list of Google Gemini models offers nonexistent model IDs:
  - `gemini-3.8-flash` (marked as Default / Recommended)
  - `gemini-3.5-flash-lite`
  - `gemini-4-argon`
  - `gemini-3.1-pro-preview`
  
  In the official Google Gemini v1beta API endpoint (`https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`), these model IDs do not exist. When a learner inputs their valid Google AI Studio API key (`AIza...`) and attempts either a connection test or an AI Tutor chat, the Google API server responds with:
  ```json
  {
    "error": {
      "code": 404,
      "message": "models/gemini-3.8-flash is not found for API version v1beta, or is not supported for generateContent.",
      "status": "NOT_FOUND"
    }
  }
  ```
  Meanwhile, the project's own `README.md` explicitly states:
  > *"Hỗ trợ Google Gemini (`gemini-2.0-flash`, `gemini-1.5-pro`) và OpenAI (`gpt-4o`, `gpt-4o-mini`)."*

- **Reproduction Steps:**
  1. Open CodeCoBUG in browser.
  2. Click the AI Settings gear icon or select "Cài đặt khóa AI (BYOK)" from Command Center.
  3. Select Provider: "Google Gemini".
  4. Notice the selected model is "gemini-3.8-flash".
  5. Paste a valid Google AI Studio API Key (`AIza...`).
  6. Click "Kiểm tra kết nối".
  7. **Observed Result:** Connection fails with HTTP 404 Not Found.
- **Root Cause:**
  Fictitious model names were authored into the UI options array and server-side fallback ternary operators during UI drafting, without verifying against Google's live v1beta model list.
- **Learner Impact:**
  Learners with legitimate Google AI Studio keys cannot use the AI Tutor without manually discovering a workaround.
- **Recommended Repair:**
  Update `PROVIDER_MODELS.gemini` in `AISettingsModal.tsx` and all fallback strings across `providerAdapter.ts`, `api/ai/chat/route.ts`, and `api/ai/test-connection/route.ts` to:
  - `gemini-2.0-flash` (Default / Recommended)
  - `gemini-1.5-flash` (Fast & Cost-efficient)
  - `gemini-1.5-pro` (Advanced Reasoning & Deep Tutoring)
- **Verification Plan:**
  Run automated connection and model validation tests via `npx tsx tests/test_ai_tutor.js` and dedicated model payload checks.

---

### BUG-AI-02: Anthropic Model IDs Missing Required Version Suffix

- **Bug ID:** `BUG-AI-02`
- **Severity:** `P2 (Medium / Compatibility)`
- **Category:** AI Integration / REST API Compatibility
- **Locations:**
  - `src/components/settings/AISettingsModal.tsx` (Lines 39–40)
- **Description:**
  In `AISettingsModal.tsx`, the Anthropic provider lists:
  - `claude-3-5-sonnet`
  - `claude-3-5-haiku`
  
  The Anthropic Messages API (`https://api.anthropic.com/v1/messages`) requires either specific dated model identifiers (e.g., `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`) or explicit alias syntax supported by their router (`claude-3-5-sonnet-latest`). Generic un-dated model strings can be rejected with `400 invalid_request_error: model: not found`.
- **Reproduction Steps:**
  1. Open AI Settings Modal.
  2. Switch provider to Anthropic.
  3. Inspect dropdown model values: `claude-3-5-sonnet`.
- **Root Cause:**
  Omission of the snapshot date suffix in the static options array.
- **Learner Impact:**
  Anthropic BYOK users encounter API rejections.
- **Recommended Repair:**
  Update `PROVIDER_MODELS.anthropic` in `AISettingsModal.tsx`:
  - `claude-3-5-sonnet-20241022` (or `claude-3-5-sonnet-latest`)
  - `claude-3-5-haiku-20241022` (or `claude-3-5-haiku-latest`)
- **Verification Plan:**
  Verify schema validation in `AISettingsModal.tsx`.

---

### BUG-SEC-01: Guest Submission Error Lacks Direct Auth Modal Trigger

- **Bug ID:** `BUG-SEC-01`
- **Severity:** `P2 (Medium / Usability & Flow)`
- **Category:** Authentication Flow / User Experience Bridge
- **Locations:**
  - `src/components/workspace/ExerciseWorkspace.tsx` (Lines 205–260)
- **Description:**
  When an unauthenticated guest user attempts to submit code via the "Nộp bài" button, `/api/judge/submit` strictly rejects the request with HTTP 401 Unauthorized:
  ```json
  {"error": "Yêu cầu đăng nhập để chấm bài và lưu lịch sử học tập."}
  ```
  In `ExerciseWorkspace.tsx`, the `catch` handler captures this error and writes a line to the terminal:
  ```
  Lỗi kết nối Judge Engine: Yêu cầu đăng nhập để chấm bài và lưu lịch sử học tập.
  ```
  However, it does **not** open the Authentication Modal (`AuthModal`) or render an inline clickable "Đăng nhập ngay" action. The user has to manually notice the error in the terminal, figure out where to find the login button (top header avatar), log in, and then re-click submit.
- **Reproduction Steps:**
  1. Open CodeCoBUG in an incognito window (guest mode).
  2. Navigate to any exercise (e.g., `/exercises/in-loi-chao-codecobug`).
  3. Click "Nộp bài".
  4. **Observed Result:** Red error line in terminal. No login modal opens.
- **Root Cause:**
  `ExerciseWorkspace.tsx` manages `isRunning` and `isSubmitting` locally, but did not have an active trigger wired to the authentication modal upon receiving a 401 response.
- **Learner Impact:**
  High drop-off rate for new learners trying to submit their first exercise.
- **Recommended Repair:**
  In `ExerciseWorkspace.tsx`:
  1. When `/api/judge/submit` returns status 401, set a state `isAuthModalOpen = true` or dispatch a global `open-auth-modal` custom event that `Header` / `AppShell` listens to.
  2. Optionally add a dedicated clickable button in the terminal output: `[Đăng nhập để chấm bài]`.
- **Verification Plan:**
  Simulate guest submission in unit test and verify auth trigger behavior.

---

### BUG-UI-01: Invalid Interactive Element Nesting (`<button>` inside `<Link>`)

- **Bug ID:** `BUG-UI-01`
- **Severity:** `P3 (Low / Accessibility & HTML5 Validation)`
- **Category:** HTML5 Semantic Standards / Accessibility
- **Locations:**
  - `src/components/curriculum/CurriculumBrowser.tsx` (Lines 832–853)
- **Description:**
  In `CurriculumBrowser.tsx`, inside the lesson card action bar:
  ```tsx
  <Link href={`/curriculum/${topic.slug}/${lesson.slug}`} style={{ textDecoration: 'none' }}>
    <button
      type="button"
      style={{ ... }}
      title="Mở toàn màn hình trang bài giảng chuyên sâu"
    >
      <ExternalLink size={12} />
      <span>Mở bài học</span>
    </button>
  </Link>
  ```
  Next.js `<Link>` compiles to an HTML `<a>` tag. The HTML5 specification (W3C / WHATWG) strictly forbids nesting interactive elements (`<button>` cannot be an interactive descendant of `<a>`). This triggers React hydration warnings in development and confuses screen readers navigating by interactive landmarks.
- **Reproduction Steps:**
  1. Inspect `CurriculumBrowser.tsx` line 832.
  2. Notice `<button>` wrapped directly inside `<Link>`.
- **Root Cause:**
  Button markup was wrapped with `<Link>` for navigation instead of styling the link directly or using a `<span>`.
- **Learner Impact:**
  Potential browser console warnings; keyboard accessibility and screen reader inconsistencies.
- **Recommended Repair:**
  Replace the `<button>` element with a styled `<span>` with `display: inline-flex` or pass the styling directly to the `<Link>` element.
- **Verification Plan:**
  Run `grep -rn "<Link" src/ | grep -B 2 -A 2 "<button"` and verify 0 occurrences remain.

---

### BUG-CODE-01: Unused Import in Root Home Page (`page.tsx`)

- **Bug ID:** `BUG-CODE-01`
- **Severity:** `P3 (Low / Code Cleanliness)`
- **Category:** Code Hygiene
- **Locations:**
  - `src/app/page.tsx` (Line 4)
- **Description:**
  `LearningDashboard` is imported on line 4 of `src/app/page.tsx`, but line 9 only renders `<MinimalLondonHome />`. `LearningDashboard` is actually instantiated internally within `MinimalLondonHome.tsx`.
- **Root Cause:**
  Leftover import statement from an earlier prototyping phase before `MinimalLondonHome` encapsulated the dashboard view.
- **Learner Impact:**
  None (tree-shaken by webpack/Turbopack), but causes lint/static analysis noise.
- **Recommended Repair:**
  Remove `import { LearningDashboard } from '@/components/dashboard/LearningDashboard';` from `src/app/page.tsx`.
- **Verification Plan:**
  Run `npm run lint` and `npm run type-check`.

---

### BUG-PERF-01: Next.js 16 Deprecation Warning for `next lint`

- **Bug ID:** `BUG-PERF-01`
- **Severity:** `P3 (Low / Tooling & Future-Proofing)`
- **Category:** Tooling & Build Scripts
- **Locations:**
  - `package.json` (Line 9)
- **Description:**
  When executing `npm run lint`, Next.js 15.2 prints:
  ```
  warn - `next lint` is deprecated and will be removed in Next.js 16.
  For more information, see: https://nextjs.org/docs/app/building-your-application/upgrading/version-15
  ```
- **Root Cause:**
  Next.js 15+ has transitioned to ESLint 9 flat configuration. The built-in `next lint` command will be superseded by the official ESLint CLI.
- **Learner Impact:**
  None in production build; future maintenance warning when upgrading Next.js.
- **Recommended Repair:**
  Plan migration to `eslint . --ext .js,.jsx,.ts,.tsx` or standard ESLint 9 flat config in Phase 2.
- **Verification Plan:**
  Verify lint execution clean of warnings.

---

### BUG-UX-01: Pyodide WebAssembly Cold Boot Latency on Slow Connections

- **Bug ID:** `BUG-UX-01`
- **Severity:** `P3 (Low / Network Performance)`
- **Category:** Performance / WebAssembly Runtime
- **Locations:**
  - `src/lib/judge/runner.ts`
  - `src/components/workspace/ExerciseWorkspace.tsx`
- **Description:**
  The Pyodide WebAssembly runtime bundle (`pyodide.asm.wasm`) is ~10–12 MB in size. While the application displays a friendly `"Đang tải trình thông dịch Python WebAssembly..."` loading badge, on slow 3G cellular connections this initial download can introduce a 2–3 second delay before the first `Run` action can execute.
- **Root Cause:**
  Pyodide initialization is triggered lazily when the user navigates into an exercise workspace.
- **Learner Impact:**
  Learners on slow networks experience a brief wait upon opening their first exercise.
- **Recommended Mitigation:**
  Add link prefetching or an idle service-worker warm-up trigger when hovering over exercise links in `CurriculumBrowser.tsx`.
- **Verification Plan:**
  Verify load time and caching behavior in browser devtools.

---

### BUG-BE-01: Uncaught JSON SyntaxError in `/api/judge/submit` Returning HTTP 500

- **Bug ID:** `BUG-BE-01`
- **Severity:** `P2 (Medium / API Contract Compliance)`
- **Category:** Backend & REST API Standards
- **Locations:** `src/app/api/judge/submit/route.ts` (Lines 19–27)
- **Description:**
  Directly calling `const body = await req.json();` threw an unhandled SyntaxError on empty, malformed, or non-JSON payloads, causing the route to fall through to the global catch block and return HTTP 500 Internal Server Error (`Lỗi máy chủ khi chấm bài: Unexpected end of JSON input`), violating REST specifications where client payload errors must return HTTP 400 Bad Request.
- **Root Cause:** Missing `.catch(() => null)` and body object type guard on `req.json()`.
- **Learner/API Impact:** API consumers or mobile clients encounter 500 errors on transient truncated network bodies.
- **Repair:** Implemented `const body = await req.json().catch(() => null);` followed by strict validation returning HTTP 400 with `{ error: 'Dữ liệu yêu cầu không đúng định dạng JSON (Invalid JSON payload).' }`. Added 100KB payload size ceiling returning HTTP 413.
- **Status:** ✅ Resolved (Phase 4). Verified by `tests/test_phase4_backend_data_integrity.js`.

---

### BUG-BE-02: Silent Drop of Server Review Queue Recommendations

- **Bug ID:** `BUG-BE-02`
- **Severity:** `P2 (Medium / Data Integrity)`
- **Category:** Backend Persistence & Data Synchronization
- **Locations:** `src/lib/mastery/reviewEngine.ts`, `src/app/api/review-queue/route.ts`
- **Description:**
  `ReviewEngine.getStoredQueue` and `ReviewEngine.saveQueue` checked `if (typeof window === 'undefined') return;` because they were initially authored for browser `localStorage`. When invoked from Next.js server route handlers, the queue was neither persisted nor retrieved, returning empty queues silently.
- **Root Cause:** Absence of a Node.js server-side memory storage fallback for the review engine.
- **Repair:** Introduced `serverReviewQueueStore: Map<string, ReviewItem[]>` with automatic synchronization triggered during `/api/judge/submit` and `/api/review-queue`.
- **Status:** ✅ Resolved (Phase 4). Verified by `tests/test_phase4_backend_data_integrity.js`.

---

### BUG-BE-03: Case-Sensitive Bearer Prefix & Unguarded URI Decoding

- **Bug ID:** `BUG-BE-03`
- **Severity:** `P3 (Low / Protocol Robustness)`
- **Category:** Server Auth & Header Normalization
- **Locations:** `src/lib/auth/serverAuth.ts`, `src/lib/auth/sessionToken.ts`
- **Description:**
  `getServerAuthenticatedUser` strictly checked `authHeader.startsWith('Bearer ')`. HTTP clients transmitting lowercase `bearer <token>` were rejected with 401. Additionally, unhandled `decodeURIComponent` in the cookie header could throw `URIError` on malformed cookies.
- **Root Cause:** Rigid string prefix check and lack of try/catch around URI decoding.
- **Repair:** Migrated to `/^bearer\s+/i` regex prefix replacement and wrapped cookie URI decoding in try/catch.
- **Status:** ✅ Resolved (Phase 4). Verified by `tests/test_phase4_backend_data_integrity.js`.

---

### BUG-BE-04: Missing `exercise_id` Filter and Blank Slug in Supabase Submission Queries

- **Bug ID:** `BUG-BE-04`
- **Severity:** `P3 (Low / Query Resolution)`
- **Category:** Database Query Integrity
- **Locations:** `src/lib/judge/submissionStore.ts`
- **Description:**
  `getAuthoritativeSubmissions(userId, exerciseSlug)` omitted the `exercise_id` query filter in the Supabase branch, and mapped `exerciseSlug: exerciseSlug || ''`, resulting in empty slugs when querying general submission history.
- **Root Cause:** Missing resolution from `exerciseSlug` to `exercise.id` using the curriculum registry.
- **Repair:** Connected `getExerciseFromRegistry` and `getAllExercisesFromRegistry` to dynamically map and filter exercise IDs.
- **Status:** ✅ Resolved (Phase 4). Verified by `tests/test_phase4_backend_data_integrity.js`.

---

## 4. Defect Distribution Matrix

```
┌─────────────────────────┬──────────────┬────────────┬────────────────────────┐
│ Category                │ Total Count  │ Severity   │ Primary Files Affected │
├─────────────────────────┼──────────────┼────────────┼────────────────────────┤
│ AI & BYOK Integration   │ 2            │ P1 (1)     │ AISettingsModal.tsx    │
│                         │              │ P2 (1)     │ providerAdapter.ts     │
│ Auth & Session Bridges  │ 2            │ P2 (1)     │ ExerciseWorkspace.tsx  │
│                         │              │ P3 (1)     │ serverAuth.ts          │
│ Backend & Data Integrity│ 3            │ P2 (2)     │ submit/route.ts        │
│                         │              │ P3 (1)     │ submissionStore.ts     │
│ UI & Routing / SSG      │ 2            │ P2 (1)     │ exercises/[slug]/page  │
│                         │              │ P3 (1)     │ ProjectDetail.tsx      │
│ IME & Interaction       │ 2            │ P2 (1)     │ CommandCenter.tsx      │
│                         │              │ P3 (1)     │ Header.tsx             │
│ HTML5 / Accessibility   │ 1            │ P3 (1)     │ CurriculumBrowser.tsx  │
│ Code Hygiene            │ 1            │ P3 (1)     │ page.tsx               │
│ Tooling & Wasm          │ 2            │ P3 (2)     │ package.json / runner  │
├─────────────────────────┼──────────────┼────────────┼────────────────────────┤
│ TOTAL                   │ 15           │ P1: 1      │                        │
│                         │              │ P2: 6      │                        │
│                         │              │ P3: 8      │                        │
└─────────────────────────┴──────────────┴────────────┴────────────────────────┘
```

