import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  // Vite resolves the `~/*` alias from tsconfig.json natively.
  resolve: { tsconfigPaths: true },
});
