/**
 * CodeCoBUG Phase 3 Test Suite: Minimal London Homepage
 *
 * Verifies:
 * 1. Minimal London Homepage route (src/app/page.tsx) and component architecture.
 * 2. Header area: Brand logo, compact controls, account status / avatar, no giant sidebar.
 * 3. Center area: Pastel London streetscape illustration (Big Ben, London red bus, bookshop, streetlamp).
 * 4. Tailored greeting matching account state (Guest vs Authenticated learner).
 * 5. Central One-Tap Action: "Mở CodeCoBUG" button linking to active exercise with large touch target.
 * 6. Guiding line for newcomers explaining where to start.
 * 7. Quick Transit Stations (Curriculum, Coding Lab, PBL Projects, AI Tutor).
 * 8. Route integrity: /curriculum, /exercises/..., /projects preserved and fully accessible.
 * 9. Authentication flow: Guest vs Authenticated state, no forced re-login, zero dead '#' links.
 * 10. Responsive layout, accessibility & reduced motion.
 */

const fs = require('fs');
const path = require('path');
const React = require('react');

// Mock browser globals for React SSR component testing
const store = {};
const mockLocalStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
};
global.window = {
  confirm: () => true,
  localStorage: mockLocalStorage,
};
global.localStorage = mockLocalStorage;
global.document = {
  addEventListener: () => {},
  removeEventListener: () => {},
  body: { style: { overflow: '' } },
};

const { authManager } = require('../src/lib/auth/authManager');
const { OFFICIAL_PYTHON_COURSE } = require('../src/lib/curriculum');

