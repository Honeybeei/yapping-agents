import path from "path";
import { fileURLToPath } from "url";
import { readJsonFile } from "./read-files.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configFilePath = path.join(__dirname, "..", "..", "config.json");

interface Config {
  modelName: string;
  persona: {
    temperature: {
      min: number;
      max: number;
    };
    personality: {
      traitCount: number;
    };
    prompts: {
      system: string; // it will be added as an additional system prompt
    };
  };
}

const config: Config = readJsonFile<Config>(configFilePath);

export { config };
