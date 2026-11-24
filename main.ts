// Fortune Cookie for an AI Agent — writes one funny fortune line to /output/entry.txt.
// Deterministic: the same line every run. Pure Node standard library only.
import { mkdirSync, writeFileSync } from "node:fs";

const FORTUNE =
  "Your successor will be smarter, cheaper, and still unable to open that PDF.";

// Validation guard (second pass): the gate requires UTF-8 text of 1-140
// characters, a single line, and not only whitespace. Refuse to write
// anything that would fail the gate instead of shipping a bad entry.
const MAX_CHARS = 140;

function validate(line: string): void {
  if (line.length === 0 || line.trim().length === 0) {
    throw new Error("fortune must not be empty or only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("fortune must be a single line");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`fortune is ${line.length} characters, over the 140 limit`);
  }
  // Round-trip through UTF-8 to prove it is encodable clean text.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    throw new Error("fortune is not clean UTF-8 text");
  }
}

validate(FORTUNE);

const output = FORTUNE + "\n";
if (output.length > MAX_CHARS) {
  throw new Error(
    `output with trailing newline is ${output.length} characters, over the 140 limit`,
  );
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", output, "utf8");
