import path from "path";
import { defineConfig } from "../src";

export default defineConfig({
  evaluate: {
    datasetDir: path.join(__dirname, "./datasets"),
  },
});
