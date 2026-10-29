# CODECOBUG — TEEN PASTEL UI REDESIGN

## ROLE

Act as a senior UI/UX designer and frontend engineer specializing in modern educational platforms, teen-friendly interfaces, accessible design systems, and responsive coding environments.

Your task is to redesign and implement the user interface of the existing CodeCoBUG Python learning platform.

The target experience should feel like a polished, friendly, colorful coding studio for teenagers: visually engaging, intuitive, rounded, responsive, and comfortable for long learning sessions.

## 1. MANDATORY FIRST STEP: INSPECT THE EXISTING PROJECT

Before changing any code:

1. Read the existing `AGENT.md` completely.
2. Inspect the current repository structure, framework, routes, components, styling system, authentication flow, and existing functionality.
3. Read `CODECOBUG_IMPLEMENTATION_PLAN.md` if it exists.
4. Identify reusable components and working features.
5. Preserve existing architecture, dependencies, routes, database integrations, and working business logic wherever possible.
6. Do not replace the existing application with a disconnected mockup or a new standalone demo.

If a required document does not exist, report that fact and continue only with work that can safely be performed.

## 2. DESIGN DIRECTION

Create a design system called **CodeCoBUG Teen Pastel Studio**.

Visual principles:
- Teen-friendly, fresh, playful, and modern.
- Pastel colors with enough contrast for readability.
- Rounded cards, buttons, input fields, navigation items, and dialogs.
- Clear visual hierarchy and generous spacing.
- Soft borders and subtle shadows instead of heavy outlines.
- Friendly micro-interactions that never interfere with coding.
- A consistent design language across every page.
- Avoid childish cartoon overload, excessive gradients, visual clutter, and excessive animation.
- The interface must remain suitable for a serious programming education platform.

### Color palette

Use CSS variables or the project's existing theme system.

- Primary mint: `#BFE8D0`
- Light mint background: `#F3FBF5`
- Lavender: `#DCCBFF`
- Sky blue: `#C7E3FF`
- Peach coral: `#FFCDBD`
- Soft yellow: `#FFF0B8`
- Main text: `#243047`
- Secondary text: `#697386`
- Card background: `#FFFFFF`
- Subtle border: `#E7EAF0`
- Success: a readable green tone
- Error: a readable red tone

Use pastel colors strategically. Do not assign every component a different random color. Keep the main canvas calm, with colors identifying categories, states, and actions.

Use accessible text contrast, especially on pastel backgrounds. Never use pale text on pale backgrounds.

## 3. GLOBAL DESIGN SYSTEM

Implement reusable design tokens and components rather than styling every page independently.

Include:
- Typography scale and consistent font weights.
- Spacing scale.
- Rounded corner tokens, primarily 16–24px for cards and 12–16px for controls.
- Consistent shadows and border treatments.
- Buttons with default, hover, focus, active, disabled, and loading states.
- Accessible form controls.
- Consistent modal, dropdown, tooltip, badge, progress bar, and empty-state styles.
- Keyboard focus indicators.
- Reduced-motion support.
- Light theme as the initial default.

Reuse the existing component library if it is already appropriate. Do not install unnecessary dependencies.

## 4. MAIN APPLICATION LAYOUT

Design a responsive application shell.

### Desktop

Use a clean left sidebar with:
- CodeCoBUG logo and brand identity.
- Home / Learning dashboard.
- Python curriculum.
- Practice exercises.
- AI Tutor.
- Review mistakes.
- Learning progress.
- Account and settings.

The main content area should have:
- A welcoming page header.
- Clear page title and short description.
- Relevant primary action.
- Well-organized cards and learning sections.
- Consistent spacing and alignment.

The sidebar should have clear active states and recognizable icons. Avoid excessive nested navigation.

### Mobile

- Replace the permanent sidebar with a compact mobile navigation pattern.
- Ensure buttons and interactive targets are comfortable to tap.
- Prevent horizontal overflow.
- Stack dashboard cards logically.
- Make the code editor and exercise instructions usable on small screens.
- Keep essential actions visible without crowding the viewport.

## 5. LEARNING DASHBOARD

Create a polished dashboard that helps the learner immediately understand what to do next.

Suggested sections:
- A friendly welcome header.
- Continue learning.
- Current learning topic.
- Topic progress.
- Recommended next action.
- Recently attempted exercises, only when actual records exist.
- Weak skills and review recommendations, only when supported by actual data.
- A compact learning activity overview.

Use rounded cards, small illustrations or restrained decorative elements, clear icons, progress indicators, and pastel category accents.

Important:
- Do not invent completed exercises, streaks, scores, student records, or learning statistics.
- Connect to existing real data wherever available.
- If the backend is not implemented, use honest empty states or clearly identified placeholders during development.
- Do not present sample content as the user's real progress.

## 6. PYTHON CURRICULUM PAGE

Create a visually clear curriculum browser.

Each topic card should support:
- Topic title.
- Short description when actual curriculum content exists.
- Number of exercises when known.
- Real completion progress when available.
- A clear action to open the topic.

Use distinct but coordinated pastel accents for topic categories.

Support:
- Searching topics.
- Filtering or grouping topics if the data model supports it.
- Clear locked, available, in-progress, and completed states where applicable.

Do not invent the actual Python curriculum. The curriculum will be provided separately by the project owner. Build reusable components that can render future curriculum data.

