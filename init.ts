import { Command } from "./deps.ts";
import { act } from "./act.ts";
import { defaults } from "./settings.ts";
import { ask } from "./ask.ts";

/**
 * Main CLI command, as of right now the CLI does not have sub-commands.
 */
await new Command()
  .name("deno-init")
  .version("v1.4.0")
  .description("Start a new Deno project with a single command")
  .option(
    "-c, --config [config:boolean]",
    "Add a Deno.json configuration file as part of the project.",
    {
      default: false,
    },
  )
  .option(
    "-o, --config-only [configOnly:boolean]",
    "Make only a Deno.json configuration file.",
    {
      default: false,
    },
  )
  .option(
    "-f, --force [force:boolean]",
    "Force overwrite of existing files/directories. Helpful to re-initialize, but use with caution!",
  )
  .option(
    "-m, --map [map:boolean]",
    "Add an import map as part of the project",
    {
      default: false,
    },
  )
  .option(
    "--no-git [git:boolean]",
    "Do not initialize a local Git repository for the project",
  )
  .option(
    "-n, --name [name:string]",
    "Create the project in a new directory with the entered name",
  )
  .option(
    "-t, --tdd [tdd:boolean]",
    "Create the project with a file for tests",
    {
      default: false,
    },
  )
  .option(
    "-y, --yes [yes:boolean]",
    "Use all default answers, skipping the prompts",
    {
      default: false,
    },
  )
  .option(
    "-a, --ascii [deno:boolean]",
    "Initialize an ASCII Deno to the screen!",
    {
      default: false,
    },
  )
  .action((options) => {
    if (options.yes === true) {
      act({ ...defaults, ...options });
    } else {
      const choices = ask(options);
      act({ ...defaults, ...choices });
    }
  })
  .parse(Deno.args);
