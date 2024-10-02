import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: {
    alias: {
      "plucky-js": "./src/index.ts",
    },
  },
  plugins: [tsconfigPaths()],
  test: {},
});
