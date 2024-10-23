import {
  Dataset,
  DatasetEvaluationResult,
  EvaluationFunction,
  EvaluationResult,
  Row,
  RowEvaluationResult,
} from "./types";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import yaml from "yaml";
import { average, sum } from "./utils";

export class Evaluator {
  evaluateRowFn: EvaluationFunction;
  datasetDir?: string;
  constructor({
    evaluateRow,
    datasetDir,
  }: {
    evaluateRow: EvaluationFunction;
    datasetDir?: string;
  }) {
    this.evaluateRowFn = evaluateRow;
    this.datasetDir = datasetDir;
  }
  async run(options: { datasets?: Dataset[] }): Promise<EvaluationResult> {
    const datasets = await resolveDatasets(options.datasets, this.datasetDir);
    const datasetResults = await Promise.all(
      datasets.map(this.evaluateDataset.bind(this))
    );
    return {
      datasets: datasetResults,
      score: average(...datasetResults.map((dataset) => dataset.score)),
      testCount: sum(...datasetResults.map((dataset) => dataset.testCount)),
    };
  }
  async evaluateRow(row: Row): Promise<RowEvaluationResult> {
    const response = await this.evaluateRowFn({ row });
    const newTests = response.tests.map((test) => ({
      ...test,
      score: average(...test.runs.map((run) => run.score)),
    }));
    return {
      ...response,
      row,
      tests: newTests,
      score: average(...newTests.map((test) => test.score)),
    };
  }
  async evaluateDataset(dataset: Dataset): Promise<DatasetEvaluationResult> {
    const rowPromises = dataset.rows.map((row) => this.evaluateRow(row));
    const rows = await Promise.all(rowPromises);
    return {
      id: dataset.id,
      name: dataset.name,
      rows,
      score: average(...rows.map((row) => row.score)),
      testCount: sum(...rows.map((row) => row.tests.length)),
    };
  }
}

async function getDatasetsFromDir(dir: string) {
  const filepaths = await readdir(dir);
  const files = await Promise.all(
    filepaths
      .filter((filename) => filename.endsWith(".yaml"))
      .map((filename) => readFile(join(dir, filename), "utf-8"))
  );
  return files.map((file) => yaml.parse(file));
}

async function resolveDatasets(
  datasets?: Dataset[],
  datasetDir?: string
): Promise<Dataset[]> {
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
