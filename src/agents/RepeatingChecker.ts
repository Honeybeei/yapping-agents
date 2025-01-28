import { Llama, LlamaChatSession, LlamaContext } from "node-llama-cpp";
import { readTextfile } from "../utils/read-files.ts";
import { paths } from "../utils/paths.ts";

class RepeatingChecker {
  // constants for the class

  // max number of messages to check for repeating
  private static MAX_RECENT_MESSAGES = 4;

  private llama: Llama;
  private session: LlamaChatSession | null;
  private recent_messages: string[];

  private constructor(llama: Llama) {
    this.llama = llama;
  }

  static async build(llama: Llama, context: LlamaContext) {
    const repeatingChecker = new RepeatingChecker(llama);

    repeatingChecker.session = new LlamaChatSession({
      contextSequence: context.getSequence(),
      systemPrompt: readTextfile(paths.prompts.repeatingCheckerSystemPrompt),
    });
    repeatingChecker.recent_messages = [];
    return repeatingChecker;
  }

  updateRecentMessages(new_message: string) {
    this.recent_messages.push(new_message);
    if (this.recent_messages.length > RepeatingChecker.MAX_RECENT_MESSAGES) {
      this.recent_messages.shift();
    }
  }

  async checkForRepeating(): Promise<boolean> {
    if (this.session === null) {
      throw new Error("Session is not initialized");
    }
    if (this.recent_messages.length < RepeatingChecker.MAX_RECENT_MESSAGES) {
      return false;
    }
    // prompt without using chat history
    const initialChatHistory = this.session?.getChatHistory();
    let prompt = "Check if the messages are repeating.\n";
    // add recent messages to prompt
    this.recent_messages.forEach((message) => {
      prompt += `- ${message}\n`;
    });

    // Create Grammar
    const grammar = await this.llama.createGrammarForJsonSchema({
      type: "object",
      properties: {
        is_repeating: {
          type: "boolean",
        },
      },
    });
    const response = await this.session.prompt(prompt, {
      grammar: grammar,
      temperature: 0.8,
    });

    const is_repeating = grammar.parse(response).is_repeating;
    if (is_repeating) {
      // clear recent messages
      this.recent_messages = [];
    }
    // restore chat history
    this.session.setChatHistory(initialChatHistory);
    return is_repeating;
  }
}

export { RepeatingChecker };
