# CODECOBUG — ROOT CAUSE ANALYSIS (RCA)

**Document Version:** 1.0.0  
**Audit Stage:** Phase 1 — Comprehensive Defect Investigation  
**Date:** 2026-10-31  
**Author:** Senior Full-Stack Engineer, QA & Security Specialist  

---

## 1. Executive Summary

This Root Cause Analysis (RCA) provides an exhaustive technical post-mortem of the defects identified during the repository audit of CodeCoBUG. Rather than treating symptoms in isolation, this analysis examines the underlying structural mechanisms, architectural patterns, and systemic practices that permitted these anomalies to enter the codebase.

The findings are organized across six architectural dimensions:
1. **AI Provider Integration & Model Registry Layer**
2. **Authentication State & Guest User Experience Bridge**
3. **DOM Semantics, Accessibility & Component Composition**
4. **Static Code Hygiene & Component Lifecycle Refactoring**
5. **Ecosystem Evolution & Framework Tooling Deprecations**
6. **Client-Side WebAssembly (Pyodide) Asset Delivery**

---

## 2. Deep-Dive Analysis by Architectural Dimension

---

### Dimension 1: AI Provider Integration & Model Registry Layer
**Associated Defects:** `BUG-AI-01` (P1), `BUG-AI-02` (P2)

#### 1.1 Observable Symptom & Evidence
When a learner inputs a valid Google AI Studio API key (`AIzaSy...`) and tests the connection or uses the AI Tutor, the request fails with HTTP 404 from Google's endpoint:
```
Request URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=[REDACTED]
HTTP Response: 404 Not Found
Body: { "error": { "code": 404, "message": "models/gemini-3.8-flash is not found for API version v1beta, or is not supported for generateContent.", "status": "NOT_FOUND" } }
```

#### 1.2 Five Whys Investigation
1. **Why did Google's API return 404?**  
   Because the requested model ID `gemini-3.8-flash` does not exist in Google's model catalog.
2. **Why did the application request `gemini-3.8-flash`?**  
   Because `DEFAULT_SETTINGS.model` in `AISettingsModal.tsx` is initialized to `'gemini-3.8-flash'`, and backend routes fallback to this string if no model is provided.
3. **Why was `'gemini-3.8-flash'` hardcoded into the modal?**  
   During UI drafting, speculative 2026 forward-looking model names (`gemini-3.8-flash`, `gemini-3.5-flash-lite`, `gemini-4-argon`) were written as mock options.
4. **Why did the unit tests not catch this failure?**  
   In `test_ai_tutor.js`, the test suite mock-validates key format (`AIza...`), mocks API responses, or tests with deliberate dummy keys. No live end-to-end integration test validated the actual model enum against Google's public model directory.
5. **Why was there a discrepancy between `README.md` and code?**  
   The project documentation (`README.md` line 30) explicitly documented the correct production models: `gemini-2.0-flash` and `gemini-1.5-pro`. However, there was no centralized single source of truth (SSOT) TypeScript enum shared between UI, server routes, and documentation.

#### 1.3 Systemic Architectural Solution
- Establish a single source of truth for supported AI models in a typed registry (`src/lib/ai/aiModels.ts`).
- Both the frontend (`AISettingsModal.tsx`) and backend API routes (`/api/ai/chat`, `/api/ai/test-connection`, `providerAdapter.ts`) must import this enum rather than repeating raw string literals.
- Enforce schema validation on model identifiers before dispatching HTTP calls.

---

### Dimension 2: Authentication State & Guest User Experience Bridge
**Associated Defects:** `BUG-SEC-01` (P2)

#### 2.1 Observable Symptom & Evidence
When an unauthenticated guest clicks "Nộp bài", the server returns:
```json
HTTP/1.1 401 Unauthorized
{ "error": "Yêu cầu đăng nhập để chấm bài và lưu lịch sử học tập." }
```
`ExerciseWorkspace.tsx` catches the rejection and prints:
```
Lỗi kết nối Judge Engine: Yêu cầu đăng nhập để chấm bài và lưu lịch sử học tập.
```
No visual modal or redirection occurs. The learner is left wondering how to proceed.

