import { promptUserInputs } from "./promptUserInputs.ts";
import { defaultOpts, type Options } from "./writeConfigFile.ts";

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
    return { ...defaultOpts, ...opts };
  } else {
    const choices = promptUserInputs({ testmode: false });
    return { ...opts, ...choices };
  }
}

type FeatureVersions = {
  [key: string]: {
    major: number;
    minor: number;
  };
};

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
