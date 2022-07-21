import { defaultOpts } from "./writeConfigFile.ts";

interface PromptAnswerOptions {
  testmode: boolean;
}

function promptAnswer(
  question: string,
  defaultValue: string,
  testmode: boolean,
) {
  return (testmode) ? defaultValue : prompt(
    question,
    defaultValue,
  );
}

export function promptUserInputs(promptOpts: PromptAnswerOptions) {
  const tsconfigAnswer = promptAnswer(
    `Would you like to add custom TypeScript configuration? (y/n)`,
    `y`,
    promptOpts.testmode,
  );

  const tsconfig = processAnswer(tsconfigAnswer, defaultOpts.tsconfig);

  const lintingAnswer = promptAnswer(
    "Would you like to add custom linter configuration? (y/n)",
    `y`,
    promptOpts.testmode,
  );

  const lint = processAnswer(lintingAnswer, defaultOpts.lint);

  const formattingAnswer = promptAnswer(
    "Would you like to add custom formatter configuration? (y/n)",
    `y`,
    promptOpts.testmode,
  );

  const fmt = processAnswer(formattingAnswer, defaultOpts.fmt);

  const testingAnswer = promptAnswer(
    "Would you like to add custom testing configuration? (y/n)",
    `y`,
    promptOpts.testmode,
  );

  const test = processAnswer(testingAnswer, defaultOpts.test);

  const taskAnswer = promptAnswer(
    "Would you like to add tasks? (y/n)",
    `y`,
    promptOpts.testmode,
  );

  const task = processAnswer(taskAnswer, defaultOpts.task);

  const importMapAnswer = promptAnswer(
    "Would you like to add an import map? (y/n)",
    `n`,
    promptOpts.testmode,
  );

  const importMap = processAnswer(importMapAnswer, defaultOpts.map);

  let name = promptAnswer(
    "What should the config file be named?",
    `deno.json`,
    promptOpts.testmode,
  );

  if (!name) {
    name = defaultOpts.name;
  }

  const opts = {
    tsconfig,
    lint,
    fmt,
    task,
    test,
    importMap,
    name,
  };

  return opts;
}

export function processAnswer(
  answer: string | null,
  defaultValue: boolean,
): boolean {
  let v;
  if (!answer) {
    v = defaultValue;
  } else if (/y(?:es)?/i.test(answer)) {
    v = true;
  } else if (/n(?:o)?/i.test(answer)) {
    v = false;
  } else {
    v = defaultValue;
  }

  return v;
}
