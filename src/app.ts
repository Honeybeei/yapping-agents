import { Persona } from "./agents/Persona.ts";
import chalk from "chalk";
import readline from "readline";
import { getLlama } from "node-llama-cpp";
import { RepeatingChecker } from "./agents/RepeatingChecker.ts";
import { RandomTopicGenerator } from "./agents/RandomTopicGenerator.ts";
import { paths } from "./utils/paths.ts";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getUserInput(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query + " : ", (answer) => {
      resolve(answer);
    });
  });
}

const llama = await getLlama();

const model = await llama.loadModel({ modelPath: paths.model });

const context = await model.createContext({
  sequences: 4,
});

// Agents
const alice = await Persona.build("Alice", context);
const bob = await Persona.build("Bob", context);
const repeatingChecker = await RepeatingChecker.build(llama, context);
const randomTopicGenerator = await RandomTopicGenerator.build(llama, context);

// self introduction
process.stdout.write(chalk.blue(alice.introduce(false)) + "\n");
process.stdout.write(chalk.green(bob.introduce(false)) + "\n");

// Start the conversation
const user_input = await getUserInput("Start the conversation with this topic");
let response = "Let's talk about " + user_input;

let turn = 0;
while (true) {
  if (turn % 2 === 0) {
    // Alice's turn
    process.stdout.write(chalk.blue("Alice: "));
    response = await alice.getSession()!.prompt(response, {
      onTextChunk(chunk: string) {
        process.stdout.write(chalk.blue(chunk));
      },
    });
  } else {
    // Bob's turn
    process.stdout.write(chalk.green("Bob: "));
    response = await bob.getSession()!.prompt(response, {
      onTextChunk(chunk: string) {
        process.stdout.write(chalk.green(chunk));
      },
    });
  }
  turn++;
  process.stdout.write("\n\n");

  // Check if the response is repeating
  repeatingChecker.updateRecentMessages(response);
  const is_repeating = await repeatingChecker.checkForRepeating();
  if (is_repeating) {
    const random_topic = await randomTopicGenerator.generateRandomTopic();
    response = "We are repeating. Let's talk about " + random_topic;
    process.stdout.write(chalk.red("Repeating detected. " + response + "\n"));
  }
}