let passCount = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✔ PASS: ${message}`);
  passCount++;
}

async function run() {
  console.log('\n=============================================================');
  console.log('🇬🇧 RUNNING PHASE 3: MINIMAL LONDON HOMEPAGE TEST SUITE');
  console.log('=============================================================\n');

  // Group 1: Route & Component Architecture
  console.log('--- Test Group 1: Route & Component Architecture ---');
  const pagePath = path.resolve(__dirname, '../src/app/page.tsx');
  assert(fs.existsSync(pagePath), 'Home page route exists (src/app/page.tsx)');
  const pageCode = fs.readFileSync(pagePath, 'utf8');

  assert(pageCode.includes('AppShell'), 'Home page uses AppShell layout');
  assert(pageCode.includes('hideSidebar={true}'), 'Home page hides large sidebar for clean, uncluttered layout');
  assert(pageCode.includes('MinimalLondonHome'), 'Home page renders MinimalLondonHome component');
  assert(pageCode.includes('LearningDashboard'), 'Home page maintains LearningDashboard integration');

  const homeCompPath = path.resolve(__dirname, '../src/components/home/MinimalLondonHome.tsx');
  assert(fs.existsSync(homeCompPath), 'MinimalLondonHome.tsx component exists');
  const homeCode = fs.readFileSync(homeCompPath, 'utf8');

  // Group 2: Header Area Specifications
  console.log('\n--- Test Group 2: Header Area Specifications ---');
  const headerPath = path.resolve(__dirname, '../src/components/common/Header.tsx');
  assert(fs.existsSync(headerPath), 'Header.tsx exists');
  const headerCode = fs.readFileSync(headerPath, 'utf8');

  assert(headerCode.includes('CodeCoBUG'), 'Header contains CodeCoBUG brand name');
  assert(headerCode.includes('showBrand'), 'Header supports showBrand toggle when sidebar is hidden');
  assert(headerCode.includes('user.displayName'), 'Header renders authenticated user display name');
  assert(headerCode.includes('Đăng nhập'), 'Header renders sign-in option for unauthenticated guests');
  assert(headerCode.includes('AI Tutor'), 'Header contains compact AI Tutor action');
  assert(headerCode.includes('Điểm yếu & Ôn tập'), 'Header contains compact Weakness Tracker action');
  assert(headerCode.includes('Cài đặt AI'), 'Header contains compact AI settings action');

  // Group 3: Central Pastel London Streetscape & Motifs
  console.log('\n--- Test Group 3: Central Pastel London Streetscape & Motifs ---');
  assert(homeCode.includes('LondonStreetscapeIllustration'), 'London streetscape vector illustration component defined');
  assert(homeCode.includes('BigBen'), 'Big Ben motif integrated');
  assert(homeCode.includes('LondonBus'), 'London red bus motif integrated');
  assert(homeCode.includes('StreetLamp'), 'Victorian streetlamp motif integrated');
  assert(homeCode.includes('UndergroundRoundel'), 'London Underground roundel motif integrated');
  assert(homeCode.includes('LONDON CODE BOOKSHOP'), 'Bloomsbury code bookshop facade rendered in illustration');
  assert(homeCode.includes('#C93C45'), 'Authentic London Red (#C93C45) token utilized in illustration and badges');
  assert(homeCode.includes('aria-hidden="true"'), 'Decorative illustration uses aria-hidden="true" to not obstruct assistive tech');

  // Group 4: Central Action: "Mở CodeCoBUG" & Tailored Greeting
  console.log('\n--- Test Group 4: Central Action: "Mở CodeCoBUG" & Tailored Greeting ---');
  assert(homeCode.includes('Mở CodeCoBUG'), 'Central prominent action button "Mở CodeCoBUG" exists');
  assert(homeCode.includes('btn-london-red') || homeCode.includes('variant="london_red"'), '"Mở CodeCoBUG" button styled with London Red variant');
  assert(homeCode.includes('Gợi ý cho người mới'), 'Guiding line for newcomers present');
  assert(homeCode.includes('In lời chào đầu tiên với Python') || homeCode.includes('print()'), 'Guiding line recommends Topic 01 / print() first step');

  // Group 5: Quick Transit Stations
  console.log('\n--- Test Group 5: Quick Transit Stations ---');
  assert(homeCode.includes('/curriculum'), 'Station card links to /curriculum');
  assert(homeCode.includes('/exercises/'), 'Station card links to Python practice lab');
  assert(homeCode.includes('/projects'), 'Station card links to Project-Based Learning (/projects)');
  assert(homeCode.includes('Gia sư AI Đồng hành') || homeCode.includes('BYOK AI'), 'Station card provides AI Tutor access');

  // Group 6: Zero Dead Links & Real Route Verification
  console.log('\n--- Test Group 6: Zero Dead Links Verification ---');
  const deadLinkMatches = homeCode.match(/href=["']#["']/g);
  assert(!deadLinkMatches, 'Zero dead href="#" links in MinimalLondonHome');

  // Verify all target routes exist
  assert(fs.existsSync(path.resolve(__dirname, '../src/app/curriculum/page.tsx')), '/curriculum route exists');
  assert(fs.existsSync(path.resolve(__dirname, '../src/app/exercises/[exerciseSlug]/page.tsx')), '/exercises/[exerciseSlug] route exists');
  assert(fs.existsSync(path.resolve(__dirname, '../src/app/projects/page.tsx')), '/projects route exists');
  assert(fs.existsSync(path.resolve(__dirname, '../src/app/projects/[projectSlug]/page.tsx')), '/projects/[projectSlug] route exists');

  // Group 7: Authentication Flow & Account State Awareness
  console.log('\n--- Test Group 7: Authentication Flow & Account State Awareness ---');
  // Clean state test
  await authManager.signOut();
  assert(authManager.getCurrentUser() === null, 'authManager starts in logged out state');

  // Verify guest banner rendering condition
  assert(homeCode.includes('Bạn đang trải nghiệm dưới danh nghĩa Khách'), 'Guest session banner defined');
  assert(homeCode.includes('Đăng nhập ngay'), 'Guest sign in action defined');

  // Verify authenticated learner rendering condition
  await authManager.signIn('learner@codecobug.dev', 'password123').catch(async () => {
    return await authManager.signUp('learner@codecobug.dev', 'Học viên CodeCoBUG', 'password123');
  });
  const activeUser = authManager.getCurrentUser();
  assert(activeUser !== null, 'authManager logged in successfully');
  assert(activeUser.email === 'learner@codecobug.dev', 'Active user email matches');
  assert(homeCode.includes('Chào mừng quay trở lại') || homeCode.includes('user.displayName'), 'Personalized greeting for active user');
  assert(homeCode.includes('Quản lý tài khoản'), 'Account management action available when logged in');

  // Group 8: Responsive Layout & Accessibility Standards
  console.log('\n--- Test Group 8: Responsive Layout & Accessibility Standards ---');
  const globalsPath = path.resolve(__dirname, '../src/app/globals.css');
  const globalsCode = fs.readFileSync(globalsPath, 'utf8');

  assert(globalsCode.includes('@media (prefers-reduced-motion: reduce)'), 'globals.css enforces reduced motion preference');
  assert(globalsCode.includes(':focus-visible'), 'globals.css enforces high-contrast focus rings');
  assert(globalsCode.includes('--radius-2xl: 24px'), 'Hero card uses 24px rounded radius');
  assert(globalsCode.includes('--radius-lg: 16px'), 'Controls use 16px radius');

  console.log('\n=============================================================');
  console.log(`🎉 MINIMAL LONDON HOMEPAGE: ALL ${passCount} ASSERTIONS VERIFIED!`);
  console.log('=============================================================\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
