import { fixupConfigRules } from '@eslint/compat';
import eslintJs from '@eslint/js';
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
            import: eslintImport
        },
        rules: {
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
