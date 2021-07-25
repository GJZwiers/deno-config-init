import { Command } from "./deps.ts";
import { hasFileExtension } from "./utils.ts";
import { act } from "./act.ts";
import { settings } from "./settings.ts";
import { server } from "./commands/server.ts";
import { tdd } from "./commands/tdd.ts";
import { api } from "./commands/api.ts";
import { cli } from "./commands/cli.ts";
import { editor } from "./types/editor.ts";

/**
 *
 */
await new Command()
  .name("deno-init")
  .version("0.13.1")
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

  let entrypoint = prompt(`Entrypoint:`, `mod.${settings.extension}`);

  let depsEntrypoint = prompt(
    "Dependency entrypoint:",
    `deps.${settings.extension}`,
  );

  const debugConfig = prompt(
    "Add debug configuration? (y/n)",
    "n",
  );

  settings.extension = (ts === "y" || ts === "Y") ? "ts" : "js";

  // Use 'mod' as entrypoint if none specified.
  if (entrypoint === null) {
    entrypoint = `mod.${settings.extension}`;
  } else if (!hasFileExtension(entrypoint, settings.extension)) {
    // Add file extension if a user enters e.g. 'mod' or 'main' as input.
    entrypoint = `${entrypoint}.${settings.extension}`;
  }

  settings.entrypoint = entrypoint;

  if (depsEntrypoint === null) {
    depsEntrypoint = `deps.${settings.extension}`;
  } else if (!hasFileExtension(depsEntrypoint, settings.extension)) {
    depsEntrypoint = `${depsEntrypoint}.${settings.extension}`;
  }

  settings.depsEntrypoint = depsEntrypoint;

  if (debugConfig === "y" || debugConfig === "Y") {
    settings.debug = "y";
  }
}
