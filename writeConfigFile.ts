import { writeFileSec } from "./writeFileSec.ts";
import { generateJsonc } from "./schema.ts";

export interface Options {
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

export const defaultOpts: Options = {
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

export async function inputHandler(opts: Options) {
  if (opts.fill || opts.jsonc) {
    opts.name = opts.name.replace(".json", ".jsonc");

    const file = generateJsonc(opts);

    await writeFileSec(
      opts.name,
      new TextEncoder().encode(file),
      {
        force: opts.force,
      },
    );
    return file;
  }

  const configFile: ConfigFile = {};

  if (opts.yes) {
    opts.fmt = true;
    opts.lint = true;
    opts.tsconfig = true;
    opts.task = true;
  }

  if (opts.fmt) {
    configFile.fmt = {
      files: {
        include: [],
        exclude: [],
      },
      options: {},
    };
  }

  if (opts.lint) {
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

  if (opts.map) {
    configFile.importMap = "import_map.json";
  }

  if (opts.task) {
    configFile.tasks = {};
  }

  if (opts.tsconfig) {
    configFile.compilerOptions = {};
  }

  await writeConfigFile(configFile, opts);
  return JSON.stringify(configFile, null, 2);
}

export async function writeConfigFile(
  configFile: ConfigFile,
  opts: Options,
) {
  if (opts.name && !/\.jsonc?$/.test(opts.name)) {
    throw new Error(
      `Chosen filename has an unsupported file extension: ${opts.name}`,
    );
  }

  const denoJson = new TextEncoder()
    .encode(JSON.stringify(configFile, null, 2));

  await writeFileSec(
    `./${opts.name}`,
    denoJson,
    { force: opts.force },
  );
}
