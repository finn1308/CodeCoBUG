/**
 * CODECOBUG — PHASE 4: BACKEND AND DATA INTEGRITY VERIFICATION TEST SUITE
 * 
 * Verifies:
 * 1. Unauthenticated API access rejection (HTTP 401) across all protected endpoints.
 * 2. Robust JSON parsing and validation: malformed/empty payloads return HTTP 400 (not 500).
 * 3. Payload size enforcement: code > 100KB rejected with HTTP 413.
 * 4. Cryptographic HMAC session verification: tampered tokens rejected, case-insensitive bearer support.
 * 5. Authoritative server-side attribution: client-supplied userIds are ignored.
 * 6. Strict multi-tenant isolation: User A cannot access User B's submissions or review queue.
 * 7. Server-side review queue synchronization: failed submissions queue review, passing marks completed.
 * 8. Query parameter filtering and sanitization on submissions endpoint.
 */

const assert = require('assert');
const http = require('http');

const BASE_URL = 'http://localhost:3001';

async function fetchApi(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, options);
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // raw text
  }
  return {
    status: response.status,
    headers: response.headers,
    text,
    json,
  };
}

async function runPhase4Tests() {
  console.log('\n======================================================================');
  console.log('🧪 CODECOBUG PHASE 4: BACKEND AND DATA INTEGRITY TEST SUITE');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function test(description, fn) {
    total++;
    try {
      fn();
      console.log(`  ✅ [PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${description}`);
      console.error(`     Error: ${err.message}`);
      throw err;
    }
  }

  async function testAsync(description, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${description}`);
      console.error(`     Error: ${err.message}`);
      throw err;
    }
  }

  // Generate tokens for testing
  const { createSessionToken, verifySessionToken } = require('../src/lib/auth/sessionToken');

  const aliceUser = {
    id: 'user-alice-p4-001',
    email: 'alice@codecobug.dev',
    displayName: 'Alice Developer',
    role: 'learner',
    points: 100,
    createdAt: new Date().toISOString(),
  };

  const bobUser = {
    id: 'user-bob-p4-002',
    email: 'bob@codecobug.dev',
    displayName: 'Bob Learner',
    role: 'learner',
    points: 50,
    createdAt: new Date().toISOString(),
  };

  const aliceToken = createSessionToken(aliceUser);
  const bobToken = createSessionToken(bobUser);

  // -------------------------------------------------------------------------
  // SUITE 1: Cryptographic Session Token Verification
  // -------------------------------------------------------------------------
  console.log('📦 SUITE 1: Cryptographic Session Security & Tamper Resistance');

  test('Valid token correctly verifies with full user profile payload', () => {
    const verified = verifySessionToken(aliceToken);
    assert.ok(verified, 'Verified token must not be null');
    assert.strictEqual(verified.id, aliceUser.id);
    assert.strictEqual(verified.email, aliceUser.email);
    assert.strictEqual(verified.role, 'learner');
  });

  test('Tampered token payload or signature is strictly rejected (returns null)', () => {
    const parts = aliceToken.split('.');
    assert.strictEqual(parts.length, 2);

    // Tamper with signature
    const tamperedSig = parts[0] + '.' + parts[1].slice(0, -3) + 'XYZ';
    assert.strictEqual(verifySessionToken(tamperedSig), null, 'Tampered signature must return null');

    // Tamper with payload
    const tamperedPayload = 'eyJuYW1lIjoiZmFrZSJ9.' + parts[1];
    assert.strictEqual(verifySessionToken(tamperedPayload), null, 'Tampered payload must return null');

    // Invalid non-token strings
    assert.strictEqual(verifySessionToken(''), null);
    assert.strictEqual(verifySessionToken('invalid-token-without-dot'), null);
    assert.strictEqual(verifySessionToken(null), null);
  });

  test('Expired session token is strictly rejected', () => {
    // Generate token that expired 1 second ago
    const expiredToken = createSessionToken(aliceUser, -1000);
    assert.strictEqual(verifySessionToken(expiredToken), null, 'Expired token must fail verification');
  });

  // -------------------------------------------------------------------------
  // SUITE 2: Unauthenticated Access Control (HTTP 401 Rejections)
  // -------------------------------------------------------------------------
  console.log('\n🔒 SUITE 2: Server-Side Authentication & Authorization Boundaries');

  await testAsync('POST /api/judge/submit without credentials returns HTTP 401', async () => {
    const res = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseSlug: 'in-loi-chao-codecobug', code: 'print("hello")' }),
    });
    assert.strictEqual(res.status, 401);
    assert.ok(res.json?.error?.includes('đăng nhập'), 'Error message must inform login requirement');
  });

  await testAsync('GET /api/submissions without credentials returns HTTP 401', async () => {
    const res = await fetchApi('/api/submissions');
    assert.strictEqual(res.status, 401);
    assert.ok(res.json?.error?.includes('đăng nhập'));
  });

  await testAsync('GET /api/review-queue without credentials returns HTTP 401', async () => {
    const res = await fetchApi('/api/review-queue');
    assert.strictEqual(res.status, 401);
    assert.ok(res.json?.error?.includes('đăng nhập'));
  });

  await testAsync('POST /api/review-queue without credentials returns HTTP 401', async () => {
    const res = await fetchApi('/api/review-queue', { method: 'POST' });
    assert.strictEqual(res.status, 401);
    assert.ok(res.json?.error?.includes('đăng nhập'));
  });

  // -------------------------------------------------------------------------
  // SUITE 3: Payload Parsing & HTTP Specification Compliance
  // -------------------------------------------------------------------------
  console.log('\n⚡ SUITE 3: Payload Parsing, Validation & Status Code Compliance');

  await testAsync('POST /api/judge/submit with malformed JSON body returns HTTP 400 (not 500)', async () => {
    const res = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aliceToken}`,
      },
      body: 'invalid-non-json-string{:',
    });
    assert.strictEqual(res.status, 400, 'Malformed JSON payload must return HTTP 400 Bad Request');
    assert.ok(res.json?.error?.includes('JSON'), 'Error message must state invalid JSON format');
  });

  await testAsync('POST /api/judge/submit with empty body returns HTTP 400 (not 500)', async () => {
    const res = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aliceToken}`,
      },
      body: '',
    });
    assert.strictEqual(res.status, 400, 'Empty body must return HTTP 400 Bad Request');
    assert.ok(res.json?.error);
  });

  await testAsync('POST /api/judge/submit with JSON array instead of object returns HTTP 400', async () => {
    const res = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aliceToken}`,
      },
      body: '[]',
    });
    assert.strictEqual(res.status, 400, 'JSON array payload must return HTTP 400 Bad Request');
  });

  await testAsync('POST /api/judge/submit with missing or empty exerciseSlug returns HTTP 400', async () => {
    const res = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({ code: 'print(1)' }),
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.json?.error?.includes('exerciseSlug'));
  });

  await testAsync('POST /api/judge/submit with unknown exerciseSlug returns HTTP 404', async () => {
    const res = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({ exerciseSlug: 'non-existent-exercise-slug-xyz', code: 'print(1)' }),
    });
    assert.strictEqual(res.status, 404);
    assert.ok(res.json?.error?.includes('Không tìm thấy'));
  });

  await testAsync('POST /api/judge/submit with code exceeding 100KB returns HTTP 413 Payload Too Large', async () => {
    const hugeCode = '# Large comment\n'.repeat(7000); // ~112KB
    const res = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({ exerciseSlug: 'in-loi-chao-codecobug', code: hugeCode }),
    });
    assert.strictEqual(res.status, 413, 'Oversized code submissions must return HTTP 413');
    assert.ok(res.json?.error?.includes('100KB'));
  });

  // -------------------------------------------------------------------------
  // SUITE 4: Authoritative Attribution & Anti-Spoofing
  // -------------------------------------------------------------------------
  console.log('\n🛡️ SUITE 4: Authoritative Attribution & Anti-Spoofing Defense');

  await testAsync('Client-supplied userId in POST body is strictly ignored in favor of token ID', async () => {
    const res = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        exerciseSlug: 'in-loi-chao-codecobug',
        code: 'print("Wrong answer for test")',
        userId: 'malicious-hacker-account', // Attempt to spoof another account!
      }),
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.json?.savedSubmission, 'savedSubmission record must exist');
    assert.strictEqual(
      res.json.savedSubmission.userId,
      aliceUser.id,
      'Saved submission MUST be attributed exclusively to verified aliceUser.id'
    );
    assert.notStrictEqual(
      res.json.savedSubmission.userId,
      'malicious-hacker-account',
      'Client-supplied userId must NEVER be persisted'
    );
  });

  await testAsync('Authorization header supports case-insensitive bearer prefix', async () => {
    const res = await fetchApi('/api/submissions', {
      headers: {
        Authorization: `bearer ${aliceToken}`, // lowercase bearer
      },
    });
    assert.strictEqual(res.status, 200, 'Lowercase bearer prefix must authenticate successfully');
  });

  // -------------------------------------------------------------------------
  // SUITE 5: Strict Multi-Tenant Data Isolation
  // -------------------------------------------------------------------------
  console.log('\n🏢 SUITE 5: Strict Multi-Tenant Data Isolation');

  await testAsync('Bob CANNOT see Alice submissions or review queue', async () => {
    // 1. Query Alice submissions
    const aliceSubsRes = await fetchApi('/api/submissions', {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(aliceSubsRes.status, 200);
    assert.ok(Array.isArray(aliceSubsRes.json.submissions));
    assert.ok(aliceSubsRes.json.submissions.length > 0, 'Alice has at least 1 submission');
    assert.ok(
      aliceSubsRes.json.submissions.every((s) => s.userId === aliceUser.id),
      'All submissions returned for Alice must belong to Alice'
    );

    // 2. Query Bob submissions (Bob has made 0 submissions)
    const bobSubsRes = await fetchApi('/api/submissions', {
      headers: { Authorization: `Bearer ${bobToken}` },
    });
    assert.strictEqual(bobSubsRes.status, 200);
    assert.ok(Array.isArray(bobSubsRes.json.submissions));
    assert.strictEqual(
      bobSubsRes.json.submissions.length,
      0,
      'Bob MUST NOT see any of Alice submissions'
    );

    // 3. Query Bob review queue
    const bobQueueRes = await fetchApi('/api/review-queue', {
      headers: { Authorization: `Bearer ${bobToken}` },
    });
    assert.strictEqual(bobQueueRes.status, 200);
    assert.strictEqual(bobQueueRes.json.userId, bobUser.id);
    assert.strictEqual(bobQueueRes.json.totalPending, 0);
  });

  // -------------------------------------------------------------------------
  // SUITE 6: Review Queue Auto-Sync & Lifecycle
  // -------------------------------------------------------------------------
  console.log('\n🔄 SUITE 6: Review Queue Synchronization & Lifecycle');

  await testAsync('Failed submission automatically populates pending review queue for user', async () => {
    const aliceQueueRes = await fetchApi('/api/review-queue', {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(aliceQueueRes.status, 200);
    assert.ok(aliceQueueRes.json.totalPending >= 1, 'Alice must have a pending review item for the failed submission');
    const item = aliceQueueRes.json.pending.find((q) => q.exerciseSlug === 'in-loi-chao-codecobug');
    assert.ok(item, 'Queue must contain in-loi-chao-codecobug');
    assert.strictEqual(item.status, 'pending');
    assert.strictEqual(item.reason, 'failed_submission');
  });

  await testAsync('Subsequent accepted submission marks the pending review item as completed', async () => {
    // Alice submits correct accepted solution
    const passRes = await fetchApi('/api/judge/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        exerciseSlug: 'in-loi-chao-codecobug',
        code: 'print("Xin chao CodeCoBUG")\n',
      }),
    });
    assert.strictEqual(passRes.status, 200);
    assert.strictEqual(passRes.json.verdict, 'accepted');

    // Query Alice review queue: in-loi-chao-codecobug should now be in completed!
    const queueRes = await fetchApi('/api/review-queue', {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(queueRes.status, 200);
    const completedItem = queueRes.json.completed.find((q) => q.exerciseSlug === 'in-loi-chao-codecobug');
    assert.ok(completedItem, 'Accepted submission must transition review item to completed');
    assert.strictEqual(completedItem.status, 'completed');
  });

  // -------------------------------------------------------------------------
  // SUITE 7: Query Parameter Filtering
  // -------------------------------------------------------------------------
  console.log('\n🔍 SUITE 7: Submissions Query Parameter Filtering');

  await testAsync('Filtering by exerciseSlug returns only submissions for that exercise', async () => {
    const res = await fetchApi('/api/submissions?exerciseSlug=in-loi-chao-codecobug', {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.submissions.length >= 2, 'Alice has 2 submissions for in-loi-chao-codecobug');
    assert.ok(
      res.json.submissions.every((s) => s.exerciseSlug === 'in-loi-chao-codecobug'),
      'All filtered submissions must match queried exerciseSlug'
    );
  });

  await testAsync('Filtering with whitespace in exerciseSlug is safely trimmed', async () => {
    const res = await fetchApi('/api/submissions?exerciseSlug=%20in-loi-chao-codecobug%20', {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.json.submissions.length >= 2);
  });

  console.log('\n======================================================================');
  console.log(`🎉 ALL ${passed}/${total} PHASE 4 INTEGRATION TESTS PASSED (100% SUCCESS)`);
  console.log('======================================================================\n');
}

runPhase4Tests().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});

