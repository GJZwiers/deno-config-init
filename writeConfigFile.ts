import { writeFileSec } from "./writeFileSec.ts";
import { generateJsonc } from "./schema.ts";

export interface Settings {
  force: boolean;
  fill: boolean;
  fmt: boolean;
  jsonc: boolean;
  lint: boolean;
  map: boolean;
  name: string;
  task: boolean;
  tsconfig: boolean;
  yes: boolean;
}

export const defaults: Settings = {
  force: false,
  fill: false,
  fmt: false,
  jsonc: false,
  lint: false,
  map: false,
  name: "deno.json",
  task: false,
  tsconfig: false,
  yes: false,
};

export type ConfigFile = {
  compilerOptions?: Record<string, unknown>;
  fmt?: {
    files?: {
      include?: string[];
      exclude?: string[];
    };
    options?: Record<string, unknown>;
  };
  lint?: {
    files?: {
      include?: string[];
      exclude?: string[];
    };
    rules?: {
      tags?: string[];
      include?: string[];
      exclude?: string[];
    };
  };
  tasks?: Record<string, unknown>;
  importMap?: string;
};

export async function inputHandler(settings: Settings) {
  if (settings.fill || settings.jsonc) {
    settings.name = settings.name.replace(".json", ".jsonc");

    const file = generateJsonc(settings);

    await writeFileSec(
      settings.name,
      new TextEncoder().encode(file),
      {
        force: settings.force,
      },
    );
    return file;
  }

  const configFile: ConfigFile = {};

  if (settings.yes) {
    settings.fmt = true;
    settings.lint = true;
    settings.tsconfig = true;
  }

  if (settings.fmt) {
    configFile.fmt = {
      files: {
        include: [],
        exclude: [],
      },
      options: {},
    };
  }

  if (settings.lint) {
    configFile.lint = {
      files: {
        include: [],
        exclude: [],
      },
      rules: {
        tags: [],
        include: [],
        exclude: [],
      },
    };
  }

  if (settings.map) {
    configFile.importMap = "";
  }

  if (settings.task) {
    configFile.tasks = {};
  }

  if (settings.tsconfig) {
    configFile.compilerOptions = {};
  }

  await writeConfigFile(configFile, settings);
  return JSON.stringify(configFile, null, 2);
}

export async function writeConfigFile(
  configFile: ConfigFile,
  settings: Settings,
) {
  if (settings.name && !/\.jsonc?$/.test(settings.name)) {
    throw new Error(
      `Chosen filename has an unsupported file extension: ${settings.name}`,
    );
  }

  const denoJson = new TextEncoder()
    .encode(JSON.stringify(configFile, null, 2));

  await writeFileSec(
    `./${settings.name}`,
    denoJson,
    { force: settings.force },
  );
}
