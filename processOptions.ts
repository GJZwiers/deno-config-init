import { promptUserInputs } from "./promptUserInputs.ts";
import { defaultOpts, type Options } from "./writeConfigFile.ts";

export function process(opts: Options): Options {
  if (opts.yes) {
    if (
      opts.tsconfig || opts.fmt || opts.lint || opts.task || opts.map ||
      opts.name
    ) {
      throw new Error("--yes cannot be used together with other options.");
    }
  }

  if (
    opts.yes || opts.fill || opts.fmt || opts.lint ||
    opts.tsconfig || opts.jsonc || opts.task || opts.map
  ) {
    return { ...defaultOpts, ...opts };
  } else {
    const choices = promptUserInputs({ testmode: false });
    return { ...opts, ...choices };
  }
}