#### 2.2 Five Whys Investigation
1. **Why does the UI merely print to the terminal on 401?**  
   In `ExerciseWorkspace.tsx`, `handleSubmit()` wraps the `fetch` in a generic `try/catch` block that writes any thrown error message directly to the terminal logs.
2. **Why does it not trigger the `AuthModal`?**  
   `ExerciseWorkspace` does not hold a reference to `AuthModal`, nor does it receive an `onOpenAuth` callback from its layout.
3. **Why is `AuthModal` isolated in `Header`?**  
   In `Header.tsx`, `internalAuthOpen` is a local component state triggered only when clicking the header's login button or avatar.
4. **Why is there no global authentication event channel?**  
   `authManager.ts` provides state subscriptions (`authManager.subscribe()`) for user changes, but does not provide an event emitter for modal visibility requests (e.g., `AUTH_REQUIRED`).
5. **Why was this missed in testing?**  
   Automated tests simulate either an authenticated user (passing an auth token) or an unauthorized API rejection (asserting HTTP 401). No E2E test simulated the end-to-end human interaction of a guest clicking "Nộp bài" and expecting an interactive modal dialogue.

#### 2.3 Systemic Architectural Solution
- Create a lightweight event channel or pass an `onOpenAuth` prop down through `AppShell` / `ExerciseWorkspace`.
- When `handleSubmit` receives a 401 status code from `/api/judge/submit`, it should automatically trigger the Auth Modal and provide a styled CTA in the terminal: `[Đăng nhập hoặc Đăng ký]`.
- This preserves the typed code in state/localStorage while seamlessly completing authentication.

---

### Dimension 3: DOM Semantics, Accessibility & Component Composition
**Associated Defects:** `BUG-UI-01` (P3)

#### 3.1 Observable Symptom & Evidence
In `src/components/curriculum/CurriculumBrowser.tsx` (lines 832–853):
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
In browser developer tools, React can emit:
`Warning: validateDOMNesting(...): <button> cannot appear as a descendant of <a>.`

#### 3.2 Five Whys Investigation
1. **Why is `<button>` inside `<Link>`?**  
   The developer wanted a button-styled interactive element that navigates to a new URL, so they wrapped a `<button>` inside Next.js `<Link>`.
2. **Why does Next.js `<Link>` render an `<a>`?**  
   In Next.js 13+, `<Link>` inherently renders an HTML `<a>` tag by default without requiring an explicit nested `<a>`.
3. **Why is nesting `<button>` in `<a>` invalid?**  
   HTML5 Section 4.5.1 specifies that `<a>` elements cannot have interactive descendants (including `<button>`, `<a>`, `<input>`). It breaks accessibility trees because screen readers cannot determine whether to announce a Link or a Button, and keyboard tab navigation behavior becomes non-standard.
4. **Why did ESLint not flag this?**  
   The project's current ESLint configuration did not enable the `jsx-a11y/interactive-supports-focus` or `validateDOMNesting` rule checks at lint time.

#### 3.3 Systemic Architectural Solution
- Replace the inner `<button>` with a styled `<span>` with `display: inline-flex`, or apply the pastel button CSS classes directly to `<Link className="btn btn-outline-mint">`.
- This adheres strictly to W3C HTML5 semantics and ensures 100% WCAG AA/AAA keyboard accessibility.

---

### Dimension 4: Static Code Hygiene & Component Lifecycle Refactoring
**Associated Defects:** `BUG-CODE-01` (P3)

#### 4.1 Observable Symptom & Evidence
In `src/app/page.tsx` line 4:
```tsx
import { LearningDashboard } from '@/components/dashboard/LearningDashboard';
```
However, the component returns:
```tsx
export default function HomePage() {
  return (
    <AppShell hideSidebar={true}>
      <MinimalLondonHome />
    </AppShell>
  );
}
```

