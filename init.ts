import { Command } from "./deps.ts";
import { defaults, inputHandler } from "./writeConfigFile.ts";
import { ask } from "./ask.ts";

await new Command()
  .name("deno-init")
  .version("v2.0.1")
  .description("Generate a Deno configuration file.")
  .option(
    "-n, --name [name:string]",
    "The name of the configuration file. Default: deno.json.",
    {
      default: "deno.json",
    },
  )
  .option(
    "-m, --fmt [fmt:boolean]",
    "Add configuration for deno fmt",
    {
      default: false,
    },
  )
  .option(
    "-l, --lint [lint:boolean]",
    "Add configuration for deno lint",
    {
      default: false,
    },
  )
  .option(
    "-t, --tsconfig [tsconfig:boolean]",
    "Add configuration for tsconfig",
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
    if (options.yes) {
      inputHandler({ ...defaults, ...options });
    } else {
      const choices = ask();
      inputHandler({ ...options, ...choices });
    }
  })
  .parse(Deno.args);
