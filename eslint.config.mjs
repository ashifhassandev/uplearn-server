import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    files: ["**/*.ts"],
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "error", // no any type
      "@typescript-eslint/explicit-function-return-type": "error", // always return type
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn", // warn on ! operator
      "@typescript-eslint/consistent-type-imports": "error", // use import type
      "@typescript-eslint/no-floating-promises": "error", // always await promises

      // Import rules
      "import/no-cycle": "error", // no circular imports
      "import/no-unused-modules": "warn", // no unused exports
      "import/order": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // General rules
      "no-console": "warn", // use logger instead of console.log
      "no-debugger": "error",
      "no-duplicate-imports": "off",
    },
  },
];