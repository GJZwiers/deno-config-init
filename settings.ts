export interface Settings {
  config: boolean;
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
  path: string;
  map: boolean;
  mapContent: Uint8Array;
}

const encoder = new TextEncoder();

export const defaultModuleContent = encoder.encode("export {};\n");

export const settings: Settings = {
  config: false,
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
  path: ".",
  map: false,
  mapContent: encoder.encode("{}"),
};
