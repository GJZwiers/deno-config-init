export interface Settings {
  name: string;
  tsconfig: boolean;
  linting: boolean;
  formatting: boolean;
}

export const defaults: Settings = {
  name: "deno.json",
  tsconfig: true,
  linting: true,
  formatting: true,
};

export async function writeConfigFile(settings: Settings) {
  const configFile = {
    compilerOptions: (settings.tsconfig) ? {} : undefined,
    lint: (settings.linting)
      ? {
        files: {
          include: [],
          exclude: [],
        },
        rules: {
          tags: [],
          include: [],
          exclude: [],
        },
      }
      : undefined,
    fmt: (settings.formatting)
      ? {
        files: {
          include: [],
          exclude: [],
        },
        options: {},
      }
      : undefined,
  };

  const json = JSON.stringify(configFile, null, 2);

  const denoJson = new TextEncoder().encode(json);

  await writeFileSec(
    `./${settings.name}`,
    denoJson,
  );
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
