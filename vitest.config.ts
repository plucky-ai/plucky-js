import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "plucky-js": "./src/index.ts",
    },
  },
  test: {},
});
