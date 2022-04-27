import { ask } from "./ask.ts";
import { defaultOpts, type Options } from "./writeConfigFile.ts";

export function process(opts: Options): Options {
  if (
    opts.yes &&
    (opts.lint || opts.fmt || opts.task || opts.tsconfig)
  ) {
    throw new Error("--yes can only be used together with --name and --map.");
  }

  if (
    opts.yes || opts.fill || opts.fmt || opts.lint ||
    opts.tsconfig || opts.jsonc || opts.task || opts.map
  ) {
    return { ...defaultOpts, ...opts };
  } else {
    const choices = ask();
    return { ...opts, ...choices };
  }
}
