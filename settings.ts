export interface Settings {
  cache: boolean;
  debug: string | "n";
  depsEntrypoint: string | "deps.ts";
  devDepsEntrypoint: string | "dev_deps.ts";
  depsModule: Uint8Array;
  entrypoint: string | "mod.ts";
  extension: string | "ts";
  gitignore: string | ".gitignore";
  module: Uint8Array;
  force: boolean | false;
  git: boolean | true;
  path: string | ".";
  template: string | "";
  templateDir: string | "templates";
  editor: string | "vscode";
}

export const defaultModuleContent = new TextEncoder().encode("export {};\n");

export const settings: Settings = {
  extension: "ts",
  entrypoint: "mod.ts",
  depsEntrypoint: "deps.ts",
  devDepsEntrypoint: "dev_deps.ts",
  depsModule: defaultModuleContent,
  force: false,
  git: true,
  cache: false,
  debug: "n",
  gitignore: ".gitignore",
  module: defaultModuleContent,
  path: ".",
  template: "deno_basic",
  templateDir: "templates",
  editor: "vscode",
};
