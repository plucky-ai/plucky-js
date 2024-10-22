import { Evaluation, EvaluationResponse, Row } from "./types";

export async function evaluate(
  fn: (data: { row: Row }) => Promise<EvaluationResponse> | EvaluationResponse
): Promise<Evaluation> {
  const testRow = {
    inputs: {},
    outputs: {},
  };
  const evaluationResponse = await fn({ row: testRow });
  return {
    row: testRow,
    ...evaluationResponse,
  };
}

export class TestResult {
  constructor(public name: string, public score: boolean) {}
}
