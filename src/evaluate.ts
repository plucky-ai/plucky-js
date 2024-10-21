import { Evaluation, Row } from "./types";

const dataset = {
  rows: [],
};

export async function evaluate(
  fn: (data: { row: Row }) => Promise<Evaluation> | Evaluation
): Promise<Evaluation> {
  const testRow = {
    inputs: {},
    outputs: {},
  };
  return fn({ row: testRow });
}
