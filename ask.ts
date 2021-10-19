import { settings } from "./settings.ts";
import { hasFileExtension } from "./utils.ts";

export function ask() {
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
