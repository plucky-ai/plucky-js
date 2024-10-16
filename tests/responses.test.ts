import { it } from "node:test";
import { Plucky, CaptureObject } from "../src";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";

const TEST_API_KEY = "abcdef";
const TEST_BASE_URL = "http://localhost:3700";

const client = new Plucky({
  apiKey: TEST_API_KEY,
  baseUrl: TEST_BASE_URL,
  evaluate: async (row) => {
    if (row.inputs.a + row.inputs.b === row.outputs.c) return "";
    throw new Error("Invalid output");
  },
});

client["_debouncedSend"] = vi.fn();
client.fetch = vi.fn();

describe("capture", () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("sends correct fields", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
    });
    const captureObjects: CaptureObject[] = [
      {
        type: "case",
        case: {
          externalId: String(Math.random() * 10000000),
          type: "customer",
          name: "John Doe",
        },
      },
      {
        type: "event",
        event: {
          caseExternalId: String(Math.random() * 10000000),
          name: "User Jumped",
        },
      },
    ];
    client.capture(captureObjects[0]);
    client.capture(captureObjects[1]);

    await client.send();
    expect(client["_debouncedSend"]).toHaveBeenCalled();
    expect(client.fetch).toHaveBeenCalledWith(
      `${TEST_BASE_URL}/v0/batch`,
      expect.objectContaining({
        body: {
          data: captureObjects,
        },
        method: "POST",
      })
    );
  });
});

describe("evaluate", () => {
  test("calls the evaluate function", async () => {
    const report = await client.evaluate([
      {
        name: "test",
        rows: [
          {
            inputs: {
              a: 1,
              b: 2,
            },
            outputs: {
              c: 3,
            },
          },
        ],
      },
    ]);
    expect(report.datasets.length).toBe(1);
  });
});
