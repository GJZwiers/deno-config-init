import { Command } from "./deps.ts";
import { act } from "./act.ts";
import { settings } from "./settings.ts";
import { hasFileExtension } from "./utils.ts";

/**
 *
 */
await new Command()
  .name("deno-init")
  .version("1.0.1")
  .description("Start a new Deno project with a single command")
  .option(
    "-f, --force [force:boolean]",
    "Force overwrite of existing files/directories. Helpful to re-initialize a project but use with caution!",
    {
      global: true,
    },
  )
  .option(
    "-m, --map [map:boolean]",
    "Add an import map as part of the project initialization",
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
    "Name a new directory to initialize the project in.",
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
  .action(({ force, map, git, name, yes }) => {
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
  const ts = prompt("Use TypeScript? (y/n)", "y");

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
      "Add import map? (y/n)",
      "n",
    );
    settings.map = (importMap === "y" || importMap === "Y") ? true : false;
  }

  if (!hasFileExtension(settings.entrypoint, settings.extension)) {
    settings.entrypoint = settings.entrypoint + "." + settings.extension;
  }

  if (!hasFileExtension(settings.depsEntrypoint, settings.extension)) {
    settings.depsEntrypoint = settings.depsEntrypoint + "." +
      settings.extension;
  }

  if (!hasFileExtension(settings.devDepsEntrypoint, settings.extension)) {
    settings.devDepsEntrypoint = settings.devDepsEntrypoint + "." +
      settings.extension;
  }
}
