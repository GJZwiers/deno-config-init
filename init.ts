import { Command } from "./deps.ts";
import { act } from "./act.ts";
import { settings } from "./settings.ts";
import { server } from "./commands/server.ts";
import { tdd } from "./commands/tdd.ts";
import { api } from "./commands/api.ts";
import { cli } from "./commands/cli.ts";

/**
 *
 */
await new Command()
  .name("deno-init")
  .version("0.15.1")
  .description("Start a new Deno project with a single command")
  .option(
    "-c, --cache [cache:boolean]",
    "Cache dependencies as part of the project initialization",
    {
      default: false,
      global: true,
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
  .action(({ cache, force, map, git, name, yes }) => {
    settings.cache = cache;
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
  .command("api", api)
  .command("cli", cli)
  .command("server", server)
  .command("tdd", tdd)
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

  const importMap = prompt(
    "Add import map? (y/n)",
    "n",
  );

  settings.map = (importMap === "y" || importMap === "Y") ? true : false;
}
