import { CaptureObject } from "./types";
import { getEnv } from "./utils";
import { Readable } from "stream";

export type Dataset = {
  name: string;
  rows: Row[];
};

export type Row = {
  inputs: { [key: string]: any };
  outputs: { [key: string]: any };
};

export type DatasetEvaluation = {
  name: string;
  passes: number;
  fails: number;
  rows: RowEvaluation[];
};

export type EvaluationReport = {
  passes: number;
  fails: number;
  datasets: DatasetEvaluation[];
};

export type RowEvaluation = {
  row: Row;
  passes: number;
  fails: number;
  runs: EvaluationRun[];
};

export type EvaluationRun = {
  content: string;
  log: string;
  status: string;
  duration: number;
};

export type EvaluationFunction = (
  row: Row
) => Promise<string | Readable> | string | Readable;

export interface ClientOptions {
  apiKey?: string | null;
  baseUrl?: string | null;
  evaluate?: EvaluationFunction;
}

const defaultBaseUrl = "https://api.plucky.ai";

export class Plucky {
  private _options: ClientOptions;
  private _captureQueue: CaptureObject[];
  private _timer: NodeJS.Timeout | null;
  private _attempts: number = 0;
  private _evaluate: EvaluationFunction | null;
  constructor({
    apiKey = getEnv("PLUCKY_API_KEY") || "",
    baseUrl = defaultBaseUrl,
    evaluate,
  }: ClientOptions = {}) {
    this._options = {
      apiKey,
      baseUrl: baseUrl || defaultBaseUrl,
    };
    this._captureQueue = [];
    this._timer = null;
    this._evaluate = evaluate || null;
  }
  capture(captureObj: CaptureObject) {
    this._captureQueue.push(captureObj);
    this._debouncedSend();
  }
  private _debouncedSend() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => {
      this.send();
    }, 300 + 300 * Math.pow(this._attempts, 2));
  }
  async send(): Promise<void> {
    this._attempts++;
    const url = this._options.baseUrl || defaultBaseUrl;
    try {
      await this.fetch(`${url}/v0/batch`, {
        method: "POST",
        body: {
          data: this._captureQueue,
        },
      });

      this._captureQueue = [];
    } catch (err) {
      if (err instanceof Response) {
        try {
          console.error(await err.json());
        } catch (_) {
          console.error(await err.text());
        }
      } else {
        console.error(err);
      }
      if (this._attempts > 2) {
        this._attempts = 0;
        console.error("Could not send data to the Plucky API.");
        return;
      }

      this._debouncedSend();
    }
  }
  async fetch(
    url: string,
    options?: {
      method?: string;
      body?: any;
    }
  ): Promise<Response> {
    options = options || {};
    const response = await fetch(url, {
      headers: {
        "x-api-key": this._options.apiKey || "",
        "Content-Type": "application/json",
      },
      method: options.method || "GET",
      body: JSON.stringify(options.body),
    });
    if (!response.ok) {
      throw response;
    }
    return response;
  }
  async evaluate(datasets: Dataset[]): Promise<EvaluationReport> {
    if (!this._evaluate) throw new Error("Evaluation function not provided.");
    const report: EvaluationReport = {
      passes: 0,
      fails: 0,
      datasets: datasets.map((dataset) => {
        return {
          name: dataset.name,
          passes: 0,
          fails: 0,
          rows: dataset.rows.map((row) => {
            return {
              row,
              passes: 0,
              fails: 0,
              runs: [],
            };
          }),
        };
      }),
    };
    return report;
  }
}

export { CaptureObject };
