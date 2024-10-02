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
