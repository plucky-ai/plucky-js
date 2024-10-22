#!/usr/bin/env node
import arg from "arg";
import path from "path";
import { pathToFileURL } from "url";
import { existsSync } from "fs";
import { readdirSync } from "fs";
import { register } from "ts-node";

async function main() {
  const secondArg = process.argv[2];

  const args = arg({
    "--rootDir": String,
  });

  if (secondArg !== "evaluate") {
    console.log("Invalid command. Please use 'evaluate' command.");
    process.exit(1);
  }

  // find config
  const rootDir = args["--rootDir"] || process.cwd();
  const configPath = path.join(rootDir, "plucky.config.ts");
  const files = readdirSync(rootDir);
  console.log("Files in rootDir:", files);
  if (!existsSync(configPath)) {
    console.error(`Config file not found at ${configPath}`);
    process.exit(1);
  }

  register({
    project: path.join(rootDir, "tsconfig.json"),
  });
  try {
    const configModule = await import(pathToFileURL(configPath).toString());
    const config = configModule.default;
    console.log("Config:", config);
  } catch (error) {
    console.error("Failed to load config file:", error);
    process.exit(1);
  }
}
main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
