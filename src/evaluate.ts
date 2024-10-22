import {
  Dataset,
  EvaluationFunction,
  EvaluationResult,
  Row,
  RowEvaluationResult,
} from "./types";
import { readdir, readFile } from "fs/promises";
import yaml from "yaml";

export class Evaluator {
  evaluateRowFn: EvaluationFunction;
  constructor({ evaluateRow }: { evaluateRow: EvaluationFunction }) {
    this.evaluateRowFn = evaluateRow;
  }
  async run({}) {}
  async evaluate() {
    return this.evaluateDatasets({});
  }
  async evaluateDatasets(args: { datasets?: Dataset[]; datasetDir?: string }) {
    if (args.datasets) {
      return evaluateManyDatasets(args.datasets);
    } else if (args.datasetDir) {
      return evaluateDatasetDir(args.datasetDir);
    } else {
      throw new Error("Missing datasets or datasetDir");
    }
  }
  async evaluateDataset(dataset: Dataset) {
    const promises = [];
    for (const row of dataset.rows) {
      promises.push(this.evaluateRow(row));
    }
    const rows = await Promise.all(promises);
    return {
      id: dataset.id,
      name: dataset.name,
      score: rows.reduce((acc, row) => acc + row.score, 0) / rows.length,
      testCount: rows.flatMap((row) => row.tests).length,
      rows,
    };
  }
  async evaluateRow(row: Row): Promise<RowEvaluationResult> {
    const response = await this.evaluateRowFn({ row });
    const testResults = response.tests.map((test) => {
      return {
        score:
          test.runs.reduce((acc, run) => acc + run.score, 0) / test.runs.length,
        ...test,
      };
    });
    return {
      row,
      score: testResults.reduce((acc, test) => acc + test.score, 0),
      tests: testResults,
    };
  }
}

export async function evaluateDatasetDir(datasetDir: string) {
  const filepaths = await readdir(datasetDir);
  const files = await Promise.all(
    filepaths
      .filter((filepath) => filepath.endsWith(".yaml"))
      .map((filepath) => readFile(filepath, "utf-8"))
  );
  const datasets = files.map((file) => yaml.parse(file));
  return evaluateManyDatasets(datasets);
}

export async function evaluateManyDatasets(
  datasets: Dataset[]
): Promise<EvaluationResult> {
  const promises = [];
  for (const dataset of datasets) {
    promises.push(evaluateDataset(dataset));
  }
  const datasetResults = await Promise.all(promises);
  const testCount = datasetResults.reduce(
    (acc, dataset) => acc + dataset.testCount,
    0
  );
  const score =
    datasetResults.reduce(
      (acc, dataset) => acc + dataset.score * dataset.testCount,
      0
    ) / testCount;
  return {
    score,
    testCount,
    datasets: datasetResults,
  };
}
