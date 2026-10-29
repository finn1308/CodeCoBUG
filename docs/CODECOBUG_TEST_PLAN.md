# CodeCoBUG — Quality Assurance & Test Plan

**Version**: 1.0.0  
**Date**: 2026-10-29  
**Status**: Architecture Baseline (Phase 1)

---

## 1. Testing Philosophy & Verification Strategy

In CodeCoBUG, **no feature is declared working without concrete test evidence**.

The testing framework is structured across four validation layers:
1. **Unit Tests (Vitest)**: Algorithmic correctness of judge comparators, encryption/decryption, worker message serialization, and prompt builders.
2. **Integration Tests (Vitest / Supertest)**: API route contracts, database migrations, and Supabase Row Level Security policy enforcement.
3. **End-to-End Tests (Playwright)**: Full browser interactions including Monaco Editor input, Pyodide Wasm execution in worker, terminal rendering, and responsive tab transitions.
4. **Security & Resilience Tests**: Leakage prevention for hidden tests, key vault isolation, and runtime infinite loop recovery.

---

## 2. Test Suites Specification

### 2.1 Unit Testing (`tests/unit/`)

| Test Suite | File | What it Validates |
| :--- | :--- | :--- |
| **Judge Comparator** | `tests/unit/judge/comparator.test.ts` | - Exact match with different line endings (`\r\n` vs `\n`).<br>- Stripping trailing line whitespace without altering leading indentation.<br>- Float tolerance comparisons (`0.1 + 0.2` vs `0.3`).<br>- Multi-line output comparison. |
| **Credential Encryption** | `tests/unit/security/encryption.test.ts` | - AES-256-GCM encryption/decryption roundtrip.<br>- Correct generation of unique IVs per encryption.<br>- Rejection of tampered auth tags or corrupted ciphertexts.<br>- Prevention of plaintext in intermediate objects. |
| **Error Classifier** | `tests/unit/mastery/classifier.test.ts` | - Extraction of error types from Python tracebacks (`SyntaxError`, `TypeError`, `NameError`, `IndexError`, `ZeroDivisionError`).<br>- Attribution to target skills. |
| **AI Prompt Formatter** | `tests/unit/ai/promptBuilder.test.ts` | - Context sanitization (ensures hidden tests are NOT injected into AI prompt).<br>- Token truncation guards. |

### 2.2 Integration Testing (`tests/integration/`)

| Test Suite | File | What it Validates |
| :--- | :--- | :--- |
| **Supabase RLS Policies** | `tests/integration/supabase/rls.test.ts` | - Authenticated user can query own submissions.<br>- Authenticated user CANNOT query another user's submissions.<br>- Non-service role CANNOT query `test_cases` where `is_hidden = true`.<br>- Non-owner CANNOT query `ai_settings` records. |
| **Judge Submission API** | `tests/integration/api/judgeSubmit.test.ts` | - POST `/api/judge/submit` with valid code yields `accepted`.<br>- POST `/api/judge/submit` with flawed code yields `wrong_answer`.<br>- Server-side evaluation validates against both public and hidden test cases without exposing hidden outputs. |
| **AI Settings API** | `tests/integration/api/aiSettings.test.ts` | - Saving API key persists encrypted data.<br>- GET `/api/settings/ai` returns masked preview only (e.g. `sk-...abcd`), never raw key.<br>- DELETE `/api/settings/ai` completely wipes credentials. |

### 2.3 End-to-End Testing (`tests/e2e/`)

| E2E Scenario | Spec File | Verification Steps |
| :--- | :--- | :--- |
| **1. Python Execution in Worker** | `tests/e2e/runtime.spec.ts` | 1. Navigate to `/exercises/sample-hello`.<br>2. Type `print("CodeCoBUG Ready")` in Monaco.<br>3. Click "Run Code".<br>4. Verify terminal displays `CodeCoBUG Ready` with exit code 0.<br>5. Type input code `val = input(); print(val)`.<br>6. Provide input in terminal drawer -> Verify output matches. |
| **2. Infinite Loop Watchdog** | `tests/e2e/watchdog.spec.ts` | 1. Enter `while True: pass` in Monaco.<br>2. Click "Run Code".<br>3. Verify execution terminates within 5,000ms.<br>4. Verify terminal shows "Time Limit Exceeded" alert.<br>5. Enter `print("Recovered")` and run again -> Verify worker recovered cleanly. |
| **3. Full Submission Journey** | `tests/e2e/submission.spec.ts` | 1. Log in as test user.<br>2. Open exercise.<br>3. Write wrong solution -> Click "Nộp bài" -> Verify `WA` verdict and test breakdown.<br>4. Write correct solution -> Click "Nộp bài" -> Verify `AC` verdict and progress update. |
| **4. Mobile Responsiveness** | `tests/e2e/responsive.spec.ts` | 1. Emulate viewport 375x667 (iPhone SE).<br>2. Verify workspace loads in tabbed mode.<br>3. Switch between `Đề bài`, `Editor`, and `Kết quả` tabs.<br>4. Confirm code editing and execution remain functional. |

---

## 3. Security Verification Checklist

- [ ] **No Secret in Bundles**: Client `.next/static` bundles inspected for absence of Supabase Service Role key and server encryption keys.
- [ ] **No Hidden Tests in Network**: Browser network requests inspected during exercise loading to ensure `test_cases` API never delivers `is_hidden: true` rows.
- [ ] **AI Context Sanitization**: AI requests inspected in backend logs to ensure prompts contain only the failed public test information, never private test suites.
- [ ] **Credential Protection**: Database dump verification ensures `ai_settings.encrypted_api_key` contains binary ciphertext, not base64-encoded plaintext.
- [ ] **Pyodide Sandbox Boundaries**: Browser local storage, session cookies, and cross-origin access tested from within Python script (`import js`) to enforce containment.

---

## 4. Test Execution Commands & CI Pipeline

When testing framework is installed in Phase 2+:
- `npm run test:unit` — Executes Vitest unit tests.
- `npm run test:integration` — Executes API & database integration tests against local Supabase instance.
- `npm run test:e2e` — Executes Playwright headless browser tests.
- `npm run type-check` — Runs `tsc --noEmit` across entire codebase.
- `npm run lint` — Runs ESLint rules.
