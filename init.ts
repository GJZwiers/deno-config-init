import { Command } from "./deps.ts";
import { act } from "./act.ts";
import { settings } from "./settings.ts";
import { hasFileExtension } from "./utils.ts";

/**/
await new Command()
  .name("deno-init")
  .version("v1.2.0")
  .description("Start a new Deno project with a single command")
  .option(
    "-c, --config [config:boolean]",
    "Add a Deno configuration file (JSON) as part of the project.",
    {
      default: false,
    },
  )
  .option(
    "-f, --force [force:boolean]",
    "Force overwrite of existing files/directories. Helpful to re-initialize a project but use with caution!",
    {
      global: true,
    },
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
    "Do not initialize a Git repository for the project",
    {
      global: true,
    },
  )
  .option(
    "-n, --name [name:string]",
    "Create the project in a new directory with the entered name",
    {
      global: true,
    },
  )
  .option(
    "-y, --yes [yes:boolean]",
    "Answer 'y' to all prompts",
    {
      default: false,
    },
  )
  .action(({ config, force, map, git, name, yes }) => {
    settings.config = config;
    settings.force = force;
    settings.git = git;
    settings.map = map;
    settings.path = name ?? ".";

    if (yes === true) {
      act();
    } else {
      ask();
      act();
    }
  })
  .parse(Deno.args);

function ask() {
  const ts = prompt("Use TypeScript?", "y");

  settings.extension = (ts === "y" || ts === "Y") ? "ts" : "js";

  settings.entrypoint = prompt(
    `Set entrypoint:`,
    `mod.${settings.extension}`,
  ) ?? "mod";

  settings.depsEntrypoint = prompt(
    "Set dependency entrypoint:",
    `deps.${settings.extension}`,
  ) ?? "deps";

  settings.devDepsEntrypoint = prompt(
    "Set dev dependency entrypoint:",
    `dev_deps.${settings.extension}`,
  ) ?? "dev_deps";

  if (!settings.map) {
    const importMap = prompt(
      "Add import map?",
      "n",
    );
    settings.map = (importMap === "y" || importMap === "Y") ? true : false;
  }

  if (!settings.config) {
    const config = prompt(
      "Add Deno configuration file?",
      "n",
    );
    settings.config = (config === "y" || config === "Y") ? true : false;
  }

  if (hasFileExtension(settings.entrypoint, settings.extension) === false) {
    settings.entrypoint = `${settings.entrypoint}.${settings.extension}`;
  }

  if (hasFileExtension(settings.depsEntrypoint, settings.extension) === false) {
    settings.depsEntrypoint =
      `${settings.depsEntrypoint}.${settings.extension}`;
  }

  if (
    hasFileExtension(settings.devDepsEntrypoint, settings.extension) === false
  ) {
    settings.devDepsEntrypoint =
      `${settings.devDepsEntrypoint}.${settings.extension}`;
  }
}
