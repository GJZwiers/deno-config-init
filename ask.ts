import { defaults } from "./writeConfigFile.ts";

export function ask() {
  const tsconfigResponse = prompt(
    `Would you like to add custom TypeScript configuration? (y/n)`,
    `y`,
  );

  const tsconfig = processResponse(tsconfigResponse, defaults.linting);

  const lintingResponse = prompt(
    "Would you like to add custom linter configuration? (y/n)",
    `y`,
  );

  const linting = processResponse(lintingResponse, defaults.linting);

  const formattingResponse = prompt(
    "Would you like to add custom formatter configuration? (y/n)",
    `y`,
  );

  const formatting = processResponse(formattingResponse, defaults.formatting);

  const settings = {
    tsconfig,
    linting,
    formatting,
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
