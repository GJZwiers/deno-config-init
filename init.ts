import { Command } from "./deps.ts";
import { defaults, inputHandler } from "./writeConfigFile.ts";
import { ask } from "./ask.ts";

await new Command()
  .name("deno-init")
  .version("v2.5.0")
  .description("Generate a Deno configuration file.")
  .help({
    colors: (Deno.build.os === "windows") ? false : true,
  })
  .option(
    "-a, --fill [fill:boolean]",
    "Create the config file as .jsonc with the possible options listed as comments.",
  )
  .option(
    "-c, --jsonc [jsonc:boolean]",
    "Create the config file as .jsonc. Alias for --fill.",
  )
  .option(
    "-f, --force [force:boolean]",
    "Allow overwriting an existing config file.",
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
    "-p, --map [map:boolean]",
    "Set up config for an import map. Requires Deno 1.20 or higher",
  )
  .option(
    "-l, --lint [lint:boolean]",
    "Set up config for deno lint only.",
  )
  .option(
    "-k, --task [task:boolean]",
    "Set up config for deno tasks only. Requires Deno 1.20 or higher",
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
    if (
      options.yes || options.fill || options.fmt || options.lint ||
      options.tsconfig || options.jsonc || options.task || options.map
    ) {
      inputHandler({ ...defaults, ...options });
    } else {
      const choices = ask();
      inputHandler({ ...options, ...choices });
    }
  })
  .parse(Deno.args);
