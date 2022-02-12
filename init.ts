import { Command } from "./deps.ts";
import { defaults, inputHandler } from "./writeConfigFile.ts";
import { ask } from "./ask.ts";

await new Command()
  .name("deno-init")
  .version("v2.0.1")
  .description("Generate a Deno configuration file.")
  .option(
    "-f, --force [force:boolean]",
    "Force overwriting any existing config file",
    {
      default: false,
    },
  )
  .option(
    "-n, --name [name:string]",
    "The name of the configuration file. Default: deno.json.",
    {
      default: "deno.json",
    },
  )
  .option(
    "-m, --fmt [fmt:boolean]",
    "Set up config for deno fmt only",
    {
      default: false,
    },
  )
  .option(
    "-l, --lint [lint:boolean]",
    "Set up config for deno lint only",
    {
      default: false,
    },
  )
  .option(
    "-t, --tsconfig [tsconfig:boolean]",
    "Ser up config for typescript compiler options only",
    {
      default: false,
    },
  )
  .option(
    "-y, --yes [yes:boolean]",
    "Skip the prompts and use all defaults.",
    {
      default: false,
    },
  )
  .action((options) => {
    if (options.yes || options.fmt || options.lint || options.tsconfig) {
      inputHandler({ ...defaults, ...options });
    } else {
      const choices = ask();
      inputHandler({ ...options, ...choices });
    }
  })
  .parse(Deno.args);