## 7. EXERCISE WORKSPACE: HIGHEST PRIORITY

Design the coding workspace as a core product experience, not an ordinary form.

### Desktop layout

Use a carefully balanced two-column layout.

Left panel:
- Exercise title and difficulty.
- Problem statement.
- Requirements and constraints.
- Example input/output.
- Hints or learning resources when available.

Right panel:
- Python code editor.
- Run button.
- Submit/check-answer button if supported by the existing execution architecture.
- Reset code action with appropriate confirmation when needed.
- Output and terminal panel below the editor.
- Clear execution status and error feedback.

The editor should visually resemble a modern developer tool while remaining approachable for beginners.

Use:
- Rounded outer containers.
- Clear panel headers.
- A readable monospace font.
- Syntax highlighting if supported by the existing editor.
- Appropriate spacing and a stable editor height.
- A collapsible output panel where useful.
- Distinct loading, success, error, and empty states.

The editor must remain the functional editor already used by the application, or be integrated with the project's existing execution system. Do not replace it with a decorative code screenshot.

### Responsive workspace

On mobile, use a vertical or tab-based layout with clear access to:
- Problem.
- Code.
- Output.

Keep the Run action easy to find. Prevent the code editor from causing page-wide horizontal scrolling.

### Execution integrity

- The Run button must invoke the actual Python runtime if one exists.
- The output panel must display real execution results.
- Do not fake successful execution.
- Do not claim that an exercise passed unless the actual judge confirms it.
- If a runtime or judge is not implemented, clearly report the limitation rather than simulating functionality.

## 8. AI TUTOR EXPERIENCE

Create a friendly AI Tutor panel consistent with the pastel design.

The interface may include:
- A natural-language question input.
- Suggested question prompts.
- Clear loading and error states.
- AI explanations formatted for readability.
- Code explanation and mistake-analysis sections where supported.

Do not fabricate AI responses or pretend an API call succeeded.

Respect the existing API-key architecture and security boundaries. Never expose private API keys in client-side code, logs, or browser-visible configuration.

If AI integration is not ready, build the presentation layer without falsely claiming that AI functionality is working.

## 9. INTERACTION DESIGN

Add subtle, useful interactions:
- Gentle hover and focus transitions.
- Clear pressed states for buttons.
- Smooth but restrained card interactions.
- Small progress animations when appropriate.
- Helpful tooltips for unfamiliar coding controls.
- Skeleton loaders only when real loading is taking place.
- Useful empty states with a next action.

Avoid:
- Excessive bouncing or spinning.
- Long intro animations.
- Decorative animations that delay actions.
- Overly complex navigation.
- Buttons that look functional but do nothing.

Every visible interactive control must have a real action or be clearly marked as unavailable.

## 10. ACCESSIBILITY AND PERFORMANCE

- Use semantic HTML.
- Support keyboard navigation.
- Preserve readable font sizes and sufficient contrast.
- Respect reduced-motion preferences.
- Avoid unnecessary re-renders.
- Lazy-load heavy elements when appropriate.
- Keep the coding workspace responsive during execution.
- Do not add heavy visual dependencies without a clear reason.
- Verify the interface on desktop and mobile viewport sizes.

## 11. IMPLEMENTATION RULES

- Follow the existing `AGENT.md`.
- Work within the current repository and framework.
- Reuse existing components and business logic where possible.
- Do not rewrite the entire project just to change its visual style.
- Do not delete existing features.
- Do not modify database schemas unless the redesign genuinely requires it and the change is justified.
- Do not introduce fake backend behavior.
- Do not add invented curriculum data.
- Do not leave broken routes, dead buttons, or unfinished imports.
- Do not mark a feature complete merely because its UI looks finished.

## 12. WORK IN SMALL, VERIFIED STEPS

Implement this UI phase in the following order:

1. Audit the existing application and identify the relevant UI entry points.
2. Establish the color tokens, typography, spacing, and reusable rounded components.
3. Update the main application shell and responsive navigation.
4. Redesign the learning dashboard.
5. Redesign the curriculum browsing interface using the existing data model.
6. Redesign the exercise workspace and preserve actual editor/runtime integration.
7. Update the AI Tutor presentation if the feature exists.
8. Verify interactions, responsive behavior, accessibility, and visual consistency.
9. Fix regressions before considering the phase complete.
10. Update the existing `AGENT.md` checklist in place, checking only items that have actually been implemented and verified.

Do not implement all future product features during this UI phase. Do not start unrelated backend work.

## 13. TESTING AND FINAL REPORT

Run the project's available:
- Type checks.
- Lint checks.
- Build checks.
- Relevant unit and integration tests.
- Manual route and interaction checks.
- Responsive layout checks.

Fix errors caused by your changes.

At the end, report:

1. Files created or modified.
2. Pages and components redesigned.
3. Existing functionality preserved.
4. Interactions verified.
5. Tests executed and their actual results.
6. Known limitations and unresolved issues.
7. Any manual steps required to run the application.
8. The exact `AGENT.md` checklist items updated.

**Definition of done:** The interface looks coherent across desktop and mobile, existing routes and core functionality remain intact, no fake success states are introduced, and all completion claims are supported by verification.

Begin by inspecting the existing project. Then implement this UI phase incrementally and verify each part before moving on.