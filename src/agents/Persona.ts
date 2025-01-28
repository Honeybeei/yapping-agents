import { LlamaChatSession, LlamaContext } from "node-llama-cpp";

import {
  getRandomPersonalityTraits,
  getRandomTemperature,
} from "../utils/personality-traits.ts";
import { readTextfile } from "../utils/read-files.ts";
import { paths } from "../utils/paths.ts";
import { config } from "../utils/config.ts";

class Persona {
  private name: string;
  private personalityTraits: string[];
  private session: LlamaChatSession | null = null;
  private temperature: number;

  /**
   * Creates an instance of Persona.
   *
   * @param name - The name of the persona.
   */
  private constructor(name: string) {
    this.name = name;
    this.personalityTraits = getRandomPersonalityTraits(
      config.persona.personality.traitCount
    );
    // get random temperature
    const { min, max } = config.persona.temperature;
    this.temperature = getRandomTemperature(min, max);
  }

  /**
   * Creates and initializes a new Persona instance with the given name and context.
   *
   * @param name - The name of the persona to be created.
   * @param context - The LlamaContext instance used to initialize the persona's session.
   * @returns A promise that resolves to the newly created Persona instance.
   */
  static async build(name: string, context: LlamaContext) {
    const persona = new Persona(name);
    persona.session = new LlamaChatSession({
      contextSequence: context.getSequence(),
      systemPrompt: persona.getSystemPrompt(),
    });
    return persona;
  }

  /**
   * Generates the system prompt string by combining personality traits and additional system prompt text.
   *
   * @returns {string} The complete system prompt string.
   */
  private getSystemPrompt = () => {
    let systemPrompt = "These are your personality traits:\n";
    this.personalityTraits.forEach((trait) => {
      systemPrompt += `${trait}`;
      systemPrompt += ", ";
    });
    systemPrompt += "\n";
    // add additional system prompt
    systemPrompt += readTextfile(paths.prompts.personaSystemPrompt);
    // add user configurable system prompt
    systemPrompt += config.persona.prompts.system;
    return systemPrompt;
  };

  /**
   * Retrieves the current session.
   *
   * @returns The current session.
   */
  getSession() {
    return this.session;
  }

  /**
   * Generates an introduction string for the persona. *This method is for demonstration purposes only.*
   *
   * @param {boolean} [include_system_prompt=true] - Whether to include the system prompt in the introduction.
   * @returns {string} The generated introduction string.
   */
  introduce(include_system_prompt = true) {
    let intro = `Hello, I am ${this.name}. \n`;
    intro += "My temperature is " + this.temperature + ". \n";
    intro += "I am ";
    for (let i = 0; i < this.personalityTraits.length; i++) {
      intro += this.personalityTraits[i];
      if (i < this.personalityTraits.length - 1) {
        intro += ", ";
      }
    }
    intro += ".\n\n";
    if (include_system_prompt) {
      intro += "This is my final system prompt.\n";
      intro += "---- SYSTEM PROMPT START ---\n";
      intro += this.getSystemPrompt();
      intro += "---- SYSTEM PROMPT END ---\n";
    }
    return intro;
  }
}

export { Persona };
