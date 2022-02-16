import { Command } from "./deps.ts";
import { defaults, inputHandler } from "./writeConfigFile.ts";
import { ask } from "./ask.ts";

await new Command()
  .name("deno-init")
  .version("v2.1.1")
  .description("Generate a Deno configuration file.")
  .help({
    colors: (Deno.build.os === "windows") ? false : true,
  })
  .option(
    "-f, --force [force:boolean]",
    "Force overwriting any existing config file.",
  )
  .option(
    "-n, --name [name:string]",
    "The name of the config file.",
    {
      default: "deno.json",
    },
  )
  .option(
    "-m, --fmt [fmt:boolean]",
    "Set up config for deno fmt only.",
  )
  .option(
    "-l, --lint [lint:boolean]",
    "Set up config for deno lint only.",
  )
  .option(
    "-t, --tsconfig [tsconfig:boolean]",
    "Set up config for typescript compiler options only.",
  )
  .option(
    "-y, --yes [yes:boolean]",
    "Skip the prompts and use all defaults.",
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
