export interface Settings {
  force: boolean;
  fmt: boolean;
  lint: boolean;
  name: string;
  tsconfig: boolean;
  yes: boolean;
}

export const defaults: Settings = {
  force: false,
  fmt: false,
  lint: false,
  name: "deno.json",
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
};

export interface WriteFileSecOptions extends Deno.WriteFileOptions {
  force?: boolean;
}

export async function inputHandler(settings: Settings) {
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

  if (settings.tsconfig) {
    configFile.compilerOptions = {};
  }

  await writeConfigFile(configFile, settings);
}

export async function writeConfigFile(
  configFile: ConfigFile,
  settings: Settings,
) {
  const denoJson = new TextEncoder()
    .encode(JSON.stringify(configFile, null, 2));

  await writeFileSec(
    `./${settings.name}`,
    denoJson,
    { force: settings.force },
  );
}

export async function writeFileSec(
  path: string | URL,
  data: Uint8Array,
  options?: WriteFileSecOptions,
): Promise<void> {
  if (options?.force) {
    return await Deno.writeFile(path, data, options);
  }

  try {
    const file = await Deno.readFile(path);

    if (file) {
      console.warn(
        `Warning: file ${path} already exists. Use --force if you want to overwrite an existing file.`,
      );
    }
  } catch (_error) {
    await Deno.writeFile(path, data, options);
  }
}
