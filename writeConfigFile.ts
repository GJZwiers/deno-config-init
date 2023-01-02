import { generateJsonc } from "./schema.ts";
import {
  ConfigFile,
  FeatureVersions,
  Options,
  PromptAnswerOptions,
  WriteFileSecOptions,
} from "./types.ts";

export const defaultOptions: Options = {
  bench: false,
  force: false,
  fill: false,
  fmt: false,
  jsonc: false,
  lint: false,
  lock: false,
  lockfile: "",
  map: false,
  name: "deno.json",
  task: false,
  test: false,
  tsconfig: false,
  yes: false,
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
    opts.test = true;
    opts.bench = true;
    opts.lock = true;
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
        include: [],
        exclude: [],
      },
    };
  }

  if (opts.map) {
    configFile.importMap = "import_map.json";
  }

  if (opts.lock) {
    configFile.lock = true;
  } else if (opts.lockfile) {
    configFile.lock = opts.lockfile;
  }

  if (opts.task) {
    configFile.tasks = {};
  }

  if (opts.test) {
    configFile.test = {
      files: {
        include: [],
        exclude: [],
      },
    };
  }

  if (opts.bench) {
    configFile.bench = {
      files: {
        include: [],
        exclude: [],
      },
    };
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

export function process(opts: Options): Options {
  // TODO: investigate using the json schema to check this instead
  if (opts.map && !isSupported("map", Deno.version.deno)) {
    throw new Error("The option '--map' requires Deno v1.20 or higher");
  }
  if (opts.task && !isSupported("task", Deno.version.deno)) {
    throw new Error("The option '--task' requires Deno v1.20 or higher");
  }
  if (opts.test && !isSupported("test", Deno.version.deno)) {
    throw new Error("The option '--test' requires Deno v1.24 or higher");
  }
  if (opts.lock && !isSupported("test", Deno.version.deno)) {
    throw new Error("The option '--lock' requires Deno v1.29 or higher");
  }
  if (opts.lockfile && !isSupported("test", Deno.version.deno)) {
    throw new Error("The option '--lockfile' requires Deno v1.29 or higher");
  }

  if (opts.lock && opts.lockfile) {
    throw new Error(
      "'lock' and 'lockfile' cannot be used simultaneously. Use 'lockfile' to enable and set a custom lock file name, and use 'lock' to enable/disable deno.lock generation. Setting 'lockfile' implies 'lock': true",
    );
  }

  if (opts.yes) {
    if (
      opts.tsconfig || opts.fmt || opts.lint || opts.task || opts.map ||
      opts.test || opts.bench || opts.lock || opts.lockfile
    ) {
      throw new Error("--yes cannot be used with other options");
    }
  }

  if (
    opts.yes || opts.fill || opts.fmt || opts.lint ||
    opts.tsconfig || opts.jsonc || opts.task || opts.map || opts.test ||
    opts.bench || opts.lock || opts.lockfile
  ) {
    return { ...defaultOptions, ...opts };
  } else {
    const choices = promptUserInputs({ testmode: false });
    return { ...opts, ...choices };
  }
}

const featureVersionReqs: FeatureVersions = {
  map: {
    major: 1,
    minor: 20,
  },
  task: {
    major: 1,
    minor: 20,
  },
  test: {
    major: 1,
    minor: 24,
  },
  lock: {
    major: 1,
    minor: 29,
  },
  lockfile: {
    major: 1,
    minor: 29,
  },
};

function isSupported(feature: string, v: string): boolean {
  const components = v.split(".");
  const major = parseInt(components[0]);
  const minor = parseInt(components[1]);

  return major >= featureVersionReqs[feature].major &&
    minor >= featureVersionReqs[feature].minor;
}

export function promptUserInputs(promptOpts: PromptAnswerOptions) {
  const tsconfigAnswer = promptAnswer(
    `Would you like to add custom TypeScript configuration? (y/n)`,
    `y`,
    promptOpts.testmode,
  );

  const tsconfig = processAnswer(tsconfigAnswer, defaultOptions.tsconfig);

  const lintingAnswer = promptAnswer(
    "Would you like to add custom linter configuration? (y/n)",
    `y`,
    promptOpts.testmode,
  );

  const lint = processAnswer(lintingAnswer, defaultOptions.lint);

  const formattingAnswer = promptAnswer(
    "Would you like to add custom formatter configuration? (y/n)",
    `y`,
    promptOpts.testmode,
  );

  const fmt = processAnswer(formattingAnswer, defaultOptions.fmt);

  const testingAnswer = promptAnswer(
    "Would you like to add custom testing configuration? (y/n)",
    `y`,
    promptOpts.testmode,
  );

  const test = processAnswer(testingAnswer, defaultOptions.test);

  const taskAnswer = promptAnswer(
    "Would you like to add tasks? (y/n)",
    `y`,
    promptOpts.testmode,
  );

  const task = processAnswer(taskAnswer, defaultOptions.task);

  const importMapAnswer = promptAnswer(
    "Would you like to add an import map? (y/n)",
    `n`,
    promptOpts.testmode,
  );

  const importMap = processAnswer(importMapAnswer, defaultOptions.map);

  let name = promptAnswer(
    "What should the config file be named?",
    `deno.json`,
    promptOpts.testmode,
  );

  if (!name) {
    name = defaultOptions.name;
  }

  const opts = {
    tsconfig,
    lint,
    fmt,
    task,
    test,
    importMap,
    name,
  };

  return opts;
}

function promptAnswer(
  question: string,
  defaultValue: string,
  testmode: boolean,
) {
  return (testmode) ? defaultValue : prompt(
    question,
    defaultValue,
  );
}

export function processAnswer(
  answer: string | null,
  defaultValue: boolean,
): boolean {
  let v;
  if (!answer) {
    v = defaultValue;
  } else if (/y(?:es)?/i.test(answer)) {
    v = true;
  } else if (/n(?:o)?/i.test(answer)) {
    v = false;
  } else {
    v = defaultValue;
  }

  return v;
}
