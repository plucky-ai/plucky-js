import { CaptureObject, PluckyTestConfig } from "./types";
import { Plucky } from "./Plucky";
import { Evaluator } from "./Evaluator";

export { CaptureObject, Plucky, Evaluator };

export function defineConfig(options: PluckyTestConfig): PluckyTestConfig {
  return options;
}
