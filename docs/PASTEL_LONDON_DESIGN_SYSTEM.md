# CodeCoBUG — Pastel London Design System Specification
**Concept: Pastel London Street × Modern Learning Studio × One-Tap UX**

---

## 1. Executive Summary & Design Vision

The **Pastel London Design System** establishes the visual language and interactive ergonomics for CodeCoBUG. It combines the warm, storied charm of London streetscapes (Bloomsbury bookshops, red Routemaster buses, Victorian street lamps, iconic silhouettes) with the clean simplicity of a modern learning studio and high-accessibility one-tap interactions.

### Guiding Principles

1. **Pastel London Atmosphere with Restraint**: Soft pastels (Mint, Lavender, Sky Blue, Peach, Soft Yellow, Soft Pink, Westminster Cream) form the primary visual surfaces, while London Red (`#C93C45`) serves as an energetic focal accent. Motifs remain subtle and non-intrusive, never competing with code or problem instructions.
2. **One-Tap UX**: Large, unambiguous touch targets ($\ge 44\text{px}$) with immediate tactile state feedback (`:active` spring compression, `:hover` elevation, accessible `:focus-visible` rings).
3. **High-Contrast Readability (WCAG AA/AAA)**: Deep navy slate text (`#243047`) on pastels provides contrast ratios exceeding $8:1$ (exceeding AAA requirements $\ge 7:1$). London Red and Soft Pink text pairings achieve fully compliant contrast ratios.
4. **Preserved Business & Learning Logic**: All 44 lessons, 87 exercises, Judge evaluation engines, and AI tutor subsystems remain 100% backward-compatible.

---

## 2. Color Palette & Accessibility Specifications

| Color Role | CSS Variable | Hex Code | Purpose / Usage | Accessible Contrast Ratio | WCAG Tier |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `--bg-primary` | `#F7F9FC` | Clean light canvas for all page views | 12.53:1 (with `#243047`) | **AAA** |
| **Surface / Card** | `--bg-surface` | `#FFFFFF` | Cards, workspace containers, modals | 13.22:1 (with `#243047`) | **AAA** |
| **Primary Mint** | `--pastel-mint` | `#BFE8D0` | Primary success/active state & milestone badge | 8.38:1 (with `#16432A`) | **AAA** |
| **Lavender** | `--pastel-lavender` | `#DCCBFF` | Intermediate chapters, AI tutor callouts | 8.99:1 (with `#371E6B`) | **AAA** |
| **Sky Blue** | `--pastel-sky` | `#C7E3FF` | Active selection, information, code tags | 7.82:1 (with `#0E426F`) | **AAA** |
| **Peach Coral** | `--pastel-peach` | `#FFCDBD` | Challenge exercises, advanced concepts | 7.91:1 (with `#6A2311`) | **AAA** |
| **Soft Yellow** | `--pastel-yellow` | `#FFF0B8` | Warnings, tips, attention callouts | 8.24:1 (with `#594400`) | **AAA** |
| **Soft Pink** | `--pastel-pink` | `#F5D5E8` | Beginner highlights, playful badges | 8.19:1 (with `#6E184D`) | **AAA** |
| **London Red** | `--london-red` | `#C93C45` | Routemaster accent, call-to-action buttons | 4.98:1 (with `#FFFFFF`) | **AA** |
| **Westminster Cream**| `--london-cream` | `#FFF9EF` | Parchment facades, reading panels | 11.05:1 (with `#4A3519`)| **AAA** |
| **London Brick** | `--london-brick` | `#DE7C68` | Victorian facade accent, warm borders | 4.62:1 (with `#243047`) | **AA** |
| **London Slate** | `--london-slate` | `#3B4B5A` | Secondary icons, architectural linework | 8.15:1 (on `#FFFFFF`) | **AAA** |
| **Primary Text** | `--text-primary` | `#243047` | Main headings, body prose, code titles | 13.22:1 (on `#FFFFFF`) | **AAA** |
| **Secondary Text** | `--text-secondary`| `#697386` | Metadata, subtitles, timestamps | 4.78:1 (on `#FFFFFF`) | **AA** |
| **Subtle Border** | `--border-subtle` | `#E7EAF0` | Card borders, dividers, subtle separators | Structure | N/A |

---

## 3. London Visual Language & Motif System

The motif collection is implemented in lightweight, vector-based SVG components located in `src/components/ui/LondonMotif.tsx` and exported via `src/components/ui`:

```tsx
import {
  BigBen,
  LondonBus,
  StreetLamp,
  UndergroundRoundel,
  LondonSkyline,
  AfternoonTea
} from '@/components/ui';
```

### Motif Roster & Usage Guidelines

1. **`BigBen` (Elizabeth Tower)**:
   - *Symbolism*: Punctuality, time tracking, chapter milestones.
   - *Placement*: Progress headers, streak counters, chapter badges.
2. **`LondonBus` (AEC Routemaster Silhouette)**:
   - *Symbolism*: Journey progression, moving through curriculum checkpoints.
   - *Placement*: Lộ trình buttons, next lesson navigators, milestone unlocks.
