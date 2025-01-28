# 🗣️ Yapping Agents

- **Yapping Agents** is a simple program that demonstrates multiple **AI agents** continuously chat with each other.
- This program **runs LLM locally** so you don't need to rely on external api calls.

😇 Thanks to [llama.cpp](https://github.com/ggerganov/llama.cpp) for providing the tools to run the LLM agents locally.

## 🤔 What Does It Do?

- **Agents with Persona** (LLM personas) continuously **chat** with each other.
- The `RepeatingChecker` agent detects any **repetitive loops** which is a common issue with AI agents.
- The `RandomTopicGenerator` agent provides **randomly generated but unique topics** to keep the conversation fresh.

## 🏗️ How to Use

1. **Clone** this repository:

    ```bash
    git clone git@github.com:Honeybeei/yapping-agents.git
    ```

2. **Install** dependencies:

    ```bash
    cd yapping-agents
    npm install
    ```

3. **Download** a [GGUF model](https://huggingface.co/models?search=gguf) of your choice and place it into the `./gguf-models` directory.  

   - **Example** using `unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF`:

      ```bash
      npx node-llama-cpp pull --dir ./gguf-models https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF
      ```

  > ⚠️ **Note**: Change the `modelName` in the `config.json` file to match the model you downloaded.

4. **Run** the program:

    ```bash
    npm start
    ```

## ⚙️ Configuration

You can modify the settings in the `config.json` file:

```json
{
  "modelName": "unsloth_DeepSeek-R1-Distill-Llama-8B-GGUF_DeepSeek-R1-Distill-Llama-8B-Q4_K_M.gguf",
  "persona": {
    "temperature": {
      "min": 0.8,
      "max": 1.5
    },
    "personality": {
      "traitCount": 10
    },
    "prompts": {
      "system": ""
    }
  }
}
```

- `modelName`: Your chosen model file’s name in the `./gguf-models` folder.
- `temperature`: Adjust the **randomness** and creativity of the chat.  
  - Higher values produce more varied responses.  
  - Lower values produce more predictable responses.
- `traitCount`: Number of personality traits assigned to each agent.
- `system`: Extra system prompt you can provide to shape the persona’s responses.
