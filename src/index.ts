import { CaptureObject, PluckyTestConfig } from "./types";
import { Plucky } from "./Plucky";
import { evaluate } from "./evaluate";

export { CaptureObject, Plucky, evaluate };

export function defineConfig(options: PluckyTestConfig): PluckyTestConfig {
  return options;
}
