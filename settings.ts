export interface Settings {
  cache: boolean;
  depsEntrypoint: string | "deps.ts";
  devDepsEntrypoint: string | "dev_deps.ts";
  depsModule: Uint8Array;
  entrypoint: string | "mod.ts";
  extension: string | "ts";
  gitignore: string | ".gitignore";
  gitignoreContent: Uint8Array,
  module: Uint8Array;
  force: boolean | false;
  git: boolean | true;
  path: string | ".";
  template: string | "";
  templateDir: string | "templates";
  map: boolean;
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
  gitignore: ".gitignore",
  gitignoreContent: new TextEncoder().encode( 
    `.env
    .vscode/
    coverage/
    cov/
    lcov/`
  ),
  module: defaultModuleContent,
  path: ".",
  template: "deno_basic",
  templateDir: "templates",
  map: false,
};
