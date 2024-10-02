import { randomUUID } from "crypto";
import { Plucky } from "../src";

function main(apiKey: string, baseUrl: string) {
  const client = new Plucky({
    apiKey,
    baseUrl,
  });
  const caseId = randomUUID();
  client.capture({
    type: "case",
    case: {
      externalId: caseId,
      type: "customer",
      name: "John Doe",
    },
  });
  client.capture({
    type: "event",
    event: {
      caseExternalId: caseId,
      name: "said hello",
    },
  });
}

(async () => {
  const apiKey = process.argv[2];
  const baseUrl = process.argv[3];
  main(apiKey, baseUrl);
})();
