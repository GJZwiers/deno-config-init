export interface Settings {
  cache: boolean;
  debug: string | "n";
  depsEntrypoint: string | "deps.ts";
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
  debug: "n",
  depsEntrypoint: "deps.ts",
  depsModule: defaultModuleContent,
  cache: false,
  entrypoint: "mod.ts",
  extension: "ts",
  gitignore: ".gitignore",
  module: defaultModuleContent,
  force: false,
  git: true,
  path: ".",
  template: "",
  templateDir: "templates",
  editor: "vscode",
};
