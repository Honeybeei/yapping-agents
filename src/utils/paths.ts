import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..", "..");

// /src
const srcRoot = path.join(projectRoot, "src");

// /gguf-models
const ggufPath = path.join(projectRoot, "gguf-models");
const modelPath = path.join(ggufPath, config.modelName);

// /src/prompts
const promptsPath = path.join(srcRoot, "prompts");
const personaSystemPromptPath = path.join(
  promptsPath,
  "persona-system-prompt.txt"
);
const randomTopicGeneratorSystemPromptPath = path.join(
  promptsPath,
  "random-topic-generator-system-prompt.txt"
);
const repeatingCheckerSystemPromptPath = path.join(
  promptsPath,
  "repeating-checker-system-prompt.txt"
);

const paths = {
  root: projectRoot,
  src: srcRoot,
  gguf: ggufPath,
  model: modelPath,
  prompts: {
    personaSystemPrompt: personaSystemPromptPath,
    randomTopicGeneratorSystemPrompt: randomTopicGeneratorSystemPromptPath,
    repeatingCheckerSystemPrompt: repeatingCheckerSystemPromptPath,
  },
};

export { paths };
