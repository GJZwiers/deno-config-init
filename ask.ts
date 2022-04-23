import { defaults } from "./writeConfigFile.ts";

export function ask() {
  const tsconfigResponse = prompt(
    `Would you like to add custom TypeScript configuration? (y/n)`,
    `y`,
  );

  const tsconfig = processResponse(tsconfigResponse, false);

  const lintingResponse = prompt(
    "Would you like to add custom linter configuration? (y/n)",
    `y`,
  );

  const lint = processResponse(lintingResponse, false);

  const formattingResponse = prompt(
    "Would you like to add custom formatter configuration? (y/n)",
    `y`,
  );

  const fmt = processResponse(formattingResponse, false);

  const taskResponse = prompt(
    "Would you like to add tasks? (y/n)",
    `y`,
  );

  const task = processResponse(taskResponse, false);

  const importMapResponse = prompt(
    "Would you like to add an import map? (y/n)",
    `n`,
  );

  const importMap = processResponse(importMapResponse, false);

  const name = prompt(
    "What should the config file be named?",
    `deno.json`,
  );

  const settings = {
    tsconfig,
    lint,
    fmt,
    task,
    importMap,
    name: name as string,
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
