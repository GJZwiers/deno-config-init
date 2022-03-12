import { writeFileSec } from "./writeFileSec.ts";

export interface Settings {
  force: boolean;
  fmt: boolean;
  jsonc: boolean;
  lint: boolean;
  name: string;
  tsconfig: boolean;
  yes: boolean;
}

export const defaults: Settings = {
  force: false,
  fmt: false,
  jsonc: false,
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

export async function inputHandler(settings: Settings) {
  if (settings.jsonc) {
    settings.name = settings.name.replace(".json", ".jsonc");

    const canaryVersion = /\+[a-z0-9]+$/;
    const denoVersionNoCanary = Deno.version.deno.replace(canaryVersion, "");

    const schemaUrl =
      `https://deno.land/x/deno@v${denoVersionNoCanary}/cli/schemas/config-file.v1.json`;
    const response = await fetch(schemaUrl);
    const schema = await response.json();

    const config = JSON.stringify(generate(schema), null, 2);

    const jsonc = config
      .split("\n")
      .map((line) => {
        if (
          !line.includes("{}") && !line.includes("[]") &&
          (line.match(/[{}\[\]]/) && !/\[$/.test(line)) &&
          !/\],?$/.test(line)
        ) {
          return line;
        } else {
          return "    // " + line.trimStart();
        }
      }).join("\n");

    return await writeFileSec(
      settings.name,
      new TextEncoder().encode(jsonc),
      {
        force: settings.force,
      },
    );
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

  if (settings.tsconfig) {
    configFile.compilerOptions = {};
  }

  await writeConfigFile(configFile, settings);
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

// deno-lint-ignore no-explicit-any
function generate(schema: any): any {
  if ("default" in schema) {
    return schema.default;
  }
  if ("type" in schema) {
    switch (schema.type) {
      case "object":
        return Object.fromEntries(
          Object.entries(schema.properties).map(([key, value]) => {
            return [key, generate(value)];
          }),
        );
      case "array":
        return [];
    }
  }
}
