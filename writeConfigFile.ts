export interface Settings {
  name: string;
  tsconfig: boolean;
  lint: boolean;
  fmt: boolean;
  yes: boolean;
}

export const defaults: Settings = {
  name: "deno.json",
  tsconfig: false,
  lint: false,
  fmt: false,
  yes: false,
};

type ConfigFile = {
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

async function writeConfigFile(configFile: ConfigFile, settings: Settings) {
  const denoJson = new TextEncoder()
    .encode(JSON.stringify(configFile, null, 2));

  await writeFileSec(
    `./${settings.name}`,
    denoJson,
  );
}

export async function inputHandler(settings: Settings) {
  let configFile: ConfigFile = {};

  if (!settings.fmt && !settings.lint && !settings.tsconfig && settings.yes) {
    configFile = {
      fmt: {
        files: {
          include: [],
          exclude: [],
        },
        options: {},
      },
      lint: {
        files: {
          include: [],
          exclude: [],
        },
        rules: {
          tags: [],
          include: [],
          exclude: [],
        },
      },
      compilerOptions: {},
    };

    await writeConfigFile(configFile, settings);
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

export async function writeFileSec(
  path: string | URL,
  data: Uint8Array,
  options?: Deno.WriteFileOptions,
): Promise<void> {
  try {
    const file = await Deno.readFile(path);
    if (file) {
      console.warn(
        `Warning: file ${path} already exists.`,
      );
    }
  } catch (_error) {
    await Deno.writeFile(path, data, options);
  }
}
