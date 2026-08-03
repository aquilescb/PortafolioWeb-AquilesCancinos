import mdx from "@mdx-js/rollup";
import { defineConfig } from "vitest/config";

// The React Router Vite plugin is intentionally left out: tests render
// components directly, and esbuild handles JSX via `jsx: "react-jsx"`.
// The MDX plugin stays: content-layer tests import `.mdx` case studies
// directly.
export default defineConfig({
  plugins: [mdx()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["{app,content,scripts,test}/**/*.{test,spec}.{ts,tsx}"],
    css: false,
  },
});
