import { Command } from "./deps.ts";
import { hasFileExtension } from "./utils.ts";
import { act, settings } from "./act.ts";
import { server } from "./commands/server.ts";
import { tdd } from "./commands/tdd.ts";
import { api } from "./commands/api.ts";
import { cli } from "./commands/cli.ts";
import { editor } from "./types/editor.ts";

const semver = /@[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
const match = import.meta.url.match(semver);

let version = "";
if (match !== null) {
    version = match[0].replace("@", "");
}

/**
 * 
 */
await new Command()
  .name("deno-init")
  .version(version)
  .description("Start a new Deno project with a single command")
  .type("editor", editor)
  .option<{ editor: typeof editor }>(
    "-e, --editor [method:editor]",
    "Choose the editor to configure for.",
    {
      default: "vscode",
      global: true,
    },
  )
  .option(
    "-f, --force [force:boolean]",
    "Force overwrite of existing files/directories. Helpful to re-initialize a project but use with caution!",
    { 
      global: true
    },
  )
  .option(
    "-n, --name [name:string]",
    "Name a new directory to initialize the project in.",
    {
      global: true
    },
  )
  .option("-y, --yes [yes:boolean]", "Answer 'y' to all prompts")
  .action(({ editor, force, name, yes }) => {
    settings.force = force;

    if (yes === true) {
      act(editor, name);
    } else {
      ask();
      act(editor, name);
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

  const addDebug = prompt(
    "Add debug configuration? (y/n)",
    "n",
  );

  settings.extension = (ts === "y" || ts === "Y") ? "ts" : "js";

  // Use 'mod' as entrypoint if none specified.
  if (entrypoint === null) {
    entrypoint = `mod.${settings.extension}`;
  }

  // Add file extension if a user enters 'mod' or 'main' as input.
  if (!hasFileExtension(entrypoint, settings.extension)) {
    entrypoint = `${entrypoint}.${settings.extension}`;
  }

  if (depsEntrypoint === null) {
    depsEntrypoint = `deps.${settings.extension}`;
  }

  if (!hasFileExtension(depsEntrypoint, settings.extension)) {
    depsEntrypoint = `${depsEntrypoint}.${settings.extension}`;
  }

  if (addDebug !== "y" && addDebug !== "Y") {
    settings.debug = (addDebug === null) ? "n" : addDebug;
  }
}
