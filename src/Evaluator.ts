import { Dataset, EvaluationFunction, EvaluationResult } from "./types";
import { readdir, readFile } from "fs/promises";
import yaml from "yaml";

export class Evaluator {
  evaluateRowFn: EvaluationFunction;
  constructor({ evaluateRow }: { evaluateRow: EvaluationFunction }) {
    this.evaluateRowFn = evaluateRow;
  }
  async run(options: {
    datasetDir?: string;
    datasets?: Dataset[];
  }): Promise<EvaluationResult> {
    // Get datasets
    const datasets = await resolveDatasets(
      options.datasets,
      options.datasetDir
    );
    // Build evaluator suite
    // Run evaluator suite based on filter criteria
    // Return results
    throw new Error("Not implemented");
  }
}

async function getDatasetsFromDir(dir: string) {
  const filepaths = await readdir(dir);
  const files = await Promise.all(
    filepaths
      .filter((filepath) => filepath.endsWith(".yaml"))
      .map((filepath) => readFile(filepath, "utf-8"))
  );
  return files.map((file) => yaml.parse(file));
}

async function resolveDatasets(datasets?: Dataset[], datasetDir?: string) {
  if (datasets && datasetDir) {
    throw new Error("Cannot provide both datasets and datasetDir");
  }
  if (datasets) {
    return datasets;
  } else if (datasetDir) {
    return getDatasetsFromDir(datasetDir);
  } else {
    throw new Error("Missing datasets or datasetDir");
  }
}
