import { join } from "path";
import { Evaluator } from "../src";
import { RowEvaluationArgs } from "../src/types";

async function evaluateRow({ row }: RowEvaluationArgs) {
  const tests = row.assessments.map((criteria: string) => {
    return {
      name: criteria,
      score: 1,
      runs: [
        {
          score: 1,
          outputs: {
            content: "Hello world!",
          },
        },
      ],
    };
  });
  return {
    tests,
  };
}

async function main() {
  const evaluator = new Evaluator({
    evaluateRow,
  });
  await evaluator.run({
    datasetDir: join(__dirname, "datasets"),
  });
}

main()
  .then((result) => console.log(result))
  .catch((error) => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
  });
