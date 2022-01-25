import { Command } from "./deps.ts";
import { defaults, writeConfigFile } from "./writeConfigFile.ts";
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
    "-y, --yes [yes:boolean]",
    "Skip the prompts and use all defaults.",
    {
      default: false,
    },
  )
  .action((options) => {
    if (options.yes) {
      writeConfigFile({ ...defaults, ...options });
    } else {
      const choices = ask();
      writeConfigFile({ ...options, ...choices });
    }
  })
  .parse(Deno.args);
