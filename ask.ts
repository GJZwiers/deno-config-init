import { defaultOpts } from "./writeConfigFile.ts";

export function ask() {
  const tsconfigResponse = prompt(
    `Would you like to add custom TypeScript configuration? (y/n)`,
    `y`,
  );

  const tsconfig = processResponse(tsconfigResponse, defaultOpts.tsconfig);

  const lintingResponse = prompt(
    "Would you like to add custom linter configuration? (y/n)",
    `y`,
  );

  const lint = processResponse(lintingResponse, defaultOpts.lint);

  const formattingResponse = prompt(
    "Would you like to add custom formatter configuration? (y/n)",
    `y`,
  );

  const fmt = processResponse(formattingResponse, defaultOpts.fmt);

  const taskResponse = prompt(
    "Would you like to add tasks? (y/n)",
    `y`,
  );

  const task = processResponse(taskResponse, defaultOpts.task);

  const importMapResponse = prompt(
    "Would you like to add an import map? (y/n)",
    `n`,
  );

  const importMap = processResponse(importMapResponse, defaultOpts.map);

  let name = prompt(
    "What should the config file be named?",
    `deno.json`,
  );

  if (!name) {
    name = defaultOpts.name;
  }

  const settings = {
    tsconfig,
    lint,
    fmt,
    task,
    importMap,
    name,
  };

  return settings;
}

export function processResponse(
  response: string | null,
  defaultValue: boolean,
): boolean {
  let v;
  if (!response) {
    v = defaultValue;
  } else if (/y(?:es)?/i.test(response)) {
    v = true;
  } else if (/n(?:o)?/i.test(response)) {
    v = false;
  } else {
    v = defaultValue;
  }

  return v;
}
