import { addProjectFile, initGit } from "./act.ts";

export interface FileContentSettings {
  configContent: Uint8Array;
  depsModuleContent: Uint8Array;
  gitignoreContent: Uint8Array;
  mapContent: Uint8Array;
  moduleContent: Uint8Array;
}

export interface FlagSettings {
  ascii: boolean;
  config: boolean;
  configOnly: boolean;
  force: boolean;
  git: boolean;
  map: boolean;
  testdriven: boolean;
}

export interface InsertableTestSpies {
  initGit: (name: string) => Promise<void>;
  addProjectFile: (filename: string, content: Uint8Array) => Promise<void>;
}

export interface FileNameSettings {
  depsEntrypoint: string;
  devDepsEntrypoint: string;
  entrypoint: string;
  gitignore: string;
}

export interface Settings
  extends
    FlagSettings,
    FileContentSettings,
    FileNameSettings,
    InsertableTestSpies {
  extension: string;
  name: string;
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
  depsModuleContent: defaultModuleContent,
  force: false,
  git: true,
  gitignore: ".gitignore",
  gitignoreContent: encoder.encode(
    `.env
.vscode/
coverage/
cov/
lcov/
target/`,
  ),
  moduleContent: defaultModuleContent,
  name: ".",
  map: false,
  mapContent: encoder.encode(
    `{
  "imports": {}
}
`,
  ),
  testdriven: false,
  initGit: initGit,
  addProjectFile: addProjectFile,
};
