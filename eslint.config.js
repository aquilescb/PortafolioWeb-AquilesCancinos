import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "build/**",
      ".react-router/**",
      "node_modules/**",
      "coverage/**",
      "*.config.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      // Content and presentation layers must stay decoupled: components read
      // content through the public API in `content/index.ts` only.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/content/data/*", "@content/data/*"],
              message:
                "Import content through the public API in `content/index.ts` instead of reaching into `content/data`.",
            },
          ],
        },
      ],
    },
  },
  {
    // Route modules use empty destructuring in generated-type signatures.
    files: ["app/routes/**/*.tsx", "app/root.tsx"],
    rules: { "@typescript-eslint/no-empty-object-type": "off" },
  },
  prettier,
);
