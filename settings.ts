export interface Settings {
  cache: boolean;
  depsEntrypoint: string;
  devDepsEntrypoint: string;
  depsModule: Uint8Array;
  entrypoint: string;
  extension: string;
  gitignore: string;
  gitignoreContent: Uint8Array,
  module: Uint8Array;
  force: boolean;
  git: boolean;
  path: string;
  template: string;
  templateDir: string;
  map: boolean;
}

const encoder = new TextEncoder();

export const defaultModuleContent = encoder.encode("export {};\n");

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
  gitignoreContent: encoder.encode( 
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
