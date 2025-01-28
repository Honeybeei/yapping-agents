import { Llama, LlamaChatSession, LlamaContext } from "node-llama-cpp";
import { readTextfile } from "../utils/read-files.ts";
import { paths } from "../utils/paths.ts";

class RandomTopicGenerator {
  private llama: Llama;
  private session: LlamaChatSession | null;

  private constructor(llama: Llama) {
    this.llama = llama;
  }

  static async build(
    llama: Llama,
    context: LlamaContext
  ): Promise<RandomTopicGenerator> {
    const randomTopicGenerator = new RandomTopicGenerator(llama);
    randomTopicGenerator.session = new LlamaChatSession({
      contextSequence: context.getSequence(),
      systemPrompt: readTextfile(
        paths.prompts.randomTopicGeneratorSystemPrompt
      ),
    });
    return randomTopicGenerator;
  }

  async generateRandomTopic(): Promise<string> {
    if (this.session === null) {
      throw new Error("Session is not initialized");
    }
    const prompt = "Generate a random topic. Do not duplicate the topic.";
    const grammar = await this.llama.createGrammarForJsonSchema({
      type: "object",
      properties: {
        topic: {
          type: "string",
        },
      },
    });
    const response = await this.session.prompt(prompt, { grammar: grammar });
    const topic = grammar.parse(response).topic;
    return topic;
  }
}

export { RandomTopicGenerator };
