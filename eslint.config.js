// ESLint flat config (ESLint 10 / Expo SDK 57).
// See docs/engineering/Sprint-0-Engineering-Design.md Section 19 (Coding Standards) and
// Section 23.4 (Full Allowed/Forbidden Dependency Matrix) — every custom rule below cites the
// design-doc section it implements.
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const reactNative = require('eslint-plugin-react-native');
const boundaries = require('eslint-plugin-boundaries');
const globals = require('globals');

// Section 23.4's matrix, encoded as eslint-plugin-boundaries element types. `src/types`,
// `src/constants`, and `src/data` are deliberately NOT classified here — they are not rows/
// columns in Section 23.4 either, and classifying `data` now would flag the existing (pre-
// Repository-layer) `app/*.tsx -> src/data/mockDoctor.ts` import that Sprint 0 Phase 0.5+ will
// replace, not this milestone.
const boundariesElements = [
  { type: 'app', pattern: 'app/**' },
  // `template` must be listed before the generic `component` pattern below so it wins the match.
  { type: 'template', pattern: 'src/components/templates/**' },
  { type: 'component', pattern: 'src/components/*/**' },
  { type: 'feature', pattern: 'src/features/**' },
  { type: 'store', pattern: 'src/store/**' },
  { type: 'service', pattern: 'src/services/**' },
  { type: 'repository', pattern: 'src/repositories/**' },
  { type: 'api', pattern: 'src/api/**' },
  { type: 'util', pattern: 'src/utils/**' },
  { type: 'core', pattern: 'src/core/**' },
];

module.exports = defineConfig([
  globalIgnores(['dist/*', 'coverage/*', '.expo/*']),
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['*.config.js', 'metro.config.js', 'babel.config.js', 'tailwind.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    plugins: {
      'react-native': reactNative,
      boundaries,
    },
    settings: {
      'boundaries/elements': boundariesElements,
    },
    rules: {
      // eslint-config-expo bundles eslint-plugin-react-hooks' recommended config, which (as of
      // the v7 "React Compiler" ruleset) flags `useRef(x).current` reads during render as an
      // error. One pre-existing, otherwise-correct usage of this idiomatic pattern exists
      // (OTPInput.tsx's stable Animated.Value). Per Section 20 Phase 0.1's own Definition of
      // Done ("npm run lint ... exit 0 on the current, unmodified codebase"), this tooling
      // milestone downgrades it to a warning rather than rewriting component internals —
      // tracked in the M1 report as follow-up debt, not silently disabled.
      'react-hooks/refs': 'warn',

      // --- React Native rules (Sprint 0 Section 19 "Add ... React Native rules") ---
      // Zero current violations: no StyleSheet.create() usage exists yet anywhere in src/.
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-single-element-style-arrays': 'error',
      // Pre-existing debt (Architecture Audit 02.1/02.4 TD4, ~26 hardcoded hex literals; 2
      // inline style objects) — surfaced as warnings, not blocked. Fixing these is Sprint 0
      // Phase 0.3 (design-token extraction), explicitly out of scope for this milestone.
      'react-native/no-color-literals': 'warn',
      'react-native/no-inline-styles': 'warn',

      // --- Import rules (Section 19 "Import Conventions") ---
      // Group order: external -> @/core -> @/api|repositories|services -> @/features|store ->
      // @/components -> @/utils|types|constants -> relative (same-folder siblings only).
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            { pattern: '@/core/**', group: 'internal', position: 'before' },
            { pattern: '@/api/**', group: 'internal', position: 'before' },
            { pattern: '@/repositories/**', group: 'internal', position: 'before' },
            { pattern: '@/services/**', group: 'internal', position: 'before' },
            { pattern: '@/features/**', group: 'internal', position: 'before' },
            { pattern: '@/store/**', group: 'internal', position: 'before' },
            { pattern: '@/components/**', group: 'internal', position: 'before' },
            { pattern: '@/hooks/**', group: 'internal', position: 'before' },
            { pattern: '@/utils/**', group: 'internal', position: 'before' },
            { pattern: '@/types/**', group: 'internal', position: 'before' },
            { pattern: '@/constants/**', group: 'internal', position: 'before' },
            { pattern: '@/data/**', group: 'internal', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          'newlines-between': 'ignore',
        },
      ],
      // "never a relative path traversing more than one directory up" (Section 19).
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['../../*', '../../../*'],
              message:
                'Use the @/* alias instead of a relative import that traverses more than one directory up (Section 19, Import Conventions).',
            },
          ],
        },
      ],

      // --- Dependency boundaries prep (Section 23.4) ---
      // Severity is 'error': every layer this checks today (app/component) already complies.
      // Business layers (core/api/repository/service/feature/store) are empty folders right now,
      // so this rule has nothing to violate yet — it activates automatically as each layer gains
      // files in later milestones, per Section 23.4's own "machine-enforced, not review-enforced"
      // goal. Uses eslint-plugin-boundaries v7's current `boundaries/dependencies` rule with
      // `policies` (the current, non-deprecated names for the old `element-types`/`rules` API).
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'app' } },
              allow: [
                { to: { element: { type: 'template' } } },
                { to: { element: { type: 'component' } } },
                { to: { element: { type: 'feature' } } },
                { to: { element: { type: 'util' } } },
                { to: { element: { type: 'core' } } },
              ],
            },
            {
              from: { element: { type: 'template' } },
              allow: [
                { to: { element: { type: 'component' } } },
                { to: { element: { type: 'util' } } },
                { to: { element: { type: 'core' } } },
              ],
            },
            {
              from: { element: { type: 'component' } },
              allow: [
                { to: { element: { type: 'component' } } },
                { to: { element: { type: 'util' } } },
                { to: { element: { type: 'core' } } },
              ],
            },
            {
              from: { element: { type: 'feature' } },
              allow: [
                { to: { element: { type: 'component' } } },
                { to: { element: { type: 'store' } } },
                { to: { element: { type: 'util' } } },
                { to: { element: { type: 'core' } } },
              ],
            },
            {
              from: { element: { type: 'store' } },
              allow: [
                { to: { element: { type: 'service' } } },
                { to: { element: { type: 'util' } } },
                { to: { element: { type: 'core' } } },
              ],
            },
            {
              from: { element: { type: 'service' } },
              allow: [
                { to: { element: { type: 'service' } } },
                { to: { element: { type: 'repository' } } },
                { to: { element: { type: 'util' } } },
                { to: { element: { type: 'core' } } },
              ],
            },
            {
              from: { element: { type: 'repository' } },
              allow: [
                { to: { element: { type: 'api' } } },
                { to: { element: { type: 'util' } } },
                { to: { element: { type: 'core' } } },
              ],
            },
            {
              from: { element: { type: 'api' } },
              allow: [{ to: { element: { type: 'util' } } }, { to: { element: { type: 'core' } } }],
            },
            {
              from: { element: { type: 'util' } },
              allow: [{ to: { element: { type: 'util' } } }],
            },
            {
              from: { element: { type: 'core' } },
              allow: [{ to: { element: { type: 'core' } } }, { to: { element: { type: 'util' } } }],
            },
          ],
        },
      ],
    },
  },
]);