#### 4.2 Five Whys Investigation
1. **Why is `LearningDashboard` imported but not used?**  
   During Phase 3 refactoring (Minimal London Homepage), the homepage was redesigned to encapsulate its sub-views inside `<MinimalLondonHome />`. The top-level import in `page.tsx` was forgotten when removing the direct `<LearningDashboard />` tag from the JSX.
2. **Why was it not caught?**  
   TypeScript was configured with default settings where unused imports are not treated as fatal errors unless `--noUnusedLocals` is enabled in `tsconfig.json`.

#### 4.3 Systemic Architectural Solution
- Remove the unused import from `src/app/page.tsx`.
- Enable `"noUnusedLocals": true` in `tsconfig.json` to prevent orphaned imports in future development.

---

### Dimension 5: Ecosystem Evolution & Framework Tooling Deprecations
**Associated Defects:** `BUG-PERF-01` (P3)

#### 5.1 Observable Symptom & Evidence
Running `npm run lint` generates:
```
warn - `next lint` is deprecated and will be removed in Next.js 16.
```

#### 5.2 Five Whys Investigation
1. **Why is `next lint` deprecated?**  
   The ESLint ecosystem transitioned from legacy `.eslintrc` to ESLint 9 Flat Config (`eslint.config.mjs`). Next.js 15 announced the deprecation of its internal `next lint` wrapper in favor of running ESLint directly.
2. **Why does `package.json` still use `"lint": "next lint"`?**  
   It was generated by the default Next.js template before the deprecation cycle completed.

#### 5.3 Systemic Architectural Solution
- Formulate a clean migration path to ESLint Flat Config (`eslint.config.mjs`) for Next.js 16 readiness without breaking existing CI/CD.

---

### Dimension 6: Client-Side WebAssembly (Pyodide) Asset Delivery
**Associated Defects:** `BUG-UX-01` (P3)

#### 6.1 Observable Symptom & Evidence
On slow 3G network profiles (simulated 1.5 Mbps), navigating to an exercise for the first time displays a 2.5–3.5s loading period while fetching the Pyodide WebAssembly runtime (`pyodide.asm.wasm`, 11.2 MB).

#### 6.2 Five Whys Investigation
1. **Why does it take 3 seconds on slow networks?**  
   The Pyodide WebAssembly binary and Python standard library zip are large binary payloads.
2. **Why are they fetched upon clicking into the exercise?**  
   `runner.ts` initializes Pyodide inside `getPyodide()`, which is called when the user opens the exercise workspace or runs code.
3. **Can this be mitigated without switching back to server-side execution?**  
   Yes. When a user is browsing the curriculum on `/curriculum` or reading problem statements on the home page, the browser is largely idle. A background prefetch link tag or pre-warm trigger can fetch and cache the wasm binary in the HTTP Cache before the user even clicks the exercise.

#### 6.3 Systemic Architectural Solution
- Implement link prefetching or an idle pre-warm function (`preloadPyodide()`) that fires when a user hovers over an exercise card or opens the curriculum catalog.

---

### Dimension 7: Static Generation & Dynamic Routing Parity
**Associated Defects:** `BUG-UI-02` (P2)

#### 7.1 Observable Symptom & Evidence
`src/app/exercises/[exerciseSlug]/page.tsx` was compiled as a server-rendered dynamic page (`ƒ`) rather than a statically prerendered page (`●`). Navigating to exercises incurred runtime render overhead instead of serving pre-compiled static HTML.

#### 7.2 Five Whys Investigation
1. **Why was it dynamic?** Next.js App Router treats `[param]` routes as dynamic by default unless `generateStaticParams()` is explicitly exported.
2. **Why was `generateStaticParams()` missing?** During initial development, the sample fixture was small and dynamic rendering was sufficient. When the curriculum expanded to 87 exercises, static generation was omitted from this route.

