import { readFileSync } from "fs";

function readTextfile(filePath: string): string {
  try {
    const contents = readFileSync(filePath, "utf8");
    return contents;
  } catch (error) {
    console.error("Error reading the file:", error);
    throw new Error("Failed to read the file");
  }
}

function readJsonFile<T>(filePath: string): T {
  try {
    const contents = readFileSync(filePath, "utf8");
    return JSON.parse(contents);
  } catch (error) {
    console.error("Error reading the file:", error);
    throw new Error("Failed to read the file");
  }
}

export { readTextfile, readJsonFile };