3. **`StreetLamp` (Victorian Cast-Iron Lamp)**:
   - *Symbolism*: Illumination, hints, solution explanations.
   - *Placement*: AI Tutor panels, "Gợi ý" hint triggers, concept explanations.
4. **`UndergroundRoundel`**:
   - *Symbolism*: Quick transit, direct jump to lesson/exercise, station stops.
   - *Placement*: Station markers along chapter tracks, quick-action navigation.
5. **`LondonSkyline`**:
   - *Symbolism*: Horizon, broad overview, master journey.
   - *Placement*: Subtle background watermark footer or curriculum overview header.
6. **`AfternoonTea`**:
   - *Symbolism*: Rest, review session, reflection pause.
   - *Placement*: Review queue, completed daily session celebration modal.

---

## 4. Typography, Radii & Interaction System

### Corner Radii Scale

- **Standard Controls (Buttons, Inputs, Selects)**: `--radius-md: 12px`
- **Large Controls / Header Badges**: `--radius-lg: 16px`
- **Standard Content Cards & Workspaces**: `--radius-xl: 20px` (Strictly within the 20–24px card guideline)
- **Hero Containers, Large Panels & Modals**: `--radius-2xl: 24px`
- **Pills, Avatars & Motif Badges**: `--radius-full: 9999px`

### Micro-Interactions & Animation Standards

- **Interaction Duration**: Fast micro-feedback (`100ms - 220ms` via `--transition-fast`) ensures snappiness without visual lag.
- **Elevation Transitions**: Card hover raises elements by `translateY(-2px)` with soft shadow elevation (`--shadow-md`).
- **Tactile Button Press**: `:active` triggers `transform: scale(0.98)` for immediate physical feedback.
- **Accessible Focus Ring**: `:focus-visible` renders a distinct `2px solid var(--border-focus)` (`#58B084`) with an offset of `2px`.
- **Reduced Motion Support**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

---

## 5. UI Component Library Extensions

### 1. `Button` (`src/components/ui/Button.tsx`)
New variants added:
- `'pink'`: Soft Pink playful button (`.btn-pink`).
- `'london_red'`: Bold Routemaster red primary action (`.btn-london-red`).
- `'cream'`: Warm limestone neutral button (`.btn-cream`).
- Maintained: `'primary'`, `'mint'`, `'lavender'`, `'sky'`, `'peach'`, `'secondary'`, `'outline'`, `'ghost'`, `'danger'`, `'success'`.

### 2. `Badge` (`src/components/ui/Badge.tsx`)
New variants added:
- `'pink'`: Soft pink pill with high-contrast `#6E184D` text.
- `'london_red'`: Light London red badge with deep red accent text `#8E1B23`.
- `'cream'`: Cream badge with deep sepia text `#4A3519`.
- Maintained: `'mint'`, `'lavender'`, `'sky'`, `'peach'`, `'yellow'`, `'success'`, `'error'`, `'warning'`, `'neutral'`, and all difficulty levels.

### 3. `Card` (`src/components/ui/Card.tsx`)
New variants added:
- `'pink'`: Soft pink tinted background with delicate pink border.
- `'cream'`: Westminster parchment card for reading and theoretical lessons.
- `'brick'`: Warm Victorian brick border card for project checkpoints.
- Maintained: `'default'`, `'mint'`, `'lavender'`, `'sky'`, `'peach'`, `'yellow'`.

---

## 6. Verification & Quality Assurance Results

| Test Category | Suite File | Assertions | Status |
| :--- | :--- | :--- | :--- |
| **Pastel London Design Tokens** | `tests/test_phase2_pastel_london_design_system.js` | 12 / 12 | **100% Passed** |
| **London Architectural & Street Accents** | `tests/test_phase2_pastel_london_design_system.js` | 7 / 7 | **100% Passed** |
| **Radii, Touch Targets & Motion Standards** | `tests/test_phase2_pastel_london_design_system.js` | 7 / 7 | **100% Passed** |
| **UI Component Exports & New Variants** | `tests/test_phase2_pastel_london_design_system.js` | 17 / 17 | **100% Passed** |
| **London Motifs Vector Components** | `tests/test_phase2_pastel_london_design_system.js` | 6 / 6 | **100% Passed** |
| **Accessible Text Contrast (WCAG AA/AAA)** | `tests/test_phase2_pastel_london_design_system.js` | 5 / 5 | **100% Passed** |
| **TypeScript Type Integrity** | `npm run type-check` | Clean | **0 errors** |
| **ESLint Standards** | `npm run lint` | Clean | **0 errors** |
| **Full Regression Suite** | `npm test` (all suites) | 300+ | **100% Passed** |
| **Production Build** | `npm run build` | 70/70 pages | **100% Success** |

---

## 7. Roadmap & Alignment for Future Phases

- **Phase 3 (Home Page / Learning Studio Hub)**: Integrate the London Skyline header, quick-access Routemaster transit controls, and progress streak counters.
- **Phase 4 (Command Center & Learning Path Navigation)**: Apply the Underground station map metaphor to curriculum track navigation and chapter prerequisites.
- **Phase 5 (Practice Studio & Python Workspace)**: Refine Monaco Editor borders, status pills, and interactive test case panels with pastel accent highlights.