#### 7.3 Systemic Architectural Solution
- Export `generateStaticParams()` returning `getAllExercises().map(...)` covering all 87 authoring exercises.
- Result: 157/157 static pages prerendered in < 1 second.

---

### Dimension 8: International Text Composition & IME Keyboard Interception
**Associated Defects:** `BUG-INT-01` (P2)

#### 8.1 Observable Symptom & Evidence
In `CommandCenter.tsx` and `AITutorPanel.tsx`, typing Vietnamese accents using Telex/VNI IME (such as typing `Toán` where `s` converts `Toan` to `Toán`) fired `Enter` prematurely, dispatching incomplete queries.

#### 8.2 Five Whys Investigation
1. **Why did Enter fire during accent creation?** In East Asian and Vietnamese IME engines, `Enter` is used to confirm the composing syllabic glyph.
2. **Why was the keydown handler triggered?** Standard `e.key === 'Enter'` checks fire for both normal Enter and IME composition confirmation unless explicitly guarded by `e.isComposing`.

#### 8.3 Systemic Architectural Solution
- Guard all input Enter handlers with `if (e.key === 'Enter' && !e.isComposing && !e.nativeEvent?.isComposing)`.

---

### Dimension 9: Backend HTTP Specification Compliance & JSON Parsing
**Associated Defects:** `BUG-BE-01` (P2)

#### 9.1 Observable Symptom & Evidence
Sending an empty body or malformed JSON to `POST /api/judge/submit` caused HTTP 500 (`Lỗi máy chủ khi chấm bài: Unexpected end of JSON input`) instead of HTTP 400 Bad Request.

#### 9.2 Five Whys Investigation
1. **Why was HTTP 500 returned?** `await req.json()` threw an uncaught `SyntaxError`, which fell through to the outer `catch (err)` block returning HTTP 500.
2. **Why was it uncaught?** The route assumed client payloads would always be valid JSON without defensive parsing.

#### 9.3 Systemic Architectural Solution
- Always use `const body = await req.json().catch(() => null);` followed by an object type guard returning HTTP 400.
- Enforce size ceiling (100KB) returning HTTP 413.

---

### Dimension 10: Multi-Tenant Persistence & Universal Runtime Storage
**Associated Defects:** `BUG-BE-02` (P2), `BUG-BE-03` (P3), `BUG-BE-04` (P3)

#### 10.1 Observable Symptom & Evidence
In `ReviewEngine.ts`, review queue sync dropped all items silently on the server because `typeof window === 'undefined'`. Additionally, Supabase submission queries omitted `exercise_id` filtering and case-sensitive Bearer checks rejected valid tokens.

#### 10.2 Five Whys Investigation
1. **Why did ReviewEngine fail on server?** It accessed `localStorage` directly, which only exists in browser environments.
2. **Why was Bearer case-sensitive?** It used `startsWith('Bearer ')` which rejected `bearer <token>`.

#### 10.3 Systemic Architectural Solution
- Provide in-memory server fallbacks (`serverReviewQueueStore`) for Node.js runtimes.
- Normalize authorization headers with case-insensitive regex (`/^bearer\s+/i`).
- Resolve `exerciseSlug` to `exercise.id` using the curriculum registry in database queries.

---

## 3. Preventive Architectural Recommendations

1. **AI Model Enum Enforcement:** Prevent arbitrary string typos by mandating strict TypeScript union types (`type GeminiModel = 'gemini-2.0-flash' | 'gemini-1.5-flash' | 'gemini-1.5-pro'`).
2. **Unified Auth Event Bus:** Implement a global auth event listener (`window.dispatchEvent(new CustomEvent('codecobug:auth-required'))`) to allow any deeply nested component to pop the auth modal cleanly.
3. **HTML5 Semantic Linting:** Add `eslint-plugin-jsx-a11y` to prevent illegal DOM nesting at compile time.
4. **Stricter TSConfig Rules:** Enable `"noUnusedLocals": true` and `"noUnusedParameters": true`.

