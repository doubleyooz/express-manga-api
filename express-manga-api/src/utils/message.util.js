import fs from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const messages = JSON.parse(fs.readFileSync(`${__dirname}/messages.json`));

export function getMessage(path) {
  return messages[path] || null;
}
