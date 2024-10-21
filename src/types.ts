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

export interface PluckyTestConfig {
  evaluate: {
    datasetDir: string;
  };
}

export interface Row {
  id?: string;
  inputs: { [key: string]: any };
  outputs: { [key: string]: any };
  [key: string]: any;
}

export interface Evaluation {
  tests: TestResults[];
}

export interface TestRun {
  startTime: Date;
  endTime: Date;
  score: boolean;
  maxScore: number;
}

export interface TestResults {
  name: string;
  row: Row;
  averageScore: number;
  maxScore: number;
  runs: TestRun[];
}
