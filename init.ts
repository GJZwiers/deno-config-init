import { Command } from "./deps.ts";
import { act } from "./act.ts";
import { settings } from "./settings.ts";
import { server } from "./commands/server.ts";
import { tdd } from "./commands/tdd.ts";
import { api } from "./commands/api.ts";
import { cli } from "./commands/cli.ts";
import { editor } from "./types/editor.ts";

/* TODO
  - adding editor config should only be an option in the future,
  so that the CLI is decoupled from specific editors/IDEs

  - Add the option to create an import map (import_map.json) through the prompts
*/

/**
 *
 */
await new Command()
  .name("deno-init")
  .version("0.14.0")
  .description("Start a new Deno project with a single command")
  .type("editor", editor)
  .option(
    "-c, --cache [cache:boolean]",
    "Cache dependencies as part of the project initialization",
    {
      default: false,
      global: true,
    },
  )
  .option<{ editor: typeof editor }>(
    "-e, --editor [method:editor]",
    "Choose the editor for which to configure Deno.",
    {
      default: "vscode",
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
  .option("-y, --yes [yes:boolean]", "Answer 'y' to all prompts")
  .action(({ cache, editor, force, git, name, yes }) => {
    settings.cache = cache;
    settings.force = force;
    settings.git = git;
    settings.editor = editor;
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
  const ts = prompt("TypeScript? (y/n)", "y");

  settings.extension = (ts === "y" || ts === "Y") ? "ts" : "js";

  settings.entrypoint = prompt(
    `Entrypoint:`,
    `mod.${settings.extension}`,
  ) ?? "mod";

  settings.depsEntrypoint = prompt(
    "Dependency entrypoint:",
    `deps.${settings.extension}`,
  ) ?? "deps";

  settings.devDepsEntrypoint = prompt(
    "Development dependency entrypoint: (y/n)",
    `dev_deps.${settings.extension}`,
  ) ?? "dev_deps";
}
