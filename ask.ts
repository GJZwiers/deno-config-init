import { defaults } from "./writeConfigFile.ts";

export function ask() {
  const tsconfigResponse = prompt(
    `Would you like to add custom TypeScript configuration? (y/n)`,
    `y`,
  );

  const tsconfig = processResponse(tsconfigResponse, defaults.lint);

  const lintingResponse = prompt(
    "Would you like to add custom linter configuration? (y/n)",
    `y`,
  );

  const lint = processResponse(lintingResponse, defaults.lint);

  const formattingResponse = prompt(
    "Would you like to add custom formatter configuration? (y/n)",
    `y`,
  );

  const fmt = processResponse(formattingResponse, defaults.fmt);

  const name = prompt(
    "What should the name of the config file be?",
    `deno.json`,
  );

  if (name && !/\.jsonc?$/.test(name)) {
    throw new Error(
      `Chosen filename has an unsupported file extension: ${name}`,
    );
  }

  const settings = {
    tsconfig,
    lint,
    fmt,
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
