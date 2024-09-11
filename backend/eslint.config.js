import { fixupConfigRules } from '@eslint/compat';
import eslintJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js'
import eslintImport from 'eslint-plugin-import';
import docJs from 'eslint-plugin-jsdoc';
import eslintReact from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';
import eslintTs from 'typescript-eslint';

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']
    },
    {
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: globals.node
        },
        plugins: {
            '@stylistic/js': stylisticJs,
            import: eslintImport,
        },
        rules: {
            // === Stylistic ===
            // spacing
            '@stylistic/js/keyword-spacing': ['error', { 'after': true, 'before': true }],

            // line breaks
            '@stylistic/js/eol-last': ['error', 'always'],

            // brackets
            '@stylistic/js/brace-style': 'error',

            // quotes
            '@stylistic/js/quotes': ['error', 'single'],

            // disallow
            '@stylistic/js/no-floating-decimal': 'error',
            '@stylistic/js/no-mixed-operators': 'error',
            '@stylistic/js/no-trailing-spaces': 'error',
            '@stylistic/js/no-whitespace-before-property': 'error',

            // === Imports ===
            'import/order': ['error', {
                'groups': [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
                'alphabetize': { order: 'asc', caseInsensitive: true },
            }],
        }
    },
    docJs.configs['flat/recommended'],
    eslintJs.configs.recommended,
    ...eslintTs.configs.recommended,
    ...fixupConfigRules(eslintReact),
];
