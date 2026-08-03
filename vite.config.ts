import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // The MDX plugin must run before the React Router/React plugin so `.mdx`
  // files are already turned into JSX by the time it sees them.
  plugins: [mdx(), tailwindcss(), reactRouter()],
  // Vite resolves the `~/*` alias from tsconfig.json natively.
  resolve: { tsconfigPaths: true },
});
