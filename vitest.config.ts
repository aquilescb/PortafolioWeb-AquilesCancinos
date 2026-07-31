import { defineConfig } from "vitest/config";

// The React Router Vite plugin is intentionally left out: tests render
// components directly, and esbuild handles JSX via `jsx: "react-jsx"`.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["{app,content,scripts,test}/**/*.{test,spec}.{ts,tsx}"],
    css: false,
  },
});
