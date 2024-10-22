import { evaluate } from "../src";

evaluate(async ({ row }) => {
  return {
    tests: [
      {
        name: "Test 1",
        score: 0,
        runs: [],
      },
    ],
  };
});
