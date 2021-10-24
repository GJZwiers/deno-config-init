export interface Settings {
  ascii: boolean;
  config: boolean;
  configOnly: boolean;
  depsEntrypoint: string;
  devDepsEntrypoint: string;
  depsModule: Uint8Array;
  entrypoint: string;
  extension: string;
  gitignore: string;
  gitignoreContent: Uint8Array;
  module: Uint8Array;
  force: boolean;
  git: boolean;
  name: string;
  map: boolean;
  mapContent: Uint8Array;
  configContent: Uint8Array;
  testdriven: boolean;
}

const encoder = new TextEncoder();

export const defaultModuleContent = encoder.encode("export {};\n");

export const defaultTestModuleContent = encoder.encode(
  `import { assert } from "https://deno.land/std@0.112.0/testing/asserts.ts"; 

Deno.test({
  name: "name",
  fn() {
    assert(true);
  }
});\n`,
);

export const defaults: Settings = {
  ascii: false,
  config: false,
  configContent: encoder.encode("{\n\t\n}"),
  configOnly: false,
  extension: "ts",
  entrypoint: "mod.ts",
  depsEntrypoint: "deps.ts",
  devDepsEntrypoint: "dev_deps.ts",
  depsModule: defaultModuleContent,
  force: false,
  git: true,
  gitignore: ".gitignore",
  gitignoreContent: encoder.encode(
    `.env
.vscode/
coverage/
cov/
lcov/`,
  ),
  module: defaultModuleContent,
  name: ".",
  map: false,
  mapContent: encoder.encode(
    `{
  "imports": {}
}
`,
  ),
  testdriven: false,
};
