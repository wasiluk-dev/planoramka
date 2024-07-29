import docJs from "eslint-plugin-jsdoc";
import globals from "globals";
import eslintJs from "@eslint/js";
import eslintReact from "eslint-plugin-react/configs/recommended.js";
import eslintTs from "typescript-eslint";
import { fixupConfigRules } from "@eslint/compat";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
    },
    {
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: globals.node
        }
    },
    docJs.configs['flat/recommended'],
    eslintJs.configs.recommended,
    ...eslintTs.configs.recommended,
    ...fixupConfigRules(eslintReact),
];
