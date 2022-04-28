import { promptUserInputs } from "./promptUserInputs.ts";
import { defaultOpts, type Options } from "./writeConfigFile.ts";

export class OptionValidationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export function process(opts: Options): Options {
  if (opts.yes) {
    if (
      opts.tsconfig || opts.fmt || opts.lint || opts.task || opts.map ||
      opts.name
    ) {
      throw new OptionValidationError(
        "'--yes' cannot be used together with other options.",
      );
    }
  }

  if (opts.name && !opts.jsonc && !opts.fill) {
    if (!opts.tsconfig && !opts.fmt && !opts.lint && !opts.task && !opts.map) {
      throw new OptionValidationError(
        "'--name' must be used together with other options.",
      );
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
