export interface ProjectData {
  id: string;
  name: string;
  [key: string]: any;
}

export interface BatchCaptureRequestBody {
  data: CaptureObject[];
}

export interface CaseCaptureObject {
  type: "case";
  case: CaseCreateRequestBody;
}

export interface EventCaptureObject {
  type: "event";
  event: EventCreateRequestBody;
}

export type CaptureObject = CaseCaptureObject | EventCaptureObject;

interface CaseCreateRequestBody {
  externalId: string;
  type: string;
  name: string;
}

interface EventCreateRequestBody {
  name: string;
  type?: string;
  details?: string;
  trace?: any;
  caseExternalId: string;
}

export interface Dataset {
  id: string;
  name: string;
  rows: Row[];
  [key: string]: any;
}

export interface Row {
  id?: string;
  inputs: { [key: string]: any };
  outputs: { [key: string]: any };
}

export interface EvaluationResult {
  datasets: DatasetEvaluationResult[];
  score: number;
  testCount: number;
}

export interface DatasetEvaluationResult {
  id: string;
  name: string;
  score: number;
  testCount: number;
  rows: RowEvaluationResult[];
}

export interface RowEvaluationResult extends RowEvaluationResponse {
  row: Row;
  score: number;
  tests: TestResult[];
}

export interface RowEvaluationArgs {
  row: Row;
}

export type EvaluationFunction = (data: {
  row: Row;
}) => Promise<RowEvaluationResponse> | RowEvaluationResponse;

export interface TestRun {
  score: number;
  outputs: { [key: string]: any };
  trace?: any;
}

export interface TestResult extends TestResultResponse {
  score: number;
}

export interface RowEvaluationResponse {
  tests: TestResultResponse[];
}

export interface TestResultResponse {
  name: string;
  runs: TestRun[];
}
