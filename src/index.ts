import { CaptureObject } from "./types";
import { getEnv } from "./utils";
export interface ClientOptions {
  apiKey?: string | null;
  baseUrl?: string | null;
}

const defaultBaseUrl = "https://api.plucky.ai";

export class Plucky {
  private _options: ClientOptions;
  private _captureQueue: CaptureObject[];
  private _timer: NodeJS.Timeout | null;
  private _attempts: number = 0;
  constructor({
    apiKey = getEnv("PLUCKY_API_KEY") || "",
    baseUrl = defaultBaseUrl,
  }: ClientOptions = {}) {
    this._options = {
      apiKey,
      baseUrl: baseUrl || defaultBaseUrl,
    };
    this._captureQueue = [];
    this._timer = null;
  }
  capture(captureObj: CaptureObject) {
    this._captureQueue.push(captureObj);
    this._debouncedSend();
  }
  private _debouncedSend() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._timer = setTimeout(() => {
      this.send();
    }, 300 + 300 * Math.pow(this._attempts, 2));
  }
  async send(): Promise<void> {
    this._attempts++;
    const url = this._options.baseUrl || defaultBaseUrl;
    try {
      await this.fetch(`${url}/v0/batch`, {
        method: "POST",
        body: {
          data: this._captureQueue,
        },
      });

      this._captureQueue = [];
    } catch (err) {
      console.error(err);
      if (err instanceof Response) {
        try {
          console.error(await err.json());
        } catch (_) {
          console.error(await err.text());
        }
      } else {
        console.error(err);
      }
      if (this._attempts > 2) {
        this._attempts = 0;
        console.error("Could not send data to the Plucky API.");
        return;
      }

      this._debouncedSend();
    }
  }
  async fetch(
    url: string,
    options?: {
      method?: string;
      body?: any;
    }
  ): Promise<Response> {
    options = options || {};
    const response = await fetch(url, {
      headers: {
        "x-api-key": this._options.apiKey || "",
        "Content-Type": "application/json",
      },
      method: options.method || "GET",
      body: JSON.stringify(options.body),
    });
    if (!response.ok) {
      throw response;
    }
    return response;
  }
}

export { CaptureObject };
