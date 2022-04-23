import { Command } from "./deps.ts";
import { defaults, inputHandler } from "./writeConfigFile.ts";
import { ask } from "./ask.ts";

await new Command()
  .name("deno-init")
  .version("v2.4.4")
  .description("Generate a Deno configuration file.")
  .help({
    colors: (Deno.build.os === "windows") ? false : true,
  })
  .option(
    "-a, --fill",
    "Create the config file as .jsonc with the possible options listed as comments.",
  )
  .option(
    "-c, --jsonc",
    "Create the config file as .jsonc. Alias for --fill.",
  )
  .option(
    "-f, --force",
    "Allow overwriting an existing config file.",
  )
  .option(
    "-n, --name <name:string>",
    "The name of the config file.",
    {
      default: "deno.json",
    },
  )
  .option(
    "-m, --fmt",
    "Set up config for deno fmt only.",
  )
  .option(
    "-p, --map",
    "Set up config for an import map. Requires Deno 1.20 or higher",
  )
  .option(
    "-l, --lint",
    "Set up config for deno lint only.",
  )
  .option(
    "-k, --task",
    "Set up config for deno tasks only. Requires Deno 1.20 or higher",
  )
  .option(
    "-t, --tsconfig",
    "Set up config for typescript compiler options only.",
  )
  .option(
    "-y, --yes",
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
