/**
 * CodeCoBUG Phase 2 Test Suite: Pastel London Design System
 *
 * Verifies:
 * 1. Palette tokens (Mint, Lavender, Sky Blue, Peach, Soft Yellow, Soft Pink, London Red, Cream, Background, Text, Secondary Text, Border).
 * 2. London Architectural & Street Accents (London Brick, London Slate, Underground Blue).
 * 3. Typography & Spacing scale, Card radii (20-24px), Controls radii (12-16px).
 * 4. Micro-interactions, focus rings, reduced motion, responsive rules.
 * 5. Reusable UI components & their new London Pastel variants (Button, Badge, Card).
 * 6. LondonMotif SVG exports (BigBen, LondonBus, StreetLamp, UndergroundRoundel, LondonSkyline, AfternoonTea).
 * 7. WCAG AA / AAA Accessible Text Contrast Ratios.
 */

const fs = require('fs');
const path = require('path');
const React = require('react');

// Mock browser globals for React SSR component testing
const store = {};
global.window = {
  confirm: () => true,
  localStorage: {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
  },
};
global.document = {
  addEventListener: () => {},
  removeEventListener: () => {},
  body: { style: { overflow: '' } },
};

const UI = require('../src/components/ui');

let passCount = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✔ PASS: ${message}`);
  passCount++;
}

// Relative luminance and contrast ratio calculator (WCAG 2.1)
function getLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

console.log('\n=============================================================');
console.log('🇬🇧 RUNNING PHASE 2: PASTEL LONDON DESIGN SYSTEM TEST SUITE');
console.log('=============================================================\n');

// Group 1: Global CSS Pastel London Palette Verification
console.log('--- Test Group 1: Pastel London Palette Tokens ---');
const globalsCssPath = path.resolve(__dirname, '../src/app/globals.css');
assert(fs.existsSync(globalsCssPath), 'globals.css exists');
const cssContent = fs.readFileSync(globalsCssPath, 'utf8');

assert(cssContent.includes('--pastel-mint: #BFE8D0'), 'Mint token: #BFE8D0');
assert(cssContent.includes('--pastel-lavender: #DCCBFF'), 'Lavender token: #DCCBFF');
assert(cssContent.includes('--pastel-sky: #C7E3FF'), 'Sky Blue token: #C7E3FF');
assert(cssContent.includes('--pastel-peach: #FFCDBD'), 'Peach Coral token: #FFCDBD');
assert(cssContent.includes('--pastel-yellow: #FFF0B8'), 'Soft Yellow token: #FFF0B8');
assert(cssContent.includes('--pastel-pink: #F5D5E8'), 'Soft Pink token: #F5D5E8');
assert(cssContent.includes('--london-red: #C93C45'), 'London Red token: #C93C45');
assert(cssContent.includes('--london-cream: #FFF9EF'), 'Cream token: #FFF9EF');
assert(cssContent.includes('--bg-primary: #F7F9FC'), 'Background canvas token: #F7F9FC');
assert(cssContent.includes('--text-primary: #243047'), 'Main text token: #243047');
assert(cssContent.includes('--text-secondary: #697386'), 'Secondary text token: #697386');
assert(cssContent.includes('--border-subtle: #E7EAF0'), 'Border token: #E7EAF0');

// Group 2: London Architectural & Street Accent Tokens
console.log('\n--- Test Group 2: London Street & Architectural Accents ---');
assert(cssContent.includes('--london-brick: #DE7C68'), 'London Brick accent: #DE7C68');
assert(cssContent.includes('--london-slate: #3B4B5A'), 'London Slate accent: #3B4B5A');
assert(cssContent.includes('--london-underground-blue: #0019A8'), 'Underground Blue accent: #0019A8');
assert(cssContent.includes('.london-underground-badge'), 'London Underground badge class defined');
assert(cssContent.includes('.london-bus-badge'), 'London Bus badge class defined');
assert(cssContent.includes('.london-card-brick'), 'London Brick card class defined');
assert(cssContent.includes('.london-skyline-accent'), 'London Skyline accent class defined');

// Group 3: Radii, Shadows, Spacing & Motion Tokens
console.log('\n--- Test Group 3: Radii, Touch Targets & Motion Standards ---');
assert(cssContent.includes('--radius-md: 12px'), 'Controls radius token is 12px (12-16px range)');
assert(cssContent.includes('--radius-lg: 16px'), 'Large controls radius token is 16px (12-16px range)');
assert(cssContent.includes('--radius-xl: 20px'), 'Card radius token is 20px (20-24px range)');
assert(cssContent.includes('--radius-2xl: 24px'), 'Hero card radius token is 24px (20-24px range)');
assert(cssContent.includes('--radius-full: 9999px'), 'Pill radius is 9999px');
assert(cssContent.includes(':focus-visible'), ':focus-visible high-contrast ring defined');
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'prefers-reduced-motion rule defined');

// Group 4: UI Component Library Exports & New Variants
console.log('\n--- Test Group 4: UI Component Library Exports & London Variants ---');
assert(typeof UI.Button !== 'undefined', 'Button component is exported');
assert(typeof UI.Card !== 'undefined', 'Card component is exported');
assert(typeof UI.Badge !== 'undefined', 'Badge component is exported');
assert(typeof UI.Input !== 'undefined', 'Input component is exported');
assert(typeof UI.Modal !== 'undefined', 'Modal component is exported');
assert(typeof UI.Tabs !== 'undefined', 'Tabs component is exported');
assert(typeof UI.ToastProvider !== 'undefined', 'ToastProvider is exported');

// CSS classes for Button variants
assert(cssContent.includes('.btn-pink'), '.btn-pink class defined in globals.css');
assert(cssContent.includes('.btn-london-red'), '.btn-london-red class defined in globals.css');
assert(cssContent.includes('.btn-cream'), '.btn-cream class defined in globals.css');

// CSS classes for Badge variants
assert(cssContent.includes('.badge-pink'), '.badge-pink class defined in globals.css');
assert(cssContent.includes('.badge-london_red'), '.badge-london_red class defined in globals.css');
assert(cssContent.includes('.badge-cream'), '.badge-cream class defined in globals.css');

// CSS classes for Card variants
assert(cssContent.includes('.card-pink'), '.card-pink class defined in globals.css');
assert(cssContent.includes('.card-cream'), '.card-cream class defined in globals.css');
assert(cssContent.includes('.card-brick'), '.card-brick class defined in globals.css');

// Group 5: London Motifs Verification
console.log('\n--- Test Group 5: London Motifs Vector Components ---');
assert(typeof UI.BigBen !== 'undefined', 'BigBen motif exported');
assert(typeof UI.LondonBus !== 'undefined', 'LondonBus motif exported');
assert(typeof UI.StreetLamp !== 'undefined', 'StreetLamp motif exported');
assert(typeof UI.UndergroundRoundel !== 'undefined', 'UndergroundRoundel motif exported');
assert(typeof UI.LondonSkyline !== 'undefined', 'LondonSkyline motif exported');
assert(typeof UI.AfternoonTea !== 'undefined', 'AfternoonTea motif exported');

// Group 6: WCAG AA / AAA Accessible Contrast Ratios
console.log('\n--- Test Group 6: Accessible Text Contrast Ratios ---');
// White on London Red
const whiteOnLondonRed = getContrast('#FFFFFF', '#C93C45');
assert(whiteOnLondonRed >= 4.5, `White text on London Red contrast: ${whiteOnLondonRed.toFixed(2)}:1 (Passes AA >= 4.5:1)`);

// Soft Pink Text (#6E184D) on Soft Pink (#F5D5E8)
const pinkTextOnPink = getContrast('#6E184D', '#F5D5E8');
assert(pinkTextOnPink >= 7.0, `Pink text (#6E184D) on Soft Pink contrast: ${pinkTextOnPink.toFixed(2)}:1 (Passes AAA >= 7.0:1)`);

// Cream Text (#4A3519) on Cream (#FFF9EF)
const creamTextOnCream = getContrast('#4A3519', '#FFF9EF');
assert(creamTextOnCream >= 7.0, `Cream text (#4A3519) on Cream contrast: ${creamTextOnCream.toFixed(2)}:1 (Passes AAA >= 7.0:1)`);

// London Red Accent Text (#8E1B23) on London Red Light (#FDF1F2)
const redAccentOnLight = getContrast('#8E1B23', '#FDF1F2');
assert(redAccentOnLight >= 7.0, `Red accent text (#8E1B23) on Red Light contrast: ${redAccentOnLight.toFixed(2)}:1 (Passes AAA >= 7.0:1)`);

// Main Text on Cream
const mainTextOnCream = getContrast('#243047', '#FFF9EF');
assert(mainTextOnCream >= 10.0, `Main text (#243047) on Cream contrast: ${mainTextOnCream.toFixed(2)}:1 (Passes AAA >= 7.0:1)`);

console.log('\n=============================================================');
console.log(`🎉 PASTEL LONDON DESIGN SYSTEM: ALL ${passCount} ASSERTIONS VERIFIED!`);
console.log('=============================================================\n');

