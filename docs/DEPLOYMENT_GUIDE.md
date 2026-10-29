# CodeCoBUG — Production Deployment & Operations Guide

## 1. System Overview & Architecture

CodeCoBUG is a hybrid in-browser and serverless learning platform for Python programming:
- **Client Frontend**: Next.js 15 App Router + React 19 + Monaco Editor.
- **Client Sandbox**: Pyodide WebAssembly in an isolated Web Worker (`/public/workers/pyodide.worker.js`), handling Python interpretation, stdin/stdout piping, and execution timeouts without server costs.
- **Judge Engine**: Deterministic Next.js API Route (`/api/judge/submit`) running against test cases (3 public + hidden tests), validating constraints, tokens, float tolerances, and outputs.
- **Persistence & Auth**: Supabase PostgreSQL with strict Row Level Security (RLS) policies for multi-tenant isolation, user session drafts, submissions history, and mastery states.
- **AI Tutor Service**: Multi-provider BYOK proxy (`/api/ai/chat`) supporting Google Gemini, OpenAI, and Anthropic with AES-256-GCM encryption, secret key masking, and traceback redaction.

---

## 2. System Requirements & Prerequisites

- **Node.js**: `v18.17.0` or higher (`v20.x` LTS recommended).
- **Package Manager**: `npm` (v9+) or `pnpm` (v8+).
- **Database**: PostgreSQL 14+ or Supabase Project.
- **Memory**: Minimum 1GB RAM for build; 512MB RAM for production runtime.
- **Network**: Outbound HTTPS access to:
  - `https://cdn.jsdelivr.net` (for Pyodide WebAssembly runtime assets)
  - `https://generativelanguage.googleapis.com` (for Gemini API)
  - `https://api.openai.com` (for OpenAI API)
  - `https://api.anthropic.com` (for Anthropic API)

---

## 3. Environment Variables Configuration

Create a production `.env.local` or configure deployment environment variables using `.env.example`:

```bash
# 1. Base URL of Application
NEXT_PUBLIC_APP_URL=https://your-domain.com

# 2. Supabase Connection (Public Anon Key for Client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# 3. Supabase Service Role Key (Keep Strictly Private, Never on Client!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# 4. Master Symmetric Encryption Key (AES-256-GCM - 32 Bytes Hex)
# Generate via: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
APP_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# 5. Optional Server-Level Fallback AI Keys
# GEMINI_API_KEY=AIzaSy...
# OPENAI_API_KEY=sk-proj-...
# ANTHROPIC_API_KEY=sk-ant-...
```

---

## 4. Database Setup & Migrations

Execute the SQL migration scripts in sequential order in Supabase SQL Editor or via Supabase CLI:

1. `supabase/migrations/001_initial_schema.sql`:
   - Creates tables: `profiles`, `courses`, `topics`, `lessons`, `exercises`, `examples`, `test_cases`, `submissions`, `test_results`, `skills`, `skill_mastery`, `ai_settings`.
2. `supabase/migrations/002_rls_security_policies.sql`:
   - Enables Row Level Security (RLS) on all exposed tables.
   - Enforces `is_hidden = false` for public queries on `test_cases`.
   - Isolates `submissions` and `ai_settings` strictly to `auth.uid() = user_id`.
3. `supabase/migrations/003_adaptive_mastery_and_review.sql`:
   - Adds `exercise_skills` and `review_queue` tables for adaptive review tracking.

---

## 5. Build & Launch Instructions

### Local / Self-Hosted Production Run
```bash
# Install production dependencies
npm ci

# Verify type safety
npx tsc --noEmit

# Compile optimized production bundle
npm run build

# Start Next.js production server (default port 3000)
npm run start
```

### Docker Deployment
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 6. Security & Hardening Checklist

1. **Content Security Policy (CSP)**:
   - Pyodide requires `'unsafe-eval'` for WebAssembly JIT execution within the Web Worker.
   - Recommended headers:
     ```
     Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; worker-src 'self' blob:; connect-src 'self' https://cdn.jsdelivr.net https://*.supabase.co https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:;
     ```
2. **Secret Redaction**:
   - `SUPABASE_SERVICE_ROLE_KEY` must never be referenced with `NEXT_PUBLIC_` prefix.
   - User BYOK API keys are encrypted with AES-256-GCM before database storage and masked when returned to UI.
3. **Judge Engine Security**:
   - Hidden test case inputs and expected outputs are never returned in client API responses.
   - Run Code executes client-side in Web Worker; Submit evaluates securely on the server API route.

---

## 7. Known Limitations & Operational Considerations

1. **Pyodide Cold Start**:
   - First-time loading of Pyodide WebAssembly (~10MB) takes 1–3 seconds depending on user internet speed. Subsequent loads are cached by browser Service Worker/HTTP cache.
2. **Browser Memory & Mobile Performance**:
   - On low-end mobile devices (<2GB RAM), memory constraints may restrict executing extremely memory-heavy Python scripts (e.g., massive list allocations). A 5000ms watchdog timeout is enforced to prevent browser lockup.
3. **No External Network in Pyodide**:
   - Python code running inside Pyodide cannot make arbitrary socket connections due to browser CORS/sandboxing limitations.
