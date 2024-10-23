import { join } from "path";
import { Evaluator } from "../src";
import { RowEvaluationArgs } from "../src/types";

async function evaluateRow({ row }: RowEvaluationArgs) {
  const contains = (row.outputs.contains || []).map((str: string) => {
    return {
      name: "contains " + str,
      runs: [
        {
          score: row.inputs.content.includes(str) ? 1 : 0,
          outputs: {
            content: "Test content!",
          },
        },
      ],
    };
  });
  const doesNotContain = (row.outputs.doesNotContain || []).map(
    (str: string) => {
      return {
        name: "does not contain " + str,
        runs: [
          {
            score: row.inputs.content.includes(str) ? 0 : 1,
            outputs: {
              content: "Test content!",
            },
          },
        ],
      };
    }
  );
  return {
    tests: [...contains, ...doesNotContain],
  };
}

async function main() {
  const evaluator = new Evaluator({
    evaluateRow,
  });
  return evaluator.run({
    datasetDir: join(__dirname, "/datasets"),
  });
}

main()
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((error) => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
  });
