import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import sonarjs from "eslint-plugin-sonarjs";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "prettier"
    ),
    {
        plugins: {
            react,
            prettier,
            jsxA11y,
            sonarjs,
            import: importPlugin,
        },
        rules: {
            "prettier/prettier": ["error"],
            "no-unused-vars": "warn",
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "no-irregular-whitespace": ["error", {
                "skipStrings": false,
                "skipComments": false,
                "skipRegExps": false,
                "skipTemplates": false,
            }],
            "jsx-a11y/alt-text": ["error"],
            // SonarJS правила вручную
            "sonarjs/no-duplicate-string": "warn",
            "sonarjs/cognitive-complexity": ["warn", 15],
            "sonarjs/no-identical-functions": "warn",
            "sonarjs/no-redundant-jump": "warn",
            "sonarjs/no-small-switch": "warn",
            "sonarjs/no-inverted-boolean-check": "warn"
        },
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                browser: true,
                localStorage: true,
                console: true,
                alert: true,
                document: true,
                navigator: true,
                URL: true,
                TextDecoder: true,
                window: true,
                FileReader: true,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
